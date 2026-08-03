import { useApiQuery } from 'hooks/useApi.ts';
import UnitPortalApis from 'modules/unit-portal/apis.ts';
import { useMemo } from 'react';
import type { GridColDef } from '@mui/x-data-grid';
import { Box, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import { MatnaDataGrid } from 'components/data-grid/MatnaDataGrid.tsx';
import jalali from '@/lib/jalali.ts';
import {
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { NavLink } from 'react-router';
import { InspectionTypeOptions } from 'modules/inspection-operation/planning-aja/types.ts';

export default function ProvincialInspections() {
  const { data: responseData, isLoading } = useApiQuery({
    url: UnitPortalApis.provincialInspection.list,
  });

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'organizationUnitName', headerName: 'یگان', flex: 1.5 },
      {
        field: 'responsibleOrganizationUnitName',
        headerName: 'معاونت مسئول آجا',
        flex: 1,
      },
      {
        field: 'inspectionTypeKey',
        headerName: 'نوع بازدید',
        flex: 1.5,
        valueGetter: value =>
          InspectionTypeOptions.find(i => i.key === value)?.label,
      },
      {
        field: 'executionDate',
        headerName: 'زمان بازدید',
        flex: 1,
        valueGetter: value =>
          jalali.timestampToJalali(value, 'jYYYY/jMM/jDD', 'ms'),
      },
      { field: 'inspectionDuration', headerName: 'مدت بازدید', flex: 1 },
      {
        field: 'id',
        headerName: '',
        flex: 1,
        renderCell: (params: any) => (
          <Box justifyContent={'center'} display={'flex'}>
            <Tooltip title="نمایش">
              <NavLink to={`${params.value}`}>
                <IconButton size="small" color="info">
                  <VisibilityIcon fontSize="small" />
                </IconButton>
              </NavLink>
            </Tooltip>
          </Box>
        ),
      },
    ],
    []
  );

  return (
    <Box>
      <Grid>
        <Typography variant="h6" sx={{ mb: 1 }}>
          بازدید های انجام شده از یگان
        </Typography>
      </Grid>
      <MatnaDataGrid
        rows={responseData?.data || []}
        columns={columns}
        loading={isLoading}
        paginationModel={{
          page: responseData?.meta?.pagination?.currentPage || 1,
          pageSize: responseData?.meta?.pagination?.pageSize || 10,
        }}
        rowCount={responseData?.meta?.pagination?.count || 0}
      />
    </Box>
  );
}
