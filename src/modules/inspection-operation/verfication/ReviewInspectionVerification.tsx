import { ArrowForward, Delete } from '@mui/icons-material';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Chip,
  Autocomplete,
} from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import DisabledTextInput from '@/components/DisabledTextInput';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useLegacyApi } from 'hooks/useLegacyApi.ts';
import { useSnackbar } from 'hooks/useSnackbar.ts';
import BackButton from '@/components/button/BackButton';

const TextFieldComponent: React.FC<any> = ({
  label = '',
  defaultValue = '',
  multiline = false,
  type = 'text',
  globalSetter,
  grade = null,
  max = null,
}: {
  label: string;
  defaultValue: any;
  multiline: boolean;
  type: string;
  globalSetter: (x: any) => any;
  grade: null | number;
  max: null | number;
}) => {
  const [text, setText] = useState<any>(defaultValue);

  const snackbar = useSnackbar();

  useEffect(() => {
    if (!!grade && grade < 75 && text > 4) {
      snackbar(
        'نمره اثربخشی سوالاتی که نمره میزان عملکرد آن کمتر از ۷۵ است الزاما بایستی کمتر از ۴ باشد.',
        'error',
        5000
      );
      setText(0);
    }
  }, [grade, text]);

  useEffect(() => {
    setText(defaultValue);
  }, [defaultValue]);

  return (
    <TextField
      label={label}
      hiddenLabel={label === null}
      type={type}
      size="small"
      fullWidth
      value={text}
      onChange={(event: any) => {
        if (!max)
          setText(
            type === 'number'
              ? parseFloat(event.target.value)
              : event.target.value
          );
        else
          setText(
            Math.min(
              Math.max(
                type === 'number'
                  ? parseFloat(event.target.value)
                  : event.target.value,
                0
              ),
              max
            )
          );
      }}
      multiline={multiline}
      onBlur={() => globalSetter(text)}
    />
  );
};

export default function ReviewInspectionVerification() {
  const snackbar = useSnackbar();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { reviewId, id, inspectorId } = useParams();
  const [reviews, setReviews] = useState<any>([]);
  const [inspectedFirstId, setInspectedFirstId] = useState<any>('');
  const [inspectedHighOneId, setInspectedHighOneId] = useState<any>('');
  const [autoCompleteValue1, setAutoCompleteValue1] = useState<any>({
    id: '192180ae-d67c-4bc8-9388-ab8219733e3f',
    name: 'حمید رضا',
    family: 'امیر نژاد',
    degree: 'سرگرد',
    personNumber: '057305125',
  });
  const [autoCompleteValue2, setAutoCompleteValue2] = useState<any>({
    id: '192180ae-d67c-4bc8-9388-ab8219733e3f',
    name: 'حمید رضا',
    family: 'امیر نژاد',
    degree: 'سرگرد',
    personNumber: '057305125',
  });
  const [inspectee, setInspectee] = useState<any>();
  const legacyApi = useLegacyApi();
  const { mutate } = useMutation({
    mutationFn: legacyApi.request,
  });

  const { data, status, error } = useQuery<any, any, any>({
    queryKey: [
      `/review/find-by-review-group?pageSize=1&currentPage=10000&groupId=${reviewId}`,
    ],
    queryFn: () =>
      legacyApi.get(
        `/review/find-by-review-group?pageSize=1&currentPage=10000&groupId=${reviewId}`
      ),
    select: (res: any) =>
      res?.data?.rows?.map((item: any, index: any) => ({
        ...item,
        id: index,
      })),
  } as any);

  const {
    data: customized,
    status: customizedStatus,
    refetch: refetchCustomized,
  } = useQuery<any, any, any>({
    queryKey: [
      `/review-customize/find-by-parameter?inspectionId=${id}&inspectorId=${inspectorId}&reviewGroupId=${reviewId}`,
    ],
    queryFn: () =>
      legacyApi.get(
        `/review-customize/find-by-parameter?inspectionId=${id}&inspectorId=${inspectorId}&reviewGroupId=${reviewId}`
      ),
    select: (res: any) => res?.data,
  } as any);
  const {
    data: inspector,
    status: inspectorStatus,
    refetch: refetchInspector,
  } = useQuery<any, any, any>({
    queryKey: [`/person-info/id/${inspectorId}`],
    queryFn: () => legacyApi.get(`/person-info/id/${inspectorId}`),
    select: (res: any) => res.data,
  } as any);
  const {
    data: header,
    status: headerStatus,
    refetch: refetchStatus,
  } = useQuery<any, any, any>({
    queryKey: [
      `/inspected/find-by-parameter?inspectionId=${id}&inspectorId=${inspectorId}&reviewGroupId=${reviewId}`,
    ],
    queryFn: () =>
      legacyApi.get(
        `/inspected/find-by-parameter?inspectionId=${id}&inspectorId=${inspectorId}&reviewGroupId=${reviewId}`
      ),
    select: (res: any) => res.data,
  } as any);
  useEffect(() => {
    if (status === 'success')
      if (!!customized && customized?.length) setReviews(customized);
      else setReviews(data);
  }, [status, customized]);
  const {
    data: personnel,
    status: personnelStatus,
    refetch: refreshPersonnel,
  } = useQuery<any, any, any>({
    queryKey: [
      `person-info?pageSize=10&currentPage=1&org=f07deb56-de03-4271-adc4-76e143abdd15`,
    ],
    queryFn: () =>
      legacyApi.get(
        `person-info?pageSize=10&currentPage=1&org=f07deb56-de03-4271-adc4-76e143abdd15`
      ),
    select: (res: any) => res?.data,
    // enabled: !!information,
  } as any);

  useEffect(() => {
    if (!!header) {
      setInspectee(header);
      setInspectedFirstId(header?.inspectedFirstId);
      setInspectedHighOneId(header?.inspectedHighOneId);
      if (!!personnel) {
        setAutoCompleteValue1(
          personnel?.rows.find(
            (item: any) => item.id === header?.inspectedFirstId
          )
        );
        setAutoCompleteValue2(
          personnel?.rows.find(
            (item: any) => item.id === header?.inspectedHighOneId
          )
        );
      }
    }
  }, [header]);
  useEffect(() => {
    console.log(
      'autoCompleteValue1',
      personnel?.rows.find((item: any) => item.id === header?.inspectedFirstId)
    );
  }, [setInspectedFirstId, autoCompleteValue1]);

  const saveReviews = (final: boolean) => {
    mutate(
      {
        entity: `/inspected`,
        method: !!header ? 'put' : 'post',
        data: {
          ...header,
          inspectorId: inspector?.id,
          reviewGroupId: reviewId ?? state?.row?.reviewGroupId,
          inspectionId: id ?? state?.row?.inspectionId,
          inspectedName: inspectee?.inspectedName,
          inspectedDegree: inspectee?.inspectedDegree,
          inspectedFirstId: inspectedFirstId,
          inspectedHighOneId: inspectedHighOneId,
          finalized: final,
        },
      } as any,
      {
        onSuccess: (res: any) => {
          refetchStatus();
          refetchInspector();
          snackbar('با موفقیت ذخیره شد.', 'success', 5000);
        },
      }
    );
    if (!!final)
      mutate(
        {
          entity: `person-speciality-review-group`,
          method: 'put',
          data: {
            id: state?.specialItem?.id,
            reviewGroupId: state?.specialItem?.reviewGroupId,
            personSpecialityId: state?.specialItem?.personSpecialityId,
            confirmed: true,
            inspectionId: state?.specialItem?.inspectionId,
          },
        } as any,
        {
          onSuccess: (res: any) => {
            // setNotification(200, "با موفقیت ذخیره شد.", "success");
          },
          onError: () => {},
        }
      );
    mutate(
      {
        entity: `/review-customize`,
        method: 'post',
        data: reviews.map((item: any) => ({
          ...item,
          inspectorId: inspector?.id,
          reviewGroupId: reviewId ?? state?.row?.reviewGroupId,
          inspectionId: id ?? state?.row?.inspectionId,
          id: typeof item.id == 'number' ? null : item.id,
        })),
      } as any,
      {
        onSuccess: (res: any) => {
          refetchCustomized();
          snackbar('با موفقیت ذخیره شد.', 'success', 5000);
        },
      }
    );
    // navigate(0);
  };

  const deleteReview = (id: any) => {
    if (typeof id === 'number') {
      setReviews((list: any) => list.filter((item: any) => item.id !== id));
      snackbar('با موفقیت حذف شد.', 'success', 5000);
    } else {
      mutate(
        {
          entity: `/review-customize/${id}`,
          method: 'delete',
        } as any,
        {
          onSuccess: (res: any) => {
            refetchCustomized();
            if (res.data !== 200) {
              snackbar('با موفقیت ذخیره شد.', 'success', 5000);
            }
          },
        }
      );
    }
  };

  return (
    <Box>
      <Box sx={{ margin: '20px' }}>
        <Grid container spacing={2} display={"flex"} justifyContent={"space-between"}>
          <Grid size={{ xs: 4 }} textAlign={'center'}>
            <Paper sx={{ padding: '5px' }} elevation={3}>
              <Typography fontWeight={500} variant="h6">
                بازبینه {state?.specialItem?.reviewGroupName}
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 2 }}>
            <BackButton color='warning' minWidth={"150px"} onBack={()=> navigate(-1)} text='بازگشت' key={null} />
          </Grid>
        </Grid>
      </Box>
      <Grid container sx={{ width: '100%' }} spacing={2}>
        <Grid container size={{ xs: 12 }}>
          <Grid size={{ xs: 12, md: 4 }} container spacing={3}>
            <Grid size={{ xs: 12 }}>مشخصات بازرس:</Grid>
            <Grid size={{ xs: 8 }}>
              <DisabledTextInput label={'رسته'} value={inspector?.field} />
            </Grid>
            <Grid size={{ xs: 8 }}>
              <DisabledTextInput
                label={'نام و نام خانوادگی'}
                value={inspector?.name + ' ' + inspector?.family}
              />
            </Grid>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }} container spacing={3}>
            <Grid size={{ xs: 12 }}>مشخصات بازرسی شونده:</Grid>
            {/* <Grid item xs={8}>
                            <TextFieldComponent
                                defaultValue={inspectee?.inspectedDegree}
                                label={"درجه"}
                                globalSetter={(newValue: any) => setInspectee((prev: any) => {
                                    return {
                                        ...prev,
                                        inspectedDegree: newValue
                                    }
                                })}
                            />
                        </Grid>
                        <Grid item xs={8}>
                            <TextFieldComponent
                                defaultValue={inspectee?.inspectedName}
                                label={"نام و نام خانوادگی"}
                                globalSetter={(newValue: any) => setInspectee((prev: any) => {
                                    return {
                                        ...prev,
                                        inspectedName: newValue
                                    }
                                })}
                            />
                        </Grid> */}
            <Grid size={{ xs: 8 }}>
              <Autocomplete
                id="inspected"
                onChange={(event: any, newValue: any) => {
                  if (newValue?.id) {
                    setInspectedFirstId(newValue.id);
                  }

                  //   setAutoCompleteValue1(undefined);
                }}
                renderOption={(props: any, option: any) => (
                  <li {...props} key={option.id}>
                    {option.name + ' ' + option.family}
                  </li>
                )}
                value={autoCompleteValue1 ?? ''}
                // inputValue={autoCompleteValue1}
                // clearOnBlur
                options={personnel?.rows ?? []}
                sx={{ width: 180, mr: 2 }}
                getOptionLabel={(option: any) =>
                  option.name + ' ' + option.family
                }
                renderInput={(params: any) => (
                  <TextField {...params} label="بازرسی شونده" />
                )}
                isOptionEqualToValue={(option, value) => {
                  return `${option?.id}` === `${value?.id}`;
                }}
              />
            </Grid>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }} container spacing={3}>
            <Grid size={{ xs: 12 }}>مشخصات مسئول رده بالاسر:</Grid>
            {/* <Grid item xs={8}>
              <TextFieldComponent
                defaultValue={inspectee?.inspectedHighDegree}
                label={"درجه"}
                globalSetter={(newValue: any) =>
                  setInspectee((prev: any) => {
                    return {
                      ...prev,
                      inspectedHighDegree: newValue,
                    };
                  })
                }
              />
            </Grid>
            <Grid item xs={8}>
              <TextFieldComponent
                defaultValue={inspectee?.inspectedHighName}
                label={"نام و نام خانوادگی"}
                globalSetter={(newValue: any) =>
                  setInspectee((prev: any) => {
                    return {
                      ...prev,
                      inspectedHighName: newValue,
                    };
                  })
                }
              />
            </Grid> */}
            <Grid size={{ xs: 8 }}>
              <Autocomplete
                id="inspectedhighone"
                onChange={(event: any, newValue: any) => {
                  if (newValue?.id) {
                    setInspectedHighOneId(newValue.id);
                  }
                  //   setAutoCompleteValue2(undefined);
                }}
                renderOption={(props: any, option: any) => (
                  <li {...props} key={option.id}>
                    {option.name + ' ' + option.family}
                  </li>
                )}
                value={autoCompleteValue2 ?? ''}
                // inputValue={autoCompleteValue2??""}
                clearOnBlur
                options={personnel?.rows ?? []}
                sx={{ width: 180, mr: 2 }}
                getOptionLabel={(option: any) =>
                  option.name + ' ' + option.family
                }
                renderInput={(params: any) => (
                  <TextField {...params} label="مسئول رده بالاسر" />
                )}
                isOptionEqualToValue={(option, value) => {
                  return `${option?.id}` === `${value?.id}`;
                }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12 }}></Grid>
        <Grid size={{ xs: 12 }}>
          <TableContainer component={Paper} sx={{ minWidth: '1200px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center" style={{ width: '5%' }}></TableCell>
                  <TableCell align="center" style={{ width: '5%' }}>
                    ردیف
                  </TableCell>
                  <TableCell align="center" style={{ width: '50%' }}>
                    پرسش
                  </TableCell>
                  <TableCell align="center" style={{ width: '10%' }}>
                    ضریب
                  </TableCell>
                  <TableCell align="center" style={{ width: '10%' }}>
                    میزان عملکرد
                  </TableCell>
                  <TableCell align="center" style={{ width: '10%' }}>
                    نتیجه
                  </TableCell>
                  <TableCell align="center" style={{ width: '10%' }}>
                    اثر بخشی
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reviews.map((review: any, index: any) => (
                  <TableRow key={index}>
                    <TableCell>
                      <IconButton
                        onClick={() => {
                          deleteReview(review?.id);
                        }}
                      >
                        <Delete color="error" />
                      </IconButton>
                    </TableCell>

                    <TableCell align="center">{index + 1}</TableCell>

                    <TableCell align="center">
                      <TextFieldComponent
                        defaultValue={review?.question}
                        label={null}
                        multiline
                        globalSetter={(newValue: any) =>
                          setReviews((prevState: any) => {
                            let newState = [...prevState];
                            newState[index].question = newValue;
                            return newState;
                          })
                        }
                      />
                    </TableCell>

                    <TableCell align="center">
                      <TextFieldComponent
                        defaultValue={review?.factor}
                        label={null}
                        type="number"
                        globalSetter={(newValue: any) =>
                          setReviews((prevState: any) => {
                            let newState = [...prevState];
                            newState[index].factor = newValue;
                            return newState;
                          })
                        }
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextFieldComponent
                        defaultValue={review?.grade}
                        label={null}
                        type="number"
                        max={100}
                        globalSetter={(newValue: any) =>
                          setReviews((prevState: any) => {
                            let newState = [...prevState];
                            newState[index].grade = newValue;
                            return newState;
                          })
                        }
                      />
                    </TableCell>

                    <TableCell align="center">
                      {review.grade > 90 ? (
                        <Chip label="حسن" color="success" />
                      ) : review.grade > 75 ? (
                        <Chip label="انجام وظیفه" color="info" />
                      ) : review.grade > 0 ? (
                        <Chip label="عیب/نقص" color="error" />
                      ) : (
                        <Chip label="نمره نا معتبر" />
                      )}
                    </TableCell>

                    <TableCell align="center">
                      <TextFieldComponent
                        defaultValue={review?.effectiveness}
                        label={null}
                        type="number"
                        grade={review?.grade}
                        max={5}
                        globalSetter={(newValue: any) =>
                          setReviews((prevState: any) => {
                            let newState = [...prevState];
                            newState[index].effectiveness = newValue;
                            return newState;
                          })
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell align="center" colSpan={3}>
                    نتایج کلی
                  </TableCell>
                  <TableCell align="center">
                    {reviews.reduce(
                      (acc: any, curr: any) => acc + curr.factor,
                      0
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {(
                      reviews.reduce(
                        (acc: any, curr: any) => acc + curr.grade,
                        0
                      ) / reviews?.length
                    ).toFixed(2)}
                  </TableCell>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center">
                    {(
                      reviews.reduce(
                        (acc: any, curr: any) => acc + curr.effectiveness,
                        0
                      ) / reviews?.length
                    ).toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Box
              margin={'20px'}
              display={'flex'}
              flexDirection={'row'}
              justifyContent={'center'}
              alignItems={'centers'}
            >
              <Button
                variant="contained"
                onClick={() => {
                  setReviews((list: any) => [
                    ...list,
                    {
                      id: new Date().getTime(),
                      question: '',
                      factor: 0,
                    },
                  ]);
                }}
              >
                <Typography>افزودن پرسش</Typography>
              </Button>
            </Box>
          </TableContainer>
        </Grid>
        <Grid size={{ xs: 12 }} container spacing={2}>
          <Grid>
            <Button
              color="warning"
              variant="contained"
              onClick={() => {
                saveReviews(false);
              }}
            >
              <Typography>ذخیره</Typography>
            </Button>
          </Grid>
          <Grid>
            <Button
              color="success"
              variant="contained"
              onClick={() => {
                saveReviews(true);
              }}
            >
              <Typography>ثبت نهایی</Typography>
            </Button>
          </Grid>
          <Grid size={{ xs: 12 }}></Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
