import type { GridColDef } from '@mui/x-data-grid';
import { Box, Chip } from '@mui/material';
import { MatnaDataGrid } from '../../../../components/data-grid/MatnaDataGrid';
import type { SecurityEvent, SecurityEventType } from '../../types';

interface SecurityEventsTableProps {
  data: SecurityEvent[];
  loading: boolean;
  paginationModel: { page: number; pageSize: number };
  onPaginationChange: (model: any) => void;
  rowCount: number;
}

const getActivityTypeLabel = (type: SecurityEventType) => {
  const typeMapping: Record<SecurityEventType, string> = {
    LOGIN: 'ورود به سامانه',
    LOGOUT: 'خروج از سامانه',
    LOGIN_ERROR: 'خطای ورود به سامانه',
    LOGOUT_ERROR: 'خطای خروج از سامانه',
    CLIENT_LOGIN: 'ورود کلاینت',
    PERMISSION_TOKEN: 'دسترسی توکن',
    RESET_PASSWORD_ERROR: 'خطای بازنشانی رمز عبور',
    CODE_TO_TOKEN_ERROR: 'خطای توکن',
  };
  return typeMapping[type] || type;
};

const getActivityTypeColor = (type: SecurityEventType) => {
  const colorMapping: Record<
    string,
    'success' | 'info' | 'error' | 'warning' | 'default'
  > = {
    LOGIN: 'success',
    LOGOUT: 'info',
    LOGIN_ERROR: 'error',
    LOGOUT_ERROR: 'warning',
    CLIENT_LOGIN: 'success',
    PERMISSION_TOKEN: 'info',
    RESET_PASSWORD_ERROR: 'error',
    CODE_TO_TOKEN_ERROR: 'warning',
  };
  return colorMapping[type] || 'default';
};

const parseDetailsJson = (detailsJson: string) => {
  try {
    return JSON.parse(detailsJson);
  } catch (error) {
    return { username: 'keycloak' };
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return 'بدون تاریخ';

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  };

  return new Date(dateString).toLocaleDateString('fa-IR', options);
};

export function SecurityEventsTable({
  data,
  loading,
  paginationModel,
  onPaginationChange,
  rowCount,
}: SecurityEventsTableProps) {
  const columns: GridColDef<SecurityEvent>[] = [
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
      valueGetter: (_, row) => {
        const details = parseDetailsJson(row.detailsJson);
        return details.username || 'keycloak';
      },
    },
    {
      field: 'ipAddress',
      headerName: 'آدرس IP',
      flex: 1,
    },
    {
      field: 'time',
      headerName: 'زمان',
      flex: 1.2,
      valueFormatter: value => formatDate(value),
    },
    {
      field: 'type',
      headerName: 'نوع فعالیت',
      flex: 1.2,
      renderCell: params => (
        <Chip
          label={getActivityTypeLabel(params.value)}
          color={getActivityTypeColor(params.value) as any}
          size="small"
          variant="outlined"
        />
      ),
    },
  ];


  const rows = data.map((item, index) => ({
    id: `${item.time}-${item.ipAddress}-${index}`, 
    ...item,
  }));

  return (
    <MatnaDataGrid
      rows={rows}
      columns={columns}
      loading={loading}
      paginationModel={paginationModel}
      onPaginationModelChange={onPaginationChange}
      rowCount={rowCount}
      paginationMode="server"
    />
  );
}
