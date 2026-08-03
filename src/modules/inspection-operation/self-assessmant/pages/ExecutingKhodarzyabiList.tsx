import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import {
  Box,
  Button,
  Paper,
  Skeleton,
  Typography,
} from '@mui/material';
import { MatnaDataGrid } from '@/components/data-grid/MatnaDataGrid.tsx';
import { useApiQuery } from '@/hooks/useApi';
import {
  PAGINATION_DEFAULT_VALUE_OLD,
  type PaginationQueryParam,
} from '@/types/api.ts';

import SelfassessmentApis from '@/modules/inspection-operation/self-assessmant/apis';
import moment from 'moment-jalaali';
import type { GridColDef } from '@mui/x-data-grid';

interface SelfAssessmentQueryParams {
  year?: string;
  season?: string;
  status?: string;
}

interface SelfAssessmentItem {
  id: string;
  organizationUnitName: string;
  season: string;
  forceOrganizationUnitName: string;
  annualPlanInspectionName: string;
  status: string;
  executionDate?: string;
  orgType?: string;
}

const ExecutingKhodarzyabiList = () => {
  const navigate = useNavigate();
  const currentYear = moment(new Date()).jYear().toString();

  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useApiQuery<
    SelfAssessmentItem[],
    PaginationQueryParam<SelfAssessmentQueryParams>
  >({
    url: SelfassessmentApis.selfassessment.finish,
    params: {
      ...PAGINATION_DEFAULT_VALUE_OLD,
      year: currentYear,
    },
  });

  const getSeasonLabel = (season: string) => {
    const seasonLabels: { [key: string]: string } = {
      FIRST_SEASON: 'اول',
      SECOND_SEASON: 'دوم',
      THIRD_SEASON: 'سوم',
      FORTH_SEASON: 'چهارم',
    };
    return seasonLabels[season] || season;
  };

  const getStatusLabel = (status: string) => {
    const statusLabels: { [key: string]: string } = {
      'not executed': 'پیکربندی',
      initialized: 'در انتظار اجرا',
      'on the execution': 'در حال اجرا',
      executed: 'انجام شده',
    };
    return statusLabels[status] || status;
  };

  const columns: GridColDef<SelfAssessmentItem>[] = useMemo(
    () => [
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
        flex: 0.7,
        minWidth: 100,
        valueGetter: (_value, row) => getStatusLabel(row.status),
      },
      {
        field: 'actions',
        headerName: 'عملیات',
        flex: 1.5,
        minWidth: 200,
        sortable: false,
        filterable: false,
        renderCell: ({ row }) => (
          <Box display="flex" gap={1}>
            <Button
              variant="contained"
              color="info"
              size="small"
              onClick={() =>
                navigate(
                  `/inspection/KHOD_ARZYABI/UNDER_EXECUTION/Documents/${row.id}`
                )
              }
              sx={{ mr: 1 }}
            >
              گزارشات
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() =>
                navigate(`/inspection/KHOD_ARZYABI/UNDER_EXECUTION/${row.id}`)
              }
            >
              مشاهده
            </Button>
          </Box>
        ),
      },
    ],
    [navigate]
  );

  if (error) {
    return (
      <Box p={2}>
        <Paper
          sx={{ p: 2, bgcolor: 'error.light', color: 'error.contrastText' }}
        >
          <Typography variant="body1" gutterBottom>
            خطا در دریافت اطلاعات
          </Typography>
          <Typography variant="body2" gutterBottom>
            {error.response?.data?.message || error.message}
          </Typography>
          <Button onClick={() => refetch()} variant="contained" sx={{ mt: 1 }}>
            تلاش مجدد
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{ width: '100%', maxWidth: '100vw', p: 2, boxSizing: 'border-box' }}
    >
      {/* Header */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography fontWeight={700} variant="h5">
            خودارزیابی انجام شده
          </Typography>
        </Box>
      </Paper>

      {/* Data Grid */}
      {isLoading ? (
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 1 }} />
      ) : (
        <MatnaDataGrid
          rows={response?.data || []}
          columns={columns}
          loading={isLoading}
          paginationModel={{
            page: (response?.meta?.pagination?.currentPage || 1) - 1,
            pageSize: response?.meta?.pagination?.pageSize || 10,
          }}
          rowCount={response?.meta?.pagination?.count || 0}
        />
      )}
    </Box>
  );
};

export default ExecutingKhodarzyabiList;
