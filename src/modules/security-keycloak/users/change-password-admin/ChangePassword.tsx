import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Divider,
  CircularProgress,
  Alert,
  Container,
} from '@mui/material';
import {
  useKeycloakApiQuery,
  useKeycloakApiMutation,
} from '../../../../hooks/useApiKeycloak';
import keycloakApis from '../../apis';
import type {
  UsersResponse,
  UsersQueryParams,
  ResetPasswordRequest,
  UserTableData,
} from '../../types';
import {
  PAGINATION_DEFAULT_VALUE,
  type PaginationQueryParam,
} from '@/types/api';
import { UsersTable } from './UsersTable';
import { ResetPasswordModal } from './ResetPasswordModal';
import { SuccessModal } from './SuccessModal';

export function ChangePassword() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserTableData | null>(null);

  const [filters, setFilters] = useState<
    PaginationQueryParam<UsersQueryParams>
  >({
    ...PAGINATION_DEFAULT_VALUE,
    searchTerm: '',
    currentPage: 0,
    page: 1,
    pageSize: 50,
  });

 
  const offset = filters.page
    ? (filters.page - 1) * (filters.pageSize || 10)
    : 0;

  const requestBody = {
    paginationModel: {
      offset: offset,
      pageSize: filters.pageSize || 10,
    },
    searchModel: { searchTerm: filters.searchTerm },
  };

  
  const {
    data: usersResponse,
    isLoading: usersLoading,
    error: usersError,
    refetch,
  } = useKeycloakApiQuery<
    UsersResponse,
    PaginationQueryParam<UsersQueryParams>
  >({
    url: keycloakApis.user.search,
    config: {
      data: requestBody,
    },
  });


  const resetPasswordMutation = useKeycloakApiMutation<
    any,
    ResetPasswordRequest
  >({
    url: keycloakApis.password.resetByNationalCode,
    method: 'POST',
    onSuccess: () => {
      setIsModalOpen(false);
      setIsSuccessModalOpen(true);
      setSelectedUser(null);
    },
  });

  const handleSearch = useCallback(() => {
    setFilters(prev => ({
      ...prev,
      searchTerm: searchTerm,
      page: 1,
    }));
  }, [searchTerm]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleViewUser = useCallback((user: UserTableData) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  }, []);

  const handleResetPassword = useCallback(
    (values: ResetPasswordRequest) => {
     
      const currentOffset = filters.page
        ? (filters.page - 1) * (filters.pageSize || 10)
        : 0;

      const requestBody: ResetPasswordRequest = {
        paginationModel: {
          offset: currentOffset,
          pageSize: filters.pageSize || 10,
        },
        searchModel: {
          username: values.searchModel.username,
          newPassword: encodeURIComponent(values.searchModel.newPassword),
        },
      };

      resetPasswordMutation.mutate(requestBody);
    },
    [resetPasswordMutation, filters.page, filters.pageSize]
  );

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedUser(null);
  }, []);

  const handleCloseSuccessModal = useCallback(() => {
    setIsSuccessModalOpen(false);
  }, []);

  const handlePaginationChange = useCallback((model: any) => {
    setFilters(prev => ({
      ...prev,
      page: model.page + 1,
      pageSize: model.pageSize,
    }));
  }, []);


  const usersData =
    usersResponse?.data?.responseList?.[0]?.data?.[0]?.users || [];
  const totalUsers =
    usersResponse?.data?.totalCount || usersResponse?.data?.totalPages || 0;

  const tableData: UserTableData[] = usersData.map((item, index) => ({
    id: item.user.username || index.toString(),
    key: index.toString(),
    firstName: item.user.firstName || '',
    lastName: item.user.lastName || '',
    username: item.user.username || '',
    nationalityCode: item.user.attributes?.nationalityCode?.[0] || '',
  }));

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          بازنشانی رمز عبور
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h5" component="h2" gutterBottom align="center">
          جستجوی نفرات بر اساس نام، نشان، کد ملی
        </Typography>

        {usersError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            خطا در دریافت اطلاعات کاربران
          </Alert>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3, gap: 1 }}>
          <TextField
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="جستجو..."
            size="small"
            sx={{ width: 300 }}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={usersLoading}
          >
            جستجو
          </Button>
        </Box>

        <UsersTable
          data={tableData}
          loading={usersLoading}
          onViewUser={handleViewUser}
          paginationModel={{
            page: filters.page - 1,
            pageSize: filters.pageSize,
          }}
          rowCount={totalUsers}
          onPaginationModelChange={handlePaginationChange}
        />

        <ResetPasswordModal
          open={isModalOpen}
          user={selectedUser}
          onClose={handleCloseModal}
          onSubmit={handleResetPassword}
          isLoading={resetPasswordMutation.isPending}
        />

        <SuccessModal
          open={isSuccessModalOpen}
          onClose={handleCloseSuccessModal}
        />
      </Paper>
    </Container>
  );
}
