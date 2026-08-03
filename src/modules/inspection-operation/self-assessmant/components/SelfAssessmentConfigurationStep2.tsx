import { useLegacyApi } from '@/hooks/useLegacyApi';
import { Button, Grid, Paper, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';

export default function SelfAssessmentConfigurationStep2({
  inspectionInformation,
  refetchStep,
}) {
  const legacyApi = useLegacyApi();
  const { mutate } = useMutation({
    mutationFn: legacyApi.request,
  });
  return (
    <Grid size={{ md: 11 }} justifyContent={'start'}>
      <Paper sx={{ p: 4 }} elevation={3}>
        <Typography variant="h4" fontWeight={700} fontSize={24} sx={{ pb: 4 }}>
          اهداف بازرسی
        </Typography>
        <Typography
          variant="body1"
          fontWeight={400}
          fontSize={20}
          sx={{ pb: 2 }}
        >
          الف ) افزایش انگیزه خودکنترلی، جوشش از درون و کاهش حضور بازرسین در
          یگان ها و استفاده از حداکثر امکانات، تجهیزات و نیرونی انسانی موجود در
          نیروها و یگان های تابعه ستاد آجا.
        </Typography>
        <Typography
          variant="body1"
          fontWeight={400}
          fontSize={20}
          sx={{ pb: 2 }}
        >
          ب ) صرفه جویی و کاهش هزینه های جابجایی، ترابری، تغذیه و اسکان بازرسان
          و به حداقل رساندن خطرات و آسیب های احتمالی به هنگام اجرای بازرسی.
        </Typography>
        <Typography
          variant="body1"
          fontWeight={400}
          fontSize={20}
          sx={{ pb: 2 }}
        >
          پ ) ایجاد زمان مناسب جهت برنامه ریزی منطقی برای فرماندهان و مسئولین در
          یگان ها.
        </Typography>
        <Typography
          variant="body1"
          fontWeight={400}
          fontSize={20}
          sx={{ pb: 2 }}
        >
          ت‌ ) افزایش انگیزه یگان ها و کارکنان در جهت پیگیری و رفع به موقع معایب
          و نواقص یگان مربوط با انجام تشویقات و تنبیهات برابر آیین نامه انضباطی
          نیروهای مسلح جمهوری اسلامی ایران.
        </Typography>
        <Typography
          variant="body1"
          fontWeight={400}
          fontSize={20}
          sx={{ pb: 2 }}
        >
          ث ) ارزیابی پیشرفت عملکرد یگان ها و کارکنان مربوطه در سطوح مختلف و
          حصول اطمینان از تداوم آمادگی کارکنان و تجهیزات یگان ها.
        </Typography>
        <Typography
          variant="body1"
          fontWeight={400}
          fontSize={20}
          sx={{ pb: 2 }}
        >
          ج ) تسهیل و تسریع در اجرای بازرسی و کسب نتایج بهتر و افزایش حس اعتماد
          و امانت داری و ارتقاء بهره وری و افزایش انگیزه بیشتر فرماندهان.
        </Typography>
        <Typography
          variant="body1"
          fontWeight={400}
          fontSize={20}
          sx={{ pb: 2 }}
        >
          چ ) نهادینه شدن فرهنگ خودارزیابی و خودباوری و آموزش همگانی کارکنان
          یگان های بازرسی شونده با نحوه اجرای صحیح بازرسی.
        </Typography>
        <Typography
          variant="body1"
          fontWeight={400}
          fontSize={20}
          sx={{ pb: 2 }}
        >
          ح ) آگاهی کارکنان در کلیه سطوح ازمعایب و نواقص خود و میزان اختیارات و
          شرح وظایف محوله.
        </Typography>
        <Typography
          variant="body1"
          fontWeight={400}
          fontSize={20}
          sx={{ pb: 2 }}
        >
          خ ) ارزیابی میزان تلاش های سلسله مراتب و مسئولین ذیربط یگان ها در جهت
          رفع معایب و نواقص مشهوده در بازرسی های قبلی.
        </Typography>
      </Paper>

      <Button
        variant="contained"
        color="error"
        onClick={() => {
          mutate(
            {
              entity: `/information`,
              method: 'put',
              data: {
                ...inspectionInformation,
                state: 'MOSHAKHASAT_ESTEHZARIYE',
              },
            } as any,
            {
              onSuccess: (_: any) => {
                refetchStep();
              },
              onError: () => {},
            }
          );
        }}
        sx={{ margin: '10px' }}
      >
        مرحله قبل
      </Button>

      <Button
        variant="contained"
        onClick={() => {
          mutate(
            {
              entity: `/information`,
              method: !!inspectionInformation?.id ? 'put' : 'post',
              data: {
                ...inspectionInformation,
                state: 'TAKHASOS_ESTEHZARIYE',
                issuanceInformation: null,
                issuanceInstruction: null,
              },
            } as any,
            {
              onSuccess: (_: any) => {
                refetchStep();
              },
              onError: () => {},
            }
          );
        }}
      >
        ثبت و ادامه
      </Button>
    </Grid>
  );
}
