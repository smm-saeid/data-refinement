import { useState, useEffect } from 'react';
import type { GridColDef } from '@mui/x-data-grid';
import { Box, Button, Select, MenuItem, Alert } from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useKeycloakApiPost } from '../../../../hooks/useApiKeycloak';
import { useNotification } from '../../NotificationContext';
import { MatnaDataGrid } from '../../../../components/data-grid/MatnaDataGrid';
import keycloakApis from '../../apis';
import type {
  UserWithRoles,
  Role,
  UserRoleTableProps,
  ActionButtonsProps,
  RemoveRoleVariables,
} from '../../types';

interface ExtendedUserRoleTableProps extends UserRoleTableProps {
  refreshTrigger?: number;
}

export function UserRoleTable({
  users,
  loading,
  availableRoles,
  onEdit,
  onSuccess,
  refreshTrigger = 0,
  paginationModel = { page: 0, pageSize: 10 },
  onPaginationChange,
  rowCount = 0,
}: ExtendedUserRoleTableProps) {
  const [removingUser, setRemovingUser] = useState<string | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<Record<string, string>>(
    {}
  );
  const [removeError, setRemoveError] = useState<string | null>(null);
  const [localUsers, setLocalUsers] = useState<UserWithRoles[]>([]);
  const { showNotification } = useNotification();

  useEffect(() => {
    console.log('🔄 UserRoleTable: Users prop changed:', users);
    if (users) {
      setLocalUsers(users);
    } else {
      setLocalUsers([]);
    }
  }, [users, refreshTrigger]);

  const deleteMutation = useKeycloakApiPost<any, RemoveRoleVariables>(
    keycloakApis.user.removeRole,
    {
      onSuccess: (_, variables) => {
        showNotification('نقش با موفقیت حذف شد');


        updateLocalUserData(
          variables.searchModel.userId,
          variables.searchModel.roleName
        );

        setRemovingUser(null);
        setRemoveError(null);

 
        onSuccess();

        setTimeout(() => {
          setRemoveError(null);
        }, 3000);
      },
      onError: (error: any) => {
        const errorMessage =
          error?.response?.data?.message || 'خطای ناشناخته در حذف نقش';
        setRemoveError(errorMessage);
        showNotification(errorMessage, 'error');
        setRemovingUser(null);
      },
    }
  );

  const updateLocalUserData = (userId: string, removedRoleName: string) => {
    setLocalUsers(prevUsers =>
      prevUsers.map(userWithRoles => {
        if (userWithRoles.user.id === userId) {
          const updatedRoles = userWithRoles.roles.filter(
            role => role.name !== removedRoleName
          );
          console.log('🔄 Updated user roles:', updatedRoles);
          return {
            ...userWithRoles,
            roles: updatedRoles,
          };
        }
        return userWithRoles;
      })
    );
  };

  const handleRemoveRole = async (userId: string, roleName: string) => {
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

  const handleRoleSelect = (userId: string, roleName: string) => {
    setSelectedRoles(prev => ({
      ...prev,
      [userId]: roleName,
    }));
  };

  const handleCloseError = () => {
    setRemoveError(null);
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
        <Box>
          {params.row?.roles?.map((role, index) => (
            <span key={role?.id || index}>
              <span style={{ fontWeight: 'bold', color: 'red' }}>•</span>{' '}
              {role?.description || role?.name || 'نامشخص'}
              {index < (params.row.roles?.length || 0) - 1 && ' '}
            </span>
          )) || 'هیچ نقشی ندارد'}
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: 'عملیات',
      flex: 2.6,
      renderCell: params => (
        <ActionButtons
          userWithRoles={params.row}
          selectedRole={selectedRoles[params.row?.user?.id] || ''}
          onEdit={onEdit}
          onRoleSelect={handleRoleSelect}
          onRemoveRole={handleRemoveRole}
          removingUser={removingUser}
        />
      ),
    },
  ];

  const rows =
    localUsers
      ?.filter(user => user?.user?.id)
      .map(user => ({
        id: user.user.id,
        ...user,
      })) || [];

  console.log('📊 UserRoleTable rendering with rows:', localUsers[0]);

  return (
    <Box>
      {removeError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={handleCloseError}>
          خطا در حذف نقش: {removeError}
        </Alert>
      )}

      <MatnaDataGrid
        rows={rows}
        columns={columns}
        loading={loading || deleteMutation.isPending}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationChange}
        rowCount={rowCount}
        paginationMode={onPaginationChange ? 'server' : 'client'}
        pageSizeOptions={[10]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
      />
    </Box>
  );
}


function ActionButtons({
  userWithRoles,
  selectedRole,
  onRoleSelect,
  onRemoveRole,
  onEdit,
  removingUser,
}: ActionButtonsProps) {
  const { showNotification } = useNotification();

  if (!userWithRoles?.user) {
    return null;
  }

  const roles = userWithRoles.roles || [];
  const roleNames = roles.map(role => role.name);

  const isEndUserOnly =
    roleNames.length === 1 && roleNames[0] === 'complainant';

  const handleRemove = () => {
    if (selectedRole && userWithRoles.user?.id) {
      onRemoveRole(userWithRoles.user.id, selectedRole);
    } else {
      showNotification('لطفاً ابتدا یک نقش برای حذف انتخاب کنید', 'warning');
    }
  };

  if (isEndUserOnly) {
    return (
      <Button
        variant="outlined"
        color="primary"
        size="small"
        onClick={() => onEdit(userWithRoles)}
        startIcon={<AddIcon />}
      >
        افزودن نقش
      </Button>
    );
  }

  return (
    <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
      {roles.length > 1 && (
        <Select
          value={selectedRole}
          onChange={e => onRoleSelect(userWithRoles.user.id, e.target.value)}
          size="small"
          displayEmpty
          sx={{ minWidth: 120 }}
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
      )}

      {roles.length > 1 && (
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={handleRemove}
          disabled={!selectedRole || removingUser === userWithRoles.user.id}
          startIcon={<DeleteIcon />}
        >
          {removingUser === userWithRoles.user.id ? 'در حال حذف...' : 'حذف نقش'}
        </Button>
      )}

      <Button
        variant="outlined"
        color="primary"
        size="small"
        onClick={() => onEdit(userWithRoles)}
        startIcon={<AddIcon />}
      >
        افزودن نقش
      </Button>
    </Box>
  );
}
