import { useState } from 'react';
import type { GridColDef } from '@mui/x-data-grid';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useKeycloakApiDelete } from '../../../../hooks/useApiKeycloak';
import { useNotification } from '../../NotificationContext';
import { MatnaDataGrid } from '../../../../components/data-grid/MatnaDataGrid';
import { RoleForm } from './RoleForm';
import keycloakApis from '../../apis';
import type { Role } from '../../types';

interface RoleTableProps {
  data: Role[] | undefined;
  loading: boolean;
  paginationModel: { page: number; pageSize: number };
  rowCount: number;
  onPaginationChange: (model: any) => void;
  onEdit: (role: Role) => void;
  onSuccess: () => void;
  editModalOpen: boolean;
  editingRole: Role | null;
  onEditModalClose: () => void;
}

// Define the delete mutation variables type
interface DeleteRoleVariables {
  paginationModel: Record<string, any>;
  searchModel: { name: string };
}

export function RoleTable({
  data,
  loading,
  paginationModel,
  rowCount,
  onPaginationChange,
  onEdit,
  onSuccess,
  editModalOpen,
  editingRole,
  onEditModalClose,
}: RoleTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const { showNotification } = useNotification();

  const deleteRoleMutation = useKeycloakApiDelete<any, DeleteRoleVariables>(
    keycloakApis.role.delete,
    {
      onSuccess: () => {
        showNotification('نقش با موفقیت حذف شد');
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

  const handleDelete = async (roleName: string) => {
    setDeletingId(roleName);
    setDeleteError(null);
    try {
      await deleteRoleMutation.mutateAsync({
        paginationModel: {},
        searchModel: { name: roleName },
      });
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const columns: GridColDef<Role>[] = [
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
      field: 'name',
      headerName: 'نام',
      flex: 1,
    },
    {
      field: 'description',
      headerName: 'توضیح',
      flex: 1.5,
    },
    {
      field: 'actions',
      headerName: 'عملیات',
      flex: 1,
      renderCell: params => (
        <ActionButtons
          role={params.row}
          onEdit={onEdit}
          onDelete={handleDelete}
          deletingId={deletingId}
        />
      ),
    },
  ];

  const rows =
    data?.map(role => ({
      id: role.id || role.name,
      ...role,
    })) || [];

  console.log('paginationModel in matna', paginationModel);

  return (
    <>
      {deleteError && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          onClose={() => setDeleteError(null)}
        >
          خطا در حذف نقش: {deleteError}
        </Alert>
      )}

      <MatnaDataGrid
        rows={rows}
        columns={columns}
        loading={loading || deleteRoleMutation.isPending}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationChange}
        rowCount={rowCount}
        paginationMode="server"
        pageSizeOptions={[10]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 50,
            },
          },
        }}
      />

      {/* Edit Modal */}
      <Dialog
        open={editModalOpen}
        onClose={onEditModalClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>ویرایش نقش</DialogTitle>
        <DialogContent>
          {editingRole && (
            <RoleForm
              onSuccess={() => {
                onSuccess();
                onEditModalClose();
              }}
              initialValues={editingRole}
              isEdit={true}
              onCancel={onEditModalClose}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onEditModalClose}>بستن</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

interface ActionButtonsProps {
  role: Role;
  onEdit: (role: Role) => void;
  onDelete: (roleName: string) => void;
  deletingId: string | null;
}

function ActionButtons({
  role,
  onEdit,
  onDelete,
  deletingId,
}: ActionButtonsProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    onDelete(role.name);
    setShowDeleteConfirm(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const isDeleting = deletingId === role.name;

  return (
    <Box display="flex" gap={1}>
      <Button
        variant="outlined"
        color="primary"
        size="small"
        onClick={() => onEdit(role)}
        startIcon={<EditIcon />}
        disabled={isDeleting}
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
            disabled={isDeleting}
            startIcon={<DeleteIcon />}
          >
            {isDeleting ? '...' : 'تایید'}
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={cancelDelete}
            disabled={isDeleting}
          >
            انصراف
          </Button>
        </Box>
      ) : (
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={handleDeleteClick}
          disabled={isDeleting}
          startIcon={<DeleteIcon />}
        >
          {isDeleting ? 'در حال حذف...' : 'حذف'}
        </Button>
      )}
    </Box>
  );
}
