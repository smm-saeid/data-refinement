import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  FormControlLabel,
  Switch,
  Grid as Grid,
  Typography,
  Divider,
} from '@mui/material';
import { useApiQuery, useApiMutation } from '@/hooks/useApi';
import keycloakApis from '../../apis';
import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  Role,
} from '../../types';

interface UserFormProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
  onSuccess: () => void;
  mode: 'create' | 'edit';
}

export function UserForm({
  open,
  onClose,
  user,
  onSuccess,
  mode,
}: UserFormProps) {
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    nationalityCode: '',
    degreeCode: '',
    unitCode: '',
    personnelCode: '',
    password: '',
    confirmPassword: '',
    enabled: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch available roles
  const { data: rolesResponse } = useApiQuery<Role[]>({
    url: keycloakApis.role.list,
    params: {
      paginationModel: {
        pageSize: 100,
      },
      searchModel: {},
    },
  });

  const createMutation = useApiMutation<any, CreateUserRequest>({
    url: keycloakApis.user.create,
    method: 'POST',
    onSuccess: () => {
      onSuccess();
      handleClose();
    },
  });

  const updateMutation = useApiMutation<any, UpdateUserRequest>({
    url: keycloakApis.user.update,
    method: 'POST',
    onSuccess: () => {
      onSuccess();
      handleClose();
    },
  });

  const roles = rolesResponse?.data || [];

  useEffect(() => {
    if (user && mode === 'edit') {
      setFormData({
        username: user.username,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        nationalityCode: user.attributes?.nationalityCode?.[0] || '',
        degreeCode: user.attributes?.degreeCode?.[0] || '',
        unitCode: user.attributes?.unitCode?.[0] || '',
        personnelCode: user.attributes?.personnelCode?.[0] || '',
        password: '',
        confirmPassword: '',
        enabled: user.enabled,
      });
    } else {
      setFormData({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        nationalityCode: '',
        degreeCode: '',
        unitCode: '',
        personnelCode: '',
        password: '',
        confirmPassword: '',
        enabled: true,
      });
    }
    setErrors({});
  }, [user, mode, open]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) newErrors.username = 'نام کاربری الزامی است';
    if (!formData.firstName.trim()) newErrors.firstName = 'نام الزامی است';
    if (!formData.lastName.trim())
      newErrors.lastName = 'نام خانوادگی الزامی است';
    if (!formData.email.trim()) newErrors.email = 'ایمیل الزامی است';
    if (!formData.nationalityCode.trim())
      newErrors.nationalityCode = 'کد ملی الزامی است';

    if (mode === 'create') {
      if (!formData.password) newErrors.password = 'رمز عبور الزامی است';
      if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = 'رمز عبور و تکرار آن باید یکسان باشند';
      if (formData.password.length < 6)
        newErrors.password = 'رمز عبور باید حداقل ۶ کاراکتر باشد';
    }

    if (!formData.degreeCode.trim())
      newErrors.degreeCode = 'کد درجه الزامی است';
    if (!formData.unitCode.trim()) newErrors.unitCode = 'کد یگان الزامی است';
    if (!formData.personnelCode.trim())
      newErrors.personnelCode = 'کد پرسنلی الزامی است';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const userData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      nationalityCode: formData.nationalityCode,
      degreeCode: formData.degreeCode,
      unitCode: formData.unitCode,
      personnelCode: formData.personnelCode,
      enabled: formData.enabled,
    };

    if (mode === 'create') {
      const createRequest: CreateUserRequest = {
        ...userData,
        username: formData.username,
        credentials: [
          {
            type: 'password',
            value: formData.password,
            temporary: false,
          },
        ],
      };

      await createMutation.mutateAsync({
        paginationModel: {},
        searchModel: createRequest,
      });
    } else if (mode === 'edit' && user) {
      const updateRequest: UpdateUserRequest = {
        ...userData,
        id: user.id,
      };

      await updateMutation.mutateAsync({
        paginationModel: {},
        searchModel: updateRequest,
      });
    }
  };

  const handleClose = () => {
    setFormData({
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      nationalityCode: '',
      degreeCode: '',
      unitCode: '',
      personnelCode: '',
      password: '',
      confirmPassword: '',
      enabled: true,
    });
    setErrors({});
    onClose();
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;
  const mutationError = createMutation.error || updateMutation.error;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {mode === 'create' ? 'ایجاد کاربر جدید' : 'ویرایش کاربر'}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {mutationError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {mutationError.response?.data?.message || 'خطا در ذخیره اطلاعات'}
            </Alert>
          )}

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="نام کاربری"
                value={formData.username}
                onChange={e => handleChange('username', e.target.value)}
                error={!!errors.username}
                helperText={errors.username}
                fullWidth
                disabled={mode === 'edit'}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="ایمیل"
                value={formData.email}
                onChange={e => handleChange('email', e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
                fullWidth
                required
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="نام"
                value={formData.firstName}
                onChange={e => handleChange('firstName', e.target.value)}
                error={!!errors.firstName}
                helperText={errors.firstName}
                fullWidth
                required
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="نام خانوادگی"
                value={formData.lastName}
                onChange={e => handleChange('lastName', e.target.value)}
                error={!!errors.lastName}
                helperText={errors.lastName}
                fullWidth
                required
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="کد ملی"
                value={formData.nationalityCode}
                onChange={e => handleChange('nationalityCode', e.target.value)}
                error={!!errors.nationalityCode}
                helperText={errors.nationalityCode}
                fullWidth
                required
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="کد پرسنلی"
                value={formData.personnelCode}
                onChange={e => handleChange('personnelCode', e.target.value)}
                error={!!errors.personnelCode}
                helperText={errors.personnelCode}
                fullWidth
                required
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="کد درجه"
                value={formData.degreeCode}
                onChange={e => handleChange('degreeCode', e.target.value)}
                error={!!errors.degreeCode}
                helperText={errors.degreeCode}
                fullWidth
                required
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="کد یگان"
                value={formData.unitCode}
                onChange={e => handleChange('unitCode', e.target.value)}
                error={!!errors.unitCode}
                helperText={errors.unitCode}
                fullWidth
                required
              />
            </Grid>

            {mode === 'create' && (
              <>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="رمز عبور"
                    type="password"
                    value={formData.password}
                    onChange={e => handleChange('password', e.target.value)}
                    error={!!errors.password}
                    helperText={errors.password}
                    fullWidth
                    required
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="تکرار رمز عبور"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={e =>
                      handleChange('confirmPassword', e.target.value)
                    }
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    fullWidth
                    required
                  />
                </Grid>
              </>
            )}

            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.enabled}
                    onChange={e => handleChange('enabled', e.target.checked)}
                    color="primary"
                  />
                }
                label="کاربر فعال"
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading}>
          انصراف
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={isLoading}>
          {isLoading
            ? 'در حال ذخیره...'
            : mode === 'create'
              ? 'ایجاد کاربر'
              : 'ذخیره تغییرات'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
