
import { TextField } from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';

interface PolicyNumberInputProps {
  name: string;
  label: string;
  required?: boolean;
  min?: number;
  max?: number;
  size?: 'small' | 'medium' | 'large'; // این خط را اضافه کنید
}

export function PolicyNumberInput({
  name,
  label,
  required = false,
  min,
  max,
  size = 'medium',
}: PolicyNumberInputProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          type="number"
          label={label}
          required={required}
          error={!!error}
          helperText={error?.message}
          size={size === 'large' ? 'medium' : size} // MUI فقط 'small' و 'medium' را پشتیبانی می‌کند
          inputProps={{
            min,
            max,
            style: {
              fontSize:
                size === 'large'
                  ? '1.1rem'
                  : size === 'medium'
                    ? '1rem'
                    : '0.9rem',
              padding:
                size === 'large'
                  ? '16px 14px'
                  : size === 'medium'
                    ? '12px 14px'
                    : '8px 12px',
              height: size === 'large' ? '24px' : 'auto',
            },
          }}
          InputLabelProps={{
            sx: {
              fontSize:
                size === 'large'
                  ? '1.1rem'
                  : size === 'medium'
                    ? '1rem'
                    : '0.9rem',
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: 'primary.main',
                borderWidth: 2,
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
                borderWidth: 2,
              },
            },
            '& .MuiInputBase-input': {
              fontSize:
                size === 'large'
                  ? '1.1rem'
                  : size === 'medium'
                    ? '1rem'
                    : '0.9rem',
            },
          }}
          onChange={e => {
            const value = e.target.value === '' ? '' : Number(e.target.value);
            field.onChange(value);
          }}
          value={field.value ?? ''}
        />
      )}
    />
  );
}
