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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
} from '@mui/material';
import {
  Security as SecurityIcon,
  Logout as TerminateIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useApiQuery, useApiMutation } from '@/hooks/useApi';
import keycloakApis from '../../apis';
import { SessionFilters } from './SessionFilters';
import { ActiveSessionsTable } from './ActiveSessionsTable';
import type { ActiveSession, SessionQueryParams } from '../../types';

export function SessionManagementEnhanced() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sessionType, setSessionType] = useState('');
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [selectedSessions, setSelectedSessions] = useState<ActiveSession[]>([]);
  const [bulkTerminateDialogOpen, setBulkTerminateDialogOpen] = useState(false);

  // Build query params from filters
  const buildQueryParams = useCallback((): SessionQueryParams => {
    const params: SessionQueryParams = {
      offset: paginationModel.page * paginationModel.pageSize,
      limit: paginationModel.pageSize,
    };

    return params;
  }, [paginationModel]);

  // Fetch active sessions data
  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useApiQuery<ActiveSession[], SessionQueryParams>({
    url: keycloakApis.session.list,
    params: buildQueryParams(),
  });

  // Bulk terminate mutation
  const bulkTerminateMutation = useApiMutation<any, any>({
    url: keycloakApis.session.terminate,
    method: 'POST',
    onSuccess: () => {
      refetch();
      setBulkTerminateDialogOpen(false);
      setSelectedSessions([]);
    },
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

  const handleBulkTerminate = () => {
    if (selectedSessions.length > 0) {
      setBulkTerminateDialogOpen(true);
    }
  };

  const confirmBulkTerminate = async () => {
    // Terminate all selected sessions
    const terminatePromises = selectedSessions.map(session =>
      bulkTerminateMutation.mutateAsync({
        paginationModel: {},
        searchModel: {
          sessionId: session.id,
          username: session.username,
        },
      })
    );

    await Promise.all(terminatePromises);
  };

  const cancelBulkTerminate = () => {
    setBulkTerminateDialogOpen(false);
  };

  // Filter data based on search term and session type
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

  // Initial fetch on component mount
  useEffect(() => {
    refetch();
  }, []);

  const allSessions = response?.data || [];
  const filteredSessions = filterSessions(allSessions);
  const rowCount = response?.meta?.pagination?.count || 0;

  // Statistics
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
          <Box flex={1}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
              مدیریت نشست‌های فعال
            </Typography>
            <Typography variant="body1" color="text.secondary">
              نمایش و مدیریت نشست‌های فعال کاربران در سیستم
            </Typography>
          </Box>

          {selectedSessions.length > 0 && (
            <Box display="flex" alignItems="center" gap={1}>
              <Chip
                label={`${selectedSessions.length} نشست انتخاب شده`}
                color="primary"
                variant="outlined"
              />
              <Button
                variant="contained"
                color="error"
                startIcon={<TerminateIcon />}
                onClick={handleBulkTerminate}
                disabled={bulkTerminateMutation.isPending}
              >
                خاتمه همه ({selectedSessions.length})
              </Button>
            </Box>
          )}
        </Box>
        <Divider />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          خطا در دریافت داده‌ها:{' '}
          {error.response?.data?.message || error.message}
        </Alert>
      )}

      {bulkTerminateMutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          خطا در خاتمه نشست‌ها:{' '}
          {bulkTerminateMutation.error?.response?.data?.message ||
            'خطای ناشناخته'}
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

      {/* Bulk Terminate Confirmation Dialog */}
      <Dialog
        open={bulkTerminateDialogOpen}
        onClose={cancelBulkTerminate}
        aria-labelledby="bulk-terminate-dialog"
      >
        <DialogTitle id="bulk-terminate-dialog">
          تایید خاتمه چندین نشست
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            آیا از خاتمه {selectedSessions.length} نشست انتخابی اطمینان دارید؟
            این عمل باعث خروج کاربران زیر از سیستم خواهد شد:
          </DialogContentText>
          <Box sx={{ mt: 2, maxHeight: 200, overflow: 'auto' }}>
            {selectedSessions.map((session, index) => (
              <Chip
                key={session.id}
                label={session.username}
                size="small"
                sx={{ m: 0.5 }}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={cancelBulkTerminate}
            disabled={bulkTerminateMutation.isPending}
          >
            انصراف
          </Button>
          <Button
            onClick={confirmBulkTerminate}
            color="error"
            variant="contained"
            disabled={bulkTerminateMutation.isPending}
            startIcon={<TerminateIcon />}
          >
            {bulkTerminateMutation.isPending
              ? 'در حال پردازش...'
              : `خاتمه ${selectedSessions.length} نشست`}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
