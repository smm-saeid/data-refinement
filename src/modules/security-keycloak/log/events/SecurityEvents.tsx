import { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Container, Typography, Divider, Alert } from '@mui/material';
import { useKeycloakApiQuery } from '../../../../hooks/useApiKeycloak';
import {
  NotificationProvider,
  useNotification,
} from '../../NotificationContext';
import keycloakApis from '../../apis';
import { SecurityEventsFilters } from './SecurityEventsFilters';
import { SecurityEventsTable } from './SecurityEventsTable';
import type {
  SecurityEvent,
  SecurityEventsFilters as FiltersType,
} from '../../types';

export function SecurityEvents() {
  return (
    <NotificationProvider>
      <SecurityEventsContext />
    </NotificationProvider>
  );
}

export function SecurityEventsContext() {
  const { showError, showSuccess, showInfo } = useNotification();

  const [filters, setFilters] = useState<FiltersType>({
    ipAddress: '',
    username: '',
    activityType: '',
    startDate: null,
    endDate: null,
  });

  const [searchFilters, setSearchFilters] = useState<FiltersType>({
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

  const hasSearched = useRef(false);
  const lastDataCount = useRef(0);
  const lastError = useRef<string | null>(null);

  const buildQueryParams = useCallback(() => {
    const params: any = {
      paginationModel: {
        page: paginationModel.page + 1,
        offset: paginationModel.page * paginationModel.pageSize,
        pageSize: paginationModel.pageSize,
      },
      // searchMode: {
      //   activityType: 'LOGIN',
      // },
    };

    const hasSearchFilters =
      searchFilters.username ||
      searchFilters.ipAddress ||
      searchFilters.activityType ||
      searchFilters.startDate ||
      searchFilters.endDate;

    if (hasSearchFilters) {
      params.searchModel = {
        ...(searchFilters.username && { username: searchFilters.username }),
        ...(searchFilters.ipAddress && { ipAddress: searchFilters.ipAddress }),
        ...(searchFilters.activityType && { type: searchFilters.activityType }),
        ...(searchFilters.startDate && { startDate: searchFilters.startDate }),
        ...(searchFilters.endDate && { endDate: searchFilters.endDate }),
      };
    }

    return params;
  }, [paginationModel, searchFilters]);

  const {
    data: response,
    isLoading,
    error,
    isFetching,
  } = useKeycloakApiQuery<SecurityEvent[]>({
    url: keycloakApis.securityEvents.list,
    config: {
      data: buildQueryParams(),
    },
    queryKey: [
      'security-events',
      paginationModel.page,
      paginationModel.pageSize,
      searchFilters,
    ],
    enabled: hasSearched.current,
  });

  useEffect(() => {
    if (error && hasSearched.current) {
      const errorMessage = error.response?.data?.message || error.message;

      if (errorMessage !== lastError.current) {
        showError(
          `خطا در دریافت داده‌ها:  برای مشاهده وقایع امنیتی، لطفاً جستجو کنید`
        );
        lastError.current = errorMessage;
      }
    } else {
      lastError.current = null;
    }
  }, [error, showError]);

  useEffect(() => {
    if (!isLoading && !isFetching && response?.data && hasSearched.current) {
      const currentDataCount = response.data.length;
      const totalCount = response.meta?.pagination?.count || 0;

      if (currentDataCount !== lastDataCount.current) {
        if (currentDataCount === 0) {
          showInfo('هیچ رویدادی با فیلترهای اعمال شده یافت نشد');
        } else if (totalCount > 0) {
          showSuccess(`${totalCount.toLocaleString('fa-IR')} رویداد یافت شد`);
        }
        lastDataCount.current = currentDataCount;
      }
    }
  }, [response, isLoading, isFetching, showSuccess, showInfo]);

  const handleSearch = useCallback(() => {
    hasSearched.current = true;

    const hasActiveFilters =
      filters.username.trim() ||
      filters.ipAddress.trim() ||
      filters.activityType ||
      filters.startDate ||
      filters.endDate;

    if (hasActiveFilters) {
      showInfo('در حال جستجو با فیلترهای اعمال شده...');
    } else {
      showInfo('در حال جستجو...');
    }

    setSearchFilters(filters);
    setPaginationModel(prev => ({ ...prev, page: 0 }));
  }, [filters, showInfo]);

  const handleReset = useCallback(() => {
    const resetFilters = {
      ipAddress: '',
      username: '',
      activityType: '',
      startDate: null,
      endDate: null,
    };

    setFilters(resetFilters);
    setSearchFilters(resetFilters);
    setPaginationModel({ page: 0, pageSize: 10 });

    hasSearched.current = false;
    lastDataCount.current = 0;

    showSuccess('همه فیلترها پاک شدند');
  }, [showSuccess]);

  const handlePaginationChange = (model: any) => {
    if (hasSearched.current) {
      setPaginationModel(model);
    }
  };

  const securityEvents = hasSearched.current
    ? Array.isArray(response?.data)
      ? response.data
      : []
    : [];
  const rowCount = hasSearched.current
    ? response?.meta?.pagination?.count || 0
    : 0;
  const totalPages = hasSearched.current
    ? response?.meta?.pagination?.totalPages || 0
    : 0;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}
        >
          📊 گزارش وقایع امنیتی سامانه
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 2, color: 'text.secondary' }}>
          مشاهده و مدیریت تمام فعالیت‌های امنیتی سیستم
        </Typography>
        <Divider sx={{ mb: 3 }} />
      </Box>

      {/* Statistics Summary */}
      {hasSearched.current &&
        !isLoading &&
        !error &&
        securityEvents.length > 0 && (
          <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Typography
              variant="body2"
              sx={{ color: 'success.main', fontWeight: 'bold' }}
            >
              ✅ تعداد کل رویدادها: {(rowCount || 0).toLocaleString('fa-IR')}
            </Typography>
            {totalPages > 0 && (
              <Typography
                variant="body2"
                sx={{ color: 'info.main', fontWeight: 'bold' }}
              >
                📄 تعداد صفحات: {totalPages.toLocaleString('fa-IR')}
              </Typography>
            )}
            <Typography
              variant="body2"
              sx={{ color: 'warning.main', fontWeight: 'bold' }}
            >
              🔍 صفحه فعلی: {(paginationModel.page + 1).toLocaleString('fa-IR')}
            </Typography>
          </Box>
        )}

      <SecurityEventsFilters
        filters={filters}
        onFiltersChange={setFilters}
        onSearch={handleSearch}
        onReset={handleReset}
        loading={isLoading || isFetching}
      />

      {/* Initial State - Prompt user to search */}
      {!hasSearched.current && (
        <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
          <Typography variant="body2" fontWeight="bold">
            🔍 برای مشاهده وقایع امنیتی، لطفاً جستجو کنید
          </Typography>
          <Typography variant="body2">
            فیلترهای مورد نظر خود را تنظیم کرده و روی دکمه «جستجو» کلیک کنید.
          </Typography>
        </Alert>
      )}

      {/* Show table only when user has searched */}
      {hasSearched.current && (
        <SecurityEventsTable
          data={securityEvents}
          loading={isLoading || isFetching}
          paginationModel={paginationModel}
          onPaginationChange={handlePaginationChange}
          rowCount={rowCount}
        />
      )}

      {/* Loading Indicator */}
      {(isLoading || isFetching) && hasSearched.current && (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2" sx={{ color: 'info.main' }}>
            🔄 در حال بارگیری داده‌ها...
          </Typography>
        </Box>
      )}

      {/* Empty State after search */}
      {hasSearched.current &&
        !isLoading &&
        !isFetching &&
        !error &&
        securityEvents.length === 0 && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2" fontWeight="bold">
              ℹ️ هیچ داده‌ای یافت نشد
            </Typography>
            <Typography variant="body2">
              لطفاً فیلترهای جستجو را تنظیم کنید یا شرایط جستجو را تغییر دهید.
            </Typography>
          </Alert>
        )}
    </Container>
  );
}
