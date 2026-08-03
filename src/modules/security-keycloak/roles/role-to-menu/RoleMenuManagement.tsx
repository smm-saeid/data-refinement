import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useKeycloakApiQuery } from '../../../../hooks/useApiKeycloak';
import {
  NotificationProvider,
  useNotification,
} from '../../NotificationContext';
import keycloakApis from '../../apis';
import { MenuAssignmentForm } from './MenuAssignmentForm';
import { AssignedMenusTable } from './AssignedMenusTable';
import type { Role, Menu, MenuRoleMapping, RoleQueryParams } from '../../types';
import {
  PAGINATION_DEFAULT_VALUE,
  type PaginationQueryParam,
} from '@/types/api';

interface RoleFilters extends PaginationQueryParam<RoleQueryParams> {
  page?: number;
  pageSize?: number;
  name?: string;
  description?: string;
}
export function RoleMenuManagement() {
  return (
    <NotificationProvider>
      <RoleMenuManagementContext />
    </NotificationProvider>
  );
}
function RoleMenuManagementContext() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [assignedMenus, setAssignedMenus] = useState<MenuRoleMapping[]>([]);
  const [filters, setFilters] = useState<RoleFilters>({
    ...PAGINATION_DEFAULT_VALUE,
    page: 1,
    pageSize: 50,
    name: '',
    description: '',
  });
  const [assignedMenusPagination, setAssignedMenusPagination] = useState({
    page: 0,
    pageSize: 10,
  });

  const { showNotification } = useNotification();

  const rolesRequestBody = {
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
    data: rolesResponse,
    isLoading: rolesLoading,
    error: rolesError,
  } = useKeycloakApiQuery<Role[]>({
    url: keycloakApis.role.list,
    config: {
      data: rolesRequestBody,
    },
  });

  // Fetch available menus
  const {
    data: menusResponse,
    isLoading: menusLoading,
    error: menusError,
  } = useKeycloakApiQuery<Menu[]>({
    url: keycloakApis.menu.list,
  });

  const assignedMenusRequestBody = {
    paginationModel: {
      offset: assignedMenusPagination.page * assignedMenusPagination.pageSize,
      pageSize: assignedMenusPagination.pageSize,
    },
    searchModel: {
      roleName: selectedRole || undefined,
    },
  };

  const {
    data: assignedMenusResponse,
    isLoading: assignedMenusLoading,
    refetch: refetchAssignedMenus,
  } = useKeycloakApiQuery<MenuRoleMapping[]>({
    url: keycloakApis.menuRoleMapping.byRole,
    config: {
      data: assignedMenusRequestBody,
    },
    enabled: !!selectedRole,
  });

  useEffect(() => {
    console.log('Full roles response:', responseData);
    console.log('Roles data:', roles);
    console.log('Pagination info:', paginationInfo);
    console.log(
      'Assigned menus response:',
      assignedMenusResponse?.data?.responseList?.[0]
    );
  }, [assignedMenusResponse, rolesResponse, menusResponse]);

  const responseData = rolesResponse?.data?.responseList?.[0];
  const roles = responseData?.data || [];
  const paginationInfo = responseData || {};
  const menus = menusResponse?.data?.responseList || [];

  const assignedMenusData = assignedMenusResponse?.data?.responseList?.[0];
  const assignedMenusList = assignedMenusData || [];
  const assignedMenusTotal = assignedMenusData?.totalCount || 0;

  useEffect(() => {
    if (assignedMenusResponse?.data) {
      setAssignedMenus(assignedMenusList);
    }
  }, [assignedMenusResponse, assignedMenusList]);

  const handleRoleSelect = (roleName: string) => {
    setSelectedRole(roleName);

    setAssignedMenusPagination({ page: 0, pageSize: 10 });
  };

  const handleSuccess = () => {
    showNotification('عملیات با موفقیت انجام شد');
    if (selectedRole) {
      refetchAssignedMenus();
    }
  };

  const handleAssignedMenusPaginationChange = (model: any) => {
    setAssignedMenusPagination({
      page: model.page,
      pageSize: model.pageSize,
    });
  };

  const isLoading = rolesLoading || menusLoading;
  const error = rolesError || menusError;

  if (error) {
    return (
      <Box p={2}>
        <Alert severity="error" sx={{ mb: 2 }}>
          خطا در دریافت داده‌ها:{' '}
          {error.response?.data?.message || error.message}
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{ width: '100%', maxWidth: '100vw', p: 2, boxSizing: 'border-box' }}
    >
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: 'bold', mb: 2 }}
        >
          مدیریت اتصال نقش به منو
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {isLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height={200}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            <MenuAssignmentForm
              roles={roles}
              menus={menus}
              selectedRole={selectedRole}
              onRoleSelect={handleRoleSelect}
              onSuccess={handleSuccess}
              loading={isLoading}
            />

            {selectedRole && (
              <>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  منوهای اختصاص داده شده به نقش: {selectedRole}
                </Typography>

                {assignedMenus.length > 0 ? (
                  <AssignedMenusTable
                    assignedMenus={assignedMenus}
                    loading={assignedMenusLoading}
                    onSuccess={handleSuccess}
                    paginationModel={assignedMenusPagination}
                    onPaginationChange={handleAssignedMenusPaginationChange}
                    rowCount={assignedMenusTotal}
                  />
                ) : (
                  !assignedMenusLoading && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      هیچ منویی به این نقش اختصاص داده نشده است.
                    </Alert>
                  )
                )}
              </>
            )}

            {!selectedRole && (
              <Alert severity="warning">
                لطفاً یک نقش انتخاب کنید تا منوهای اختصاص داده شده را مشاهده
                کنید.
              </Alert>
            )}
          </>
        )}
      </Paper>
    </Box>
  );
}
