import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import { Edit, Delete, Send } from '@mui/icons-material';
import researchApis from '../apis';

interface FormData {
  id: string;
  unit: string;
  title: string;
  description: string;
}

interface FinalSubmissionProps {
  forms: FormData[];
  onFormsUpdate: (forms: FormData[]) => void;
}

interface FormStatus {
  status: 'invalid' | 'saved' | 'draft';
  text: string;
  color: 'warning' | 'success' | 'info';
}

const FinalSubmission = ({ forms, onFormsUpdate }: FinalSubmissionProps) => {
  const [editingForm, setEditingForm] = useState<FormData | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [editedData, setEditedData] = useState<FormData | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');
  const [error, setError] = useState<string>('');

  const handleEdit = (form: FormData): void => {
    setEditingForm(form);
    setEditedData({ ...form });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async (): Promise<void> => {
    if (!editedData) return;

    try {
      const isPersistedForm =
        isNaN(Number(editedData.id)) || editedData.id.length !== 13;

      if (isPersistedForm) {
        const apiUrl = researchApis.forms.update.replace('{id}', editedData.id);
        const response = await fetch('/api/' + apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'updateForm',
            formData: {
              unit: editedData.unit,
              title: editedData.title,
              description: editedData.description,
            },
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update form in database');
        }
      }

      const updatedForms = forms.map(form =>
        form.id === editedData.id ? editedData : form
      );

      onFormsUpdate(updatedForms);
      setEditDialogOpen(false);
      setEditingForm(null);
      setEditedData(null);
    } catch (err) {
      console.error('Error updating form:', err);
      setError('خطا در بروزرسانی فرم در دیتابیس');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (forms.length > 1) {
      try {
        const isPersistedForm = isNaN(Number(id)) || id.length !== 13;

        if (isPersistedForm) {
          const apiUrl = researchApis.forms.delete.replace('{id}', id);
          const response = await fetch('/api/' + apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: 'deleteForm' }),
          });

          if (!response.ok) {
            throw new Error('Failed to delete form from database');
          }
        }

        const updatedForms = forms.filter(form => form.id !== id);
        onFormsUpdate(updatedForms);
      } catch (err) {
        console.error('Error deleting form:', err);
        setError('خطا در حذف فرم از دیتابیس');
        setTimeout(() => setError(''), 3000);
      }
    } else {
      setError('حداقل یک فرم باید باقی بماند');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleSubmitAll = async (): Promise<void> => {
    const invalidForms = forms.filter(
      form =>
        !form.unit.trim() || !form.title.trim() || !form.description.trim()
    );

    if (invalidForms.length > 0) {
      setError('لطفاً تمام فیلدهای اجباری را در همه فرم‌ها تکمیل کنید');
      return;
    }

    setSubmitting(true);
    setSubmitStatus('idle');
    setError('');

    try {
      const response = await fetch(
        '/api/' + researchApis.developmentPlan.save,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'submitFinalReports',
            reports: forms.map(form => ({
              unit: form.unit,
              title: form.title,
              description: form.description,
              status: 'submitted',
              submittedAt: new Date().toISOString(),
            })),
            submissionDate: new Date().toISOString(),
            totalReports: forms.length,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        setSubmitStatus('success');

        setTimeout(() => {
          onFormsUpdate([]);
        }, 2000);
      } else {
        throw new Error('Failed to submit reports');
      }
    } catch (err) {
      setSubmitStatus('error');
      setError('خطا در ارسال گزارش‌ها به سرور');
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid = (form: FormData): any => {
    return form.unit.trim() && form.title.trim() && form.description.trim();
  };

  const getFormStatus = (form: FormData): FormStatus => {
    if (!isFormValid(form))
      return { status: 'invalid', text: 'ناقص', color: 'warning' };
    const isPersisted = isNaN(Number(form.id)) || form.id.length !== 13;
    if (isPersisted)
      return { status: 'saved', text: 'ذخیره شده', color: 'success' };
    return { status: 'draft', text: 'پیش‌نویس', color: 'info' };
  };

  if (forms.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" color="text.secondary" textAlign="center">
          هیچ فرمی برای ارسال وجود ندارد
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          sx={{ mt: 1 }}
        >
          برای ارسال نهایی، لطفاً ابتدا فرم‌های گزارش‌دهی را ایجاد کنید
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box>
          <Typography variant="h6" fontWeight="bold">
            ثبت نهایی گزارش‌ها
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            بررسی و ارسال نهایی تمام فرم‌های گزارش‌دهی
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmitAll}
          disabled={
            submitting || forms.filter(isFormValid).length !== forms.length
          }
          startIcon={submitting ? <CircularProgress size={16} /> : <Send />}
          size="large"
        >
          {submitting ? 'در حال ارسال...' : `ارسال ${forms.length} گزارش`}
        </Button>
      </Box>

      {submitStatus === 'success' && (
        <Alert severity="success" sx={{ mb: 2 }}>
          ✅ تمام گزارش‌ها با موفقیت ثبت نهایی شدند!
        </Alert>
      )}

      {submitStatus === 'error' && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        p={2}
        sx={{ bgcolor: 'grey.50', borderRadius: 1 }}
      >
        <Box>
          <Typography variant="body1" fontWeight="medium">
            وضعیت فرم‌ها
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {forms.filter(isFormValid).length} از {forms.length} فرم تکمیل شده
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          <Chip
            label={`تکمیل شده: ${forms.filter(isFormValid).length}`}
            color="success"
            size="small"
          />
          <Chip
            label={`ناقص: ${forms.length - forms.filter(isFormValid).length}`}
            color="warning"
            size="small"
          />
        </Box>
      </Box>

      <List sx={{ maxHeight: '400px', overflow: 'auto' }}>
        {forms.map((form, index) => {
          const formStatus = getFormStatus(form);
          const isValid = isFormValid(form);

          return (
            <ListItem
              key={form.id}
              alignItems="flex-start"
              sx={{
                border: 1,
                borderColor: isValid ? 'success.light' : 'warning.light',
                borderRadius: 2,
                mb: 1,
                bgcolor: isValid ? 'success.50' : 'warning.50',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: isValid ? 'success.100' : 'warning.100',
                  transform: 'translateY(-1px)',
                  boxShadow: 1,
                },
              }}
            >
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {form.title || 'بدون عنوان'}
                    </Typography>
                    <Chip
                      label={formStatus.text}
                      size="small"
                      color={formStatus.color}
                      variant={
                        formStatus.status === 'draft' ? 'outlined' : 'filled'
                      }
                    />
                    <Typography variant="caption" color="text.secondary">
                      #{index + 1}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.primary"
                      gutterBottom
                    >
                      <strong>یگان:</strong> {form.unit || 'تعیین نشده'}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.primary"
                      sx={{
                        mt: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {form.description || 'توضیحاتی وارد نشده است'}
                    </Typography>
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => handleEdit(form)}
                  sx={{ mr: 1 }}
                  color="primary"
                >
                  <Edit />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDelete(form.id)}
                  disabled={forms.length === 1}
                  color="error"
                >
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>

      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <Edit />
            ویرایش فرم گزارش
          </Box>
        </DialogTitle>
        <DialogContent>
          {editedData && (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="یگان *"
                value={editedData.unit}
                onChange={e =>
                  setEditedData({ ...editedData, unit: e.target.value })
                }
                sx={{ mb: 2 }}
                error={!editedData.unit.trim()}
                helperText={
                  !editedData.unit.trim() ? 'این فیلد اجباری است' : ''
                }
              />
              <TextField
                fullWidth
                label="عنوان *"
                value={editedData.title}
                onChange={e =>
                  setEditedData({ ...editedData, title: e.target.value })
                }
                sx={{ mb: 2 }}
                error={!editedData.title.trim()}
                helperText={
                  !editedData.title.trim() ? 'این فیلد اجباری است' : ''
                }
              />
              <TextField
                fullWidth
                multiline
                rows={4}
                label="توضیحات *"
                value={editedData.description}
                onChange={e =>
                  setEditedData({ ...editedData, description: e.target.value })
                }
                error={!editedData.description.trim()}
                helperText={
                  !editedData.description.trim() ? 'این فیلد اجباری است' : ''
                }
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>انصراف</Button>
          <Button
            onClick={handleSaveEdit}
            variant="contained"
            disabled={
              !editedData?.unit.trim() ||
              !editedData?.title.trim() ||
              !editedData?.description.trim()
            }
          >
            ذخیره تغییرات
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default FinalSubmission;
