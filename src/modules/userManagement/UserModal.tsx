import { useEffect, useState } from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  IconButton,
  InputAdornment,
  MenuItem,
  Tooltip,
} from '@mui/material';

import PersonAddIcon from '@mui/icons-material/PersonAdd';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import BusinessIcon from '@mui/icons-material/Business';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import axios from 'axios';

import type { User, UserForm } from './types';

const API_URL = 'https://dummyjson.com/users';

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
  startDate: '',
  endDate: '',
  workShift: '',
  organization: '',
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

  const [form, setForm] = useState<UserForm>({
    ...initialForm,
  });

  // ==================================================
  // Loading
  // ==================================================

  const [isLoading, setIsLoading] = useState(false);

  // ==================================================
  // Password Visibility
  // ==================================================

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  // ==================================================
  // Edit Mode
  // ==================================================

  const isEditMode = Boolean(user);

  // ==================================================
  // Load User
  // ==================================================

  useEffect(() => {
    if (!open) return;

    setShowPassword(false);
    setShowConfirmPassword(false);

    if (user) {
      setForm({
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
        username: user.username ?? '',

        // رمز قبلی نمایش داده نمی‌شود
        password: '',
        confirmPassword: '',

        personnelCode: user.personnelCode ?? '',

        startDate: user.startDate ?? '',
        endDate: user.endDate ?? '',

        workShift: user.workShift ?? '',

        organization:
          user.organization ??
          user.company?.name ??
          '',
      });
    } else {
      setForm({
        ...initialForm,
      });
    }
  }, [user, open]);

  // ==================================================
  // Persian Validation
  // ==================================================

  const onlyPersian = (value: string) => {
    return value.replace(/[^آ-ی\s]/g, '');
  };

  // ==================================================
  // English Validation
  // ==================================================

  const onlyEnglish = (value: string) => {
    return value.replace(/[^a-zA-Z]/g, '');
  };

  // ==================================================
  // Password Characters
  // ==================================================

  const onlyEnglishPassword = (value: string) => {
    return value.replace(
      /[^a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?`~]/g,
      '',
    );
  };

  // ==================================================
  // Personnel Code
  // فقط عدد و حداکثر ۹ رقم
  // ==================================================

  const onlyNumbers = (value: string) => {
    return value
      .replace(/[^0-9]/g, '')
      .slice(0, 9);
  };

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
  };

  // ==================================================
  // Clear Form
  // ==================================================

  const handleClearForm = () => {
    setForm({
      ...initialForm,
    });

    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  // ==================================================
  // Clear Organization
  // ==================================================

  const handleClearOrganization = () => {
    handleChange(
      'organization',
      '',
    );
  };

  // ==================================================
  // Close
  // ==================================================

  const handleClose = () => {
    if (isLoading) return;

    setForm({
      ...initialForm,
    });

    setShowPassword(false);
    setShowConfirmPassword(false);

    onClose();
  };

  // ==================================================
  // Password Validation
  // ==================================================

  const passwordMinLength =
    form.password.length >= 8;

  const passwordHasUppercase =
    /[A-Z]/.test(form.password);

  const passwordHasLowercase =
    /[a-z]/.test(form.password);

  const passwordHasNumber =
    /[0-9]/.test(form.password);

  const passwordHasSymbol =
    /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(
      form.password,
    );

  const passwordStrong =
    passwordMinLength &&
    passwordHasUppercase &&
    passwordHasLowercase &&
    passwordHasNumber &&
    passwordHasSymbol;

  // ==================================================
  // Password Mismatch
  // ==================================================

  const passwordMismatch =
    form.confirmPassword !== '' &&
    form.password !== form.confirmPassword;

  // ==================================================
  // Personnel Code Validation
  // ==================================================

  const personnelCodeInvalid =
    form.personnelCode.length !== 9;

  // ==================================================
  // Date Validation
  // ==================================================

  const dateInvalid =
    form.startDate !== '' &&
    form.endDate !== '' &&
    form.endDate < form.startDate;

  // ==================================================
  // Required Fields
  // ==================================================

  const requiredFieldsEmpty =
    !form.firstName.trim() ||
    !form.lastName.trim() ||
    !form.username.trim() ||
    !form.personnelCode.trim() ||
    !form.startDate.trim() ||
    !form.endDate.trim() ||
    !form.workShift.trim() ||
    !form.organization.trim();

  // ==================================================
  // Password Invalid
  // ==================================================

  const passwordInvalid = isEditMode
    ? (
        // اگر رمز جدید وارد شده باشد
        // باید قوی باشد
        (form.password !== '' &&
          !passwordStrong) ||

        // تکرار رمز بدون رمز اصلی
        (form.password === '' &&
          form.confirmPassword !== '') ||

        // رمز بدون تکرار
        (form.password !== '' &&
          form.confirmPassword === '') ||

        // عدم تطابق
        passwordMismatch
      )
    : (
        // ایجاد کاربر
        !passwordStrong ||
        !form.confirmPassword.trim() ||
        passwordMismatch
      );

  // ==================================================
  // Final Validation
  // ==================================================

  const isFormInvalid =
    requiredFieldsEmpty ||
    personnelCodeInvalid ||
    passwordInvalid ||
    dateInvalid;

  // ==================================================
  // Save
  // ==================================================

  const handleSave = async (
    createNew = false,
  ) => {
    if (isFormInvalid) {
      return;
    }

    try {
      setIsLoading(true);

      // ==================================================
      // Payload
      // ==================================================

      const payload: Record<string, unknown> = {
        firstName:
          form.firstName.trim(),

        lastName:
          form.lastName.trim(),

        username:
          form.username.trim(),

        personnelCode:
          form.personnelCode.trim(),

        startDate:
          form.startDate,

        endDate:
          form.endDate,

        workShift:
          form.workShift,

        organization:
          form.organization.trim(),
      };

      // ==================================================
      // Password
      // ==================================================

      if (form.password.trim()) {
        payload.password =
          form.password;
      }

      // ==================================================
      // API
      // ==================================================

      let response;

      // ==================================================
      // Edit
      // ==================================================

      if (isEditMode && user) {
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

      const savedUser = response.data;

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

        startDate:
          savedUser.startDate ??
          form.startDate,

        endDate:
          savedUser.endDate ??
          form.endDate,

        workShift:
          savedUser.workShift ??
          form.workShift,

        organization:
          savedUser.organization ??
          form.organization,

        fullName:
          `${
            savedUser.firstName ??
            form.firstName
          } ${
            savedUser.lastName ??
            form.lastName
          }`.trim(),

        department:
          savedUser.company?.department ??
          savedUser.department ??
          '-',
      };

      // ==================================================
      // Send To Parent
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

        setShowPassword(false);
        setShowConfirmPassword(false);

        return;
      }

      // ==================================================
      // Save & Close
      // ==================================================

      setForm({
        ...initialForm,
      });

      setShowPassword(false);
      setShowConfirmPassword(false);

      onClose();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Save Error:',
          error.response?.data ??
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
  // Delete User
  // ==================================================

  const handleDeleteAndClose = async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      await axios.delete(
        `${API_URL}/${user.id}`,
      );

      setForm({
        ...initialForm,
      });

      setShowPassword(false);
      setShowConfirmPassword(false);

      onClose();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Delete Error:',
          error.response?.data ??
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
                onlyPersian(
                  e.target.value,
                ),
              )
            }
            slotProps={{
              htmlInput: {
                dir: 'rtl',
              },
            }}
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
                onlyPersian(
                  e.target.value,
                ),
              )
            }
            slotProps={{
              htmlInput: {
                dir: 'rtl',
              },
            }}
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
                onlyEnglish(
                  e.target.value,
                ),
              )
            }
            slotProps={{
              htmlInput: {
                dir: 'ltr',
              },
            }}
          />

          {/* ==================================================
              کلمه عبور
              ================================================== */}

          <TextField
            fullWidth
            size="small"
            type={
              showPassword
                ? 'text'
                : 'password'
            }
            label="کلمه عبور"
            value={form.password}
            autoComplete="new-password"
            onChange={(e) =>
              handleChange(
                'password',
                onlyEnglishPassword(
                  e.target.value,
                ),
              )
            }
            error={
              form.password !== '' &&
              !passwordStrong
            }
            helperText={
              form.password !== '' &&
              !passwordStrong
                ? 'حداقل ۸ کاراکتر، شامل حرف بزرگ، حرف کوچک، عدد و نماد باشد'
                : ''
            }
            slotProps={{
              htmlInput: {
                dir: 'ltr',
              },

              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowPassword(
                          (prev) => !prev,
                        )
                      }
                      edge="end"
                      aria-label={
                        showPassword
                          ? 'مخفی کردن رمز'
                          : 'نمایش رمز'
                      }
                    >
                      {showPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* ==================================================
              تکرار کلمه عبور
              ================================================== */}

          <TextField
            fullWidth
            size="small"
            type={
              showConfirmPassword
                ? 'text'
                : 'password'
            }
            label="تکرار کلمه عبور"
            value={
              form.confirmPassword
            }
            autoComplete="new-password"
            onChange={(e) =>
              handleChange(
                'confirmPassword',
                onlyEnglishPassword(
                  e.target.value,
                ),
              )
            }
            error={
              passwordMismatch
            }
            helperText={
              passwordMismatch
                ? 'کلمه عبور و تکرار آن یکسان نیستند'
                : ''
            }
            slotProps={{
              htmlInput: {
                dir: 'ltr',
              },

              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(
                          (prev) => !prev,
                        )
                      }
                      edge="end"
                      aria-label={
                        showConfirmPassword
                          ? 'مخفی کردن رمز'
                          : 'نمایش رمز'
                      }
                    >
                      {showConfirmPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
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
            autoComplete="off"
            onChange={(e) =>
              handleChange(
                'personnelCode',
                onlyNumbers(
                  e.target.value,
                ),
              )
            }
            error={
              form.personnelCode !== '' &&
              personnelCodeInvalid
            }
            helperText={
              form.personnelCode !== '' &&
              personnelCodeInvalid
                ? 'کد کارگزینی باید دقیقاً ۹ رقم باشد'
                : ''
            }
            slotProps={{
              htmlInput: {
                dir: 'ltr',
                inputMode: 'numeric',
                maxLength: 9,
              },
            }}
          />

          {/* ==================================================
              آغاز زمان فعالیت
              ================================================== */}

          <TextField
            fullWidth
            size="small"
            label="آغاز زمان فعالیت"
            type="date"
            value={
              form.startDate
            }
            onChange={(e) =>
              handleChange(
                'startDate',
                e.target.value,
              )
            }
            slotProps={{
              inputLabel: {
                shrink: true,
              },

              htmlInput: {
                dir: 'ltr',
              },
            }}
          />

          {/* ==================================================
              اتمام زمان فعالیت
              ================================================== */}

          <TextField
            fullWidth
            size="small"
            label="اتمام زمان فعالیت"
            type="date"
            value={
              form.endDate
            }
            onChange={(e) =>
              handleChange(
                'endDate',
                e.target.value,
              )
            }
            error={dateInvalid}
            helperText={
              dateInvalid
                ? 'تاریخ اتمام نباید قبل از تاریخ آغاز باشد'
                : ''
            }
            slotProps={{
              inputLabel: {
                shrink: true,
              },

              htmlInput: {
                dir: 'ltr',
              },
            }}
          />

          {/* ==================================================
              شیفت کاری
              ================================================== */}

          <TextField
            fullWidth
            size="small"
            select
            label="شیفت کاری"
            value={
              form.workShift
            }
            onChange={(e) =>
              handleChange(
                'workShift',
                e.target.value,
              )
            }
          >
            <MenuItem value="صبح">
              صبح
            </MenuItem>

            <MenuItem value="عصر">
              عصر
            </MenuItem>

            <MenuItem value="شب">
              شب
            </MenuItem>

            <MenuItem value="اداری">
              اداری
            </MenuItem>
          </TextField>

          {/* ==================================================
              سازمان
              ================================================== */}

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              width: '100%',
            }}
          >
            {/* فیلد سازمان */}

            <TextField
              fullWidth
              size="small"
              label="سازمان"
              value={
                form.organization
              }
              onChange={(e) =>
                handleChange(
                  'organization',
                  e.target.value,
                )
              }
              slotProps={{
                htmlInput: {
                  dir: 'rtl',
                },
              }}
            />

            {/* ==================================================
                آیکن سازمان
                ================================================== */}

            <Tooltip title="سازمان">
              <IconButton
                size="small"
                sx={{
                  width: 32,
                  height: 32,
                  flexShrink: 0,

                  color:
                    'primary.main',
                }}
              >
                <BusinessIcon
                  fontSize="small"
                />
              </IconButton>
            </Tooltip>

            {/* ==================================================
                سطل زباله قرمز
                ================================================== */}

            <Tooltip title="پاک کردن سازمان">
              <span>
                <IconButton
                  size="small"
                  onClick={
                    handleClearOrganization
                  }
                  disabled={
                    isLoading ||
                    !form.organization
                  }
                  sx={{
                    width: 32,
                    height: 32,
                    flexShrink: 0,

                    color: '#d32f2f',

                    '&:hover': {
                      backgroundColor:
                        'rgba(211, 47, 47, 0.10)',
                    },

                    '&.Mui-disabled': {
                      color:
                        'rgba(211, 47, 47, 0.35)',
                    },
                  }}
                >
                  <DeleteOutlineIcon
                    fontSize="small"
                  />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
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
                  isFormInvalid
                }
              >
                {isLoading
                  ? 'در حال ذخیره...'
                  : 'ذخیره و جدید'}
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
                isFormInvalid
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