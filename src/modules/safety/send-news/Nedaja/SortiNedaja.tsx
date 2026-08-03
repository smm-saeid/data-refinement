import React, { useState, useEffect } from 'react';
import { TextField, Typography, Box, Paper } from '@mui/material';
import { MatnaDataGrid } from '../../../../components/data-grid/MatnaDataGrid';

interface TableData {
  id: number;
  fixedColumn: string;
  col1: number;
  col2: number;
  col3: number;
  col4: number;
}

interface SortiData {
  tableData: TableData[];
  totalSum: number;
  columnSums: {
    col1: number;
    col2: number;
    col3: number;
    col4: number;
  };
}

interface SortiNedajaProps {
  onDataChange?: (data: SortiData) => void;
}

const SortiNedaja = ({ onDataChange }: SortiNedajaProps) => {
  const [tableData, setTableData] = useState<TableData[]>([
    {
      id: 1,
      fixedColumn: 'پایگاه شکاری ترابری شهید لشگری (مهرآباد)',
      col1: 0,
      col2: 0,
      col3: 0,
      col4: 0,
    },
    {
      id: 2,
      fixedColumn: 'پایگاه شکاری شهید فکوری (تبریز)',
      col1: 0,
      col2: 0,
      col3: 0,
      col4: 0,
    },
    {
      id: 3,
      fixedColumn: 'پایگاه شکاری شهید نوژه(همدان)',
      col1: 0,
      col2: 0,
      col3: 0,
      col4: 0,
    },
    {
      id: 4,
      fixedColumn: 'پایگاه شکاری شهید وحدتی (دزفول)',
      col1: 0,
      col2: 0,
      col3: 0,
      col4: 0,
    },
    {
      id: 5,
      fixedColumn: 'پایگاه مقدم شهید اردستانی (امیدیه)',
      col1: 0,
      col2: 0,
      col3: 0,
      col4: 0,
    },
    {
      id: 6,
      fixedColumn: 'پایگاه شکاری شهید یاسینی (بوشهر)',
      col1: 0,
      col2: 0,
      col3: 0,
      col4: 0,
    },
    {
      id: 7,
      fixedColumn: 'پایگاه شکاری ترابری شهید دوران(شیراز)',
      col1: 0,
      col2: 0,
      col3: 0,
      col4: 0,
    },
    {
      id: 8,
      fixedColumn: 'پایگاه شکاری شهید بابایی (اصفهان)',
      col1: 0,
      col2: 0,
      col3: 0,
      col4: 0,
    },
    {
      id: 9,
      fixedColumn: 'پایگاه شکاری شهید عبدالکریمی (بندرعباس)',
      col1: 0,
      col2: 0,
      col3: 0,
      col4: 0,
    },
    {
      id: 10,
      fixedColumn: 'پایگاه شکاری شهید دل حامد (چهاربهار)',
      col1: 0,
      col2: 0,
      col3: 0,
      col4: 0,
    },
    {
      id: 11,
      fixedColumn: 'پایگاه مقدم  شهید حبیبی زهام (شیراز)',
      col1: 0,
      col2: 0,
      col3: 0,
      col4: 0,
    },
    {
      id: 12,
      fixedColumn: 'پایگاه مقدم شهید حسینی (بیرجند)',
      col1: 0,
      col2: 0,
      col3: 0,
      col4: 0,
    },
    {
      id: 13,
      fixedColumn: 'پایگاه  شهید عباس اکبری (دانشکده پرواز)',
      col1: 0,
      col2: 0,
      col3: 0,
      col4: 0,
    },
  ]);

  const calculateColumnSum = (
    column: keyof TableData,
    data: TableData[] = tableData
  ): number => {
    return data.reduce((sum, row) => sum + (row[column] as number), 0);
  };

  const calculateTotalSum = (data: TableData[] = tableData): number => {
    return data.reduce(
      (sum, row) => sum + row.col1 + row.col2 + row.col3 + row.col4,
      0
    );
  };

  const updateParentData = (data: TableData[]): void => {
    const columnSums = {
      col1: calculateColumnSum('col1', data),
      col2: calculateColumnSum('col2', data),
      col3: calculateColumnSum('col3', data),
      col4: calculateColumnSum('col4', data),
    };

    const totalSum = calculateTotalSum(data);

    if (onDataChange) {
      onDataChange({
        tableData: data,
        totalSum,
        columnSums,
      });
    }
  };

  const handleInputChange = (
    rowId: number,
    column: keyof TableData,
    value: string
  ): void => {
    if (value === '' || /^\d+$/.test(value)) {
      const numericValue = value === '' ? 0 : parseInt(value, 10);
      const updatedData = tableData.map(row =>
        row.id === rowId ? { ...row, [column]: numericValue } : row
      );
      setTableData(updatedData);
      updateParentData(updatedData);
    }
  };

  useEffect(() => {
    updateParentData(tableData);
  }, []);

  // استفاده از any برای ستون‌ها
  const columns: any[] = [
    {
      field: 'fixedColumn',
      headerName: 'یگان ها',
      width: 300,
      headerAlign: 'center',
      align: 'right',
    },
    {
      field: 'col1',
      headerName: 'سورتی هواپیما',
      width: 150,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: any) => (
        <TextField
          type="text"
          inputMode="numeric"
          value={params.value === 0 ? '' : params.value}
          onChange={e =>
            handleInputChange(params.row.id, 'col1', e.target.value)
          }
          sx={{ width: 80 }}
          placeholder="0"
        />
      ),
    },
    {
      field: 'col2',
      headerName: 'سورتی پهپاد',
      width: 150,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: any) => (
        <TextField
          type="text"
          inputMode="numeric"
          value={params.value === 0 ? '' : params.value}
          onChange={e =>
            handleInputChange(params.row.id, 'col2', e.target.value)
          }
          sx={{ width: 80 }}
          placeholder="0"
        />
      ),
    },
    {
      field: 'col3',
      headerName: 'سورتی آزمایشی',
      width: 150,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: any) => (
        <TextField
          type="text"
          inputMode="numeric"
          value={params.value === 0 ? '' : params.value}
          onChange={e =>
            handleInputChange(params.row.id, 'col3', e.target.value)
          }
          sx={{ width: 80 }}
          placeholder="0"
        />
      ),
    },
    {
      field: 'col4',
      headerName: 'سورتی شبیه ساز',
      width: 150,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: any) => (
        <TextField
          type="text"
          inputMode="numeric"
          value={params.value === 0 ? '' : params.value}
          onChange={e =>
            handleInputChange(params.row.id, 'col4', e.target.value)
          }
          sx={{ width: 80 }}
          placeholder="0"
        />
      ),
    },
  ];

  return (
    <Box>
      <MatnaDataGrid
        rows={tableData}
        columns={columns}
        getRowId={(row: { id: any }) => row.id}
        height={600}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 15 },
          },
        }}
        sx={{
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid #e0e0e0',
          },
        }}
      />

      <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Paper sx={{ p: 2, backgroundColor: 'primary.main', color: 'white' }}>
          <Typography variant="h6" align="center">
            کل ساعات: {calculateTotalSum()}
          </Typography>
        </Paper>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography variant="body1">
            جمع ستون یک: <strong>{calculateColumnSum('col1')}</strong>
          </Typography>
          <Typography variant="body1">
            جمع ستون دوم: <strong>{calculateColumnSum('col2')}</strong>
          </Typography>
          <Typography variant="body1">
            جمع ستون سوم: <strong>{calculateColumnSum('col3')}</strong>
          </Typography>
          <Typography variant="body1">
            جمع ستون چهارم: <strong>{calculateColumnSum('col4')}</strong>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SortiNedaja;
