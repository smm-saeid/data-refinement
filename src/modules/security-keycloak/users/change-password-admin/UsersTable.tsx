import type { GridColDef } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { Visibility } from '@mui/icons-material';
import { MatnaDataGrid } from '@/components/data-grid/MatnaDataGrid';
import type { UserTableData } from '../../types';
import { useCallback } from 'react';

interface UsersTableProps {
  data: UserTableData[];
  loading: boolean;
  onViewUser: (user: UserTableData) => void;
  paginationModel: { page: number; pageSize: number };
  rowCount: number;
  onPaginationModelChange: (model: any) => void;
}

const columns: GridColDef<UserTableData>[] = [
  {
    field: 'index',
    headerName: 'ردیف',
    width: 80,
    renderCell: params =>
      params.api.getRowIndexRelativeToVisibleRows(params.id) + 1,
  },
  {
    field: 'firstName',
    headerName: 'نام',
    flex: 1,
    minWidth: 120,
  },
  {
    field: 'lastName',
    headerName: 'نام خانوادگی',
    flex: 1,
    minWidth: 120,
  },
  {
    field: 'username',
    headerName: 'نام کاربری',
    flex: 1,
    minWidth: 150,
  },
  {
    field: 'nationalityCode',
    headerName: 'کد ملی',
    flex: 1,
    minWidth: 120,
  },
  {
    field: 'actions',
    headerName: 'عملیات',
    width: 120,
    sortable: false,
    filterable: false,
    renderCell: params => (
      <Button
        variant="outlined"
        size="small"
        startIcon={<Visibility />}
        onClick={() => (params.row as any).handleViewUser()}
      >
        مشاهده
      </Button>
    ),
  },
];

export function UsersTable({
  data,
  loading,
  onViewUser,
  paginationModel,
  rowCount,
  onPaginationModelChange,
}: UsersTableProps) {
  // Memoize the rows creation to prevent unnecessary re-renders
  const rows = data.map((row, index) => ({
    ...row,
    // Use proper unique ID
    id: row.id || row.username || `user-${index}`,
    handleViewUser: () => onViewUser(row),
  }));

  return (
    <MatnaDataGrid
      rows={rows}
      columns={columns}
      loading={loading}
      rowCount={rowCount}
      paginationModel={paginationModel}
      onPaginationModelChange={onPaginationModelChange}
      pageSizeOptions={[5, 10, 25, 50]}
      paginationMode="server"
      height={600}
    />
  );
}
