import FileCopyIcon from '@mui/icons-material/FileCopy';
import { Button } from '@mui/material';
import * as XLSX from 'xlsx';

import type { GridColDef, GridValidRowModel } from '@mui/x-data-grid';

interface ExcelBtnProps {
  rows: GridValidRowModel[];
  columns: GridColDef[];
}

export default function ExcelBtn({ rows, columns }: ExcelBtnProps) {
  const handleExportExcel = () => {
    // اگر داده‌ای نداریم هیچ کاری نکن
    if (!rows.length) return;

    // ستون‌ها
    const visibleColumns = columns.filter(column => column.field);

    // ستون‌ها را برعکس می‌کنیم
    const exportColumns = [
      {
        field: '__rowNumber',
        headerName: 'ردیف',
      },
      ...visibleColumns,
    ].reverse();

    // Header
    const headers = exportColumns.map(
      column => column.headerName ?? column.field
    );

    // Body
    const excelRows = rows.map((row, rowIndex) => {
      return exportColumns.map(column => {
        if (column.field === '__rowNumber') {
          return rowIndex + 1;
        }

        const value = row[column.field];

        if (value === null || value === undefined) {
          return '';
        }

        if (typeof value === 'boolean') {
          return value ? 'بله' : 'خیر';
        }

        return String(value);
      });
    });

    // ساخت Sheet
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...excelRows]);

    // راست‌چین کردن متن سلول‌ها
    const range = XLSX.utils.decode_range(worksheet['!ref']!);

    for (let row = range.s.r; row <= range.e.r; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const address = XLSX.utils.encode_cell({
          r: row,
          c: col,
        });

        const cell = worksheet[address];

        if (!cell) continue;

        cell.s = {
          alignment: {
            horizontal: row === 0 ? 'center' : 'right',
            vertical: 'center',
          },
        };
      }
    }

    // Workbook
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'کارتابل');

    // دانلود
    XLSX.writeFile(workbook, 'cartable.xlsx');
  };

  return (
    <Button onClick={handleExportExcel} variant="contained" size="medium">
      <FileCopyIcon />
      خروجی اکسل
    </Button>
  );
}
