import {
  Autocomplete,
  Box,
  Button,
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
import { GridSearchIcon } from '@mui/x-data-grid';
import CachedIcon from '@mui/icons-material/Cached';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TuneIcon from '@mui/icons-material/Tune';
// import { DataGrid, GridColDef } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';
import { faIR } from '@mui/x-data-grid/locales';
const styles = {
  width: '150px',
  height: '50px',
  fontSize: '16px',
};

export default function Cartable() {
  const columns: GridColDef<(typeof rows)[number]>[] = [
    { field: 'process', headerName: 'عملیات', width: 100 },
    {
      field: 'view',
      headerName: 'وضعیت مشاهده',
      width: 120,
      editable: true,
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
      field: 'details',
      headerName: 'مشخصات فایل',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
      valueGetter: (value, row) =>
        `${row.firstName || ''} ${row.lastName || ''}`,
    },
    {
      field: 'description',
      headerName: 'توضیحات',
      width: 200,
      editable: true,
    },
    {
      field: 'num',
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
      field: 'community',
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
      field: 'processSit',
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

  const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 14 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 11 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
  ];
  const month = [
    'فروردین',
    'اردیبهشت',
    'خرداد',
    'تیر',
    'مرداد',
    'شهریور',
    'مهر',
    'آبان',
    'آذر',
    'دی',
    'بهمن',
    'اسفند',
  ];
  const process = ['ارسال', 'دریافت'];
  const forces = [
    'نیرو زمینی',
    'نیرو هوایی',
    'نیرو پدافند هوایی',
    'نیرو دریایی',
  ];
  const communication = ['تامین', 'دژبان'];
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
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              columnGap: '8px',
            }}
          >
            <Typography>ماه:</Typography>
            <Autocomplete
              disablePortal
              options={month}
              sx={{ width: 150 }}
              renderInput={params => (
                <TextField {...params} label="انتخاب کنید" />
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
            <Typography>سال:</Typography>
            <TextField />
          </Box>
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
            <TextField sx={{ width: '70px' }} />
            تا:
            <TextField sx={{ width: '70px' }} />
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
              renderInput={params => (
                <TextField {...params} label="همه نیرو ها" />
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
            <Typography>شماره کارمندی:</Typography>
            <TextField />
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              columnGap: '8px',
            }}
          >
            <Typography>شماره دستور:</Typography>
            <TextField sx={{ width: '150px' }} />
          </Box>
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
          <Button variant="contained">
            <GridSearchIcon />
          </Button>
          <Button variant="contained">
            <CachedIcon />
          </Button>
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
        <Button variant="contained" size="medium">
          تهیه خروجی داده ها
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
          <Button variant="contained" size="medium">
            <AddIcon />
            جدید
          </Button>
          <Button variant="contained" size="medium">
            <DeleteIcon />
            حذف موارد انتخابی
          </Button>
          <Button variant="contained" size="medium">
            <FileCopyIcon />
            خروجی اکسل
          </Button>
          <Button variant="contained" size="medium">
            <PictureAsPdfIcon />
            خروجی پی دی اف
          </Button>
          <Button variant="contained" size="medium">
            <TuneIcon />
            سفارشی سازی ستون ها
          </Button>
        </Box>
        <Box sx={{ height: 400, width: '100%', marginTop: '20px' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            localeText={faIR.components.MuiDataGrid.defaultProps.localeText}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
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
