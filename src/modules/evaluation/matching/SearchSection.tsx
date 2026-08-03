import React from 'react';
import {
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Search, Refresh } from '@mui/icons-material';
import type { PaginationQueryParam } from '@/types/api';

type PersonnelQueryParams = {
  personnelNumber?: string;
};

interface SearchSectionProps {
  hrToken: string;
  personnelNumber: string;
  setPersonnelNumber: (value: string) => void;
  filters: PaginationQueryParam<PersonnelQueryParams>;
  setFilters: (filters: PaginationQueryParam<PersonnelQueryParams>) => void;
  isLoading: boolean;
  searchError: string;
  onSearch: () => void;
  onReset: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

const SearchSection: React.FC<SearchSectionProps> = ({
                                                       hrToken,
                                                       personnelNumber,
                                                       setPersonnelNumber,
                                                       isLoading,
                                                       searchError,
                                                       onSearch,
                                                       onReset,
                                                       onKeyPress,
                                                     }) => {
  return (
    <Paper
      sx={{
        p: 3,
        mb: 3,
        backgroundColor: '#f8fdff',
        border: '1px solid #e3f2fd',
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 3,
          color: '#1565c0',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Search fontSize="small" />
        جستجو با شماره پرسنلی
      </Typography>

      {/* بخش جستجو */}
      <Box sx={{ mb: 2 }}>
        <Box display="flex" gap={2} alignItems="flex-start" flexWrap="wrap">
          <TextField
            label="شماره پرسنلی"
            value={personnelNumber}
            onChange={e => setPersonnelNumber(e.target.value)}
            onKeyPress={onKeyPress}
            size="small"
            sx={{ width: 280 }}
            placeholder="مثال: 09800"
            disabled={!hrToken || isLoading}
            error={!!searchError}
            helperText={searchError ? '' : 'شماره پرسنلی را وارد کنید'}
          />

          <Button
            variant="contained"
            onClick={onSearch}
            disabled={!hrToken || isLoading || !personnelNumber}
            startIcon={isLoading ? <CircularProgress size={16} /> : <Search />}
            sx={{ px: 3 }}
          >
            {isLoading ? 'در حال جستجو...' : 'جستجو'}
          </Button>

          <Button
            variant="outlined"
            onClick={onReset}
            disabled={isLoading || !hrToken}
            startIcon={<Refresh />}
          >
            بازنشانی
          </Button>
        </Box>
      </Box>

      {/* اطلاعات وضعیت */}
      <Box>
        {searchError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {searchError}
          </Alert>
        )}

        {!hrToken && (
          <Alert severity="info" sx={{ mt: 2 }}>
            در حال دریافت مجوزهای دسترسی... لطفاً چند لحظه صبر کنید.
          </Alert>
        )}

        {hrToken && !searchError && (
          <Alert severity="success" sx={{ mt: 2 }}>
            سیستم آماده جستجو است
          </Alert>
        )}
      </Box>
    </Paper>
  );
};

export default SearchSection;