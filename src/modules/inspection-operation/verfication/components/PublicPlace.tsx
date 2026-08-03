import { Check } from '@mui/icons-material';
import {
  Grid,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from '@mui/material';
import RenderFormInput from '@/components/form/RenderFormInput';
import { useSnackbar } from 'hooks/useSnackbar';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useParams } from 'react-router';
import { type IUser } from '@/types/user';
import { useApiMutation, useApiQuery } from '@/hooks/useApi';
import InspectionApis from '../../api';

type Props = { editable: boolean };

export default function PublicPlace({ editable }: Props) {
  const { id } = useParams();
  const snackbar = useSnackbar();
  const { control } = useForm();

  const { mutate: createUnitReportMutate } = useApiMutation({
    url: InspectionApis.verfication.independentUnitReportSave,
    method: 'POST',
  });
  const [myData, setMyData] = useState([] as any[]);

  const { data: unitReport } = useApiQuery<any>({
    url: InspectionApis.verfication.independentUnitReport(id),
  });

  const [basicObjectHome, setbasicObjectHome] = useState({
    inspectionId: id ,
    organizationUnitId: 'f07deb56-de03-4271-adc4-76e143abdd15',
    unitLocationType: 'amiri',
    firstNumber: 0,
    secondNumber: 0,
  });

  useEffect(() => {
    if (!!unitReport) setMyData(unitReport?.data);
  }, [unitReport]);

  const tableItems = useMemo(
    () => [
      {
        name: 'masajed1',
        inputType: 'text',
        size: { md: 12 },
        elementProps: {
          value:
            myData?.find(item => item?.unitLocationType === 'masajed')
              ?.firstNumber ?? '',
          onChange: (e: any) => {
            setMyData((previousState: any) => {
              const index = myData?.findIndex(
                item => item?.unitLocationType === 'masajed'
              );
              if (index !== -1) {
                const updated = [...previousState];
                updated[index] = {
                  ...updated[index],
                  firstNumber: e.target.value,
                };
                return updated;
              } else
                return [
                  ...previousState,
                  {
                    ...basicObjectHome,
                    unitLocationType: 'masajed',
                    firstNumber: e.target.value,
                  },
                ];
            });
          },
        },
      },
      {
        name: 'masajed2',
        inputType: 'text',
        // label: "منازل",
        size: { md: 12 },
        elementProps: {
          // multiline: true,
          // rows: 3,
          value:
            myData?.find(item => item?.unitLocationType === 'masajed')
              ?.secondNumber ?? '',
          onChange: (e: any) => {
            setMyData((previousState: any) => {
              const index = myData?.findIndex(
                item => item?.unitLocationType === 'masajed'
              );
              if (index !== -1) {
                const updated = [...previousState];
                updated[index] = {
                  ...updated[index],
                  secondNumber: e.target.value,
                };
                return updated;
              } else
                return [
                  ...previousState,
                  {
                    ...basicObjectHome,
                    unitLocationType: 'masajed',
                    secondNumber: e.target.value,
                  },
                ];
            });
          },
        },
      },
      {
        name: '21',
        inputType: 'text',
        // label: "پادگان",
        size: { md: 12 },
        elementProps: {
          // multiline: true,
          // rows: 3,
          value:
            myData?.find(item => item?.unitLocationType === 'nanvayi')
              ?.firstNumber ?? '',
          onChange: (e: any) => {
            setMyData((previousState: any) => {
              const index = myData?.findIndex(
                item => item?.unitLocationType === 'nanvayi'
              );
              if (index !== -1) {
                const updated = [...previousState];
                updated[index] = {
                  ...updated[index],
                  firstNumber: e.target.value,
                };
                return updated;
              } else
                return [
                  ...previousState,
                  {
                    ...basicObjectHome,
                    unitLocationType: 'nanvayi',
                    firstNumber: e.target.value,
                  },
                ];
            });
          },
        },
      },
      {
        name: '22',
        inputType: 'text',
        // label: "منازل",
        size: { md: 12 },
        elementProps: {
          // multiline: true,
          // rows: 3,
          value:
            myData?.find(item => item?.unitLocationType === 'nanvayi')
              ?.secondNumber ?? '',
          onChange: (e: any) => {
            setMyData((previousState: any) => {
              const index = myData?.findIndex(
                item => item?.unitLocationType === 'nanvayi'
              );
              if (index !== -1) {
                const updated = [...previousState];
                updated[index] = {
                  ...updated[index],
                  secondNumber: e.target.value,
                };
                return updated;
              } else
                return [
                  ...previousState,
                  {
                    ...basicObjectHome,
                    unitLocationType: 'nanvayi',
                    secondNumber: e.target.value,
                  },
                ];
            });
          },
        },
      },
      {
        name: '31',
        inputType: 'text',
        // label: "موجود",
        size: { md: 12 },
        elementProps: {
          // multiline: true,
          // rows: 3,
          value:
            myData?.find(
              item => item?.unitLocationType === 'asayeshgah_sarbazi'
            )?.firstNumber ?? '',
          onChange: (e: any) => {
            setMyData((previousState: any) => {
              const index = myData?.findIndex(
                item => item?.unitLocationType === 'asayeshgah_sarbazi'
              );
              if (index !== -1) {
                const updated = [...previousState];
                updated[index] = {
                  ...updated[index],
                  firstNumber: e.target.value,
                };
                return updated;
              } else
                return [
                  ...previousState,
                  {
                    ...basicObjectHome,
                    unitLocationType: 'asayeshgah_sarbazi',
                    firstNumber: e.target.value,
                  },
                ];
            });
          },
        },
      },
      {
        name: '32',
        inputType: 'text',
        // label: "منازل سازمانی",
        size: { md: 12 },
        elementProps: {
          // multiline: true,
          // rows: 3,
          value:
            myData?.find(
              item => item?.unitLocationType === 'asayeshgah_sarbazi'
            )?.secondNumber ?? '',
          onChange: (e: any) => {
            setMyData((previousState: any) => {
              const index = myData?.findIndex(
                item => item?.unitLocationType === 'asayeshgah_sarbazi'
              );
              if (index !== -1) {
                const updated = [...previousState];
                updated[index] = {
                  ...updated[index],
                  secondNumber: e.target.value,
                };
                return updated;
              } else
                return [
                  ...previousState,
                  {
                    ...basicObjectHome,
                    unitLocationType: 'asayeshgah_sarbazi',
                    secondNumber: e.target.value,
                  },
                ];
            });
          },
        },
      },
      {
        name: '41',
        inputType: 'text',
        // label: "موجود",
        size: { md: 12 },
        elementProps: {
          // multiline: true,
          // rows: 3,
          value:
            myData?.find(item => item?.unitLocationType === 'estakhr')
              ?.firstNumber ?? '',
          onChange: (e: any) => {
            setMyData((previousState: any) => {
              const index = myData?.findIndex(
                item => item?.unitLocationType === 'estakhr'
              );
              if (index !== -1) {
                const updated = [...previousState];
                updated[index] = {
                  ...updated[index],
                  firstNumber: e.target.value,
                };
                return updated;
              } else
                return [
                  ...previousState,
                  {
                    ...basicObjectHome,
                    unitLocationType: 'estakhr',
                    firstNumber: e.target.value,
                  },
                ];
            });
          },
        },
      },
      {
        name: '42',
        inputType: 'text',
        // label: "منازل سازمانی",
        size: { md: 12 },
        elementProps: {
          // multiline: true,
          // rows: 3,
          value:
            myData?.find(item => item?.unitLocationType === 'estakhr')
              ?.secondNumber ?? '',
          onChange: (e: any) => {
            setMyData((previousState: any) => {
              const index = myData?.findIndex(
                item => item?.unitLocationType === 'estakhr'
              );
              if (index !== -1) {
                const updated = [...previousState];
                updated[index] = {
                  ...updated[index],
                  secondNumber: e.target.value,
                };
                return updated;
              } else
                return [
                  ...previousState,
                  {
                    ...basicObjectHome,
                    unitLocationType: 'estakhr',
                    secondNumber: e.target.value,
                  },
                ];
            });
          },
        },
      },
      {
        name: '51',
        inputType: 'text',
        // label: "موجود",
        size: { md: 12 },
        elementProps: {
          // multiline: true,
          // rows: 3,
          value:
            myData?.find(item => item?.unitLocationType === 'cinema')
              ?.firstNumber ?? '',
          onChange: (e: any) => {
            setMyData((previousState: any) => {
              const index = myData?.findIndex(
                item => item?.unitLocationType === 'cinema'
              );
              if (index !== -1) {
                const updated = [...previousState];
                updated[index] = {
                  ...updated[index],
                  firstNumber: e.target.value,
                };
                return updated;
              } else
                return [
                  ...previousState,
                  {
                    ...basicObjectHome,
                    unitLocationType: 'cinema',
                    firstNumber: e.target.value,
                  },
                ];
            });
          },
        },
      },
      {
        name: '52',
        inputType: 'text',
        // label: "منازل سازمانی",
        size: { md: 12 },
        elementProps: {
          // multiline: true,
          // rows: 3,
          value:
            myData?.find(item => item?.unitLocationType === 'cinema')
              ?.secondNumber ?? '',
          onChange: (e: any) => {
            setMyData((previousState: any) => {
              const index = myData?.findIndex(
                item => item?.unitLocationType === 'cinema'
              );
              if (index !== -1) {
                const updated = [...previousState];
                updated[index] = {
                  ...updated[index],
                  secondNumber: e.target.value,
                };
                return updated;
              } else
                return [
                  ...previousState,
                  {
                    ...basicObjectHome,
                    unitLocationType: 'cinema',
                    secondNumber: e.target.value,
                  },
                ];
            });
          },
        },
      },
      {
        name: '61',
        inputType: 'text',
        // label: "منازل سازمانی",
        size: { md: 12 },
        elementProps: {
          // multiline: true,
          // rows: 3,
          value:
            myData?.find(item => item?.unitLocationType === 'chah_ab')
              ?.firstNumber ?? '',
          onChange: (e: any) => {
            setMyData((previousState: any) => {
              const index = myData?.findIndex(
                item => item?.unitLocationType === 'chah_ab'
              );
              if (index !== -1) {
                const updated = [...previousState];
                updated[index] = {
                  ...updated[index],
                  firstNumber: e.target.value,
                };
                return updated;
              } else
                return [
                  ...previousState,
                  {
                    ...basicObjectHome,
                    unitLocationType: 'chah_ab',
                    firstNumber: e.target.value,
                  },
                ];
            });
          },
        },
      },
      {
        name: '62',
        inputType: 'text',
        // label: "منازل سازمانی",
        size: { md: 12 },
        elementProps: {
          // multiline: true,
          // rows: 3,
          value:
            myData?.find(item => item?.unitLocationType === 'chah_ab')
              ?.secondNumber ?? '',
          onChange: (e: any) => {
            setMyData((previousState: any) => {
              const index = myData?.findIndex(
                item => item?.unitLocationType === 'chah_ab'
              );
              if (index !== -1) {
                const updated = [...previousState];
                updated[index] = {
                  ...updated[index],
                  secondNumber: e.target.value,
                };
                return updated;
              } else
                return [
                  ...previousState,
                  {
                    ...basicObjectHome,
                    unitLocationType: 'chah_ab',
                    secondNumber: e.target.value,
                  },
                ];
            });
          },
        },
      },
      {
        name: '71',
        inputType: 'text',
        // label: "منازل سازمانی",
        size: { md: 12 },
        elementProps: {
          // multiline: true,
          // rows: 3,
          value:
            myData?.find(item => item?.unitLocationType === 'mehmansara')
              ?.firstNumber ?? '',
          onChange: (e: any) => {
            setMyData((previousState: any) => {
              const index = myData?.findIndex(
                item => item?.unitLocationType === 'mehmansara'
              );
              if (index !== -1) {
                const updated = [...previousState];
                updated[index] = {
                  ...updated[index],
                  firstNumber: e.target.value,
                };
                return updated;
              } else
                return [
                  ...previousState,
                  {
                    ...basicObjectHome,
                    unitLocationType: 'mehmansara',
                    firstNumber: e.target.value,
                  },
                ];
            });
          },
        },
      },
      {
        name: '72',
        inputType: 'text',
        // label: "منازل سازمانی",
        size: { md: 12 },
        elementProps: {
          // multiline: true,
          // rows: 3,
          value:
            myData?.find(item => item?.unitLocationType === 'mehmansara')
              ?.secondNumber ?? '',
          onChange: (e: any) => {
            setMyData((previousState: any) => {
              const index = myData?.findIndex(
                item => item?.unitLocationType === 'mehmansara'
              );
              if (index !== -1) {
                const updated = [...previousState];
                updated[index] = {
                  ...updated[index],
                  secondNumber: e.target.value,
                };
                return updated;
              } else
                return [
                  ...previousState,
                  {
                    ...basicObjectHome,
                    unitLocationType: 'mehmansara',
                    secondNumber: e.target.value,
                  },
                ];
            });
          },
        },
      },
      {
        name: '73',
        inputType: 'text',
        // label: "منازل سازمانی",
        size: { md: 12 },
        elementProps: {
          // multiline: true,
          // rows: 3,
          value:
            myData?.find(item => item?.unitLocationType === 'mehmansara_sayer')
              ?.firstNumber ?? '',
          onChange: (e: any) => {
            setMyData((previousState: any) => {
              const index = myData?.findIndex(
                item => item?.unitLocationType === 'mehmansara_sayer'
              );
              if (index !== -1) {
                const updated = [...previousState];
                updated[index] = {
                  ...updated[index],
                  firstNumber: e.target.value,
                };
                return updated;
              } else
                return [
                  ...previousState,
                  {
                    ...basicObjectHome,
                    unitLocationType: 'mehmansara_sayer',
                    firstNumber: e.target.value,
                  },
                ];
            });
          },
        },
      },
    ],
    [myData, unitReport]
  );

  const submitHandler = () => {
    createUnitReportMutate(
      {
        data: [...myData],
      } as any,
      {
        onSuccess: () => {
          snackbar('عملیات با موفقیت انجام شد', 'success', 5000);
        },
        onError: () => {
          snackbar('خطا در انجام عملیات', 'error', 5000);
        },
      }
    );
  };
  return (
    <Grid container size={{ md: 11 }}>
      <Grid
        container
        size={{ md: 12 }}
        m={2}
        display={'flex'}
        justifyContent={'space-between'}
      >
        <Box display="flex">
          <Typography variant="body1" component={'h3'} ml={2}>
            آمار مهمانسراها، مساجد، نانوایی هاو آسایشگاه سربازان
          </Typography>
        </Box>
        <Box display="flex">
          <Button
            variant="contained"
            endIcon={<Check />}
            sx={{ minWidth: '150px', mb: 2 }}
            onClick={submitHandler}
          >
            ثبت تغیرات
          </Button>
        </Box>
      </Grid>
      <Grid
        container
        size={{ md: 12 }}
        m={2}
        display={'flex'}
        justifyContent={'space-between'}
      >
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ bgcolor: 'lightsalmon', borderColor: 'black' }}>
              <TableRow>
                <TableCell rowSpan={2} align="center">
                  ردیف
                </TableCell>
                <TableCell
                  rowSpan={2}
                  align="center"
                  sx={{ textAlign: 'start' }}
                >
                  یگان
                </TableCell>
                <TableCell colSpan={2} align="center">
                  مساجد
                </TableCell>
                <TableCell colSpan={2} align="center">
                  نانوایی
                </TableCell>
                <TableCell colSpan={2} align="center">
                  آسایشگاه سربازی
                </TableCell>
                <TableCell colSpan={2} align="center">
                  استخر
                </TableCell>
                <TableCell colSpan={2} align="center">
                  سینما
                </TableCell>
                <TableCell colSpan={2} align="center">
                  چاه آب
                </TableCell>
                <TableCell colSpan={3} align="center">
                  مهمانسراها
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center">پادگان</TableCell>
                <TableCell align="center">منازل سازمانی</TableCell>
                <TableCell align="center">پادگان</TableCell>
                <TableCell align="center">منازل سازمانی</TableCell>
                <TableCell align="center">کمتر از 10سال ساخت</TableCell>
                <TableCell align="center">بیشتر از 10سال ساخت</TableCell>
                <TableCell align="center">پادگان</TableCell>
                <TableCell align="center">منازل سازمانی</TableCell>
                <TableCell align="center">پادگان</TableCell>
                <TableCell align="center">منازل سازمانی</TableCell>
                <TableCell align="center">پادگان</TableCell>
                <TableCell align="center">منازل سازمانی</TableCell>
                <TableCell align="center">مجردی</TableCell>
                <TableCell align="center">متاهلی</TableCell>
                <TableCell align="center">سایر</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell align="center">1</TableCell>
                <TableCell align="center">نام یگان</TableCell>
                {tableItems.map(item => (
                  <TableCell key={item.name}>
                    {editable ? (
                      <Controller
                        name={item.name as keyof IUser}
                        control={control}
                        render={({ field }) => {
                          return (
                            <RenderFormInput
                              controllerField={field}
                              {...item}
                              {...field}
                            />
                          );
                        }}
                      />
                    ) : (
                      item.elementProps?.value
                    )}
                  </TableCell>
                ))}
              </TableRow>
              {/* ))} */}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}
