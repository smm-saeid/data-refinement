import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Button,
  Typography,
} from '@mui/material';
import type { SettingField } from '../../types';

interface SettingFieldProps {
  field: SettingField;
  value: any;
  onChange: (name: string, value: any) => void;
  onButtonClick?: () => void;
}

export function SettingField({
  field,
  value,
  onChange,
  onButtonClick,
}: SettingFieldProps) {
  const renderSelectField = () => (
    <FormControl fullWidth size="small">
      <InputLabel>{field.label}</InputLabel>
      <Select
        value={value || field.defaultValue}
        onChange={e => onChange(field.name, e.target.value)}
        label={field.label}
      >
        {field.options?.().map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.text}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const renderSwitchField = () => (
    <Box display="flex" alignItems="center" gap={2}>
      <FormControlLabel
        control={
          <Switch
            checked={value === 'true' || value === true}
            onChange={e => onChange(field.name, e.target.checked.toString())}
            color="primary"
          />
        }
        label={<Typography variant="body2">{field.label}</Typography>}
      />

      {field.name === 'prevent_common_password_policy' &&
        (value === 'true' || value === true) && (
          <Button variant="outlined" size="small" onClick={onButtonClick}>
            {field.btnText}
          </Button>
        )}
    </Box>
  );

  return (
    <Box>
      {field.type === 'select' && renderSelectField()}
      {field.type === 'switch' && renderSwitchField()}
    </Box>
  );
}
