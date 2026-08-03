import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
} from '@mui/material';
import type { UserTableData, ResetPasswordRequest } from '../../types';

interface ResetPasswordModalProps {
  open: boolean;
  user: UserTableData | null;
  onClose: () => void;
  onSubmit: (values: ResetPasswordRequest) => void;
  isLoading?: boolean;
}

export function ResetPasswordModal({
  open,
  user,
  onClose,
  onSubmit,
  isLoading = false,
}: ResetPasswordModalProps) {
  const [formData, setFormData] = useState({
    username: '',
    newPassword: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.nationalityCode || user.username || '',
        newPassword: '',
      });
    }
  }, [user]);

  const handleChange =
    (field: keyof typeof formData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    
    if (!formData.username.trim() || !formData.newPassword.trim()) {
      return;
    }


    const requestPayload: ResetPasswordRequest = {
      paginationModel: {
        offset: 0, // This will be overridden by parent component
        pageSize: 10, // This will be overridden by parent component
      },
      searchModel: {
        username: formData.username,
        newPassword: formData.newPassword, // Parent component will encode this
      },
    };

    onSubmit(requestPayload);
  };

  const handleClose = () => {
    setFormData({ username: '', newPassword: '' });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h5" component="div">
          بازنشانی رمز عبور
        </Typography>
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            fullWidth
            label="کدملی"
            value={formData.username}
            onChange={handleChange('username')}
            margin="normal"
            required
            disabled={isLoading}
          />

          <TextField
            fullWidth
            label="رمز جدید"
            type="password"
            value={formData.newPassword}
            onChange={handleChange('newPassword')}
            margin="normal"
            required
            disabled={isLoading}
            helperText="رمز عبور جدید را وارد کنید"
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} disabled={isLoading}>
            انصراف
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading || !formData.username || !formData.newPassword}
          >
            {isLoading ? 'در حال بازنشانی...' : 'بازنشانی رمز عبور'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
