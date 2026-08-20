import AddCircleIcon from '@mui/icons-material/AddCircle';
import {
  Backdrop,
  Box,
  Button,
  Fade,
  Modal,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React, { useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const style = {
  display: 'flex',
  flexDirection: 'column',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  paddingTop: '60px',
};

export default function AddCartAm() {
  const [open, setOpen] = React.useState(false);
  const [files, setFiles] = useState([]);
  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  const handleClose = () => setOpen(false);
  const handleAddCart = function () {
    setOpen(true);
  };
  const handleDrop = function (e) {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(file => [...file, ...droppedFiles]);
  };
  const handleDragOver = function (e) {
    e.preventDefault();
  };

  return (
    <div>
      <AddCircleIcon
        sx={{ color: '#1976d2', cursor: 'pointer', marginTop: '22px' }}
        onClick={handleAddCart}
      />
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
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
              <Typography>انتخاب فایل:</Typography>
              <CloseIcon onClick={handleClose} sx={{ cursor: 'pointer' }} />
            </Box>
            <TextField
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              value={files.map(file => file.name)}
            />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: '10px',
                marginTop: '20px',
              }}
            >
              <Button
                type="submit"
                variant="contained"
                sx={{ bgcolor: '#1976d2' }}
              >
                <SaveIcon />
                ذخیره
              </Button>
              <Button
                component="label"
                role={undefined}
                variant="contained"
                color="success"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
              >
                بارگذاری فایل
                <VisuallyHiddenInput
                  type="file"
                  onChange={event => console.log(event.target.files)}
                  multiple
                />
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
