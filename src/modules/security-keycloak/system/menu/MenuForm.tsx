import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  FormControlLabel,
  Switch,
} from '@mui/material';

import keycloakApis from '../../apis';
import type { Menu, CreateMenuRequest, UpdateMenuRequest } from '../../types';
import { useKeycloakApiMutation } from '@/hooks/useApiKeycloak';
import { useNotification } from '../../NotificationContext'; 

interface MenuFormProps {
  open: boolean;
  onClose: () => void;
  menu: Menu | null;
  parentMenus: Menu[];
  onSuccess: () => void;
}

export function MenuForm({
  open,
  onClose,
  menu,
  parentMenus,
  onSuccess,
}: MenuFormProps) {
  const [formData, setFormData] = useState<CreateMenuRequest>({
    name: '',
    englishTitle: '',
    icon: '',
    link: '',
    style: '',
    className: '',
    comp: '',
    parentId: '',
    sensitive: false,
    disabled: false,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateMenuRequest, string>>
  >({});
  const { showNotification } = useNotification();

  const createMutation = useKeycloakApiMutation<any, any>({
    url: keycloakApis.menu.create,
    method: 'POST',
    onSuccess: () => {
      showNotification('منو با موفقیت ایجاد شد');
      handleSuccess();
    },
    onError: error => {
      showNotification('خطا در ایجاد منو', 'error');
    },
  });

  const updateMutation = useKeycloakApiMutation<any, any>({
    url: keycloakApis.menu.update,
    method: 'POST',
    onSuccess: () => {
      showNotification('منو با موفقیت ویرایش شد');
      handleSuccess();
    },
    onError: error => {
      showNotification('خطا در ویرایش منو', 'error');
    },
  });

  const isLoading = createMutation.isPending || updateMutation.isPending;
  const isEdit = !!menu;

  useEffect(() => {
    if (menu) {
      setFormData({
        name: menu.name,
        englishTitle: menu.englishTitle,
        icon: menu.icon,
        link: menu.link,
        style: menu.style,
        className: menu.className,
        comp: menu.comp,
        parentId: menu.parentId || '',
        sensitive: menu.sensitive,
        disabled: menu.disabled || false,
      });
    } else {
      setFormData({
        name: '',
        englishTitle: '',
        icon: '',
        link: '',
        style: '',
        className: '',
        comp: '',
        parentId: '',
        sensitive: false,
        disabled: false,
      });
    }
    setErrors({});
  }, [menu, open]);

  const handleSuccess = () => {
    onSuccess();
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      englishTitle: '',
      icon: '',
      link: '',
      style: '',
      className: '',
      comp: '',
      parentId: '',
      sensitive: false,
      disabled: false,
    });
    setErrors({});
    onClose();
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateMenuRequest, string>> = {};

    if (!formData.name.trim()) newErrors.name = 'عنوان فارسی الزامی است';
    if (!formData.englishTitle.trim())
      newErrors.englishTitle = 'عنوان انگلیسی الزامی است';
    if (!formData.icon.trim()) newErrors.icon = 'آیکون الزامی است';
    if (!formData.link.trim()) newErrors.link = 'لینک الزامی است';
    if (!formData.style.trim()) newErrors.style = 'استایل الزامی است';
    if (!formData.className.trim()) newErrors.className = 'نام کلاس الزامی است';
    if (!formData.comp.trim()) newErrors.comp = 'کمپوننت الزامی است';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const requestBody = {
      searchModel: isEdit ? { ...formData, id: menu.id } : formData,
    };

    try {
      if (isEdit) {
        await updateMutation.mutateAsync(requestBody);
      } else {
        await createMutation.mutateAsync(requestBody);
      }
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleChange = (field: keyof CreateMenuRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const mutationError = createMutation.error || updateMutation.error;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEdit ? 'ویرایش منو' : 'ایجاد منو جدید'}</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={2}>
          {mutationError && (
            <Alert severity="error">
              {mutationError.response?.data?.message || 'خطا در ذخیره اطلاعات'}
            </Alert>
          )}

          <Box display="flex" gap={2}>
            <TextField
              label="عنوان فارسی"
              value={formData.name}
              onChange={e => handleChange('name', e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
              required
            />
            <TextField
              label="عنوان انگلیسی"
              value={formData.englishTitle}
              onChange={e => handleChange('englishTitle', e.target.value)}
              error={!!errors.englishTitle}
              helperText={errors.englishTitle}
              fullWidth
              required
            />
          </Box>

          <Box display="flex" gap={2}>
            <TextField
              label="آیکون"
              value={formData.icon}
              onChange={e => handleChange('icon', e.target.value)}
              error={!!errors.icon}
              helperText={errors.icon}
              fullWidth
              required
            />
            <TextField
              label="لینک"
              value={formData.link}
              onChange={e => handleChange('link', e.target.value)}
              error={!!errors.link}
              helperText={errors.link}
              fullWidth
              required
            />
          </Box>

          <Box display="flex" gap={2}>
            <TextField
              label="استایل"
              value={formData.style}
              onChange={e => handleChange('style', e.target.value)}
              error={!!errors.style}
              helperText={errors.style}
              fullWidth
              required
            />
            <TextField
              label="نام کلاس"
              value={formData.className}
              onChange={e => handleChange('className', e.target.value)}
              error={!!errors.className}
              helperText={errors.className}
              fullWidth
              required
            />
          </Box>

          <Box display="flex" gap={2}>
            <TextField
              label="کمپوننت"
              value={formData.comp}
              onChange={e => handleChange('comp', e.target.value)}
              error={!!errors.comp}
              helperText={errors.comp}
              fullWidth
              required
            />

            <FormControl fullWidth>
              <InputLabel>منوی والد</InputLabel>
              <Select
                value={formData.parentId}
                onChange={e => handleChange('parentId', e.target.value)}
                label="منوی والد"
              >
                <MenuItem value="">بدون والد</MenuItem>
                {parentMenus.map(parent => (
                  <MenuItem key={parent.id} value={parent.id}>
                    {parent.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box display="flex" gap={2}>
            <FormControl fullWidth>
              <InputLabel>نوع منو</InputLabel>
              <Select
                value={formData.sensitive}
                onChange={e => handleChange('sensitive', e.target.value)}
                label="نوع منو"
              >
                <MenuItem value={false}>غیر حساس</MenuItem>
                <MenuItem value={true}>حساس</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  checked={formData.disabled}
                  onChange={e => handleChange('disabled', e.target.checked)}
                />
              }
              label="غیرفعال"
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading}>
          انصراف
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={isLoading}>
          {isLoading ? 'در حال ذخیره...' : isEdit ? 'ویرایش' : 'ذخیره'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
