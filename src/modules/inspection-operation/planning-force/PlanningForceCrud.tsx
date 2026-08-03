import {
  Box,
  Button,
  Divider,
  Grid,
  Modal,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import FormBuilder from '@/components/form/FormBuilder';
import { useSnackbar } from '@/hooks/useSnackbar';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import {
  inspectionTypeNames,
  organizationTypes,
  organs,
  PLANNING_STATE,
  planningSteps,
} from '../types';
import {
  ArrowBackIosNew,
  ArrowForwardIos,
  Check,
  Edit,
  HistoryEdu,
  Upload,
} from '@mui/icons-material';
import '../planning-aja/styles/planning-grid.css';
import BackButton from '@/components/button/BackButton';
import OrganizationTabs from '../planning-aja/OrganizationTabs';
import SteppButton from '@/components/button/SteppButton';
import GardeshKar from '../planning-aja/print/GardeshKar';
import { type AnnualPlanning } from '../types';
import { useReactToPrint } from 'react-to-print';
import type { FieldConfig } from '@/components/form/types';
import { useApiMutation, useApiQuery } from '@/hooks/useApi';
import { PAGINATION_DEFAULT_VALUE_OLD } from '@/types/api';
import InspectionApis from '../api';
import MatnaEditor from '@/components/MatnaEditor';

type TCrudType = 'CREATE' | 'VIEW' | 'EDIT';

export default function PlanningCrud() {
  const [steps, setSteps] = useState<Array<string>>([
    'اطلاعات کلی',
    'برنامه‌ای (سیستماتیک)',
    'پیگیری بازرسی',
    'برنامه ای به روش خودارزیابی',
    'راستی آزمایی',
    'غیر مترقبه (خاص)',
    'نظارت ستادی',
    'ارزیابی معاون بازرسی',
    'سند طرح ریزی',
  ]);

  const { id, state } = useParams();
  const [basicInfoFormData, setBasicInfoFormData] = useState(null);
  const [myId, setMyId] = useState(id ?? 0);
  const mode: TCrudType = !id ? 'CREATE' : 'EDIT';
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [disableFlag, setDisableFlag] = useState<boolean>(false);

  const { mutate: createInspectionCitiesMutate } = useApiMutation({
    url: InspectionApis.cities.citiesWithoutId,
  });

  const { mutate: createInspectionAnnualPrePlanningMutate } = useApiMutation({
    url: InspectionApis.annualPlanning.acceptPrePlanning(myId),
    method: 'PUT',
  });

  const { mutate: createInspectionEditPrePlanning } = useApiMutation({
    url: InspectionApis.annualPlanning.editPrePlanning(myId),
    method: 'PUT',
  });

  const { mutate: createInspectionAcceptPlanning } = useApiMutation({
    url: InspectionApis.annualPlanning.acceptPrePlanning(myId),
    method: 'PUT',
  });

  const { mutate: createInspectionAnnualPlanning } = useApiMutation({
    url: InspectionApis.annualPlanning.list,
  });

  const { mutate: createInspectionSaveNumber } = useApiMutation({
    url: InspectionApis.annualPlanning.saveNumber,
    method: 'POST',
  });

  const { mutate: createInspectionFileStorage } = useApiMutation({
    url: InspectionApis.fileStorage.upload(myId),
    method: 'POST',
  });

  useEffect(() => {
    if (
      state !== PLANNING_STATE.PRE_PLANNING &&
      annualPlan.status !== PLANNING_STATE.PRE_PLANNING
    )
      setSteps(steps.filter(item => item != 'سند طرح ریزی'));
  }, []);

  const { handleSubmit } = useForm();

  const [avamerSadere, setAvamerSadere] = useState('');
  const handleAvamer = (text: string) => {
    setAvamerSadere(text);
  };

  const types = [
    'BARNAMEI_SYSTEMATIC',
    'PEYGIRI_BAZRASI',
    'KHOD_ARZYABI',
    'RASTY_AZMAIE',
    'GHEIRE_MOTERAGHEBEH',
    'NEZARAT_SETADI',
    'ARZYABI_MOAVEN_BAZRASI',
    'BAZRASI_BANA_BE_DASTOOR',
  ];

  const [annualPlan, setAnnualPlan] = useState<AnnualPlanning>({
    status: PLANNING_STATE.PRE_PLANNING,
    inspectionType: types.map(type => ({
      key: type,
      name: type,
      number: 0,
      organizations: organs.map(or => ({
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
  const handleHtmlText = (text: string) => {
    setHtmlText(text);
  };

  const { data: forcesdata } = useApiQuery<any>({
    url: InspectionApis.annualPlanning.list,
    params: PAGINATION_DEFAULT_VALUE_OLD,
  });
  useEffect(() => {
    if (forcesdata) {
      setAnnualPlan(forcesdata?.data);
      forcesdata?.data?.status === PLANNING_STATE.WAITING_FOR_APPROVE &&
        setDisableFlag(true);
      setActiveStep(
        forcesdata?.data?.status === PLANNING_STATE.WAITING_FOR_APPROVE
          ? steps.length - 1
          : 0
      );
    }
  }, [forcesdata]);
  useEffect(() => {
    if (annualPlan) {
      setHtmlText(
        GardeshKar({
          AJA: true,
          totalInspection: annualPlan?.number,
          systematic:
            annualPlan?.inspectionType?.find(
              item => item.key === 'BARNAMEI_SYSTEMATIC'
            )?.number ?? 0,
          gheireMoteraghebeh:
            annualPlan?.inspectionType?.find(
              item => item.key === 'GHEIRE_MOTERAGHEBEH'
            )?.number ?? 0,
          peigiri:
            annualPlan?.inspectionType?.find(
              item => item.key === 'PEYGIRI_BAZRASI'
            )?.number ?? 0,
          nezaratsetadi:
            annualPlan?.inspectionType?.find(
              item => item.key === 'NEZARAT_SETADI'
            )?.number ?? 0,
          khodArzyabi:
            annualPlan?.inspectionType?.find(
              item => item.key === 'KHOD_ARZYABI'
            )?.number ?? 0,

          rastiAzmayiYear: annualPlan?.year - 1,
          rastiAzmayi:
            annualPlan?.inspectionType?.find(
              item => item.key === 'RASTY_AZMAIE'
            )?.number ?? 0,
          moavenBazrasi:
            annualPlan?.inspectionType?.find(
              item => item.key === 'ARZYABI_MOAVEN_BAZRASI'
            )?.number ?? 0,
          year: annualPlan?.year,
          data: annualPlan,
        })
      );
    }
  }, [annualPlan]);

  const onSubmitHandler = (data: any) => {
    const params = { ...data, commonBaseDataProvinceId: id };
    createInspectionCitiesMutate(
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

  const baseInfoItems: FieldConfig[] = [
    {
      type: 'titleDivider',
      name: 'planning-base-info',
      label: 'اطلاعات پایه سال',
    },
    {
      name: 'annualPlanYear',
      type: 'text',
      label: 'سال طرح ریزی',
      size: { xs: 12, md: 6 },
      defaultValue: null,
      disabled:
        annualPlan?.status !== PLANNING_STATE.PRE_PLANNING || disableFlag,
    },
    {
      name: 'annualPlanTotalNumber',
      type: 'text',
      label: 'تعداد بازرسی کل ارتش',
      size: { xs: 12, md: 6 },
      defaultValue: null,
      disabled:
        annualPlan?.status !== PLANNING_STATE.PRE_PLANNING || disableFlag,
    },
  ];

  const [activeStep, setActiveStep] = React.useState(
    annualPlan.status === PLANNING_STATE.WAITING_FOR_APPROVE
      ? steps.length - 1
      : 0
  );

  const inspectionTypeBaseInfo: FieldConfig[] = [
    {
      name: 'total',
      type: 'text',
      label: ' بازرسی',
      size: { md: 2 },
        disabled:
          annualPlan.status !== PLANNING_STATE.PRE_PLANNING || disableFlag,
        onChange: e => {
          if (!isNaN(e.target.value)) {
            setAnnualPlan((previousState: AnnualPlanning) => {
              !previousState.inspectionType.find(
                item =>
                  item.key ===
                  (planningSteps[
                    activeStep
                  ] as keyof typeof inspectionTypeNames)
              ) &&
                previousState.inspectionType.push({
                  key: planningSteps[
                    activeStep
                  ] as keyof typeof inspectionTypeNames,
                  name: inspectionTypeNames[
                    planningSteps[
                      activeStep
                    ] as keyof typeof inspectionTypeNames
                  ],
                  number: 0,
                  organizations: [],
                });
              let newInspectionType = previousState.inspectionType.map(
                insType =>
                  insType.key !==
                  (planningSteps[
                    activeStep
                  ] as keyof typeof inspectionTypeNames)
                    ? insType
                    : {
                        ...insType,
                        number: +e.target.value,
                      }
              );

              return {
                ...previousState,
                inspectionType: newInspectionType,
              };
            });
          }
        },
        defaultValue:
          annualPlan?.inspectionType?.find(
            item =>
              item.key ===
              (planningSteps[activeStep] as keyof typeof inspectionTypeNames)
          )?.number ?? 0,
    },
  ];

  const handleWaiting4Approve = () => {
    if (!disableFlag) {
      createInspectionAnnualPrePlanningMutate({
        onSuccess: (res: any) => {
          setMyId(res?.data?.id ?? 0);
        },
      });
    } else {
      snackbar('شما به دنبال ویرایش مجدد میباشید', 'info', 5000);
      createInspectionEditPrePlanning({
        onSuccess: (res: any) => {
          setMyId(res?.data?.id ?? 0);
          console.log('on success res =>', res, '\n id==>', myId);
          navigate('/inspection/planning/FORCE-planning');
        },
      });
    }
    setDisableFlag(!disableFlag);
  };
  const handleUploadButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!uploadRef || !uploadRef.current) return;
    uploadRef.current.click();
  };
  const handleUpload = async (uploadedFile: File | null) => {
    const formData = new FormData();
    if (!!uploadedFile) {
      formData.append('file', uploadedFile);
      formData.append('description', avamerSadere);
      createInspectionFileStorage(
        {
          data: formData,
        } as any,
        {
          onSuccess: () => {
            snackbar('عملیات با موفقیت انجام شد', 'success', 5000);
            createInspectionAcceptPlanning({
              onSuccess: () => {
                navigate('/inspection/planning/FORCE-planning');
              },
            });
          },
          onError: () => snackbar('خطا در انجام عملیات', 'error', 5000),
        }
      );
    }
  };
  const handleNext = () => {
    if (activeStep === 0) {
      createInspectionAnnualPlanning(
        {
          method: mode === 'CREATE' ? 'post' : 'put',
          data:
            mode === 'CREATE'
              ? {
                  year: annualPlan.year,
                  number: annualPlan.number,
                }
              : {
                  year: annualPlan.year,
                  number: annualPlan.number,
                  id: myId,
                },
        } as any,
        {
          onSuccess: (res: any) => {
            setMyId(res?.data?.id ?? 0);
            if (activeStep === steps.length - 1)
              navigate('/inspection/planning/FORCE-planning');
            else setActiveStep(prevActiveStep => prevActiveStep + 1);
          },
        }
      );
    } else {
      const typeData = annualPlan.inspectionType.find(
        item =>
          item.key ===
          (planningSteps[activeStep] as keyof typeof inspectionTypeNames)
      );
      createInspectionSaveNumber(
        {
          data: {
            annualPlanningId: myId,
            number: typeData?.number,
            nehaja: typeData?.organizations.find(
              organ => organ.key === 'nehaja'
            )?.number,
            nepaja: typeData?.organizations.find(
              organ => organ.key === 'nepaja'
            )?.number,
            nedaja: typeData?.organizations.find(
              organ => organ.key === 'nedaja'
            )?.number,
            nezaja: typeData?.organizations.find(
              organ => organ.key === 'nezaja'
            )?.number,
            sayer: typeData?.organizations.find(organ => organ.key === 'sayer')
              ?.number,
            key: typeData?.key,
          },
        } as any,
        {
          onSuccess: () => {
            if (activeStep === steps.length - 1)
              navigate('/inspection/planning/FORCE-planning');
            else setActiveStep(prevActiveStep => prevActiveStep + 1);
          },

          onError: () => {
            snackbar("شما دسترسی برای ثبت نهایی ندارید", "error", 5000)
          }
        }
      );
    }
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleStep = (step: number) => {
    console.log('ACTIV STEP fired');
    setActiveStep(step);
  };

  let remaining: number = 0;
  let remainingOfType: number = 0;
  remaining = Object.keys(inspectionTypeNames).reduce(
    (acc, key) =>
      acc -
      (annualPlan?.inspectionType?.find(
        item => item.key === (key as keyof typeof inspectionTypeNames)
      )?.number ?? 0),
    annualPlan.number
  );

  remainingOfType =
    activeStep == 0
      ? 0
      : organs.reduce(
          (acc, key) => {
            return (
              acc -
              (annualPlan?.inspectionType
                ?.find(
                  item =>
                    item.key ===
                    (planningSteps[
                      activeStep
                    ] as keyof typeof inspectionTypeNames)
                )
                ?.organizations.find(
                  item => item.key === (key as keyof typeof organizationTypes)
                )?.number ?? 0)
            );
          },
          annualPlan?.inspectionType?.find(
            item =>
              item.key ===
              (planningSteps[activeStep] as keyof typeof inspectionTypeNames)
          )?.number ?? 0
        );

  const [organizationIndex, setOrganizationIndex] = useState<number>(0);
  const handleOrganizationTabsClick = (
    e: React.SyntheticEvent,
    index: number
  ) => {
    setOrganizationIndex(index ?? 0);
  };

  const [printFlag, setPrintFlag] = useState<boolean>(false);


  const uploadRef = useRef<HTMLInputElement>(null);

  const printThis = useReactToPrint({
    documentTitle: 'print my Document',
  });

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmitHandler)}
        sx={{
          backgroundColor: '#f5f5f5',
          borderRadius: '10px',
          marginTop: '20px',
          p: 2,
        }}
      >
        <Box display="flex" justifyContent={'space-between'} mb={1}>
          <Typography component="h3" variant="h6">
            {mode === 'CREATE' ? 'ایجاد طرح ریزی جدید' : 'ویرایش طرح ریزی'}
          </Typography>
          <BackButton
            text="بازگشت"
            color="primary"
            minWidth={200}
            onBack={() => navigate('/operation/planning/force')}
          />
        </Box>
        <Box sx={{ width: '100%' }}>
          {steps.map((label, index) => {
            return (
              <SteppButton
                type={'text'}
                sx={null}
                key={label}
                activeStep={activeStep}
                index={index}
                label={label}
                handleStep={handleStep}
              />
            );
          })}

          {
            <Box sx={{ px: 3 }}>
              {activeStep === 0 && (
                <FormBuilder
                  showResetButton={false}
                  showSubmitButton={false}
                  fields={baseInfoItems}
                  onSubmit={null}
                  value={basicInfoFormData}
                />
              )}

              {activeStep !== 0 &&
                (((state === PLANNING_STATE.PRE_PLANNING ||
                  state === PLANNING_STATE.WAITING_FOR_APPROVE) &&
                  activeStep !== steps.length - 1) ||
                  ((annualPlan.status === PLANNING_STATE.PRE_PLANNING ||
                    annualPlan.status === PLANNING_STATE.WAITING_FOR_APPROVE) &&
                    activeStep !== steps.length - 1) ||
                  state === PLANNING_STATE.PLANNING) && (
                  <>
                    <Grid container>
                      <Typography sx={{ marginTop: 5 }}>
                        تعداد بازرسی ها از این نوع:
                      </Typography>
                      &nbsp;
                      <Grid spacing={3} sx={{ marginTop: 3 }}>
                        <FormBuilder
                          showResetButton={false}
                          showSubmitButton={false}
                          fields={inspectionTypeBaseInfo}
                          onSubmit={null}
                          value={basicInfoFormData}
                        />
                      </Grid>
                      <Grid
                        sx={{
                          marginTop: 5,
                          marginLeft: 5,
                          color:
                            remaining > 0
                              ? 'black'
                              : remaining === 0
                                ? 'green'
                                : 'red',
                        }}
                      >
                        {!isNaN(remaining) &&
                          (remaining < 0 ? (
                            <span>
                              (بیش از حد مجاز:{' '}
                              <span dir="ltr"> {Math.abs(remaining)}</span>)
                            </span>
                          ) : (
                            <span>
                              (باقیمانده: <span dir="ltr"> {remaining}</span>)
                            </span>
                          ))}
                      </Grid>
                    </Grid>

                    {annualPlan.status == PLANNING_STATE.PLANNING && (
                      <Grid container justifyContent="center">
                        <Grid size={{ xs: 12, md: 8 }} justifyContent="center">
                          <OrganizationTabs
                            click={handleOrganizationTabsClick}
                            selectedOrganization={organizationIndex}
                            selectedInspectionType={planningSteps[activeStep]}
                            plan={annualPlan}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 8 }}></Grid>
                      </Grid>
                    )}
                  </>
                )}
              {activeStep === steps.length - 1 &&
                (state ===
                  (PLANNING_STATE.PRE_PLANNING ||
                    PLANNING_STATE.WAITING_FOR_APPROVE) ||
                  annualPlan.status === PLANNING_STATE.PRE_PLANNING ||
                  annualPlan.status === PLANNING_STATE.WAITING_FOR_APPROVE) && (
                  <Grid
                    container
                    spacing={3}
                    sx={{ marginTop: 5 }}
                    justifyContent={'center'}
                  >
                    <Grid
                      size={{ md: 12 }}
                      display="flex"
                      justifyContent={'center'}
                    >
                      {!disableFlag && (
                        <Button
                          variant={printFlag ? 'contained' : 'text'}
                          size="large"
                          sx={{ mr: 3 }}
                          onClick={() => setPrintFlag(showprev => !showprev)}
                          endIcon={<HistoryEdu />}
                        >
                          سند طرح ریزی
                        </Button>
                      )}
                      <Button
                        variant="contained"
                        color={disableFlag ? 'warning' : 'success'}
                        endIcon={
                          disableFlag ? (
                            <Edit fontSize="small" />
                          ) : (
                            <Check fontSize="small" />
                          )
                        }
                        onClick={handleWaiting4Approve}
                      >
                        {disableFlag ? 'ویرایش مجدد' : 'تایید'}
                      </Button>
                      {disableFlag && (
                        <Tooltip
                          title={
                            file
                              ? 'نام فایل: ' +
                                file.name +
                                ' __ سایز فایل: ' +
                                file.size
                              : 'فایلی انتخاب نشده'
                          }
                          sx={{ ml: 3 }}
                        >
                          <Button
                            size="large"
                            onClick={handleUploadButton}
                            endIcon={<Upload />}
                          >
                            آپلود تاییدیه
                          </Button>
                        </Tooltip>
                      )}
                      <input
                        hidden
                        ref={uploadRef}
                        type="file"
                        id="GardeshKar"
                        name="GardeshKar"
                        aria-label="kopk"
                        onChange={e => {
                          setFile(!!e.target.files ? e.target.files[0] : null);
                        }}
                      />
                    </Grid>
                    <Grid container size={{ md: 4 }} justifyContent={'center'}>
                      {(annualPlan.status ===
                        PLANNING_STATE.WAITING_FOR_APPROVE ||
                        disableFlag) && (
                        <Grid size={{ md: 12 }}>
                          <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="اوامر صادره"
                            name="Avamer"
                            key="Avamer"
                            onChange={e => handleAvamer(e.target.value)}
                            value={avamerSadere}
                          />
                        </Grid>
                      )}
                      {disableFlag && (
                        <Grid size={{ md: 12 }}>
                          <Button
                            fullWidth
                            variant="contained"
                            color="success"
                            endIcon={
                              disableFlag ? (
                                <Edit fontSize="small" />
                              ) : (
                                <Check fontSize="small" />
                              )
                            }
                            onClick={() => {
                              if (!!file) handleUpload(file);
                            }}
                          >
                            تایید نهایی
                          </Button>
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                )}

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

                {activeStep === steps.length - 1 ? (
                  annualPlan.status === PLANNING_STATE.PRE_PLANNING ? (
                    <Grid>
                      <Button
                        onClick={handleNext}
                        endIcon={<ArrowBackIosNew />}
                      >
                        ثبت
                      </Button>
                    </Grid>
                  ) : (
                    <Grid>
                      <Button
                        onClick={handleNext}
                        endIcon={<ArrowBackIosNew />}
                      >
                        ثبت نهایی
                      </Button>
                    </Grid>
                  )
                ) : (
                  <Grid>
                    <Button onClick={handleNext} endIcon={<ArrowBackIosNew />}>
                      ثبت و مرحله بعد
                    </Button>
                  </Grid>
                )}
              </Grid>
              {!disableFlag && printFlag && activeStep === steps.length - 1 && (
                <Modal
                  open={printFlag}
                  onClose={() => {
                    setPrintFlag(false);
                  }}
                  sx={{
                    justifyContent: 'center',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  aria-labelledby="modal-city-select"
                  aria-describedby="modal-city-select-description"
                >
                  <Grid
                    container
                    width={'25cm'}
                    bgcolor={'white'}
                    minHeight={'40vh'}
                    overflow={'auto'}
                    maxHeight={'90vh'}
                    justifyContent={'center'}
                  >
                    {printFlag && (
                      <Grid container width={'22cm'}>
                        <Grid size={{ xs: 12, md: 12 }}>
                          <Divider>سند طرح ریزی</Divider>
                        </Grid>
                        <Grid size={{ xs: 12, md: 12 }}>
                          <MatnaEditor  
                            initialData={htmlText}
                            onChange={(_, editor) => handleHtmlText(editor.getData())}
                          />
                        </Grid>
                      </Grid>
                    )}
                  </Grid>
                </Modal>
              )}
            </Box>
          }
        </Box>
      </Box>
    </>
  );
}
