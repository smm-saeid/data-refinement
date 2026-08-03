// RoleUsersTable.tsx - Completely Fixed
import { useState, useEffect } from 'react';
import type { GridColDef } from '@mui/x-data-grid';
import {
  Box,
  Button,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useKeycloakApiPost } from '../../../../hooks/useApiKeycloak';
import { MatnaDataGrid } from '../../../../components/data-grid/MatnaDataGrid';
import keycloakApis from '../../apis';
import type { UserWithRoles, Role, RemoveRoleVariables } from '../../types';

interface RoleUsersTableProps {
  users: UserWithRoles[];
  loading: boolean;
  availableRoles: Role[];
  onOperationSuccess: (message: string) => void;
  refreshTrigger: number;
  paginationModel?: { page: number; pageSize: number };
  onPaginationChange?: (model: any) => void;
  rowCount?: number;
}

export function RoleUsersTable({
  users,
  loading,
  availableRoles,
  onOperationSuccess,
  refreshTrigger,
  paginationModel = { page: 0, pageSize: 10 },
  onPaginationChange,
  rowCount = 0,
}: RoleUsersTableProps) {
  const [removingUser, setRemovingUser] = useState<string | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<Record<string, string>>(
    {}
  );
  const [removeError, setRemoveError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [localUsers, setLocalUsers] = useState<UserWithRoles[]>([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingRemoval, setPendingRemoval] = useState<{
    userId: string;
    roleName: string;
    userDisplayName: string;
    roleDescription: string;
  } | null>(null);

  // Sync local users with props - FIXED: Remove refreshTrigger dependency
  useEffect(() => {
    console.log(
      '🔄 RoleUsersTable: Updating local users from props',
      users.length
    );
    setLocalUsers(users || []);
  }, [users]); // ONLY depend on users

  const deleteMutation = useKeycloakApiPost<any, RemoveRoleVariables>(
    keycloakApis.user.removeRole,
    {
      onSuccess: (_, variables) => {
        const roleDescription =
          pendingRemoval?.roleDescription || variables.searchModel.roleName;
        const successMsg = `نقش "${roleDescription}" با موفقیت حذف شد`;

        setSuccessMessage(successMsg);
        setRemovingUser(null);
        setRemoveError(null);
        setConfirmDialogOpen(false);
        setPendingRemoval(null);

        // FIXED: Update local state immediately for better UX
        const updatedUsers = localUsers.map(userWithRoles => {
          if (userWithRoles.user.id === variables.searchModel.userId) {
            return {
              ...userWithRoles,
              roles: userWithRoles.roles.filter(
                role => role.name !== variables.searchModel.roleName
              ),
            };
          }
          return userWithRoles;
        });

        setLocalUsers(updatedUsers);

        // Reset selected role for this user
        setSelectedRoles(prev => ({
          ...prev,
          [variables.searchModel.userId]: '',
        }));

        // Notify parent to refresh data from server (for consistency)
        onOperationSuccess(successMsg);

        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      },
      onError: (error: any) => {
        const errorMsg =
          error?.response?.data?.message || 'خطای ناشناخته در حذف نقش';
        setRemoveError(errorMsg);
        setRemovingUser(null);
        setConfirmDialogOpen(false);
        setPendingRemoval(null);
      },
    }
  );

  const handleRemoveRoleClick = (
    userId: string,
    roleName: string,
    userDisplayName: string
  ) => {
    if (!selectedRoles[userId]) {
      setRemoveError('لطفاً ابتدا یک نقش برای حذف انتخاب کنید');
      return;
    }

    // Find role description for better confirmation message
    const user = localUsers.find(u => u.user.id === userId);
    const roleToRemove = user?.roles.find(r => r.name === roleName);
    const roleDescription = roleToRemove?.description || roleName;

    setPendingRemoval({
      userId,
      roleName,
      userDisplayName,
      roleDescription,
    });
    setConfirmDialogOpen(true);
  };

  const confirmRemoveRole = async () => {
    if (!pendingRemoval) return;

    const { userId, roleName } = pendingRemoval;
    setRemovingUser(userId);
    setRemoveError(null);

    try {
      await deleteMutation.mutateAsync({
        paginationModel: {},
        searchModel: {
          roleName,
          userId,
        },
      });
    } catch (error) {
      console.error('Remove role error:', error);
    }
  };

  const cancelRemoveRole = () => {
    setConfirmDialogOpen(false);
    setPendingRemoval(null);
    setRemoveError(null);
  };

  const handleRoleSelect = (userId: string, roleName: string) => {
    setSelectedRoles(prev => ({
      ...prev,
      [userId]: roleName,
    }));
  };

  const handleCloseError = () => {
    setRemoveError(null);
  };

  const handleCloseSuccess = () => {
    setSuccessMessage(null);
  };

  const getUserDisplayName = (user: UserWithRoles): string => {
    const firstName = user.user.firstName || '';
    const lastName = user.user.lastName || '';
    const username = user.user.username || '';
    return `${firstName} ${lastName}`.trim() || username || 'کاربر ناشناس';
  };

  const columns: GridColDef<UserWithRoles>[] = [
    {
      field: 'rowIndex',
      headerName: 'ردیف',
      flex: 0.2,
      renderCell: params => {
        const page = paginationModel.page;
        const pageSize = paginationModel.pageSize;
        return (
          page * pageSize +
          params.api.getRowIndexRelativeToVisibleRows(params.id) +
          1
        );
      },
    },
    {
      field: 'username',
      headerName: 'نام کاربری',
      flex: 1,
      valueGetter: (_, row) => row?.user?.username || 'نامشخص',
    },
    {
      field: 'firstName',
      headerName: 'نام',
      flex: 1,
      valueGetter: (_, row) => row?.user?.firstName || 'نامشخص',
    },
    {
      field: 'lastName',
      headerName: 'نام خانوادگی',
      flex: 1,
      valueGetter: (_, row) => row?.user?.lastName || 'نامشخص',
    },
    {
      field: 'personnelCode',
      headerName: 'شماره پرسنلی',
      flex: 0.7,
      valueGetter: (_, row) =>
        row?.user?.attributes?.personnel_code?.[0] || 'نامشخص',
    },
    {
      field: 'unitCode',
      headerName: 'کد یگان',
      flex: 0.5,
      valueGetter: (_, row) =>
        row?.user?.attributes?.unit_code?.[0] || 'نامشخص',
    },
    {
      field: 'roles',
      headerName: 'نقش‌ها',
      flex: 1.5,
      renderCell: params => (
        <Box sx={{ py: 1 }}>
          {params.row?.roles?.map((role, index) => (
            <Box
              key={role?.id || index}
              component="span"
              sx={{
                display: 'inline-block',
                mr: 1,
                mb: 0.5,
              }}
            >
              <span style={{ fontWeight: 'bold', color: '#d32f2f' }}>•</span>{' '}
              {role?.description || role?.name || 'نامشخص'}
            </Box>
          )) || 'هیچ نقشی ندارد'}
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: 'عملیات',
      flex: 1.5,
      renderCell: params => (
        <RoleTableActionButtons
          userWithRoles={params.row}
          selectedRole={selectedRoles[params.row?.user?.id] || ''}
          onRoleSelect={handleRoleSelect}
          onRemoveRole={handleRemoveRoleClick}
          removingUser={removingUser}
          getUserDisplayName={getUserDisplayName}
        />
      ),
    },
  ];

  const rows = localUsers
    .filter(user => user?.user?.id)
    .map(user => ({
      id: user.user.id,
      ...user,
    }));

  console.log('📊 RoleUsersTable rendering:', {
    rowsCount: rows.length,
    localUsersCount: localUsers.length,
    propsUsersCount: users.length,
    paginationModel,
    rowCount,
    loading,
  });

  return (
    <Box>
      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={cancelRemoveRole}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">تأیید حذف نقش</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            آیا از حذف نقش "
            <strong style={{ color: '#d32f2f' }}>
              {pendingRemoval?.roleDescription}
            </strong>
            " از کاربر "<strong>{pendingRemoval?.userDisplayName}</strong>"
            مطمئن هستید؟
            <br />
            <strong style={{ color: '#d32f2f', fontSize: '0.9rem' }}>
              این عمل قابل بازگشت نیست.
            </strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ gap: 1, p: 2 }}>
          <Button
            onClick={cancelRemoveRole}
            color="primary"
            variant="outlined"
            disabled={deleteMutation.isPending}
          >
            انصراف
          </Button>
          <Button
            onClick={confirmRemoveRole}
            color="error"
            variant="contained"
            disabled={deleteMutation.isPending}
            startIcon={<DeleteIcon />}
          >
            {deleteMutation.isPending ? 'در حال حذف...' : 'حذف نقش'}
          </Button>
        </DialogActions>
      </Dialog>

      {removeError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={handleCloseError}>
          {removeError}
        </Alert>
      )}

      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={handleCloseSuccess} variant="filled">
          {successMessage}
        </Alert>
      </Snackbar>

      <MatnaDataGrid
        rows={rows}
        columns={columns}
        loading={loading || deleteMutation.isPending}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationChange}
        rowCount={rowCount}
        paginationMode="server"
        pageSizeOptions={[10, 25, 50]}
        sx={{
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid #f0f0f0',
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: '#fafafa',
          },
        }}
      />
    </Box>
  );
}

// Action Buttons component
function RoleTableActionButtons({
  userWithRoles,
  selectedRole,
  onRoleSelect,
  onRemoveRole,
  removingUser,
  getUserDisplayName,
}: {
  userWithRoles: UserWithRoles;
  selectedRole: string;
  onRoleSelect: (userId: string, roleName: string) => void;
  onRemoveRole: (
    userId: string,
    roleName: string,
    userDisplayName: string
  ) => void;
  removingUser: string | null;
  getUserDisplayName: (user: UserWithRoles) => string;
}) {
  if (!userWithRoles?.user) {
    return null;
  }

  const roles = userWithRoles.roles || [];
  const userDisplayName = getUserDisplayName(userWithRoles);

  // اگر کاربر فقط یک نقش دارد، دکمه حذف نمایش داده نمی‌شود
  if (roles.length <= 1) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ px: 1 }}>
        امکان حذف نقش وجود ندارد
      </Typography>
    );
  }

  const handleRemove = () => {
    if (selectedRole) {
      onRemoveRole(userWithRoles.user.id, selectedRole, userDisplayName);
    }
  };

  return (
    <Box
      display="flex"
      gap={1}
      alignItems="center"
      flexWrap="wrap"
      sx={{ py: 1 }}
    >
      <Select
        value={selectedRole}
        onChange={e => onRoleSelect(userWithRoles.user.id, e.target.value)}
        size="small"
        displayEmpty
        sx={{ minWidth: 140 }}
      >
        <MenuItem value="" disabled>
          انتخاب نقش برای حذف
        </MenuItem>
        {roles.map(role => (
          <MenuItem key={role.name} value={role.name}>
            {role.description || role.name}
          </MenuItem>
        ))}
      </Select>

      <Button
        variant="outlined"
        color="error"
        size="small"
        onClick={handleRemove}
        disabled={!selectedRole || removingUser === userWithRoles.user.id}
        startIcon={<DeleteIcon />}
        sx={{ whiteSpace: 'nowrap' }}
      >
        {removingUser === userWithRoles.user.id ? 'در حال حذف...' : 'حذف'}
      </Button>
    </Box>
  );
}
