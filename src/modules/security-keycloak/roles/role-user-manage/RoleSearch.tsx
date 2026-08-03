import { useState, useEffect } from 'react';
import { Box, Autocomplete, TextField, Alert } from '@mui/material';
import { useKeycloakApiQuery } from '../../../../hooks/useApiKeycloak';
import keycloakApis from '../../apis';
import type { Role, RoleListQueryParams } from '../../types';

interface RoleSearchProps {
  onRoleSelect: (role: Role | null) => void;
  selectedRole: Role | null;
}

export function RoleSearch({ onRoleSelect, selectedRole }: RoleSearchProps) {
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);

  // Fetch available roles
  const {
    data: rolesResponse,
    isLoading: rolesLoading,
    error: rolesError,
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

  // Process roles response
  useEffect(() => {
    if (rolesResponse) {
      const processedRoles = extractRolesFromResponse(rolesResponse);
      setAvailableRoles(processedRoles);
    }
  }, [rolesResponse]);

  const extractRolesFromResponse = (response: any): Role[] => {
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
    onRoleSelect(role);
  };

  return (
    <Box>
      {rolesError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          خطا در دریافت نقش‌ها: {rolesError.message}
        </Alert>
      )}

      <Autocomplete
        options={availableRoles}
        getOptionLabel={(role: Role) => role.description || role.name || ''}
        value={selectedRole}
        onChange={(_, newValue) => handleRoleSelect(newValue)}
        loading={rolesLoading}
        renderInput={params => (
          <TextField
            {...params}
            label="انتخاب نقش"
            placeholder="برای مشاهده کاربران، نقش را انتخاب کنید"
            size="small"
            sx={{ minWidth: 300 }}
          />
        )}
        isOptionEqualToValue={(option: Role, value: Role) =>
          option.id === value.id
        }
      />
    </Box>
  );
}
