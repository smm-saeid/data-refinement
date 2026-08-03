import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
} from '@mui/material';
import {
  Search as SearchIcon,
} from '@mui/icons-material';
import { type CartableFilter } from '../types.tsx';

interface WorkflowFiltersProps {
  onFilterChange: (filters: CartableFilter) => void;
}

export default function CartableFilters({
  onFilterChange,
}: WorkflowFiltersProps) {
  const [filters, setFilters] = useState<CartableFilter>({});

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...filters, search: event.target.value };
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  const hasActiveFilters = Object.keys(filters).some(
    key => filters[key as keyof CartableFilter]
  );

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            placeholder="جستجو در کارها..."
            value={filters.search || ''}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              ),
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={() => onFilterChange(filters)}
            >
              جستجو
            </Button>
            {hasActiveFilters && (
              <Button
                variant="outlined"
                color="error"
                onClick={handleClearFilters}
              >
                پاک کردن
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
