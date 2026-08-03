// import {
//   Box,
//   Button,
//   Grid,
//   Paper,
//   Typography,
//   CircularProgress,
//   Alert,
// } from '@mui/material';
// import { useState } from 'react';
// import { useLegacyApi } from '@/hooks/useLegacyApi';
// import { useSnackbar } from '@/hooks/useSnackbar';

// const StartInspectionStep2 = ({
//   inspectionInformation,
//   refetchStep,
//   onStepChange,
//   currentStep,
// }) => {
//   const legacyApi = useLegacyApi();
//   const snackbar = useSnackbar();
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   console.log('Step2 - inspectionInformation:', {
//     id: inspectionInformation?.id,
//     provincialInspectionId: inspectionInformation?.provincialInspectionId,
//     state: inspectionInformation?.state,
//   });

//   const handleContinue = async () => {
//     setIsSubmitting(true);

//     const payload = {
//       id: inspectionInformation?.id,
//       provincialInspectionId: inspectionInformation?.provincialInspectionId,
//       provinceId: inspectionInformation?.provinceId,
//       provinceName: inspectionInformation?.provinceName,
//       year: inspectionInformation?.year,
//       season: inspectionInformation?.season,
//       month: inspectionInformation?.month,
//       inspectionTypeKey: inspectionInformation?.inspectionTypeKey,
//       annualPlanInspectionId: inspectionInformation?.annualPlanInspectionId,
//       informationStartDate: inspectionInformation?.informationStartDate,
//       informationEndDate: inspectionInformation?.informationEndDate,
//       state: 'SODOR_ESTEHZARIYE',
//       issuanceInformation: null,
//       issuanceInstruction: null,
//     };

//     console.log('Step2 - Submitting payload:', payload);

//     try {
//       const response = await legacyApi.put('/information', payload);
//       console.log('Step2 - API response:', response);

//       if (response?.status === 200 || response?.data) {
//         snackbar('اطلاعات با موفقیت ذخیره شد', 'success', 3000);
//         await refetchStep();
//         onStepChange(2);
//       } else {
//         throw new Error('خطا در ذخیره اطلاعات');
//       }
//     } catch (error) {
//       console.error('Step2 - Error:', error);
//       snackbar('خطا در ذخیره اطلاعات', 'error', 3000);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleBack = async () => {
//     setIsSubmitting(true);

//     const payload = {
//       id: inspectionInformation?.id,
//       provincialInspectionId: inspectionInformation?.provincialInspectionId,
//       provinceId: inspectionInformation?.provinceId,
//       provinceName: inspectionInformation?.provinceName,
//       year: inspectionInformation?.year,
//       season: inspectionInformation?.season,
//       month: inspectionInformation?.month,
//       inspectionTypeKey: inspectionInformation?.inspectionTypeKey,
//       annualPlanInspectionId: inspectionInformation?.annualPlanInspectionId,
//       informationStartDate: inspectionInformation?.informationStartDate,
//       informationEndDate: inspectionInformation?.informationEndDate,
//       state: 'MOSHAKHASAT_ESTEHZARIYE',
//     };

//     try {
//       await legacyApi.put('/information', payload);
//       await refetchStep();
//       onStepChange(0);
//       snackbar('به مرحله قبل بازگشتید', 'success', 3000);
//     } catch (error) {
//       console.error('Step2 - Back error:', error);
//       snackbar('خطا در بازگشت', 'error', 3000);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (currentStep !== 1) return null;

//   return (
//     <Box sx={{ p: 2 }}>
//       <Paper sx={{ p: 3 }}>
//         <Typography variant="h6" gutterBottom>
//           تخصص‌ها استحضاریه
//         </Typography>

//         <Typography variant="body2" color="text.secondary" gutterBottom>
//           شناسه بازدید: {inspectionInformation?.provincialInspectionId}
//         </Typography>

//         <Alert severity="info" sx={{ my: 2 }}>
//           این مرحله برای تست ساده شده است. برای ادامه، دکمه ثبت و ادامه را
//           بزنید.
//         </Alert>

//         <Typography variant="body2" sx={{ my: 2 }}>
//           استان: {inspectionInformation?.provinceName}
//           <br />
//           سال: {inspectionInformation?.year}
//           <br />
//           وضعیت فعلی: {inspectionInformation?.state}
//         </Typography>

//         <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
//           <Button
//             variant="contained"
//             color="error"
//             onClick={handleBack}
//             disabled={isSubmitting}
//           >
//             مرحله قبل
//           </Button>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={handleContinue}
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? <CircularProgress size={24} /> : 'ثبت و ادامه'}
//           </Button>
//         </Box>
//       </Paper>
//     </Box>
//   );
// };

// export default StartInspectionStep2;
import {
  Box,
  Button,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Stack,
  Divider,
} from '@mui/material';
import { useState, useEffect, useCallback } from 'react';
import { useSnackbar } from '@/hooks/useSnackbar';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const StartInspectionStep2 = ({
  inspectionInformation,
  setInspectionInformation,
  refetchStep,
  onStepChange,
  currentStep,
  useMockData = true,
  updateInspectionState,
  experts = [],
  setExperts,
  leadInfo = null,
  setLeadInfo,
  availablePersonnel = [],
  setAvailablePersonnel,
  availableUnits = [],
  availableSpecialties = [],
  snackbar,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openAddExpertDialog, setOpenAddExpertDialog] = useState(false);
  const [openEditExpertDialog, setOpenEditExpertDialog] = useState(false);
  const [openLeadSelectionDialog, setOpenLeadSelectionDialog] = useState(false);
  const [editingExpert, setEditingExpert] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    family: '',
    degree: '',
    personNumber: '',
    unit: '',
    specialty: '',
    position: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  console.log('Step2 - inspectionInformation:', {
    id: inspectionInformation?.id,
    state: inspectionInformation?.state,
    experts: experts?.length,
    leadInfo: leadInfo,
  });

  // Filter available personnel based on search
  const filteredPersonnel = availablePersonnel.filter(
    p =>
      !experts.some(e => e.personNumber === p.personNumber) &&
      (p.name.includes(searchTerm) ||
        p.family.includes(searchTerm) ||
        p.personNumber.includes(searchTerm))
  );

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = 'نام الزامی است';
    if (!formData.family) errors.family = 'نام خانوادگی الزامی است';
    if (!formData.degree) errors.degree = 'درجه الزامی است';
    if (!formData.personNumber) errors.personNumber = 'شماره پرسنلی الزامی است';
    if (!formData.unit) errors.unit = 'یگان الزامی است';
    if (!formData.specialty) errors.specialty = 'تخصص الزامی است';
    if (!formData.position) errors.position = 'موقعیت الزامی است';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle add expert
  const handleAddExpert = () => {
    if (!validateForm()) return;

    const newExpert = {
      id: `expert-${Date.now()}`,
      ...formData,
      assignStatus: 'pending',
      inspectionId: inspectionInformation?.inspectionId,
      commonBaseDataFieldId: `field-${Date.now()}`,
      commonBaseDataFieldValue: formData.specialty,
      organizationUnitName: formData.unit,
    };

    try {
      if (useMockData) {
        if (setExperts) {
          setExperts([...experts, newExpert]);
        }
        setOpenAddExpertDialog(false);
        resetForm();
        snackbar('بازرس با موفقیت اضافه شد', 'success', 3000);
      } else {
        throw new Error('Real API not implemented in dev mode');
      }
    } catch (error) {
      const errorMessage = error.message || 'خطا در افزودن بازرس';
      snackbar(errorMessage, 'error', 5000);
      console.error('Add expert error:', error);
    }
  };

  // Handle edit expert
  const handleEditExpert = () => {
    if (!validateForm()) return;

    try {
      if (useMockData) {
        const updatedExperts = experts.map(e =>
          e.id === editingExpert.id
            ? {
                ...e,
                ...formData,
                commonBaseDataFieldValue: formData.specialty,
                organizationUnitName: formData.unit,
              }
            : e
        );
        if (setExperts) {
          setExperts(updatedExperts);
        }
        setOpenEditExpertDialog(false);
        resetForm();
        snackbar('بازرس با موفقیت ویرایش شد', 'success', 3000);
      } else {
        throw new Error('Real API not implemented in dev mode');
      }
    } catch (error) {
      const errorMessage = error.message || 'خطا در ویرایش بازرس';
      snackbar(errorMessage, 'error', 5000);
      console.error('Edit expert error:', error);
    }
  };

  // Handle delete expert
  const handleDeleteExpert = expertId => {
    try {
      if (useMockData) {
        const updatedExperts = experts.filter(e => e.id !== expertId);
        if (setExperts) {
          setExperts(updatedExperts);
        }
        snackbar('بازرس با موفقیت حذف شد', 'success', 3000);
      } else {
        throw new Error('Real API not implemented in dev mode');
      }
    } catch (error) {
      const errorMessage = error.message || 'خطا در حذف بازرس';
      snackbar(errorMessage, 'error', 5000);
      console.error('Delete expert error:', error);
    }
  };

  // Handle select lead inspector
  const handleSelectLead = expertId => {
    try {
      if (useMockData) {
        const selectedExpert = experts.find(e => e.id === expertId);
        if (selectedExpert) {
          if (setLeadInfo) {
            setLeadInfo({
              id: selectedExpert.id,
              name: selectedExpert.name,
              family: selectedExpert.family,
              degree: selectedExpert.degree,
              personNumber: selectedExpert.personNumber,
              organizationUnitName: selectedExpert.unit,
            });
          }

          // Update the expert's position to lead
          const updatedExperts = experts.map(e =>
            e.id === expertId
              ? { ...e, position: 'رئیس هیئت بازرسی', isLead: true }
              : { ...e, isLead: false }
          );
          if (setExperts) {
            setExperts(updatedExperts);
          }

          setOpenLeadSelectionDialog(false);
          snackbar('رئیس هیئت بازرسی انتخاب شد', 'success', 3000);
        }
      } else {
        throw new Error('Real API not implemented in dev mode');
      }
    } catch (error) {
      const errorMessage = error.message || 'خطا در انتخاب رئیس هیئت';
      snackbar(errorMessage, 'error', 5000);
      console.error('Select lead error:', error);
    }
  };

  // Handle remove lead
  const handleRemoveLead = () => {
    try {
      if (useMockData) {
        if (setLeadInfo) {
          setLeadInfo(null);
        }
        const updatedExperts = experts.map(e => ({ ...e, isLead: false }));
        if (setExperts) {
          setExperts(updatedExperts);
        }
        snackbar('رئیس هیئت بازرسی حذف شد', 'info', 3000);
      }
    } catch (error) {
      const errorMessage = error.message || 'خطا در حذف رئیس هیئت';
      snackbar(errorMessage, 'error', 5000);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      family: '',
      degree: '',
      personNumber: '',
      unit: '',
      specialty: '',
      position: '',
    });
    setFormErrors({});
    setEditingExpert(null);
  };

  // Handle continue to next step
  const handleContinue = async () => {
    // Validate that at least one expert is added
    if (experts.length === 0) {
      snackbar('حداقل یک بازرس باید اضافه شود', 'warning', 5000);
      return;
    }

    // Validate that a lead inspector is selected
    if (!leadInfo) {
      snackbar('لطفاً رئیس هیئت بازرسی را انتخاب کنید', 'warning', 5000);
      return;
    }

    setIsSubmitting(true);

    try {
      if (useMockData) {
        const updatedData = {
          ...inspectionInformation,
          state: 'SODOR_ESTEHZARIYE',
          leadInspector: leadInfo,
          selectedExperts: experts,
        };

        if (setInspectionInformation) {
          setInspectionInformation(updatedData);
        }
        if (updateInspectionState) {
          updateInspectionState('SODOR_ESTEHZARIYE', {
            leadInspector: leadInfo,
            selectedExperts: experts,
          });
        }

        await refetchStep();
        onStepChange(2);
        snackbar('اطلاعات با موفقیت ذخیره شد', 'success', 3000);
      } else {
        throw new Error('Real API not implemented in dev mode');
      }
    } catch (error) {
      const errorMessage = error.message || 'خطا در ذخیره اطلاعات';
      snackbar(errorMessage, 'error', 5000);
      console.error('Step2 - Continue error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle back to previous step
  const handleBack = async () => {
    setIsSubmitting(true);

    try {
      if (useMockData) {
        const updatedData = {
          ...inspectionInformation,
          state: 'MOSHAKHASAT_ESTEHZARIYE',
        };

        if (setInspectionInformation) {
          setInspectionInformation(updatedData);
        }
        if (updateInspectionState) {
          updateInspectionState('MOSHAKHASAT_ESTEHZARIYE');
        }

        await refetchStep();
        onStepChange(0);
        snackbar('به مرحله قبل بازگشتید', 'success', 3000);
      } else {
        throw new Error('Real API not implemented in dev mode');
      }
    } catch (error) {
      const errorMessage = error.message || 'خطا در بازگشت';
      snackbar(errorMessage, 'error', 5000);
      console.error('Step2 - Back error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open edit dialog with expert data
  const openEditDialog = expert => {
    setEditingExpert(expert);
    setFormData({
      name: expert.name || '',
      family: expert.family || '',
      degree: expert.degree || '',
      personNumber: expert.personNumber || '',
      unit: expert.unit || expert.organizationUnitName || '',
      specialty: expert.specialty || expert.commonBaseDataFieldValue || '',
      position: expert.position || '',
    });
    setOpenEditExpertDialog(true);
  };

  if (currentStep !== 1) return null;

  return (
    <Box sx={{ p: 2 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          تخصص‌ها استحضاریه - انتخاب بازرسان
        </Typography>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          شناسه بازدید: {inspectionInformation?.provincialInspectionId}
        </Typography>

        <Alert severity="info" sx={{ my: 2 }}>
          <Typography variant="body2">
            در این مرحله بازرسان، یگان‌ها و تخصص‌های مورد نیاز را انتخاب کنید.
          </Typography>
          <Typography
            variant="caption"
            color="success.main"
            sx={{ mt: 1, display: 'block' }}
          >
            🔧 حالت توسعه - داده‌ها به صورت محلی ذخیره می‌شوند
          </Typography>
        </Alert>

        {/* Lead Inspector Section */}
        <Box sx={{ mt: 3, mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            رئیس هیئت بازرسی
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {leadInfo ? (
                <Card sx={{ bgcolor: '#e3f2fd', border: '2px solid #1976d2' }}>
                  <CardContent>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box>
                        <Typography variant="h6">
                          {leadInfo.degree} {leadInfo.name} {leadInfo.family}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          شماره پرسنلی: {leadInfo.personNumber} | یگان:{' '}
                          {leadInfo.organizationUnitName}
                        </Typography>
                        <Chip
                          label="رئیس هیئت بازرسی"
                          color="primary"
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      </Box>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={handleRemoveLead}
                        startIcon={<CancelIcon />}
                      >
                        حذف
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setOpenLeadSelectionDialog(true)}
                  startIcon={<PersonAddIcon />}
                  disabled={experts.length === 0}
                >
                  انتخاب رئیس هیئت بازرسی
                </Button>
              )}
              {experts.length === 0 && !leadInfo && (
                <Typography
                  variant="caption"
                  color="warning.main"
                  display="block"
                  sx={{ mt: 1 }}
                >
                  ⚠️ ابتدا بازرسان را اضافه کنید
                </Typography>
              )}
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Experts List */}
        <Box sx={{ mt: 3 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              لیست بازرسان ({experts.length})
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenAddExpertDialog(true)}
              startIcon={<AddIcon />}
            >
              افزودن بازرس
            </Button>
          </Stack>

          {experts.length === 0 ? (
            <Alert severity="info">
              هنوز بازرسی اضافه نشده است. برای شروع، دکمه "افزودن بازرس" را
              بزنید.
            </Alert>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell>ردیف</TableCell>
                    <TableCell>درجه</TableCell>
                    <TableCell>نام و نام خانوادگی</TableCell>
                    <TableCell>شماره پرسنلی</TableCell>
                    <TableCell>یگان</TableCell>
                    <TableCell>تخصص</TableCell>
                    <TableCell>موقعیت</TableCell>
                    <TableCell>وضعیت</TableCell>
                    <TableCell>عملیات</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {experts.map((expert, index) => (
                    <TableRow
                      key={expert.id}
                      sx={expert.isLead ? { bgcolor: '#e3f2fd' } : {}}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{expert.degree}</TableCell>
                      <TableCell>
                        {expert.name} {expert.family}
                        {expert.isLead && (
                          <Chip
                            label="رئیس"
                            color="primary"
                            size="small"
                            sx={{ mr: 1 }}
                          />
                        )}
                      </TableCell>
                      <TableCell>{expert.personNumber}</TableCell>
                      <TableCell>
                        {expert.unit || expert.organizationUnitName}
                      </TableCell>
                      <TableCell>
                        {expert.specialty || expert.commonBaseDataFieldValue}
                      </TableCell>
                      <TableCell>{expert.position || '---'}</TableCell>
                      <TableCell>
                        <Chip
                          label={
                            expert.assignStatus === 'accepted by inspect'
                              ? 'تایید شده'
                              : 'در انتظار'
                          }
                          color={
                            expert.assignStatus === 'accepted by inspect'
                              ? 'success'
                              : 'warning'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => openEditDialog(expert)}
                          title="ویرایش"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteExpert(expert.id)}
                          title="حذف"
                          disabled={expert.isLead}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="error"
            onClick={handleBack}
            disabled={isSubmitting}
          >
            مرحله قبل
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleContinue}
            disabled={isSubmitting || experts.length === 0 || !leadInfo}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'ثبت و ادامه'}
          </Button>
          {experts.length === 0 && (
            <Typography
              variant="caption"
              color="warning.main"
              sx={{ alignSelf: 'center' }}
            >
              ⚠️ حداقل یک بازرس اضافه کنید
            </Typography>
          )}
          {experts.length > 0 && !leadInfo && (
            <Typography
              variant="caption"
              color="warning.main"
              sx={{ alignSelf: 'center' }}
            >
              ⚠️ رئیس هیئت بازرسی را انتخاب کنید
            </Typography>
          )}
        </Box>

        {/* Add Expert Dialog */}
        <Dialog
          open={openAddExpertDialog}
          onClose={() => {
            setOpenAddExpertDialog(false);
            resetForm();
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>افزودن بازرس جدید</DialogTitle>
          <DialogContent>
            <Box
              sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="نام"
                    value={formData.name}
                    onChange={e =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    fullWidth
                    size="small"
                    error={!!formErrors.name}
                    helperText={formErrors.name}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="نام خانوادگی"
                    value={formData.family}
                    onChange={e =>
                      setFormData({ ...formData, family: e.target.value })
                    }
                    fullWidth
                    size="small"
                    error={!!formErrors.family}
                    helperText={formErrors.family}
                    required
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="درجه"
                    value={formData.degree}
                    onChange={e =>
                      setFormData({ ...formData, degree: e.target.value })
                    }
                    fullWidth
                    size="small"
                    error={!!formErrors.degree}
                    helperText={formErrors.degree}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="شماره پرسنلی"
                    value={formData.personNumber}
                    onChange={e =>
                      setFormData({ ...formData, personNumber: e.target.value })
                    }
                    fullWidth
                    size="small"
                    error={!!formErrors.personNumber}
                    helperText={formErrors.personNumber}
                    required
                  />
                </Grid>
              </Grid>

              <FormControl fullWidth size="small" required>
                <InputLabel>یگان</InputLabel>
                <Select
                  value={formData.unit}
                  onChange={e =>
                    setFormData({ ...formData, unit: e.target.value })
                  }
                  label="یگان"
                  error={!!formErrors.unit}
                >
                  {availableUnits.map(unit => (
                    <MenuItem key={unit.id} value={unit.name}>
                      {unit.name}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.unit && (
                  <Typography variant="caption" color="error">
                    {formErrors.unit}
                  </Typography>
                )}
              </FormControl>

              <FormControl fullWidth size="small" required>
                <InputLabel>تخصص</InputLabel>
                <Select
                  value={formData.specialty}
                  onChange={e =>
                    setFormData({ ...formData, specialty: e.target.value })
                  }
                  label="تخصص"
                  error={!!formErrors.specialty}
                >
                  {availableSpecialties.map(specialty => (
                    <MenuItem key={specialty.id} value={specialty.name}>
                      {specialty.name}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.specialty && (
                  <Typography variant="caption" color="error">
                    {formErrors.specialty}
                  </Typography>
                )}
              </FormControl>

              <TextField
                label="موقعیت در هیئت بازرسی"
                value={formData.position}
                onChange={e =>
                  setFormData({ ...formData, position: e.target.value })
                }
                fullWidth
                size="small"
                error={!!formErrors.position}
                helperText={formErrors.position}
                required
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setOpenAddExpertDialog(false);
                resetForm();
              }}
            >
              انصراف
            </Button>
            <Button
              onClick={handleAddExpert}
              variant="contained"
              color="primary"
            >
              افزودن
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Expert Dialog */}
        <Dialog
          open={openEditExpertDialog}
          onClose={() => {
            setOpenEditExpertDialog(false);
            resetForm();
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>ویرایش بازرس</DialogTitle>
          <DialogContent>
            <Box
              sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="نام"
                    value={formData.name}
                    onChange={e =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    fullWidth
                    size="small"
                    error={!!formErrors.name}
                    helperText={formErrors.name}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="نام خانوادگی"
                    value={formData.family}
                    onChange={e =>
                      setFormData({ ...formData, family: e.target.value })
                    }
                    fullWidth
                    size="small"
                    error={!!formErrors.family}
                    helperText={formErrors.family}
                    required
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="درجه"
                    value={formData.degree}
                    onChange={e =>
                      setFormData({ ...formData, degree: e.target.value })
                    }
                    fullWidth
                    size="small"
                    error={!!formErrors.degree}
                    helperText={formErrors.degree}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="شماره پرسنلی"
                    value={formData.personNumber}
                    onChange={e =>
                      setFormData({ ...formData, personNumber: e.target.value })
                    }
                    fullWidth
                    size="small"
                    error={!!formErrors.personNumber}
                    helperText={formErrors.personNumber}
                    required
                    disabled
                  />
                </Grid>
              </Grid>

              <FormControl fullWidth size="small" required>
                <InputLabel>یگان</InputLabel>
                <Select
                  value={formData.unit}
                  onChange={e =>
                    setFormData({ ...formData, unit: e.target.value })
                  }
                  label="یگان"
                  error={!!formErrors.unit}
                >
                  {availableUnits.map(unit => (
                    <MenuItem key={unit.id} value={unit.name}>
                      {unit.name}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.unit && (
                  <Typography variant="caption" color="error">
                    {formErrors.unit}
                  </Typography>
                )}
              </FormControl>

              <FormControl fullWidth size="small" required>
                <InputLabel>تخصص</InputLabel>
                <Select
                  value={formData.specialty}
                  onChange={e =>
                    setFormData({ ...formData, specialty: e.target.value })
                  }
                  label="تخصص"
                  error={!!formErrors.specialty}
                >
                  {availableSpecialties.map(specialty => (
                    <MenuItem key={specialty.id} value={specialty.name}>
                      {specialty.name}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.specialty && (
                  <Typography variant="caption" color="error">
                    {formErrors.specialty}
                  </Typography>
                )}
              </FormControl>

              <TextField
                label="موقعیت در هیئت بازرسی"
                value={formData.position}
                onChange={e =>
                  setFormData({ ...formData, position: e.target.value })
                }
                fullWidth
                size="small"
                error={!!formErrors.position}
                helperText={formErrors.position}
                required
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setOpenEditExpertDialog(false);
                resetForm();
              }}
            >
              انصراف
            </Button>
            <Button
              onClick={handleEditExpert}
              variant="contained"
              color="primary"
            >
              ویرایش
            </Button>
          </DialogActions>
        </Dialog>

        {/* Lead Selection Dialog */}
        <Dialog
          open={openLeadSelectionDialog}
          onClose={() => setOpenLeadSelectionDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>انتخاب رئیس هیئت بازرسی</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              لطفاً یکی از بازرسان را به عنوان رئیس هیئت بازرسی انتخاب کنید:
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell>ردیف</TableCell>
                    <TableCell>درجه</TableCell>
                    <TableCell>نام و نام خانوادگی</TableCell>
                    <TableCell>شماره پرسنلی</TableCell>
                    <TableCell>یگان</TableCell>
                    <TableCell>تخصص</TableCell>
                    <TableCell>عملیات</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {experts.map((expert, index) => (
                    <TableRow key={expert.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{expert.degree}</TableCell>
                      <TableCell>
                        {expert.name} {expert.family}
                      </TableCell>
                      <TableCell>{expert.personNumber}</TableCell>
                      <TableCell>
                        {expert.unit || expert.organizationUnitName}
                      </TableCell>
                      <TableCell>
                        {expert.specialty || expert.commonBaseDataFieldValue}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleSelectLead(expert.id)}
                          startIcon={<CheckCircleIcon />}
                        >
                          انتخاب
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenLeadSelectionDialog(false)}>
              بستن
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
};

export default StartInspectionStep2;
