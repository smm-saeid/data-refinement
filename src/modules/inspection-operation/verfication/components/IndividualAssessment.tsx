import { Check } from '@mui/icons-material';
import {
  Autocomplete,
  Alert,
  Grid,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
} from '@mui/material';
import ConfirmBox from '@/components/confirm-box/ConfirmBox';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'hooks/useSnackbar';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useLegacyApi } from 'hooks/useLegacyApi.ts';

const IndividualAssessment = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const legacyApi = useLegacyApi();
  const snackbar = useSnackbar();
  const { mutate } = useMutation({
    mutationFn: legacyApi.request,
  });
  const [evaluationStatuses, setEvaluationStatuses] = useState([
    'عالی',
    'خوب',
    'متوسط',
    'ضعیف',
  ]);
  const [employeeStatues, setEmployeeStatues] = useState([
    'حاضر به خدمت',
    'اعزام به دوره',
    'بازنشسته',
    'منتقله',
    'سایر',
  ]);
  const [myData, setMyData] = useState([] as any[]);
  const [viewConfirmBox, setViewConfirmBox] = useState(false);
  const {
    data: individualAssessments,
    error: getIndividualAssessmentsError,
    status: getIndividualAssessmentsStatus,
  } = useQuery<any, any, any, any>({
    queryKey: [
      `individual-verification-scores/find-by-inspection-id?inspectionId=${id}`,
    ],
    queryFn: () =>
      legacyApi.get(
        `individual-verification-scores/find-by-inspection-id?inspectionId=${id}`
      ),
    select: (res: any) => res?.data || [],
  });

  useEffect(() => {
    setMyData(individualAssessments);
  }, [individualAssessments]);

  function handleChange(index: number, inputName: string, value: any) {
    const temp = [...myData];
    temp[index][inputName] = value;
    if (
      [
        'thisYearEvaluation',
        'oneYearAgoEvaluation',
        'twoYearAgoEvaluation',
      ].includes(inputName)
    )
      temp[index]['averageEvaluation'] = compute3YersAvg(index);
    setMyData(temp);
  }

  function compute3YersAvg(index: number) {
    if (
      isNaN(myData[index].thisYearEvaluation) ||
      isNaN(myData[index].oneYearAgoEvaluation) ||
      isNaN(myData[index].twoYearAgoEvaluation)
    ) {
      return null;
    }

    const sum =
      Number(myData[index].thisYearEvaluation) +
      Number(myData[index].oneYearAgoEvaluation) +
      Number(myData[index].twoYearAgoEvaluation);

    return (sum / 3).toFixed(1);
  }

  const saveAll = () => {
    if (!!myData?.length)
      mutate(
        {
          entity: `individual-verification-scores/save-all`,
          method: 'post',
          data: myData?.map((item, index) => ({
            inspectionId: id,
            id: item.id,
            inspectedId: item.inspectedId,
            inspectedName: item.inspectedName,
            inspectedFamily: item.inspectedFamily,
            inspectedDegree: item.inspectedDegree,
            thisYearEvaluation: item.thisYearEvaluation,
            oneYearAgoEvaluation: item.oneYearAgoEvaluation,
            twoYearAgoEvaluation: item.twoYearAgoEvaluation,
            averageEvaluation: item.averageEvaluation,
            evaluationStatus: item.evaluationStatus,
            currentStatusEmployee: item.currentStatusEmployee,
            encouragement: item.encouragement,
            punishment: item.punishment,
            weakPoints: item.weakPoints,
            strengthPoints: item.strengthPoints,
          })),
        } as any,
        {
          onSuccess: (res: any) => {
            snackbar('اطلاعات با موفقیت ثبت شد.', 'success', 5000);
          },
          onError: () => {
            snackbar('خطا در انجام عملیات', 'error', 5000);
          },
        }
      );
  };

  const confirmAll = () => {
    if (!!myData?.length)
      mutate(
        {
          entity: `individual-verification-scores/submit-all/${id}`,
          method: 'post',
        } as any,
        {
          onSuccess: (res: any) => {
            snackbar('اطلاعات با موفقیت ثبت شد.', 'success', 5000);
            navigate(`/inspection/RASTI_AZMAIE`);
          },
          onError: () => {
            snackbar(
              'خطا در انجام عملیات - لطفا اطمینان حاصل کنید که نمرات سه سال گذشته برای تمام کارکنان وارد شده باشند.',
              'error',
              5000
            );
          },
        }
      );
  };

  return (
    <Grid container size={{ md: 11 }}>
      <ConfirmBox
        open={!!viewConfirmBox}
        handleClose={() => setViewConfirmBox(false)}
        handleSubmit={() => confirmAll()}
        title={`ثبت نهایی اطلاعات`}
        message={'آیا از ثبت نهایی اطلاعات مطمئن هستید؟'}
      />
      <Grid
        container
        size={{ md: 12 }}
        display={'flex'}
        justifyContent={'flex-end'}
      >
        {!!myData?.length && (
          <Box display="flex">
            <Button
              color="success"
              variant="contained"
              sx={{ minWidth: '150px', mb: 2, mx: 2 }}
              onClick={saveAll}
            >
              ذخیره
            </Button>
            <Button
              color="warning"
              variant="contained"
              endIcon={<Check />}
              sx={{ minWidth: '150px', mb: 2 }}
              onClick={() => setViewConfirmBox(true)}
            >
              ثبت نهایی
            </Button>
          </Box>
        )}
      </Grid>
      <Grid
        container
        size={{ md: 12 }}
        display={'flex'}
        justifyContent={'space-between'}
      >
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ bgcolor: 'lightsalmon', borderColor: 'black' }}>
              <TableRow>
                <TableCell
                  align="center"
                  sx={{ border: 'solid 1px black', minWidth: '50px' }}
                >
                  ردیف
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    textAlign: 'center',
                    border: 'solid 1px black',
                    minWidth: '200px',
                  }}
                >
                  کارکنان
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    textAlign: 'center',
                    border: 'solid 1px black',
                    minWidth: '100px',
                  }}
                >
                  ارزیابی امسال
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    textAlign: 'center',
                    border: 'solid 1px black',
                    minWidth: '100px',
                  }}
                >
                  ارزیابی یک سال قبل
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    textAlign: 'center',
                    border: 'solid 1px black',
                    minWidth: '100px',
                  }}
                >
                  ارزیابی دو سال قبل
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    textAlign: 'center',
                    border: 'solid 1px black',
                    minWidth: '100px',
                  }}
                >
                  میانگین نمرات
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    textAlign: 'center',
                    border: 'solid 1px black',
                    minWidth: '200px',
                  }}
                >
                  وضعیت ارزیابی
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    textAlign: 'center',
                    border: 'solid 1px black',
                    minWidth: '200px',
                  }}
                >
                  وضعیت فعلی کارکنان
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    textAlign: 'center',
                    border: 'solid 1px black',
                    minWidth: '80px',
                  }}
                >
                  تشویقات
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    textAlign: 'center',
                    border: 'solid 1px black',
                    minWidth: '80px',
                  }}
                >
                  تنبیهات
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    textAlign: 'center',
                    border: 'solid 1px black',
                    minWidth: '400px',
                  }}
                >
                  نقاط ضعف
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    textAlign: 'center',
                    border: 'solid 1px black',
                    minWidth: '400px',
                  }}
                >
                  نقاط قوت
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getIndividualAssessmentsError?.code === 'ERR_BAD_REQUEST' ? (
                <TableRow>
                  <TableCell align="center" colSpan={12}>
                    <Alert severity="error">
                      لطفا ابتدا تمام فرم های بازبینه را تکمیل کنید.
                    </Alert>
                  </TableCell>
                </TableRow>
              ) : (
                (!myData || myData.length === 0) && (
                  <TableRow>
                    <TableCell align="center" colSpan={12}>
                      {getIndividualAssessmentsStatus === 'pending'
                        ? 'در حال دریافت اطلاعات'
                        : 'داده ای موجود نیست'}
                    </TableCell>
                  </TableRow>
                )
              )}

              {myData?.map((item: any, itemlIndex: number) => (
                <TableRow key={'item' + itemlIndex}>
                  <TableCell align="center">{itemlIndex + 1}</TableCell>
                  <TableCell align="center">
                    {`${item.inspectedDegree || ''} ${item.inspectedName || ''} ${item.inspectedFamily || ''}`}
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      type="number"
                      value={item.thisYearEvaluation || ''}
                      onChange={(e: any) =>
                        handleChange(
                          itemlIndex,
                          'thisYearEvaluation',
                          e.target.value
                        )
                      }
                    />
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      type="number"
                      value={item.oneYearAgoEvaluation || ''}
                      onChange={(e: any) =>
                        handleChange(
                          itemlIndex,
                          'oneYearAgoEvaluation',
                          e.target.value
                        )
                      }
                    />
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      type="number"
                      value={item.twoYearAgoEvaluation || ''}
                      onChange={(e: any) =>
                        handleChange(
                          itemlIndex,
                          'twoYearAgoEvaluation',
                          e.target.value
                        )
                      }
                    />
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      type="number"
                      value={item.averageEvaluation || ''}
                      disabled
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Autocomplete
                      options={evaluationStatuses}
                      value={item.evaluationStatus}
                      renderInput={(params: any) => (
                        <TextField {...params} label="" />
                      )}
                      getOptionLabel={(option: any) => option}
                      onChange={(event: any, newValue: any) =>
                        handleChange(itemlIndex, 'evaluationStatus', newValue)
                      }
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Autocomplete
                      options={employeeStatues}
                      value={item.currentStatusEmployee}
                      renderInput={(params: any) => (
                        <TextField {...params} label="" />
                      )}
                      getOptionLabel={(option: any) => option}
                      onChange={(event: any, newValue: any) =>
                        handleChange(
                          itemlIndex,
                          'currentStatusEmployee',
                          newValue
                        )
                      }
                    />
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      type="number"
                      value={item.encouragement || ''}
                      onChange={(e: any) =>
                        handleChange(
                          itemlIndex,
                          'encouragement',
                          e.target.value
                        )
                      }
                    />
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      type="number"
                      value={item.punishment || ''}
                      onChange={(e: any) =>
                        handleChange(itemlIndex, 'punishment', e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      value={item.weakPoints || ''}
                      onChange={(e: any) =>
                        handleChange(itemlIndex, 'weakPoints', e.target.value)
                      }
                      fullWidth
                    />
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      value={item.strengthPoints || ''}
                      onChange={(e: any) =>
                        handleChange(
                          itemlIndex,
                          'strengthPoints',
                          e.target.value
                        )
                      }
                      fullWidth
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default IndividualAssessment;
