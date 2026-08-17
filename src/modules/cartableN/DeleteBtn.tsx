import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function DeleteBtn({
  rows,
  setRows,
  selectedRows,
  setSelectedRows,
}) {
  const handleDelete = () => {
    if (!rows.length) return;
    if (selectedRows.type === 'include' && !selectedRows.ids.size) {
      return;
    }
    setRows(rows => {
      if (selectedRows.type === 'include') {
        return rows.filter(row => !selectedRows.ids.has(row.id));
      }
      return rows.filter(row => selectedRows.ids.has(row.id));
    });
    console.log(rows.filter(row => selectedRows.ids.has(row.id)));

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
