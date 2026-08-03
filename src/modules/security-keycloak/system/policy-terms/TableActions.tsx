import { IconButton, Tooltip, Box } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import type { Term } from '../../types';

interface TableActionsProps {
  term: Term;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

export function TableActions({
  term,
  onEdit,
  onDelete,
  isDeleting,
}: TableActionsProps) {
  return (
    <Box sx={{ display: 'flex', gap: 0.5 }}>
      <Tooltip title="ویرایش">
        <IconButton size="small" color="primary" onClick={onEdit}>
          <Edit fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="حذف">
        <IconButton
          size="small"
          color="error"
          onClick={onDelete}
          disabled={isDeleting}
        >
          <Delete fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
