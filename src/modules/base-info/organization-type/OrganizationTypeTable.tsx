import React from 'react';
import { Fab, Tooltip } from '@mui/material';
import { Grid } from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import type { GridRenderCellParams } from '@mui/x-data-grid';
import { MatnaDataGrid } from '@/components/data-grid/MatnaDataGrid';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router';

type OrganizationTypeTableProps = {
  rows: any[];
  filters: any;
  setFilters: (v: any) => void;
  isLoading: boolean;
  rowCount: number;
  // onEdit: (row: any) => void;
  onDelete: (id: string) => void;
  onPaginationModelChange?: (model: any) => void;
};

export function OrganizationTypeTable({
  rows,
  filters,
  setFilters,
  isLoading,
  rowCount,
  // onEdit,
  onDelete,
  onPaginationModelChange,
}: OrganizationTypeTableProps) {
  const navigate = useNavigate();

  const columns: GridColDef[] = [
    { field: 'rowindex', headerName: 'ردیف', flex: 0.5 },
    { field: 'organizationUnitName', headerName: 'نام یگان', flex: 1 },
    { field: 'commonBaseDataUnitTypeValue', headerName: 'نوع یگان', flex: 1 },
    {
      field: 'actions',
      headerName: 'عملیات',
      flex: 1,
      renderCell: (param: GridRenderCellParams) => (
        <Grid container spacing={1} wrap="nowrap">
          <Grid>
            <Tooltip title="ویرایش">
              <Fab
                size="small"
                color="success"
                // onClick={() => onEdit(param.row)}
              >
                <AddCircleIcon />
              </Fab>
            </Tooltip>
          </Grid>
          <Grid>
            <Tooltip title="حذف">
              <Fab
                size="small"
                color="error"
                onClick={() => onDelete(param.row.id)}
              >
                <DeleteIcon />
              </Fab>
            </Tooltip>
          </Grid>
        </Grid>
      ),
    },
  ];

  return (
    <MatnaDataGrid
      rows={rows}
      columns={columns}
      checkboxSelection={false}
      autoHeight
      paginationMode="server"
      rowCount={rowCount}
      loading={isLoading}
      pageSizeOptions={[10, 20, 50]}
      paginationModel={{
        page: filters.page ?? 0,
        pageSize: filters.size ?? 10,
      }}
      onPaginationModelChange={onPaginationModelChange}
      height={630}
    />
  );
}
