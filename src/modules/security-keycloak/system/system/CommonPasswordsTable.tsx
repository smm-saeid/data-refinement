// CommonPasswordsTable.tsx
import { useState } from 'react';
import type { GridColDef, GridRowParams } from '@mui/x-data-grid';
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import {
  useKeycloakApiQuery,
  useKeycloakApiMutation,
} from '../../../../hooks/useApiKeycloak';
import { MatnaDataGrid } from '@/components/data-grid/MatnaDataGrid';
import keycloakApis from '../../apis';
import type { CommonPassword } from '../../types';

interface CommonPasswordsTableProps {
  open: boolean;
  onClose: () => void;
}

export function CommonPasswordsTable({
  open,
  onClose,
}: CommonPasswordsTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const {
    data: response,
    isLoading,
    refetch,
  } = useKeycloakApiQuery<CommonPassword[]>({
    url: keycloakApis.commonPasswords.list,
  });

  const createMutation = useKeycloakApiMutation<
    CommonPassword,
    { password: string }
  >({
    url: keycloakApis.commonPasswords.create,
    method: 'POST',
    onSuccess: () => {
      refetch();
      setNewPassword('');
    },
  });

  const updateMutation = useKeycloakApiMutation<CommonPassword, CommonPassword>(
    {
      url: keycloakApis.commonPasswords.update,
      method: 'PUT',
      onSuccess: () => {
        refetch();
        setEditingId(null);
        setEditValue('');
      },
    }
  );

  const deleteMutation = useKeycloakApiMutation<any, string>({
    url: keycloakApis.commonPasswords.delete,
    method: 'DELETE',
    onSuccess: () => {
      refetch();
    },
  });

  const commonPasswords = response?.data || [];

  const handleAddPassword = async () => {
    if (!newPassword.trim()) return;

    await createMutation.mutateAsync({ password: newPassword });
  };

  const handleEdit = (password: CommonPassword) => {
    setEditingId(password.id);
    setEditValue(password.password);
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editValue.trim()) return;

    await updateMutation.mutateAsync({
      id: editingId,
      password: editValue,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  const columns: GridColDef<CommonPassword>[] = [
    {
      field: 'password',
      headerName: 'کلمه‌های عبور رایج',
      flex: 1,
      renderCell: params =>
        editingId === params.row.id ? (
          <TextField
            value={editValue}
            onChange={e => setEditValue(e.target.value)}
            size="small"
            fullWidth
          />
        ) : (
          params.row.password
        ),
    },
    {
      field: 'actions',
      headerName: 'عملیات',
      flex: 0.8,
      renderCell: params => (
        <ActionButtons
          password={params.row}
          editingId={editingId}
          onEdit={handleEdit}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
          onDelete={handleDelete}
        />
      ),
    },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>کلمه‌های عبور رایج</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={2}>
          {/* Add new password */}
          <Box display="flex" gap={1} alignItems="center">
            <TextField
              label="کلمه عبور جدید"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              size="small"
              fullWidth
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddPassword}
              disabled={!newPassword.trim() || createMutation.isPending}
            >
              افزودن
            </Button>
          </Box>

          {(createMutation.isError ||
            updateMutation.isError ||
            deleteMutation.isError) && (
            <Alert severity="error">خطا در انجام عملیات</Alert>
          )}

          {/* Passwords table */}
          <MatnaDataGrid
            rows={commonPasswords}
            columns={columns}
            loading={isLoading}
            paginationModel={{ page: 0, pageSize: 10 }}
            rowCount={commonPasswords.length}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>بستن</Button>
      </DialogActions>
    </Dialog>
  );
}

// ActionButtons component remains the same...
interface ActionButtonsProps {
  password: CommonPassword;
  editingId: string | null;
  onEdit: (password: CommonPassword) => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
}

function ActionButtons({
  password,
  editingId,
  onEdit,
  onSave,
  onCancel,
  onDelete,
}: ActionButtonsProps) {
  const isEditing = editingId === password.id;

  if (isEditing) {
    return (
      <Box display="flex" gap={0.5}>
        <Tooltip title="ذخیره">
          <IconButton size="small" color="primary" onClick={onSave}>
            <CheckIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="لغو">
          <IconButton size="small" color="error" onClick={onCancel}>
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </Box>
    );
  }

  return (
    <Box display="flex" gap={0.5}>
      <Tooltip title="ویرایش">
        <IconButton
          size="small"
          color="primary"
          onClick={() => onEdit(password)}
          disabled={!!editingId}
        >
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="حذف">
        <IconButton
          size="small"
          color="error"
          onClick={() => onDelete(password.id)}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
