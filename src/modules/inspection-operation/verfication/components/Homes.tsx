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
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useParams } from 'react-router';
import { type IUser } from '@/types/user';
import { useApiQuery } from '@/hooks/useApi';
import InspectionApis from '../../api';

type Props = {
  editable: boolean;
};

export default function Homes({ editable }: Props) {
  const { id } = useParams();
  const [myData, setMyData] = useState([] as any[]);
  const { control } = useForm();

  const { data: homeReport } = useApiQuery<any>({
    url: InspectionApis.verfication.independentHomeReport(id),
  });

  useEffect(() => {
    if (!!homeReport) setMyData(homeReport?.data);
  }, [homeReport]);

  const [basicObjectHome, setbasicObjectHome] = useState({
    inspectionId: id,
    organizationUnitId: 'f07deb56-de03-4271-adc4-76e143abdd15',
    organizationHomeType: 'amiri',
    available: 0,
    occupation: 0,
  });
  const tableItems = useMemo(
    () => [
      {
        name: 'amiri_available',
        inputType: 'text',
        label: 'موجود',
        size: { md: 12 },
        elementProps: {
          // multiline: true,
          // rows: 3,
          value:
            myData?.find(item => item?.organizationHomeType === 'amiri')
              ?.available ?? '',
          onChange: (e: any) => {
            setMyData((previousState: any) => {
              const index = myData?.findIndex(
                item => item?.organizationHomeType === 'amiri'
              );
              if (index !== -1) {
                const updated = [...previousState];
                updated[index] = {
                  ...updated[index],
                  available: e.target.value,
                };
                return updated;
              } else
                return [
                  ...previousState,
                  {
                    ...basicObjectHome,
                    organizationHomeType: 'amiri',
                    available: e.target.value,
                  },
                ];
            });
          },
        },
      },
      {
        name: 'amiri_occupation',
        inputType: 'text',
        label: 'اشغال شده',
        size: { md: 12 },
        elementProps: {
          // multiline: true,
          // rows: 3,
          value:
            myData?.find(item => item?.organizationHomeType === 'amiri')
              ?.occupation ?? '',
          onChange: (e: any) => {
            setMyData((previousState: any) => {
              const index = myData?.findIndex(
                item => item?.organizationHomeType === 'amiri'
              );
              if (index !== -1) {
                const updated = [...previousState];
                updated[index] = {
                  ...updated[index],
                  occupation: e.target.value,
                };
                return updated;
              } else
                return [
                  ...previousState,
                  {
                    ...basicObjectHome,
                    organizationHomeType: 'amiri',
                    occupation: 0,
                  },
                ];
            });
          },
        },
      },
      {
        name: '21',
        inputType: 'text',
        label: 'موجود',
        size: { md: 12 },
        elementProps: {
          // multiline: true,
          // rows: 3,
          value:
            myData?.find(item => item?.organizationHomeType === 'afsar_arshadi')
              ?.available ?? '',
          onChange: (e: any) => {
            setMyData((previousState: any) => {
              const index = myData?.findIndex(
                item => item?.organizationHomeType === 'afsar_arshadi'
              );
              if (index !== -1) {
                const updated = [...previousState];
                updated[index] = {
                  ...updated[index],
                  available: e.target.value,
                };
                return updated;
              } else
                return [
                  ...previousState,
                  {
                    ...basicObjectHome,
                    organizationHomeType: 'afsar_arshadi',
                    available: e.target.value,
                  },
                ];
            });
          },
        },
      },
      {
        name: '22',
        inputType: 'text',
        label: 'اشغال شده',
        size: { md: 12 },
        elementProps: {
          // multiline: true,
          // rows: 3,
          value:
            myData?.find(item => item?.organizationHomeType === 'afsar_arshadi')
              ?.occupation ?? '',
          onChange: (e: any) => {
            setMyData((previousState: any) => {
              const index = myData?.findIndex(
                item => item?.organizationHomeType === 'afsar_arshadi'
              );
              if (index !== -1) {
                const updated = [...previousState];
                updated[index] = {
                  ...updated[index],
                  occupation: e.target.value,
                };
                return updated;
              } else
                return [
                  ...previousState,
                  {
                    ...basicObjectHome,
                    organizationHomeType: 'afsar_arshadi',
                    occupation: e.target.value,
                  },
                ];
            });
          },
        },
      },
      {
        name: '31',
        inputType: 'text',
        label: 'موجود',
        size: { md: 12 },
        elementProps: {
          // multiline: true,
          // rows: 3,
          value:
            myData?.find(item => item?.organizationHomeType === 'afsar_joz')
              ?.available ?? '',
          onChange: (e: any) => {
            setMyData((previousState: any) => {
              const index = myData?.findIndex(
                item => item?.organizationHomeType === 'afsar_joz'
              );
              if (index !== -1) {
                const updated = [...previousState];
                updated[index] = {
                  ...updated[index],
                  available: e.target.value,
                };
                return updated;
              } else
                return [
                  ...previousState,
                  {
                    ...basicObjectHome,
                    organizationHomeType: 'afsar_joz',
                    available: e.target.value,
                  },
                ];
            });
          },
        },
      },
      {
        name: '32',
        inputType: 'text',
        label: 'اشغال شده',
        size: { md: 12 },
        elementProps: {
          // multiline: true,
          // rows: 3,
          value:
            myData?.find(item => item?.organizationHomeType === 'afsar_joz')
              ?.occupation ?? '',
          onChange: (e: any) => {
            setMyData((previousState: any) => {
              const index = myData?.findIndex(
                item => item?.organizationHomeType === 'afsar_joz'
              );
              if (index !== -1) {
                const updated = [...previousState];
                updated[index] = {
                  ...updated[index],
                  occupation: e.target.value,
                };
                return updated;
              } else
                return [
                  ...previousState,
                  {
                    ...basicObjectHome,
                    organizationHomeType: 'afsar_joz',
                    occupation: e.target.value,
                  },
                ];
            });
          },
        },
      },
      {
        name: '41',
        inputType: 'text',
        label: 'موجود',
        size: { md: 12 },
        elementProps: {
          // multiline: true,
          // rows: 3,
          value:
            myData?.find(item => item?.organizationHomeType === 'karmandi')
              ?.available ?? '',
          onChange: (e: any) => {
            setMyData((previousState: any) => {
              const index = myData?.findIndex(
                item => item?.organizationHomeType === 'karmandi'
              );
              if (index !== -1) {
                const updated = [...previousState];
                updated[index] = {
                  ...updated[index],
                  available: e.target.value,
                };
                return updated;
              } else
                return [
                  ...previousState,
                  {
                    ...basicObjectHome,
                    organizationHomeType: 'amiri',
                    available: e.target.value,
                  },
                ];
            });
          },
        },
      },
      {
        name: '42',
        inputType: 'text',
        label: 'اشغال شده',
        size: { md: 12 },
        elementProps: {
          // multiline: true,
          // rows: 3,
          value:
            myData?.find(item => item?.organizationHomeType === 'karmandi')
              ?.occupation ?? '',
          onChange: (e: any) => {
            setMyData((previousState: any) => {
              const index = myData?.findIndex(
                item => item?.organizationHomeType === 'karmandi'
              );
              if (index !== -1) {
                const updated = [...previousState];
                updated[index] = {
                  ...updated[index],
                  occupation: e.target.value,
                };
                return updated;
              } else
                return [
                  ...previousState,
                  {
                    ...basicObjectHome,
                    organizationHomeType: 'karmandi',
                    occupation: e.target.value,
                  },
                ];
            });
          },
        },
      },
      {
        name: '51',
        inputType: 'text',
        label: 'موجود',
        size: { md: 12 },
        elementProps: {
          // multiline: true,
          // rows: 3,
          value:
            myData?.find(item => item?.organizationHomeType === 'darajedari')
              ?.available ?? '',
          onChange: (e: any) => {
            setMyData((previousState: any) => {
              const index = myData?.findIndex(
                item => item?.organizationHomeType === 'darajedari'
              );
              if (index !== -1) {
                const updated = [...previousState];
                updated[index] = {
                  ...updated[index],
                  available: e.target.value,
                };
                return updated;
              } else
                return [
                  ...previousState,
                  {
                    ...basicObjectHome,
                    organizationHomeType: 'darajedari',
                    available: e.target.value,
                  },
                ];
            });
          },
        },
      },
      {
        name: '52',
        inputType: 'text',
        label: 'اشغال شده',
        size: { md: 12 },
        elementProps: {
          // multiline: true,
          // rows: 3,
          value:
            myData?.find(item => item?.organizationHomeType === 'darajedari')
              ?.occupation ?? '',
          onChange: (e: any) => {
            setMyData((previousState: any) => {
              const index = myData?.findIndex(
                item => item?.organizationHomeType === 'darajedari'
              );
              if (index !== -1) {
                const updated = [...previousState];
                updated[index] = {
                  ...updated[index],
                  occupation: e.target.value,
                };
                return updated;
              } else
                return [
                  ...previousState,
                  {
                    ...basicObjectHome,
                    organizationHomeType: 'darajedari',
                    occupation: e.target.value,
                  },
                ];
            });
          },
        },
      },
    ],
    [myData, homeReport]
  );
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
            آمار خانه ای سازمانی
          </Typography>
        </Box>
        <Box display="flex">
          <Button
            variant="contained"
            endIcon={<Check />}
            sx={{ minWidth: '150px', mb: 2 }}
            onClick={() => {}}
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
                  افسری
                </TableCell>
                <TableCell colSpan={2} align="center">
                  افسر ارشدی
                </TableCell>
                <TableCell colSpan={2} align="center">
                  افسر جزء
                </TableCell>
                <TableCell colSpan={2} align="center">
                  درجه داری
                </TableCell>
                <TableCell colSpan={2} align="center">
                  کارمندی
                </TableCell>
                {/* <TableCell align="center">نام خانوادگی</TableCell>
                        <TableCell align="center">جایگاه</TableCell> */}
              </TableRow>
              <TableRow>
                <TableCell align="center">موجود</TableCell>
                <TableCell align="center">اشغال شده</TableCell>
                <TableCell align="center">موجود</TableCell>
                <TableCell align="center">اشغال شده</TableCell>
                <TableCell align="center">موجود</TableCell>
                <TableCell align="center">اشغال شده</TableCell>
                <TableCell align="center">موجود</TableCell>
                <TableCell align="center">اشغال شده</TableCell>
                <TableCell align="center">موجود</TableCell>
                <TableCell align="center">اشغال شده</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* {data?.rows?.map((reportItem: any, reportIndex: number) => ( */}
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
                      item?.elementProps?.value
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
