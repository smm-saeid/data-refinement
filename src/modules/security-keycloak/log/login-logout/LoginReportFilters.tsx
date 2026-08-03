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
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterMomentJalaali } from '@mui-x-date-pickers/AdapterMomentJalaali';
import moment from 'moment-jalaali';
import type { LoginReportFilters } from '../../types';

interface LoginReportFiltersProps {
  filters: LoginReportFilters;
  onFiltersChange: (filters: LoginReportFilters) => void;
  onSearch: () => void;
  onReset: () => void;
  loading?: boolean;
}

const activityTypeOptions = [
  { value: '', label: 'تمام فعالیت ها' },
  { value: 'LOGIN', label: 'ورود' },
  { value: 'LOGOUT', label: 'خروج' },
  { value: 'LOGIN_ERROR', label: 'خطای ورود' },
  { value: 'LOGOUT_ERROR', label: 'خطای خروج' },
];

export function LoginReportFilters({
  filters,
  onFiltersChange,
  onSearch,
  onReset,
  loading = false,
}: LoginReportFiltersProps) {
  const handleInputChange = (field: keyof LoginReportFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [field]: value,
    });
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography
        variant="h5"
        textAlign="center"
        gutterBottom
        sx={{ fontWeight: 'bold' }}
      >
        گزارش ورود و خروج کاربران از سامانه
      </Typography>

      {/* <LocalizationProvider dateAdapter={AdapterMomentJalaali}> */}
      <Box display="flex" gap={2} flexWrap="wrap" alignItems="flex-start">
        {/* IP Address */}
        <TextField
          label="آدرس IP"
          value={filters.ipAddress}
          onChange={e => handleInputChange('ipAddress', e.target.value)}
          onKeyPress={handleKeyPress}
          size="small"
          sx={{ minWidth: 180 }}
        />

        {/* Username */}
        <TextField
          label="نام کاربری"
          value={filters.username}
          onChange={e => handleInputChange('username', e.target.value)}
          onKeyPress={handleKeyPress}
          size="small"
          sx={{ minWidth: 180 }}
        />

        {/* Activity Type */}
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>نوع فعالیت</InputLabel>
          <Select
            value={filters.activityType}
            onChange={e => handleInputChange('activityType', e.target.value)}
            label="نوع فعالیت"
          >
            {activityTypeOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Start Date */}
        {/* <DatePicker
            label="بازه شروع"
            value={filters.startDate ? moment(filters.startDate) : null}
            onChange={date => handleInputChange('startDate', date)}
            slotProps={{
              textField: {
                size: 'small',
                sx: { minWidth: 180 },
                onKeyPress: handleKeyPress,
              },
            }}
          /> */}

        {/* End Date */}
        {/* <DatePicker
            label="بازه پایان"
            value={filters.endDate ? moment(filters.endDate) : null}
            onChange={date => handleInputChange('endDate', date)}
            slotProps={{
              textField: {
                size: 'small',
                sx: { minWidth: 180 },
                onKeyPress: handleKeyPress,
              },
            }}
          /> */}

        {/* Action Buttons */}
        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={onSearch}
            disabled={loading}
          >
            جستجو
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<ClearIcon />}
            onClick={onReset}
            disabled={loading}
          >
            پاک کردن
          </Button>
        </Box>
      </Box>
      {/* </LocalizationProvider> */}
    </Paper>
  );
}
