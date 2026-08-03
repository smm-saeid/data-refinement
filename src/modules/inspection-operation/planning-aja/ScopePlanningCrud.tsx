import {
  Autocomplete,
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'hooks/useSnackbar';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import type { TCrudType } from '../types';
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';
import BackButton from '@/components/button/BackButton';
import DeputySeason from './DeputySeason';
import { useLegacyApi } from '@/hooks/useLegacyApi';
import { useApiQuery } from '@/hooks/useApi';
import InspectionApis from '../api';
import UnitsTable from '../deputy-planning/components/UnitsTable';
import { SeasonOptions } from 'modules/inspection-operation/planning-aja/types.ts';

const steps = ['سه ماهه اول', 'سه ماهه دوم', 'سه ماهه سوم', 'سه ماهه چهارم'];

export default function ScopePlanningCrud() {
  let { id } = useParams();
  const mode: TCrudType = !id ? 'CREATE' : 'EDIT';
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const queryClient = useQueryClient();
  const legacyApi = useLegacyApi();
  const seasonIndex = [
    'first_season',
    'secound_season',
    'third_season',
    'fourth_season',
  ];
  const [autoCompleteValue, setAutoCompleteValue] = useState<any>(undefined);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [searchText, setSearchText] = useState('');

  const { mutate } = useMutation({
    mutationFn: legacyApi.request,
  });

  const { handleSubmit } = useForm();

  type DeputiIncomingApi = {
    id?: string;
    title?: string;
    year: number;
    organizationDeputyId?: string;
    season:
      'first_season' | 'secound_season' | 'third_season' | 'fourth_season';
    organizations: {
      id: string;
      name: string;
      parentName: string;
      parentId: string;
    }[];
  };
  type DeputiesDataType = {
    year: number;
    season: string;
    organizations: {
      id: string;
      name: string;
      parentName: string;
      parentId: string;
    }[];
  };
  const [activeStep, setActiveStep] = React.useState(0);

  const { data: seasonData } = useApiQuery({
    url: InspectionApis.scopePlanning.findBySeason(
      SeasonOptions[activeStep].value
    ),
    select: (res: any) => res.data as DeputiIncomingApi,
  });

  const { data: userData } = useApiQuery({
    url: InspectionApis.scopePlanning.getScope(),
    select: (res: any) => res.data,
  });

  const [planState, setPlanState] = useState<DeputiesDataType>({
    season: 'first_season',
    organizations: [],
  } as DeputiesDataType);
  console.log(planState);

  useEffect(() => {
    setPlanState({
      year: seasonData?.year,
      season: seasonData?.season,
      organizations: seasonData?.organizations,
    });
  }, [seasonData]);

  const { data: units } = useApiQuery({
    url: InspectionApis.ExpertSuperVision.oraganizations,
    params: { currentPage: 1, pageSize: 987, q: searchText },
    select: (res: any) => res.data as any,
  });

  const onSubmitHandler = (data: any) => {
    const params = { ...data };
    mutate(
      {
        entity: `cities`,
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

  const handleAddItem = () => {
    if (selectedUnit === null || selectedUnit === undefined) {
      return snackbar('لطفا یگان را انتخاب کنید.', 'error', 5000);
    }

    const currentOrganizations = planState.organizations || [];

    if (currentOrganizations.find(i => i.id === selectedUnit.id)) {
      return snackbar('این یگان قبلا انتخاب شده است.', 'error', 5000);
    }

    setPlanState(prev => ({
      ...prev,
      organizations: [...(prev.organizations || []), selectedUnit],
    }));
  };
  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      mutate(
        {
          entity: `expert-supervision/save-to-cartable?organizationDeputyId=${seasonData?.organizationDeputyId}`,
          method: 'post',
        } as any,
        {
          onSuccess: () => {
            navigate('/');
          },
        }
      );
      //call save-all api to save the fourth page and navigate to cartable
      mutate(
        {
          entity: `expert-supervision/save-all/type/scope`,
          method: 'post',
          data: planState,
        } as any,
        {
          onSuccess: () => {
            if (activeStep === steps.length - 1) navigate('/');
            else {
              setActiveStep(prevActiveStep => prevActiveStep + 1);
              setPlanState((previousState: DeputiesDataType) => ({
                ...previousState,
                season: seasonIndex[activeStep + 1],
              }));
            }
          },
        }
      );
    } else {
      mutate(
        {
          entity: `expert-supervision/save-all/type/scope`,
          method: 'post',
          data: planState,
        } as any,
        {
          onSuccess: () => {
            if (activeStep === steps.length - 1)
              navigate('/operation/planning/scope');
            else {
              setActiveStep(prevActiveStep => prevActiveStep + 1);
              setPlanState((previousState: DeputiesDataType) => ({
                ...previousState,
                season: seasonIndex[activeStep + 1],
              }));
            }
          },
        }
      );
    }
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
    setPlanState((previousState: DeputiesDataType) => ({
      ...previousState,
      season: seasonIndex[activeStep - 1],
    }));
  };

  const handleStep = (e: React.SyntheticEvent, step: number) => {
    console.log('ACTIV STEP fired');
    setActiveStep(step);
    setPlanState((previousState: DeputiesDataType) => ({
      ...previousState,
      season: seasonIndex[step],
    }));
  };

  const handleDeleteItem = (id: string) => {
    setPlanState((previousState: DeputiesDataType) => {
      return {
        ...previousState,
        organizations: previousState?.organizations?.filter(
          item => item.id !== id
        ),
      };
    });
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
              <Typography component="h3" variant="h5" fontWeight={'bold'}>
                طرح ریزی حوزه {userData?.organization?.name}
              </Typography>
              <BackButton
                color="warning"
                minWidth={'150px'}
                text="بازگشت"
                key={null}
                onBack={() => navigate('/operation/planning/scope')}
              />
            </Box>

            <Grid container>
              <Grid
                size={{ md: 4 }}
                display={'flex'}
                justifyContent={'flex-start'}
              >
                <Autocomplete
                  id="unitName"
                  value={selectedUnit}
                  onChange={(e, newValue: any) => {
                    setSelectedUnit(newValue);
                  }}
                  inputValue={searchText}
                  onInputChange={(event, newInputValue) => {
                    setSearchText(newInputValue);
                  }}
                  renderOption={(props: any, option: any) => (
                    <li {...props} key={option.id}>
                      {option.name}
                    </li>
                  )}
                  clearOnBlur
                  options={
                    units?.map(item => ({
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
                  isOptionEqualToValue={(option, value) => {
                    return `${option?.id}` === `${value.id}`;
                  }}
                  filterOptions={options => options}
                />
              </Grid>
              <Grid
                display={'flex'}
                justifyContent={'flex-end'}
                size={{ md: 2 }}
              >
                <Button
                  variant="contained"
                  color="info"
                  sx={{ paddingX: '50px', marginTop: '10px' }}
                  onClick={() => handleAddItem()}
                >
                  افزودن یگان
                </Button>
              </Grid>
            </Grid>
            <Grid container>
              <Grid size={{ md: 12 }}>
                <DeputySeason
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
                    <Grid
                      container
                      alignContent="center"
                      className="styledTable"
                    >
                      <UnitsTable
                        units={planState?.organizations}
                        handleDeleteItem={handleDeleteItem}
                      />
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
