import { useMemo, useState } from 'react';
import { Box, Button, Chip, Paper, Typography } from '@mui/material';
import { MatnaDataGrid } from '@/components/data-grid/MatnaDataGrid';
import type { GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import moment from 'moment-jalaali';
import { useNavigate } from 'react-router';
import { PAGINATION_DEFAULT_VALUE_OLD } from '@/types/api';
import type { IQueryParamFilter } from '@/types/types';
import { useQuery } from '@tanstack/react-query';
import paramsSerializer from 'services/paramsSerializer';
import InspectionApis from '@/modules/inspection-operation/api';
import { useLegacyApi } from '@/hooks/useLegacyApi';

type StartOperationRow = {
  id: string;
  organizationUnitName: string;
  season: string;
  forceOrganizationUnitName: string;
  annualPlanInspectionName: string;
  orgType: string;
  status: string;
};

type StartOperationFilters = IQueryParamFilter<{
  year: string;
  status: string;
}>;

const SEASON_LABELS: Record<string, string> = {
  ONE_SEASON: 'سه ماهه اول',
  TWO_SEASON: 'سه ماهه دوم',
  THREE_SEASON: 'سه ماهه سوم',
  FOUR_SEASON: 'سه ماهه چهارم',
};

const STATUS_LABELS: Record<string, string> = {
  'not executed': 'اجرا نشده',
  NOT_EXECUTED: 'اجرا نشده',
  'under execution': 'در حال اجرا',
  UNDER_EXECUTION: 'در حال اجرا',
  executed: 'اجرا شده',
  EXECUTED: 'اجرا شده',
};

const getStatusLabel = (status: string) =>
  STATUS_LABELS[status] || STATUS_LABELS[status?.toUpperCase()] || status || '';

const getSeasonLabel = (season: string) =>
  SEASON_LABELS[season] || SEASON_LABELS[season?.toUpperCase()] || season || '';

const StartOperationList = () => {
  const navigate = useNavigate();
  const legacyApi = useLegacyApi();
  const currentYear = moment(new Date()).jYear().toString();

  const [filters, setFilters] = useState<StartOperationFilters>({
    ...PAGINATION_DEFAULT_VALUE_OLD,
    year: currentYear,
    status: 'NOT_EXECUTED',
  } as StartOperationFilters);

  const serializedFilters = useMemo(
    () =>
      `${InspectionApis.operation.startExecution}${paramsSerializer({
        ...filters,
      })}`,
    [filters]
  );

  const {
    data: response,
    isLoading,
  } = useQuery({
    queryKey: [serializedFilters],
    queryFn: () => legacyApi.get(serializedFilters),
  });

  const rows: StartOperationRow[] =
    response?.data?.rows ?? response?.data ?? [];
  const pagination = response?.meta?.pagination;
  const rowCount = pagination?.count ?? rows.length;
  const pageSize = pagination?.pageSize ?? filters.pageSize ?? 10;
  const currentPage = pagination?.currentPage ?? filters.currentPage ?? 1;

  const columns: GridColDef<StartOperationRow>[] = useMemo(
    () => [
      {
        headerName: 'یگان',
        field: 'organizationUnitName',
        flex: 2,
      },
      {
        headerName: 'سه‌ماهه',
        field: 'season',
        flex: 1,
        renderCell: params => getSeasonLabel(params.row.season),
      },
      {
        headerName: 'نیرو',
        field: 'forceOrganizationUnitName',
        flex: 1,
      },
      {
        headerName: 'نوع بازرسی',
        field: 'annualPlanInspectionName',
        flex: 1,
      },
      {
        headerName: 'ماهیت',
        field: 'orgType',
        flex: 1,
      },
      {
        headerName: 'وضعیت',
        field: 'status',
        flex: 1,
        renderCell: params => (
          <Chip
            label={getStatusLabel(params.row.status)}
            color={params.row.status === 'NOT_EXECUTED' ? 'warning' : 'success'}
            size="small"
          />
        ),
      },
      {
        headerName: 'عملیات',
        field: 'action',
        flex: 1,
        renderCell: params => (
          <Button
            variant="contained"
            color="success"
            onClick={() =>
              navigate(`/operation/START_INSPECTION/${params.row.id}`, {
                state: { row: params.row },
              })
            }
          >
            شروع بازرسی
          </Button>
        ),
      },
    ],
    [navigate]
  );

  const handlePaginationModelChange = (model: GridPaginationModel) => {
    setFilters(prev => ({
      ...prev,
      currentPage: model.page + 1,
      pageSize: model.pageSize,
    }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box
          display="flex"
          flexWrap="wrap"
          gap={2}
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography fontWeight={700} variant="h5">
            بازرسی‌های انجام نشده
          </Typography>
          <Typography color="text.secondary">سال جاری: {currentYear}</Typography>
        </Box>
      </Paper>

      <MatnaDataGrid
        rows={rows}
        columns={columns}
        loading={isLoading}
        rowCount={rowCount}
        paginationModel={{
          page: currentPage - 1,
          pageSize,
        }}
        onPaginationModelChange={handlePaginationModelChange}
        autoHeight
        getRowId={row => row.id}
      />
    </Box>
  );
};

export default StartOperationList;

