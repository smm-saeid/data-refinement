import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Divider,
  Alert,
  Button,
  Card,
  CardContent,
} from '@mui/material';
import { Security as SecurityIcon } from '@mui/icons-material';
import { useApiQuery } from '@/hooks/useApi';
import keycloakApis from '../../apis';
import { SessionFilters } from './SessionFilters';
import { ActiveSessionsTable } from './ActiveSessionsTable';
import type { ActiveSession, SessionQueryParams } from '../../types';

export function SessionManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sessionType, setSessionType] = useState('');
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });


  const buildQueryParams = useCallback((): SessionQueryParams => {
    const params: SessionQueryParams = {
      offset: paginationModel.page * paginationModel.pageSize,
      limit: paginationModel.pageSize,
    };

    return params;
  }, [paginationModel]);


  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useApiQuery<ActiveSession[], SessionQueryParams>({
    url: keycloakApis.session.list,
    params: buildQueryParams(),
  });

  const handleSearch = () => {
    setPaginationModel(prev => ({ ...prev, page: 0 }));
    refetch();
  };

  const handleRefresh = () => {
    refetch();
  };

  const handlePaginationChange = (model: any) => {
    setPaginationModel(model);
  };

  const handleSuccess = () => {
    refetch();
  };

  
  const filterSessions = useCallback(
    (sessions: ActiveSession[]) => {
      let filtered = sessions;

      if (searchTerm.trim()) {
        filtered = filtered.filter(session =>
          session.username.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (sessionType) {
        filtered = filtered.filter(session => session.type === sessionType);
      }

      return filtered;
    },
    [searchTerm, sessionType]
  );


  useEffect(() => {
    refetch();
  }, []);

  const allSessions = response?.data || [];
  const filteredSessions = filterSessions(allSessions);
  const rowCount = response?.meta?.pagination?.count || 0;


  const totalSessions = allSessions.length;
  const activeLogins = allSessions.filter(s => s.type === 'LOGIN').length;
  const clientSessions = allSessions.filter(
    s => s.type === 'CLIENT_LOGIN'
  ).length;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <SecurityIcon color="primary" sx={{ fontSize: 40 }} />
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
              مدیریت نشست‌های فعال
            </Typography>
            <Typography variant="body1" color="text.secondary">
              نمایش و مدیریت نشست‌های فعال کاربران در سیستم
            </Typography>
          </Box>
        </Box>
        <Divider />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          خطا در دریافت داده‌ها:{' '}
          {error.response?.data?.message || error.message}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              کل نشست‌ها
            </Typography>
            <Typography variant="h4" component="div" color="primary">
              {totalSessions}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              ورودهای فعال
            </Typography>
            <Typography variant="h4" component="div" color="success.main">
              {activeLogins}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              نشست‌های کلاینت
            </Typography>
            <Typography variant="h4" component="div" color="info.main">
              {clientSessions}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <SessionFilters
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        sessionType={sessionType}
        onSessionTypeChange={setSessionType}
        onSearch={handleSearch}
        onRefresh={handleRefresh}
        loading={isLoading}
      />

      <ActiveSessionsTable
        data={filteredSessions}
        loading={isLoading}
        onSuccess={handleSuccess}
        paginationModel={paginationModel}
        onPaginationChange={handlePaginationChange}
        rowCount={rowCount}
      />
    </Container>
  );
}
