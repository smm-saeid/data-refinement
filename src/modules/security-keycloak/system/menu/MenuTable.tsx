import { useState, useMemo } from 'react';
import type { GridColDef } from '@mui/x-data-grid';
import { Box, Button, Chip, Alert, TextField } from '@mui/material';
import { MatnaDataGrid } from '../../../../components/data-grid/MatnaDataGrid';
import keycloakApis from '../../apis';
import type { Menu } from '../../types';
import { useKeycloakApiDelete } from '@/hooks/useApiKeycloak';
import { useNotification } from '../../NotificationContext'; 

interface MenuTableProps {
  menus: Menu[];
  loading: boolean;
  onEdit: (menu: Menu) => void;
  onSuccess: () => void;
  paginationModel?: { page: number; pageSize: number };
  onPaginationChange?: (model: any) => void;
  rowCount?: number;
}

export function MenuTable({
  menus,
  loading,
  onEdit,
  onSuccess,
  paginationModel,
  onPaginationChange,
  rowCount = 0,
}: MenuTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { showNotification } = useNotification();


  const filteredMenus = useMemo(() => {
    if (!searchTerm.trim()) return menus;

    const searchLower = searchTerm.toLowerCase();
    return menus.filter(
      menu =>
        menu.parentName?.toLowerCase().includes(searchLower) ||
        menu.parentId?.toLowerCase().includes(searchLower)
    );
  }, [menus, searchTerm]);


  const deleteMutation = useKeycloakApiDelete<any, any>(
    keycloakApis.menu.delete,
    {
      onSuccess: () => {
        showNotification('منو با موفقیت حذف شد');
        onSuccess();
        setDeletingId(null);
        setDeleteError(null);
      },
      onError: (error: any) => {
        const errorMessage =
          error?.response?.data?.message || 'خطای ناشناخته در حذف منو';
        showNotification(errorMessage, 'error');
        setDeleteError(errorMessage);
        setDeletingId(null);
      },
    }
  );

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteMutation.mutateAsync({
        searchModel: { id },
      });
    } catch (error) {

    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const columns: GridColDef<Menu>[] = [
    {
      field: 'rowIndex',
      headerName: 'ردیف',
      flex: 0.5,
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
      field: 'name',
      headerName: 'عنوان فارسی',
      flex: 1,
    },
    {
      field: 'englishTitle',
      headerName: 'عنوان انگلیسی',
      flex: 1,
    },
    {
      field: 'link',
      headerName: 'لینک',
      flex: 1,
    },
    {
      field: 'parentName',
      headerName: 'والد',
      flex: 1,
      valueGetter: (_, row) => row.parentName || 'بدون والد',
    },
    {
      field: 'sensitive',
      headerName: 'حساس',
      flex: 0.7,
      renderCell: params => (
        <Chip
          label={params.value ? 'حساس' : 'غیر حساس'}
          color={params.value ? 'error' : 'success'}
          size="small"
        />
      ),
    },
    {
      field: 'disabled',
      headerName: 'وضعیت',
      flex: 0.7,
      renderCell: params => (
        <Chip
          label={params.value ? 'غیرفعال' : 'فعال'}
          color={params.value ? 'default' : 'primary'}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'عملیات',
      flex: 1.2,
      renderCell: params => (
        <ActionButtons
          menu={params.row}
          onEdit={onEdit}
          onDelete={handleDelete}
          deletingId={deletingId}
        />
      ),
    },
  ];

  return (
    <Box>
      {deleteMutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          خطا در حذف منو
        </Alert>
      )}

      {/* Search Input */}
      <Box sx={{ mb: 2 }}>
        <TextField
          label="جستجو بر اساس نام والد"
          value={searchTerm}
          onChange={handleSearchChange}
          fullWidth
          placeholder="نام والد را وارد کنید..."
          sx={{ maxWidth: 400 }}
        />
      </Box>

      <MatnaDataGrid
        rows={filteredMenus}
        columns={columns}
        loading={loading}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationChange}
        rowCount={filteredMenus.length} 
        getRowId={(row: { id: any }) => row.id}
      />
    </Box>
  );
}

interface ActionButtonsProps {
  menu: Menu;
  onEdit: (menu: Menu) => void;
  onDelete: (id: string) => void;
  deletingId: string | null;
}

function ActionButtons({
  menu,
  onEdit,
  onDelete,
  deletingId,
}: ActionButtonsProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    onDelete(menu.id);
    setShowDeleteConfirm(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <Box display="flex" gap={1}>
      <Button
        variant="outlined"
        color="primary"
        size="small"
        onClick={() => onEdit(menu)}
      >
        ویرایش
      </Button>

      {showDeleteConfirm ? (
        <Box display="flex" gap={0.5}>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={confirmDelete}
            disabled={deletingId === menu.id}
          >
            {deletingId === menu.id ? '...' : 'تایید'}
          </Button>
          <Button variant="outlined" size="small" onClick={cancelDelete}>
            انصراف
          </Button>
        </Box>
      ) : (
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={handleDelete}
          disabled={deletingId === menu.id}
        >
          {deletingId === menu.id ? 'در حال حذف...' : 'حذف'}
        </Button>
      )}
    </Box>
  );
}
