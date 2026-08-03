import { useState } from 'react';
import type { GridColDef } from '@mui/x-data-grid';
import { Box, TextField, Button, Paper } from '@mui/material';
import { useApiQuery } from '@/hooks/useApi';
import researchApis from '@/modules/research/apis.ts';
import { PAGINATION_DEFAULT_VALUE, type PaginationQueryParam } from '@/types/api.ts';
import { MatnaDataGrid } from '@/components/data-grid/MatnaDataGrid.tsx';
import type {Elite} from '@/modules/research/types.ts';


type ElitesQueryParams = {
  name?: string;
  degree?: string;
  field?: string;
};

const columns: GridColDef<Elite>[] = [
  { field: 'name', headerName: 'نام', flex: 1 },
  { field: 'degree', headerName: 'مدرک', flex: 0.7 },
  { field: 'field', headerName: 'رشته', flex: 1 },
  {
    field: 'unit',
    headerName: 'واحد',
    flex: 0.8,
    valueGetter: (_value, row) => row.unit?.name || '',
  },
  { field: 'projectTitle', headerName: 'عنوان پروژه', flex: 1.5 },
];

export function EliteList() {
  const [filters, setFilters] = useState<PaginationQueryParam<ElitesQueryParams>>({
    ...PAGINATION_DEFAULT_VALUE,
    name: '',
    degree: '',
    field: '',
  });

  const { data: response, isLoading, error } = useApiQuery<
    Elite[],
    PaginationQueryParam<ElitesQueryParams>
  >({
    url: researchApis.elites.list,
    params: filters,
  });

  const updateFilters = (updates: Partial<ElitesQueryParams>) => {
    setFilters((prev) => ({
      ...prev,
      ...updates,
      page: 1,
    }));
  };

  const resetFilters = () => {
    setFilters({
      ...PAGINATION_DEFAULT_VALUE,
      name: '',
      degree: '',
      field: '',
    });
  };

  const handlePaginationChange = (model: any) => {
    console.log(model);
  };

  if (error) {
    return (
      <Box p={2}>
        <Paper sx={{ p: 2, bgcolor: 'error.light' }}>
          خطا: {error.response?.data?.message || error.message}
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: '100vw', p: 2, boxSizing: 'border-box' }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
          <TextField
            label="جستجو بر اساس نام"
            value={filters.name || ''}
            onChange={(e) => updateFilters({ name: e.target.value })}
            size="small"
          />

          <TextField
            label="مدرک"
            value={filters.degree || ''}
            onChange={(e) => updateFilters({ degree: e.target.value })}
            size="small"
          />

          <TextField
            label="رشته"
            value={filters.field || ''}
            onChange={(e) => updateFilters({ field: e.target.value })}
            size="small"
          />

          <Button variant="outlined" onClick={resetFilters}>
            بازنشانی فیلترها
          </Button>
        </Box>
      </Paper>

      <MatnaDataGrid
        rows={response?.data}
        columns={columns}
        loading={isLoading}
        paginationModel={{
          page: (response?.meta?.pagination?.currentPage || 0),
          pageSize: response?.meta?.pagination?.pageSize || 10
        }}
        rowCount={response?.meta?.pagination?.count || 10}
        onPaginationModelChange={handlePaginationChange}
      />
    </Box>
  );
}