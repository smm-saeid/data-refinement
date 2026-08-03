import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
} from '@mui/material';
import { useState, useEffect } from 'react';
import type { Term, UpdateTermRequest } from '../../types';

interface TermEditModalProps {
  open: boolean;
  term: Term | null;
  onClose: () => void;
  onUpdate: (data: UpdateTermRequest) => void;
  isLoading?: boolean;
}

const statusOptions = [
  { value: 'PUBLISHED', label: 'فعال' },
  { value: 'DRAFT', label: 'غیرفعال' },
  { value: 'ARCHIVED', label: 'آرشیو' },
];

export function TermEditModal({
  open,
  term,
  onClose,
  onUpdate,
  isLoading = false,
}: TermEditModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    version: '',
    status: 'DRAFT' as const,
  });

  useEffect(() => {
    if (term) {
      setFormData({
        title: term.title,
        content: term.content,
        version: term.version,
        status: term.status,
      });
    }
  }, [term]);

  const handleChange =
    (field: keyof typeof formData) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData(prev => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = () => {
    if (term) {
      onUpdate({
        id: term.id,
        ...formData,
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>ویرایش اطلاعات</DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="عنوان"
            value={formData.title}
            onChange={handleChange('title')}
            required
            fullWidth
            size="small"
          />

          <TextField
            label="محتوا"
            value={formData.content}
            onChange={handleChange('content')}
            required
            fullWidth
            size="small"
            multiline
            rows={3}
          />

          <TextField
            label="نسخه"
            value={formData.version}
            onChange={handleChange('version')}
            required
            fullWidth
            size="small"
          />

          <TextField
            select
            label="وضعیت"
            value={formData.status}
            onChange={handleChange('status')}
            required
            fullWidth
            size="small"
          >
            {statusOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          انصراف
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={isLoading}>
          {isLoading ? 'در حال ویرایش...' : 'ویرایش'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
