import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Typography,
  Alert,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useKeycloakApiMutation } from '../../../../hooks/useApiKeycloak';
import { useNotification } from '../../NotificationContext';
import { PermissionControls } from './PermissionControls';
import keycloakApis from '../../apis';
import type { Role, Menu, PermissionSet } from '../../types';

interface MenuAssignmentFormProps {
  roles: Role[];
  menus: Menu[];
  selectedRole: string | null;
  onRoleSelect: (roleName: string) => void;
  onSuccess: () => void;
  loading?: boolean;
}

export function MenuAssignmentForm({
  roles,
  menus,
  selectedRole,
  onRoleSelect,
  onSuccess,
  loading = false,
}: MenuAssignmentFormProps) {
  const [selectedMenu, setSelectedMenu] = useState<string>('');
  const [permissions, setPermissions] = useState<PermissionSet>({
    canRead: true,
    canWrite: true,
    canUpdate: true,
    canDelete: true,
  });
  const [validationError, setValidationError] = useState<string>('');
  const { showNotification } = useNotification();

  const assignMutation = useKeycloakApiMutation<any, any>({
    url: keycloakApis.menuRoleMapping.assign,
    method: 'POST',
    onSuccess: () => {
      showNotification('منو با موفقیت به نقش اختصاص داده شد');
      onSuccess();
      setSelectedMenu('');
      setPermissions({
        canRead: true,
        canWrite: true,
        canUpdate: true,
        canDelete: true,
      });
      setValidationError('');
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || 'خطا در اختصاص منو به نقش';
      setValidationError(errorMessage);
      showNotification(errorMessage, 'error');
    },
  });

  const handleAssign = async () => {
    setValidationError('');

    // Validation
    if (!selectedRole) {
      const errorMsg = 'لطفاً یک نقش انتخاب کنید';
      setValidationError(errorMsg);
      showNotification(errorMsg, 'error');
      return;
    }

    if (!selectedMenu) {
      const errorMsg = 'لطفاً یک منو انتخاب کنید';
      setValidationError(errorMsg);
      showNotification(errorMsg, 'error');
      return;
    }

    const selectedMenuObj = menus.find(menu => menu.id === selectedMenu);
    if (!selectedMenuObj) {
      const errorMsg = 'منوی انتخاب شده یافت نشد';
      setValidationError(errorMsg);
      showNotification(errorMsg, 'error');
      return;
    }

    const requestBody = {
      paginationModel: {},
      searchModel: {
        menuName: selectedMenuObj.englishTitle,
        roleName: selectedRole,
        ...permissions,
      },
    };

    try {
      await assignMutation.mutateAsync(requestBody);
    } catch (error) {
      // Error handling is already done in the mutation onError
      console.error('Assignment failed:', error);
    }
  };

  const canSubmit = selectedRole && selectedMenu && !assignMutation.isPending;

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography
        variant="h5"
        textAlign="center"
        gutterBottom
        sx={{ fontWeight: 'bold' }}
      >
        اتصال نقش به منو
      </Typography>

      <Typography
        variant="h6"
        gutterBottom
        sx={{ color: 'primary.main', mb: 3 }}
      >
        مدیریت نقش‌ها و منوها
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        در این بخش می‌توانید منوها را به نقش‌های مختلف اختصاص دهید.
      </Typography>

      {validationError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {validationError}
        </Alert>
      )}

      <Box display="flex" flexDirection="column" gap={2}>
        <Box display="flex" gap={2} flexWrap="wrap">
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel>انتخاب نقش</InputLabel>
            <Select
              value={selectedRole || ''}
              onChange={e => onRoleSelect(e.target.value)}
              label="انتخاب نقش"
              disabled={loading}
            >
              {roles.map(role => (
                <MenuItem key={role.name} value={role.name}>
                  {role.description}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel>انتخاب منو</InputLabel>
            <Select
              value={selectedMenu}
              onChange={e => setSelectedMenu(e.target.value)}
              label="انتخاب منو"
              disabled={!selectedRole || loading}
            >
              {menus.map(menu => (
                <MenuItem key={menu.id} value={menu.id}>
                  {menu.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <PermissionControls
          permissions={permissions}
          onChange={setPermissions}
        />

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAssign}
          disabled={!canSubmit}
          sx={{
            alignSelf: 'flex-start',
            minWidth: 200,
          }}
        >
          {assignMutation.isPending ? 'در حال اختصاص...' : 'اختصاص منو به نقش'}
        </Button>
      </Box>
    </Paper>
  );
}
