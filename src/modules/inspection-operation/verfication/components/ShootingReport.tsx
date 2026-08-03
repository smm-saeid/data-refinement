import { useApiMutation, useApiQuery } from '@/hooks/useApi';
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
  TextField,
  Autocomplete,
} from '@mui/material';
import { useSnackbar } from 'hooks/useSnackbar';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import InspectionApis from '../../api';
import { PAGINATION_DEFAULT_VALUE_OLD } from '@/types/api';

export default function ShootingRepot() {
  const { id } = useParams();
  const snackbar = useSnackbar();

  const { mutate: createShootingSaveMutate } = useApiMutation({
    url: InspectionApis.verfication.shootingReportSaveAll,
    method: 'POST',
  });
  const [autoCompleteValue, setAutoCompleteValue] = useState<any>(undefined);
  const [autoCompleteValue1, setAutoCompleteValue1] = useState<any>(undefined);
  const [inspectorId, setInspectorId] = useState<any>(undefined);
  const [inspectedId, setInspectedId] = useState<any>(undefined);
  const [myData, setMyData] = useState([] as any[]);
  const [selectedReportType, setselectedReportType] = useState(0);

  const { data: shootingReport } = useApiQuery<any>({
    url: InspectionApis.verfication.shootingReport(id),
  });

  const { data: information } = useApiQuery<any>({
    url: InspectionApis.verfication.information(id),
    enabled: !!id,
  });

  const { data: questionList } = useApiQuery<any>({
    url: InspectionApis.verfication.shootingReviewType,
    enabled: !!shootingReport,
  });

  const { data: personnel } = useApiQuery<any>({
    url: InspectionApis.verfication.personnel,
    params: {
      ...PAGINATION_DEFAULT_VALUE_OLD,
      org: information?.data?.organizationUnitId,
    },
    enabled: !!information,
  });

  useEffect(() => {
    if (!!shootingReport && shootingReport?.data?.length !== 0)
      setMyData(shootingReport?.data);
    else if (!!questionList) setMyData(questionList?.data);

    if (!!shootingReport && shootingReport?.data?.length !== 0) {
      setInspectedId(shootingReport[0]?.setInspectedId);
      setAutoCompleteValue1(shootingReport[0]?.setInspectedId);
      setInspectorId(shootingReport[0]?.setInspectorId);
      setAutoCompleteValue(shootingReport[0]?.setInspectorId);
    }
  }, [shootingReport, questionList]);

  function handleChange(indx: number, title: string, value: any) {
    setMyData(() => {
      const newData = [...myData];
      newData[indx][title] = value;
      return newData;
    });
  }

  const submitHandler = () => {
    if (!!shootingReport && shootingReport?.data?.length !== 0)
      createShootingSaveMutate(
        {
          data: myData?.map(item => ({
            id: item?.id,
            shootingReviewTypeId: item?.shootingReviewTypeId ?? item?.id,
            inspectionId: id,
            inspectorId: item.inspectorId,
            inspectedId: item.inspectedId,
            grade: item?.grade,
          })),
        } as any,
        {
          onSuccess: () => {
            snackbar('ویرایش با موفقیت انجام شد', 'success', 5000);
          },
          onError: () => {
            snackbar('خطا در انجام عملیات', 'error', 5000);
          },
        }
      );
    else
      !inspectorId?.id
        ? snackbar('لطفا بازرسی کننده را انتخاب نمایید', 'error', 5000)
        : !inspectedId?.id
          ? snackbar('لطفا بازرسی شونده را انتخاب نمایید', 'error', 5000)
          : createShootingSaveMutate(
              {
                data: myData?.map(item => ({
                  id: item?.id,
                  shootingReviewTypeId: item?.shootingReviewTypeId ?? item?.id,
                  inspectionId: id,
                  inspectorId: inspectorId?.id,
                  inspectedId: inspectedId?.id,
                  grade: item?.grade,
                })),
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
          <Typography variant="h6" component={'h3'} ml={2}>
            گزارش تیز اندازی {selectedReportType === 0 ? 'پایور' : 'وظیفه'}
          </Typography>
        </Box>
        <Box display="flex">
          <Autocomplete
            id="inspector"
            onChange={(event: any, newValue: any) => {
              if (newValue?.id) {
                setInspectorId(newValue);
              }

              setAutoCompleteValue(undefined);
            }}
            renderOption={(props: any, option: any) => (
              <li {...props} key={option?.id}>
                {option?.name + ' ' + option?.family}
              </li>
            )}
            value={autoCompleteValue}
            inputValue={autoCompleteValue}
            clearOnBlur
            options={personnel?.data ?? []}
            sx={{ width: 150, mr: 2 }}
            getOptionLabel={(option: any) => option.name + ' ' + option.family}
            renderInput={(params: any) => (
              <TextField {...params} label="بازرسی کننده " />
            )}
            isOptionEqualToValue={(option, value) => {
              return `${option?.id}` === `${value?.id}`;
            }}
          />
          <Autocomplete
            id="inspected"
            onChange={(event: any, newValue: any) => {
              if (newValue?.id) {
                setInspectedId(newValue);
              }

              setAutoCompleteValue1(undefined);
            }}
            renderOption={(props: any, option: any) => (
              <li {...props} key={option.id}>
                {option.name + ' ' + option.family}
              </li>
            )}
            value={autoCompleteValue1}
            inputValue={autoCompleteValue1}
            clearOnBlur
            options={personnel?.data ?? []}
            sx={{ width: 150, mr: 2 }}
            getOptionLabel={(option: any) => option.name + ' ' + option.family}
            renderInput={(params: any) => (
              <TextField {...params} label="بازرسی شونده " />
            )}
            isOptionEqualToValue={(option, value) => {
              return `${option?.id}` === `${value?.id}`;
            }}
          />
          <Button
            variant="contained"
            endIcon={<Check />}
            sx={{ minWidth: '150px', mb: 2 }}
            onClick={submitHandler}
          >
            {!!shootingReport && shootingReport?.data?.length !== 0
              ? 'ویرایش تغیرات'
              : 'ثبت تغیرات'}
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
        {!!shootingReport && shootingReport?.data?.length !== 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ bgcolor: 'lightsalmon', borderColor: 'black' }}>
                <TableRow>
                  <TableCell align="center" sx={{ border: 'solid 1px black' }}>
                    ردیف
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      textAlign: 'center',
                      border: 'solid 1px black',
                      width: '50%',
                    }}
                  >
                    فهرست پرسش ها
                  </TableCell>
                  <TableCell
                    sx={{
                      transform: 'rotate(90deg)',
                      whiteSpace: 'nowrap',
                      height: '300px',
                      maxWidth: '80px',
                      textAlign: 'end',
                      border: 'solid 1px black',
                      width: '10%',
                    }}
                  >
                    ضریب سوال
                  </TableCell>
                  <TableCell
                    sx={{
                      transform: 'rotate(90deg)',
                      whiteSpace: 'nowrap',
                      height: '300px',
                      maxWidth: '80px',
                      textAlign: 'end',
                      border: 'solid 1px black',
                      width: '10%',
                    }}
                  >
                    میزان عملکرد(0-100)
                  </TableCell>
                  <TableCell
                    sx={{
                      transform: 'rotate(90deg)',
                      whiteSpace: 'nowrap',
                      height: '300px',
                      maxWidth: '80px',
                      textAlign: 'end',
                      border: 'solid 1px black',
                    }}
                  >
                    اثربخشی عملکرد(0,1-5)
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {myData?.map((item: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell>
                      <TextField
                        value={item?.shootingReviewTypeQuestion ?? ''}
                        onChange={(e: any) => {
                          if (!isNaN(e.target.value))
                            handleChange(index, 'question', e.target.value);
                        }}
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={item?.shootingReviewTypeFactor}
                        onChange={e => {
                          handleChange(
                            index,
                            'shootingReviewTypeFactor',
                            e.target.value
                          );
                        }}
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={item?.grade}
                        onChange={e => {
                          handleChange(index, 'grade', e.target.value);
                        }}
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>{item?.effectiveness}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ bgcolor: 'lightsalmon', borderColor: 'black' }}>
                <TableRow>
                  <TableCell align="center" sx={{ border: 'solid 1px black' }}>
                    ردیف
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      textAlign: 'center',
                      border: 'solid 1px black',
                      width: '50%',
                    }}
                  >
                    فهرست پرسش ها
                  </TableCell>
                  <TableCell
                    sx={{
                      transform: 'rotate(90deg)',
                      whiteSpace: 'nowrap',
                      height: '300px',
                      maxWidth: '80px',
                      textAlign: 'end',
                      border: 'solid 1px black',
                      width: '10%',
                    }}
                  >
                    ضریب سوال
                  </TableCell>
                  <TableCell
                    sx={{
                      transform: 'rotate(90deg)',
                      whiteSpace: 'nowrap',
                      height: '300px',
                      maxWidth: '80px',
                      textAlign: 'end',
                      border: 'solid 1px black',
                      width: '10%',
                    }}
                  >
                    میزان عملکرد(0-100)
                  </TableCell>
                  <TableCell
                    sx={{
                      transform: 'rotate(90deg)',
                      whiteSpace: 'nowrap',
                      height: '300px',
                      maxWidth: '80px',
                      textAlign: 'end',
                      border: 'solid 1px black',
                    }}
                  >
                    اثربخشی عملکرد(0,1-5)
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* {data?.rows?.map((reportItem: any, reportIndex: number) => ( */}
                {myData?.map((item: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell>
                      <TextField
                        value={item?.question ?? ''}
                        onChange={(e: any) => {
                          if (!isNaN(e.target.value))
                            handleChange(index, 'question', e.target.value);
                        }}
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={item?.factor}
                        onChange={e => {
                          handleChange(
                            index,
                            'shootingReviewTypeFactor',
                            e.target.value
                          );
                        }}
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={item?.grade}
                        onChange={e => {
                          handleChange(index, 'grade', e.target.value);
                        }}
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>{item?.effectiveness}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Grid>
    </Grid>
  );
}
