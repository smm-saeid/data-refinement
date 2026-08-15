
import { useEffect, useState } from 'react';

import {
  Box,
  Button,
  TextField,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
} from '@mui/material';

import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';
interface OnMessageProps {
  onClose: () => void;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface UsersResponse {
  users: User[];
}

const OnMessage = ({ onClose }: OnMessageProps) => {
  // =========================
  // کاربران
  // =========================

  const [users, setUsers] = useState<User[]>([]);

  const [selectedUser, setSelectedUser] =
    useState<User | null>(null);

  const [loadingUsers, setLoadingUsers] =
    useState(false);

  // =========================
  // پیام
  // =========================

  const [title, setTitle] = useState('');

  const [text, setText] = useState('');

  // =========================
  // فایل
  // =========================

  // فایل انتخاب شده
  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  // باز بودن Modal فایل
  const [fileModalOpen, setFileModalOpen] =
    useState(false);

  // وضعیت آپلود
  const [uploading, setUploading] =
    useState(false);

  // =========================
  // دریافت کاربران
  // =========================

  useEffect(() => {
    const getUsers = async () => {
      try {
        setLoadingUsers(true);

        const response = await fetch(
          'https://dummyjson.com/users',
        );

        if (!response.ok) {
          throw new Error(
            'خطا در دریافت کاربران',
          );
        }

        const data: UsersResponse =
          await response.json();

        setUsers(data.users);
      } catch (error) {
        console.error(
          'Get users error:',
          error,
        );
      } finally {
        setLoadingUsers(false);
      }
    };

    getUsers();
  }, []);

  // =========================
  // باز کردن Modal فایل
  // =========================

  const handleOpenFileModal = () => {
    setFileModalOpen(true);
  };

  // =========================
  // بستن Modal فایل
  // =========================

  const handleCloseFileModal = () => {
    setFileModalOpen(false);
  };

  // =========================
  // انتخاب فایل
  // =========================

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files?.[0] ?? null;

    if (file) {
      setSelectedFile(file);
    }
  };

  // =========================
  // آپلود فایل
  // =========================

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('لطفاً ابتدا یک فایل انتخاب کنید');
      return;
    }

    try {
      setUploading(true);

      /*
       * فعلاً فقط شبیه‌سازی آپلود
       *
       * بعداً این قسمت را به Backend
       * متصل می‌کنیم.
       */

      await new Promise((resolve) =>
        setTimeout(resolve, 1000),
      );

      console.log(
        'فایل آپلود شد:',
        selectedFile,
      );

      setFileModalOpen(false);
    } catch (error) {
      console.error(
        'Upload error:',
        error,
      );
    } finally {
      setUploading(false);
    }
  };

  // =========================
  // ارسال پیام
  // =========================

  const handleSend = () => {
    console.log('عنوان:', title);

    console.log('متن:', text);

    console.log('گیرنده:', selectedUser);

    console.log(
      'فایل:',
      selectedFile,
    );

    onClose();
  };

  return (
    <Box sx={{ p: 1 }}>

      {/* ========================= */}
      {/* عنوان پیام */}
      {/* ========================= */}

      <TextField
        label="عنوان پیام"
        placeholder="عنوان پیام را وارد کنید"
        value={title}
        onChange={(event) =>
          setTitle(event.target.value)
        }
        sx={{
          mb: 2,
          width: '50%',
        }}
      />

      {/* ========================= */}
      {/* متن پیام */}
      {/* ========================= */}

      <TextField
        fullWidth
        multiline
        rows={6}
        label="متن پیام"
        placeholder="متن پیام را وارد کنید"
        value={text}
        onChange={(event) =>
          setText(event.target.value)
        }
        sx={{ mb: 2 }}
      />

      {/* ========================= */}
      {/* فایل + گیرنده */}
      {/* ========================= */}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns:
            '1fr 1fr',
          gap: 2,
          mb: 2,
        }}
      >

        {/* ========================= */}
        {/* فایل ضمیمه */}
        {/* ========================= */}

        <Button
          variant="outlined"
          startIcon={<AttachFileIcon />}
          onClick={
            handleOpenFileModal
          }
          sx={{
            height: 56,
            justifyContent:
              'flex-start',
            overflow: 'hidden',
            textOverflow:
              'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {selectedFile
            ? selectedFile.name
            : 'فایل ضمیمه'}
        </Button>

        {/* ========================= */}
        {/* گیرنده */}
        {/* ========================= */}

        <Autocomplete
          fullWidth
          options={users}
          value={selectedUser}
          loading={loadingUsers}
          onChange={(_, newValue) => {
            setSelectedUser(newValue);
          }}
          getOptionLabel={(user) =>
            `${user.firstName} ${user.lastName}`
          }
          isOptionEqualToValue={(
            option,
            value,
          ) =>
            option.id === value.id
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="گیرندگان"
              placeholder="گیرنده را انتخاب کنید"
            />
          )}
        />

      </Box>

      {/* ========================= */}
      {/* Modal فایل */}
      {/* ========================= */}

      <Dialog
        open={fileModalOpen}
        onClose={
          handleCloseFileModal
        }
        fullWidth
        maxWidth="sm"
      >

        {/* عنوان Modal */}

        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent:
              'space-between',
          }}
        >
          انتخاب فایل

          <IconButton
            onClick={
              handleCloseFileModal
            }
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        {/* محتوای Modal */}

        <DialogContent dividers>

          <Box
            sx={{
              display: 'flex',
              flexDirection:
                'column',
              alignItems: 'center',
              gap: 2,
              py: 3,
            }}
          >

            {/* انتخاب فایل */}

            <Button
              variant="outlined"
              component="label"
              startIcon={
                <AttachFileIcon />
              }
              sx={{
                minWidth: 200,
                height: 50,
              }}
            >
              انتخاب فایل

              <input
                type="file"
                hidden
                onChange={
                  handleFileChange
                }
              />
            </Button>

            {/* نمایش فایل */}

            {selectedFile && (
              <Box
                sx={{
                  width: '100%',
                  p: 2,
                  border:
                    '1px solid',
                  borderColor:
                    'divider',
                  borderRadius: 1,
                }}
              >

                <Typography
                  fontWeight="bold"
                >
                  فایل انتخاب شده:
                </Typography>

                <Typography
                  sx={{
                    mt: 1,
                    wordBreak:
                      'break-all',
                  }}
                >
                  {selectedFile.name}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  حجم فایل:{' '}
                  {(
                    selectedFile.size /
                    1024
                  ).toFixed(2)}{' '}
                  KB
                </Typography>

              </Box>
            )}

          </Box>

        </DialogContent>

        {/* دکمه‌های Modal */}

        <DialogActions
          sx={{
            px: 3,
            pb: 2,
          }}
        >
          <Button
            variant="contained"
            startIcon={
              <CloudUploadIcon />
            }
            disabled={
              !selectedFile ||
              uploading
            }
            onClick={handleUpload}
          >
            {uploading
              ? 'در حال آپلود...'
              : 'آپلود'}
          </Button>

        </DialogActions>

      </Dialog>

      {/* ========================= */}
      {/* دکمه‌های اصلی */}
      {/* ========================= */}

      <Box
        sx={{
          display: 'flex',
          justifyContent:
            'flex-end',
          gap: 1,
        }}
      >

        <Button
          variant="contained"
          startIcon={
            <SendIcon />
          }
          onClick={handleSend}
        >
          ارسال 
        </Button>

        <Button
          variant="outlined"
          onClick={onClose}
          startIcon={<DoNotDisturbAltIcon />}

        >
          انصراف
        </Button>

      </Box>

    </Box>
  );
};

export default OnMessage;

