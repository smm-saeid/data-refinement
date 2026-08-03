import {
  Grid,
  TextField,
  Button,
  InputAdornment,
  Box,
  useTheme,
} from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import MatnaDatePicker from '@/components/date-picker/MatnaDatePicker';
import type { SearchFields } from './types';

interface LogSearchFormProps {
  searchFields: SearchFields;
  onInputChange: (field: keyof SearchFields, value: string) => void;
  onDateChange: (field: 'startTime' | 'endTime', value: string | null) => void;
  onSearch: () => void;
  onClear: () => void;
  onKeyPress: (event: React.KeyboardEvent) => void;
  loading?: boolean;
}

const LogSearchForm = ({
  searchFields,
  onInputChange,
  onDateChange,
  onSearch,
  onClear,
  onKeyPress,
  loading = false,
}: LogSearchFormProps) => {
  const theme = useTheme();

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="آی پی"
            placeholder="جستجو بر اساس IP"
            value={searchFields.clientIp}
            onChange={e => onInputChange('clientIp', e.target.value)}
            onKeyDown={onKeyPress}
            size="small"
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="نام کاربری"
            placeholder="جستجو بر اساس نام کاربری"
            value={searchFields.username}
            onChange={e => onInputChange('username', e.target.value)}
            onKeyDown={onKeyPress}
            size="small"
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="نام سرویس"
            placeholder="جستجو بر اساس نام سرویس"
            value={searchFields.serviceName}
            onChange={e => onInputChange('serviceName', e.target.value)}
            onKeyDown={onKeyPress}
            size="small"
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="وضعیت"
            placeholder="جستجو بر اساس وضعیت"
            value={searchFields.status}
            onChange={e => onInputChange('status', e.target.value)}
            onKeyDown={onKeyPress}
            size="small"
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Date Pickers */}
        <Grid item xs={12} sm={6} md={3}>
          <MatnaDatePicker
            label="زمان شروع"
            value={searchFields.startTime}
            onChange={value => onDateChange('startTime', value)}
            placeholder="انتخاب زمان شروع"
            clearable
            disabled={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MatnaDatePicker
            label="زمان پایان"
            value={searchFields.endTime}
            onChange={value => onDateChange('endTime', value)}
            placeholder="انتخاب زمان پایان"
            clearable
            disabled={loading}
          />
        </Grid>

        {/* Action Buttons */}
        <Grid item xs={12} sm={6} md={3}>
          <Button
            fullWidth
            variant="contained"
            onClick={onSearch}
            startIcon={<Search />}
            disabled={loading}
            sx={{ height: '40px' }}
          >
            {loading ? 'در حال جستجو...' : 'جستجو'}
          </Button>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Button
            fullWidth
            variant="outlined"
            onClick={onClear}
            startIcon={<Clear />}
            disabled={loading}
            sx={{ height: '40px' }}
          >
            پاک کردن فیلترها
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LogSearchForm;
