import { Autocomplete, Box, TextField, Typography } from '@mui/material';

interface MonthProps {
  value: string;
  onChange: (value: string) => void;
}

export default function Month({ value, onChange }: MonthProps) {
  const months = [
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
        options={months}
        value={value || null}
        onChange={(_, newValue) => {
          onChange(newValue ?? '');
        }}
        sx={{ width: 150 }}
        renderInput={params => <TextField {...params} label="انتخاب کنید" />}
      />
    </Box>
  );
}
