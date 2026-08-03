import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

interface SessionFiltersProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  sessionType: string;
  onSessionTypeChange: (type: string) => void;
  onSearch: () => void;
  onRefresh: () => void;
  loading?: boolean;
}

const sessionTypeOptions = [
  { value: '', label: 'همه انواع' },
  { value: 'LOGIN', label: 'ورود' },
  { value: 'LOGOUT', label: 'خروج' },
  { value: 'REFRESH_TOKEN', label: 'تازه‌سازی توکن' },
  { value: 'CLIENT_LOGIN', label: 'ورود کلاینت' },
];

export function SessionFilters({
  searchTerm,
  onSearchTermChange,
  sessionType,
  onSessionTypeChange,
  onSearch,
  onRefresh,
  loading = false,
}: SessionFiltersProps) {
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
        نمایش نشست‌های فعال
      </Typography>

      <Box display="flex" gap={2} flexWrap="wrap" alignItems="flex-end">
        <TextField
          label="جستجوی نام کاربری"
          value={searchTerm}
          onChange={e => onSearchTermChange(e.target.value)}
          onKeyPress={handleKeyPress}
          size="small"
          sx={{ minWidth: 250 }}
          placeholder="جستجو بر اساس نام کاربری"
        />

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>نوع نشست</InputLabel>
          <Select
            value={sessionType}
            onChange={e => onSessionTypeChange(e.target.value)}
            label="نوع نشست"
          >
            {sessionTypeOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

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
            startIcon={<RefreshIcon />}
            onClick={onRefresh}
            disabled={loading}
          >
            بروزرسانی
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
