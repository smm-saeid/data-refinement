import React from 'react';
import { Grid, Fab, Tooltip } from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import type { GridRenderCellParams } from '@mui/x-data-grid';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router';
import { MatnaDataGrid } from '@/components/data-grid/MatnaDataGrid';

interface BaseInfoDataTableProps {
  rows: any[];
  filters: any;
  setFilters: (v: any) => void;
  isLoading: boolean;
  rowCount?: number;
  onEdit: (...args: any[]) => void;
  onDelete: (id: string) => void;
  onPaginationModelChange?: (model: any) => void;
}

export function BaseInfoDataTable({
  rows,
  filters,
  setFilters,
  isLoading,
  rowCount,
  onEdit,
  onDelete,
  onPaginationModelChange,
}: BaseInfoDataTableProps) {
  const navigate = useNavigate();

  const columns: GridColDef[] = [
    { field: 'rowindex', headerName: 'ردیف', flex: 0.5 },
    { field: 'key', headerName: 'کلید', flex: 1 },
    { field: 'value', headerName: 'مقدار', flex: 1 },
    { field: 'orderNo', headerName: 'شماره دستور', flex: 0.5 },
    {
      field: 'isActive',
      headerName: 'وضعیت',
      flex: 0.5,
      renderCell: ({ value }) => (value ? 'فعال' : 'غیرفعال'),
    },
    { field: 'description', headerName: 'توضیحات', flex: 1 },
    {
      field: 'commonBaseTypeName',
      headerName: 'نام نوع اطلاعات پایه',
      flex: 1,
    },
    { field: 'parentId', headerName: 'والد', flex: 1 },
    {
      field: 'actions',
      headerName: 'عملیات',
      flex: 1.5,
      renderCell: (param: GridRenderCellParams) => (
        <Grid container spacing={1} wrap="nowrap">
          <Tooltip title="افزودن داده">
            <Fab
              size="small"
              color="primary"
              // onClick={() =>
              //   navigate(
              //     `/base-info/type-parent/${param.row.id}/${param.row.commonBaseTypeId}`
              //   )
              // }
            >
              <ArrowBackIcon />
            </Fab>
          </Tooltip>

          <Tooltip title="ویرایش">
            <Fab
              size="small"
              color="success"
              onClick={() =>
                onEdit(
                  param.row.id,
                  param.row.key,
                  param.row.value,
                  param.row.isActive,
                  param.row.orderNo,
                  param.row.parentId,
                  param.row.commonBaseTypeId,
                  param.row.commonBaseTypeName,
                  param.row.description
                )
              }
            >
              <AddCircleIcon />
            </Fab>
          </Tooltip>

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
