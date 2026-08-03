import {
  Box,
  Button,
  Grid,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
  Divider,
} from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSnackbar } from '@/hooks/useSnackbar';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import type { TCrudType } from './../types.ts';
import {
  inspectionTypeNames,
  organizationTypes,
  organs,
  PLANNING_STATE,
} from './../types.ts';
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';
import './styles/planning-crud.css';
import BackButton from '@/components/button/BackButton';
import OrganizationTabs from './OrganizationTabs';
import GardeshKar from 'modules/inspection-operation/planning-aja/print/GardeshKar.tsx';
import type {
  AnnualPlanningInspectionType,
  AnnualPlanningOrganization,
  AnnualPlanning,
  APIPlanningGrid,
} from '../types.ts';
import InspectionApis from 'modules/inspection-operation/api.ts';
import { useLegacyApi } from 'hooks/useLegacyApi.ts';
import MatnaTabBar from '@/components/MatnaTabBar.tsx';
import { Months } from 'modules/inspection-operation/planning-aja/types.ts';

const tabs = [
  'بازرسی برنامه ای (سیستماتیک)',
  'بازرسی برنامه ای به روش خودارزیابی با نظارت سلسله مراتب سازمانی',
  'بازرسی راستی آزمایی',
  'بازرسی غیر مترقبه خاص',
  'بازرسی پیگیری',
  'نظارت ستادی',
  'بازرسی و ارزیابی توان و آمادگی رزم(پیش بازدید)',
  'بازدید فرماندهی از توان و آمادگی رزم(استانی)',
  'پیگیری مصوبات بازدیدهای استانی',
];

const SeasonLabels: Record<string, string> = {
  first_season: 'سه ماهه اول',
  secound_season: 'سه ماهه دوم',
  third_season: 'سه ماهه سوم',
  fourth_season: 'سه ماهه چهارم',
};

export default function PlanningNaturesCrud() {
  const { id } = useParams();
  const [myId, setMyId] = useState(id ?? 0);
  const mode: TCrudType = !id ? 'CREATE' : 'EDIT';
  const navigate = useNavigate();
  const legacyApi = useLegacyApi();
  const [organizationIndex, setOrganizationIndex] = useState<number>(0);

  const { mutate } = useMutation({
    mutationFn: legacyApi.request,
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  const ALL_STEPS = [
    'BARNAMEI_SYSTEMATIC',
    'KHOD_ARZYABI',
    'RASTY_AZMAIE',
    'GHEIRE_MOTERAGHEBEH',
    'PEYGIRI_BAZRASI',
    'NEZARAT_SETADI',
    'PROVINCIAL_PISH_BAZDID',
    'PROVINCIAL_BAZDID_FARMANDEHI',
    'PROVINCIAL_PEYGIRI',
  ];

  const PROVINCIAL_KEYS = [
    'PROVINCIAL_PISH_BAZDID',
    'PROVINCIAL_BAZDID_FARMANDEHI',
    'PROVINCIAL_PEYGIRI',
  ];

  const [planState, setPlanState] = useState<AnnualPlanning>({
    status: PLANNING_STATE.PRE_PLANNING,
    inspectionType: ALL_STEPS.map((type) => ({
      key: type,
      name: type,
      number: 0,
      organizations: organs.map((or) => ({
        organizationUnitName: or,
        key: or,
        number: 0,
      })),
    })),
    description: '',
    id: '',
    year: 0,
    number: 0,
    title: '',
  } as AnnualPlanning);

  const [htmlText, setHtmlText] = useState<string>('');

  const serializedFilters = useMemo(
    () => InspectionApis.annualPlanning.find(id),
    [id]
  );

  const { data, status } = useQuery<any, any, AnnualPlanning, any>({
    queryKey: [serializedFilters],
    queryFn: () => legacyApi.get(serializedFilters),
    select: (res: APIPlanningGrid) => res?.data,
  });

  useEffect(() => {
    if (data) {
      setPlanState(data);
      setActiveStep(0);
    }
  }, [data]);

  useEffect(() => {
    if (planState) {
      setHtmlText(
        GardeshKar({
          AJA: true,
          totalInspection: planState?.number,
          systematic:
            planState?.inspectionType?.find(
              item => item.key === 'BARNAMEI_SYSTEMATIC'
            )?.number ?? 0,
          gheireMoteraghebeh:
            planState?.inspectionType?.find(
              item => item.key === 'GHEIRE_MOTERAGHEBEH'
            )?.number ?? 0,
          peigiri:
            planState?.inspectionType?.find(
              item => item.key === 'PEYGIRI_BAZRASI'
            )?.number ?? 0,
          nezaratsetadi:
            planState?.inspectionType?.find(
              item => item.key === 'NEZARAT_SETADI'
            )?.number ?? 0,
          khodArzyabi:
            planState?.inspectionType?.find(item => item.key === 'KHOD_ARZYABI')
              ?.number ?? 0,

          rastiAzmayiYear: planState?.year - 1,
          rastiAzmayi:
            planState?.inspectionType?.find(item => item.key === 'RASTY_AZMAIE')
              ?.number ?? 0,
          moavenBazrasi:
            planState?.inspectionType?.find(
              item => item.key === 'ARZYABI_MOAVEN_BAZRASI'
            )?.number ?? 0,
          year: planState?.year,
          data: planState,
        })
      );
    }
  }, [data, planState]);

  const [activeStep, setActiveStep] = React.useState(0);

  const isProvincialStep = PROVINCIAL_KEYS.includes(ALL_STEPS[activeStep]);

  // محاسبه تعداد کل برای نمایش در بالای صفحه (فقط خواندنی)
  const currentTotalNumber = planState?.inspectionType?.find(
    item => item.key === ALL_STEPS[activeStep]
  )?.number ?? 0;

  const [selectedOrgan, setSelectedOrgan] = useState({
    id: '0',
    organizationUnitName: 'name',
    key: 'key',
    number: 0,
    organizationTypes: [],
  } as AnnualPlanningOrganization);

  useEffect(() => {
    if (planState && !isProvincialStep)
      setSelectedOrgan(
        planState?.inspectionType
          ?.find(
            item => item.key === ALL_STEPS[activeStep]
          )
          ?.organizations?.find(
          organ =>
            organ.key ===
            (organs[organizationIndex] as keyof typeof organizationTypes)
        ) ??
        ({
          organizationUnitName: 'name',
          key: 'key',
          number: 0,
          organizationTypes: [],
        } as AnnualPlanningOrganization)
      );
  }, [activeStep, organizationIndex, planState, isProvincialStep]);

  const renderNatureTable = () => {
    return planState.inspectionType
      .find(
        item => item.key === ALL_STEPS[activeStep]
      )
      ?.organizations?.find(
        organ =>
          organ.key ===
          (organs[organizationIndex] as keyof typeof organizationTypes)
      )
      ?.organizationType?.map((nature: any, index) => {
        return (
          <TableRow key={index}>
            <TableCell
              sx={{
                color:
                  selectedOrgan.number >
                  (planState?.inspectionType
                    ?.find(
                      item =>
                        item.key === ALL_STEPS[activeStep]
                    )
                    ?.organizations?.find(
                      organ =>
                        organ.key ===
                        (organs[organizationIndex] as keyof typeof organizationTypes)
                    )?.number ?? 0)
                    ? 'red'
                    : 'initial',
              }}
            >
              {nature?.organizationTypeName}
            </TableCell>

            <TableCell width="200px" sx={{ padding: '0px !important' }}>
              <TextField
                fullWidth
                sx={{ input: { textAlign: 'center' } }}
                name={organs[organizationIndex] + index}
                key={index}
                onChange={(e: any) => {
                  if (!isNaN(e.target.value)) {
                    let a: any = {
                      ...planState,
                      inspectionType: planState.inspectionType.map(
                        (
                          inspectionTypeItem: AnnualPlanningInspectionType
                        ) =>
                          inspectionTypeItem.key !== ALL_STEPS[activeStep]
                            ? inspectionTypeItem
                            : {
                              ...inspectionTypeItem,
                              organizations:
                                inspectionTypeItem?.organizations.map(
                                  (organItem) =>
                                    organItem.key !==
                                    (organs[organizationIndex] as keyof typeof organizationTypes)
                                      ? organItem
                                      : {
                                        ...organItem,
                                        organizationType:
                                          organItem.organizationType?.map(
                                            natureItem =>
                                              natureItem.organizationTypeId !==
                                              nature.organizationTypeId
                                                ? natureItem
                                                : {
                                                  ...natureItem,
                                                  number: e.target.value,
                                                }
                                          ),
                                      }
                                ),
                            }
                      ),
                    };
                    setPlanState(a);
                  }
                }}
                value={nature.number ?? 0}
              />
            </TableCell>
          </TableRow>
        );
      });
  };

  const renderProvincialTable = () => {
    const currentType = planState?.inspectionType?.find(
      item => item.key === ALL_STEPS[activeStep]
    );
    const provinces = (currentType as any)?.provinces || [];

    if (provinces.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={2} align="center">
            هیچ استانی برای این مرحله انتخاب نشده است.
          </TableCell>
        </TableRow>
      );
    }

    return provinces.map((p: any, index: number) => (
      <TableRow key={index}>
        <TableCell align="center">{p.provinceName || 'نامشخص'}</TableCell>
        <TableCell align="center">
          {SeasonLabels[p.season] || p.season || '-'}
        </TableCell>
        <TableCell align="center">
          {Months.find(i => i.key === p.month).label || '-'}
        </TableCell>
      </TableRow>
    ));
  };

  const handleNext = () => {
    if (isProvincialStep) {
      if (activeStep === tabs.length - 1) {
        mutate({
          entity: `annual-planning/accept-planning/${myId}`,
          method: 'put',
        }, {
          onSuccess: (res: any) => {
            navigate(`/operation/planning/aja/${myId}/PLANNING`);
          }
        })
      } else {
        setActiveStep(prev => prev + 1);
      }
      return;
    }

    mutate(
      {
        entity: `/org-type-inspection/save-organization-type`,
        method: 'POST',
        data: planState.inspectionType.find(
          item => item.key === ALL_STEPS[activeStep]
        ),
      } as any,
      {
        onSuccess: (res: any) => {
          if (activeStep === tabs.length - 1) {
            mutate({
              entity: `annual-planning/accept-planning/${myId}`,
              method: 'put',
            }, {
              onSuccess: (res: any) => {
                navigate(`/operation/planning/aja/${myId}/PLANNING`);
              }
            })
          }
          else setActiveStep(prevActiveStep => prevActiveStep + 1);
        },
      }
    );
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  let remaining: number = 0;
  remaining = Object.keys(inspectionTypeNames).reduce(
    (acc, key) =>
      acc -
      (planState?.inspectionType?.find(
        item => item.key === (key as keyof typeof inspectionTypeNames)
      )?.number ?? 0),
    planState.number
  );

  const handleOrganizationTabsClick = (
    e: React.SyntheticEvent,
    index: number
  ) => {
    setOrganizationIndex(index ?? 0);
  };

  return (
    <>
      {status === 'pending' && mode === 'EDIT' ? (
        <Skeleton height={300} />
      ) : (
        <Box
          component="form"
          sx={{
            backgroundColor: '#f5f5f5',
            borderRadius: '10px',
            marginTop: '20px',
            p: 2,
          }}
        >
          <Box display="flex" justifyContent={'space-between'} mb={1}>
            <Typography component="h3" variant="h6">
              {mode === 'CREATE' ? 'ایجاد طرح ریزی جدید' : 'جزئیات طرح ریزی'}
            </Typography>
            <BackButton
              onBack={() => navigate('/operation/planning/aja')}
              minWidth={150}
              text="بازگشت"
              color={'primary'}
            />
          </Box>
          <Box sx={{ width: '100%' }}>
            <MatnaTabBar tabs={tabs} selectedTabIndex={activeStep} onSelectTab={(index) => setActiveStep(index)} />

            {
              <Box sx={{ pl: 3, pr: 3 }}>
                <>
                  {/* بخش نمایش اطلاعات (فقط برای تب‌های غیر استانی) */}
                  {!isProvincialStep && (
                    <Grid container alignItems="center" sx={{ mt: 5, mb: 3 }}>
                      <Grid item xs={12} md={6}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            bgcolor: '#e3f2fd',
                            border: '1px solid #bbdefb',
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2
                          }}
                        >
                          <Typography variant="subtitle1" fontWeight="bold" color="text.secondary">
                            تعداد بازرسی ها از این نوع:
                          </Typography>
                          <Typography variant="h5" color="primary.main" fontWeight="bold">
                            {currentTotalNumber}
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                  )}

                  {/* شرط رندرینگ: اگر استانی بود جدول استان، اگر نبود جدول ماهیت */}
                  {isProvincialStep ? (
                    <Grid container justifyContent="center" mt={5}>
                      <Grid size={{ xs: 12, md: 10 }}>
                        <Typography variant="h6" gutterBottom color="primary">
                          لیست استان‌های انتخاب شده
                        </Typography>
                        <Table sx={{ border: '1px solid #e0e0e0', width: '100%' }}>
                          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                            <TableRow>
                              <TableCell align="center" sx={{ fontWeight: 'bold' }}>نام استان</TableCell>
                              <TableCell align="center" sx={{ fontWeight: 'bold' }}>فصل بازرسی</TableCell>
                              <TableCell align="center" sx={{ fontWeight: 'bold' }}>ماه بازرسی</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {renderProvincialTable()}
                          </TableBody>
                        </Table>
                      </Grid>
                    </Grid>
                  ) : (
                    <Grid container justifyContent="center">
                      <Grid size={{ xs: 12, md: 8 }} justifyContent="center">
                        <OrganizationTabs
                          click={handleOrganizationTabsClick}
                          selectedOrganization={organizationIndex}
                          selectedInspectionType={ALL_STEPS[activeStep]}
                          plan={planState}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 8 }} mt={5}>
                        <Table
                          sx={{ marginBlockStart: '12px', width: '100%' }}
                        >
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ fontWeight: 'bold' }}>
                                ماهیت
                              </TableCell>
                              <TableCell
                                sx={{
                                  textAlign: 'center',
                                  fontWeight: 'bold',
                                }}
                              >
                                تعداد
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>{renderNatureTable()}</TableBody>
                        </Table>
                      </Grid>
                    </Grid>
                  )}
                </>

                <Grid container sx={{ pt: 5, justifyContent: 'space-between' }}>
                  <Grid size={{ xs: 12, md: 8 }}>
                    <Button
                      onClick={handleBack}
                      disabled={activeStep === 0}
                      startIcon={<ArrowForwardIos />}
                    >
                      مرحله قبل
                    </Button>
                  </Grid>

                  {activeStep === tabs.length - 1 ? (
                    <Grid>
                      <Button
                        onClick={handleNext}
                        endIcon={<ArrowBackIosNew />}
                        variant="contained"
                        color="primary"
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
              </Box>
            }
          </Box>
        </Box>
      )}
    </>
  );
}