import React from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

interface NewsSearchProps {
  searchNewsletterNo: number | '';
  onSearchNewsletterNoChange: (value: number | '') => void;
  onSearch: () => void;
  onClearSearch: () => void;
  resultCount: number;
}

const NewsSearch = ({
  searchNewsletterNo,
  onSearchNewsletterNoChange,
  onSearch,
  onClearSearch,
  resultCount,
}: NewsSearchProps) => {
  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
      <Box
        sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}
      >
        <TextField
          type="number"
          label="جستجو بر اساس شماره خبرنامه"
          value={searchNewsletterNo}
          onChange={e =>
            onSearchNewsletterNoChange(
              e.target.value ? Number(e.target.value) : ''
            )
          }
          sx={{ minWidth: 200 }}
          placeholder="شماره خبرنامه را وارد کنید"
        />
        <Button
          variant="contained"
          startIcon={<SearchIcon />}
          onClick={onSearch}
          sx={{ px: 3 }}
        >
          جستجو
        </Button>
        <Button variant="outlined" onClick={onClearSearch} sx={{ px: 3 }}>
          نمایش همه
        </Button>
        <Typography variant="body2" color="textSecondary">
          {resultCount} مورد یافت شد
        </Typography>
      </Box>
    </Paper>
  );
};

export default NewsSearch;
