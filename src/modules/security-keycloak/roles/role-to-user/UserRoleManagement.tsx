import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Autocomplete,
  TextField,
  Alert,
} from '@mui/material';
import { useKeycloakApiQuery } from '../../../../hooks/useApiKeycloak';
import {
  NotificationProvider,
  useNotification,
} from '../../NotificationContext';
import keycloakApis from '../../apis';
import { UserSearch } from './UserSearch';
import { UserRoleTable } from './UserRoleTable';
import { RoleAssignment } from './RoleAssignment';
import type {
  UserWithRoles,
  Role,
  RoleListQueryParams,
  UsersByRoleQueryParams,
} from '../../types';

export function UserRoleManagement() {
  return (
    <NotificationProvider>
      <UserRoleManagementContext />
    </NotificationProvider>
  );
}
function UserRoleManagementContext() {
  const [selectedUser, setSelectedUser] = useState<UserWithRoles | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [editingUser, setEditingUser] = useState<UserWithRoles | null>(null);
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const { showNotification } = useNotification();

  // State for triggering refetches
  const [userSearchRefreshKey, setUserSearchRefreshKey] = useState(0);
  const [roleUsersRefreshKey, setRoleUsersRefreshKey] = useState(0);

  const {
    data: rolesResponse,
    isLoading: rolesLoading,
    error: rolesError,
    refetch: refetchRoles,
  } = useKeycloakApiQuery<any, RoleListQueryParams>({
    url: keycloakApis.role.list,
    config: {
      data: {
        paginationModel: {
          pageSize: 50,
        },
        searchModel: {},
      },
    },
  });

  // Fetch users by role
  const {
    data: roleUsersResponse,
    isLoading: roleUsersLoading,
    refetch: refetchRoleUsers,
  } = useKeycloakApiQuery<UserWithRoles[], UsersByRoleQueryParams>({
    url: keycloakApis.user.getByRole,
    config: {
      data: {
        paginationModel: {
          offset: 0,
          pageSize: 10,
        },
        searchModel: {
          name: selectedRole?.name,
        },
      },
    },
    enabled: !!selectedRole,
    key: roleUsersRefreshKey,
  });

  useEffect(() => {
    if (rolesResponse) {
      const processedRoles = extractRolesFromResponse(rolesResponse);
      setAvailableRoles(processedRoles);
      if (processedRoles.length > 0) {
        showNotification(`${processedRoles.length} نقش بارگذاری شد`, 'success');
      }
    }
  }, [rolesResponse]);

  const extractRolesFromResponse = (response: any): Role[] => {
    console.log('response', response);
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    if (
      response?.responseList?.[0]?.data &&
      Array.isArray(response.data.data)
    ) {
      return response.responseList[0].data;
    }
    if (response?.responseList?.[0]?.data?.[0]?.data) {
      return response.responseList[0].data[0].data;
    }
    if (response?.data?.responseList?.[0]?.data) {
      return response.data.responseList[0].data;
    }
    return [];
  };

  const handleRoleSelect = (role: Role | null) => {
    setSelectedRole(role);
    if (role) {
      showNotification(`نقش "${role.description}" انتخاب شد`, 'success');
    }
  };

  const handleUserSelect = (userWithRoles: UserWithRoles) => {
    setSelectedUser(userWithRoles);
  };

  const handleUsersLoad = (users: UserWithRoles[]) => {
    if (users.length > 0 && !selectedUser) {
      setSelectedUser(users[0]);
    }
  };

  const handleEdit = (user: UserWithRoles) => {
    setEditingUser(user);
    setAssignmentModalOpen(true);
  };

  const refetchAllData = () => {
    console.log('🔄 Refetching all data...');

    refetchRoles();

    if (selectedRole) {
      setRoleUsersRefreshKey(prev => prev + 1);
      refetchRoleUsers();
    }

    if (selectedUser) {
      setUserSearchRefreshKey(prev => prev + 1);
    }
  };

  const handleAssignmentSuccess = (message: string) => {
    showNotification(message);
    setAssignmentModalOpen(false);
    setEditingUser(null);

    setTimeout(() => {
      refetchAllData();
    }, 500);
  };

  const handleTableOperationSuccess = (message: string) => {
    showNotification(message);

    setTimeout(() => {
      refetchAllData();
    }, 500);
  };

  const handleAssignmentClose = () => {
    setAssignmentModalOpen(false);
    setEditingUser(null);
  };

  const usersByRole = Array.isArray(roleUsersResponse?.data)
    ? roleUsersResponse.data
    : [];
  const displayUsers = selectedUser ? [selectedUser] : [];
  console.log('🔄 UserRole:', usersByRole);

  return (
    <Box
      sx={{ width: '100%', maxWidth: '100vw', p: 2, boxSizing: 'border-box' }}
    >
      {rolesError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          خطا در دریافت نقش‌ها: {rolesError.message}
        </Alert>
      )}

      {/* User Search Section */}
      <UserSearch
        onUserSelect={handleUserSelect}
        onUsersLoad={handleUsersLoad}
        refreshKey={userSearchRefreshKey}
      />

      {selectedUser && (
        <>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontWeight: 'bold', mt: 3 }}
          >
            کاربر انتخاب شده
          </Typography>
          <UserRoleTable
            users={displayUsers}
            loading={false}
            availableRoles={availableRoles}
            onEdit={handleEdit}
            onSuccess={() =>
              handleTableOperationSuccess('عملیات با موفقیت انجام شد')
            }
            refreshTrigger={userSearchRefreshKey}
          />
        </>
      )}

      {/* Role Assignment Modal */}
      <RoleAssignment
        open={assignmentModalOpen}
        onClose={handleAssignmentClose}
        user={editingUser?.user || null}
        availableRoles={availableRoles}
        onSuccess={handleAssignmentSuccess}
      />
    </Box>
  );
}
