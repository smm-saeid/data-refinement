
import { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';

import axios from 'axios';

import type { User, UserForm } from './types';

const API_URL = 'https://dummyjson.com/users';

type UserModalProps = {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onSuccess: (user: User) => void;
};

const initialForm: UserForm = {
  firstName: '',
  lastName: '',
  age: '',
  gender: '',
  phone: '',
  username: '',
};

export default function UserModal({
  open,
  user,
  onClose,
  onSuccess,
}: UserModalProps) {
  const [form, setForm] =
    useState<UserForm>(initialForm);

  const [isLoading, setIsLoading] =
    useState(false);

  const isEditMode = Boolean(user);

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
        age: user.age?.toString() ?? '',
        gender: user.gender ?? '',
        phone: user.phone ?? '',
        username: user.username ?? '',
      });
    } else {
      setForm(initialForm);
    }
  }, [user, open]);

  const handleChange = (
    field: keyof UserForm,
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        age: Number(form.age),
        gender: form.gender,
        phone: form.phone,
        username: form.username,
      };

      let response;

      if (isEditMode && user) {
        // EDIT
        response = await axios.put<User>(
          `${API_URL}/${user.id}`,
          payload,
        );
      } else {
        // CREATE
        response = await axios.post<User>(
          `${API_URL}/add`,
          payload,
        );
      }

      const savedUser = response.data;

      const formattedUser: User = {
        ...savedUser,
        fullName: `${savedUser.firstName} ${savedUser.lastName}`,
        department:
          savedUser.company?.department ?? '-',
      };

      onSuccess(formattedUser);

      onClose();

      setForm(initialForm);
    } catch (error: any) {
      console.error(
        error?.response?.data || error,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (isLoading) return;

    setForm(initialForm);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        {isEditMode
          ? 'ویرایش کاربر'
          : 'ایجاد کاربر جدید'}
      </DialogTitle>

      <DialogContent>
        <Stack
          spacing={2}
          sx={{ mt: 1 }}
        >
          <TextField
            fullWidth
            label="نام"
            value={form.firstName}
            onChange={(e) =>
              handleChange(
                'firstName',
                e.target.value,
              )
            }
          />

          <TextField
            fullWidth
            label="نام خانوادگی"
            value={form.lastName}
            onChange={(e) =>
              handleChange(
                'lastName',
                e.target.value,
              )
            }
          />

          <TextField
            fullWidth
            label="نام کاربری"
            value={form.username}
            onChange={(e) =>
              handleChange(
                'username',
                e.target.value,
              )
            }
          />

          <TextField
            fullWidth
            label="شماره تماس"
            value={form.phone}
            onChange={(e) =>
              handleChange(
                'phone',
                e.target.value,
              )
            }
          />

          <TextField
            fullWidth
            type="number"
            label="سن"
            value={form.age}
            onChange={(e) =>
              handleChange(
                'age',
                e.target.value,
              )
            }
          />

          <TextField
            fullWidth
            label="جنسیت"
            value={form.gender}
            onChange={(e) =>
              handleChange(
                'gender',
                e.target.value,
              )
            }
            placeholder="male / female"
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleClose}
          disabled={isLoading}
        >
          انصراف
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={
            isLoading ||
            !form.firstName ||
            !form.lastName ||
            !form.username
          }
        >
          {isLoading
            ? 'در حال ذخیره...'
            : isEditMode
              ? 'ذخیره تغییرات'
              : 'ایجاد کاربر'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

