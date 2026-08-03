import type { GridColDef } from '@mui/x-data-grid';
import { Chip } from '@mui/material';
import { MatnaDataGrid } from '../../../../components/data-grid/MatnaDataGrid';
import type { Term } from '../../types';
import { TableActions } from './TableActions';

interface TermsTableProps {
  terms: Term[];
  loading: boolean;
  onEdit: (term: Term) => void;
  onDelete: (id: string) => void;
  paginationModel?: { page: number; pageSize: number };
  isDeleting: boolean;
}

const statusConfig = {
  PUBLISHED: { label: 'فعال', color: 'success' as const },
  DRAFT: { label: 'غیرفعال', color: 'warning' as const },
  ARCHIVED: { label: 'آرشیو', color: 'error' as const },
};

export function TermsTable({
  terms,
  loading,
  onEdit,
  paginationModel,
  onDelete,
  isDeleting,
}: TermsTableProps) {
  const rows = terms.map(term => ({
    ...term,
    onEdit: () => onEdit(term),
    onDelete: () => onDelete(term.id),
    isDeleting,
  }));

  const columns: GridColDef<Term>[] = [
    {
      field: 'index',
      headerName: 'ردیف',
      width: 80,
      renderCell: params => {
        const currentPage = paginationModel?.page || 0;
        const pageSize = paginationModel?.pageSize || 15;
        return (
          currentPage * pageSize +
          params.api.getRowIndexRelativeToVisibleRows(params.id) +
          1
        );
      },
    },
    {
      field: 'title',
      headerName: 'عنوان قوانین',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'content',
      headerName: 'متن کامل',
      flex: 1.5,
      minWidth: 300,
    },
    {
      field: 'version',
      headerName: 'نسخه قوانین',
      flex: 0.8,
      minWidth: 120,
    },
    {
      field: 'status',
      headerName: 'وضعیت',
      flex: 0.8,
      minWidth: 120,
      renderCell: params => {
        const config = statusConfig[params.value as keyof typeof statusConfig];
        return (
          <Chip
            label={config?.label || params.value}
            color={config?.color || 'default'}
            size="small"
          />
        );
      },
    },
    {
      field: 'actions',
      headerName: 'عملیات',
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: params => (
        <TableActions
          term={params.row}
          onEdit={params.row.onEdit}
          onDelete={params.row.onDelete}
          isDeleting={params.row.isDeleting}
        />
      ),
    },
  ];

  return (
    <MatnaDataGrid
      rows={rows}
      columns={columns}
      loading={loading}
      height={600}
      initialState={{
        pagination: {
          paginationModel: { pageSize: 10, page: 0 },
        },
      }}
      pageSizeOptions={[5, 10, 25]}
      disableRowSelectionOnClick
    />
  );
}
