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
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import InputIcon from 'react-multi-date-picker/components/input_icon';
import CachedIcon from '@mui/icons-material/Cached';
import TuneIcon from '@mui/icons-material/Tune';
// import { DataGrid, GridColDef } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';
import { faIR } from '@mui/x-data-grid/locales';
import React, { useState } from 'react';
import NewCart from './newCart';
import Month from './monthInput';
import NoInput from './noInput';
import type { GridRowSelectionModel } from '@mui/x-data-grid';
import ExcelBtn from './ExcelBtn';
import DeleteBtn from './DeleteBtn';
import PdfBtn from './PdfBtn';
import data from './data.json';
import SearchBtn from './searchBtn';

const styles = {
  width: '150px',
  height: '50px',
  fontSize: '16px',
};

const gridData = data;

export default function Cartable() {
  const [rows, setRows] = useState(gridData);
  const [filteredRows, setFilteredRows] = useState(rows);
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>({
    type: 'include',
    ids: new Set(),
  });
  const [searchValues, setSearchValues] = useState({
    month: '',
    year: '',
    processStatus: '',
    yeganFrom: '',
    yeganTo: '',
    force: '',
    orderNum: '',
    sender: '',
    employeeNumber: '',
  });

  const process = ['تایید', 'بررسی شد', 'در انتظار', 'مرجوعی'];
  const forces = ['زمینی', 'هوایی', 'پدافند هوایی', 'دریایی'];
  const communication = ['تامین', 'مالی'];

  const columns: GridColDef<(typeof rows)[number]>[] = [
    { field: 'process', headerName: 'عملیات', width: 100 },
    {
      field: 'watched',
      headerName: 'وضعیت مشاهده',
      width: 120,
      editable: true,
      renderCell: params => <Checkbox checked={params.value} />,
    },
    {
      field: 'month',
      headerName: 'ماه',
      width: 100,
    },
    {
      field: 'year',
      headerName: 'سال',
      // type: 'number',
      width: 110,
      editable: true,
    },
    {
      field: 'fileDet',
      headerName: 'مشخصات فایل',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
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

  const handleSearch = () => {
    const monthMap: Record<string, number> = {
      فروردین: 1,
      اردیبهشت: 2,
      خرداد: 3,
      تیر: 4,
      مرداد: 5,
      شهریور: 6,
      مهر: 7,
      آبان: 8,
      آذر: 9,
      دی: 10,
      بهمن: 11,
      اسفند: 12,
    };

    const result = rows.filter(row => {
      // ماه
      if (searchValues.month) {
        if (row.month !== monthMap[searchValues.month]) {
          return false;
        }
      }

      // سال
      if (searchValues.year) {
        if (String(row.year) !== searchValues.year) {
          return false;
        }
      }
      if (searchValues.processStatus) {
        if (row.processStatus !== searchValues.processStatus) {
          return false;
        }
      }
      // شماره یگان فعلی - از
      if (searchValues.yeganFrom) {
        if (Number(row.curYegan) < Number(searchValues.yeganFrom)) {
          return false;
        }
      }

      // شماره یگان فعلی - تا
      if (searchValues.yeganTo) {
        if (Number(row.curYegan) > Number(searchValues.yeganTo)) {
          return false;
        }
      }
      if (searchValues.force) {
        if (row.force !== searchValues.force) {
          return false;
        }
      }
      if (searchValues.orderNum) {
        if (!String(row.orderNum).includes(searchValues.orderNum)) {
          return false;
        }
      }
      if (searchValues.sender) {
        if (row.sender !== searchValues.sender) {
          return false;
        }
      }
      return true;
    });

    setFilteredRows(result);
  };

  const handleResetSearch = () => {
    setSearchValues({
      month: '',
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
  };

  return (
    <Box>
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
      <form
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
            // justifyContent: 'space-between',
          }}
        >
          <Month
            value={searchValues.month}
            onChange={value =>
              setSearchValues(prev => ({
                ...prev,
                month: value,
              }))
            }
          />{' '}
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
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              columnGap: '8px',
            }}
          >
            <Typography>وضعیت کارتابل:</Typography>
            <RadioGroup name="use-radio-group" defaultValue="first">
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
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              columnGap: '8px',
            }}
          >
            <Typography sx={{ marginLeft: '10px' }}>شماره یگان:</Typography>
            از:
            <TextField
              value={searchValues.yeganFrom}
              onChange={e =>
                setSearchValues(prev => ({
                  ...prev,
                  yeganFrom: e.target.value,
                }))
              }
              sx={{ width: '70px' }}
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
              sx={{ width: '70px' }}
            />
          </Box>
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
              sx={{ width: 200 }}
              value={searchValues.sender || null}
              onChange={(_, newValue) => {
                setSearchValues(prev => ({
                  ...prev,
                  sender: newValue ?? '',
                }));
              }}
              renderInput={params => <TextField {...params} label="" />}
            />
          </Box>
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
        <Box
          sx={{
            display: 'flex',
            columnGap: '10px',
            position: 'absolute',
            left: '10px',
            bottom: '10px',
          }}
        >
          <Button variant="contained" onClick={handleResetSearch}>
            <CachedIcon />
          </Button>

          <SearchBtn onClick={handleSearch} />
        </Box>
      </form>
      <Box
        sx={{
          display: 'flex',
          columnGap: '5px',
          marginTop: '15px',
          border: 'solid 1px',
          padding: '8px',
        }}
      >
        <Button variant="contained" size="medium">
          شروع شده
        </Button>
        <Button variant="contained" size="medium">
          در جریان
        </Button>
        <Button variant="contained" size="medium">
          برگشت خورده
        </Button>
        <Button variant="contained" size="medium">
          به اتمام رسیده
        </Button>
      </Box>
      <Box
        sx={{
          marginTop: '15px',
          border: 'solid 1px',
          padding: '8px',
          marginBottom: '40px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            columnGap: '5px',
          }}
        >
          <NewCart />
          <DeleteBtn
            rows={rows}
            setRows={setRows}
            setFilteredRows={setFilteredRows}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
          />
          <ExcelBtn rows={filteredRows} columns={columns} />
          <PdfBtn rows={filteredRows} columns={columns} />
          <Button variant="contained" size="medium">
            تهیه خروجی داده ها
          </Button>
          <Button variant="contained" size="medium">
            <TuneIcon />
            سفارشی سازی ستون ها
          </Button>
        </Box>
        <Box sx={{ height: 400, width: '100%', marginTop: '20px' }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            localeText={faIR.components.MuiDataGrid.defaultProps.localeText}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            rowSelectionModel={selectedRows}
            onRowSelectionModelChange={newSelection => {
              setSelectedRows(newSelection);
            }}
            pageSizeOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
          />
        </Box>
      </Box>
    </Box>
  );
}
