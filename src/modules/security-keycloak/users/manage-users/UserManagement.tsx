import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Divider,
  Alert,
  Button,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useApiQuery } from '@/hooks/useApi';
import keycloakApis from '../../apis';
// import { UserSearchFilters } from './UserSearchFilters';
import { UsersTable } from './UsersTable';
import { UserForm } from './UserForm';
import { UserDetailsDialog } from './UserDetailsDialog';
import type { UserWithRoles, User, UserQueryParams } from '../../types';

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUserDetails, setSelectedUserDetails] =
    useState<UserWithRoles | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  // Build query params from search
  const buildQueryParams = useCallback((): UserQueryParams => {
    const params: UserQueryParams = {};

    if (searchTerm.trim()) {
      params.searchTerm = searchTerm;
    }

    return params;
  }, [searchTerm]);

  // Fetch users data
  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useApiQuery<UserWithRoles[], UserQueryParams>({
    url: keycloakApis.user.search,
    params: {
      paginationModel: {
        offset: paginationModel.page,
        pageSize: paginationModel.pageSize,
      },
      searchModel: buildQueryParams(),
    },
  });

  const handleSearch = () => {
    setPaginationModel(prev => ({ ...prev, page: 0 }));
    refetch();
  };

  const handlePaginationChange = (model: any) => {
    setPaginationModel(model);
  };

  const handleCreateUser = () => {
    setFormMode('create');
    setSelectedUser(null);
    setFormOpen(true);
  };

  const handleEditUser = (user: User) => {
    setFormMode('edit');
    setSelectedUser(user);
    setFormOpen(true);
  };

  const handleViewUser = (userWithRoles: UserWithRoles) => {
    setSelectedUserDetails(userWithRoles);
    setDetailsOpen(true);
  };

  const handleFormSuccess = () => {
    refetch();
    setFormOpen(false);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedUser(null);
  };

  const handleDetailsClose = () => {
    setDetailsOpen(false);
    setSelectedUserDetails(null);
  };

  // Initial fetch on component mount
  useEffect(() => {
    refetch();
  }, []);

  const users = response?.data || [];
  const rowCount = response?.meta?.pagination?.count || 0;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            مدیریت کاربران
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateUser}
          >
            ایجاد کاربر جدید
          </Button>
        </Box>
        <Divider />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          خطا در دریافت داده‌ها:{' '}
          {error.response?.data?.message || error.message}
        </Alert>
      )}

      {/* <UserSearchFilters
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onSearch={handleSearch}
        loading={isLoading}
      /> */}

      <UsersTable
        data={users}
        loading={isLoading}
        onEdit={handleEditUser}
        onView={handleViewUser}
        onSuccess={refetch}
        paginationModel={paginationModel}
        onPaginationChange={handlePaginationChange}
        rowCount={rowCount}
      />

      {/* User Form Dialog */}
      <UserForm
        open={formOpen}
        onClose={handleFormClose}
        user={selectedUser}
        onSuccess={handleFormSuccess}
        mode={formMode}
      />

      {/* User Details Dialog */}
      <UserDetailsDialog
        open={detailsOpen}
        onClose={handleDetailsClose}
        userWithRoles={selectedUserDetails}
      />
    </Container>
  );
}
