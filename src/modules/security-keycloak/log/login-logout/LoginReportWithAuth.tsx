import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Divider,
  Alert,
  Button,
  CircularProgress,
} from '@mui/material';
import { useApiQuery } from '@/hooks/useApi';
import keycloakApis from '../../apis';
import { LoginReportFilters } from './LoginReportFilters';
import { LoginReportTable } from './LoginReportTable';
import type {
  LoginActivity,
  LoginReportQueryParams,
  LoginReportFilters as FiltersType,
} from '../../types';

interface LoginReportWithAuthProps {
  userToken?: string;
}


const fetchAdminToken = async (retries = 3): Promise<string> => {
  try {
    const response = await fetch(keycloakApis.loginReport.token, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      // body: new URLSearchParams({
      //   client_id: 'springboot-be',
      //   client_secret: 'ZR9MN6MKhy8WEO7uDyPZpYNgpvPDrMAL',
      //   grant_type: 'password',
      //   username: 'admin',
      //   password: 'admin',
      // }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.access_token;
  } catch (error) {
    if (retries > 0) {
      console.warn(`Token fetch failed, ${retries} retries left`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return fetchAdminToken(retries - 1);
    }
    throw new Error('خطا در دریافت توکن مدیریت');
  }
};

const convertFarsiNumbersToLatin = (str: string) => {
  const farsiToLatin = {
    '۰': '0',
    '۱': '1',
    '۲': '2',
    '۳': '3',
    '۴': '4',
    '۵': '5',
    '۶': '6',
    '۷': '7',
    '۸': '8',
    '۹': '9',
  };
  return str.replace(/[۰-۹]/g, char => farsiToLatin[char]);
};

export function LoginReportWithAuth({ userToken }: LoginReportWithAuthProps) {
  const [filters, setFilters] = useState<FiltersType>({
    ipAddress: '',
    username: '',
    activityType: '',
    startDate: null,
    endDate: null,
  });
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [isFetchingToken, setIsFetchingToken] = useState(false);


  useEffect(() => {
    const getAdminToken = async () => {
      if (userToken) {
        setAdminToken(userToken);
        return;
      }

      setIsFetchingToken(true);
      setTokenError(null);
      try {
        const token = await fetchAdminToken();
        setAdminToken(token);
      } catch (error) {
        setTokenError(error instanceof Error ? error.message : 'خطای ناشناخته');
      } finally {
        setIsFetchingToken(false);
      }
    };

    getAdminToken();
  }, [userToken]);

  const buildQueryParams = useCallback((): LoginReportQueryParams => {
    const params: LoginReportQueryParams = {};

    if (filters.username) params.username = filters.username;
    if (filters.ipAddress) params.ipAddress = filters.ipAddress;
    if (filters.activityType) params.type = filters.activityType;

    if (filters.startDate) {
      const startDateValue = convertFarsiNumbersToLatin(
        filters.startDate.format('YYYY-MM-DD')
      );
      params.startDate = startDateValue;
    }

    if (filters.endDate) {
      const endDateValue = convertFarsiNumbersToLatin(
        filters.endDate.format('YYYY-MM-DD')
      );
      params.endDate = endDateValue;
    }

    return params;
  }, [filters]);

  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useApiQuery<LoginActivity[], LoginReportQueryParams>({
    url: keycloakApis.loginReport.list,
    params: {
      paginationModel: {
        page: paginationModel.pageSize,
        offset: paginationModel.page,
      },
      searchModel: buildQueryParams(),
    },
    config: {
      headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {},
    },
    enabled: !!adminToken,
  });

  const handleSearch = () => {
    setPaginationModel(prev => ({ ...prev, page: 0 }));
    refetch();
  };

  const handleReset = () => {
    setFilters({
      ipAddress: '',
      username: '',
      activityType: '',
      startDate: null,
      endDate: null,
    });
    setPaginationModel({ page: 0, pageSize: 10 });
    setTimeout(() => refetch(), 100);
  };

  const handlePaginationChange = (model: any) => {
    setPaginationModel(model);
  };

  const handleRetryToken = async () => {
    setIsFetchingToken(true);
    setTokenError(null);
    try {
      const token = await fetchAdminToken();
      setAdminToken(token);
    } catch (error) {
      setTokenError(error instanceof Error ? error.message : 'خطای ناشناخته');
    } finally {
      setIsFetchingToken(false);
    }
  };

  const loginActivities = response?.data || [];
  const rowCount = response?.meta?.pagination?.count || 0;

  if (isFetchingToken) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height={200}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (tokenError) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={handleRetryToken}>
              تلاش مجدد
            </Button>
          }
        >
          {tokenError}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: 'bold', mb: 2 }}
        >
          گزارش ورود کاربران
        </Typography>
        <Divider sx={{ mb: 3 }} />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          خطا در دریافت داده‌ها:{' '}
          {error.response?.data?.message || error.message}
        </Alert>
      )}

      <LoginReportFilters
        filters={filters}
        onFiltersChange={setFilters}
        onSearch={handleSearch}
        onReset={handleReset}
        loading={isLoading}
      />

      <LoginReportTable
        data={loginActivities}
        loading={isLoading}
        paginationModel={paginationModel}
        onPaginationChange={handlePaginationChange}
        rowCount={rowCount}
      />
    </Container>
  );
}
