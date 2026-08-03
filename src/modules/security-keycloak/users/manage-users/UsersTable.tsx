import { useState } from 'react';
import type { GridColDef } from '@mui/x-data-grid';
import {
  Box,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  VpnKey as ResetPasswordIcon,
} from '@mui/icons-material';
import { useApiMutation } from '@/hooks/useApi';
import { MatnaDataGrid } from '../../../../components/data-grid/MatnaDataGrid';
import keycloakApis from '../../apis';
import type { UserWithRoles, User } from '../../types';

interface UsersTableProps {
  data: UserWithRoles[];
  loading: boolean;
  onEdit: (user: User) => void;
  onView: (user: UserWithRoles) => void;
  onSuccess: () => void;
  paginationModel: { page: number; pageSize: number };
  onPaginationChange: (model: any) => void;
  rowCount: number;
}

export function UsersTable({
  data,
  loading,
  onEdit,
  onView,
  onSuccess,
  paginationModel,
  onPaginationChange,
  rowCount,
}: UsersTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const deleteMutation = useApiMutation<any, any>({
    url: keycloakApis.user.delete,
    method: 'POST',
    onSuccess: () => {
      onSuccess();
      setDeleteDialogOpen(false);
      setSelectedUser(null);
    },
  });

  const resetPasswordMutation = useApiMutation<any, any>({
    url: keycloakApis.user.resetPassword,
    method: 'POST',
    onSuccess: () => {
      onSuccess();
      setResetPasswordDialogOpen(false);
      setSelectedUser(null);
    },
  });

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleResetPassword = (user: User) => {
    setSelectedUser(user);
    setResetPasswordDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedUser) {
      await deleteMutation.mutateAsync({
        paginationModel: {},
        searchModel: { userId: selectedUser.id },
      });
    }
  };

  const confirmResetPassword = async () => {
    if (selectedUser) {
      await resetPasswordMutation.mutateAsync({
        paginationModel: {},
        searchModel: {
          userId: selectedUser.id,
          password: 'Temp123!', // Default temporary password
          temporary: true,
        },
      });
    }
  };

  const columns: GridColDef<UserWithRoles>[] = [
    {
      field: 'rowIndex',
      headerName: 'ردیف',
      flex: 0.5,
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
      field: 'firstName',
      headerName: 'نام',
      flex: 1,
      valueGetter: (_, row) => row.user.firstName || 'نامشخص',
    },
    {
      field: 'lastName',
      headerName: 'نام خانوادگی',
      flex: 1,
      valueGetter: (_, row) => row.user.lastName || 'نامشخص',
    },
    {
      field: 'username',
      headerName: 'نام کاربری',
      flex: 1,
      valueGetter: (_, row) => row.user.username,
    },
    {
      field: 'nationalityCode',
      headerName: 'کد ملی',
      flex: 1,
      valueGetter: (_, row) =>
        row.user.attributes?.nationalityCode?.[0] || '---',
    },
    {
      field: 'status',
      headerName: 'وضعیت',
      flex: 0.8,
      renderCell: params => (
        <Chip
          label={params.row.user.enabled ? 'فعال' : 'غیرفعال'}
          color={params.row.user.enabled ? 'success' : 'error'}
          size="small"
        />
      ),
    },
    {
      field: 'roles',
      headerName: 'نقش کاربر',
      flex: 1.5,
      renderCell: params => (
        <Box display="flex" gap={0.5} flexWrap="wrap">
          {params.row.roles.map(role => (
            <Chip
              key={role.id}
              label={role.name}
              color="primary"
              size="small"
              variant="outlined"
            />
          ))}
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: 'عملیات',
      flex: 1.2,
      renderCell: params => (
        <ActionButtons
          userWithRoles={params.row}
          onEdit={onEdit}
          onView={onView}
          onDelete={handleDelete}
          onResetPassword={handleResetPassword}
          loading={deleteMutation.isPending || resetPasswordMutation.isPending}
        />
      ),
    },
  ];

  // Transform data for MatnaDataGrid
  const rows = data.map((userWithRoles, index) => ({
    id: userWithRoles.user.id,
    ...userWithRoles,
  }));

  return (
    <Box>
      {(deleteMutation.isError || resetPasswordMutation.isError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {deleteMutation.error?.response?.data?.message ||
            resetPasswordMutation.error?.response?.data?.message ||
            'خطا در انجام عملیات'}
        </Alert>
      )}

      <MatnaDataGrid
        rows={rows}
        columns={columns}
        loading={
          loading || deleteMutation.isPending || resetPasswordMutation.isPending
        }
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationChange}
        rowCount={rowCount}
        paginationMode="server"
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>تایید حذف کاربر</DialogTitle>
        <DialogContent>
          <DialogContentText>
            آیا از حذف کاربر <strong>{selectedUser?.username}</strong> اطمینان
            دارید؟ این عمل غیرقابل بازگشت است.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>انصراف</Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'در حال حذف...' : 'حذف کاربر'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reset Password Confirmation Dialog */}
      <Dialog
        open={resetPasswordDialogOpen}
        onClose={() => setResetPasswordDialogOpen(false)}
      >
        <DialogTitle>بازنشانی رمز عبور</DialogTitle>
        <DialogContent>
          <DialogContentText>
            آیا از بازنشانی رمز عبور کاربر{' '}
            <strong>{selectedUser?.username}</strong> اطمینان دارید؟ رمز عبور
            جدید: <code>Temp123!</code>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetPasswordDialogOpen(false)}>
            انصراف
          </Button>
          <Button
            onClick={confirmResetPassword}
            color="primary"
            variant="contained"
            disabled={resetPasswordMutation.isPending}
          >
            {resetPasswordMutation.isPending
              ? 'در حال پردازش...'
              : 'بازنشانی رمز عبور'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

interface ActionButtonsProps {
  userWithRoles: UserWithRoles;
  onEdit: (user: User) => void;
  onView: (user: UserWithRoles) => void;
  onDelete: (user: User) => void;
  onResetPassword: (user: User) => void;
  loading: boolean;
}

function ActionButtons({
  userWithRoles,
  onEdit,
  onView,
  onDelete,
  onResetPassword,
  loading,
}: ActionButtonsProps) {
  return (
    <Box display="flex" gap={0.5}>
      <Tooltip title="مشاهده جزئیات">
        <IconButton
          size="small"
          color="info"
          onClick={() => onView(userWithRoles)}
          disabled={loading}
        >
          <ViewIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="ویرایش کاربر">
        <IconButton
          size="small"
          color="primary"
          onClick={() => onEdit(userWithRoles.user)}
          disabled={loading}
        >
          <EditIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="بازنشانی رمز عبور">
        <IconButton
          size="small"
          color="warning"
          onClick={() => onResetPassword(userWithRoles.user)}
          disabled={loading}
        >
          <ResetPasswordIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="حذف کاربر">
        <IconButton
          size="small"
          color="error"
          onClick={() => onDelete(userWithRoles.user)}
          disabled={loading}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
