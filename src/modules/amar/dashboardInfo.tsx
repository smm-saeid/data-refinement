import { Box, TextField, Typography } from '@mui/material';
import { Link } from 'react-router';

export default function DashboardInfo({ count, value, to }) {
  return (
    <Link to={to} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          columnGap: '20px',
          bgcolor: '#f8f6f6',
          padding: '3px',
          '&:hover': {
            bgcolor: '#dfdddd',
          },
        }}
      >
        <Typography>{value}</Typography>
        <TextField
          sx={{
            width: '50px',
            '& .MuiInputBase-input': {
              textAlign: 'center',
              cursor: 'pointer',
            },
          }}
          value={count}
          disabled
          id="filled-disabled"
        />
      </Box>
    </Link>
  );
}
