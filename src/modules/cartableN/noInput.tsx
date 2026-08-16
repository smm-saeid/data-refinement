import { Box, TextField, Typography } from '@mui/material';

export default function NoInput({ title, width = '210px' }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        columnGap: '8px',
      }}
    >
      <Typography>{title}:</Typography>
      <TextField sx={{ width: width }} />
    </Box>
  );
}
