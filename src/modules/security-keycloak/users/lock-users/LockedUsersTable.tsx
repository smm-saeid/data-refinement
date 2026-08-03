import { useState } from 'react';
import type { GridColDef } from '@mui/x-data-grid';
import { Box, Button, Chip, Alert } from '@mui/material';
import { LockOpen as UnlockIcon } from '@mui/icons-material';
import {
  useKeycloakApiMutation,
  useKeycloakApiQuery,
} from '../../../../hooks/useApiKeycloak';
import { MatnaDataGrid } from '../../../../components/data-grid/MatnaDataGrid';
import keycloakApis from '../../apis';
import type { LockedUser } from '../../types';
import { useNotification } from '../../NotificationContext';

interface LockedUsersTableProps {
  users: LockedUser[];
  loading: boolean;
  onUnlockRequest: (user: LockedUser) => void;
  paginationModel: { page: number; pageSize: number };
  onPaginationChange: (model: any) => void;
  rowCount: number;
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'بدون تاریخ';
  const date = new Date(dateString);
  return date.toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
};

const getLockTypeLabel = (lockType: string) => {
  const typeMapping = {
    PERMANENT: 'قفل دایم',
    TEMPORARY: 'قفل موقت',
  };
  return typeMapping[lockType as keyof typeof typeMapping] || 'مشخص نشده';
};

const getLockTypeColor = (lockType: string) => {
  const colorMapping = {
    PERMANENT: 'error',
    TEMPORARY: 'warning',
  };
  return colorMapping[lockType as keyof typeof colorMapping] || 'default';
};

export function LockedUsersTable({
  users,
  loading,
  onUnlockRequest,
  paginationModel,
  onPaginationChange,
  rowCount,
}: LockedUsersTableProps) {
  const { showNotification } = useNotification();

  // Fix: Ensure users is always an array and add proper IDs
  const rows = Array.isArray(users) 
    ? users.map((user, index) => ({
        id: user.username || `user-${index}`,
        ...user,
      }))
    : [];

  const columns: GridColDef<LockedUser>[] = [
    {
      field: 'rowIndex',
      headerName: 'ردیف',
      flex: 0.5,
      renderCell: params => {
        const page = paginationModel.page;
        const pageSize = paginationModel.pageSize;
        return (
          page * pageSize +
          params.api.getRowIndexRelativeToVisibleRows(params.id) +
          1
        );
      },
    },
    {
      field: 'username',
      headerName: 'نام کاربری',
      flex: 1,
    },
    {
      field: 'firstName',
      headerName: 'نام',
      flex: 1,
      valueGetter: (_, row) => row.firstName || 'نامشخص',
    },
    {
      field: 'lastName',
      headerName: 'نام خانوادگی',
      flex: 1,
      valueGetter: (_, row) => row.lastName || 'نامشخص',
    },
    {
      field: 'lockDate',
      headerName: 'زمان قفل',
      flex: 1,
      valueFormatter: (value: string) => formatDate(value),
    },
    {
      field: 'ipAddress',
      headerName: 'آدرس IP',
      flex: 1,
    },
    {
      field: 'lockType',
      headerName: 'نوع محدودیت',
      flex: 1,
      renderCell: params => (
        <Chip
          label={getLockTypeLabel(params.value)}
          color={getLockTypeColor(params.value) as any}
          size="small"
          variant="filled"
        />
      ),
    },
    {
      field: 'lockStatus',
      headerName: 'وضعیت',
      flex: 1,
      renderCell: params => (
        <Chip
          label={params.value === 'LOCKED' ? 'قفل شده' : 'فعال'}
          color={params.value === 'LOCKED' ? 'error' : 'success'}
          size="small"
          variant="filled"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'عملیات',
      flex: 1,
      renderCell: params => (
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={() => onUnlockRequest(params.row)}
          startIcon={<UnlockIcon />}
        >
          باز کردن قفل
        </Button>
      ),
    },
  ];

  return (
    <Box>
      {!Array.isArray(users) && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          داده‌ها به صورت صحیح دریافت نشده‌اند.
        </Alert>
      )}

      <MatnaDataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationChange}
        rowCount={rowCount}
        paginationMode="server"
      />
    </Box>
  );
}