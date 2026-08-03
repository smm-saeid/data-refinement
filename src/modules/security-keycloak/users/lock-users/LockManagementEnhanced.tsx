import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';

import keycloakApis from '../../apis';
import { LockedUsersFilters } from './LockedUsersFilters';
import { LockedUsersTable } from './LockedUsersTable';
import type { LockedUser, LockUserQueryParams } from '../../types';
import {
  useKeycloakApiMutation,
  useKeycloakApiQuery,
} from '../../../../hooks/useApiKeycloak';
import { NotificationProvider } from '../../NotificationContext';

export function LockManagementEnhanced() {
  return (
    <NotificationProvider>
      <LockManagementEnhancedContext />
    </NotificationProvider>
  );
}

export function LockManagementEnhancedContext() {
  const [searchUsername, setSearchUsername] = useState('');
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<LockedUser | null>(null);

  // Build query params from search
  const buildQueryParams = useCallback((): LockUserQueryParams => {
    const params: LockUserQueryParams = {};

    if (searchUsername.trim()) {
      params.username = searchUsername;
    }

    return params;
  }, [searchUsername]);

  const requestBody = {
    paginationModel: {
      offset: 0,
      pageSize: 10,
    },
    searchModel: buildQueryParams() || undefined,
  };

  // Fetch locked users data
  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useKeycloakApiQuery<any, LockUserQueryParams>({
    url: keycloakApis.lockManagement.search,
    config: {
      data: requestBody,
    },
  });

  // Unlock mutation
  const unlockMutation = useKeycloakApiMutation<any, any>({
    url: keycloakApis.lockManagement.unlock,
    method: 'POST',
    onSuccess: () => {
      refetch();
      setConfirmDialogOpen(false);
      setSelectedUser(null);
    },
  });

  const handleSearch = () => {
    setPaginationModel(prev => ({ ...prev, page: 0 }));
    refetch();
  };

  const handlePaginationChange = (model: any) => {
    setPaginationModel(model);
  };

  const handleUnlockRequest = (user: LockedUser) => {
    setSelectedUser(user);
    setConfirmDialogOpen(true);
  };

  const handleConfirmUnlock = async () => {
    if (selectedUser) {
      await unlockMutation.mutateAsync({
        paginationModel: {},
        searchModel: { username: selectedUser.username },
      });
    }
  };

  const handleCancelUnlock = () => {
    setConfirmDialogOpen(false);
    setSelectedUser(null);
  };

  // Initial fetch on component mount
  useEffect(() => {
    refetch();
  }, []);

  // Fix: Access responseList from the API response
  const lockedUsers = response?.data?.responseList || [];
  const rowCount = lockedUsers.length;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: 'bold', mb: 2 }}
        >
          مدیریت کاربران قفل شده
        </Typography>
        <Divider sx={{ mb: 3 }} />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          خطا در دریافت داده‌ها:{' '}
          {error.response?.data?.message || error.message}
        </Alert>
      )}

      {unlockMutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          خطا در باز کردن قفل:{' '}
          {unlockMutation.error?.response?.data?.message || 'خطای ناشناخته'}
        </Alert>
      )}

      <LockedUsersFilters
        searchUsername={searchUsername}
        onSearchUsernameChange={setSearchUsername}
        onSearch={handleSearch}
        loading={isLoading}
      />

      <LockedUsersTable
        users={lockedUsers}
        loading={isLoading}
        onUnlockRequest={handleUnlockRequest}
        paginationModel={paginationModel}
        onPaginationChange={handlePaginationChange}
        rowCount={rowCount}
      />

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={handleCancelUnlock}
        aria-labelledby="unlock-confirmation-dialog"
      >
        <DialogTitle
          id="unlock-confirmation-dialog"
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <WarningIcon color="warning" />
          تایید باز کردن قفل کاربر
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            آیا از باز کردن قفل کاربر <strong>{selectedUser?.username}</strong>{' '}
            اطمینان دارید؟
            {selectedUser?.lockType === 'PERMANENT' && (
              <Box
                component="span"
                sx={{ color: 'warning.main', display: 'block', mt: 1 }}
              >
                توجه: این کاربر به صورت دایم قفل شده است.
              </Box>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCancelUnlock}
            disabled={unlockMutation.isPending}
          >
            انصراف
          </Button>
          <Button
            onClick={handleConfirmUnlock}
            variant="contained"
            color="primary"
            disabled={unlockMutation.isPending}
            startIcon={<WarningIcon />}
          >
            {unlockMutation.isPending ? 'در حال پردازش...' : 'باز کردن قفل'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
