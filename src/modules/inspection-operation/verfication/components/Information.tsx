import React, { useMemo, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import moment from 'moment-jalaali';
import type { IRenderFormInput } from '@/types/render.ts';
import { useLegacyApi } from '@/hooks/useLegacyApi.ts';
import MatnaDatePicker from '@/components/date-picker/MatnaDatePicker.tsx';
import DisabledTextInput from 'components/DisabledTextInput.tsx';

const Information = ({
                                organizationUnitName,
                                duration,
                                setDuration,
                                dayNumber,
                                setDayNumber,
                              }: any) => {
  let legacyApi = useLegacyApi();

  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
    watch,
  } = useForm<{ value: string }>();
  type dataType = {
    name: string;
    program: any;
    status: string;
  };
  const [myData, setMyData] = useState<dataType>({
    status: 'unassign',
    name: '',
  } as dataType);
  const [autoCompleteValue, setAutoCompleteValue] = useState<any>(undefined);

  const ITEMS: Array<IRenderFormInput> = useMemo(
    () => [
      {
        name: 'organizationName',
        inputType: 'text',
        label: 'نام یگان',
        elementProps: {
          disabled: true,
        },
        value: organizationUnitName,
        defaultValue: organizationUnitName,
      },
    ],
    [organizationUnitName]
  );

  function datediff(first: any, second: any) {
    return Math.round(
      (second.getTime() - first.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  const findWeekDays = () => {
    if (!!duration?.from && !!duration?.to) {
      let weekDaysCount = 0;
      let start = duration?.from.getDay();
      for (let i = 0; i < datediff(duration?.from, duration?.to); i++) {
        if ((start + i) % 7 != 5) {
          weekDaysCount++;
        }
      }
      return weekDaysCount;
    }
    return null;
  };

  return (
    <Grid key={'INPUT_ITEM_'} size={{ xs: 12, md: 6 }} container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <Grid size={{ xs: 12 }} marginBottom={'20px'}>
          <Typography variant="h6">نام یگان انتخابی برای بازرسی</Typography>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <DisabledTextInput label={''} value={organizationUnitName} />
        </Grid>
      </Grid>
      <Grid size={{ xs: 12 }} textAlign="center">
        <Grid size={{ xs: 12 }} marginBottom={'20px'}>
          {/* <Chip label="مدت زمان بازرسی" color="secondary"/> */}
          <Typography sx={{ backgroundColor: 'lightsalmon' }} variant="h6">
            مدت زمان بازرسی
          </Typography>
        </Grid>
        <Grid size={{ xs: 12 }}>
          {!!duration?.from || !!duration.to ? (
            <>
              <Typography>
                {'شروع بازه: '}
                {duration?.from?.toString()
                  ? moment(duration?.from).format('jYYYY/jMM/jDD')
                  : '-'}
              </Typography>
              <MatnaDatePicker
                onChange={value => {
                  if (typeof value === 'string')
                    setDuration({ ...duration, from: new Date(value) });
                }}
                value={duration.from}
                placeholder={'لطفا تاریخ را انتخاب کنید'}
              />
              <Typography>
                {' اتمام بازه: '}
                {duration.to?.toString()
                  ? moment(duration.to).format('jYYYY/jMM/jDD')
                  : '-'}
              </Typography>
              <MatnaDatePicker
                onChange={value => {
                  if (typeof value === 'string')
                    setDuration({ ...duration, to: new Date(value) });
                }}
                value={duration.to}
                placeholder={'لطفا تاریخ را انتخاب کنید'}
              />
              <Typography margin={'5px'}>{findWeekDays()} روز کاری</Typography>
            </>
          ) : (
            <Typography>
              با استفاده از تقویم تاریخ بازرسی را انتخاب کنید.
            </Typography>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Information;
