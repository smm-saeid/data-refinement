import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  Box,
  Alert,
} from '@mui/material';
import { useKeycloakApiPost } from '../../../../hooks/useApiKeycloak';
import { useNotification } from '../../NotificationContext';
import keycloakApis from '../../apis';
import type { User, Role } from '../../types';

interface RoleAssignmentProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
  availableRoles: any;
  onSuccess: (message?: string) => void;
}

interface AssignRoleVariables {
  paginationModel: Record<string, any>;
  searchModel: {
    roleName: string;
    userId: string;
  };
}

export function RoleAssignment({
  open,
  onClose,
  user,
  availableRoles = [],
  onSuccess,
}: RoleAssignmentProps) {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [assignError, setAssignError] = useState<string | null>(null);
  const [rolesOptions, setRolesOptions] = useState<Role[]>([]);
  const { showNotification } = useNotification();

  useEffect(() => {
    if (open) {
      setSelectedRole(null);
      setAssignError(null);
      processAvailableRoles();
    }
  }, [open, availableRoles]);

  const processAvailableRoles = () => {
    let extractedRoles: Role[] = [];

    if (Array.isArray(availableRoles) && availableRoles.length > 0) {
      if (availableRoles[0]?.id && availableRoles[0]?.name) {
        extractedRoles = availableRoles;
      }
    } else if (availableRoles?.responseList?.[0]?.data) {
      if (Array.isArray(availableRoles.responseList[0].data)) {
        extractedRoles = availableRoles.responseList[0].data;
      }
    } else if (availableRoles?.data && Array.isArray(availableRoles.data)) {
      extractedRoles = availableRoles.data;
    } else if (availableRoles?.responseList?.[0]?.data?.[0]?.data) {
      extractedRoles = availableRoles.responseList[0].data[0].data;
    }

    setRolesOptions(extractedRoles);
  };

  const assignMutation = useKeycloakApiPost<any, AssignRoleVariables>(
    keycloakApis.user.assignRole,
    {
      onSuccess: () => {
        showNotification('نقش با موفقیت به کاربر اضافه شد');
        onSuccess('نقش با موفقیت به کاربر اضافه شد');
      },
      onError: (error: any) => {
        const errorMessage =
          error?.response?.data?.message || 'خطای ناشناخته در ثبت نقش';
        setAssignError(errorMessage);
        showNotification(errorMessage, 'error');
      },
    }
  );

  const handleSubmit = async () => {
    if (!user || !selectedRole) return;

    setAssignError(null);
    try {
      await assignMutation.mutateAsync({
        paginationModel: {},
        searchModel: {
          roleName: selectedRole.name,
          userId: user.id,
        },
      });
    } catch (error) {
      console.error('Assign role error:', error);
    }
  };

  const handleClose = () => {
    setSelectedRole(null);
    setAssignError(null);
    onClose();
  };

  const getOptionLabel = (role: Role) => {
    return role?.description || role?.name || 'نقش بدون نام';
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>ثبت نقش جدید برای کاربر</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={2}>
          <TextField
            label="کاربر"
            value={
              user
                ? `${user.firstName} ${user.lastName} (${user.username})`
                : ''
            }
            disabled
            fullWidth
          />

          <Autocomplete
            options={rolesOptions}
            getOptionLabel={getOptionLabel}
            value={selectedRole}
            onChange={(_, newValue) => setSelectedRole(newValue)}
            renderInput={params => (
              <TextField
                {...params}
                label="نقش را انتخاب کنید"
                placeholder={
                  rolesOptions.length === 0
                    ? 'نقشی موجود نیست'
                    : 'نقش مورد نظر را انتخاب کنید'
                }
                required
                error={!!assignError}
              />
            )}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            disabled={rolesOptions.length === 0}
          />

          {assignError && (
            <Alert severity="error" onClose={() => setAssignError(null)}>
              خطا در ثبت نقش: {assignError}
            </Alert>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={assignMutation.isPending}>
          انصراف
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!selectedRole || assignMutation.isPending}
        >
          {assignMutation.isPending ? 'در حال ثبت...' : 'ارسال'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
