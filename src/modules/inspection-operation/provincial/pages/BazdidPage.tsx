import {
  Box,
  Button,
  Dialog,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  Alert,
  IconButton,
  MenuItem,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Chip,
} from '@mui/material';
import { useMemo, useState, useEffect } from 'react';
import { useApiQuery, useApiMutation } from '@/hooks/useApi';
import { MatnaDataGrid } from '@/components/data-grid/MatnaDataGrid';
import AddProvinceInspectionForm from '../components/AddProvinceInspectionForm';
import type { GridColDef } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router';

// ==================== Constants ====================

const SeasonLabels = {
  first_season: 'سه‌ماهه اول',
  secound_season: 'سه‌ماهه دوم',
  third_season: 'سه‌ماهه سوم',
  fourth_season: 'سه‌ماهه چهارم',
};

const InspectionTypeLabels = {
  PROVINCIAL_PISH_BAZDID: 'پیش بازدید',
  PROVINCIAL_BAZDID_FARMANDEHI: 'بازدید فرماندهی',
  PROVINCIAL_BAZDID_UNEXPECTED: 'بازدید سرزده',
  PROVINCIAL_PEYGIRI: 'پیگیری',
};

const InspectionTypeColors = {
  PROVINCIAL_PISH_BAZDID: 'warning',
  PROVINCIAL_BAZDID_FARMANDEHI: 'success',
  PROVINCIAL_BAZDID_UNEXPECTED: 'info',
  PROVINCIAL_PEYGIRI: 'default',
};

const InspectionTypeOptions = [
  { value: 'PROVINCIAL_PISH_BAZDID', label: 'پیش بازدید' },
  { value: 'PROVINCIAL_BAZDID_FARMANDEHI', label: 'بازدید فرماندهی' },
  { value: 'PROVINCIAL_BAZDID_UNEXPECTED', label: 'بازدید سرزده' },
  { value: 'PROVINCIAL_PEYGIRI', label: 'پیگیری' },
];

const SEASON_OPTIONS = [
  { value: 'first_season', label: 'سه‌ماهه اول (فروردین، اردیبهشت، خرداد)' },
  { value: 'secound_season', label: 'سه‌ماهه دوم (تیر، مرداد، شهریور)' },
  { value: 'third_season', label: 'سه‌ماهه سوم (مهر، آبان، آذر)' },
  { value: 'fourth_season', label: 'سه‌ماهه چهارم (دی، بهمن، اسفند)' },
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

// ==================== Helper Functions ====================

const getMonthsBySeason = (season: string): number[] => {
  switch (season) {
    case 'first_season':
      return [1, 2, 3];
    case 'secound_season':
      return [4, 5, 6];
    case 'third_season':
      return [7, 8, 9];
    case 'fourth_season':
      return [10, 11, 12];
    default:
      return [];
  }
};

const getTypeForRoute = (type: string): string => {
  // type خودش مستقیماً استفاده می‌شود
  return type;
};

// ==================== Main Component ====================

interface BazdidPageProps {
  type:
    | 'PROVINCIAL_PISH_BAZDID'
    | 'PROVINCIAL_BAZDID_FARMANDEHI'
    | 'PROVINCIAL_BAZDID_UNEXPECTED';
}

interface ProvinceRow {
  provincialInspectionId: string;
  provinceId: number;
  provinceName: string;
  season: string;
  month: number;
  annualPlanId: string;
  annualPlanInspectionId: string;
  inspectionTypeKey: string;
}

interface EditFormData {
  id: string;
  provinceId: number;
  provinceName: string;
  season: string;
  month: number | string;
  inspectionTypeKey: string;
  annualPlanId: string;
  annualPlanInspectionId: string;
}

const BazdidPage = ({ type }: BazdidPageProps) => {
  const navigate = useNavigate();
  const [year, setYear] = useState(1405);
  const [yearInput, setYearInput] = useState('1405');
  const [isYearValid, setIsYearValid] = useState(true);
  const [searchTrigger, setSearchTrigger] = useState(0);
  const [addFormOpen, setAddFormOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<ProvinceRow | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    id: '',
    provinceId: 0,
    provinceName: '',
    season: '',
    month: '',
    inspectionTypeKey: '',
    annualPlanId: '',
    annualPlanInspectionId: '',
  });
  const [monthError, setMonthError] = useState('');
  const [annualPlanId, setAnnualPlanId] = useState<string | null>(null);
  const [annualPlanInspectionId, setAnnualPlanInspectionId] = useState<
    string | null
  >(null);
  const [allData, setAllData] = useState<ProvinceRow[]>([]);
  const [filteredData, setFilteredData] = useState<ProvinceRow[]>([]);
  const [selectedFilterType, setSelectedFilterType] = useState<string>('ALL');

  // ==================== Validation Functions ====================

  const validateYear = (value: string): boolean => {
    const yearRegex = /^\d{4}$/;
    return yearRegex.test(value);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setYearInput(value);
    if (validateYear(value) || value === '') {
      setIsYearValid(true);
    } else {
      setIsYearValid(false);
    }
  };

  const handleSearch = () => {
    if (validateYear(yearInput)) {
      const newYear = parseInt(yearInput, 10);
      setYear(newYear);
      setSearchTrigger(prev => prev + 1);

      setAnnualPlanId(null);
      setAnnualPlanInspectionId(null);
    } else {
      setIsYearValid(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // ==================== API Calls ====================

  const { data, status, isLoading, refetch } = useApiQuery({
    url: 'provincial-inspection-plan',
    params: {
      year: year,
    },
    select: (data: any): ProvinceRow[] => {
      const responseData = data?.data || data;

      if (Array.isArray(responseData)) {
        console.log('Data is array:', responseData);
        return responseData;
      }

      if (responseData?.data && Array.isArray(responseData.data)) {
        console.log('Data is in responseData.data:', responseData.data);
        return responseData.data;
      }

      if (responseData?.rows && Array.isArray(responseData.rows)) {
        console.log('Data is in responseData.rows:', responseData.rows);
        return responseData.rows;
      }

      if (responseData?.provinces && Array.isArray(responseData.provinces)) {
        console.log(
          'Data is in responseData.provinces:',
          responseData.provinces
        );
        return responseData.provinces;
      }

      console.log('No data found, returning empty array');
      return [];
    },
  });

  const editMutation = useApiMutation({
    url: 'provincial-inspection-plan',
    method: 'PUT',
    onSuccess: () => {
      refetch();
      handleCloseEditDialog();
    },
  });

  // ==================== Effects ====================

  useEffect(() => {
    if (data) {
      console.log('API Response Data for year', year, ':', data);
      setAllData(data);

      if (selectedFilterType === 'ALL') {
        setFilteredData(data);
      } else {
        const filtered = data.filter(
          item => item.inspectionTypeKey === selectedFilterType
        );
        setFilteredData(filtered);
      }

      if (data.length > 0 && data[0].annualPlanId) {
        console.log('Setting annualPlanId from data:', data[0].annualPlanId);
        setAnnualPlanId(data[0].annualPlanId);
        setAnnualPlanInspectionId(data[0].annualPlanInspectionId);
      } else {
        console.log('No data found for year', year);
        setAnnualPlanId(null);
        setAnnualPlanInspectionId(null);
      }
    }
  }, [data, selectedFilterType, year]);

  useEffect(() => {
    refetch();
  }, [year, searchTrigger, refetch]);

  // ==================== Handlers ====================

  const handleFilterChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedFilterType(e.target.value as string);
  };

  const handleAddNewInspection = () => {
    if (!annualPlanId) {
      alert(
        `شناسه برنامه سالانه برای سال ${year} یافت نشد. لطفاً سال را جستجو کنید.`
      );
      return;
    }
    setAddFormOpen(true);
  };

  // ==================== شروع بازدید ====================
  const handleStartInspection = (row: ProvinceRow) => {
    console.log('🚀 Starting inspection for row:', row);
    console.log('📌 provincialInspectionId:', row.provincialInspectionId);
    console.log('📌 provinceId:', row.provinceId);
    console.log('📌 type:', type);

    if (!row.provincialInspectionId) {
      console.error('❌ provincialInspectionId is missing for row:', row);
      alert('خطا: شناسه بازدید استانی یافت نشد.');
      return;
    }

    // مسیر با type که از props آمده است
    const path = `/operation/commander/visit/steps/${row.provinceId}/${type}/${row.provincialInspectionId}`;

    console.log('🔄 Navigating to:', path);
    console.log('📦 With state:', {
      provinceName: row.provinceName,
      year: year,
      annualPlanId: row.annualPlanId || annualPlanId,
      annualPlanInspectionId:
        row.annualPlanInspectionId || annualPlanInspectionId,
      provincialInspectionId: row.provincialInspectionId,
      season: row.season,
      month: row.month,
      type: type,
    });

    navigate(path, {
      state: {
        provinceName: row.provinceName,
        year: year,
        annualPlanId: row.annualPlanId || annualPlanId,
        annualPlanInspectionId:
          row.annualPlanInspectionId || annualPlanInspectionId,
        provincialInspectionId: row.provincialInspectionId,
        season: row.season,
        month: row.month,
        type: type,
      },
    });
  };

  const handleEditClick = (row: ProvinceRow) => {
    if (!row.provincialInspectionId) {
      alert('شناسه بازدید یافت نشد');
      return;
    }
    setEditingRow(row);
    setEditFormData({
      id: row.provincialInspectionId,
      provinceId: row.provinceId,
      provinceName: row.provinceName,
      season: row.season || '',
      month: row.month || '',
      inspectionTypeKey: row.inspectionTypeKey || type,
      annualPlanId: row.annualPlanId || '',
      annualPlanInspectionId: row.annualPlanInspectionId || '',
    });
    setMonthError('');
    setEditDialogOpen(true);
  };

  const handleEditFormChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    if (typeof name !== 'string') return;

    setEditFormData(prev => {
      const newData = { ...prev, [name]: value };
      if (name === 'season') {
        newData.month = '';
        setMonthError('');
      }
      return newData;
    });
  };

  const validateMonthInSeason = (month: number, season: string): boolean => {
    if (!month || !season) return true;
    const validMonths = getMonthsBySeason(season);
    return validMonths.includes(month);
  };

  const handleEditSubmit = () => {
    if (!editFormData.season) {
      alert('لطفاً سه‌ماهه را انتخاب کنید');
      return;
    }

    if (editFormData.month) {
      const monthNum =
        typeof editFormData.month === 'string'
          ? parseInt(editFormData.month, 10)
          : editFormData.month;

      if (!validateMonthInSeason(monthNum, editFormData.season)) {
        const validMonths = getMonthsBySeason(editFormData.season);
        setMonthError(
          `ماه انتخابی باید در محدوده ${validMonths.join('، ')} باشد`
        );
        return;
      }
    }

    const payload = {
      id: editFormData.id,
      provinceId: editFormData.provinceId,
      provinceName: editFormData.provinceName,
      season: editFormData.season,
      month:
        typeof editFormData.month === 'string'
          ? parseInt(editFormData.month, 10)
          : editFormData.month,
      inspectionTypeKey: editFormData.inspectionTypeKey,
      annualPlanId: editFormData.annualPlanId,
      annualPlanInspectionId: editFormData.annualPlanInspectionId,
    };

    console.log('Editing payload:', payload);
    editMutation.mutate(payload);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditingRow(null);
    setEditFormData({
      id: '',
      provinceId: 0,
      provinceName: '',
      season: '',
      month: '',
      inspectionTypeKey: '',
      annualPlanId: '',
      annualPlanInspectionId: '',
    });
    setMonthError('');
  };

  // ==================== Columns Definition ====================

  const columns: GridColDef[] = useMemo(
    () => [
      {
        headerName: '#',
        field: 'rowNumber',
        headerAlign: 'center',
        align: 'center',
        flex: 0.5,
        minWidth: 60,
        renderCell: params => params.api.getAllRowIds().indexOf(params.id) + 1,
      },
      {
        headerName: 'استان',
        field: 'provinceName',
        flex: 2,
        minWidth: 200,
      },
      {
        headerName: 'نوع بازدید',
        field: 'inspectionTypeKey',
        headerAlign: 'center',
        align: 'center',
        flex: 1.5,
        minWidth: 150,
        renderCell: params => {
          const inspectionType = params.row.inspectionTypeKey || type;
          return (
            <Chip
              label={
                InspectionTypeLabels[
                  inspectionType as keyof typeof InspectionTypeLabels
                ] || inspectionType
              }
              color={
                (InspectionTypeColors[
                  inspectionType as keyof typeof InspectionTypeColors
                ] as any) || 'default'
              }
              size="small"
              sx={{ fontWeight: 'medium' }}
            />
          );
        },
      },
      {
        headerName: 'سه‌ماهه',
        field: 'season',
        headerAlign: 'center',
        align: 'center',
        flex: 1,
        minWidth: 120,
        renderCell: params =>
          SeasonLabels[params.row.season as keyof typeof SeasonLabels] ||
          params.row.season,
      },
      {
        headerName: 'ماه',
        field: 'month',
        headerAlign: 'center',
        align: 'center',
        flex: 0.5,
        minWidth: 80,
        renderCell: params => params.row.month || '-',
      },
      {
        headerName: 'عملیات',
        headerAlign: 'center',
        align: 'center',
        field: 'action',
        flex: 1.5,
        minWidth: 200,
        renderCell: ({ row }: { row: ProvinceRow }) => {
          return (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                color="info"
                size="small"
                onClick={() => handleStartInspection(row)}
              >
                شروع بازدید
              </Button>
              <IconButton
                color="primary"
                size="small"
                onClick={() => handleEditClick(row)}
                title="ویرایش"
              >
                <EditIcon />
              </IconButton>
            </Box>
          );
        },
      },
    ],
    [type, annualPlanId, annualPlanInspectionId]
  );

  const getPageTitle = (): string => {
    return 'لیست بازدیدهای استانی';
  };

  const getButtonColor = (): 'warning' | 'success' | 'info' | 'primary' => {
    switch (type) {
      case 'PROVINCIAL_PISH_BAZDID':
        return 'warning';
      case 'PROVINCIAL_BAZDID_FARMANDEHI':
        return 'success';
      case 'PROVINCIAL_BAZDID_UNEXPECTED':
        return 'info';
      default:
        return 'primary';
    }
  };

  const getAvailableMonths = () => {
    if (!editFormData.season) return [];
    const months = getMonthsBySeason(editFormData.season);
    return months.map(month => ({
      value: month.toString(),
      label: MONTHS.find(m => m.value === month)?.label || month.toString(),
    }));
  };

  const rowsWithNumbers = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return [];
    return filteredData.map((row, index) => ({
      ...row,
      rowNumber: index + 1,
      id: row.provincialInspectionId || row.provinceId,
    }));
  }, [filteredData]);

  return (
    <>
      <Box sx={{ width: '100%', p: 2 }}>
        <Box sx={{ margin: '20px 0' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <Typography fontWeight={700} variant="h5">
                {getPageTitle()}
              </Typography>
              {filteredData && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  سال جاری: {year} | تعداد استان‌ها: {filteredData.length}
                  {annualPlanId && (
                    <span
                      style={{
                        display: 'block',
                        fontSize: '0.75rem',
                        color: '#2e7d32',
                        marginTop: 4,
                      }}
                    >
                      ✅ شناسه برنامه: {annualPlanId.substring(0, 8)}...
                    </span>
                  )}
                  {!annualPlanId && (
                    <span
                      style={{
                        display: 'block',
                        fontSize: '0.75rem',
                        color: '#ed6c02',
                        marginTop: 4,
                      }}
                    >
                      ⚠️ برنامه سالانه برای سال {year} یافت نشد
                    </span>
                  )}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12} md={8}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  flexWrap: 'wrap',
                  justifyContent: 'flex-end',
                }}
              >
                <TextField
                  label="جستجوی سال"
                  variant="outlined"
                  size="small"
                  value={yearInput}
                  onChange={handleYearChange}
                  onKeyPress={handleKeyPress}
                  error={!isYearValid}
                  helperText={
                    !isYearValid ? 'لطفاً یک عدد ۴ رقمی وارد کنید' : ''
                  }
                  inputProps={{ maxLength: 4, pattern: '\\d*' }}
                  sx={{ width: '150px' }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarTodayIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSearch}
                  disabled={!yearInput || !isYearValid}
                  startIcon={<SearchIcon />}
                  size="medium"
                >
                  جستجو
                </Button>

                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>نوع بازدید</InputLabel>
                  <Select
                    value={selectedFilterType}
                    label="نوع بازدید"
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="ALL">همه</MenuItem>
                    {InspectionTypeOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button
                  variant="contained"
                  color={getButtonColor()}
                  onClick={handleAddNewInspection}
                  startIcon={<AddIcon />}
                  disabled={!annualPlanId}
                  size="medium"
                >
                  ثبت بازدید جدید
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {!annualPlanId && !isLoading && (
          <Alert
            severity="warning"
            sx={{ mb: 2 }}
            action={
              <Button color="inherit" size="small" onClick={handleSearch}>
                جستجوی مجدد
              </Button>
            }
          >
            برنامه سالانه برای سال {year} یافت نشد. لطفاً سال دیگری را جستجو
            کنید یا با پشتیبانی تماس بگیرید.
          </Alert>
        )}

        {status === 'error' && (
          <Alert severity="error" sx={{ mb: 2 }}>
            خطا در دریافت داده‌ها. لطفاً دوباره تلاش کنید.
          </Alert>
        )}

        {!isLoading && filteredData?.length === 0 && annualPlanId && (
          <Alert severity="info" sx={{ mb: 2 }}>
            هیچ استانی برای سال {year} یافت نشد. برای افزودن استان، دکمه ثبت
            بازدید جدید را بزنید.
          </Alert>
        )}

        <Box sx={{ width: '100%', mt: 2 }}>
          <MatnaDataGrid
            rows={rowsWithNumbers}
            columns={columns}
            loading={isLoading}
            paginationMode={'client'}
            autoHeight
            getRowId={row => row.provincialInspectionId || row.provinceId}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            pageSizeOptions={[5, 10, 25]}
          />
        </Box>
      </Box>

      {/* ==================== Add Province Inspection Form ==================== */}
      <AddProvinceInspectionForm
        open={addFormOpen}
        onClose={() => setAddFormOpen(false)}
        annualPlanId={annualPlanId}
        annualPlanInspectionId={annualPlanInspectionId}
        inspectionTypeKey={type}
        year={year}
        existingProvinces={filteredData?.map(p => p.provinceId) || []}
        onSuccess={() => refetch()}
      />

      {/* ==================== Edit Dialog ==================== */}
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>ویرایش بازدید - {editingRow?.provinceName}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="استان"
              value={editFormData.provinceName}
              disabled
              fullWidth
              size="medium"
              InputProps={{
                sx: { bgcolor: '#f5f5f5' },
              }}
            />

            <FormControl fullWidth required>
              <InputLabel>نوع بازدید</InputLabel>
              <Select
                name="inspectionTypeKey"
                value={editFormData.inspectionTypeKey}
                label="نوع بازدید"
                onChange={handleEditFormChange}
              >
                {InspectionTypeOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth required>
              <InputLabel>سه‌ماهه</InputLabel>
              <Select
                name="season"
                value={editFormData.season}
                label="سه‌ماهه"
                onChange={handleEditFormChange}
              >
                {SEASON_OPTIONS.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth error={!!monthError}>
              <InputLabel>ماه</InputLabel>
              <Select
                name="month"
                value={editFormData.month?.toString() || ''}
                label="ماه"
                onChange={handleEditFormChange}
                disabled={!editFormData.season}
              >
                <MenuItem value="">بدون ماه</MenuItem>
                {getAvailableMonths().map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {monthError && <FormHelperText>{monthError}</FormHelperText>}
            </FormControl>

            <Box sx={{ mt: 1, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                شناسه بازدید: {editFormData.id}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                شناسه برنامه: {editFormData.annualPlanId?.substring(0, 12)}...
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>انصراف</Button>
          <Button
            onClick={handleEditSubmit}
            variant="contained"
            color="primary"
            disabled={editMutation.isPending}
          >
            {editMutation.isPending ? 'در حال ذخیره...' : 'ذخیره'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BazdidPage;
