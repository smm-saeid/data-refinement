import { Box, Typography } from '@mui/material';
import { RoleUsersTable } from './RoleUsersTable';
import type { UserWithRoles, Role } from '../../types';

interface RoleUsersDisplayProps {
  selectedRole: Role | null;
  users: UserWithRoles[];
  loading: boolean;
  availableRoles: Role[];
  onOperationSuccess: (message: string) => void;
  refreshTrigger: number;
  paginationModel?: any;
  onPaginationChange?: (model: any) => void;
  rowCount?: number;
}

export function RoleUsersDisplay({
  selectedRole,
  users,
  loading,
  availableRoles,
  onOperationSuccess,
  refreshTrigger,
  paginationModel,
  onPaginationChange,
  rowCount,
}: RoleUsersDisplayProps) {
  if (!selectedRole) {
    return null;
  }

  return (
    <Box mt={3}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
        کاربران با نقش "{selectedRole.description || selectedRole.name}"
      </Typography>

      <RoleUsersTable
        users={users}
        loading={loading}
        availableRoles={availableRoles}
        onOperationSuccess={onOperationSuccess}
        refreshTrigger={refreshTrigger}
        paginationModel={paginationModel}
        rowCount={rowCount}
        onPaginationChange={onPaginationChange}
      />

      {users.length === 0 && !loading && (
        <Typography
          sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}
        >
          هیچ کاربری با نقش "{selectedRole.description || selectedRole.name}"
          یافت نشد.
        </Typography>
      )}
    </Box>
  );
}
