// components/ProvinceOrganizationsSelector.tsx
import { MatnaDataGrid } from '@/components/data-grid/MatnaDataGrid';
import { useLegacyApi } from '@/hooks/useLegacyApi';
import {
  Button,
  DialogContent,
  DialogTitle,
  Typography,
  DialogActions,
  Box,
  Pagination,
  Chip,
  Alert,
  Paper,
  IconButton,
  Tooltip,
  LinearProgress,
  Stack,
  Avatar,
  Badge,
} from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import ApartmentIcon from '@mui/icons-material/Apartment';
import { useTheme } from '@mui/material/styles';

interface ProvinceOrganizationsSelectorProps {
  annualPlanInspectionId: string;
  selectedProvinceId: number | null;
  selectedProvinceName: string | null;
  onClose: () => void;
  type: string;
  year?: number;
}

interface OrganizationUnit {
  id: string;
  name: string;
  inspectionId: string;
  hasProvincialInspection: boolean;
  code?: string;
  type?: string;
  parentName?: string;
}

const ProvinceOrganizationsSelector = ({
  annualPlanInspectionId,
  selectedProvinceId,
  selectedProvinceName,
  onClose,
  type,
  year,
}: ProvinceOrganizationsSelectorProps) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const legacyApi = useLegacyApi();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [refreshKey, setRefreshKey] = useState(0);

  // دریافت لیست یگان‌ها - با پارامترها در URL
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: [
      `provincial-inspection/org-units`,
      annualPlanInspectionId,
      selectedProvinceId,
      page,
      pageSize,
      refreshKey,
    ],
    queryFn: () => {
      // ساخت URL با پارامترها
      const url = `provincial-inspection/org-units?annual-plan-inspection-id=${annualPlanInspectionId}&province-id=${selectedProvinceId}&currentPage=${page}&pageSize=${pageSize}`;
      console.log('Fetching URL:', url);
      return legacyApi.get(url);
    },
    select: res => {
      console.log('Response:', res);
      return {
        content: res.data?.content || [],
        totalPages: res.data?.totalPages || 0,
        totalElements: res.data?.totalElements || 0,
        currentPage: res.data?.pageable?.pageNumber || 0,
      };
    },
    enabled: !!selectedProvinceId && !!annualPlanInspectionId,
  });

  // بازنشانی صفحه هنگام تغییر استان
  useEffect(() => {
    setPage(0);
  }, [selectedProvinceId]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value - 1); // MUI Pagination is 1-based, API is 0-based
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleSelectUnit = (
    orgId: string,
    orgName: string,
    inspectionId: string,
    hasInspection: boolean
  ) => {
    navigate(
      `/operation/commander/visit/steps/${selectedProvinceId}/${orgId}/${type}/${annualPlanInspectionId}`,
      {
        state: {
          orgName,
          provinceName: selectedProvinceName,
          inspectionId: inspectionId,
          initialStep: 0,
          hasExistingInspection: hasInspection,
        },
      }
    );
    onClose();
  };

  const getStatusChip = (hasInspection: boolean) => {
    return hasInspection ? (
      <Chip
        icon={<CheckCircleIcon />}
        label="بازدید شده"
        size="small"
        color="success"
        variant="filled"
        sx={{
          fontWeight: 500,
          '& .MuiChip-icon': {
            color: 'white',
            fontSize: 18,
          },
        }}
      />
    ) : (
      <Chip
        icon={<RadioButtonUncheckedIcon />}
        label="بازدید نشده"
        size="small"
        color="default"
        variant="outlined"
        sx={{
          fontWeight: 500,
          borderColor: theme.palette.grey[400],
        }}
      />
    );
  };

  const getActionButton = (row: OrganizationUnit) => {
    const buttonText = row.hasProvincialInspection
      ? 'ادامه ویرایش'
      : 'شروع بازدید';
    const buttonColor = row.hasProvincialInspection ? 'info' : 'primary';
    const buttonVariant = row.hasProvincialInspection
      ? 'outlined'
      : 'contained';
    const startIcon = row.hasProvincialInspection ? (
      <EditIcon />
    ) : (
      <PlayArrowIcon />
    );

    return (
      <Tooltip
        title={
          row.hasProvincialInspection
            ? 'ویرایش بازدید موجود'
            : 'شروع بازدید جدید'
        }
      >
        <Button
          onClick={() =>
            handleSelectUnit(
              row.id,
              row.name,
              row.inspectionId,
              row.hasProvincialInspection
            )
          }
          variant={buttonVariant}
          color={buttonColor}
          size="small"
          startIcon={startIcon}
          sx={{
            minWidth: 110,
            fontWeight: 500,
            ...(row.hasProvincialInspection && {
              '&:hover': {
                backgroundColor: theme.palette.info.light,
                color: 'white',
              },
            }),
          }}
        >
          {buttonText}
        </Button>
      </Tooltip>
    );
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'نام یگان',
      flex: 3,
      minWidth: 250,
      renderCell: params => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: theme.palette.primary.light,
              fontSize: '0.875rem',
            }}
          >
            {params.row.name?.charAt(0) || 'ی'}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={500}>
              {params.row.name}
            </Typography>
            {params.row.code && (
              <Typography variant="caption" color="text.secondary">
                کد: {params.row.code}
              </Typography>
            )}
          </Box>
        </Box>
      ),
    },
    // {
    //   field: 'type',
    //   headerName: 'نوع یگان',
    //   flex: 1.5,
    //   minWidth: 120,
    //   renderCell: params => (
    //     <Chip
    //       label={params.row.type || 'نامشخص'}
    //       size="small"
    //       variant="outlined"
    //       sx={{ fontSize: '0.75rem' }}
    //     />
    //   ),
    // },
    // {
    //   field: 'parentName',
    //   headerName: 'یگان بالادست',
    //   flex: 1.5,
    //   minWidth: 150,
    //   renderCell: params => (
    //     <Typography variant="body2" color="text.secondary">
    //       {params.row.parentName || '-'}
    //     </Typography>
    //   ),
    // },
    {
      field: 'status',
      headerAlign: 'center',
      headerName: 'وضعیت بازدید',
      flex: 1.2,
      minWidth: 120,
      align: 'center',
      renderCell: ({ row }) => getStatusChip(row.hasProvincialInspection),
    },
    {
      headerAlign: 'center',
      field: 'action',
      headerName: 'عملیات',
      flex: 1.2,
      minWidth: 130,
      align: 'center',
      sortable: false,
      renderCell: ({ row }) => getActionButton(row),
    },
  ];

  // عنوان براساس نوع بازدید
  const getDialogTitle = () => {
    const baseTitle = `لیست یگان‌های استان ${selectedProvinceName || ''}`;
    if (year) {
      return `${baseTitle} - سال ${year}`;
    }
    return baseTitle;
  };

  // رنگ header براساس نوع بازدید
  const getHeaderColor = () => {
    switch (type) {
      case 'PROVINCIAL_PISH_BAZDID':
        return theme.palette.warning.main;
      case 'PROVINCIAL_BAZDID_FARMANDEHI':
        return theme.palette.success.main;
      default:
        return theme.palette.primary.main;
    }
  };

  return (
    <>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid',
          borderColor: 'divider',
          pb: 2,
          bgcolor: getHeaderColor(),
          color: 'white',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ApartmentIcon />
          <Box>
            <Typography variant="h6" component="span" fontWeight={600}>
              {getDialogTitle()}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
              برای شروع فرآیند بازرسی، یکی از یگان‌ها را انتخاب کنید
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="به‌روزرسانی">
            <IconButton
              onClick={handleRefresh}
              size="small"
              sx={{ color: 'white' }}
              disabled={isFetching}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ minHeight: 500, p: 0 }}>
        {isLoading && (
          <Box sx={{ width: '100%', p: 4, textAlign: 'center' }}>
            <LinearProgress sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              در حال بارگذاری لیست یگان‌ها...
            </Typography>
          </Box>
        )}

        {error && (
          <Box sx={{ p: 3 }}>
            <Alert
              severity="error"
              action={
                <Button color="inherit" size="small" onClick={() => refetch()}>
                  تلاش مجدد
                </Button>
              }
            >
              خطا در دریافت لیست یگان‌ها. لطفاً دوباره تلاش کنید.
            </Alert>
          </Box>
        )}

        {!isLoading && !error && (
          <Box sx={{ height: 450, width: '100%' }}>
            <MatnaDataGrid
              rows={data?.content || []}
              columns={columns}
              getRowId={row => row.id}
              paginationMode="server"
              loading={isFetching}
              rowCount={data?.totalElements || 0}
              pageSizeOptions={[10, 25, 50]}
              paginationModel={{
                page: page,
                pageSize: pageSize,
              }}
              onPaginationModelChange={model => {
                setPage(model.page);
                setPageSize(model.pageSize);
              }}
              disableRowSelectionOnClick
              sx={{
                border: 'none',
                '& .MuiDataGrid-cell': {
                  fontSize: '0.9rem',
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: theme.palette.grey[50],
                  fontSize: '0.95rem',
                  fontWeight: 600,
                },
              }}
              slots={{
                noRowsOverlay: () => (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      p: 3,
                    }}
                  >
                    <ApartmentIcon
                      sx={{ fontSize: 48, color: 'grey.400', mb: 2 }}
                    />
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      gutterBottom
                    >
                      هیچ یگانی یافت نشد
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      align="center"
                    >
                      برای این استان هیچ یگانی تعریف نشده است
                    </Typography>
                  </Box>
                ),
              }}
            />
          </Box>
        )}

        {/* نمایش آمار */}
        {data && data.totalElements > 0 && (
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mt: 2,
              bgcolor: 'grey.50',
              borderRadius: 1,
              mx: 2,
            }}
          >
            <Stack direction="row" spacing={3} justifyContent="space-around">
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="primary.main" fontWeight={600}>
                  {data.totalElements}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  کل یگان‌ها
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="success.main" fontWeight={600}>
                  {data.content?.filter(
                    (item: OrganizationUnit) => item.hasProvincialInspection
                  ).length || 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  بازدید شده
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="warning.main" fontWeight={600}>
                  {data.content?.filter(
                    (item: OrganizationUnit) => !item.hasProvincialInspection
                  ).length || 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  بازدید نشده
                </Typography>
              </Box>
            </Stack>
          </Paper>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          justifyContent: 'space-between',
          px: 3,
          py: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Badge
            badgeContent={data?.totalElements || 0}
            color="primary"
            max={999}
          >
            <Typography variant="body2" color="text.secondary">
              تعداد کل یگان‌ها:
            </Typography>
          </Badge>

          {data && data.totalPages > 0 && (
            <Typography variant="body2" color="text.secondary">
              صفحه {page + 1} از {data.totalPages}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {data && data.totalPages > 1 && (
            <Pagination
              count={data.totalPages}
              page={page + 1}
              onChange={handlePageChange}
              color="primary"
              size="medium"
              showFirstButton
              showLastButton
              siblingCount={1}
              boundaryCount={1}
            />
          )}

          <Button
            onClick={onClose}
            variant="outlined"
            color="inherit"
            size="medium"
          >
            بستن
          </Button>
        </Box>
      </DialogActions>
    </>
  );
};

export default ProvinceOrganizationsSelector;