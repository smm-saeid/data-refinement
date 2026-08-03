import {
  Box,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Paper,
} from '@mui/material';
import type { PermissionSet } from '../../types';

interface PermissionControlsProps {
  permissions: PermissionSet;
  onChange: (permissions: PermissionSet) => void;
}

const permissionLabels = {
  canRead: 'قابلیت مشاهده',
  canWrite: 'قابلیت افزودن',
  canUpdate: 'قابلیت ویرایش',
  canDelete: 'قابلیت حذف',
};

export function PermissionControls({
  permissions,
  onChange,
}: PermissionControlsProps) {
  const handlePermissionChange = (key: keyof PermissionSet, value: boolean) => {
    onChange({
      ...permissions,
      [key]: value,
    });
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        تنظیمات دسترسی
      </Typography>
      <FormGroup>
        <Box display="flex" gap={3} flexWrap="wrap">
          {(Object.keys(permissions) as Array<keyof PermissionSet>).map(key => (
            <FormControlLabel
              key={key}
              control={
                <Checkbox
                  checked={permissions[key]}
                  onChange={e => handlePermissionChange(key, e.target.checked)}
                  color="primary"
                />
              }
              label={permissionLabels[key]}
            />
          ))}
        </Box>
      </FormGroup>
    </Paper>
  );
}