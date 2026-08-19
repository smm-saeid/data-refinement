import { Box, TextField, Typography } from '@mui/material';

interface NoInputProps {
  title: string;
  width?: string;
  value: string;
  onChange: (value: string) => void;
}

export default function NoInput({
  title,
  width = '210px',
  value,
  onChange,
}: NoInputProps) {
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

      <TextField
        value={value}
        onChange={e => onChange(e.target.value)}
        sx={{ width }}
      />
    </Box>
  );
}
