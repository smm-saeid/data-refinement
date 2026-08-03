import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Divider,
  Alert,
} from '@mui/material';
import { useKeycloakApiMutation } from '../../../../hooks/useApiKeycloak';
import { useNotification } from '../../NotificationContext';
import keycloakApis from '../../apis';
import type { CreateRoleRequest, UpdateRoleRequest, Role } from '../../types';

interface RoleFormProps {
  onSuccess: () => void;
  initialValues?: CreateRoleRequest;
  isEdit?: boolean;
  onCancel?: () => void;
}

export function RoleForm({
  onSuccess,
  initialValues,
  isEdit = false,
  onCancel,
}: RoleFormProps) {
  const [formData, setFormData] = useState<CreateRoleRequest>(
    initialValues || { name: '', description: '' }
  );
  const [validationError, setValidationError] = useState<string>('');
  const { showNotification } = useNotification();

  const createMutation = useKeycloakApiMutation<any, any>({
    url: keycloakApis.role.create,
    method: 'POST',
    onSuccess: () => {
      showNotification(
        isEdit ? 'نقش با موفقیت ویرایش شد' : 'نقش با موفقیت ایجاد شد'
      );
      onSuccess();
      if (!isEdit) {
        setFormData({ name: '', description: '' });
      }
      setValidationError('');
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || 'خطا در انجام عملیات';
      setValidationError(errorMessage);
      showNotification(errorMessage, 'error');
    },
  });

  const updateMutation = useKeycloakApiMutation<any, any>({
    url: keycloakApis.role.update,
    method: 'POST',
    onSuccess: () => {
      showNotification('نقش با موفقیت ویرایش شد');
      onSuccess();
      setValidationError('');
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || 'خطا در انجام عملیات';
      setValidationError(errorMessage);
      showNotification(errorMessage, 'error');
    },
  });

  const loading = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!formData.name.trim() || !formData.description.trim()) {
      const errorMsg = 'لطفاً تمام فیلدها را پر کنید';
      setValidationError(errorMsg);
      showNotification(errorMsg, 'error');
      return;
    }

    if (!isEnglish(formData.name)) {
      const errorMsg = 'نام نقش باید فقط شامل حروف انگلیسی باشد';
      setValidationError(errorMsg);
      showNotification(errorMsg, 'error');
      return;
    }

    if (!isPersian(formData.description)) {
      const errorMsg = 'توضیحات باید فقط شامل حروف فارسی باشد';
      setValidationError(errorMsg);
      showNotification(errorMsg, 'error');
      return;
    }

    const requestBody = {
      paginationModel: {},
      searchModel: formData,
    };

    try {
      if (isEdit) {
        const updateData = {
          ...requestBody,
          // If you need the role ID for update, make sure it's included
          // searchModel: { ...formData, id: initialValues?.id }
        };
        await updateMutation.mutateAsync(updateData);
      } else {
        await createMutation.mutateAsync(requestBody);
      }
    } catch (error) {
      console.error('Operation failed:', error);
    }
  };

  const isEnglish = (text: string) => /^[a-zA-Z\s\-_]*$/.test(text);
  const isPersian = (text: string) => /^[\u0600-\u06FF\s]*$/.test(text);

  const handleNameChange = (value: string) => {
    if (isEnglish(value) || value === '') {
      setFormData(prev => ({ ...prev, name: value }));
      setValidationError('');
    }
  };

  const handleDescriptionChange = (value: string) => {
    if (isPersian(value) || value === '') {
      setFormData(prev => ({ ...prev, description: value }));
      setValidationError('');
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
        مدیریت نقش‌ها
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Typography
        variant="h5"
        textAlign="center"
        gutterBottom
        sx={{ fontWeight: 'bold' }}
      >
        {isEdit ? 'ویرایش نقش' : 'تعریف نقش کاربر'}
      </Typography>

      {validationError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {validationError}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Box display="flex" gap={2} alignItems="flex-start" flexWrap="wrap">
          <TextField
            label="نام نقش"
            value={formData.name}
            onChange={e => handleNameChange(e.target.value)}
            size="small"
            required
            disabled={isEdit || loading}
            helperText="فقط حروف انگلیسی مجاز است"
            sx={{ minWidth: 200 }}
            error={!!validationError && !isEnglish(formData.name)}
          />

          <TextField
            label="توضیحات نقش"
            value={formData.description}
            onChange={e => handleDescriptionChange(e.target.value)}
            size="small"
            required
            helperText="فقط حروف فارسی مجاز است"
            sx={{ minWidth: 200 }}
            error={!!validationError && !isPersian(formData.description)}
          />

          <Box display="flex" gap={1}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ minHeight: '40px' }}
            >
              {loading
                ? 'در حال ثبت...'
                : isEdit
                  ? 'ویرایش نقش'
                  : 'ثبت نقش کاربر'}
            </Button>

            {isEdit && onCancel && (
              <Button
                variant="outlined"
                onClick={onCancel}
                disabled={loading}
                sx={{ minHeight: '40px' }}
              >
                انصراف
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
