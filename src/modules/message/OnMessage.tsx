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
  Alert,
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

// =========================
// محدودیت فایل
// =========================

// حداکثر حجم فایل: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// فقط ZIP
const ALLOWED_FILE_TYPE = 'application/zip';

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

  // پیام خطای فایل
  const [fileError, setFileError] =
    useState('');

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
    setFileError('');
    setFileModalOpen(true);
  };

  // =========================
  // بستن Modal فایل
  // =========================

  const handleCloseFileModal = () => {
    setFileError('');
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

    if (!file) {
      return;
    }

    // پاک کردن خطای قبلی
    setFileError('');

    // =========================
    // بررسی فرمت فایل
    // =========================

    const isZip =
      file.type === ALLOWED_FILE_TYPE ||
      file.name
        .toLowerCase()
        .endsWith('.zip');

    if (!isZip) {
      setFileError(
        'فقط فایل با فرمت ZIP مجاز است.',
      );

      event.target.value = '';

      setSelectedFile(null);

      return;
    }

    // =========================
    // بررسی حجم فایل
    // =========================

    if (file.size > MAX_FILE_SIZE) {
      setFileError(
        'حجم فایل نباید بیشتر از 10 مگابایت باشد.',
      );

      event.target.value = '';

      setSelectedFile(null);

      return;
    }

    // =========================
    // فایل معتبر است
    // =========================

    setSelectedFile(file);
  };

  // =========================
  // آپلود فایل
  // =========================

  const handleUpload = async () => {
    // پاک کردن خطای قبلی
    setFileError('');

    // =========================
    // بررسی انتخاب فایل
    // =========================

    if (!selectedFile) {
      setFileError(
        'لطفاً ابتدا یک فایل انتخاب کنید.',
      );

      return;
    }

    // =========================
    // بررسی مجدد فرمت
    // =========================

    const isZip =
      selectedFile.type === ALLOWED_FILE_TYPE ||
      selectedFile.name
        .toLowerCase()
        .endsWith('.zip');

    if (!isZip) {
      setFileError(
        'فقط فایل با فرمت ZIP مجاز است.',
      );

      return;
    }

    // =========================
    // بررسی مجدد حجم
    // =========================

    if (selectedFile.size > MAX_FILE_SIZE) {
      setFileError(
        'حجم فایل نباید بیشتر از 10 مگابایت باشد.',
      );

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

      setFileError('');

      setFileModalOpen(false);
    } catch (error) {
      console.error(
        'Upload error:',
        error,
      );

      setFileError(
        'آپلود فایل با خطا مواجه شد.',
      );
    } finally {
      setUploading(false);
    }
  };

  // =========================
  // ارسال پیام
  // =========================

  const handleSend = () => {
    console.log(
      'عنوان:',
      title,
    );

    console.log(
      'متن:',
      text,
    );

    console.log(
      'گیرنده:',
      selectedUser,
    );

    console.log(
      'فایل:',
      selectedFile,
    );

    onClose();
  };

  // =========================
  // تبدیل حجم فایل به MB
  // =========================

  const getFileSizeInMB = (
    file: File,
  ) => {
    return (
      file.size /
      (1024 * 1024)
    ).toFixed(2);
  };

  // =========================
  // UI
  // =========================

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
        label="متن پیام"
        placeholder="متن پیام را وارد کنید"
        value={text}
        onChange={(event) =>
          setText(event.target.value)
        }
        sx={{
          mb: 2,
          '& .MuiInputBase-root': {
            minHeight: '350px',
            alignItems: 'flex-start',
          },
        }}
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
          startIcon={
            <AttachFileIcon />
          }
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

        {/* ========================= */}
        {/* عنوان Modal */}
        {/* ========================= */}

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

        {/* ========================= */}
        {/* محتوای Modal */}
        {/* ========================= */}

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

            {/* ========================= */}
            {/* توضیحات محدودیت */}
            {/* ========================= */}

            <Box
              sx={{
                width: '100%',
                p: 2,
                borderRadius: 1,
                bgcolor:
                  'background.default',
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
              >
                فقط فایل ZIP مجاز است
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
                sx={{ mt: 0.5 }}
              >
                حداکثر حجم فایل: 10 مگابایت
              </Typography>
            </Box>

            {/* ========================= */}
            {/* پیام خطا */}
            {/* ========================= */}

            {fileError && (
              <Alert
                severity="error"
                onClose={() =>
                  setFileError('')
                }
                sx={{
                  width: '100%',
                }}
              >
                {fileError}
              </Alert>
            )}

            {/* ========================= */}
            {/* انتخاب فایل */}
            {/* ========================= */}

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
                accept=".zip,application/zip"
                onChange={
                  handleFileChange
                }
              />
            </Button>

            {/* ========================= */}
            {/* نمایش فایل */}
            {/* ========================= */}

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
                  {getFileSizeInMB(
                    selectedFile,
                  )}{' '}
                  MB
                </Typography>

                <Typography
                  variant="body2"
                  color="success.main"
                  sx={{ mt: 1 }}
                >
                  فایل معتبر است ✓
                </Typography>

              </Box>
            )}

          </Box>

        </DialogContent>

        {/* ========================= */}
        {/* دکمه‌های Modal */}
        {/* ========================= */}

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
          startIcon={
            <DoNotDisturbAltIcon />
          }
        >
          انصراف
        </Button>

      </Box>

    </Box>
  );
};

export default OnMessage;