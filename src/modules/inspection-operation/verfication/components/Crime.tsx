import { Check, Delete } from '@mui/icons-material';
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
  Fab,
  Tooltip,
} from '@mui/material';
import { useSnackbar } from 'hooks/useSnackbar';
import { useEffect, useState } from 'react';
import InspectionApis from '../../api';
import { useApiMutation, useApiQuery } from '@/hooks/useApi';

type Props = { editable: boolean };

export default function Crime  ({ editable }: Props) {
  const snackbar = useSnackbar();
  const { mutate: createCrimeMutate } = useApiMutation({
    url: InspectionApis.verfication.independentReportVoilationSaveAll,
    method: 'POST',
  });
  const [autoCompleteValue, setAutoCompleteValue] = useState<any>(undefined);
  const [myData, setMyData] = useState([] as any[]);

  const { data: crimeReport } = useApiQuery<any>({
    url: InspectionApis.verfication.independentReportCrime,
  });

  const { data: crimeList } = useApiQuery<any>({
    url: InspectionApis.verfication.crimeType,
  });

  useEffect(() => {
    if (!!crimeReport) setMyData(crimeReport?.data);
  }, [crimeReport]);

  function handleChange(indx: number, title: string, value: any) {
    setMyData(() => {
      const newData = [...myData];
      newData[indx][title] = value;
      return newData;
    });
  }
  function handleAddRow(newvalue: any) {
    if (!myData?.some(item => item?.violationAndCrimeTypeId === newvalue?.id))
      setMyData(() => {
        const newData = [
          ...myData,
          {
            inspectionId: myData[0]['inspectionId'],
            organizationUnitId: myData[0]['organizationUnitId'],
            organizationUnitName: myData[0]['organizationUnitName'],
            violationAndCrimeTypeId: newvalue?.id,
            violationAndCrimeTypeName: newvalue?.name ?? '',
            type: 'jorm',
            duty: 0,
            staff: 0,
          },
        ];
        return newData;
      });
    else snackbar('این جرم موجود میباشد', 'error', 5000);
  }

  const submitHandler = () => {
    createCrimeMutate(
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
            فرم جرائم یگان
          </Typography>
        </Box>
        {editable ? (
          <Box display="flex">
            <Autocomplete
              id="crime"
              onChange={(event: any, newValue: any) => {
                if (newValue?.id) {
                  handleAddRow(newValue);
                }

                setAutoCompleteValue(undefined);
              }}
              renderOption={(props: any, option: any) => (
                <li {...props} key={option.id}>
                  {option.name}
                </li>
              )}
              value={autoCompleteValue}
              inputValue={autoCompleteValue}
              clearOnBlur
              options={crimeList?.data ?? []}
              sx={{ width: 150, mr: 2 }}
              getOptionLabel={(option: any) => option.name}
              renderInput={(params: any) => (
                <TextField {...params} label="افزودن جرائم " />
              )}
              isOptionEqualToValue={(option, value) => {
                return `${option?.id}` === `${value.id}`;
              }}
            />
            <Button
              variant="contained"
              endIcon={<Check />}
              sx={{ minWidth: '150px', mb: 2 }}
              onClick={submitHandler}
            >
              ثبت تغیرات
            </Button>
          </Box>
        ) : null}
      </Grid>
      <Grid
        size={{ md: 12 }}
        container
        m={2}
        display={'flex'}
        justifyContent={'space-between'}
      >
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ bgcolor: 'lightsalmon', borderColor: 'black' }}>
              <TableRow>
                <TableCell
                  rowSpan={2}
                  align="center"
                  sx={{ border: 'solid 1px black' }}
                >
                  ردیف
                </TableCell>
                <TableCell
                  rowSpan={2}
                  align="center"
                  sx={{
                    textAlign: 'start',
                    border: 'solid 1px black',
                    width: '50%',
                  }}
                >
                  نوع تخلف
                </TableCell>
                <TableCell
                  colSpan={2}
                  align="center"
                  sx={{ textAlign: 'start', border: 'solid 1px black' }}
                >
                  کارکنان
                </TableCell>
                <TableCell
                  rowSpan={2}
                  align="center"
                  sx={{ textAlign: 'start', border: 'solid 1px black' }}
                >
                  جمع کل
                </TableCell>
                {editable ? (
                  <TableCell
                    rowSpan={2}
                    align="center"
                    sx={{ textAlign: 'start', border: 'solid 1px black' }}
                  >
                    حذف
                  </TableCell>
                ) : null}
              </TableRow>
              <TableRow>
                <TableCell
                  align="center"
                  sx={{ textAlign: 'start', border: 'solid 1px black' }}
                >
                  پایور
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ textAlign: 'start', border: 'solid 1px black' }}
                >
                  وظیفه
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {myData?.map((item: any, index: number) => (
                <TableRow key={index}>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell>
                    {editable ? (
                      <TextField
                        value={item?.violationAndCrimeTypeName}
                        onChange={e => {
                          handleChange(
                            index,
                            'violationAndCrimeTypeName',
                            e.target.value
                          );
                        }}
                        fullWidth
                      />
                    ) : (
                      item?.violationAndCrimeTypeName
                    )}
                  </TableCell>
                  <TableCell>
                    {editable ? (
                      <TextField
                        value={item?.staff}
                        onChange={(e: any) => {
                          if (!isNaN(e.target.value))
                            handleChange(index, 'staff', e.target.value);
                        }}
                        fullWidth
                      />
                    ) : (
                      item?.staff
                    )}
                  </TableCell>
                  <TableCell>
                    {editable ? (
                      <TextField
                        value={item?.duty}
                        onChange={(e: any) => {
                          if (!isNaN(e.target.value))
                            handleChange(index, 'duty', e.target.value);
                        }}
                        fullWidth
                      />
                    ) : (
                      item?.duty
                    )}
                  </TableCell>
                  <TableCell>
                    {Number(item?.duty) + Number(item?.staff)}
                  </TableCell>
                  {editable ? (
                    <TableCell>
                      <Tooltip title="حذف">
                        <Fab
                          size="small"
                          color="error"
                          onClick={() =>
                            setMyData(prev =>
                              prev?.filter(
                                deleteTtem =>
                                  item.violationAndCrimeTypeId !==
                                  deleteTtem.violationAndCrimeTypeId
                              )
                            )
                          }
                        >
                          <Delete fontSize="small" />
                        </Fab>
                      </Tooltip>
                    </TableCell>
                  ) : null}
                </TableRow>
              ))}
              {/* ))} */}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};
