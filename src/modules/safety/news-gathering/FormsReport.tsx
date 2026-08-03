import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Alert,
  Divider,
  CircularProgress,
  Chip,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import researchApis from '../apis';

interface FormData {
  id: string;
  unit: string;
  title: string;
  description: string;
}

interface DynamicFormsProps {
  messages: any[];
  onFormsUpdate: (forms: FormData[]) => void;
}

const FormsReport = ({ messages, onFormsUpdate }: DynamicFormsProps) => {
  const [forms, setForms] = useState<FormData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch('/api/' + researchApis.forms.list, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'getForms' }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.forms && data.forms.length > 0) {
          setForms(data.forms);
          onFormsUpdate(data.forms);
        } else {
          const initialForm = [
            {
              id: Date.now().toString(),
              unit: '',
              title: '',
              description: '',
            },
          ];
          setForms(initialForm);
          onFormsUpdate(initialForm);
        }
      } else {
        throw new Error('Failed to fetch forms');
      }
    } catch (err) {
      console.error('Error fetching forms:', err);
      setError('خطا در بارگذاری فرم‌ها');
      const initialForm = [
        {
          id: Date.now().toString(),
          unit: '',
          title: '',
          description: '',
        },
      ];
      setForms(initialForm);
      onFormsUpdate(initialForm);
    } finally {
      setLoading(false);
    }
  };

  const saveFormToDatabase = async (formData: FormData): Promise<boolean> => {
    try {
      const response = await fetch('/api/' + researchApis.forms.save, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'saveForm',
          formData: {
            unit: formData.unit,
            title: formData.title,
            description: formData.description,
          },
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.form && result.form.id) {
          setForms(prev =>
            prev.map(form =>
              form.id === formData.id ? { ...form, id: result.form.id } : form
            )
          );
        }
        return true;
      } else {
        throw new Error('Failed to save form');
      }
    } catch (err) {
      console.error('Error saving form:', err);
      return false;
    }
  };

  const addForm = async (): Promise<void> => {
    const newForm: FormData = {
      id: Date.now().toString(),
      unit: '',
      title: '',
      description: '',
    };

    const updatedForms = [newForm, ...forms];
    setForms(updatedForms);
    onFormsUpdate(updatedForms);

    setSaving(true);
    const saved = await saveFormToDatabase(newForm);
    setSaving(false);

    if (saved) {
      setSuccess('فرم جدید با موفقیت ذخیره شد');
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError('خطا در ذخیره‌سازی فرم جدید');
      setTimeout(() => setError(''), 3000);
    }
  };

  const updateForm = async (
    id: string,
    field: keyof FormData,
    value: string
  ): Promise<void> => {
    const updatedForms = forms.map(form =>
      form.id === id ? { ...form, [field]: value } : form
    );
    setForms(updatedForms);
    onFormsUpdate(updatedForms);

    const formToUpdate = updatedForms.find(form => form.id === id);
    if (
      formToUpdate &&
      formToUpdate.unit.trim() &&
      formToUpdate.title.trim() &&
      formToUpdate.description.trim()
    ) {
      const isTemporaryId = !isNaN(Number(id)) && id.length === 13;

      if (!isTemporaryId) {
        setTimeout(async () => {
          try {
            const apiUrl = researchApis.forms.update.replace('{id}', id);
            await fetch('/api/' + apiUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                action: 'updateForm',
                formData: {
                  unit: formToUpdate.unit,
                  title: formToUpdate.title,
                  description: formToUpdate.description,
                },
              }),
            });
          } catch (err) {
            console.error('Error updating form:', err);
          }
        }, 1000);
      }
    }
  };

  const removeForm = async (id: string): Promise<void> => {
    if (forms.length > 1) {
      const isTemporaryId = !isNaN(Number(id)) && id.length === 13;

      if (isTemporaryId) {
        const updatedForms = forms.filter(form => form.id !== id);
        setForms(updatedForms);
        onFormsUpdate(updatedForms);
      } else {
        try {
          const apiUrl = researchApis.forms.delete.replace('{id}', id);
          const response = await fetch('/api/' + apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: 'deleteForm' }),
          });

          if (response.ok) {
            const updatedForms = forms.filter(form => form.id !== id);
            setForms(updatedForms);
            onFormsUpdate(updatedForms);
            setSuccess('فرم با موفقیت حذف شد');
            setTimeout(() => setSuccess(''), 3000);
          } else {
            throw new Error('Failed to delete form');
          }
        } catch (err) {
          console.error('Error deleting form:', err);
          setError('خطا در حذف فرم');
          setTimeout(() => setError(''), 3000);
        }
      }
    } else {
      setError('حداقل یک فرم باید وجود داشته باشد');
      setTimeout(() => setError(''), 3000);
    }
  };

  const getFormValidation = (form: FormData): string[] => {
    const errors = [];
    if (!form.unit.trim()) errors.push('یگان');
    if (!form.title.trim()) errors.push('عنوان');
    if (!form.description.trim()) errors.push('توضیحات');
    return errors;
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={200}
      >
        <CircularProgress />
        <Typography variant="body2" sx={{ mr: 2 }}>
          در حال بارگذاری فرم‌ها...
        </Typography>
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6" fontWeight="bold">
          فرم‌های گزارش‌دهی
        </Typography>
        <Button variant="outlined" onClick={fetchForms} size="small">
          بروزرسانی لیست
        </Button>
        <Button
          variant="contained"
          startIcon={
            saving ? <CircularProgress size={16} color="inherit" /> : <Add />
          }
          onClick={addForm}
          size="small"
          disabled={saving}
        >
          {saving ? 'در حال ذخیره...' : 'افزودن فرم جدید'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {forms.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            هیچ فرمی وجود ندارد
          </Typography>
          <Button
            variant="outlined"
            onClick={addForm}
            disabled={saving}
            startIcon={
              saving ? <CircularProgress size={16} color="inherit" /> : <Add />
            }
          >
            {saving ? 'در حال ایجاد...' : 'ایجاد اولین فرم'}
          </Button>
        </Box>
      ) : (
        forms.map((form, index) => {
          const validationErrors = getFormValidation(form);
          const formNumber = forms.length - index;
          const isFormValid = validationErrors.length === 0;

          return (
            <Box key={form.id} sx={{ mb: 3 }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography
                    variant="subtitle1"
                    color="primary"
                    fontWeight="bold"
                  >
                    فرم گزارش شماره {formNumber}
                  </Typography>
                  {index === 0 && (
                    <Chip
                      label="جدیدترین"
                      color="primary"
                      size="small"
                      variant="outlined"
                    />
                  )}
                  {isFormValid && (
                    <Chip label="تکمیل شده" color="success" size="small" />
                  )}
                </Box>
                <IconButton
                  onClick={() => removeForm(form.id)}
                  color="error"
                  size="small"
                  disabled={forms.length === 1}
                >
                  <Delete />
                </IconButton>
              </Box>

              <Box
                display="flex"
                gap={2}
                sx={{ mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}
              >
                <TextField
                  fullWidth
                  label="یگان *"
                  value={form.unit}
                  onChange={e => updateForm(form.id, 'unit', e.target.value)}
                  placeholder="نام یگان مربوطه را وارد کنید"
                  error={!form.unit.trim()}
                  helperText={!form.unit.trim() ? 'این فیلد اجباری است' : ''}
                  size="small"
                />
                <TextField
                  fullWidth
                  label="عنوان *"
                  value={form.title}
                  onChange={e => updateForm(form.id, 'title', e.target.value)}
                  placeholder="عنوان گزارش را وارد کنید"
                  error={!form.title.trim()}
                  helperText={!form.title.trim() ? 'این فیلد اجباری است' : ''}
                  size="small"
                />
              </Box>

              <TextField
                fullWidth
                multiline
                rows={3}
                label="توضیحات *"
                value={form.description}
                onChange={e =>
                  updateForm(form.id, 'description', e.target.value)
                }
                placeholder="توضیحات کامل گزارش را وارد کنید"
                error={!form.description.trim()}
                helperText={
                  !form.description.trim() ? 'این فیلد اجباری است' : ''
                }
                size="small"
                sx={{ mb: 2 }}
              />

              {index < forms.length - 1 && <Divider sx={{ mt: 2 }} />}
            </Box>
          );
        })
      )}

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={3}
        pt={2}
        sx={{ borderTop: 1, borderColor: 'divider' }}
      >
        <Typography variant="body2" color="text.secondary">
          تعداد فرم‌ها: {forms.length}
        </Typography>
      </Box>
    </Paper>
  );
};

export default FormsReport;
