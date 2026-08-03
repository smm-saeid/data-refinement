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
} from '@mui/material';
import { useApiMutation } from '@/hooks/useApi';
import keycloakApis from '../../apis';
import type { BruteForceConfig } from '../../types';
import { useNotification } from '../../NotificationContext';

interface BruteForceSettingsFormProps {
  initialData: BruteForceConfig | null;
  onSuccess: () => void;
  loading?: boolean;
}

export function BruteForceSettingsForm({
  initialData,
  onSuccess,
  loading = false,
}: BruteForceSettingsFormProps) {
  const { showNotification } = useNotification();
  const updateMutation = useApiMutation<any, any>({
    url: keycloakApis.bruteForce.update,
    method: 'POST',
    onSuccess: () => {
      onSuccess();
      showNotification('اطلاعات با موفقیت ویرایش شد');
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || 'خطای ناشناخته در ویرایش اطلاعات';
      showNotification(errorMessage, 'error');
    },
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const configData: BruteForceConfig = {
      bruteForceProtected: formData.get('bruteForceProtected') === 'on',
      failureFactor: Number(formData.get('failureFactor')) || 6,
      maxTemporaryLockouts: Number(formData.get('maxTemporaryLockouts')) || 1,
      bruteForceStrategy:
        (formData.get('bruteForceStrategy') as string) || null,
      waitIncrementSeconds: Number(formData.get('waitIncrementSeconds')) || 300,
      maxFailureWaitSeconds:
        Number(formData.get('maxFailureWaitSeconds')) || 300,
      maxDeltaTimeSeconds: Number(formData.get('maxDeltaTimeSeconds')) || 720,
      quickLoginCheckMilliSeconds:
        Number(formData.get('quickLoginCheckMilliSeconds')) || 1000,
      minimumQuickLoginWaitSeconds:
        Number(formData.get('minimumQuickLoginWaitSeconds')) || 60,
    };

    const requestBody = {
      paginationModel: {},
      searchModel: configData,
    };

    await updateMutation.mutateAsync(requestBody);
  };

  const isLoading = loading || updateMutation.isPending;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
        تنظیمات ورود به سامانه
      </Typography>

      {updateMutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          خطا در ذخیره تنظیمات:{' '}
          {updateMutation.error?.response?.data?.message || 'خطای ناشناخته'}
        </Alert>
      )}

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
                  name="bruteForceProtected"
                  defaultChecked={initialData?.bruteForceProtected ?? true}
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
              name="failureFactor"
              label="تعداد مجاز تلاش ناموفق"
              type="number"
              defaultValue={initialData?.failureFactor || 6}
              fullWidth
              size="small"
              inputProps={{ min: 1, max: 10 }}
              helperText="تعداد دفعاتی که کاربر می‌تواند رمز عبور اشتباه وارد کند"
            />
          </Grid>

          {/* Max Temporary Lockouts */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              name="maxTemporaryLockouts"
              label="حداکثر قفل‌های موقت"
              type="number"
              defaultValue={initialData?.maxTemporaryLockouts || 1}
              fullWidth
              size="small"
              inputProps={{ min: 0, max: 5 }}
              helperText="تعداد دفعاتی که حساب کاربری می‌تواند به طور موقت قفل شود"
            />
          </Grid>

          {/* Wait Increment */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              name="waitIncrementSeconds"
              label="افزایش زمان انتظار (ثانیه)"
              type="number"
              defaultValue={initialData?.waitIncrementSeconds || 300}
              fullWidth
              size="small"
              inputProps={{ min: 60, max: 3600 }}
              helperText="مدت زمانی که پس از هر شکست به زمان انتظار اضافه می‌شود"
            />
          </Grid>

          {/* Max Failure Wait */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              name="maxFailureWaitSeconds"
              label="حداکثر زمان انتظار پس از شکست (ثانیه)"
              type="number"
              defaultValue={initialData?.maxFailureWaitSeconds || 300}
              fullWidth
              size="small"
              inputProps={{ min: 60, max: 7200 }}
              helperText="حداکثر زمانی که کاربر پس از شکست‌های متوالی باید منتظر بماند"
            />
          </Grid>

          {/* Max Delta Time */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              name="maxDeltaTimeSeconds"
              label="حداکثر اختلاف زمانی (ثانیه)"
              type="number"
              defaultValue={initialData?.maxDeltaTimeSeconds || 720}
              fullWidth
              size="small"
              inputProps={{ min: 300, max: 86400 }}
              helperText="حداکثر زمان مجاز بین درخواست‌های ورود"
            />
          </Grid>

          {/* Quick Login Check */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              name="quickLoginCheckMilliSeconds"
              label="بررسی سریع ورود (میلی‌ثانیه)"
              type="number"
              defaultValue={initialData?.quickLoginCheckMilliSeconds || 1000}
              fullWidth
              size="small"
              inputProps={{ min: 100, max: 5000 }}
              helperText="مدت زمان بررسی برای ورود سریع"
            />
          </Grid>

          {/* Minimum Quick Login Wait */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              name="minimumQuickLoginWaitSeconds"
              label="حداقل زمان انتظار برای ورود سریع (ثانیه)"
              type="number"
              defaultValue={initialData?.minimumQuickLoginWaitSeconds || 60}
              fullWidth
              size="small"
              inputProps={{ min: 10, max: 3600 }}
              helperText="حداقل زمانی که کاربر باید برای ورود سریع منتظر بماند"
            />
          </Grid>

          {/* Brute Force Strategy (Hidden field for API compatibility) */}
          <Grid size={{ xs: 12 }} sx={{ display: 'none' }}>
            <input
              name="bruteForceStrategy"
              value={initialData?.bruteForceStrategy || 'default'}
              readOnly
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            fullWidth
            size="large"
          >
            {isLoading ? 'در حال ذخیره...' : 'ثبت تغییرات'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
