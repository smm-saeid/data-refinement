
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Typography,
  Grid,
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import MatnaDatePicker from '@/components/date-picker/MatnaDatePicker';
import type { SecurityEventsFilters } from '../../types';
import { useState, useRef, useCallback, useEffect } from 'react';

interface SecurityEventsFiltersProps {
  filters: SecurityEventsFilters;
  onFiltersChange: (filters: SecurityEventsFilters) => void;
  onSearch: () => void;
  onReset: () => void;
  loading?: boolean;
}

const activityTypeOptions = [
  { value: '', label: 'تمام فعالیت‌ها' },
  { value: 'LOGIN', label: 'ورود' },
  { value: 'LOGOUT', label: 'خروج' },
  { value: 'LOGIN_ERROR', label: 'خطای ورود' },
  { value: 'LOGOUT_ERROR', label: 'خطای خروج' },
  { value: 'CLIENT_LOGIN', label: 'ورود کلاینت' },
  { value: 'PERMISSION_TOKEN', label: 'دسترسی توکن' },
  { value: 'RESET_PASSWORD_ERROR', label: 'خطای بازنشانی رمز عبور' },
  { value: 'CODE_TO_TOKEN_ERROR', label: 'خطای توکن' },
];

export function SecurityEventsFilters({
  filters,
  onFiltersChange,
  onSearch,
  onReset,
  loading = false,
}: SecurityEventsFiltersProps) {
  const [localFilters, setLocalFilters] =
    useState<SecurityEventsFilters>(filters);
  const ipAddressRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleInputChange = (
    field: keyof SecurityEventsFilters,
    value: any
  ) => {
    const newFilters = {
      ...localFilters,
      [field]: value,
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      onSearch();
    }
  };

  const handleSearchClick = () => {
    onSearch();
  };

  const handleResetClick = () => {
    setLocalFilters({
      ipAddress: '',
      username: '',
      activityType: '',
      startDate: null,
      endDate: null,
    });
    onReset();
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      {/* <Typography
        variant="h5"
        textAlign="center"
        gutterBottom
        sx={{ fontWeight: 'bold' }}
      >
        نمایش و جستجو وقایع امنیتی سامانه
      </Typography> */}

      <Grid container spacing={6} alignItems="flex-start">
        {/* IP Address */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="آدرس IP"
            value={localFilters.ipAddress}
            onChange={e => handleInputChange('ipAddress', e.target.value)}
            onKeyPress={handleKeyPress}
            size="small"
            fullWidth
            disabled={loading}
            inputRef={ipAddressRef}
          />
        </Grid>

        {/* Username */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="نام کاربری"
            value={localFilters.username}
            onChange={e => handleInputChange('username', e.target.value)}
            onKeyPress={handleKeyPress}
            size="small"
            fullWidth
            disabled={loading}
            inputRef={usernameRef}
          />
        </Grid>

        {/* Activity Type */}
        <Grid item xs={12} sm={6} md={4}>
          <FormControl size="medium"      sx={{ minWidth: 150 }}>
            <InputLabel>نوع فعالیت</InputLabel>
            <Select
              value={localFilters.activityType}
              onChange={e => handleInputChange('activityType', e.target.value)}
              label="نوع فعالیت"
              disabled={loading}
            >
              {activityTypeOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Start Date */}
        <Grid item xs={12} sm={6} md={3}>
          <MatnaDatePicker
            label="تاریخ شروع"
            value={localFilters.startDate}
            onChange={value => handleInputChange('startDate', value)}
            placeholder="تاریخ شروع را انتخاب کنید"
            disabled={loading}
            clearable
          />
        </Grid>

        {/* End Date */}
        <Grid item xs={12} sm={6} md={3}>
          <MatnaDatePicker
            label="تاریخ پایان"
            value={localFilters.endDate}
            onChange={value => handleInputChange('endDate', value)}
            placeholder="تاریخ پایان را انتخاب کنید"
            disabled={loading}
            clearable
          />
        </Grid>
      </Grid>

      {/* Search and Clear Buttons - Placed below the filters */}
      <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'left' }}>
        <Button
          variant="contained"
          startIcon={<SearchIcon />}
          onClick={handleSearchClick}
          disabled={loading}
          sx={{ minWidth: 120 }}
        >
          جستجو
        </Button>
        <Button
          variant="outlined"
          color="error"
          startIcon={<ClearIcon />}
          onClick={handleResetClick}
          disabled={loading}
          sx={{ minWidth: 120 }}
        >
          پاک کردن
        </Button>
      </Box>
    </Paper>
  );
}
