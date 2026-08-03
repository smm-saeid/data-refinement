import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import DisabledTextInput from '@/components/DisabledTextInput';
import { useSnackbar } from '@/hooks/useSnackbar';
import { useLegacyApi } from '@/hooks/useLegacyApi';
import BackButton from '@/components/button/BackButton';

export default function UnitStatsForm() {
  const { id } = useParams();
  const snackbar = useSnackbar();
  const navigate = useNavigate();
  const legacyApi = useLegacyApi();
  const [personnelNumber, setPersonnelNumber] = React.useState('');
  const [organizationUnitId, setOrganizationUnitId] = useState('')
  const [bossJob, setBossJob] = React.useState('');
  const [staffOrgStatistics, setStaffOrgStatistics] = React.useState(0);
  const [dutyOrgStatistics, setDutyOrgStatistics] = React.useState(0);
  const [staffInventoryStatistics, setStaffInventoryStatistics] =
    React.useState(0);
  const [dutyInventoryStatistics, setDutyInventoryStatistics] =
    React.useState(0);
  const { mutate } = useMutation({
    mutationFn: legacyApi.request,
  });

  const {
    data: inspection,
  } = useQuery<any, any, any>({
    queryKey: [`/inspection/id/${id}`],
    queryFn: () =>
      legacyApi.get(
        `/inspection/id/${id}`
      ),
    select: (res: any) => res.data,
  } as any);

  useEffect(() => {
    setStaffOrgStatistics(inspection?.staffOrgStatistics);
    setDutyOrgStatistics(inspection?.dutyOrgStatistics);
    setStaffInventoryStatistics(inspection?.staffInventoryStatistics);
    setDutyInventoryStatistics(inspection?.dutyInventoryStatistics);
    setBossJob(inspection?.bossJob);
    setPersonnelNumber(inspection?.bossPersonInfoPersonNumber);
    setOrganizationUnitId(inspection?.organizationUnitId)
  }, [inspection]);

  const {
    handleSubmit,
  } = useForm<any>();

  const { data: personInfo } = useQuery<any>({
    queryKey: [
      `/person-info/organization-id-person-number/?organizationId=${organizationUnitId}/?personNumber=${personnelNumber}`,
    ],
    select: (res: any) => res.data,
    // enabled: personnelNumber?.length == 9,
  } as any);

  const sendData = () => {
    mutate(
      {
        entity: `/inspection/organization-number`,
        method: 'POST',
        data: {
          id: inspection?.id,
          staffOrgStatistics: staffOrgStatistics,
          dutyOrgStatistics: dutyOrgStatistics,
          staffInventoryStatistics: staffInventoryStatistics,
          dutyInventoryStatistics: dutyInventoryStatistics,
          bossPersonInfoId: personInfo?.id,
          bossJob: bossJob,
        },
      } as any,
      {
        onSuccess: () => {
          snackbar('با موفقیت اضافه شد', 'success', 5000);
        },
      }
    );
  };

  return (
    <Box>
      <Box sx={{ margin: '20px' }}>
        <Grid container spacing={2} display={"flex"} justifyContent={"space-between"}>
          <Grid size={{ xs: 8 }}>
            <Typography fontWeight={700} variant="h5">
              آمار سازمانی برای بازرسی {inspection?.organizationUnitName} -{' '}
              {inspection?.annualPlanInspectionName}
            </Typography>
          </Grid>
          <Grid size={{ xs: 2 }}>
            <BackButton color='warning' text='بازگشت' minWidth={"150px"} onBack={() => navigate(-1)} /> 
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ width: '100%' }}>
        <Grid container spacing={2} padding={'20px'}>
          <Grid size={{ xs: 12 }}>
            <Typography>
              برای افزودن آمار سازمان، فیلد های موجود را وارد کنید.
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label={'تعداد سازمانی پایور'}
              type="number"
              value={staffOrgStatistics}
              onChange={(event: any) => {
                let newGrade = 0;
                if (parseInt(event.target.value) < 0) newGrade = 0;
                else newGrade = parseInt(event.target.value);
                setStaffOrgStatistics(newGrade);
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label={'تعداد موجودی پایور'}
              type="number"
              value={staffInventoryStatistics}
              onChange={(event: any) => {
                let newGrade = 0;
                if (parseInt(event.target.value) < 0) newGrade = 0;
                else newGrade = parseInt(event.target.value);
                setStaffInventoryStatistics(newGrade);
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <DisabledTextInput
              label={'درصد پایور'}
              value={(
                (staffInventoryStatistics / staffOrgStatistics) *
                100
              ).toFixed(2)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label={'تعداد سازمانی وظیفه'}
              type="number"
              value={dutyOrgStatistics}
              onChange={(event: any) => {
                let newGrade = 0;
                if (parseInt(event.target.value) < 0) newGrade = 0;
                else newGrade = parseInt(event.target.value);
                setDutyOrgStatistics(newGrade);
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label={'تعداد موجودی وظیفه'}
              type="number"
              value={dutyInventoryStatistics}
              onChange={(event: any) => {
                let newGrade = 0;
                if (parseInt(event.target.value) < 0) newGrade = 0;
                else newGrade = parseInt(event.target.value);
                setDutyInventoryStatistics(newGrade);
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <DisabledTextInput
              label={'درصد وظیفه'}
              value={(
                (dutyInventoryStatistics / dutyOrgStatistics) *
                100
              ).toFixed(2)}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography>
              برای افزودن مشخصات فرمانده، کد پرسنلی را وارد کنید.
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label={'شماره پرسنلی'}
              type="text"
              value={personnelNumber}
              onChange={(event: any) =>
                setPersonnelNumber(event?.target?.value)
              }
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label={'شغل سازمانی'}
              type="text"
              value={bossJob}
              onChange={(event: any) => setBossJob(event?.target?.value)}
            />
          </Grid>
          <Grid size={{ xs: 12 }} container spacing={2}>
            {!!personInfo ? (
              <>
                <Grid size={{ xs: 4 }}>
                  <DisabledTextInput
                    value={personInfo?.name + ' ' + personInfo?.family}
                    label={'نام و نام خانوادگی'}
                  />
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <DisabledTextInput value={personInfo?.field} label={'رسته'} />
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <DisabledTextInput
                    value={personInfo?.organizationUnitName}
                    label={'یگان'}
                  />
                </Grid>
              </>
            ) : null}
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Button
              variant="contained"
              onClick={handleSubmit(sendData)}
              disabled={
                !dutyInventoryStatistics ||
                !staffInventoryStatistics ||
                !dutyOrgStatistics ||
                !staffOrgStatistics
              }
            >
              ثبت
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
