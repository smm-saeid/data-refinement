import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import type { GridValidRowModel } from '@mui/x-data-grid';

interface SelectionModel {
  type: 'include' | 'exclude';
  ids: Set<GridValidRowModel['id']>;
}
interface DeleteBtnProps {
  rows: GridValidRowModel[];
  setRows: React.Dispatch<React.SetStateAction<GridValidRowModel[]>>;
  setFilteredRows: React.Dispatch<React.SetStateAction<GridValidRowModel[]>>;
  selectedRows: SelectionModel;
  setSelectedRows: React.Dispatch<React.SetStateAction<SelectionModel>>;
}

export default function DeleteBtn({
  rows,
  setRows,
  setFilteredRows,
  selectedRows,
  setSelectedRows,
}: DeleteBtnProps) {
  const handleDelete = () => {
    if (!rows.length) {
      return;
    }
    if (selectedRows.type === 'include' && selectedRows.ids.size === 0) {
      return;
    }
    const deletedRows =
      selectedRows.type === 'include'
        ? rows.filter(row => selectedRows.ids.has(row.id))
        : rows.filter(row => !selectedRows.ids.has(row.id));
    console.log('رکوردهای حذف‌شده:', deletedRows);

    if (selectedRows.type === 'include') {
      setRows(currentRows =>
        currentRows.filter(row => !selectedRows.ids.has(row.id))
      );
      setFilteredRows(currentRows =>
        currentRows.filter(row => !selectedRows.ids.has(row.id))
      );
    } else {
      setRows(currentRows =>
        currentRows.filter(row => selectedRows.ids.has(row.id))
      );
      setFilteredRows(currentRows =>
        currentRows.filter(row => selectedRows.ids.has(row.id))
      );
    }
    setSelectedRows({
      type: 'include',
      ids: new Set(),
    });
  };
  return (
    <Button onClick={handleDelete} variant="contained" size="medium">
      <DeleteIcon />
      حذف موارد انتخابی
    </Button>
  );
}
