import { useState, useEffect, useCallback } from 'react';
import { Box, Container, Typography, Divider, Alert } from '@mui/material';
import { useApiQuery } from '@/hooks/useApi';
import keycloakApis from '../../apis';
import { PAGINATION_DEFAULT_VALUE } from '@/types/api';
import { LoginReportFilters } from './LoginReportFilters';
import { LoginReportTable } from './LoginReportTable';
import type {
  LoginActivity,
  LoginReportQueryParams,
  LoginReportFilters as FiltersType,
} from '../../types';

// Token fetch function (you might want to move this to a separate auth service)
const fetchToken = async () => {
  try {
    const response = await fetch(keycloakApis.loginReport.token, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: 'springboot-be',
        client_secret: 'ZR9MN6MKhy8WEO7uDyPZpYNgpvPDrMAL',
        grant_type: 'password',
        username: 'admin',
        password: 'admin',
      }),
    });
    const result = await response.json();
    return result.access_token;
  } catch (error) {
    throw new Error('خطا در دریافت توکن');
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

export function LoginReport() {
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

  const [externalToken, setExternalToken] = useState<string | null>(null);

  // Build query params from filters
  const buildQueryParams = useCallback((): LoginReportQueryParams => {
    const params: LoginReportQueryParams = {};

    if (filters.username) params.username = filters.username;
    if (filters.ipAddress) params.ipAddress = filters.ipAddress;
    if (filters.activityType) params.type = filters.activityType;

    // Format dates
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

  // Fetch login report data
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
    // You might need to handle token injection here based on your auth setup
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
    // Refetch with empty filters after a short delay to allow state update
    setTimeout(() => refetch(), 100);
  };

  const handlePaginationChange = (model: any) => {
    setPaginationModel(model);
  };

  const loginActivities = response?.data || [];
  const rowCount = response?.meta?.pagination?.count || 0;

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
