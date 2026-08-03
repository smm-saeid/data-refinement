// import {
//   Box,
//   Button,
//   Grid,
//   Paper,
//   Typography,
//   CircularProgress,
//   Alert,
// } from '@mui/material';
// import moment from 'moment-jalaali';
// import MatnaDatePicker from '@/components/date-picker/MatnaDatePicker';
// import { dateDiff } from '@/modules/inspection-operation/scheduled/utils/utils';
// import { useEffect, useState } from 'react';
// import { useLegacyApi } from '@/hooks/useLegacyApi';
// import { useSnackbar } from '@/hooks/useSnackbar';

// // ==================== Constants ====================

// const SEASON_LABELS = {
//   first_season: 'سه‌ماهه اول (فروردین، اردیبهشت، خرداد)',
//   secound_season: 'سه‌ماهه دوم (تیر، مرداد، شهریور)',
//   third_season: 'سه‌ماهه سوم (مهر، آبان، آذر)',
//   fourth_season: 'سه‌ماهه چهارم (دی، بهمن، اسفند)',
// };

// const SEASON_MONTHS = {
//   first_season: [1, 2, 3],
//   secound_season: [4, 5, 6],
//   third_season: [7, 8, 9],
//   fourth_season: [10, 11, 12],
// };

// // ==================== Helper Functions ====================

// const getSeasonMonthRange = (season: string): number[] => {
//   return SEASON_MONTHS[season] || [];
// };

// const isMonthInSeason = (month: number, season: string): boolean => {
//   const validMonths = getSeasonMonthRange(season);
//   return validMonths.includes(month);
// };

// const getSeasonLabel = (season: string): string => {
//   return SEASON_LABELS[season] || season;
// };

// // ==================== Main Component ====================

// const StartInspectionStep1 = ({
//   inspectionInformation,
//   refetchStep,
//   onStepChange,
//   currentStep,
// }) => {
//   const legacyApi = useLegacyApi();
//   const snackbar = useSnackbar();

//   const [duration, setDuration] = useState({ from: null, to: null });
//   const [errors, setErrors] = useState({ start: '', end: '', season: '' });
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   console.log('Step1 - inspectionInformation:', {
//     id: inspectionInformation?.id,
//     provincialInspectionId: inspectionInformation?.provincialInspectionId,
//     state: inspectionInformation?.state,
//     season: inspectionInformation?.season,
//   });

//   // ==================== مقداردهی اولیه تاریخ‌ها ====================
//   useEffect(() => {
//     let fromDate = null;
//     let toDate = null;

//     if (inspectionInformation?.informationStartDate) {
//       const startDate = inspectionInformation.informationStartDate;
//       if (typeof startDate === 'string') {
//         fromDate = new Date(startDate);
//       } else if (startDate instanceof Date) {
//         fromDate = startDate;
//       }
//     }

//     if (inspectionInformation?.informationEndDate) {
//       const endDate = inspectionInformation.informationEndDate;
//       if (typeof endDate === 'string') {
//         toDate = new Date(endDate);
//       } else if (endDate instanceof Date) {
//         toDate = endDate;
//       }
//     }

//     setDuration({ from: fromDate, to: toDate });
//   }, [inspectionInformation]);

//   // ==================== اعتبارسنجی تاریخ در سه‌ماهه ====================
//   const validateDatesInSeason = (
//     fromDate: Date,
//     toDate: Date,
//     season: string
//   ) => {
//     if (!season) {
//       // اگر سه‌ماهه مشخص نشده، اعتبارسنجی نمی‌کنیم
//       return { isValid: true, error: '' };
//     }

//     const fromMonth = moment(fromDate).jMonth() + 1; // تبدیل به عدد 1-12
//     const toMonth = moment(toDate).jMonth() + 1;

//     const validMonths = getSeasonMonthRange(season);

//     // بررسی اینکه ماه شروع در سه‌ماهه باشد
//     if (!validMonths.includes(fromMonth)) {
//       return {
//         isValid: false,
//         error: `تاریخ شروع (${moment(fromDate).format('jYYYY/jMM/jDD')}) باید در بازه ${getSeasonLabel(season)} باشد`,
//       };
//     }

//     // بررسی اینکه ماه پایان در سه‌ماهه باشد
//     if (!validMonths.includes(toMonth)) {
//       return {
//         isValid: false,
//         error: `تاریخ پایان (${moment(toDate).format('jYYYY/jMM/jDD')}) باید در بازه ${getSeasonLabel(season)} باشد`,
//       };
//     }

//     return { isValid: true, error: '' };
//   };

//   // ==================== اعتبارسنجی کامل ====================
//   const validateDates = () => {
//     let isValid = true;
//     const newErrors = { start: '', end: '', season: '' };

//     // بررسی وجود تاریخ شروع
//     if (!duration.from) {
//       newErrors.start = 'تاریخ شروع را انتخاب کنید';
//       snackbar('تاریخ شروع را انتخاب کنید', 'error', 3000);
//       isValid = false;
//     }

//     // بررسی وجود تاریخ پایان
//     if (!duration.to) {
//       newErrors.end = 'تاریخ پایان را انتخاب کنید';
//       snackbar('تاریخ پایان را انتخاب کنید', 'error', 3000);
//       isValid = false;
//     }

//     // بررسی اینکه تاریخ شروع از پایان بزرگتر نباشد
//     if (duration.from && duration.to && duration.from > duration.to) {
//       newErrors.end = 'تاریخ پایان نباید از تاریخ شروع زودتر باشد';
//       snackbar('تاریخ پایان نباید از تاریخ شروع زودتر باشد', 'error', 3000);
//       isValid = false;
//     }

//     // بررسی اینکه تاریخ‌ها در سه‌ماهه صحیح باشند
//     if (duration.from && duration.to && inspectionInformation?.season) {
//       const seasonValidation = validateDatesInSeason(
//         duration.from,
//         duration.to,
//         inspectionInformation.season
//       );

//       if (!seasonValidation.isValid) {
//         newErrors.season = seasonValidation.error;
//         snackbar(seasonValidation.error, 'error', 5000);
//         isValid = false;
//       }
//     }

//     setErrors(newErrors);
//     return isValid;
//   };

//   // ==================== بررسی اینکه تاریخ در سه‌ماهه است ====================
//   const isDateInSeason = (date: Date, season: string): boolean => {
//     if (!date || !season) return true;
//     const month = moment(date).jMonth() + 1;
//     const validMonths = getSeasonMonthRange(season);
//     return validMonths.includes(month);
//   };

//   // ==================== تابع ثبت ====================
//   const handleSubmit = async () => {
//     if (!validateDates()) return;

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
//       informationStartDate: duration.from,
//       informationEndDate: duration.to,
//       state: 'TAKHASOS_ESTEHZARIYE',
//       issuanceInformation: null,
//       issuanceInstruction: null,
//     };

//     console.log('Step1 - Submitting payload:', payload);

//     try {
//       const response = await legacyApi.put('/information', payload);
//       console.log('Step1 - API response:', response);

//       if (response?.status === 200 || response?.data) {
//         snackbar('اطلاعات با موفقیت ذخیره شد', 'success', 3000);
//         await refetchStep();
//         onStepChange(1);
//       } else {
//         throw new Error('خطا در ذخیره اطلاعات');
//       }
//     } catch (error) {
//       console.error('Step1 - Error:', error);
//       snackbar('خطا در ذخیره اطلاعات', 'error', 3000);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // ==================== رندر ====================
//   if (currentStep !== 0) return null;

//   const season = inspectionInformation?.season;
//   const seasonLabel = season ? getSeasonLabel(season) : 'نامشخص';

//   return (
//     <Box sx={{ width: '100%', p: 2 }}>
//       <Paper sx={{ p: 3 }}>
//         <Typography variant="h6" gutterBottom>
//           مشخصات استحضاریه
//         </Typography>

//         <Typography variant="body2" color="text.secondary" gutterBottom>
//           شناسه بازدید: {inspectionInformation?.provincialInspectionId}
//         </Typography>

//         {/* نمایش سه‌ماهه انتخابی */}
//         <Alert severity="info" sx={{ my: 2 }}>
//           <Typography variant="body2">
//             <strong>سه‌ماهه تعیین شده برای این استان:</strong> {seasonLabel}
//             {season && (
//               <span
//                 style={{ display: 'block', fontSize: '0.8rem', marginTop: 4 }}
//               >
//                 محدوده ماه‌ها: {getSeasonMonthRange(season).join('، ')}
//               </span>
//             )}
//           </Typography>
//         </Alert>

//         {/* نمایش خطای سه‌ماهه */}
//         {errors.season && (
//           <Alert severity="error" sx={{ mb: 2 }}>
//             {errors.season}
//           </Alert>
//         )}

//         <Grid container spacing={3} sx={{ mt: 1 }}>
//           <Grid>
//             <Typography>شروع بازه:</Typography>
//             <MatnaDatePicker
//               onChange={value => {
//                 let newFrom = null;
//                 if (value && typeof value === 'string') {
//                   newFrom = new Date(value);
//                 } else if (value instanceof Date) {
//                   newFrom = value;
//                 }

//                 setDuration({ ...duration, from: newFrom });
//                 setErrors({ start: '', end: '', season: '' });

//                 // اگر تاریخ شروع انتخاب شد و تاریخ پایان هم وجود دارد، اعتبارسنجی سه‌ماهه
//                 if (newFrom && duration.to && season) {
//                   const validation = validateDatesInSeason(
//                     newFrom,
//                     duration.to,
//                     season
//                   );
//                   if (!validation.isValid) {
//                     setErrors(prev => ({ ...prev, season: validation.error }));
//                   }
//                 }
//               }}
//               value={duration.from}
//               placeholder="تاریخ شروع"
//               error={errors.start || errors.season}
//             />
//             {duration.from && season && (
//               <Typography
//                 variant="caption"
//                 color={
//                   isDateInSeason(duration.from, season)
//                     ? 'success.main'
//                     : 'error.main'
//                 }
//               >
//                 {isDateInSeason(duration.from, season)
//                   ? '✅ در محدوده سه‌ماهه'
//                   : '❌ خارج از محدوده سه‌ماهه'}
//               </Typography>
//             )}
//           </Grid>
//           <Grid>
//             <Typography>اتمام بازه:</Typography>
//             <MatnaDatePicker
//               onChange={value => {
//                 let newTo = null;
//                 if (value && typeof value === 'string') {
//                   newTo = new Date(value);
//                 } else if (value instanceof Date) {
//                   newTo = value;
//                 }

//                 setDuration({ ...duration, to: newTo });
//                 setErrors({ start: '', end: '', season: '' });

//                 // اگر تاریخ پایان انتخاب شد و تاریخ شروع هم وجود دارد، اعتبارسنجی سه‌ماهه
//                 if (duration.from && newTo && season) {
//                   const validation = validateDatesInSeason(
//                     duration.from,
//                     newTo,
//                     season
//                   );
//                   if (!validation.isValid) {
//                     setErrors(prev => ({ ...prev, season: validation.error }));
//                   }
//                 }
//               }}
//               value={duration.to}
//               placeholder="تاریخ پایان"
//               error={errors.end || errors.season}
//             />
//             {duration.to && season && (
//               <Typography
//                 variant="caption"
//                 color={
//                   isDateInSeason(duration.to, season)
//                     ? 'success.main'
//                     : 'error.main'
//                 }
//               >
//                 {isDateInSeason(duration.to, season)
//                   ? '✅ در محدوده سه‌ماهه'
//                   : '❌ خارج از محدوده سه‌ماهه'}
//               </Typography>
//             )}
//           </Grid>
//         </Grid>

//         {duration.from && duration.to && (
//           <Box sx={{ mt: 2 }}>
//             <Typography>
//               مدت زمان: {dateDiff(duration.from, duration.to)} روز
//             </Typography>
//             {season && (
//               <Typography variant="body2" color="text.secondary">
//                 محدوده مجاز: {getSeasonLabel(season)}
//               </Typography>
//             )}
//           </Box>
//         )}

//         <Box sx={{ mt: 3 }}>
//           <Button
//             variant="contained"
//             onClick={handleSubmit}
//             disabled={isSubmitting || !!errors.season}
//           >
//             {isSubmitting ? <CircularProgress size={24} /> : 'ثبت و ادامه'}
//           </Button>
//         </Box>
//       </Paper>
//     </Box>
//   );
// };

// export default StartInspectionStep1;
import {
  Box,
  Button,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import moment from 'moment-jalaali';
import MatnaDatePicker from '@/components/date-picker/MatnaDatePicker';
import { dateDiff } from '@/modules/inspection-operation/scheduled/utils/utils';
import { useEffect, useState } from 'react';

const SEASON_LABELS = {
  first_season: 'سه‌ماهه اول (فروردین، اردیبهشت، خرداد)',
  secound_season: 'سه‌ماهه دوم (تیر، مرداد، شهریور)',
  third_season: 'سه‌ماهه سوم (مهر، آبان، آذر)',
  fourth_season: 'سه‌ماهه چهارم (دی، بهمن، اسفند)',
};

const SEASON_MONTHS = {
  first_season: [1, 2, 3],
  secound_season: [4, 5, 6],
  third_season: [7, 8, 9],
  fourth_season: [10, 11, 12],
};

const getSeasonMonthRange = (season: string): number[] => {
  return SEASON_MONTHS[season] || [];
};

const isMonthInSeason = (month: number, season: string): boolean => {
  const validMonths = getSeasonMonthRange(season);
  return validMonths.includes(month);
};

const getSeasonLabel = (season: string): string => {
  return SEASON_LABELS[season] || season;
};

const StartInspectionStep1 = ({
  inspectionInformation,
  setInspectionInformation,
  refetchStep,
  onStepChange,
  currentStep,
  useMockData = true,
  updateInspectionState,
  snackbar,
}) => {
  const [duration, setDuration] = useState({ from: null, to: null });
  const [errors, setErrors] = useState({ start: '', end: '', season: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState(null);

  console.log('Step1 - inspectionInformation:', {
    id: inspectionInformation?.id,
    state: inspectionInformation?.state,
    season: inspectionInformation?.season,
  });

  useEffect(() => {
    try {
      let fromDate = null;
      let toDate = null;

      if (inspectionInformation?.informationStartDate) {
        const startDate = inspectionInformation.informationStartDate;
        if (typeof startDate === 'string') {
          fromDate = new Date(startDate);
        } else if (startDate instanceof Date) {
          fromDate = startDate;
        }
      }

      if (inspectionInformation?.informationEndDate) {
        const endDate = inspectionInformation.informationEndDate;
        if (typeof endDate === 'string') {
          toDate = new Date(endDate);
        } else if (endDate instanceof Date) {
          toDate = endDate;
        }
      }

      setDuration({ from: fromDate, to: toDate });
    } catch (error) {
      const errorMessage = 'خطا در بارگذاری تاریخ‌ها';
      setLocalError(errorMessage);
      if (snackbar) {
        snackbar(errorMessage, 'error', 5000);
      }
      console.error('Date loading error:', error);
    }
  }, [inspectionInformation, snackbar]);

  const validateDatesInSeason = (
    fromDate: Date,
    toDate: Date,
    season: string
  ) => {
    try {
      if (!season) {
        return { isValid: true, error: '' };
      }

      const fromMonth = moment(fromDate).jMonth() + 1;
      const toMonth = moment(toDate).jMonth() + 1;
      const validMonths = getSeasonMonthRange(season);

      if (!validMonths.includes(fromMonth)) {
        return {
          isValid: false,
          error: `تاریخ شروع (${moment(fromDate).format('jYYYY/jMM/jDD')}) باید در بازه ${getSeasonLabel(season)} باشد`,
        };
      }

      if (!validMonths.includes(toMonth)) {
        return {
          isValid: false,
          error: `تاریخ پایان (${moment(toDate).format('jYYYY/jMM/jDD')}) باید در بازه ${getSeasonLabel(season)} باشد`,
        };
      }

      return { isValid: true, error: '' };
    } catch (error) {
      const errorMessage = 'خطا در اعتبارسنجی تاریخ در سه‌ماهه';
      if (snackbar) {
        snackbar(errorMessage, 'error', 5000);
      }
      return { isValid: false, error: errorMessage };
    }
  };

  const validateDates = () => {
    try {
      let isValid = true;
      const newErrors = { start: '', end: '', season: '' };

      if (!duration.from) {
        newErrors.start = 'تاریخ شروع را انتخاب کنید';
        if (snackbar) snackbar('تاریخ شروع را انتخاب کنید', 'error', 3000);
        isValid = false;
      }

      if (!duration.to) {
        newErrors.end = 'تاریخ پایان را انتخاب کنید';
        if (snackbar) snackbar('تاریخ پایان را انتخاب کنید', 'error', 3000);
        isValid = false;
      }

      if (duration.from && duration.to && duration.from > duration.to) {
        newErrors.end = 'تاریخ پایان نباید از تاریخ شروع زودتر باشد';
        if (snackbar)
          snackbar('تاریخ پایان نباید از تاریخ شروع زودتر باشد', 'error', 3000);
        isValid = false;
      }

      if (duration.from && duration.to && inspectionInformation?.season) {
        const seasonValidation = validateDatesInSeason(
          duration.from,
          duration.to,
          inspectionInformation.season
        );

        if (!seasonValidation.isValid) {
          newErrors.season = seasonValidation.error;
          if (snackbar) snackbar(seasonValidation.error, 'error', 5000);
          isValid = false;
        }
      }

      setErrors(newErrors);
      return isValid;
    } catch (error) {
      const errorMessage = 'خطا در اعتبارسنجی تاریخ‌ها';
      if (snackbar) snackbar(errorMessage, 'error', 5000);
      console.error('Validation error:', error);
      return false;
    }
  };

  const isDateInSeason = (date: Date, season: string): boolean => {
    if (!date || !season) return true;
    try {
      const month = moment(date).jMonth() + 1;
      const validMonths = getSeasonMonthRange(season);
      return validMonths.includes(month);
    } catch (error) {
      console.error('Date in season check error:', error);
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validateDates()) return;

    setIsSubmitting(true);
    setLocalError(null);

    try {
      const updatedData = {
        ...inspectionInformation,
        informationStartDate: duration.from,
        informationEndDate: duration.to,
        state: 'TAKHASOS_ESTEHZARIYE',
      };

      if (useMockData) {
        console.log('Step1 - Mock saving data:', updatedData);
        await new Promise(resolve => setTimeout(resolve, 500));

        if (setInspectionInformation) {
          setInspectionInformation(updatedData);
        }
        if (updateInspectionState) {
          updateInspectionState('TAKHASOS_ESTEHZARIYE', {
            informationStartDate: duration.from,
            informationEndDate: duration.to,
          });
        }

        if (snackbar) {
          snackbar('اطلاعات با موفقیت ذخیره شد', 'success', 3000);
        }
        await refetchStep();
        onStepChange(1);
      } else {
        throw new Error('Real API not implemented in dev mode');
      }
    } catch (error) {
      const errorMessage = error.message || 'خطا در ذخیره اطلاعات';
      setLocalError(errorMessage);
      if (snackbar) {
        snackbar(errorMessage, 'error', 5000);
      }
      console.error('Step1 - Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (currentStep !== 0) return null;

  const season = inspectionInformation?.season;
  const seasonLabel = season ? getSeasonLabel(season) : 'نامشخص';

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          مشخصات استحضاریه
        </Typography>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          شناسه بازدید: {inspectionInformation?.provincialInspectionId}
        </Typography>

        {localError && (
          <Alert severity="error" sx={{ my: 2 }}>
            {localError}
          </Alert>
        )}

        <Alert severity="info" sx={{ my: 2 }}>
          <Typography variant="body2">
            <strong>سه‌ماهه تعیین شده برای این استان:</strong> {seasonLabel}
            {season && (
              <span
                style={{ display: 'block', fontSize: '0.8rem', marginTop: 4 }}
              >
                محدوده ماه‌ها: {getSeasonMonthRange(season).join('، ')}
              </span>
            )}
          </Typography>
          <Typography
            variant="caption"
            color="success.main"
            sx={{ mt: 1, display: 'block' }}
          >
            🔧 حالت توسعه - داده‌ها به صورت محلی ذخیره می‌شوند
          </Typography>
        </Alert>

        {errors.season && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.season}
          </Alert>
        )}

        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <Typography>شروع بازه:</Typography>
            <MatnaDatePicker
              onChange={value => {
                try {
                  let newFrom = null;
                  if (value && typeof value === 'string') {
                    newFrom = new Date(value);
                  } else if (value instanceof Date) {
                    newFrom = value;
                  }

                  setDuration({ ...duration, from: newFrom });
                  setErrors({ start: '', end: '', season: '' });

                  if (newFrom && duration.to && season) {
                    const validation = validateDatesInSeason(
                      newFrom,
                      duration.to,
                      season
                    );
                    if (!validation.isValid) {
                      setErrors(prev => ({
                        ...prev,
                        season: validation.error,
                      }));
                    }
                  }
                } catch (error) {
                  const errorMessage = 'خطا در انتخاب تاریخ شروع';
                  if (snackbar) snackbar(errorMessage, 'error', 3000);
                  console.error('Date picker error:', error);
                }
              }}
              value={duration.from}
              placeholder="تاریخ شروع"
              error={!!errors.start || !!errors.season}
            />
            {duration.from && season && (
              <Typography
                variant="caption"
                color={
                  isDateInSeason(duration.from, season)
                    ? 'success.main'
                    : 'error.main'
                }
              >
                {isDateInSeason(duration.from, season)
                  ? '✅ در محدوده سه‌ماهه'
                  : '❌ خارج از محدوده سه‌ماهه'}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography>اتمام بازه:</Typography>
            <MatnaDatePicker
              onChange={value => {
                try {
                  let newTo = null;
                  if (value && typeof value === 'string') {
                    newTo = new Date(value);
                  } else if (value instanceof Date) {
                    newTo = value;
                  }

                  setDuration({ ...duration, to: newTo });
                  setErrors({ start: '', end: '', season: '' });

                  if (duration.from && newTo && season) {
                    const validation = validateDatesInSeason(
                      duration.from,
                      newTo,
                      season
                    );
                    if (!validation.isValid) {
                      setErrors(prev => ({
                        ...prev,
                        season: validation.error,
                      }));
                    }
                  }
                } catch (error) {
                  const errorMessage = 'خطا در انتخاب تاریخ پایان';
                  if (snackbar) snackbar(errorMessage, 'error', 3000);
                  console.error('Date picker error:', error);
                }
              }}
              value={duration.to}
              placeholder="تاریخ پایان"
              error={!!errors.end || !!errors.season}
            />
            {duration.to && season && (
              <Typography
                variant="caption"
                color={
                  isDateInSeason(duration.to, season)
                    ? 'success.main'
                    : 'error.main'
                }
              >
                {isDateInSeason(duration.to, season)
                  ? '✅ در محدوده سه‌ماهه'
                  : '❌ خارج از محدوده سه‌ماهه'}
              </Typography>
            )}
          </Grid>
        </Grid>

        {duration.from && duration.to && (
          <Box sx={{ mt: 2 }}>
            <Typography>
              مدت زمان: {dateDiff(duration.from, duration.to)} روز
            </Typography>
            {season && (
              <Typography variant="body2" color="text.secondary">
                محدوده مجاز: {getSeasonLabel(season)}
              </Typography>
            )}
          </Box>
        )}

        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting || !!errors.season}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'ثبت و ادامه'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default StartInspectionStep1;
