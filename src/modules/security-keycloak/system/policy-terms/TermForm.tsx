import { useState } from 'react';
import { Box, TextField, Button, MenuItem, Grid } from '@mui/material';

export interface TermFormData {
  title: string;
  content: string;
  version: string;
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
}

interface TermFormProps {
  onSubmit: (data: TermFormData) => void;
  isLoading?: boolean;
}

const statusOptions = [
  { value: 'PUBLISHED', label: 'فعال' },
  { value: 'DRAFT', label: 'غیرفعال' },
  { value: 'ARCHIVED', label: 'آرشیو' },
];

export function TermForm({ onSubmit, isLoading = false }: TermFormProps) {
  const [formData, setFormData] = useState<TermFormData>({
    title: '',
    content: '',
    version: '',
    status: 'DRAFT',
  });

  const handleChange =
    (field: keyof TermFormData) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData(prev => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(formData);
    // Reset form after submission
    setFormData({
      title: '',
      content: '',
      version: '',
      status: 'DRAFT',
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={2} alignItems="flex-end">
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="عنوان قوانین"
            value={formData.title}
            onChange={handleChange('title')}
            required
            size="small"
            placeholder="عنوان قوانین و مقررات"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="متن قوانین"
            value={formData.content}
            onChange={handleChange('content')}
            required
            size="small"
            placeholder="متن کامل قوانین و مقررات"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <TextField
            fullWidth
            label="نسخه قوانین"
            value={formData.version}
            onChange={handleChange('version')}
            required
            size="small"
            placeholder="نسخه قوانین"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <TextField
            fullWidth
            select
            label="وضعیت قوانین"
            value={formData.status}
            onChange={handleChange('status')}
            required
            size="small"
          >
            {statusOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? 'در حال ثبت...' : 'ثبت'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
