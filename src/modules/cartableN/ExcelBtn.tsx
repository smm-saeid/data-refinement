import FileCopyIcon from '@mui/icons-material/FileCopy';
import { Button } from '@mui/material';
import * as XLSX from 'xlsx';

export default function ExcelBtn({ rows, columns }) {
  const handleExportExcel = () => {
    if (!rows.length) return;
    const excelRows = rows.map(row => {
      const newRow = {};

      columns.forEach(column => {
        newRow[column.headerName] = row[column.field];
      });

      return newRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(excelRows);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

    XLSX.writeFile(workbook, 'data.xlsx');
  };
  return (
    <Button onClick={handleExportExcel} variant="contained" size="medium">
      <FileCopyIcon />
      خروجی اکسل
    </Button>
  );
}
