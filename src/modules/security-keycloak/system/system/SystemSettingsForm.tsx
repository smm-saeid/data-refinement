// SystemSettingsForm.tsx
import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Divider,
  Grid as Grid,
  Alert,
} from '@mui/material';
import {
  useKeycloakApiQuery,
  useKeycloakApiMutation,
} from '../../../../hooks/useApiKeycloak';
import { SettingField } from './SettingField';
import keycloakApis from '../../apis';
import {
  MILLISECONDS_IN_MINUTE,
  MINUTES_IN_HOUR,
  HOURS_IN_DAY,
  DAYS_IN_WEEK,
  TIME_OPTIONS,
} from '../system/constants';
import type {
  SystemSetting,
  PasswordPolicy,
  SettingField as SettingFieldType,
} from '../../types';

interface SystemSettingsFormProps {
  onCommonPasswordsOpen: () => void;
}

export function SystemSettingsForm({
  onCommonPasswordsOpen,
}: SystemSettingsFormProps) {
  const [settings, setSettings] = useState<Partial<PasswordPolicy>>({});
  const [hasChanges, setHasChanges] = useState(false);

  const {
    data: response,
    isLoading,
    refetch,
  } = useKeycloakApiQuery<SystemSetting[]>({
    url: keycloakApis.settings.list,
  });

  const updateMutation = useKeycloakApiMutation<any, Partial<PasswordPolicy>>({
    url: keycloakApis.settings.update,
    method: 'POST',
    onSuccess: () => {
      refetch();
      setHasChanges(false);
    },
  });

  useEffect(() => {
    if (response?.data) {
      const settingsObject = response.data.responseList?.[0].reduce(
        (acc, setting) => ({
          ...acc,
          [setting.key]: setting.value,
        }),
        {}
      );
      setSettings(settingsObject);
    }
  }, [response]);

  const settingFields: SettingFieldType[] = [
    {
      label: 'زمان پایان نشست (دقیقه)',
      name: 'token_expiration',
      type: 'select',
      options: () =>
        TIME_OPTIONS.tokenExpiration.map(i => ({
          value: `${MILLISECONDS_IN_MINUTE * i}`,
          text: `دقیقه ${i}`,
        })),
    },
    {
      label: 'تعداد آخرین کلمات عبور غیر قابل استفاده توسط کاربر',
      name: 'prevent_previous_password',
      type: 'select',
      options: () =>
        TIME_OPTIONS.preventPreviousPassword.map(i => ({
          value: `${i}`,
          text: `${i}`,
        })),
    },
    {
      label: 'بازه زمانی تغییر رمز عبور کاربر (هفته)',
      name: 'password_expiration',
      type: 'select',
      options: () =>
        TIME_OPTIONS.passwordExpiration.map(i => ({
          value: `${MILLISECONDS_IN_MINUTE * MINUTES_IN_HOUR * HOURS_IN_DAY * DAYS_IN_WEEK * i}`,
          text: `هفته ${i}`,
        })),
    },
    {
      label: 'تعداد تلاش ناموفق مجاز',
      name: 'max_login_attempt',
      type: 'select',
      options: () =>
        TIME_OPTIONS.maxLoginAttempt.map(i => ({
          value: `${i}`,
          text: `بار ${i}`,
        })),
    },
    {
      label: 'بازه زمانی قفل کاربر',
      name: 'lock_user_duration',
      type: 'select',
      options: () => [
        ...TIME_OPTIONS.lockUserDuration.minutes.map(i => ({
          value: `${MILLISECONDS_IN_MINUTE * i}`,
          text: `دقیقه ${i}`,
        })),
        ...TIME_OPTIONS.lockUserDuration.hours.map(i => ({
          value: `${MINUTES_IN_HOUR * MILLISECONDS_IN_MINUTE * i}`,
          text: `${i} ساعت`,
        })),
      ],
    },
    {
      label: 'حداقل طول رمز عبور',
      name: 'min_password_length',
      type: 'select',
      options: () =>
        TIME_OPTIONS.minPasswordLength.map(i => ({
          value: `${i}`,
          text: `${i} کاراکتر`,
        })),
    },
    {
      label: 'الزام استفاده از حروف بزرگ در رمز عبور',
      name: 'uppercase_password_policy',
      type: 'switch',
    },
    {
      label: 'الزام استفاده از ارقام در رمز عبور',
      name: 'number_password_policy',
      type: 'switch',
    },
    {
      label: 'الزام استفاده از کارکترهای ویژه در رمز عبور',
      name: 'symbol_password_policy',
      type: 'switch',
    },
    {
      label: 'کلمه‌های عبور رایج',
      name: 'prevent_common_password_policy',
      type: 'switch',
      btnText: 'تنظیم کلمه عبور',
    },
  ];

  const handleSettingChange = (name: string, value: any) => {
    setSettings(prev => ({ ...prev, [name]: value }));
    setHasChanges(true);
  };

  const handleSubmit = async () => {
    await updateMutation.mutateAsync(settings);
  };

  const handleReset = () => {
    if (response?.data) {
      const settingsObject = response.data.responseList?.[0].reduce(
        (acc, setting) => ({
          ...acc,
          [setting.key]: setting.value,
        }),
        {}
      );
      setSettings(settingsObject);
    }
    setHasChanges(false);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
        تنظیمات سیستم
      </Typography>

      {updateMutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          خطا در ذخیره تنظیمات
        </Alert>
      )}

      <Box component="form">
        <Grid container spacing={3}>
          {settingFields.map((field, index) => (
            <Grid key={field.name} size={{ xs: 12, lg: 6 }}>
              <SettingField
                field={field}
                value={settings[field.name]}
                onChange={handleSettingChange}
                onButtonClick={
                  field.name === 'prevent_common_password_policy'
                    ? onCommonPasswordsOpen
                    : undefined
                }
              />
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!hasChanges || updateMutation.isPending}
          >
            {updateMutation.isPending ? 'در حال ذخیره...' : 'ثبت تنظیمات'}
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleReset}
            disabled={!hasChanges}
          >
            مقادیر پیش فرض
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
