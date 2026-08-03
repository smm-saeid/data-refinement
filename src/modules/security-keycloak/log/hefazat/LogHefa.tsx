import { useEffect, useState } from 'react';
import { Box, Paper, Typography, Divider, useTheme } from '@mui/material';

import { MatnaDataGrid } from '@/components/data-grid/MatnaDataGrid';
import LogSearchForm from './LogSearchForm';
import {
  NotificationProvider,
  useNotification,
} from '../../NotificationContext';
import type {
  LogEntry,
  PaginationState,
  SearchFields,
  LogRequest,
  LogResponse,
} from './types';
import axios from 'axios';

interface RootState {
  user: {
    accessToken: string;
  };
}

export function LogHefa() {
  return (
    <NotificationProvider>
      <LogHefaContext />
    </NotificationProvider>
  );
}

const LogHefaContext = () => {
  const [tableData, setTableData] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationState>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

 
  const token = localStorage.getItem('token');
  const { showError, showSuccess } = useNotification();
  const theme = useTheme();

  const [searchFields, setSearchFields] = useState<SearchFields>({
    clientIp: '',
    username: '',
    serviceName: '',
    status: '',
    startTime: null,
    endTime: null,
  });

  const formatStatusChip = (status: number) => {
    const isSuccess = status === 200;
    return (
      <Box
        sx={{
          backgroundColor: isSuccess
            ? theme.palette.success.main
            : theme.palette.error.main,
          color: 'white',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '0.75rem',
          fontWeight: 'bold',
          textAlign: 'center',
          minWidth: 50,
        }}
      >
        {status}
      </Box>
    );
  };

  const formatDate = (time: string) => {
    try {
      const date = new Date(time);
      return date.toLocaleDateString('fa-IR');
    } catch {
      return time;
    }
  };

  const fetchLogs = async (
    page = 1,
    pageSize = pagination.pageSize,
    filters = searchFields
  ) => {
    setLoading(true);

    try {
      const url = `http://192.180.8.237:4041/log/findAllLog`;

      const requestBody: LogRequest = {
        paginationModel: {
          offset: (page - 1) * pageSize,
          pageSize: pageSize,
        },
        searchModel: {
          clientIp: filters.clientIp || undefined,
          username: filters.username || undefined,
          serviceName: filters.serviceName || undefined,
          status: filters.status || undefined,
          timeFrom: filters.startTime || undefined,
          timeTo: filters.endTime || undefined,
        },
      };

      const response = await axios.post<LogResponse>(url, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data?.content?.length > 0) {
        const logs = response.data.content;
    
        logs.sort(
          (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
        );

        setTableData(logs);
        setPagination(prev => ({
          ...prev,
          current: page,
          pageSize: pageSize,
          total: response.data.totalElements || 0,
        }));

        if (logs.length === 0) {
          showSuccess('اطلاعات با موفقیت دریافت شد اما داده‌ای یافت نشد');
        }
      } else {
        setTableData([]);
        showError('اطلاعات یافت نشد!');
      }
    } catch (error: any) {
      console.error('Error fetching logs:', error);
      showError(
        error.response?.data?.message ||
          error.message ||
          'خطا در دریافت اطلاعات'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleInputChange = (field: keyof SearchFields, value: string) => {
    setSearchFields(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateChange = (
    field: 'startTime' | 'endTime',
    value: string | null
  ) => {
    setSearchFields(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = () => {
    fetchLogs(1, pagination.pageSize, searchFields);
  };

  const handleClearFilters = () => {
    setSearchFields({
      clientIp: '',
      username: '',
      serviceName: '',
      status: '',
      startTime: null,
      endTime: null,
    });
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const columns = [
    {
      field: 'rowIndex',
      headerName: 'ردیف',
      width: 80,
      renderCell: (params: any) => {
        const index = tableData.findIndex(item => item.id === params.row.id);
        return (pagination.current - 1) * pagination.pageSize + index + 1;
      },
    },
    {
      field: 'clientIp',
      headerName: 'IP کاربر',
      width: 130,
      flex: 1,
    },
    {
      field: 'username',
      headerName: 'نام کاربری',
      width: 130,
      flex: 1,
    },
    {
      field: 'serviceName',
      headerName: 'نام سرور',
      width: 150,
      flex: 1,
    },
    {
      field: 'requestUri',
      headerName: 'آدرس ارسال درخواست',
      width: 200,
      flex: 2,
    },
    {
      field: 'roles',
      headerName: 'نقش‌ها',
      width: 150,
      flex: 1,
    },
    {
      field: 'message',
      headerName: 'پیام',
      width: 120,
      flex: 1,
    },
    {
      field: 'time',
      headerName: 'تاریخ',
      width: 120,
      flex: 1,
      renderCell: (params: any) => formatDate(params.row.time),
    },
    {
      field: 'status',
      headerName: 'وضعیت',
      width: 100,
      renderCell: (params: any) => formatStatusChip(params.row.status),
    },
  ];

  return (
    <Box sx={{ p: 3, maxWidth: '100%', overflow: 'hidden' }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h5"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: theme.palette.primary.main,
          }}
        >
          نمایش لاگ های حفاظت اطلاعات
        </Typography>
        <Divider sx={{ my: 2 }} />

        <LogSearchForm
          searchFields={searchFields}
          onInputChange={handleInputChange}
          onDateChange={handleDateChange}
          onSearch={handleSearch}
          onClear={handleClearFilters}
          onKeyPress={handleKeyPress}
          loading={loading}
        />
      </Paper>

      {/* Data Grid */}
      <Paper
        elevation={1}
        sx={{
          mt: 3,
          borderRadius: 2,
          overflow: 'hidden',
          height: 600,
        }}
      >
        <MatnaDataGrid
          rows={tableData}
          columns={columns}
          loading={loading}
          paginationMode="server"
          rowCount={pagination.total}
          pageSizeOptions={[5, 10, 25, 50]}
          paginationModel={{
            page: pagination.current - 1,
            pageSize: pagination.pageSize,
          }}
          onPaginationModelChange={model => {
            fetchLogs(model.page + 1, model.pageSize);
          }}
          sx={{
            '& .MuiDataGrid-cell': {
              borderBottom: `1px solid ${theme.palette.divider}`,
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: theme.palette.primary.main,
              color: 'white',
              fontSize: '0.875rem',
            },
            '& .MuiDataGrid-virtualScroller': {
              backgroundColor: theme.palette.background.paper,
            },
          }}
        />
      </Paper>
    </Box>
  );
};

export default LogHefa;
