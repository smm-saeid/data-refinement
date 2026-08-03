import { Grid, Typography, Divider, Paper, Box } from '@mui/material';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import RenderFormInput from '@/components/form/RenderFormInput';
import {
  OrganizationOptions,
  PlanningStepsOrder,
  ProvincialStepKeys,
} from '../types';

type Props = {
  stepKey: string;
  stepTitle: string;
};

export default function StepFunctionalInspection({
  stepKey,
  stepTitle,
}: Props) {
  const {
    control,
    trigger,
    formState: { errors },
  } = useFormContext();

  const totalPlanLimit = useWatch({ control, name: 'number' }) || 0;
  const allFunctionalKeys = PlanningStepsOrder.filter(
    key => !ProvincialStepKeys.includes(key)
  );
  const allTotalFieldNames = allFunctionalKeys.map(key => `total${key}`);
  const allAllocatedValues = useWatch({ control, name: allTotalFieldNames });
  const totalAllocatedSoFar = (allAllocatedValues || []).reduce(
    (acc: number, val: any) => acc + (Number(val) || 0),
    0
  );
  const globalRemaining = Number(totalPlanLimit) - totalAllocatedSoFar;

  const currentTypeTotal = useWatch({ control, name: `total${stepKey}` }) || 0;
  const forceFields = OrganizationOptions.map(org => `${org.key}${stepKey}`);
  const forcesValues = useWatch({ control, name: forceFields });
  const sumOfForces = (forcesValues || []).reduce(
    (acc: number, val: string | number) => acc + (Number(val) || 0),
    0
  );
  const localRemaining = (Number(currentTypeTotal) || 0) - sumOfForces;

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 2,
            backgroundColor: '#e3f2fd',
            border: '1px solid #90caf9',
            borderRadius: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Box>
            <Typography variant="body2" color="textSecondary">
              تعداد کل مصوب:
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {totalPlanLimit}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              مجموع توزیع شده:
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {totalAllocatedSoFar}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'left' }}>
            <Typography variant="body2" color="textSecondary">
              باقیمانده کل:
            </Typography>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{
                color: globalRemaining < 0 ? 'error.main' : 'success.main',
              }}
            >
              {globalRemaining}
            </Typography>
          </Box>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{ fontWeight: 'bold' }}
        >
          تعیین سقف بازرسی: {stepTitle}
        </Typography>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Controller
          name={`total${stepKey}`}
          control={control}
          rules={{
            required: 'تعیین تعداد کل الزامی است',
            pattern: {
              value: /^[0-9]+$/,
              message: 'لطفا عدد وارد کنید.'
            },
            max: {
              value: globalRemaining + currentTypeTotal,
              message:
                'تعداد بازرسی این نوع نمیتواند از تعداد کل باقیمانده بازرسی بیشتر باشد',
            },
          }}
          render={({ field }) => (
            <RenderFormInput
              inputType="text"
              label={`مجموع کل ${stepTitle}`}
              controllerField={field}
              errors={errors}
              name={`total${stepKey}`}
              type="number"
            />
          )}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle2" gutterBottom component="div">
          بازرسی تفکیکی نیرو &nbsp;
          <span
            style={{
              fontWeight: 'bold',
              fontSize: '0.9em',
              color: localRemaining === 0 ? 'green' : 'red',
            }}
          >
            (توزیع نشده: {localRemaining})
          </span>
        </Typography>
      </Grid>

      {OrganizationOptions.map(org => (
        <Grid size={{ xs: 12, md: 2.4 }} key={org.key}>
          <Controller
            name={`${org.key}${stepKey}`}
            control={control}
            rules={{
              required: 'تعیین تعداد تفکیکی نیرو الزامی است',

              pattern: {
                value: /^[0-9]+$/,
                message: 'لطفا عدد وارد کنید.'
              },
              validate: (_value, _formValues) => {
                if(localRemaining == 0) return true;
                return 'توزیع بین نیروها رعایت نشده است.';
              }
            }}
            render={({ field }) => (
              <RenderFormInput
                inputType="text"
                label={org.label}
                controllerField={field}
                errors={errors}
                name={`${org.key}${stepKey}`}
                type="number"
                onChange={() => setTimeout(() => trigger(forceFields), 100)}
              />
            )}
          />
        </Grid>
      ))}
    </Grid>
  );
}
