import { useState, useEffect, useCallback } from 'react';
import { Box, Container, Typography, Divider, Alert } from '@mui/material';
import { useApiQuery } from '@/hooks/useApi';
import keycloakApis from '../../apis';
import { LockedUsersFilters } from './LockedUsersFilters';
import { LockedUsersTable } from './LockedUsersTable';
import type { LockedUser, LockUserQueryParams } from '../../types';

export function LockManagement() {
  const [searchUsername, setSearchUsername] = useState('');
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // Build query params from search
  const buildQueryParams = useCallback((): LockUserQueryParams => {
    const params: LockUserQueryParams = {};

    if (searchUsername.trim()) {
      params.username = searchUsername;
    }

    return params;
  }, [searchUsername]);

  // Fetch locked users data
  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useApiQuery<LockedUser[], LockUserQueryParams>({
    url: keycloakApis.lockManagement.search,
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

  const handleSuccess = () => {
    refetch();
  };

  // Initial fetch on component mount
  useEffect(() => {
    refetch();
  }, []);

  const lockedUsers = response?.data || [];
  const rowCount = response?.meta?.pagination?.count || 0;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: 'bold', mb: 2 }}
        >
          مدیریت کاربران قفل شده
        </Typography>
        <Divider sx={{ mb: 3 }} />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          خطا در دریافت داده‌ها:{' '}
          {error.response?.data?.message || error.message}
        </Alert>
      )}

      <LockedUsersFilters
        searchUsername={searchUsername}
        onSearchUsernameChange={setSearchUsername}
        onSearch={handleSearch}
        loading={isLoading}
      />

      <LockedUsersTable
        users={lockedUsers}
        loading={isLoading}
        onSuccess={handleSuccess}
        paginationModel={paginationModel}
        onPaginationChange={handlePaginationChange}
        rowCount={rowCount}
      />
    </Container>
  );
}
