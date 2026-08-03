import type { GridColDef } from '@mui/x-data-grid';
import { Box, Chip } from '@mui/material';
import { MatnaDataGrid } from '../../../../components/data-grid/MatnaDataGrid';
import type { LoginActivity } from '../../types';

interface LoginReportTableProps {
  data: LoginActivity[];
  loading: boolean;
  paginationModel: { page: number; pageSize: number };
  onPaginationChange: (model: any) => void;
  rowCount: number;
}

const getActivityTypeLabel = (type: string) => {
  const typeMapping = {
    LOGIN: 'ورود به سامانه',
    LOGOUT: 'خروج از سامانه',
    LOGIN_ERROR: 'خطای ورود به سامانه',
    LOGOUT_ERROR: 'خطای خروج از سامانه',
  };
  return typeMapping[type as keyof typeof typeMapping] || 'مشخص نشده';
};

const getActivityTypeColor = (type: string) => {
  const colorMapping = {
    LOGIN: 'success',
    LOGOUT: 'info',
    LOGIN_ERROR: 'error',
    LOGOUT_ERROR: 'warning',
  };
  return colorMapping[type as keyof typeof colorMapping] || 'default';
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

export function LoginReportTable({
  data,
  loading,
  paginationModel,
  onPaginationChange,
  rowCount,
}: LoginReportTableProps) {
  const columns: GridColDef<LoginActivity>[] = [
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
      flex: 1,
      renderCell: params => (
        <Chip
          label={getActivityTypeLabel(params.value)}
          color={getActivityTypeColor(params.value) as any}
          size="small"
        />
      ),
    },
  ];


  const rows = data.map((item, index) => ({
    id: `${item.time}-${item.ipAddress}-${index}`, // Unique ID for each row
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
