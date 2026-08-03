import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

import {
  useKeycloakApiQuery,
  useKeycloakApiMutation,
} from '../../../../hooks/useApiKeycloak';
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Container,
} from '@mui/material';

import keycloakApis from '../../apis';
import type {
  PasswordPolicy,
  PasswordValidation,
  ChangePasswordRequest,
  PasswordInputs,
} from '../../types';
import { PasswordPolicyDisplay } from './PasswordPolicyDisplay';
import {
  NotificationProvider,
  useNotification,
} from '../../NotificationContext';

export function ResetPassword() {
  return (
    <NotificationProvider>
      <ResetPasswordContext />
    </NotificationProvider>
  );
}

export function ResetPasswordContext() {
  const [inputs, setInputs] = useState<PasswordInputs>({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [passwordValidation, setPasswordValidation] =
    useState<PasswordValidation>({
      length: false,
      uppercase: false,
      lowercase: false,
      specialChars: false,
      digits: false,
    });
  const [formErrors, setFormErrors] = useState<Partial<PasswordInputs>>({});
  const { showNotification } = useNotification();

  const navigate = useNavigate();

  const { data: policyResponse, error: policyError } = useKeycloakApiQuery<{
    responseList: PasswordPolicy[];
  }>({
    url: keycloakApis.password.policy,
    params: {},
  });

  const passwordPolicy = policyResponse?.data?.responseList?.[0];

  const changePasswordMutation = useKeycloakApiMutation<
    any,
    ChangePasswordRequest
  >({
    url: keycloakApis.password.change,
    method: 'POST',

    onSuccess: () => {
      handleLogout();
      showNotification('تغییر رمز با موفقیت انجام گردید');
    },
    onError: error => {
      showNotification('خطا در تغییر رمز', 'error');
    },
  });

  const validatePassword = (password: string) => {
    if (!passwordPolicy) return;

    const {
      minLength = 8,
      specialChars = 1,
      upperCase = 1,
      lowerCase = 1,
      digits = 1,
    } = passwordPolicy;

    const regexes = {
      special: /[^A-Za-z0-9]/g,
      uppercase: /[A-Z]/g,
      lowercase: /[a-z]/g,
      digits: /\d/g,
    };

    setPasswordValidation({
      length: password.length >= minLength,
      uppercase: (password.match(regexes.uppercase) || []).length >= upperCase,
      lowercase: (password.match(regexes.lowercase) || []).length >= lowerCase,
      specialChars:
        (password.match(regexes.special) || []).length >= specialChars,
      digits: (password.match(regexes.digits) || []).length >= digits,
    });
  };

  const validateForm = (): boolean => {
    const errors: Partial<PasswordInputs> = {};

    if (!inputs.currentPassword) {
      errors.currentPassword = 'لطفا رمز فعلی را وارد کنید';
    }

    if (!inputs.newPassword) {
      errors.newPassword = 'لطفا رمز جدید را وارد کنید';
    }

    if (!inputs.confirmNewPassword) {
      errors.confirmNewPassword = 'لطفا تکرار رمز عبور را وارد کنید';
    } else if (inputs.confirmNewPassword !== inputs.newPassword) {
      errors.confirmNewPassword = 'رمزهای وارد شده مطابقت ندارند';
    }

    if (inputs.newPassword && passwordPolicy) {
      const {
        minLength = 8,
        specialChars = 1,
        upperCase = 1,
        lowerCase = 1,
        digits = 1,
      } = passwordPolicy;

      const regexes = {
        special: /[^A-Za-z0-9]/g,
        uppercase: /[A-Z]/g,
        lowercase: /[a-z]/g,
        digits: /\d/g,
      };

      const validation = {
        length: inputs.newPassword.length >= minLength,
        uppercase:
          (inputs.newPassword.match(regexes.uppercase) || []).length >=
          upperCase,
        lowercase:
          (inputs.newPassword.match(regexes.lowercase) || []).length >=
          lowerCase,
        specialChars:
          (inputs.newPassword.match(regexes.special) || []).length >=
          specialChars,
        digits:
          (inputs.newPassword.match(regexes.digits) || []).length >= digits,
      };

      if (!Object.values(validation).every(Boolean)) {
        errors.newPassword = 'رمز عبور جدید شرایط لازم را ندارد';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const requestBody: ChangePasswordRequest = {
      paginationModel: {},
      searchModel: {
        currentPassword: inputs.currentPassword,
        newPassword: inputs.newPassword,
        confirmNewPassword: inputs.confirmNewPassword,
      },
    };

    changePasswordMutation.mutate(requestBody);
  };

  const handleInputChange =
    (field: keyof PasswordInputs) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setInputs(prev => ({ ...prev, [field]: value }));

      if (formErrors[field]) {
        setFormErrors(prev => ({ ...prev, [field]: undefined }));
      }

      if (field === 'newPassword') {
        validatePassword(value);
      }
    };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isSupported');
    sessionStorage.removeItem('accessToken');
    navigate('/login');
  };

  const isLoading = changePasswordMutation.isPending;

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f7f7f7',
        py: 4,
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 500,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          align="center"
          gutterBottom
          sx={{ fontWeight: 'bold' }}
        >
          تغییر رمز عبور
        </Typography>

        {(policyError || changePasswordMutation.error) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {policyError
              ? 'خطا در دریافت سیاست رمز عبور'
              : changePasswordMutation.error?.response?.data?.message ||
                'خطا در تغییر رمز عبور'}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="رمز فعلی"
            type="password"
            value={inputs.currentPassword}
            onChange={handleInputChange('currentPassword')}
            error={!!formErrors.currentPassword}
            helperText={formErrors.currentPassword}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="رمز جدید"
            type="password"
            value={inputs.newPassword}
            onChange={handleInputChange('newPassword')}
            error={!!formErrors.newPassword}
            helperText={formErrors.newPassword}
            margin="normal"
            required
          />

          {passwordPolicy && (
            <PasswordPolicyDisplay
              validation={passwordValidation}
              policy={passwordPolicy}
            />
          )}

          <TextField
            fullWidth
            label="تکرار رمز عبور"
            type="password"
            value={inputs.confirmNewPassword}
            onChange={handleInputChange('confirmNewPassword')}
            error={!!formErrors.confirmNewPassword}
            helperText={formErrors.confirmNewPassword}
            margin="normal"
            required
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading}
            sx={{
              mt: 3,
              py: 1.5,
              fontWeight: 'bold',
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'تغییر رمز عبور'
            )}
          </Button>
        </Box>
      </Card>
    </Container>
  );
}
