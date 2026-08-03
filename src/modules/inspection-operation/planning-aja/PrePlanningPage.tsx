import { useState, useEffect, useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { Button, Grid, Box, CircularProgress, Typography } from '@mui/material';
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';

import BackButton from '@/components/button/BackButton';
import { PlanningLayout } from './components/PlanningLayout';
import StepGeneralInfo from './components/StepGeneralInfo';
import StepFunctionalInspection from './components/StepFunctionalInspection';
import StepProvincialInspection from './components/StepProvincialInspection';

import { useSnackbar } from '@/hooks/useSnackbar';
import { useApiQuery, useApiMutation } from '@/hooks/useApi';
import InspectionApis from '../api';

import {
  InspectionTypeLabels,
  PlanningStepsOrder,
  ProvincialStepKeys,
  Organization,
} from './types';

export default function PrePlanningPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const snackbar = useSnackbar();

  const [activeStep, setActiveStep] = useState(0);
  const [planId, setPlanId] = useState<string | number | undefined>(id);

  const tabLabels = useMemo(
    () => [
      'اطلاعات کلی',
      ...PlanningStepsOrder.map(key => InspectionTypeLabels[key]),
    ],
    []
  );

  const defaultValues = useMemo(() => {
    const values: any = {
      year: '',
      number: '',
    };

    PlanningStepsOrder.forEach(stepKey => {
      values[`total${stepKey}`] = 0;

      Object.values(Organization).forEach(orgKey => {
        values[`${orgKey}${stepKey}`] = 0;
      });

      if (ProvincialStepKeys.includes(stepKey)) {
        values[`provincial_${stepKey}`] = [];
      }
    });

    return values;
  }, []);

  const methods = useForm({
    mode: 'onChange',
    defaultValues,
  });

  const { data: planData, isFetching: isPlanFetching } = useApiQuery<any>({
    url: InspectionApis.annualPlanning.find(id || ''),
    enabled: !!id,
  });

  const { mutate: saveGeneralInfo, isPending: isSavingGeneral } =
    useApiMutation({
      url: InspectionApis.annualPlanning.list,
      method: id ? 'PUT' : 'POST',
    });

  const { mutate: saveFunctionalInfo, isPending: isSavingFunctional } =
    useApiMutation({
      url: InspectionApis.annualPlanning.saveNumber,
      method: 'POST',
    });

  const { mutate: saveProvincialInfo, isPending: isSavingProvincial } =
    useApiMutation({
      url: InspectionApis.annualPlanning.saveProvincial,
      method: 'POST',
    });

  const { mutate: acceptPrePlanning, isPending: isAcceptingPrePlanning } =
    useApiMutation({
      url: InspectionApis.annualPlanning.acceptPrePlanning(id),
      method: 'PUT',
    });

  useEffect(() => {
    if (planData?.data) {
      const formattedData: any = {
        year: planData.data.year,
        number: planData.data.number,
      };

      if (Array.isArray(planData.data.inspectionType)) {
        planData.data.inspectionType.forEach((inspectionType: any) => {
          formattedData[`total${inspectionType.key}`] = inspectionType.number;

          if (Array.isArray(inspectionType.organizations)) {
            inspectionType.organizations.forEach((forceItem: any) => {
              formattedData[`${forceItem.key}${inspectionType.key}`] =
                forceItem.number;
            });
          }

          if (ProvincialStepKeys.includes(inspectionType.key)) {
            formattedData[`provincial_${inspectionType.key}`] = [];
            if (Array.isArray(inspectionType.provinces)) {
              inspectionType.provinces.forEach(provinceSeason =>
                formattedData[`provincial_${inspectionType.key}`].push({
                  provinceId: provinceSeason.provinceId,
                  season: provinceSeason.season,
                  month: provinceSeason.month,
                })
              );
            }
          }
        });
      }

      methods.reset(formattedData);

      if (!planId) setPlanId(planData.data.id);
    }
  }, [planData, methods, planId]);

  const handleNext = () => {
    if (activeStep === 0) {
      methods.handleSubmit(data => {
        const payload = {
          year: Number(data.year),
          number: Number(data.number),
          ...(planId ? { id: planId } : {}),
        };

        saveGeneralInfo(payload, {
          onSuccess: (res: any) => {
            snackbar('اطلاعات پایه ثبت شد', 'success', 3000);
            const newId = res?.id || planId;
            setPlanId(newId);
            if (!id && newId)
              navigate(`/operation/planning/aja/${newId}/pre-planning`);
            proceedToNextStep();
          },
          onError: () => snackbar('خطا در ذخیره', 'error', 3000),
        });
      })();
      return;
    }

    const currentStepKey = PlanningStepsOrder[activeStep - 1];

    if (ProvincialStepKeys.includes(currentStepKey)) {
      methods.handleSubmit(data => {
        const payload = {
          annualPlanId: planId,
          inspectionTypeKey: currentStepKey,
          provinces: data[`provincial_${currentStepKey}`],
        };

        saveProvincialInfo(payload, {
          onSuccess: () => {
            snackbar('اطلاعات ثبت شد', 'success', 3000);
            proceedToNextStep();
          },
          onError: () => snackbar('خطا در ثبت', 'error', 3000),
        });
      })();

      return;
    }

    // --- Scenario 3: Functional Steps ---
    methods.handleSubmit(data => {
      const payload = {
        annualPlanningId: planId,
        key: currentStepKey,
        number: Number(data[`total${currentStepKey}`] || 0),
        [Organization.Nezaja]: Number(
          data[`${Organization.Nezaja}${currentStepKey}`] || 0
        ),
        [Organization.Nedaja]: Number(
          data[`${Organization.Nedaja}${currentStepKey}`] || 0
        ),
        [Organization.Nehaja]: Number(
          data[`${Organization.Nehaja}${currentStepKey}`] || 0
        ),
        [Organization.Nepaja]: Number(
          data[`${Organization.Nepaja}${currentStepKey}`] || 0
        ),
        [Organization.Sayer]: Number(
          data[`${Organization.Sayer}${currentStepKey}`] || 0
        ),
      };

      saveFunctionalInfo(payload, {
        onSuccess: () => {
          snackbar('اطلاعات ثبت شد', 'success', 3000);
          proceedToNextStep();
        },
        onError: () => snackbar('خطا در ثبت', 'error', 3000),
      });
    })();
  };

  const proceedToNextStep = () => {
    if (activeStep === tabLabels.length - 1) {
      acceptPrePlanning(
        {},
        {
          onSuccess: () => {
            snackbar('طرح ریزی اولیه به اتمام رسید', 'success', 3000);
            navigate('/operation/planning/aja');
          },
          onError: () => snackbar('خطا در ثبت', 'error', 3000),
        }
      );
    } else {
      setActiveStep(prev => prev + 1);
    }
  };

  const renderStepContent = () => {
    if (activeStep === 0) return <StepGeneralInfo />;

    const currentKey = PlanningStepsOrder[activeStep - 1];

    if (ProvincialStepKeys.includes(currentKey)) {
      return (
        <StepProvincialInspection
          key={currentKey}
          stepKey={currentKey}
          stepTitle={tabLabels[activeStep]}
        />
      );
    }

    return (
      <StepFunctionalInspection
        key={currentKey}
        stepKey={currentKey}
        stepTitle={tabLabels[activeStep]}
      />
    );
  };

  const isLoadingAction =
    isSavingGeneral || isSavingFunctional || isSavingProvincial || isAcceptingPrePlanning;

  return (
    <FormProvider {...methods}>
      <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
        <Typography
          variant="h6"
          component="div"
          fontWeight="bold"
          color="primary"
        >
          {!id ? 'ایجاد طرح ریزی جدید' : 'ویرایش طرح ریزی'}
        </Typography>
        <BackButton
          onBack={() => navigate('/operation/planning/aja')}
          minWidth={150}
          text="بازگشت"
          color="primary"
        />
      </Box>

      <PlanningLayout
        tabs={tabLabels}
        activeStep={activeStep}
        onStepChange={step => {
          if (!planId && step > 0) {
            snackbar('لطفا ابتدا اطلاعات پایه را ثبت کنید', 'warning', 3000);
            return;
          }

          setActiveStep(step);
        }}
        footer={
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid>
              <Button
                onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
                disabled={activeStep === 0 || isLoadingAction}
                variant="outlined"
                startIcon={<ArrowForwardIos />}
              >
                مرحله قبل
              </Button>
            </Grid>
            <Grid>
              <Button
                onClick={handleNext}
                variant="contained"
                color="primary"
                endIcon={
                  isLoadingAction ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <ArrowBackIosNew />
                  )
                }
                disabled={isLoadingAction}
              >
                {activeStep === tabLabels.length - 1
                  ? 'ثبت نهایی'
                  : 'ثبت و مرحله بعد'}
              </Button>
            </Grid>
          </Grid>
        }
      >
        {isPlanFetching ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="300px"
          >
            <CircularProgress />
          </Box>
        ) : (
          renderStepContent()
        )}
      </PlanningLayout>
    </FormProvider>
  );
}
