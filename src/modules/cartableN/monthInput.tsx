import { Autocomplete, Box, TextField, Typography } from '@mui/material';

export default function Month() {
  const month = [
    'فروردین',
    'اردیبهشت',
    'خرداد',
    'تیر',
    'مرداد',
    'شهریور',
    'مهر',
    'آبان',
    'آذر',
    'دی',
    'بهمن',
    'اسفند',
  ];
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        columnGap: '8px',
      }}
    >
      <Typography>ماه:</Typography>
      <Autocomplete
        disablePortal
        options={month}
        sx={{ width: 150 }}
        renderInput={params => <TextField {...params} label="انتخاب کنید" />}
      />
    </Box>
  );
}
