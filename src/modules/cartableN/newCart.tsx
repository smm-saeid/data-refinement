import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import {
  Autocomplete,
  Backdrop,
  Box,
  Button,
  Fade,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import Month from './monthInput';
import NoInput from './noInput';
import { DataGrid } from '@mui/x-data-grid';
import { faIR } from '@mui/x-data-grid/locales';
import type { GridColDef } from '@mui/x-data-grid';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  p: 4,
};

export default function NewCart() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const nums = ['1', '2', '3'];

  const rows = [{ id: 1, lastName: 'Snow', firstName: 'Jon', age: 14 }];
  const columns: GridColDef<(typeof rows)[number]>[] = [
    {
      field: 'fileName',
      headerName: 'نام فایل',
      width: 100,
      editable: true,
    },
    {
      field: 'title',
      headerName: 'عنوان',
      width: 100,
    },
    {
      field: 'watch',
      headerName: 'مشاهده',
      width: 100,
    },
    {
      field: 'delete',
      headerName: 'حذف',
      width: 100,
    },
  ];
  return (
    <form>
      <Button onClick={handleOpen} variant="contained" size="medium">
        <AddIcon />
        جدید
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100%',
                bgcolor: '#1976d2',
                color: 'white',
                p: '5px',
              }}
            >
              <Typography>کارتابل جدید:</Typography>
              <CloseIcon onClick={handleClose} sx={{ cursor: 'pointer' }} />
            </Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                marginY: '50px',
                rowGap: '20px',
                columnGap: '10%',
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
                <Typography>شماره فایل را انتخاب کنید :</Typography>
                <Autocomplete
                  disablePortal
                  options={nums}
                  sx={{ width: 150 }}
                  renderInput={params => <TextField {...params} label="" />}
                />
              </Box>
              <Month />
              <NoInput title="سال" />
              <NoInput title="شماره دستور" />
              <NoInput title="کد یگان" />
              <NoInput title="توضیحات" />
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  columnGap: '8px',
                }}
              >
                <Typography>ثبت ضمیمه:</Typography>
                <DataGrid
                  sx={{ width: '330px' }}
                  rows={rows}
                  columns={columns}
                  localeText={
                    faIR.components.MuiDataGrid.defaultProps.localeText
                  }
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
              <NoInput title="نیرو" />
            </Box>
            <Box
              sx={{ display: 'flex', justifyContent: 'center', gap: '10px' }}
            >
              <Button
                onClick={handleClose}
                type="submit"
                variant="contained"
                sx={{ bgcolor: '#1976d2' }}
              >
                <SaveIcon />
                ذخیره
              </Button>
              <Button onClick={handleClose} variant="outlined" color="error">
                <DeleteIcon />
                حذف و بستن
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </form>
  );
}
