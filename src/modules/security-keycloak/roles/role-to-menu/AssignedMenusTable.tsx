import { useState } from 'react';
import type { GridColDef } from '@mui/x-data-grid';
import { Box, Button, Chip, Alert } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useKeycloakApiDelete } from '../../../../hooks/useApiKeycloak';
import { useNotification } from '../../NotificationContext';
import { MatnaDataGrid } from '../../../../components/data-grid/MatnaDataGrid';
import keycloakApis from '../../apis';
import type { MenuRoleMapping, DeleteRoleVariables } from '../../types';

interface AssignedMenusTableProps {
  assignedMenus: MenuRoleMapping[];
  loading: boolean;
  onSuccess: () => void;
  paginationModel?: { page: number; pageSize: number };
  onPaginationChange?: (model: any) => void;
  rowCount?: number;
}

export function AssignedMenusTable({
  assignedMenus,
  loading,
  onSuccess,
  paginationModel = { page: 0, pageSize: 10 },
  onPaginationChange,
  rowCount = 0,
}: AssignedMenusTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const { showNotification } = useNotification();

  const deleteMutation = useKeycloakApiDelete<any, DeleteRoleVariables>(
    keycloakApis.menuRoleMapping.delete,
    {
      onSuccess: () => {
        showNotification('منو با موفقیت از نقش حذف شد');
        onSuccess();
        setDeletingId(null);
        setDeleteError(null);
      },
      onError: (error: any) => {
        const errorMessage =
          error?.response?.data?.message || 'خطای ناشناخته در حذف نقش';
        setDeleteError(errorMessage);
        showNotification(errorMessage, 'error');
        setDeletingId(null);
      },
    }
  );

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setDeleteError(null);
    try {
      await deleteMutation.mutateAsync({
        searchModel: { id },
      });
    } catch (error) {
      // Error is handled by onError callback
      console.error('Delete error:', error);
    }
  };

  const columns: GridColDef<MenuRoleMapping>[] = [
    {
      field: 'rowIndex',
      headerName: 'ردیف',
      flex: 0.5,
      renderCell: params => {
        const page = paginationModel.page;
        const pageSize = paginationModel.pageSize;
        return (
          page * pageSize +
          params.api.getRowIndexRelativeToVisibleRows(params.id) +
          1
        );
      },
    },
    {
      field: 'persianTitle',
      headerName: 'نام منو',
      flex: 1,
    },
    {
      field: 'englishTitle',
      headerName: 'عنوان انگلیسی',
      flex: 1,
    },
    {
      field: 'permissions',
      headerName: 'دسترسی‌ها',
      flex: 1.5,
      renderCell: params => (
        <Box display="flex" gap={0.5} flexWrap="wrap">
          {params.row.canRead && (
            <Chip label="مشاهده" color="primary" size="small" />
          )}
          {params.row.canWrite && (
            <Chip label="افزودن" color="secondary" size="small" />
          )}
          {params.row.canUpdate && (
            <Chip label="ویرایش" color="info" size="small" />
          )}
          {params.row.canDelete && (
            <Chip label="حذف" color="error" size="small" />
          )}
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: 'عملیات',
      flex: 0.8,
      renderCell: params => (
        <Button
          variant="outlined"
          color="error"
          size="small"
          startIcon={<DeleteIcon />}
          onClick={() => handleDelete(params.row.id)}
          disabled={deletingId === params.row.id}
          sx={{
            borderRadius: '8px',
            minWidth: 'auto',
            width: '40px',
            height: '40px',
          }}
        >
          {deletingId === params.row.id ? '' : ''}
        </Button>
      ),
    },
  ];

  // Transform data for MatnaDataGrid
  const rows = assignedMenus.map(menu => ({
    id: menu.id,
    ...menu,
  }));

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 2 }}>
        منوهای اختصاص داده شده به نقش
      </Alert>

      {deleteError && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          onClose={() => setDeleteError(null)}
        >
          خطا در حذف منو: {deleteError}
        </Alert>
      )}

      <MatnaDataGrid
        rows={rows}
        columns={columns}
        loading={loading || deleteMutation.isPending}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationChange}
        rowCount={rowCount}
        paginationMode={onPaginationChange ? 'server' : 'client'}
        pageSizeOptions={[10]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
      />
    </Box>
  );
}
