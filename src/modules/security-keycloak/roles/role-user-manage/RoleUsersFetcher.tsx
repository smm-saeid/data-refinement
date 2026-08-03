// RoleUsersFetcher.tsx - Fixed
import { useEffect, useRef } from 'react';
import { useKeycloakApiQuery } from '../../../../hooks/useApiKeycloak';
import keycloakApis from '../../apis';
import type { Role, UserWithRoles, UsersByRoleQueryParams } from '../../types';

interface RoleUsersFetcherProps {
  selectedRole: Role | null;
  refreshKey: number;
  paginationModel: { page: number; pageSize: number };
  onUsersLoad: (users: UserWithRoles[], totalCount?: number) => void;
  onLoadingChange: (loading: boolean) => void;
}

export function RoleUsersFetcher({
  selectedRole,
  refreshKey,
  paginationModel,
  onUsersLoad,
  onLoadingChange,
}: RoleUsersFetcherProps) {
  const prevLoadingRef = useRef<boolean>(false);

  // Calculate offset based on pagination - FIXED: Use page instead of offset
  const page = paginationModel.page + 1; // MUI DataGrid uses 0-based, API might use 1-based

  // Fetch users by role with pagination
  const { data: roleUsersResponse, isLoading: roleUsersLoading } =
    useKeycloakApiQuery<any, UsersByRoleQueryParams>({
      url: keycloakApis.user.getByRole,
      config: {
        data: {
          paginationModel: {
            page: page, // Use page instead of offset
            pageSize: paginationModel.pageSize,
          },
          searchModel: {
            name: selectedRole?.name,
          },
        },
      },
      enabled: !!selectedRole,
      key: `role-users-${selectedRole?.name}-${refreshKey}-${paginationModel.page}-${paginationModel.pageSize}`,
    });

  // Handle loading state changes
  useEffect(() => {
    if (prevLoadingRef.current !== roleUsersLoading) {
      prevLoadingRef.current = roleUsersLoading;
      onLoadingChange(roleUsersLoading);
    }
  }, [roleUsersLoading, onLoadingChange]);

  // Handle users data changes
  useEffect(() => {
    if (!roleUsersResponse) {
      onUsersLoad([], 0);
      return;
    }

    console.log('📥 RoleUsersFetcher received response:', roleUsersResponse);

    const usersByRole = extractUsersFromResponse(roleUsersResponse);
    const totalCount = extractTotalCountFromResponse(roleUsersResponse);

    console.log('✅ Extracted users:', usersByRole.length, 'Total count:', totalCount);
    
    onUsersLoad(usersByRole, totalCount);
  }, [roleUsersResponse, onUsersLoad]);

  const extractUsersFromResponse = (response: any): UserWithRoles[] => {
    // Try different response structures
    if (response?.data?.[0]?.users && Array.isArray(response.data[0].users)) {
      return response.data[0].users;
    }
    if (Array.isArray(response?.data)) {
      return response.data;
    }
    if (response?.responseList?.[0]?.data?.[0]?.users) {
      return response.responseList[0].data[0].users;
    }
    if (Array.isArray(response?.users)) {
      return response.users;
    }
    if (Array.isArray(response)) {
      return response;
    }

    console.warn('⚠️ Unknown response structure:', response);
    return [];
  };

  const extractTotalCountFromResponse = (response: any): number => {
    // Based on your sample response structure
    if (response?.totalPages !== undefined && response?.pageSize !== undefined) {
      return response.totalPages * response.pageSize;
    }
    if (response?.meta?.pagination?.count !== undefined) {
      return response.meta.pagination.count;
    }
    if (response?.data?.[0]?.totalCount !== undefined) {
      return response.data[0].totalCount;
    }
    if (response?.totalCount !== undefined) {
      return response.totalCount;
    }
    
    // Default fallback
    const users = extractUsersFromResponse(response);
    return users.length;
  };

  return null;
}