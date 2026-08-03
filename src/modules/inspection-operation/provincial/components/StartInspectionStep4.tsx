// import {
//   Box,
//   Button,
//   Grid,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Typography,
// } from '@mui/material';

// import { useLegacyApi } from '@/hooks/useLegacyApi.ts';
// import { useMutation, useQuery } from '@tanstack/react-query';

// const StartInspectionStep4 = ({ inspectionInformation, refetchStep }: any) => {

//   const legacyApi = useLegacyApi();

//   const { data: experts } = useQuery<any, any, any>({
//     queryKey: [
//       `/person-speciality/find-by-inspection?pageSize=1000&currentPage=1&inspectionId=${inspectionInformation.inspectionId}`,
//     ],
//     queryFn: () =>
//       legacyApi.get(
//         `/person-speciality/find-by-inspection?pageSize=1000&currentPage=1&inspectionId=${inspectionInformation.inspectionId}`
//       ),
//     select: (res: any) => {
//       return res?.data?.rows;
//     },
//   } as any);

//   const { mutate } = useMutation({
//     mutationFn: legacyApi.request,
//   });

//   function AssignStatusFunction(assignStatus: any) {
//     switch (assignStatus) {
//       case 'pending':
//         return 'در انتظار یگان';
//       case 'accepted':
//         return 'تایید شده توسط یگان';
//       case 'rejected':
//         return 'توسط یگان رد شده';
//       case 'rejection by inspect':
//         return 'توسط بازرسی رد شده';
//       case 'accepted by inspect':
//         return 'تایید نهایی شده';
//       default:
//         return 'وضعیت نامشخص'
//     }
//   }

//   const isNextButtonDisable = experts?.find((e) => e.assignStatus != "accepted by inspect" || e.personNumber == null || e.personNumber == "")

//   return (
//     <>
//       {(experts != null && experts.length > 0) ? (
//         <TableContainer component={Paper}>
//           <Table
//             aria-label="simple table"
//             sx={{
//               minWidth: 650,
//               '& td': {
//                 padding: '10px !important',
//               },
//             }}
//           >
//             <TableHead>
//               <TableRow>
//                 <TableCell>نام تخصص</TableCell>
//                 <TableCell>یگان</TableCell>
//                 <TableCell>درجه</TableCell>
//                 <TableCell>نام بازرس</TableCell>
//                 <TableCell>وضعیت</TableCell>
//                 <TableCell></TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {experts.map((skill_data: any, index: any) => {
//                 return (
//                   <TableRow key={index}>
//                     <TableCell>{skill_data?.commonBaseDataFieldValue}</TableCell>
//                     <TableCell>{skill_data?.organizationUnitName}</TableCell>
//                     <TableCell>{skill_data?.degree}</TableCell>
//                     <TableCell>{(skill_data?.name ?? "" ) + " " + (skill_data?.family ?? "" )}</TableCell>
//                     <TableCell>
//                       {skill_data?.assignStatus == 'assigned' ? (
//                         <Typography variant="body2">
//                           <Button onClick={() => {}}>
//                             {(skill_data?.personInfoName ?? '') +
//                               ' ' +
//                               (skill_data?.personInfoFamily ?? '') +
//                               ` (${skill_data?.personInfoPersonNumber})`}
//                           </Button>
//                         </Typography>
//                       ) : (
//                         <Typography variant="body2">
//                           {skill_data?.personNumber ? AssignStatusFunction(skill_data?.assignStatus) : "در انتظار اختصاص بازرس"}
//                         </Typography>
//                       )}
//                     </TableCell>
//                     <TableCell>
//                       {skill_data?.assignStatus == 'assigned' ? (
//                         <Grid
//                           container
//                           spacing={2}
//                           display={'flex'}
//                           justifyContent={'center'}
//                           alignItems={'center'}
//                         >
//                           <Grid>
//                             <Button
//                               variant="contained"
//                               color={'error'}
//                               onClick={() => {
//                               }}
//                             >
//                               <Typography variant="body2">عدم تایید</Typography>
//                             </Button>
//                           </Grid>
//                           <Grid>
//                             <Button
//                               variant="contained"
//                               color={'success'}
//                               onClick={() => {

//                               }}
//                             >
//                               <Typography variant="body2">
//                                 تایید بازرس
//                               </Typography>
//                             </Button>
//                           </Grid>
//                         </Grid>
//                       ) : !!skill_data.accepted ? (
//                         <Typography variant="body2" color={'green'}>
//                           تایید شده
//                         </Typography>
//                       ) : null}
//                     </TableCell>
//                   </TableRow>
//                 );
//               })}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       ) : null}
//       <Box margin={'50px'}>
//         <Grid container>
//           <Grid size={{ xs: 8 }}>
//             <Button
//               variant="contained"
//               color="error"
//               // disabled
//               onClick={() => {
//                 mutate(
//                   {
//                     entity: `/information`,
//                     method: 'put',
//                     data: {
//                       ...inspectionInformation,
//                       state: "SODOR_ESTEHZARIYE",
//                     },
//                   } as any,
//                   {
//                     onSuccess: (_: any) => {
//                       refetchStep();
//                     },
//                     onError: () => {},
//                   }
//                 );
//               }}
//               sx={{ margin: '10px' }}
//             >
//               مرحله قبل
//             </Button>

//             <Button
//               variant={'contained'}
//               // disabled={isNextButtonDisable}
//               onClick={() => {
//                 mutate(
//                   {
//                     entity: `/information`,
//                     method: 'put',
//                     data: {
//                       ...inspectionInformation,
//                       state: "EKHTESAS_BAZBINEH",
//                     },
//                   } as any,
//                   {
//                     onSuccess: (_: any) => {
//                       refetchStep();
//                     },
//                     onError: () => {},
//                   }
//                 );
//               }}
//               sx={{ margin: '10px' }}
//             >
//               ثبت و ادامه {"(در انتظار تایید بازرسان)"}
//             </Button>
//           </Grid>
//         </Grid>
//       </Box>
//     </>
//   );
// };

// export default StartInspectionStep4;
import {
  Box,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Alert,
} from '@mui/material';
import { useState } from 'react';
import { useSnackbar } from '@/hooks/useSnackbar';

const StartInspectionStep4 = ({
  inspectionInformation,
  setInspectionInformation,
  refetchStep,
  onStepChange,
  currentStep,
  useMockData = true,
  updateInspectionState,
  experts = [],
  setExperts,
}) => {
  const snackbar = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  function AssignStatusFunction(assignStatus: any) {
    switch (assignStatus) {
      case 'pending':
        return 'در انتظار یگان';
      case 'accepted':
        return 'تایید شده توسط یگان';
      case 'rejected':
        return 'توسط یگان رد شده';
      case 'rejection by inspect':
        return 'توسط بازرسی رد شده';
      case 'accepted by inspect':
        return 'تایید نهایی شده';
      case 'assigned':
        return 'اختصاص داده شده';
      default:
        return 'وضعیت نامشخص';
    }
  }

  // Mock accept/reject functions (optional - برای نمایش)
  const handleAcceptExpert = expertId => {
    if (!useMockData) {
      snackbar('این قابلیت فقط در حالت توسعه فعال است', 'info', 3000);
      return;
    }

    try {
      const updatedExperts = experts.map(e => {
        if (e.id === expertId) {
          return { ...e, assignStatus: 'accepted by inspect' };
        }
        return e;
      });

      if (setExperts) {
        setExperts(updatedExperts);
      }
      snackbar('بازرس تایید شد', 'success', 3000);
    } catch (error) {
      const errorMessage = error.message || 'خطا در تایید بازرس';
      setError(errorMessage);
      snackbar(errorMessage, 'error', 3000);
      console.error('Accept expert error:', error);
    }
  };

  const handleRejectExpert = expertId => {
    if (!useMockData) {
      snackbar('این قابلیت فقط در حالت توسعه فعال است', 'info', 3000);
      return;
    }

    try {
      const updatedExperts = experts.map(e => {
        if (e.id === expertId) {
          return { ...e, assignStatus: 'rejection by inspect' };
        }
        return e;
      });

      if (setExperts) {
        setExperts(updatedExperts);
      }
      snackbar('بازرس رد شد', 'warning', 3000);
    } catch (error) {
      const errorMessage = error.message || 'خطا در رد بازرس';
      setError(errorMessage);
      snackbar(errorMessage, 'error', 3000);
      console.error('Reject expert error:', error);
    }
  };

  const handleBack = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      if (useMockData) {
        const updatedData = {
          ...inspectionInformation,
          state: 'SODOR_ESTEHZARIYE',
        };

        if (setInspectionInformation) {
          setInspectionInformation(updatedData);
        }
        if (updateInspectionState) {
          updateInspectionState('SODOR_ESTEHZARIYE');
        }

        await refetchStep();
        onStepChange(2);
        snackbar('به مرحله قبل بازگشتید', 'success', 3000);
      } else {
        throw new Error('Real API not implemented in dev mode');
      }
    } catch (error) {
      const errorMessage = error.message || 'خطا در بازگشت';
      setError(errorMessage);
      snackbar(errorMessage, 'error', 3000);
      console.error('Back error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinue = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      if (useMockData) {
        // به روز رسانی وضعیت همه بازرسان به "accepted by inspect" به صورت خودکار
        const updatedExperts = experts.map(e => ({
          ...e,
          assignStatus: 'accepted by inspect',
        }));

        if (setExperts) {
          setExperts(updatedExperts);
        }

        const updatedData = {
          ...inspectionInformation,
          state: 'EKHTESAS_BAZBINEH',
        };

        if (setInspectionInformation) {
          setInspectionInformation(updatedData);
        }
        if (updateInspectionState) {
          updateInspectionState('EKHTESAS_BAZBINEH');
        }

        await refetchStep();
        onStepChange(4);
        snackbar('به مرحله بعد رفتید', 'success', 3000);
      } else {
        throw new Error('Real API not implemented in dev mode');
      }
    } catch (error) {
      const errorMessage = error.message || 'خطا در ادامه';
      setError(errorMessage);
      snackbar(errorMessage, 'error', 3000);
      console.error('Continue error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (currentStep !== 3) return null;

  const hasNoExperts = !experts || experts.length === 0;

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
      )}

      <Alert severity="info" sx={{ m: 2 }}>
        <Typography variant="caption" color="success.main">
          🔧 حالت توسعه - برای ادامه نیازی به تایید بازرسان نیست
        </Typography>
        <Typography
          variant="caption"
          display="block"
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          تعداد بازرسان: {experts?.length || 0}
        </Typography>
      </Alert>

      {hasNoExperts ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography>هیچ بازرسی تعیین نشده است</Typography>
          <Typography variant="caption" color="text.secondary">
            برای تست می‌توانید از داده‌های mock استفاده کنید
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table
            aria-label="simple table"
            sx={{
              minWidth: 650,
              '& td': {
                padding: '10px !important',
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>نام تخصص</TableCell>
                <TableCell>یگان</TableCell>
                <TableCell>درجه</TableCell>
                <TableCell>نام بازرس</TableCell>
                <TableCell>وضعیت</TableCell>
                <TableCell>عملیات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {experts.map((skill_data: any, index: any) => {
                const isAccepted =
                  skill_data?.assignStatus === 'accepted by inspect';
                const isPending =
                  skill_data?.assignStatus === 'assigned' ||
                  !skill_data?.assignStatus;

                return (
                  <TableRow key={index}>
                    <TableCell>
                      {skill_data?.commonBaseDataFieldValue ||
                        skill_data?.specialty ||
                        '---'}
                    </TableCell>
                    <TableCell>
                      {skill_data?.organizationUnitName ||
                        skill_data?.unit ||
                        '---'}
                    </TableCell>
                    <TableCell>{skill_data?.degree || '---'}</TableCell>
                    <TableCell>
                      {(skill_data?.name ?? '') +
                        ' ' +
                        (skill_data?.family ?? '')}
                      {skill_data?.personNumber && (
                        <Typography
                          variant="caption"
                          display="block"
                          color="text.secondary"
                        >
                          کد: {skill_data.personNumber}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        color={
                          isAccepted
                            ? 'success.main'
                            : isPending
                              ? 'warning.main'
                              : 'error.main'
                        }
                      >
                        {AssignStatusFunction(skill_data?.assignStatus)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Grid
                        container
                        spacing={1}
                        display={'flex'}
                        justifyContent={'center'}
                      >
                        {isPending && (
                          <>
                            <Grid>
                              <Button
                                variant="contained"
                                color={'error'}
                                size="small"
                                onClick={() =>
                                  handleRejectExpert(skill_data.id)
                                }
                                disabled={!useMockData}
                              >
                                رد
                              </Button>
                            </Grid>
                            <Grid>
                              <Button
                                variant="contained"
                                color={'success'}
                                size="small"
                                onClick={() =>
                                  handleAcceptExpert(skill_data.id)
                                }
                                disabled={!useMockData}
                              >
                                تایید
                              </Button>
                            </Grid>
                          </>
                        )}
                        {isAccepted && (
                          <Typography variant="body2" color="success.main">
                            ✅ تایید شده
                          </Typography>
                        )}
                        {skill_data?.assignStatus === 'rejected' && (
                          <Typography variant="body2" color="error.main">
                            ❌ رد شده
                          </Typography>
                        )}
                        {skill_data?.assignStatus ===
                          'rejection by inspect' && (
                          <Typography variant="body2" color="error.main">
                            ❌ رد شده توسط بازرسی
                          </Typography>
                        )}
                      </Grid>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Box margin={'50px'}>
        <Grid container>
          <Grid size={{ xs: 8 }}>
            <Button
              variant="contained"
              color="error"
              onClick={handleBack}
              sx={{ margin: '10px' }}
              disabled={isSubmitting}
            >
              مرحله قبل
            </Button>

            <Button
              variant={'contained'}
              onClick={handleContinue}
              sx={{ margin: '10px' }}
              disabled={isSubmitting || hasNoExperts}
            >
              {isSubmitting
                ? 'در حال پردازش...'
                : 'ثبت و ادامه (بدون نیاز به تایید)'}
            </Button>

            {!hasNoExperts && (
              <Typography
                variant="caption"
                color="info.main"
                sx={{ display: 'block', mt: 1 }}
              >
                💡 توجه: در حالت توسعه، نیازی به تایید بازرسان نیست و به صورت
                خودکار تایید می‌شوند
              </Typography>
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default StartInspectionStep4;
