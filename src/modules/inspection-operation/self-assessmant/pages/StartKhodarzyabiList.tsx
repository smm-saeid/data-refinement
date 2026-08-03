import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import {
  Box,
  Button,
  Paper,
  Skeleton,
  Typography,
  TextField,
  MenuItem,
} from '@mui/material';
import { MatnaDataGrid } from '@/components/data-grid/MatnaDataGrid.tsx';
import { useApiQuery } from '@/hooks/useApi';
import { PAGINATION_DEFAULT_VALUE_OLD, type PaginationQueryParam } from '@/types/api.ts';
import type { GridColDef } from '@mui/x-data-grid';
import SelfassessmentApis from '@/modules/inspection-operation/self-assessmant/apis';

interface InspectionQueryParams {
  year?: number;
  season?: string;
  status?: string;
}

interface InspectionItem {
  id: string;
  organizationUnitName: string;
  season: string;
  forceOrganizationUnitName: string;
  annualPlanInspectionName: string;
  status: string;
  orgType?: string;
}
const StartKhodarzyabiList = () => {
  const navigate = useNavigate();

  const [filters, setFilters] = useState<PaginationQueryParam<InspectionQueryParams>>({
    ...PAGINATION_DEFAULT_VALUE_OLD,
    year: 1404,
    season: '',
    status: 'not executed',
  });


  const { data: response, isLoading, error, refetch } = useApiQuery<
    InspectionItem[],
    PaginationQueryParam<InspectionQueryParams>
  >({
    url: SelfassessmentApis.selfassessment.notexecution,
    params: filters,
  });

  const updateFilters = (updates: Partial<InspectionQueryParams>) => {
    setFilters((prev) => ({
      ...prev,
      ...updates,
      page: 1,
    }));
  };

  const resetFilters = () => {
    setFilters({
      ...PAGINATION_DEFAULT_VALUE_OLD,
      year: 1404,
      season: '',
      status: 'not executed',
    });
  };

  const handlePaginationChange = (model) => {
    setFilters(prev => ({
      ...prev,
      page: model.page + 1,
      pageSize: model.pageSize,
    }));
  };

  const getSeasonLabel = (season: string) => {
    const seasonLabels: { [key: string]: string } = {
      'FIRST_SEASON': 'اول',
      'SECOND_SEASON': 'دوم',
      'THIRD_SEASON': 'سوم',
      'FORTH_SEASON': 'چهارم'
    };
    return seasonLabels[season] || season;
  };

  const getStatusLabel = (status: string) => {
    const statusLabels: { [key: string]: string } = {
      'not executed': 'انجام نشده',
      'initialized': 'در انتظار اجرا',
      'on the execution': 'در حال اجرا',
      'executed': 'انجام شده'
    };
    return statusLabels[status] || status;
  };

  const columns: GridColDef<InspectionItem>[] = useMemo(() => [
    {
      field: 'organizationUnitName',
      headerName: 'یگان',
      flex: 2,
      minWidth: 200,
    },
    {
      field: 'season',
      headerName: 'سه‌ماهه',
      flex: 1,
      minWidth: 100,
      valueGetter: (_value, row) => getSeasonLabel(row.season),
    },
    {
      field: 'forceOrganizationUnitName',
      headerName: 'نیرو',
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'annualPlanInspectionName',
      headerName: 'نوع بازرسی',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'orgType',
      headerName: 'ماهیت',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'status',
      headerName: 'وضعیت',
      flex: 1,
      minWidth: 120,
      valueGetter: (_value, row) => getStatusLabel(row.status),
    },
    {
      field: 'actions',
      headerName: 'عملیات',
      flex: 1,
      minWidth: 180,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <Button
          variant="contained"
          color="success"
          size="small"
          onClick={() => navigate(`/inspection/KHOD_ARZYABI/START_EXECUTION/${row.id}`, { state: { row } })}
        >
          شروع خودارزیابی
        </Button>
      ),
    },
  ], [navigate]);

  if (error) {
    return (
      <Box p={2}>
        <Paper sx={{ p: 2, bgcolor: 'error.light', color: 'error.contrastText' }}>
          <Typography variant="body1" gutterBottom>
            خطا در دریافت اطلاعات
          </Typography>
          <Typography variant="body2" gutterBottom>
            {error.response?.data?.message || error.message}
          </Typography>
          <Button
            onClick={() => refetch()}
            variant="contained"
            sx={{ mt: 1 }}
          >
            تلاش مجدد
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: '100vw', p: 2, boxSizing: 'border-box' }}>
      {/* Header */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography fontWeight={700} variant="h5">
            بازرسی های انجام نشده
          </Typography>

          <TextField
            label="سال"
            value={filters.year || 1404}
            onChange={(e) => updateFilters({ year: parseInt(e.target.value) })}
            size="small"
            sx={{ minWidth: 120 }}
            type="number"
          />
        </Box>

        {/* Filters */}
        <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
          <TextField
            label="سه‌ماهه"
            value={filters.season || ''}
            onChange={(e) => updateFilters({ season: e.target.value })}
            size="small"
            select
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="">همه</MenuItem>
            <MenuItem value="ONE_SEASON">اول</MenuItem>
            <MenuItem value="SECOND_SEASON">دوم</MenuItem>
            <MenuItem value="THIRD_SEASON">سوم</MenuItem>
            <MenuItem value="FORTH_SEASON">چهارم</MenuItem>
          </TextField>

          <Button variant="outlined" onClick={resetFilters}>
            بازنشانی فیلترها
          </Button>

          <Button variant="contained" onClick={() => refetch()}>
            بروزرسانی
          </Button>
        </Box>
      </Paper>

      {/* Data Grid */}
      {isLoading ? (
        <Skeleton
          variant="rectangular"
          height={400}
          sx={{ borderRadius: 1 }}
        />
      ) : (
        <MatnaDataGrid
          rows={response?.data || []}
          columns={columns}
          loading={isLoading}
          paginationModel={{
            page: (response?.meta?.pagination?.currentPage || 1) - 1,
            pageSize: response?.meta?.pagination?.pageSize || 10
          }}
          rowCount={response?.meta?.pagination?.count || 0}
          onPaginationModelChange={handlePaginationChange}
        />
      )}
    </Box>
  );
};

export default StartKhodarzyabiList;