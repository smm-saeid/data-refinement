import { useEffect, useState } from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';


import axios from 'axios';

import type { User, UserForm } from './types';

const API_URL =
  'https://dummyjson.com/users';

// ==================================================
// Props
// ==================================================

type UserModalProps = {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onSuccess: (user: User) => void;
};

// ==================================================
// Initial Form
// ==================================================

const initialForm: UserForm = {
  firstName: '',
  lastName: '',
  username: '',
  password: '',
  confirmPassword: '',
  personnelCode: '',
};

// ==================================================
// Component
// ==================================================

export default function UserModal({
  open,
  user,
  onClose,
  onSuccess,
}: UserModalProps) {
  // ==================================================
  // Form
  // ==================================================

  const [form, setForm] =
    useState<UserForm>({
      ...initialForm,
    });

  // ==================================================
  // Loading
  // ==================================================

  const [isLoading, setIsLoading] =
    useState(false);

  // ==================================================
  // Changed
  // ==================================================

  const [hasChanged, setHasChanged] =
    useState(false);

  // ==================================================
  // Edit Mode
  // ==================================================

  const isEditMode =
    Boolean(user);

  // ==================================================
  // Load User
  // ==================================================

  useEffect(() => {
    if (!open) return;

    if (user) {
      setForm({
        firstName:
          user.firstName ?? '',

        lastName:
          user.lastName ?? '',

        username:
          user.username ?? '',

        password: '',

        confirmPassword: '',

        personnelCode:
          user.personnelCode ?? '',
      });
    } else {
      setForm({
        ...initialForm,
      });
    }

    setHasChanged(false);
  }, [user, open]);

  // ==================================================
  // Change Form
  // ==================================================

  const handleChange = (
    field: keyof UserForm,
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setHasChanged(true);
  };

  // ==================================================
  // Clear Form
  // ==================================================

  const handleClearForm = () => {
    setForm({
      ...initialForm,
    });

    setHasChanged(true);
  };

  // ==================================================
  // Close
  // ==================================================

  const handleClose = () => {
    if (isLoading) return;

    setForm({
      ...initialForm,
    });

    setHasChanged(false);

    onClose();
  };

  // ==================================================
  // Save
  // ==================================================

  const handleSave = async (
    createNew = false,
  ) => {
    // ==================================================
    // Required Fields
    // ==================================================

    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.username.trim() ||
      !form.password ||
      !form.confirmPassword ||
      !form.personnelCode.trim()
    ) {
      return;
    }

    // ==================================================
    // Password Validation
    // ==================================================

    if (
      form.password !==
      form.confirmPassword
    ) {
      return;
    }

    try {
      setIsLoading(true);

      // ==================================================
      // Payload
      // ==================================================

      const payload = {
        firstName:
          form.firstName.trim(),

        lastName:
          form.lastName.trim(),

        username:
          form.username.trim(),

        password:
          form.password,

        personnelCode:
          form.personnelCode.trim(),
      };

      let response;

      // ==================================================
      // Edit
      // ==================================================

      if (
        isEditMode &&
        user
      ) {
        response =
          await axios.put<User>(
            `${API_URL}/${user.id}`,
            payload,
          );
      }

      // ==================================================
      // Create
      // ==================================================

      else {
        response =
          await axios.post<User>(
            `${API_URL}/add`,
            payload,
          );
      }

      // ==================================================
      // Response
      // ==================================================

      const savedUser: User =
        response.data;

      // ==================================================
      // Format User
      // ==================================================

      const formattedUser: User = {
        ...savedUser,

        firstName:
          savedUser.firstName ??
          form.firstName,

        lastName:
          savedUser.lastName ??
          form.lastName,

        username:
          savedUser.username ??
          form.username,

        personnelCode:
          savedUser.personnelCode ??
          form.personnelCode,

        fullName:
          `${savedUser.firstName ?? form.firstName} ${
            savedUser.lastName ?? form.lastName
          }`.trim(),

        department:
          savedUser.company
            ?.department ?? '-',
      };

      // ==================================================
      // Send to Parent
      // ==================================================

      onSuccess(formattedUser);

      // ==================================================
      // Save & New
      // ==================================================

      if (
        createNew &&
        !isEditMode
      ) {
        setForm({
          ...initialForm,
        });

        setHasChanged(false);

        return;
      }

      // ==================================================
      // Save & Close
      // ==================================================

      setForm({
        ...initialForm,
      });

      setHasChanged(false);

      onClose();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Save Error:',
          error.response?.data ||
            error.message,
        );
      } else {
        console.error(
          'Save Error:',
          error,
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ==================================================
  // Delete & Close
  // ==================================================

  const handleDeleteAndClose =
    async () => {
      if (!user) return;

      try {
        setIsLoading(true);

        await axios.delete(
          `${API_URL}/${user.id}`,
        );

        setForm({
          ...initialForm,
        });

        setHasChanged(false);

        onClose();
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error(
            'Delete Error:',
            error.response?.data ||
              error.message,
          );
        } else {
          console.error(
            'Delete Error:',
            error,
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

  // ==================================================
  // Password Mismatch
  // ==================================================

  const passwordMismatch =
    form.confirmPassword !== '' &&
    form.password !==
      form.confirmPassword;

  // ==================================================
  // Required Fields
  // ==================================================

  const requiredFieldsEmpty =
    !form.firstName.trim() ||
    !form.lastName.trim() ||
    !form.username.trim() ||
    !form.password ||
    !form.confirmPassword ||
    !form.personnelCode.trim();

  // ==================================================
  // Render
  // ==================================================

  return (
   <Dialog
  open={open}
  onClose={handleClose}
  fullWidth
  maxWidth="md"
  dir="rtl"
>
      {/* ==================================================
          Title
          ================================================== */}

      <DialogTitle
        sx={{
          fontWeight: 700,
          textAlign: 'left',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <PersonAddIcon
          sx={{
            fontSize: 28,
            color: 'primary.main',
          }}
        />

        {isEditMode
          ? 'ویرایش کاربر'
          : 'ایجاد کاربر جدید'}
      </DialogTitle>

      {/* ==================================================
          Content
          ================================================== */}

      <DialogContent>
        <Box
          sx={{
            mt: 1,

            display: 'grid',

            gridTemplateColumns: {
              xs: '1fr',
              sm: '1fr 1fr',
            },

            gap: 2,
          }}
        >
          {/* ==================================================
              نام
              ================================================== */}

          <TextField
            fullWidth
            size="small"
            label="نام"
            value={form.firstName}
            onChange={(e) =>
              handleChange(
                'firstName',
                e.target.value,
              )
            }
          />

          {/* ==================================================
              نام خانوادگی
              ================================================== */}

          <TextField
            fullWidth
            size="small"
            label="نام خانوادگی"
            value={form.lastName}
            onChange={(e) =>
              handleChange(
                'lastName',
                e.target.value,
              )
            }
          />

          {/* ==================================================
              نام کاربری
              ================================================== */}

          <TextField
            fullWidth
            size="small"
            label="نام کاربری"
            value={form.username}
            onChange={(e) =>
              handleChange(
                'username',
                e.target.value,
              )
            }
          />

          {/* ==================================================
              کلمه عبور
              ================================================== */}

          <TextField
            fullWidth
            size="small"
            type="password"
            label="کلمه عبور"
            value={form.password}
            onChange={(e) =>
              handleChange(
                'password',
                e.target.value,
              )
            }
          />

          {/* ==================================================
              تکرار کلمه عبور
              ================================================== */}

          <TextField
            fullWidth
            size="small"
            type="password"
            label="تکرار کلمه عبور"
            value={
              form.confirmPassword
            }
            onChange={(e) =>
              handleChange(
                'confirmPassword',
                e.target.value,
              )
            }
            error={passwordMismatch}
            helperText={
              passwordMismatch
                ? 'کلمه عبور و تکرار آن یکسان نیستند'
                : ''
            }
          />

          {/* ==================================================
              کد کارگزینی
              ================================================== */}

          <TextField
            fullWidth
            size="small"
            label="کد کارگزینی"
            value={
              form.personnelCode
            }
            onChange={(e) =>
              handleChange(
                'personnelCode',
                e.target.value,
              )
            }
          />
        </Box>
      </DialogContent>

      {/* ==================================================
          Actions
          ================================================== */}

      <DialogActions
        sx={{
          px: 3,
          pb: 2,
          direction: 'rtl',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent:
              'space-between',

            gap: 2,

            width: '100%',

            flexWrap: 'wrap',
          }}
        >
          {/* ==================================================
              سمت راست
              ================================================== */}

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            {/* پاک کردن فرم */}

            <Button
              variant="outlined"
              color="warning"
              onClick={
                handleClearForm
              }
              disabled={isLoading}
            >
              پاک کردن فرم
            </Button>

            {/* حذف و بستن / بستن */}

            <Button
              variant="outlined"
              color={
                isEditMode
                  ? 'error'
                  : 'inherit'
              }
              onClick={
                isEditMode
                  ? handleDeleteAndClose
                  : handleClose
              }
              disabled={isLoading}
            >
              {isEditMode
                ? 'حذف و بستن'
                : 'بستن'}
            </Button>
          </Box>

          {/* ==================================================
              سمت چپ
              ================================================== */}

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            {/* ذخیره و جدید */}

            {!isEditMode && (
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  handleSave(true)
                }
                disabled={
                  isLoading ||
                  requiredFieldsEmpty ||
                  passwordMismatch
                }
              >
                ذخیره و جدید
              </Button>
            )}

            {/* ذخیره */}

            <Button
              variant="contained"
              color="success"
              onClick={() =>
                handleSave(false)
              }
              disabled={
                isLoading ||
                requiredFieldsEmpty ||
                passwordMismatch
              }
            >
              {isLoading
                ? 'در حال ذخیره...'
                : 'ذخیره'}
            </Button>
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  );
}