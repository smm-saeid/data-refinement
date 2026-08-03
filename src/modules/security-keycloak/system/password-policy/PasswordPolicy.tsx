// components/passwordPolicy/PasswordPolicy.tsx
import { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import {
  Box,
  Card,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Stack,
} from '@mui/material';
import { usePasswordPolicy } from './usePasswordPolicy';
import { PasswordPolicyFormFields } from './PasswordPolicyFormFields';
import { type PasswordPolicy as PasswordPolicyType } from '../../types';
import { NotificationProvider } from '../../NotificationContext';

// Helper function to transform API response to form data
function transformPolicyData(apiData: any): PasswordPolicyType {
  if (!apiData) {
    return getEmptyDefaults();
  }

  console.log('Transforming API data to form:', apiData);

  return {
    forceExpiredPasswordChange: apiData.forceExpiredPasswordChange ?? 0,
    hashIterations: apiData.hashIterations ?? 0,
    passwordHistory: apiData.passwordHistory ?? 0,
    regexPattern: apiData.regexPattern ?? null,
    notUsername: apiData.notUsername ?? false,
    minLength: apiData.minLength ?? 0,
    notEmail: apiData.notEmail ?? false,
    specialChars: apiData.specialChars ?? 0,
    upperCase: apiData.upperCase ?? 0,
    lowerCase: apiData.lowerCase ?? 0,
    digits: apiData.digits ?? 0,
    maxAuthAge: apiData.maxAuthAge ?? 0,
    hashAlgorithm: apiData.hashAlgorithm ?? null,
    maxLength: apiData.maxLength ?? 0,
    passwordBlacklist: apiData.passwordBlacklist ?? null,
    accessTokenLifespan: apiData.accessTokenLifespan ?? 3600,
  };
}

// Helper function to provide empty defaults when policyData is not available
function getEmptyDefaults(): PasswordPolicyType {
  return {
    forceExpiredPasswordChange: 0,
    hashIterations: 0,
    passwordHistory: 0,
    regexPattern: null,
    notUsername: false,
    minLength: 0,
    notEmail: false,
    specialChars: 0,
    upperCase: 0,
    lowerCase: 0,
    digits: 0,
    maxAuthAge: 0,
    hashAlgorithm: null,
    maxLength: 0,
    passwordBlacklist: null,
    accessTokenLifespan: 3600,
  };
}

export function PasswordPolicy() {
  return (
    <NotificationProvider>
      <PasswordPolicyContext />
    </NotificationProvider>
  );
}

export function PasswordPolicyContext() {
  const { policyData, loading, error, fetchPolicy, savePolicy, isSaving } =
    usePasswordPolicy();

  console.log('Raw policyData from API:', policyData);

  // Initialize form with empty defaults first
  const methods = useForm<PasswordPolicyType>({
    defaultValues: getEmptyDefaults(),
    mode: 'onChange',
  });

  const {
    handleSubmit,
    reset,
    formState: { isDirty },
  } = methods;

  // Reset form when policyData changes - THIS IS CRITICAL
  useEffect(() => {
    if (policyData) {
      console.log('Setting form data from policyData:', policyData);
      const formData = transformPolicyData(policyData);
      console.log('Transformed form data for reset:', formData);
      reset(formData);
    }
  }, [policyData, reset]);

  const onSubmit = async (data: PasswordPolicyType) => {
    console.log('Submitting form data:', data);
    await savePolicy(data);
  };

  const handleReset = () => {
    if (policyData) {
      const formData = transformPolicyData(policyData);
      reset(formData);
    } else {
      reset(getEmptyDefaults());
    }
  };

  // Show loading state only on initial load, not when refreshing existing data
  if (loading && !policyData) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography
          variant="h5"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: 'rgba(0, 0, 0, 0.9)',
            mb: 3,
          }}
        >
          قوانین و مقررات تنظیم رمز عبور
        </Typography>
        <Card
          sx={{
            maxWidth: '90%',
            mx: 'auto',
            p: 3,
          }}
        >
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        </Card>
      </Box>
    );
  }

  if (error && !policyData) {
    return (
      <Alert
        severity="error"
        sx={{ m: 2 }}
        action={
          <Button color="inherit" size="small" onClick={fetchPolicy}>
            تلاش مجدد
          </Button>
        }
      >
        خطا در دریافت اطلاعات سیاست رمز عبور:
        {error.response?.data?.message || error.message}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h5"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          color: 'rgba(0, 0, 0, 0.9)',
          mb: 3,
        }}
      >
        قوانین و مقررات تنظیم رمز عبور
      </Typography>

      <Card
        sx={{
          maxWidth: '90%',
          mx: 'auto',
          p: 3,
          '&:hover': {
            boxShadow: 3,
            transition: 'box-shadow 0.3s ease-in-out',
          },
        }}
      >
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <PasswordPolicyFormFields />

            {/* Fixed Button Layout - Larger and Better Arrangement */}
            <Stack
              direction="row"
              spacing={2}
              justifyContent="center"
              sx={{ mt: 4 }}
            >
              <Button
                type="button"
                variant="outlined"
                size="large"
                onClick={handleReset}
                disabled={!isDirty || isSaving}
                sx={{
                  minWidth: 120,
                  py: 1.5,
                  fontSize: '1rem',
                }}
              >
                بازنشانی
              </Button>

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={!isDirty || isSaving}
                sx={{
                  minWidth: 150,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  bgcolor: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                }}
              >
                {isSaving ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    در حال ذخیره...
                  </>
                ) : (
                  'ذخیره سیاست‌ها'
                )}
              </Button>
            </Stack>
          </form>
        </FormProvider>
      </Card>
    </Box>
  );
}
