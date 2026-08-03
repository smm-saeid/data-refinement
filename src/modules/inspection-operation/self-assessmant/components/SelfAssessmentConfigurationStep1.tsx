import { useMemo, useEffect, useState } from 'react';
import { Box, Grid, Typography, Paper, Button } from '@mui/material';
import moment from 'moment-jalaali';
import MatnaDatePicker from '@/components/date-picker/MatnaDatePicker';
import { dateDiff } from '@/modules/inspection-operation/scheduled/utils/utils.ts';
import DisabledTextInput from '@/components/DisabledTextInput.tsx';
import { useLegacyApi } from '@/hooks/useLegacyApi';
import { useMutation } from '@tanstack/react-query';

const SEASON_LABELS: Record<string, string> = {
  ONE_SEASON: 'سه ماهه اول',
  TWO_SEASON: 'سه ماهه دوم',
  THREE_SEASON: 'سه ماهه سوم',
  FOUR_SEASON: 'سه ماهه چهارم',
};

export default function SelfAssessmentConfigurationStep1({
  inspectionInformation,
  refetchStep,
}) {
  let legacyApi = useLegacyApi();

  const [duration, setDuration] = useState<{
    from: Date | null;
    to: Date | null;
  }>({
    from: null,
    to: null,
  });

  const { mutate } = useMutation({
    mutationFn: legacyApi.request,
  });

  useEffect(() => {
    setDuration({
      from: new Date(inspectionInformation.informationStartDate) as Date,
      to: new Date(inspectionInformation.informationEndDate) as Date,
    });
  }, []);

  const findWeekDays = () => {
    if (!!duration?.from && !!duration?.to) {
      let weekDaysCount = 0;
      let start = duration?.from.getDay();
      for (let i = 0; i < dateDiff(duration?.from, duration?.to); i++) {
        if ((start + i) % 7 != 5) {
          weekDaysCount++;
        }
      }
      return weekDaysCount;
    }
    return null;
  };

  const [errors, setErrors] = useState({});

  const durationDisplay = useMemo(() => {
    if (!duration.from && !duration.to) {
      return 'با استفاده از تقویم تاریخ بازرسی را انتخاب کنید.';
    }

    return (
      <Box sx={{ mt: 1 }}>
        <Typography variant="body2" gutterBottom>
          <strong>شروع بازه:</strong>{' '}
          {duration.from ? moment(duration.from).format('jYYYY/jMM/jDD') : '-'}
        </Typography>
        <Typography variant="body2" gutterBottom>
          <strong>اتمام بازه:</strong>{' '}
          {duration.to ? moment(duration.to).format('jYYYY/jMM/jDD') : '-'}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
          {findWeekDays()} روز کاری
        </Typography>
      </Box>
    );
  }, [duration.from, duration.to]);

  const season = inspectionInformation.season ?? 'ONE_SEASON';

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={3}>
        {/* Organization Unit Information */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              نام یگان انتخابی برای بازرسی
            </Typography>

            <Grid size={{ xs: 12 }}>
              <DisabledTextInput
                label={''}
                value={inspectionInformation?.organizationUnitName}
              />
            </Grid>

            {/* Duration Information */}
            <Box
              sx={{ mt: 3, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}
            >
              <Typography variant="h6" gutterBottom>
                مدت زمان بازرسی
              </Typography>
              {durationDisplay}
            </Box>
          </Paper>
        </Grid>

        {/* Date Picker Section */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              انتخاب تاریخ بازرسی{' '}
              {season ? '(' + SEASON_LABELS[season] + ')' : null}
            </Typography>

            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                {!!duration?.from || !!duration.to ? (
                  <>
                    <Typography>{'شروع بازه: '}</Typography>
                    <MatnaDatePicker
                      onChange={value => {
                        if (value == null) {
                          setDuration({ ...duration, from: null });
                        }
                        if (typeof value === 'string')
                          setDuration({ ...duration, from: new Date(value) });
                      }}
                      value={duration.from}
                      placeholder={'لطفا تاریخ را انتخاب کنید'}
                      error={errors['start']}
                    />
                    <Typography>{' اتمام بازه: '}</Typography>
                    <MatnaDatePicker
                      onChange={value => {
                        if (value == null) {
                          setDuration({ ...duration, to: null });
                        }
                        if (typeof value === 'string')
                          setDuration({ ...duration, to: new Date(value) });
                      }}
                      value={duration.to}
                      placeholder={'لطفا تاریخ را انتخاب کنید'}
                      error={errors['end']}
                    />
                  </>
                ) : (
                  <div />
                )}
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Box margin={'50px'}>
        <Grid container>
          <Grid size={{ xs: 8 }}>
            <Button
              variant={'contained'}
              onClick={() => {
                if (duration.from == null) {
                  setErrors({ start: 'تاریخ شروع نباید خالی باشد' });
                  return;
                }
                if (duration.to == null) {
                  setErrors({ end: 'تاریخ پایان نباید خالی باشد' });
                  return;
                }
                if (duration.from > duration.to) {
                  setErrors({
                    end: 'تاریخ پایان نباید زودتر از تاریخ شروع باشد.',
                  });
                  return;
                }
                if (season != null) {
                  if (moment(duration.from).jMonth() < 3) {
                    if (season != 'ONE_SEASON') {
                      setErrors({
                        start: ` تاریخ شروع بازرسی باید در بازه ${SEASON_LABELS[season]} سال باشد`,
                      });
                      return;
                    }
                  } else if (moment(duration.from).jMonth() < 3) {
                    if (season != 'TWO_SEASON') {
                      setErrors({
                        start: ` تاریخ شروع بازرسی باید در بازه ${SEASON_LABELS[season]} سال باشد`,
                      });
                      return;
                    }
                  } else if (moment(duration.from).jMonth() < 3) {
                    if (season != 'THREE_SEASON') {
                      setErrors({
                        start: ` تاریخ شروع بازرسی باید در بازه ${SEASON_LABELS[season]} سال باشد`,
                      });
                      return;
                    }
                  } else {
                    if (season != 'FOUR_SEASON') {
                      setErrors({
                        start: ` تاریخ شروع بازرسی باید در بازه ${SEASON_LABELS[season]} سال باشد`,
                      });
                      return;
                    }
                  }
                }
                mutate(
                  {
                    entity: `/information`,
                    method: !!inspectionInformation?.id ? 'put' : 'post',
                    data: {
                      ...inspectionInformation,
                      informationStartDate: duration.from,
                      informationEndDate: duration.to,
                      state: 'AHDAF',
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
              sx={{ margin: '10px' }}
            >
              ثبت و ادامه
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
