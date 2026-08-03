// components/AddProvinceInspectionForm.tsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  Chip,
  FormHelperText,
  CircularProgress,
  Typography,
  IconButton,
  MenuItem,
  Paper,
  Autocomplete,
  TextField,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from '@/hooks/useApi';
import { useQueryClient } from '@tanstack/react-query';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useLegacyApi } from '@/hooks/useLegacyApi';

interface AddProvinceInspectionFormProps {
  open: boolean;
  onClose: () => void;
  annualPlanId: string | null;
  annualPlanInspectionId: string | null;
  inspectionTypeKey?: string;
  year: number;
  existingProvinces?: number[];
  onSuccess?: () => void;
}

interface Province {
  id: number;
  value: string;
}

interface SelectedProvince {
  id: number;
  name: string;
  season: string;
  month: number;
}

const INSPECTION_TYPES = [
  { value: 'PROVINCIAL_PISH_BAZDID', label: 'پیش بازدید' },
  { value: 'PROVINCIAL_BAZDID_FARMANDEHI', label: 'بازدید فرماندهی' },
  { value: 'PROVINCIAL_BAZDID_UNEXPECTED', label: 'بازدید سرزده' },
  { value: 'PROVINCIAL_PEYGIRI', label: 'پیگیری' },
];

const SEASONS = [
  { value: 'first_season', label: 'سه‌ماهه اول', months: [1, 2, 3] },
  { value: 'secound_season', label: 'سه‌ماهه دوم', months: [4, 5, 6] },
  { value: 'third_season', label: 'سه‌ماهه سوم', months: [7, 8, 9] },
  { value: 'fourth_season', label: 'سه‌ماهه چهارم', months: [10, 11, 12] },
];

const MONTHS = [
  { value: 1, label: 'فروردین' },
  { value: 2, label: 'اردیبهشت' },
  { value: 3, label: 'خرداد' },
  { value: 4, label: 'تیر' },
  { value: 5, label: 'مرداد' },
  { value: 6, label: 'شهریور' },
  { value: 7, label: 'مهر' },
  { value: 8, label: 'آبان' },
  { value: 9, label: 'آذر' },
  { value: 10, label: 'دی' },
  { value: 11, label: 'بهمن' },
  { value: 12, label: 'اسفند' },
];

const AddProvinceInspectionForm = ({
  open,
  onClose,
  annualPlanId,
  annualPlanInspectionId,
  inspectionTypeKey: initialInspectionTypeKey,
  year,
  existingProvinces = [],
  onSuccess,
}: AddProvinceInspectionFormProps) => {
  const queryClient = useQueryClient();
  const legacyApi = useLegacyApi();
  const [selectedInspectionType, setSelectedInspectionType] = useState<string>(
    initialInspectionTypeKey || ''
  );
  const [selectedProvinces, setSelectedProvinces] = useState<
    SelectedProvince[]
  >([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedInspectionType(initialInspectionTypeKey || '');
      setSelectedProvinces([]);
      setErrors({});
    }
  }, [open, initialInspectionTypeKey]);

  // دریافت لیست استان‌ها
  const {
    data: provinces = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['provinces'],
    queryFn: async () => {
      console.log('Fetching provinces...');
      const response = await legacyApi.get(
        'common-base-data/find-all/class-name/province?currentPage=1&pageSize=100'
      );

      console.log('Full response:', JSON.stringify(response, null, 2));

      let rows = [];

      if (response?.data?.data?.rows) {
        rows = response.data.data.rows;
      } else if (response?.data?.rows) {
        rows = response.data.rows;
      } else if (response?.data?.data && Array.isArray(response.data.data)) {
        rows = response.data.data;
      } else if (Array.isArray(response?.data)) {
        rows = response.data;
      } else if (response?.data && Array.isArray(response.data)) {
        rows = response.data;
      }

      const formattedProvinces = rows.map((item: any) => ({
        id: item.id,
        value: item.value || item.name || '',
      }));

      return formattedProvinces;
    },
    enabled: open,
  });

  // فیلتر استان‌های قابل انتخاب
  const getAvailableProvinces = () => {
    const selectedIds = selectedProvinces.map(p => p.id);
    const available = provinces.filter(
      (province: Province) =>
        !existingProvinces.includes(province.id) &&
        !selectedIds.includes(province.id)
    );
    return available;
  };

  const handleAddProvince = (event: any, newValue: Province | null) => {
    if (newValue) {
      setSelectedProvinces([
        ...selectedProvinces,
        {
          id: newValue.id,
          name: newValue.value,
          season: '',
          month: 0,
        },
      ]);
    }
  };

  const handleRemoveProvince = (provinceId: number) => {
    setSelectedProvinces(selectedProvinces.filter(p => p.id !== provinceId));
  };

  const handleSeasonChange = (provinceId: number, season: string) => {
    setSelectedProvinces(
      selectedProvinces.map(p =>
        p.id === provinceId ? { ...p, season, month: 0 } : p
      )
    );
  };

  const handleMonthChange = (provinceId: number, month: number) => {
    setSelectedProvinces(
      selectedProvinces.map(p => (p.id === provinceId ? { ...p, month } : p))
    );
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedInspectionType) {
      newErrors.inspectionType = 'لطفاً نوع بازدید را انتخاب کنید';
    }

    if (selectedProvinces.length === 0) {
      newErrors.provinces = 'حداقل یک استان انتخاب کنید';
    }

    selectedProvinces.forEach((province, index) => {
      if (!province.season) {
        newErrors[`province_${index}_season`] = 'فصل را انتخاب کنید';
      }
      if (!province.month || province.month === 0) {
        newErrors[`province_${index}_month`] = 'ماه را انتخاب کنید';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { mutate, isPending } = useApiMutation({
    url: 'provincial-inspection-plan',
    method: 'POST',
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['provincial-inspection-plan', year],
      });
      onSuccess?.();
      handleClose();
    },
  });

  const handleSubmit = () => {
    if (!validateForm()) return;

    // بررسی وجود annualPlanId
    if (!annualPlanId) {
      console.error('annualPlanId is missing');
      setErrors({ ...errors, annualPlanId: 'شناسه برنامه سالانه یافت نشد' });
      return;
    }

    const payload = {
      annualPlanId: annualPlanId,
      // annualPlanInspectionId: annualPlanInspectionId || null,
      inspectionTypeKey: selectedInspectionType,
      provinces: selectedProvinces.map(p => ({
        provinceId: p.id,
        season: p.season,
        month: p.month,
      })),
    };

    console.log('Submitting payload:', payload);
    mutate(payload);
  };

  const handleClose = () => {
    setSelectedInspectionType('');
    setSelectedProvinces([]);
    setErrors({});
    onClose();
  };

  const availableProvinces = getAvailableProvinces();
  const isFormValid =
    selectedInspectionType && selectedProvinces.length > 0 && annualPlanId;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            افزودن بازدید استانی جدید - سال {year}
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {isLoading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={() => refetch()}>
                تلاش مجدد
              </Button>
            }
          >
            خطا در دریافت لیست استان‌ها
          </Alert>
        ) : (
          <Box>
            {/* نمایش شناسه‌ها برای دیباگ */}
            <Box sx={{ mb: 2, p: 1, bgcolor: '#e8f5e9', borderRadius: 1 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                ✅ شناسه برنامه سالانه: {annualPlanId || 'نامشخص'}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                شناسه بازدید برنامه: {annualPlanInspectionId || 'نامشخص'}
              </Typography>
            </Box>

            {/* Dropdown for Inspection Type */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                نوع بازدید
              </Typography>
              <FormControl
                fullWidth
                size="medium"
                error={!!errors.inspectionType}
              >
                <InputLabel>نوع بازدید</InputLabel>
                <Select
                  value={selectedInspectionType}
                  label="نوع بازدید"
                  onChange={e => setSelectedInspectionType(e.target.value)}
                >
                  {INSPECTION_TYPES.map(type => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.inspectionType && (
                  <FormHelperText>{errors.inspectionType}</FormHelperText>
                )}
              </FormControl>
            </Box>

            {/* نمایش استان‌های انتخاب شده قبلی */}
            {existingProvinces.length > 0 && (
              <Paper
                variant="outlined"
                sx={{ p: 2, mb: 3, bgcolor: '#f5f5f5' }}
              >
                <Typography variant="body2" fontWeight="bold" gutterBottom>
                  استان‌های انتخاب شده قبلی ({existingProvinces.length}):
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={0.5}>
                  {provinces
                    .filter((p: Province) => existingProvinces.includes(p.id))
                    .map((p: Province) => (
                      <Chip
                        key={p.id}
                        label={p.value}
                        size="small"
                        variant="outlined"
                        color="default"
                      />
                    ))}
                </Box>
              </Paper>
            )}

            {/* نمایش تعداد استان‌های موجود */}
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              تعداد کل استان‌ها: {provinces.length} | قابل انتخاب:{' '}
              {availableProvinces.length}
            </Typography>

            {/* Autocomplete برای انتخاب استان جدید */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                انتخاب استان جدید
              </Typography>
              <Autocomplete
                options={availableProvinces}
                getOptionLabel={(option: Province) => option.value}
                onChange={handleAddProvince}
                disabled={availableProvinces.length === 0}
                renderInput={params => (
                  <TextField
                    {...params}
                    label="نام استان"
                    placeholder="جستجو کنید..."
                    error={!!errors.provinces}
                    helperText={errors.provinces}
                    fullWidth
                  />
                )}
                noOptionsText="استانی برای انتخاب وجود ندارد"
                style={{ width: '100%' }}
              />
            </Box>

            {/* لیست استان‌های انتخاب شده */}
            {selectedProvinces.length > 0 && (
              <Box mt={4}>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <AddCircleOutlineIcon color="primary" />
                  <Typography variant="subtitle2" fontWeight="bold">
                    استان‌های انتخاب شده
                  </Typography>
                  <Chip
                    label={selectedProvinces.length}
                    size="small"
                    color="primary"
                  />
                </Box>

                {selectedProvinces.map((province, index) => {
                  const selectedSeason = SEASONS.find(
                    s => s.value === province.season
                  );

                  return (
                    <Paper
                      key={province.id}
                      variant="outlined"
                      sx={{
                        p: 2,
                        mb: 2,
                        position: 'relative',
                        border:
                          errors[`province_${index}_season`] ||
                          errors[`province_${index}_month`]
                            ? '2px solid #d32f2f'
                            : '1px solid rgba(0, 0, 0, 0.12)',
                        backgroundColor: '#fff',
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveProvince(province.id)}
                        sx={{ position: 'absolute', top: 8, left: 8 }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>

                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        sx={{ mb: 2, pr: 4, color: '#1976d2' }}
                      >
                        {province.name}
                      </Typography>

                      <Box display="flex" gap={2}>
                        <FormControl
                          fullWidth
                          size="small"
                          error={!!errors[`province_${index}_season`]}
                        >
                          <InputLabel>فصل بازدید</InputLabel>
                          <Select
                            value={province.season}
                            label="فصل بازدید"
                            onChange={e =>
                              handleSeasonChange(province.id, e.target.value)
                            }
                          >
                            {SEASONS.map(season => (
                              <MenuItem key={season.value} value={season.value}>
                                {season.label}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors[`province_${index}_season`] && (
                            <FormHelperText>
                              {errors[`province_${index}_season`]}
                            </FormHelperText>
                          )}
                        </FormControl>

                        <FormControl
                          fullWidth
                          size="small"
                          error={!!errors[`province_${index}_month`]}
                        >
                          <InputLabel>ماه بازدید</InputLabel>
                          <Select
                            value={province.month || ''}
                            label="ماه بازدید"
                            onChange={e =>
                              handleMonthChange(
                                province.id,
                                Number(e.target.value)
                              )
                            }
                            disabled={!province.season}
                          >
                            {selectedSeason?.months.map(month => (
                              <MenuItem key={month} value={month}>
                                {MONTHS.find(m => m.value === month)?.label}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors[`province_${index}_month`] && (
                            <FormHelperText>
                              {errors[`province_${index}_month`]}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Box>
                    </Paper>
                  );
                })}
              </Box>
            )}

            {selectedProvinces.length === 0 && (
              <Alert severity="info" sx={{ mt: 3 }}>
                هیچ استانی انتخاب نشده است. از باکس بالا یک استان انتخاب کنید.
              </Alert>
            )}

            {!annualPlanId && (
              <Alert severity="error" sx={{ mt: 2 }}>
                ❌ شناسه برنامه سالانه یافت نشد. امکان ثبت بازدید جدید وجود
                ندارد.
              </Alert>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Typography variant="body2" color="text.secondary">
          تعداد انتخاب: {selectedProvinces.length}
        </Typography>
        <Box>
          <Button onClick={handleClose} sx={{ ml: 1 }}>
            انصراف
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={isPending || !isFormValid}
          >
            {isPending ? 'در حال ثبت...' : 'ثبت بازدید'}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default AddProvinceInspectionForm;
