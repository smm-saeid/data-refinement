import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControlLabel,
  Switch,
  Button,
  Paper,
  Typography,
  Divider,
  Grid as Grid,
  Alert,
  FormHelperText,
  Card,
  CardContent,
} from '@mui/material';
import {
  Security as SecurityIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useKeycloakApiMutation } from '../../../../hooks/useApiKeycloak';
import keycloakApis from '../../apis';
import type { BruteForceConfig } from '../../types';

interface BruteForceSettingsFormEnhancedProps {
  initialData: BruteForceConfig | null;
  onSuccess: () => void;
  loading?: boolean;
}

interface FormErrors {
  failureFactor?: string;
  maxTemporaryLockouts?: string;
  waitIncrementSeconds?: string;
  maxFailureWaitSeconds?: string;
  maxDeltaTimeSeconds?: string;
  quickLoginCheckMilliSeconds?: string;
  minimumQuickLoginWaitSeconds?: string;
}

export function BruteForceSettingsFormEnhanced({
  initialData,
  onSuccess,
  loading = false,
}: BruteForceSettingsFormEnhancedProps) {
  const [formData, setFormData] = useState<BruteForceConfig>({
    bruteForceProtected: true,
    failureFactor: 6,
    maxTemporaryLockouts: 1,
    bruteForceStrategy: null,
    waitIncrementSeconds: 300,
    maxFailureWaitSeconds: 300,
    maxDeltaTimeSeconds: 720,
    quickLoginCheckMilliSeconds: 1000,
    minimumQuickLoginWaitSeconds: 60,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const updateMutation = useKeycloakApiMutation<any, any>({
    url: keycloakApis.bruteForce.update,
    method: 'POST',
    onSuccess: () => {
      onSuccess();
    },
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (formData.failureFactor < 1 || formData.failureFactor > 10) {
      newErrors.failureFactor = 'تعداد مجاز تلاش ناموفق باید بین ۱ تا ۱۰ باشد';
    }

    if (
      formData.maxTemporaryLockouts < 0 ||
      formData.maxTemporaryLockouts > 5
    ) {
      newErrors.maxTemporaryLockouts =
        'حداکثر قفل‌های موقت باید بین ۰ تا ۵ باشد';
    }

    if (
      formData.waitIncrementSeconds < 60 ||
      formData.waitIncrementSeconds > 3600
    ) {
      newErrors.waitIncrementSeconds =
        'افزایش زمان انتظار باید بین ۶۰ تا ۳۶۰۰ ثانیه باشد';
    }

    if (
      formData.maxFailureWaitSeconds < 60 ||
      formData.maxFailureWaitSeconds > 7200
    ) {
      newErrors.maxFailureWaitSeconds =
        'حداکثر زمان انتظار پس از شکست باید بین ۶۰ تا ۷۲۰۰ ثانیه باشد';
    }

    if (
      formData.maxDeltaTimeSeconds < 300 ||
      formData.maxDeltaTimeSeconds > 86400
    ) {
      newErrors.maxDeltaTimeSeconds =
        'حداکثر اختلاف زمانی باید بین ۳۰۰ تا ۸۶۴۰۰ ثانیه باشد';
    }

    if (
      formData.quickLoginCheckMilliSeconds < 100 ||
      formData.quickLoginCheckMilliSeconds > 5000
    ) {
      newErrors.quickLoginCheckMilliSeconds =
        'بررسی سریع ورود باید بین ۱۰۰ تا ۵۰۰۰ میلی‌ثانیه باشد';
    }

    if (
      formData.minimumQuickLoginWaitSeconds < 10 ||
      formData.minimumQuickLoginWaitSeconds > 3600
    ) {
      newErrors.minimumQuickLoginWaitSeconds =
        'حداقل زمان انتظار برای ورود سریع باید بین ۱۰ تا ۳۶۰۰ ثانیه باشد';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const requestBody = {
      paginationModel: {},
      searchModel: formData,
    };

    await updateMutation.mutateAsync(requestBody);
  };

  const handleChange = (field: keyof BruteForceConfig, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleReset = () => {
    if (initialData) {
      setFormData(initialData);
    }
    setErrors({});
  };

  const isLoading = loading || updateMutation.isPending;

  return (
    <Paper sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <SecurityIcon color="primary" sx={{ fontSize: 40 }} />
        <Box>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            تنظیمات امنیتی ورود به سامانه
          </Typography>
          <Typography variant="body2" color="text.secondary">
            مدیریت تنظیمات محافظت در برابر حملات Brute Force و تنظیمات امنیتی
            ورود
          </Typography>
        </Box>
      </Box>

      {updateMutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          خطا در ذخیره تنظیمات:{' '}
          {updateMutation.error?.response?.data?.message || 'خطای ناشناخته'}
        </Alert>
      )}

      {/* Security Warning Card */}
      <Card sx={{ mb: 3, bgcolor: 'warning.light' }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <WarningIcon color="warning" />
            <Typography variant="h6" component="div">
              توجه: تنظیمات امنیتی حساس
            </Typography>
          </Box>
          <Typography variant="body2">
            تغییر این تنظیمات می‌تواند بر امنیت سیستم تأثیر بگذارد. لطفاً تنها
            در صورت اطمینان از تغییرات، اقدام به ویرایش کنید.
          </Typography>
        </CardContent>
      </Card>

      <Box component="form" onSubmit={handleSubmit}>
        <Divider sx={{ my: 2 }}>
          تنظیمات محافظت در برابر حمله Brute Force
        </Divider>

        <Grid container spacing={3}>
          {/* Protection Switch */}
          <Grid size={{ xs: 12 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.bruteForceProtected}
                  onChange={e =>
                    handleChange('bruteForceProtected', e.target.checked)
                  }
                  color="primary"
                />
              }
              label="فعال‌سازی محافظت در برابر حمله Brute Force"
            />
            <FormHelperText>
              در صورت فعال بودن، سیستم در برابر حملات brute force از حساب‌های
              کاربری محافظت می‌کند
            </FormHelperText>
          </Grid>

          {/* Failure Factor */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="تعداد مجاز تلاش ناموفق"
              type="number"
              value={formData.failureFactor}
              onChange={e =>
                handleChange('failureFactor', Number(e.target.value))
              }
              error={!!errors.failureFactor}
              helperText={
                errors.failureFactor ||
                'تعداد دفعاتی که کاربر می‌تواند رمز عبور اشتباه وارد کند'
              }
              fullWidth
              size="small"
              inputProps={{ min: 1, max: 10 }}
            />
          </Grid>

          {/* Max Temporary Lockouts */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="حداکثر قفل‌های موقت"
              type="number"
              value={formData.maxTemporaryLockouts}
              onChange={e =>
                handleChange('maxTemporaryLockouts', Number(e.target.value))
              }
              error={!!errors.maxTemporaryLockouts}
              helperText={
                errors.maxTemporaryLockouts ||
                'تعداد دفعاتی که حساب کاربری می‌تواند به طور موقت قفل شود'
              }
              fullWidth
              size="small"
              inputProps={{ min: 0, max: 5 }}
            />
          </Grid>

          {/* Wait Increment */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="افزایش زمان انتظار (ثانیه)"
              type="number"
              value={formData.waitIncrementSeconds}
              onChange={e =>
                handleChange('waitIncrementSeconds', Number(e.target.value))
              }
              error={!!errors.waitIncrementSeconds}
              helperText={
                errors.waitIncrementSeconds ||
                'مدت زمانی که پس از هر شکست به زمان انتظار اضافه می‌شود'
              }
              fullWidth
              size="small"
              inputProps={{ min: 60, max: 3600 }}
            />
          </Grid>

          {/* Max Failure Wait */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="حداکثر زمان انتظار پس از شکست (ثانیه)"
              type="number"
              value={formData.maxFailureWaitSeconds}
              onChange={e =>
                handleChange('maxFailureWaitSeconds', Number(e.target.value))
              }
              error={!!errors.maxFailureWaitSeconds}
              helperText={
                errors.maxFailureWaitSeconds ||
                'حداکثر زمانی که کاربر پس از شکست‌های متوالی باید منتظر بماند'
              }
              fullWidth
              size="small"
              inputProps={{ min: 60, max: 7200 }}
            />
          </Grid>

          {/* Max Delta Time */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="حداکثر اختلاف زمانی (ثانیه)"
              type="number"
              value={formData.maxDeltaTimeSeconds}
              onChange={e =>
                handleChange('maxDeltaTimeSeconds', Number(e.target.value))
              }
              error={!!errors.maxDeltaTimeSeconds}
              helperText={
                errors.maxDeltaTimeSeconds ||
                'حداکثر زمان مجاز بین درخواست‌های ورود'
              }
              fullWidth
              size="small"
              inputProps={{ min: 300, max: 86400 }}
            />
          </Grid>

          {/* Quick Login Check */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="بررسی سریع ورود (میلی‌ثانیه)"
              type="number"
              value={formData.quickLoginCheckMilliSeconds}
              onChange={e =>
                handleChange(
                  'quickLoginCheckMilliSeconds',
                  Number(e.target.value)
                )
              }
              error={!!errors.quickLoginCheckMilliSeconds}
              helperText={
                errors.quickLoginCheckMilliSeconds ||
                'مدت زمان بررسی برای ورود سریع'
              }
              fullWidth
              size="small"
              inputProps={{ min: 100, max: 5000 }}
            />
          </Grid>

          {/* Minimum Quick Login Wait */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="حداقل زمان انتظار برای ورود سریع (ثانیه)"
              type="number"
              value={formData.minimumQuickLoginWaitSeconds}
              onChange={e =>
                handleChange(
                  'minimumQuickLoginWaitSeconds',
                  Number(e.target.value)
                )
              }
              error={!!errors.minimumQuickLoginWaitSeconds}
              helperText={
                errors.minimumQuickLoginWaitSeconds ||
                'حداقل زمانی که کاربر باید برای ورود سریع منتظر بماند'
              }
              fullWidth
              size="small"
              inputProps={{ min: 10, max: 3600 }}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }} display="flex" gap={2}>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            sx={{ flex: 1 }}
            size="large"
          >
            {isLoading ? 'در حال ذخیره...' : 'ثبت تغییرات'}
          </Button>
          <Button
            type="button"
            variant="outlined"
            onClick={handleReset}
            disabled={isLoading}
            sx={{ flex: 1 }}
            size="large"
          >
            بازنشانی
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
