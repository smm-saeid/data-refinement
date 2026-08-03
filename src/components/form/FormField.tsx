import {
  Autocomplete,
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  IconButton,
  InputAdornment,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import type { ControllerRenderProps, FieldErrors } from 'react-hook-form';
import type { TOption } from './types.ts';
import { useState } from 'react';
import MatnaDatePicker from '@/components/date-picker/MatnaDatePicker.tsx';
import { Visibility, VisibilityOff } from '@mui/icons-material';

// ==================== Text Field ====================
interface TextFieldProps {
  name: string;
  label: string;
  controllerField: ControllerRenderProps<any, any>;
  errors?: FieldErrors;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  fontSize?: number;
}

interface TextFieldProps {
  name: string;
  label: string;
  controllerField: ControllerRenderProps<any, any>;
  errors?: FieldErrors;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  fontSize?: number;
}

export function TextFormField({
  name,
  label,
  controllerField,
  errors,
  placeholder,
  disabled = false,
  required = false,
  multiline = false,
  rows = 1,
  fontSize = 16,
}: TextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <FormControl fullWidth size="small" error={Boolean(errors?.[name])}>
      <FormLabel
        htmlFor={`text-${name}`}
        required={required}
        sx={{
          mb: 1,
          fontSize: '0.875rem',
          fontWeight: 500,
          color: errors?.[name]
            ? 'error.main'
            : isFocused
              ? 'primary.main'
              : 'text.primary',
          transition: 'color 0.2s ease',
        }}
      >
        {label}
      </FormLabel>
      <TextField
        id={`text-${name}`}
        {...controllerField}
        placeholder={placeholder}
        error={Boolean(errors?.[name])}
        helperText={errors?.[name]?.message as string}
        disabled={disabled}
        multiline={multiline}
        rows={multiline ? rows : undefined}
        fullWidth
        size="small"
        inputProps={{ style: { fontSize } }}
        // حذف label از TextField چون الان بالا داریم
        InputLabelProps={{ shrink: false }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset legend': {
              display: 'none', // حذف فضای label در border
            },
          },
        }}
      />
    </FormControl>
  );
}

// ==================== Password Field ====================
interface PasswordFieldProps {
  name: string;
  label: string;
  controllerField: ControllerRenderProps<any, any>;
  errors?: FieldErrors;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  fontSize?: number;
}

export function PasswordFormField({
  name,
  label,
  controllerField,
  errors,
  placeholder,
  disabled = false,
  required = false,
  fontSize = 16,
}: PasswordFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(prev => !prev);
  };

  // @ts-ignore
  return (
    <FormControl fullWidth size="small" error={Boolean(errors?.[name])}>
      <FormLabel
        htmlFor={`password-${name}`}
        required={required}
        sx={{
          mb: 1,
          fontSize: '0.875rem',
          fontWeight: 500,
          color: errors?.[name]
            ? 'error.main'
            : isFocused
              ? 'primary.main'
              : 'text.primary',
          transition: 'color 0.2s ease',
        }}
      >
        {label}
      </FormLabel>
      <TextField
        id={`password-${name}`}
        {...controllerField}
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder}
        error={Boolean(errors?.[name])}
        helperText={errors?.[name]?.message as string}
        disabled={disabled}
        fullWidth
        size="small"
        inputProps={{ style: { fontSize } }}
        InputLabelProps={{ shrink: false }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handleTogglePassword}
                onMouseDown={e => e.preventDefault()}
                edge="end"
                size="small"
                disabled={disabled}
                tabIndex={-1}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset legend': {
              display: 'none',
            },
          },
        }}
      />
    </FormControl>
  );
}

// ==================== Date Field ====================
interface DateFieldProps {
  name: string;
  label: string;
  value: any;
  errors?: FieldErrors;
  onChange: (value: any) => void;
  error?: string;
  format?: string;
  disabled?: boolean;
  minDate?: string;
  maxDate?: string;
  required?: boolean;
}

// @ts-ignore
export function DateFormField({
  name,
  label,
  value,
  onChange,
  errors,
  format = 'YYYY/MM/DD',
  disabled = false,
  minDate,
  maxDate,
  required = false,
}: DateFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <FormControl fullWidth size="small" error={Boolean(errors?.[name])}>
      <FormLabel
        htmlFor={`date-picker-${name}`}
        required={required}
        sx={{
          mb: 1,
          fontSize: '0.875rem',
          fontWeight: 500,
          color: errors?.[name]
            ? 'error.main'
            : isFocused
              ? 'primary.main'
              : 'text.primary',
          transition: 'color 0.2s ease',
        }}
      >
        {label}
      </FormLabel>
      <MatnaDatePicker
        id={`date-picker-${name}`}
        value={value}
        error={errors?.[name]?.message as string}
        onChange={onChange}
        format={format}
        disabled={disabled}
        minDate={minDate}
        maxDate={maxDate}
        clearable={true}
        onOpen={() => setIsFocused(true)}
        onClose={() => setIsFocused(false)}
      />
    </FormControl>
  );
}

// ==================== Select Field ====================
interface SelectFieldProps {
  name: string;
  label: string;
  controllerField: ControllerRenderProps<any, any>;
  errors?: FieldErrors;
  options: TOption[];
  disabled?: boolean;
  required?: boolean;
  loading?: boolean;
}

export function SelectFormField({
  name,
  label,
  controllerField,
  errors,
  options,
  disabled = false,
  required = false,
  loading = false,
}: SelectFieldProps) {
  if (loading) {
    return <LoadingField label={label} />;
  }

  return (
    <FormControl
      fullWidth
      size="small"
      error={Boolean(errors?.[name])}
      required={required}
    >
      <FormLabel
        id={`select-${name}`}
        required={required}
        sx={{
          mb: 1,
          color: errors?.[name] ? 'error.main' : 'text.primary',
          fontSize: '0.875rem',
          fontWeight: 500,
          '&.Mui-focused': {
            color: errors?.[name] ? 'error.main' : 'primary.main',
          },
        }}
      >
        {label}
      </FormLabel>
      <Select
        {...controllerField}
        labelId={`select-${name}`}
        // label={label}
        disabled={disabled}
      >
        {options.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {errors?.[name] && (
        <FormHelperText>{errors[name]?.message as string}</FormHelperText>
      )}
    </FormControl>
  );
}

// ==================== Autocomplete Field ====================
interface AutocompleteFieldProps {
  name: string;
  label: string;
  controllerField: ControllerRenderProps<any, any>;
  errors?: FieldErrors;
  options: TOption[];
  disabled?: boolean;
  required?: boolean;
  loading?: boolean;
  multiple?: boolean;
}

export function AutocompleteFormField({
  name,
  label,
  controllerField,
  errors,
  options,
  disabled = false,
  required = false,
  loading = false,
  multiple = false,
}: AutocompleteFieldProps) {
  if (loading) {
    return <LoadingField label={label} />;
  }

  return (
    <FormControl
      fullWidth
      size="small"
      error={Boolean(errors?.[name])}
      required={required}
    >
      <FormLabel
        id={`select-${name}`}
        required={required}
        sx={{
          mb: 1,
          color: errors?.[name] ? 'error.main' : 'text.primary',
          fontSize: '0.875rem',
          fontWeight: 500,
          '&.Mui-focused': {
            color: errors?.[name] ? 'error.main' : 'primary.main',
          },
        }}
      >
        {label}
      </FormLabel>
      <Autocomplete
        {...controllerField}
        options={options}
        multiple={multiple}
        disabled={disabled}
        getOptionLabel={(option: TOption | any) => {
          // اگر option یک string یا number است (مقدار ذخیره شده)
          if (typeof option !== 'object') {
            const foundOption = options.find(op => op.value === option);
            return foundOption?.label || '';
          }
          // اگر option یک object است
          return option?.label || '';
        }}
        isOptionEqualToValue={(option, value) => {
          if (typeof value !== 'object') {
            return option.value === value;
          }
          return option.value === value?.value;
        }}
        onChange={(_, newValue) => {
          let tempValue = null;
          if(Array.isArray(newValue)) {
            tempValue = newValue.map((item: TOption) => {
              if(typeof item === 'object') {
                return item.value
              }
              return item;
            })
          } else {
            if(typeof newValue === 'object') {
              tempValue = newValue?.value;
            } else {
              tempValue = newValue;
            }
          }
          controllerField.onChange(tempValue);
        }}
        value={controllerField.value}
        renderInput={params => (
          <TextField
            {...params}
            error={Boolean(errors?.[name])}
            helperText={errors?.[name]?.message as string}
            required={required}
            size="small"
          />
        )}
      />
    </FormControl>
  );
}

// ==================== Checkbox Field ====================
interface CheckboxFieldProps {
  name: string;
  label: string;
  controllerField: ControllerRenderProps<any, any>;
  errors?: FieldErrors;
  disabled?: boolean;
}

export function CheckboxFormField({
  name,
  label,
  controllerField,
  errors,
  disabled = false,
}: CheckboxFieldProps) {
  return (
    <Box>
      <FormControlLabel
        control={
          <Checkbox
            {...controllerField}
            checked={Boolean(controllerField.value)}
            disabled={disabled}
            size="small"
          />
        }
        label={label}
      />
      {errors?.[name] && (
        <FormHelperText error>{errors[name]?.message as string}</FormHelperText>
      )}
    </Box>
  );
}

// ==================== Title Divider ====================
interface TitleDividerProps {
  label: string;
}

export function TitleDivider({ label }: TitleDividerProps) {
  return (
    <Box width="100%" sx={{ mt: 2, mb: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
        {label}
      </Typography>
      <Box sx={{ height: 2, bgcolor: 'primary.main', mt: 0.5, mb: 1 }} />
    </Box>
  );
}

// ==================== Loading State ====================
function LoadingField({ label }: { label: string }) {
  return (
    <Box sx={{ minHeight: '40px' }}>
      <Typography variant="caption" sx={{ mb: 1 }}>
        {label}
      </Typography>
      <LinearProgress />
    </Box>
  );
}
