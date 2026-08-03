import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  Snackbar,
  Switch,
  FormControlLabel,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Chip,
  alpha,
  useTheme,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import BusinessIcon from '@mui/icons-material/Business';
import RefreshIcon from '@mui/icons-material/Refresh';
import { MatnaDataGrid } from '@/components/data-grid/MatnaDataGrid';
import type { Organization, OrganizationFormData } from './UnitAdd.tsx';
import { axiosClient } from '@/lib/axios-client';
import organizationApis from '@/modules/organization-structure/apis';

interface Message {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  text: string;
  duration?: number;
}

const validateOrganizationData = (data: any[]): Organization[] => {
  return (data || []).map((org, index) => {
    // Ensure the organization has a valid ID
    if (
      !org.id ||
      typeof org.id !== 'string' ||
      org.id === '<' ||
      org.id.trim() === ''
    ) {
      console.warn('Invalid organization ID found:', org);
      return {
        ...org,
        id: `org-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      };
    }
    return org;
  });
};

const UnitsList = () => {
  const theme = useTheme();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [filteredOrganizations, setFilteredOrganizations] = useState<
    Organization[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedOrganization, setSelectedOrganization] =
    useState<Organization | null>(null);
  const [editFormData, setEditFormData] = useState<OrganizationFormData | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [searchError, setSearchError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = (
    type: Message['type'],
    text: string,
    duration?: number
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    setMessages(prev => [...prev, { id, type, text, duration }]);
  };

  const removeMessage = (id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  const fetchOrganizations = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get<Organization[]>(
        `${organizationApis.organization.name}/1`
      );

      console.log('API Response:', response.data);
      console.log('First organization:', response.data?.[0]);
      console.log(
        'All IDs:',
        response.data?.map(org => ({ id: org.id, name: org.name }))
      );

      const validatedOrganizations = validateOrganizationData(
        response.data || []
      );

      setOrganizations(validatedOrganizations);
      setFilteredOrganizations(validatedOrganizations);
      addMessage('success', 'لیست یگان‌ها با موفقیت بارگذاری شد');
    } catch (error) {
      console.error('Failed to fetch organizations:', error);
      addMessage('error', 'خطا در بارگذاری لیست یگان‌ها');
    } finally {
      setLoading(false);
    }
  };

  const searchOrganizations = async (name: string) => {
    if (!name.trim()) {
      setFilteredOrganizations(organizations);
      setSearchError(null);
      return;
    }

    setSearchLoading(true);
    setSearchError(null);

    try {
      const response = await axiosClient.get<Organization[]>(
        `${organizationApis.organization.name}/${encodeURIComponent(name)}`
      );

      const validatedResults = validateOrganizationData(response.data || []);

      setFilteredOrganizations(validatedResults);

      if (validatedResults.length === 0) {
        setSearchError('هیچ یگانی با این نام یافت نشد');
        addMessage('info', 'هیچ یگانی با این نام یافت شد');
      } else {
        addMessage(
          'success',
          `${validatedResults.length} یگان با عبارت "${name}" یافت شد`
        );
      }
    } catch (error) {
      console.error('Search failed:', error);
      setSearchError('خطا در جستجو');
      setFilteredOrganizations([]);
      addMessage('error', 'خطا در انجام جستجو');
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      searchOrganizations(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleEdit = (organization: Organization) => {
    setSelectedOrganization(organization);
    setEditFormData({
      name: organization.name,
      code: organization.code,
      active: organization.active,
      parentId: organization.parentId,
    });
    setEditDialogOpen(true);
  };

  const handleDelete = (organization: Organization) => {
    setSelectedOrganization(organization);
    setDeleteDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedOrganization || !editFormData) return;

    try {
      const response = await axiosClient.put<Organization>(
        `${organizationApis.organization.put}`,
        {
          ...selectedOrganization,
          ...editFormData,
        }
      );

      if (response.data) {
        addMessage('success', 'یگان با موفقیت ویرایش گردید!');
        setEditDialogOpen(false);
        fetchOrganizations();
        setSearchTerm('');
      } else {
        throw new Error('خطا در ویرایش یگان');
      }
    } catch (error: any) {
      console.error('Update failed:', error);
      addMessage(
        'error',
        error.response?.data?.message || 'خطا در ویرایش یگان'
      );
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedOrganization) return;

    try {
      const response = await axiosClient.delete(
        `${organizationApis.organization.delete}/${selectedOrganization.id}`
      );

      if (response.status) {
        addMessage('success', 'یگان با موفقیت حذف گردید!');
        setDeleteDialogOpen(false);
        fetchOrganizations();
        setSearchTerm('');
      } else {
        // throw new Error(response.data.message || 'خطا در حذف یگان');
      }
    } catch (error: any) {
      console.error('Delete failed:', error);
      addMessage('error', error.response?.data?.message || 'خطا در حذف یگان');
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchError(null);
    addMessage('info', 'جستجو پاک شد. نمایش همه یگان‌ها');
  };

  const handleRefresh = () => {
    fetchOrganizations();
    addMessage('info', 'در حال بروزرسانی لیست یگان‌ها...');
  };

  const columns = [
    {
      field: 'name',
      headerName: 'عنوان یگان',
      width: 200,
      flex: 1,
      renderCell: (params: any) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <BusinessIcon
            fontSize="small"
            color="primary"
            sx={{ opacity: 0.7 }}
          />
          <Typography variant="body2" fontWeight="medium">
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'code',
      headerName: 'کد یگان',
      width: 120,
      renderCell: (params: any) => (
        <Chip
          label={params.value}
          size="small"
          variant="outlined"
          color="primary"
        />
      ),
    },
    {
      field: 'active',
      headerName: 'وضعیت یگان',
      width: 120,
      renderCell: (params: any) => (
        <Chip
          label={params.value ? 'فعال' : 'غیرفعال'}
          size="small"
          color={params.value ? 'success' : 'default'}
          variant={params.value ? 'filled' : 'outlined'}
        />
      ),
    },
    {
      field: 'parentName',
      headerName: 'یگان والد',
      width: 150,
      flex: 1,
      renderCell: (params: any) =>
        params.value ? (
          <Chip
            label={params.value}
            size="small"
            variant="outlined"
            color="secondary"
          />
        ) : (
          <Typography variant="body2" color="text.secondary" fontStyle="italic">
            ندارد
          </Typography>
        ),
    },
    {
      field: 'actions',
      headerName: 'عملیات',
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params: any) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton
            size="small"
            onClick={() => handleEdit(params.row)}
            color="primary"
            sx={{
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.2),
              },
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDelete(params.row)}
            color="error"
            sx={{
              backgroundColor: alpha(theme.palette.error.main, 0.1),
              '&:hover': {
                backgroundColor: alpha(theme.palette.error.main, 0.2),
              },
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 3 }}>
      {/* Header Card */}
      <Card
        sx={{
          mb: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          boxShadow: theme.shadows[4],
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <BusinessIcon sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  مدیریت یگان‌ها
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  مشاهده، جستجو و مدیریت یگان‌های سازمانی
                </Typography>
              </Box>
            </Box>
            <IconButton
              onClick={handleRefresh}
              sx={{
                color: 'white',
                backgroundColor: alpha('#fff', 0.2),
                '&:hover': {
                  backgroundColor: alpha('#fff', 0.3),
                },
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Box>
        </CardContent>
      </Card>

      {/* Search Card */}
      <Card sx={{ mb: 3, boxShadow: theme.shadows[2] }}>
        <CardContent>
          <TextField
            fullWidth
            label="جستجو بر اساس نام یگان"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="نام یگان را وارد کنید..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {searchLoading && (
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        border: `2px solid ${theme.palette.primary.main}`,
                        borderRightColor: 'transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                      }}
                    />
                  )}
                  {searchTerm && !searchLoading && (
                    <IconButton onClick={handleClearSearch} size="small">
                      <ClearIcon />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
            helperText={searchError || ' '}
            error={!!searchError}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
        </CardContent>
      </Card>

      {/* Results Card */}
      <Card sx={{ boxShadow: theme.shadows[2] }}>
        <CardContent>
          {/* Results Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip
                label={filteredOrganizations.length}
                color="primary"
                variant="filled"
                sx={{ fontWeight: 'bold' }}
              />
              <Typography variant="h6" fontWeight="medium">
                یگان یافت شد
                {searchTerm && (
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.secondary"
                    sx={{ mr: 1 }}
                  >
                    برای "{searchTerm}"
                  </Typography>
                )}
              </Typography>
            </Box>
          </Box>

          {/* Data Grid */}
          <MatnaDataGrid
            rows={filteredOrganizations}
            columns={columns}
            loading={loading || searchLoading}
            height={400}
            getRowId={(row: Organization) => row.id}
            sx={{
              border: 'none',
              '& .MuiDataGrid-cell': {
                borderBottom: `1px solid ${theme.palette.divider}`,
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: theme.palette.grey[50],
                borderBottom: `2px solid ${theme.palette.primary.main}`,
              },
            }}
          />
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: 'white',
            fontWeight: 'bold',
          }}
        >
          ویرایش یگان
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {editFormData && (
            <Box sx={{ pt: 1 }}>
              <TextField
                fullWidth
                label="عنوان یگان"
                value={editFormData.name}
                onChange={e =>
                  setEditFormData(prev =>
                    prev ? { ...prev, name: e.target.value } : null
                  )
                }
                margin="normal"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="کد یگان"
                value={editFormData.code}
                onChange={e =>
                  setEditFormData(prev =>
                    prev ? { ...prev, code: e.target.value } : null
                  )
                }
                margin="normal"
                sx={{ mb: 2 }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={editFormData.active}
                    onChange={e =>
                      setEditFormData(prev =>
                        prev ? { ...prev, active: e.target.checked } : null
                      )
                    }
                    color="primary"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={editFormData.active ? 'فعال' : 'غیرفعال'}
                      size="small"
                      color={editFormData.active ? 'success' : 'default'}
                    />
                  </Box>
                }
                sx={{ mt: 2 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setEditDialogOpen(false)}
            variant="outlined"
            color="inherit"
          >
            انصراف
          </Button>
          <Button
            onClick={handleUpdate}
            variant="contained"
            startIcon={<EditIcon />}
          >
            بروزرسانی
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: theme.palette.error.main,
            color: 'white',
            fontWeight: 'bold',
          }}
        >
          تایید حذف
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <BusinessIcon color="error" />
            <Typography variant="h6" fontWeight="medium">
              {selectedOrganization?.name}
            </Typography>
          </Box>
          <Typography>
            آیا از حذف این یگان اطمینان دارید؟ این عمل غیرقابل بازگشت است.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            color="inherit"
          >
            انصراف
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
          >
            حذف یگان
          </Button>
        </DialogActions>
      </Dialog>

      {/* Multiple Message Snackbars */}
      {messages.map((message, index) => (
        <Snackbar
          key={message.id}
          open={true}
          autoHideDuration={message.duration || 6000}
          onClose={() => removeMessage(message.id)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          sx={{
            bottom: `${index * 70 + 20}px !important`,
            transition: 'all 0.3s ease-in-out',
          }}
        >
          <Alert
            onClose={() => removeMessage(message.id)}
            severity={message.type}
            sx={{
              width: '100%',
              boxShadow: theme.shadows[3],
              borderRadius: 2,
              alignItems: 'center',
            }}
            iconMapping={{
              success: <BusinessIcon />,
              error: <BusinessIcon />,
              warning: <BusinessIcon />,
              info: <BusinessIcon />,
            }}
          >
            <Typography variant="body2" fontWeight="medium">
              {message.text}
            </Typography>
          </Alert>
        </Snackbar>
      ))}

      {/* Global Styles for loading animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </Box>
  );
};

export default UnitsList;
