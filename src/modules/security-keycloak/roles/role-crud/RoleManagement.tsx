import { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
} from '@mui/material';
import { useKeycloakApiQuery } from '../../../../hooks/useApiKeycloak';
import keycloakApis from '../../apis';
import {
  PAGINATION_DEFAULT_VALUE,
  type PaginationQueryParam,
} from '@/types/api';
import { RoleForm } from './RoleForm';
import { RoleTable } from './RoleTable';
import type { Role, RoleQueryParams, CreateRoleRequest } from '../../types';
import { NotificationProvider } from '../../NotificationContext';

interface RoleFilters extends PaginationQueryParam<RoleQueryParams> {
  currentPage?:number;
  page?: number;
  pageSize?: number;
  name?: string;
  description?: string;
}

export function RoleManagement() {
  return (
    <NotificationProvider>
      <RoleManagementContext />
    </NotificationProvider>
  );
}

function RoleManagementContext() {
  const [filters, setFilters] = useState<RoleFilters>({
    ...PAGINATION_DEFAULT_VALUE,
    currentPage:0,
    page: 1,
    pageSize: 50,
    name: '',
    description: '',
  });

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const requestBody = {
    paginationModel: {
      offset: filters.page ? (filters.page - 1) * (filters.pageSize || 10) : 0,
      pageSize: filters.pageSize || 10,
    },
    searchModel: {
      name: filters.name || undefined,
      description: filters.description || undefined,
    },
  };

  // Fetch roles
  const {
    data: response,
    isLoading, 
    error,
    refetch,
  } = useKeycloakApiQuery<Role[], RoleQueryParams>({
    url: keycloakApis.role.list,
    config: {
      data: requestBody,
    },
  });

  useEffect(() => {
    if (response) {
      console.log('Full response:', responseData);
      console.log('Roles data:', roles);
      console.log('Pagination info:', paginationInfo);
    }
  }, [response]);

  const responseData = response?.data?.responseList?.[0];
  const roles = responseData?.data || [];
  const paginationInfo = responseData || {};

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setEditModalOpen(true);




  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setEditingRole(null);
  };

  const handlePaginationChange = (model: any) => {
    setFilters(prev => ({
      ...prev,
      page: model.page + 1,
      pageSize: model.pageSize,
    }));

    console.log('model', model)
  };

  const updateFilters = (updates: Partial<RoleQueryParams>) => {
    setFilters(prev => ({
      ...prev,
      ...updates,
      page: 1,
    }));
  };

  const resetFilters = () => {
    setFilters({
      ...PAGINATION_DEFAULT_VALUE,
      currentPage:0,
      page: 1,
      pageSize: 50,
      name: '',
      description: '',
    });
  };

  const handleSuccess = () => {
    refetch();
    if (editModalOpen) {
      handleEditModalClose();
    }
  };

  const paginationModel = {
    page: (filters.currentPage || 1) - 1,
    pageSize: filters.pageSize || 10,
  };

  if (error) {
    return (
      <Box p={2}>
        <Alert severity="error" sx={{ mb: 2 }}>
          خطا: {error.response?.data?.message || error.message}
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{ width: '100%', maxWidth: '100vw', p: 2, boxSizing: 'border-box' }}
    >
      {/* Create Role Form */}
      <RoleForm onSuccess={handleSuccess} />

      {/* Filters */}
      {/* <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          نمایش و تغییرات نقش کاربر‌های فیش حقوقی
        </Typography>

        <Box display="flex" gap={2} flexWrap="wrap" alignItems="center" mt={2}>
          <TextField
            label="جستجو بر اساس نام"
            value={filters.name || ''}
            onChange={e => updateFilters({ name: e.target.value })}
            size="small"
          />

          <TextField
            label="جستجو بر اساس توضیحات"
            value={filters.description || ''}
            onChange={e => updateFilters({ description: e.target.value })}
            size="small"
          />

          <Button variant="outlined" onClick={resetFilters}>
            بازنشانی فیلترها
          </Button>
        </Box>
      </Paper> */}

      {/* Role Table */}
      <RoleTable
        data={roles}
        loading={isLoading}
        paginationModel={paginationModel}
        rowCount={paginationInfo?.totalCount || 0}
        onPaginationChange={handlePaginationChange}
        onEdit={handleEdit}
        onSuccess={handleSuccess}
        editModalOpen={editModalOpen}
        editingRole={editingRole}
        onEditModalClose={handleEditModalClose}
      />
    </Box>
  );
}
