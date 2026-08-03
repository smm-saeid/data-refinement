
import { TextField } from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';

interface PolicyTextInputProps {
  name: string;
  label: string;
  placeholder?: string;
  size?: 'small' | 'medium' | 'large'; 
}

export function PolicyTextInput({
  name,
  label,
  placeholder,
  size = 'medium',
}: PolicyTextInputProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          label={label}
          placeholder={placeholder}
          error={!!error}
          helperText={error?.message}
          size={size === 'large' ? 'medium' : size} // MUI فقط 'small' و 'medium' را پشتیبانی می‌کند
          inputProps={{
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
        />
      )}
    />
  );
}
