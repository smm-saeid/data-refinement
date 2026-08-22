import { Autocomplete, Box, TextField, Typography } from '@mui/material';

interface MonthProps {
  value: number | null;
  onChange: (value: number | null) => void;
}

const months = [
  { label: 'فروردین', value: 1 },
  { label: 'اردیبهشت', value: 2 },
  { label: 'خرداد', value: 3 },
  { label: 'تیر', value: 4 },
  { label: 'مرداد', value: 5 },
  { label: 'شهریور', value: 6 },
  { label: 'مهر', value: 7 },
  { label: 'آبان', value: 8 },
  { label: 'آذر', value: 9 },
  { label: 'دی', value: 10 },
  { label: 'بهمن', value: 11 },
  { label: 'اسفند', value: 12 },
];

export default function Month({ value, onChange }: MonthProps) {
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
        value={months.find(month => month.value === value) || null}
        onChange={(_, newValue) => {
          onChange(newValue?.value ?? null);
        }}
        getOptionLabel={option => option.label}
        isOptionEqualToValue={(option, selectedValue) =>
          option.value === selectedValue.value
        }
        sx={{ width: 150 }}
        renderInput={params => <TextField {...params} label="انتخاب کنید" />}
      />
    </Box>
  );
}
