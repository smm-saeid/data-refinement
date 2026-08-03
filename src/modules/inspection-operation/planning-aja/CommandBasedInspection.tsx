import {
  Autocomplete,
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';

import { useQueryClient } from '@tanstack/react-query';

import { useSnackbar } from '@/hooks/useSnackbar';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';
import '../planning-aja/styles/planning-crud.css';
import BackButton from '@/components/button/BackButton';
import { Deputies, DeputiesEnum, type Plan } from '../types';
import CommandBasedInspectionSeason from './CommandBasedInspectionSeason';
import { type IExcelForm, type Unit } from '../types';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { useApiMutation, useApiQuery } from '@/hooks/useApi';
import InspectionApis from '../api';
import { PAGINATION_DEFAULT_VALUE_OLD } from '@/types/api';

const steps = ['سه ماهه اول', 'سه ماهه دوم', 'سه ماهه سوم', 'سه ماهه چهارم'];

export default function CommandBasedInspection() {
  let { id, deputy } = useParams();
  type TCrudType = 'CREATE' | 'VIEW' | 'EDIT';
  const mode: TCrudType = !id ? 'CREATE' : 'EDIT';
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const queryClient = useQueryClient();
  const [autoCompleteValue, setAutoCompleteValue] = useState<any>(undefined);

  const { mutate: createInspectionMutate } = useApiMutation({
    url: InspectionApis.cities.citiesWithoutId,
  });

  const { handleSubmit } = useForm();

  const { data: plan } = useApiQuery<Plan>({
    url: InspectionApis.CommandBaseInspection.base,
  });

  const { data: inspectionList } = useApiQuery<Array<IExcelForm>>({
    url: InspectionApis.CommandBaseInspection.list,
  });

  const { data: units } = useApiQuery<Array<Unit>>({
    url: InspectionApis.organizations.list,
    params: PAGINATION_DEFAULT_VALUE_OLD,
  });

  const [planState, setPlanState] = useState<Array<IExcelForm>>([]);

  useEffect(() => {
    console.log('data =>', inspectionList);
    setPlanState(
      inspectionList?.data?.filter(item => item.type == 7) as Array<IExcelForm>
    );
  }, [inspectionList]);

  useEffect(() => {
    console.log('planState =>', planState);
  }, [planState]);

  const onSubmitHandler = (data: any) => {
    const params = { ...data };
    createInspectionMutate(
      {
        method: mode === 'CREATE' ? 'post' : 'put',
        data: {
          ...(mode === 'EDIT' ? { id: params?.id } : {}),
          ...params,
        },
      } as any,
      {
        onSuccess: () => {
          queryClient.refetchQueries({ queryKey: ['city'] });
          snackbar('عملیات با موفقیت انجام شد', 'success', 5000);
        },
        onError: () => snackbar('خطا در انجام عملیات', 'error', 5000),
      }
    );
  };

  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    if (activeStep === steps.length - 1)
      navigate('/inspection/planning/professional-deputies');
    else setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleStep = (step: number) => {
    console.log('ACTIV STEP fired');
    setActiveStep(step);
  };

  const renderTable = (planState: Array<IExcelForm>) => {
    const tableRows: Array<any> = [];
    console.log('ps', planState);

    const commandBasedInspections = (planState ?? [])?.filter(item =>
      [activeStep * 3, activeStep * 3 + 1, activeStep * 3 + 2].includes(
        item.month
      )
    );
    if (commandBasedInspections) {
      commandBasedInspections.forEach((plannedUnit: IExcelForm) => {
        tableRows.push(
          <tr key={plannedUnit.id}>
            <TableCell width="35%">{plannedUnit.organizationName}</TableCell>
            <TableCell width="55%">{plannedUnit.unitName}</TableCell>

            <TableCell>
              <Tooltip title="حذف" arrow>
                <IconButton
                  color="error"
                  onClick={() => handleDeleteItem(plannedUnit.id)}
                >
                  <DeleteOutlineOutlinedIcon />
                </IconButton>
              </Tooltip>
            </TableCell>
          </tr>
        );
      });
    }

    return (
      <Table sx={{ marginBlockStart: '12px', width: '100%' }}>
        <TableHead>
          <tr>
            <th>نیرو</th>
            <th>یگان</th>
            <th>عملیات</th>
          </tr>
        </TableHead>
        <TableBody>{tableRows}</TableBody>
      </Table>
    );
  };

  const handleAutoComplete = (newValue: any) => {
    setPlanState([
      {
        id: newValue.id,
        unitName: newValue.name,
        organizationName: newValue.parentName,
        unitNature: 'n',
        unitPoint: 0,
        month: activeStep * 3 + 1,
        type: 7,
        region: 's',
        provinceKey: 'a',
      },
      ...planState,
    ]);

    console.log(planState);
  };

  const handleDeleteItem = (index: string) => {
    console.log(index);

    const newUnits = planState.filter(
      (unit: IExcelForm) => !(unit.id == index)
    );

    setAutoCompleteValue(undefined);
    setPlanState(newUnits);
  };

  return (
    <>
      <Grid container justifyContent="center" alignItems={'center'} spacing={1}>
        <Grid size={{ md: 11 }}>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmitHandler)}
            sx={{ borderRadius: '10px', marginTop: '20px', p: 2 }}
          >
            <Box display="flex" justifyContent={'space-between'} mb={1}>
              <Typography component="h3" variant="h6">
                {'ویرایش بازرسیهای بنا به دستور سال'} {plan?.data?.YEAR}
                {Deputies[deputy as DeputiesEnum]}
              </Typography>
              <BackButton
                text="بازگشت"
                color="primary"
                minWidth={300}
                onBack={() => navigate('/inspection/planning/AJA-planning')}
              />
            </Box>
            <Grid container>
              <Grid size={{ md: 12 }}>
                <CommandBasedInspectionSeason
                  click={handleStep}
                  data={steps}
                  selected={activeStep}
                />
              </Grid>
              {
                <Paper
                  sx={{
                    width: '100%',
                    backgroundColor: theme =>
                      theme.palette.mode === 'dark' ? '#121212' : '#eee',
                    paddingX: 3,
                    pb: 2,
                  }}
                >
                  {
                    <Grid container alignContent="center">
                      <Grid size={{ xs: 12, sm: 6, md: 12, lg: 3 }}>
                        <Typography sx={{ mt: 5, mb: 2 }}>
                          انتخاب یگان جهت بازرسی در این فصل:
                        </Typography>
                        {/* &nbsp; */}

                        <Autocomplete
                          id="unitName"
                          onChange={(newValue: any) => {
                            // console.log(reason);
                            if (newValue?.id) {
                              handleAutoComplete(newValue);
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
                          onBlur={() => {
                            // console.log("blur");
                          }}
                          clearOnBlur
                          options={
                            units?.data?.map(item => ({
                              id: item.id,
                              name: item.name,
                              parentName: item.parentName,
                            })) ?? []
                          }
                          sx={{ width: 400 }}
                          getOptionLabel={(option: any) => option.name}
                          renderInput={(params: any) => (
                            <TextField {...params} label="نام یگان" />
                          )}
                        />
                      </Grid>

                      <Grid size={{ md: 12 }}>{renderTable(planState)}</Grid>
                    </Grid>
                  }

                  <Grid
                    container
                    sx={{ pt: 5, justifyContent: 'space-between' }}
                  >
                    <Grid size={{ xs: 12, md: 8 }}>
                      <Button
                        onClick={handleBack}
                        disabled={activeStep === 0}
                        startIcon={<ArrowForwardIos />}
                      >
                        مرحله قبل
                      </Button>
                    </Grid>

                    {activeStep === steps.length - 1 ? (
                      <Grid>
                        <Button
                          onClick={handleNext}
                          endIcon={<ArrowBackIosNew />}
                        >
                          ثبت نهایی
                        </Button>
                      </Grid>
                    ) : (
                      <Grid>
                        <Button
                          onClick={handleNext}
                          endIcon={<ArrowBackIosNew />}
                        >
                          ثبت و مرحله بعد
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                </Paper>
              }
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
