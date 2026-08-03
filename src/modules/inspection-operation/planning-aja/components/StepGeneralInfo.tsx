import { Grid, Typography } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import RenderFormInput from '@/components/form/RenderFormInput';

export default function StepGeneralInfo() {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ mt: 2, fontWeight: 'bold' }}
        >
          اطلاعات پایه طرح‌ریزی
        </Typography>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Controller
          name="year"
          control={control}
          rules={{
            required: 'وارد کردن سال الزامی است',
            min: { value: 1300, message: 'سال معتبر وارد کنید' },
          }}
          render={({ field }) => (
            <RenderFormInput
              inputType="text"
              label="سال طرح ریزی"
              controllerField={field}
              errors={errors}
              name="year"
              type="number"
            />
          )}
        />
      </Grid>

      <Grid size={{xs:12, md:6}}>
        <Controller
          name="number"
          control={control}
          rules={{ required: 'وارد کردن تعداد کل الزامی است' }}
          render={({ field }) => (
            <RenderFormInput
              inputType="text"
              label="تعداد کل بازرسی‌های ارتش"
              controllerField={field}
              errors={errors}
              name="number"
              type="number"
            />
          )}
        />
      </Grid>
    </Grid>
  );
}
