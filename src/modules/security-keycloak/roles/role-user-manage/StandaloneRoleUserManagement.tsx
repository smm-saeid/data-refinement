// StandaloneRoleUserManagement.tsx - Fixed
import { useState, useEffect, useCallback } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { RoleSearch } from './RoleSearch';
import { RoleUsersDisplay } from './RoleUsersDisplay';
import { RoleUsersFetcher } from './RoleUsersFetcher';
import { NotificationProvider, useNotification } from '../../NotificationContext';
import type { Role, UserWithRoles } from '../../types';

interface StandaloneRoleUserManagementProps {
  onUserEdit?: (user: UserWithRoles) => void;
}

export function StandaloneRoleUserManagement() {
  return (
    <NotificationProvider>
      <StandaloneRoleUserManagementContext />
    </NotificationProvider>
  );
}

export function StandaloneRoleUserManagementContext({
  onUserEdit,
}: StandaloneRoleUserManagementProps) {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [rowCount, setRowCount] = useState(0);
  
  const { showNotification } = useNotification();

  const handleRoleSelect = (role: Role | null) => {
    setSelectedRole(role);
    // Reset to first page when role changes
    setPaginationModel(prev => ({ ...prev, page: 0 }));
    setUsers([]);
    
    if (role) {
      showNotification(`نقش "${role.description || role.name}" انتخاب شد`, 'info');
    }
  };

  const handleUsersLoad = useCallback((loadedUsers: UserWithRoles[], totalCount?: number) => {
    console.log('✅ Users loaded in parent:', loadedUsers.length, 'Total count:', totalCount);
    setUsers(loadedUsers);
    setRowCount(totalCount || loadedUsers.length);
  }, []);

  const handleLoadingChange = useCallback((isLoading: boolean) => {
    setLoading(isLoading);
  }, []);

  const handleTableOperationSuccess = (message: string) => {
    // Increment refresh key to trigger re-fetch of CURRENT page
    setRefreshKey(prev => prev + 1);
    showNotification(message, 'success');
  };

  const handlePaginationChange = useCallback((newPaginationModel: any) => {
    console.log('🔄 Pagination changed to:', newPaginationModel);
    setPaginationModel(newPaginationModel);
  }, []);

  const handleUserEdit = (user: UserWithRoles) => {
    if (onUserEdit) {
      onUserEdit(user);
    }
  };

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography
        variant="h5"
        textAlign="center"
        gutterBottom
        sx={{ fontWeight: 'bold' }}
      >
        مدیریت کاربران بر اساس نقش
      </Typography>

      <Box display="flex" gap={2} alignItems="center" mt={2} flexWrap="wrap">
        <RoleSearch
          onRoleSelect={handleRoleSelect}
          selectedRole={selectedRole}
        />
      </Box>

      {/* Users Fetcher - Only render when role is selected */}
      {selectedRole && (
        <RoleUsersFetcher
          selectedRole={selectedRole}
          refreshKey={refreshKey}
          paginationModel={paginationModel}
          onUsersLoad={handleUsersLoad}
          onLoadingChange={handleLoadingChange}
        />
      )}

      <RoleUsersDisplay
        selectedRole={selectedRole}
        users={users}
        loading={loading}
        availableRoles={[]} // This can be empty since we're not using it for role assignment
        onUserEdit={handleUserEdit}
        onOperationSuccess={handleTableOperationSuccess}
        refreshTrigger={refreshKey}
        paginationModel={paginationModel}
        onPaginationChange={handlePaginationChange}
        rowCount={rowCount}
      />
    </Paper>
  );
}