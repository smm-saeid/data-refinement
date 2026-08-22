import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';

import CasesIcon from '@mui/icons-material/Cases';
import CachedIcon from '@mui/icons-material/Cached';
import TuneIcon from '@mui/icons-material/Tune';

import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import InputIcon from 'react-multi-date-picker/components/input_icon';

import { DataGrid } from '@mui/x-data-grid';

import type { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';

import { faIR } from '@mui/x-data-grid/locales';

import React, { useEffect, useState } from 'react';

import NewCart from './newCart';
import Month from './monthInput';
import NoInput from './noInput';

import ExcelBtn from './ExcelBtn';
import DeleteBtn from './DeleteBtn';
import PdfBtn from './PdfBtn';
import SearchBtn from './searchBtn';
import AddCartAm from './addCartAmal';

// ==============================
// IMPORT DATA
// ==============================

import data from './data.json';

// ==============================
// DatePicker Style
// ==============================

const styles = {
  width: '150px',
  height: '50px',
  fontSize: '16px',
};

// ==============================
// Row Type
// ==============================

interface CartableRow {
  id: string | number;

  process?: string;
  watched?: boolean;

  month?: number | string;
  year?: number | string;

  fileDet?: string;
  description?: string;

  orderNum?: string | number;
  yegan?: string | number;

  force?: string;
  sender?: string;

  curYegan?: string | number;

  processStatus?: string;

  fileNum?: string | number;

  employeeNumber?: string | number;

  [key: string]: unknown;
}

// ==============================
// Component
// ==============================

export default function Cartable() {
  // ==========================================
  // Rows
  // ==========================================

  const [rows, setRows] = useState<CartableRow[]>([]);

  const [filteredRows, setFilteredRows] = useState<CartableRow[]>([]);

  // ==========================================
  // Pagination
  // ==========================================

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  // ==========================================
  // Loading
  // ==========================================

  const [loading, setLoading] = useState(false);

  // ==========================================
  // Selected Rows
  // ==========================================

  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>({
    type: 'include',
    ids: new Set(),
  });

  // ==========================================
  // Search Values
  // ==========================================

  const [searchValues, setSearchValues] = useState({
    month: null as number | null,
    year: '',
    processStatus: '',
    yeganFrom: '',
    yeganTo: '',
    force: '',
    orderNum: '',
    sender: '',
    employeeNumber: '',
  });

  // ==========================================
  // Options
  // ==========================================

  const process = ['تایید', 'بررسی شد', 'در انتظار', 'مرجوعی'];

  const forces = ['زمینی', 'هوایی', 'پدافند هوایی', 'دریایی'];

  const communication = ['تامین', 'مالی'];

  // ==========================================
  // Columns
  // ==========================================

  const columns: GridColDef<CartableRow>[] = [
    {
      field: 'process',
      headerName: 'عملیات',
      width: 100,
      renderCell: () => <AddCartAm />,
    },

    {
      field: 'watched',
      headerName: 'وضعیت مشاهده',
      width: 120,
      editable: true,

      renderCell: params => <Checkbox checked={Boolean(params.value)} />,
    },

    {
      field: 'month',
      headerName: 'ماه',
      width: 100,
    },

    {
      field: 'year',
      headerName: 'سال',
      width: 110,
      editable: true,
    },

    {
      field: 'fileDet',
      headerName: 'مشخصات فایل',
      width: 160,
      sortable: false,
    },

    {
      field: 'description',
      headerName: 'توضیحات',
      width: 200,
      editable: true,
    },

    {
      field: 'orderNum',
      headerName: 'شماره دستور',
      width: 100,
      editable: true,
    },

    {
      field: 'yegan',
      headerName: 'یگان ایجاد کننده',
      width: 140,
      editable: true,
    },

    {
      field: 'force',
      headerName: 'نیرو',
      width: 120,
      editable: true,
    },

    {
      field: 'sender',
      headerName: 'سازمان ارسال کننده',
      width: 140,
      editable: true,
    },

    {
      field: 'curYegan',
      headerName: 'یگان فعلی',
      width: 120,
      editable: true,
    },

    {
      field: 'processStatus',
      headerName: 'وضعیت فرآیند',
      width: 120,
      editable: true,
    },

    {
      field: 'fileNum',
      headerName: 'شماره فایل',
      width: 120,
      editable: true,
    },
  ];

  // ==========================================
  // Load Data From data.json
  // ==========================================

  useEffect(() => {
    setLoading(true);

    try {
      if (!Array.isArray(data)) {
        console.error('data.json باید یک آرایه باشد.');

        setRows([]);
        setFilteredRows([]);

        return;
      }

      const formattedData: CartableRow[] = data.map((row, index) => ({
        ...row,
        id: row.id !== undefined && row.id !== null ? row.id : index + 1,
      }));

      console.log('DATA FROM data.json:', formattedData);

      setRows(formattedData);
      setFilteredRows(formattedData);
    } catch (error) {
      console.error('Error loading data.json:', error);

      setRows([]);
      setFilteredRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================
  // Selected Rows
  // ==========================================

  const getSelectedRows = (): CartableRow[] => {
    if (selectedRows.type === 'include' && selectedRows.ids.size === 0) {
      return [];
    }

    if (selectedRows.type === 'include') {
      return filteredRows.filter(row => selectedRows.ids.has(row.id));
    }

    return filteredRows.filter(row => !selectedRows.ids.has(row.id));
  };

  const selectedData = getSelectedRows();

  // ==========================================
  // Search
  // ==========================================

  const handleSearch = () => {
    const result = rows.filter(row => {
      // ماه
      if (searchValues.month !== null) {
        if (Number(row.month) !== searchValues.month) {
          return false;
        }
      }

      // سال
      if (searchValues.year) {
        if (String(row.year) !== searchValues.year) {
          return false;
        }
      }

      // وضعیت فرآیند
      if (searchValues.processStatus) {
        if (row.processStatus !== searchValues.processStatus) {
          return false;
        }
      }

      // یگان از
      if (searchValues.yeganFrom) {
        if (Number(row.curYegan) < Number(searchValues.yeganFrom)) {
          return false;
        }
      }

      // یگان تا
      if (searchValues.yeganTo) {
        if (Number(row.curYegan) > Number(searchValues.yeganTo)) {
          return false;
        }
      }

      // نیرو
      if (searchValues.force) {
        if (row.force !== searchValues.force) {
          return false;
        }
      }

      // شماره دستور
      if (searchValues.orderNum) {
        if (!String(row.orderNum).includes(searchValues.orderNum)) {
          return false;
        }
      }

      // فرستنده
      if (searchValues.sender) {
        if (row.sender !== searchValues.sender) {
          return false;
        }
      }

      // شماره کارمندی
      if (searchValues.employeeNumber) {
        if (!String(row.employeeNumber).includes(searchValues.employeeNumber)) {
          return false;
        }
      }

      return true;
    });

    setFilteredRows(result);

    // صفحه اول
    setPaginationModel({
      page: 0,
      pageSize: 5,
    });

    // پاک کردن انتخاب‌ها
    setSelectedRows({
      type: 'include',
      ids: new Set(),
    });
  };

  // ==========================================
  // Reset Search
  // ==========================================

  const handleResetSearch = () => {
    setSearchValues({
      month: null,
      year: '',
      processStatus: '',
      yeganFrom: '',
      yeganTo: '',
      force: '',
      orderNum: '',
      sender: '',
      employeeNumber: '',
    });

    setFilteredRows(rows);

    setPaginationModel({
      page: 0,
      pageSize: 5,
    });

    setSelectedRows({
      type: 'include',
      ids: new Set(),
    });
  };

  // ==========================================
  // Total Rows
  // ==========================================

  const totalRows = filteredRows.length;

  // ==========================================
  // Render
  // ==========================================

  return (
    <Box>
      {/* ================= HEADER ================= */}

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          columnGap: '5px',
          padding: '5px',
          bgcolor: '#c8e4fd',
        }}
      >
        <CasesIcon />

        <Typography>کارتابل</Typography>
      </Box>

      {/* ================= SEARCH ================= */}

      <form
        onSubmit={e => {
          e.preventDefault();
          handleSearch();
        }}
        style={{
          position: 'relative',
          border: 'solid 1px',
          marginTop: '20px',
          padding: '20px 100px',
        }}
      >
        <Typography
          sx={{
            display: 'inline',
            position: 'absolute',
            top: '5px',
            left: '5px',
            padding: '2px',
            bgcolor: '#c8e4fd',
          }}
        >
          محدوده جستجو
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            marginY: '50px',
            rowGap: '20px',
            columnGap: '10%',
          }}
        >
          {/* ماه */}

          <Month
            value={searchValues.month}
            onChange={value =>
              setSearchValues(prev => ({
                ...prev,
                month: value,
              }))
            }
          />

          {/* سال */}

          <NoInput
            title="سال"
            value={searchValues.year}
            onChange={value =>
              setSearchValues(prev => ({
                ...prev,
                year: value,
              }))
            }
          />

          {/* وضعیت کارتابل */}

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              columnGap: '8px',
            }}
          >
            <Typography>وضعیت کارتابل:</Typography>

            <RadioGroup name="cartable-status" defaultValue="jari">
              <FormControlLabel
                value="jari"
                label="کارتابل جاری"
                control={<Radio />}
              />

              <FormControlLabel
                value="erjaee"
                label="کارتابل ارجاعی"
                control={<Radio />}
              />
            </RadioGroup>
          </Box>

          {/* وضعیت فرآیند */}

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              columnGap: '8px',
            }}
          >
            <Typography>وضعیت فرآیند:</Typography>

            <Autocomplete
              disablePortal
              options={process}
              sx={{ width: 150 }}
              value={searchValues.processStatus || null}
              onChange={(_, newValue) => {
                setSearchValues(prev => ({
                  ...prev,
                  processStatus: newValue ?? '',
                }));
              }}
              renderInput={params => (
                <TextField {...params} label="همه فرآیند ها" />
              )}
            />
          </Box>

          {/* یگان */}

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              columnGap: '8px',
            }}
          >
            <Typography>شماره یگان:</Typography>
            از:
            <TextField
              value={searchValues.yeganFrom}
              onChange={e =>
                setSearchValues(prev => ({
                  ...prev,
                  yeganFrom: e.target.value,
                }))
              }
              sx={{
                width: '70px',
              }}
            />
            تا:
            <TextField
              value={searchValues.yeganTo}
              onChange={e =>
                setSearchValues(prev => ({
                  ...prev,
                  yeganTo: e.target.value,
                }))
              }
              sx={{
                width: '70px',
              }}
            />
          </Box>

          {/* نیرو */}

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              columnGap: '8px',
            }}
          >
            <Typography>نیرو:</Typography>

            <Autocomplete
              disablePortal
              options={forces}
              sx={{ width: 150 }}
              value={searchValues.force || null}
              onChange={(_, newValue) => {
                setSearchValues(prev => ({
                  ...prev,
                  force: newValue ?? '',
                }));
              }}
              renderInput={params => (
                <TextField {...params} label="همه نیرو ها" />
              )}
            />
          </Box>

          {/* شماره کارمندی */}

          <NoInput
            title="شماره کارمندی"
            value={searchValues.employeeNumber}
            onChange={value =>
              setSearchValues(prev => ({
                ...prev,
                employeeNumber: value,
              }))
            }
          />

          {/* شماره دستور */}

          <NoInput
            title="شماره دستور"
            value={searchValues.orderNum}
            onChange={value =>
              setSearchValues(prev => ({
                ...prev,
                orderNum: value,
              }))
            }
          />

          {/* سازمان ارسال کننده */}

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              columnGap: '8px',
            }}
          >
            <Typography>سازمان ارسال کننده:</Typography>

            <Autocomplete
              disablePortal
              options={communication}
              sx={{
                width: 200,
              }}
              value={searchValues.sender || null}
              onChange={(_, newValue) => {
                setSearchValues(prev => ({
                  ...prev,
                  sender: newValue ?? '',
                }));
              }}
              renderInput={params => <TextField {...params} />}
            />
          </Box>

          {/* از تاریخ */}

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              columnGap: '8px',
            }}
          >
            <Typography>از تاریخ:</Typography>

            <DatePicker
              calendar={persian}
              locale={persian_fa}
              render={<InputIcon style={styles} />}
            />
          </Box>

          {/* تا تاریخ */}

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              columnGap: '8px',
            }}
          >
            <Typography>تا تاریخ:</Typography>

            <DatePicker
              calendar={persian}
              locale={persian_fa}
              render={<InputIcon style={styles} />}
            />
          </Box>
        </Box>

        {/* دکمه‌های جستجو */}

        <Box
          sx={{
            display: 'flex',
            columnGap: '10px',
            position: 'absolute',
            left: '10px',
            bottom: '10px',
          }}
        >
          <Button type="button" variant="contained" onClick={handleResetSearch}>
            <CachedIcon />
          </Button>

          <SearchBtn onClick={handleSearch} />
        </Box>
      </form>

      {/* ================= STATUS BUTTONS ================= */}

      <Box
        sx={{
          display: 'flex',
          columnGap: '5px',
          marginTop: '15px',
          border: 'solid 1px',
          padding: '8px',
        }}
      >
        <Button variant="contained">شروع شده</Button>

        <Button variant="contained">در جریان</Button>

        <Button variant="contained">برگشت خورده</Button>

        <Button variant="contained">به اتمام رسیده</Button>
      </Box>

      {/* ================= GRID ================= */}

      <Box
        sx={{
          marginTop: '15px',
          border: 'solid 1px',
          padding: '8px',
          marginBottom: '40px',
        }}
      >
        {/* Toolbar */}

        <Box
          sx={{
            display: 'flex',
            columnGap: '5px',
          }}
        >
          <NewCart setGridData={setFilteredRows} />

          <DeleteBtn
            rows={rows}
            setRows={setRows}
            setFilteredRows={setFilteredRows}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
          />

          <ExcelBtn rows={selectedData} columns={columns} />

          <PdfBtn rows={selectedData} columns={columns} />

          <Button variant="contained" size="medium">
            تهیه خروجی داده ها
          </Button>

          <Button variant="contained" size="medium">
            <TuneIcon />
            سفارشی سازی ستون ها
          </Button>
        </Box>

        {/* DataGrid */}

        <Box
          sx={{
            height: 400,
            width: '100%',
            marginTop: '20px',
          }}
        >
          <DataGrid
            rows={filteredRows}
            columns={columns}

            loading={loading}

            checkboxSelection

            rowSelectionModel={selectedRows}

            onRowSelectionModelChange={newSelection => {
              setSelectedRows(newSelection);
            }}

            disableRowSelectionOnClick

            pagination

            paginationMode="client"

            rowCount={totalRows}

            paginationModel={paginationModel}

            onPaginationModelChange={newModel => {
              setPaginationModel(newModel);
            }}

            pageSizeOptions={[5]}

            getRowId={row => row.id}

            localeText={{
              ...faIR.components.MuiDataGrid.defaultProps.localeText,

              paginationDisplayedRows: ({ from, to, count }) =>
                `${from}–${to} از ${count !== -1 ? count : `بیشتر از ${to}`}`,

              paginationRowsPerPage: 'تعداد در هر صفحه',

              footerRowSelected: count => `${count} ردیف انتخاب شده`,
            }}

            sx={{
              '& .MuiDataGrid-cell': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              },

              '& .MuiDataGrid-columnHeaderTitleContainer': {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
