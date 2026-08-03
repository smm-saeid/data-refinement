import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  InputAdornment,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useNotification } from '../../NotificationContext';

interface LockedUsersFiltersProps {
  searchUsername: string;
  onSearchUsernameChange: (username: string) => void;
  onSearch: () => void;
  loading?: boolean;
}

export function LockedUsersFilters({
  searchUsername,
  onSearchUsernameChange,
  onSearch,
  loading = false,
}: LockedUsersFiltersProps) {
  const { showNotification } = useNotification();

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      onSearch();
    }
  };

  const handleSearch = () => {
    onSearch();
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography
        variant="h5"
        textAlign="center"
        gutterBottom
        sx={{ fontWeight: 'bold' }}
      >
        جستجوی کاربران قفل شده بر اساس نام کاربری
      </Typography>

      <Box display="flex" gap={2} justifyContent="center" alignItems="flex-end">
        <TextField
          label="جستجوی کاربران"
          value={searchUsername}
          onChange={e => onSearchUsernameChange(e.target.value)}
          onKeyPress={handleKeyPress}
          size="medium"
          sx={{ minWidth: 300 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={loading}
          sx={{ minHeight: '56px' }}
        >
          {loading ? 'در حال جستجو...' : 'جستجو'}
        </Button>
      </Box>
    </Paper>
  );
}
