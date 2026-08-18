import { Button } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import type { GridColDef, GridValidRowModel } from '@mui/x-data-grid';

interface PdfButtonProps {
  rows: GridValidRowModel[];
  columns: GridColDef[];
}

/*
 * تبدیل فایل TTF به Base64
 */
const loadFontAsBase64 = async (url: string): Promise<string> => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Font not found: ${url}`);
  }

  const buffer = await response.arrayBuffer();

  const bytes = new Uint8Array(buffer);

  let binary = '';

  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));

    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
};

export default function PdfButton({ rows, columns }: PdfButtonProps) {
  const handleDownloadPdf = async () => {
    try {
      /*
       * ==================================================
       * 1. ساخت PDF
       * ==================================================
       */

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      /*
       * ==================================================
       * 2. لود فونت‌ها
       * ==================================================
       */

      const regularFont = await loadFontAsBase64(
        '/assets/pdf/Vazirmatn-Regular.ttf'
      );

      const mediumFont = await loadFontAsBase64(
        '/assets/pdf/Vazirmatn-Medium.ttf'
      );

      const boldFont = await loadFontAsBase64('/assets/pdf/Vazirmatn-Bold.ttf');

      /*
       * ==================================================
       * 3. ثبت فونت‌ها در jsPDF
       * ==================================================
       */

      pdf.addFileToVFS('Vazirmatn-Regular.ttf', regularFont);

      pdf.addFileToVFS('Vazirmatn-Medium.ttf', mediumFont);

      pdf.addFileToVFS('Vazirmatn-Bold.ttf', boldFont);

      pdf.addFont('Vazirmatn-Regular.ttf', 'Vazirmatn', 'normal');

      pdf.addFont('Vazirmatn-Medium.ttf', 'Vazirmatn', 'medium');

      pdf.addFont('Vazirmatn-Bold.ttf', 'Vazirmatn', 'bold');

      /*
       * فونت پیش‌فرض
       */

      pdf.setFont('Vazirmatn', 'normal');

      /*
       * ==================================================
       * 4. عنوان
       * ==================================================
       */

      pdf.setFont('Vazirmatn', 'bold');

      pdf.setFontSize(16);

      /*
       * عنوان را سمت راست می‌گذاریم
       */

      pdf.text('گزارش اطلاعات کارتابل', 287, 15, {
        align: 'right',
      });

      /*
       * ==================================================
       * 5. ستون‌های DataGrid
       * ==================================================
       */

      const visibleColumns = columns.filter(column => column.field);

      /*
       * ستون شماره ردیف
       */

      const tableColumns = [
        {
          field: '__rowNumber',
          headerName: 'ردیف',
        },
        ...visibleColumns,
      ];

      /*
       * ==================================================
       * 6. Header
       * ==================================================
       */

      const headers = tableColumns.map(
        column => column.headerName ?? column.field
      );

      /*
       * ==================================================
       * 7. Data
       * ==================================================
       */

      const data = rows.map((row, rowIndex) => {
        return tableColumns.map(column => {
          let value: unknown;

          /*
           * شماره ردیف
           */

          if (column.field === '__rowNumber') {
            value = rowIndex + 1;
          } else {
            value = row[column.field];
          }

          /*
           * مقدار خالی
           */

          if (value === null || value === undefined) {
            return '';
          }

          /*
           * Boolean
           */

          if (typeof value === 'boolean') {
            return value ? 'بله' : 'خیر';
          }

          /*
           * Array
           */

          if (Array.isArray(value)) {
            return value.join(', ');
          }

          /*
           * Object
           */

          if (typeof value === 'object') {
            return JSON.stringify(value);
          }

          return String(value);
        });
      });

      /*
       * ==================================================
       * 8. جدول
       * ==================================================
       */

      autoTable(pdf, {
        head: [headers],

        body: data,

        startY: 23,

        margin: {
          top: 23,
          right: 8,
          bottom: 12,
          left: 8,
        },

        theme: 'grid',

        styles: {
          font: 'Vazirmatn',
          fontStyle: 'normal',
          fontSize: 7,
          cellPadding: 2,
          halign: 'center',
          valign: 'middle',
          overflow: 'linebreak',
        },

        headStyles: {
          font: 'Vazirmatn',

          fontStyle: 'bold',

          fontSize: 8,

          halign: 'center',

          valign: 'middle',
        },

        bodyStyles: {
          font: 'Vazirmatn',

          fontStyle: 'normal',

          halign: 'center',

          valign: 'middle',
        },

        /*
         * تکرار Header در هر صفحه
         */

        showHead: 'everyPage',

        /*
         * اجازه نده ردیف نصف شود
         */

        rowPageBreak: 'avoid',

        /*
         * RTL
         */

        horizontalPageBreak: true,

        horizontalPageBreakRepeat: 0,

        /*
         * بعد از هر صفحه
         */

        didDrawPage: () => {
          /*
           * شماره صفحه
           */

          const pageNumber = pdf.getNumberOfPages();

          pdf.setFont('Vazirmatn', 'normal');

          pdf.setFontSize(7);

          pdf.text(`صفحه ${pageNumber}`, 8, 202);
        },
      });

      /*
       * ==================================================
       * 9. دانلود
       * ==================================================
       */

      pdf.save('cartable.pdf');
    } catch (error) {
      console.error('PDF Error:', error);

      alert('خطا در ساخت PDF. کنسول مرورگر را بررسی کنید.');
    }
  };

  return (
    <Button
      variant="contained"
      color="error"
      startIcon={<PictureAsPdfIcon />}
      onClick={handleDownloadPdf}
    >
      دریافت PDF
    </Button>
  );
}
