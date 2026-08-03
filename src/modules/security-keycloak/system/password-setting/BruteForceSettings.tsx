import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useKeycloakApiQuery } from '../../../../hooks/useApiKeycloak';
import keycloakApis from '../../apis';
import { BruteForceSettingsFormEnhanced } from './BruteForceSettingsFormEnhanced';
import type { BruteForceConfig } from '../../types';
import {
  NotificationProvider,
  useNotification,
} from '../../NotificationContext';

export function BruteForceSettings() {
  return (
    <NotificationProvider>
      <BruteForceSettingsContext />
    </NotificationProvider>
  );
}

export function BruteForceSettingsContext() {
  const [configData, setConfigData] = useState<BruteForceConfig | null>(null);
  const { showNotification } = useNotification();

  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useKeycloakApiQuery<any>({
    url: keycloakApis.bruteForce.get,
  });

  useEffect(() => {
    if (response?.data?.responseList?.[0]?.searchModel) {
      setConfigData(response.data.responseList[0].searchModel);
      showNotification('اطلاعات با موفقیت یافت شد');
    }
  }, [response]);

  console.log(
    'response?.data?.responseList?.[0]',
    response?.data?.responseList?.[0]?.searchModel
  );

  const handleSuccess = () => {
    refetch();
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          خطا در دریافت تنظیمات:{' '}
          {error.response?.data?.message || error.message}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: 'bold', mb: 2 }}
        >
          تنظیمات امنیتی سیستم
        </Typography>
        <Typography variant="body1" color="text.secondary">
          مدیریت تنظیمات محافظت در برابر حملات Brute Force و سایر تنظیمات امنیتی
          ورود
        </Typography>
        <Divider sx={{ mb: 3 }} />
      </Box> */}
      {/* 
      {!isLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height={200}
        >
          <CircularProgress />
        </Box>
      ) : (
        <BruteForceSettingsFormEnhanced
          initialData={configData}
          onSuccess={handleSuccess}
          loading={isLoading}
        />
      )} */}
      <BruteForceSettingsFormEnhanced
        initialData={configData}
        onSuccess={handleSuccess}
        loading={isLoading}
      />
    </Container>
  );
}
