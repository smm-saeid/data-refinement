import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Modal,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import {
  inspectionTypeNames,
  NatureInfoName,
  OrganizationsInfoTitles,
  organizationTypes,
  organs,
  PLANNING_STATE,
  services,
} from '../types.ts';
import ServicePanel from 'modules/inspection-operation/planning-core/ServicePanel.tsx';
import ServiceTabs from 'modules/inspection-operation/planning-core/ServiceTabs.tsx';
import BackButton from '@/components/button/BackButton';
import { InspectionPlanningViewTypeEnum } from '../types.ts';
import InspectionNatureTabs from './InspectionNatureTabs.tsx';
import { ServiceTypeEnum, NatureInfoEnum } from '../types.ts';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { APINature, AnnualPlanning, APISuggestionUnit } from '../types.ts';
import { OrganizationTypeEnum } from '../types.ts';
import {
  HistoryEdu,
  Edit,
  Check,
  Upload,
  Book,
  CheckCircle,
} from '@mui/icons-material';
import { useSnackbar } from 'hooks/useSnackbar';
import GardeshKar from 'modules/inspection-operation/planning-aja/print/GardeshKar.tsx';
import { useLegacyApi } from 'hooks/useLegacyApi.ts';
import InspectionApis from 'modules/inspection-operation/api.ts';
import MatnaEditor from '@/components/MatnaEditor.tsx';
import MatnaTabBar from '@/components/MatnaTabBar.tsx';
import ProvincialGardeshKar from '../planning-aja/print/ProvincialGardeshKar.tsx';
import ProvincialDastoorolAmal from '../planning-aja/print/ProvincialDastoorolAmal.tsx';
import { Months } from 'modules/inspection-operation/planning-aja/types.ts';
import { DastoorolAmal } from '../planning-aja/print/DastoorolAmal.tsx';
import PlanningReport from './PlanningReport.tsx';
import DeputyPlanningReport from '../deputy-planning/components/DeputyPlanningReport.tsx';
import ScopePlanningReport from '../scope-planning/components/ScopePlanningReport.tsx';
import { useApiQuery } from '@/hooks/useApi.ts';
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

const TAB_TITLES = [...Object.values(inspectionTypeNames), 'ثبت نهایی ✔'];

const SeasonLabels: Record<string, string> = {
  first_season: 'سه ماهه اول',
  secound_season: 'سه ماهه دوم',
  third_season: 'سه ماهه سوم',
  fourth_season: 'سه ماهه چهارم',
};

export default function Service() {
  const snackbar = useSnackbar();
  const legacyApi = useLegacyApi();
  const { id } = useParams();

  const { mutate } = useMutation({
    mutationFn: legacyApi.request,
  });

  const { mutate: mutateFile } = useMutation({
    mutationFn: legacyApi.requestFile,
  });
  const serializedFilters = useMemo(
    () => InspectionApis.annualPlanning.find(id),
    [id]
  );

  const { data: planData } = useQuery<any, any, AnnualPlanning, any>({
    queryKey: [serializedFilters],
    queryFn: () => legacyApi.get(serializedFilters),
    select: res => res?.data,
  });

  const { data: counterGardesh1 } = useQuery<any, any, any>({
    queryKey: [`/information/sequence/${id}-gardesh1`],
    queryFn: () => legacyApi.post(`/information/sequence/${id}-gardesh1`),
    select: (res: any) => {
      return res.data;
    },
    gcTime: 0,
  });

  const { data: counterAmal2 } = useQuery<any, any, any>({
    queryKey: [`/information/sequence/${id}-amal2`],
    queryFn: () => legacyApi.post(`/information/sequence/${id}-amal2`),
    select: (res: any) => {
      return res.data;
    },
    gcTime: 0,
  });

  const { data: counterProvGardesh1 } = useQuery<any, any, any>({
    queryKey: [`/information/sequence/${id}-provGardesh1`],
    queryFn: () => legacyApi.post(`/information/sequence/${id}-provGardesh1`),
    select: (res: any) => {
      return res.data;
    },
    gcTime: 0,
  });

  const { data: counterProvAmal2 } = useQuery<any, any, any>({
    queryKey: [`/information/sequence/${id}-provAmal2`],
    queryFn: () => legacyApi.post(`/information/sequence/${id}-provAmal2`),
    select: (res: any) => {
      return res.data;
    },
    gcTime: 0,
  });

  const {
    data: forces,
    isLoading,
    refetch,
  } = useApiQuery({
    url: InspectionApis.organizations.senderList(planData?.year),
    enabled: !!planData?.year,
  });

  const [myId, setMyId] = useState(id ?? 0);
  const [disableFlag, setDisableFlag] = useState<boolean>(false);
  const handleWaiting4Approve = () => {
    if (!disableFlag) {
      mutate(
        {
          entity: InspectionApis.annualPlanning.editStatus(myId),
          method: 'put',
        } as any,
        {
          onSuccess: (res: any) => {
            setMyId(res?.data?.id ?? 0);
          },
        }
      );
    } else {
      snackbar('شما به دنبال ویرایش مجدد میباشید', 'info', 5000);
      mutate(
        {
          entity: InspectionApis.annualPlanning.editStatusPlanning(myId),
          method: 'put',
        } as any,
        {
          onSuccess: (res: any) => {
            setMyId(res?.data?.id ?? 0);
          },
        }
      );
    }
    setDisableFlag(!disableFlag);
  };
  const [searchParams] = useSearchParams();
  const indextab = searchParams.get('index');
  const finalTab = searchParams.get('finaltab');

  const [selectedInspectionTypeIndex, setSelectedInspectionTypeIndex] =
    useState<number>(finalTab ? TAB_TITLES.length - 1 : 0);

  const myservice = services.find(element => {
    return element.type === ServiceTypeEnum.AJAPLANNING;
  });
  const Icon = myservice?.icon;

  const [filesToUpload, setFilesToUpload] = useState({
    gardeshKar: {
      name: 'گردش کار بازرسی ها و نظارت',
      link: `${import.meta.env.VITE_FRONT_URL}/operation/planning/aja/${id}/PLANNING?finaltab=1`,
      ref: useRef<HTMLInputElement>(null),
    },
    dastoorolAmal: {
      name: 'دستورالعمل بازرسی ها و نظارت',
      link: `${import.meta.env.VITE_FRONT_URL}/operation/planning/aja/${id}/PLANNING?finaltab=1`,
      ref: useRef<HTMLInputElement>(null),
    },
    provincialGardeshKar: {
      name: 'گردش کار بازدید های استانی',
      link: `${import.meta.env.VITE_FRONT_URL}/operation/planning/aja/${id}/PLANNING?finaltab=1`,
      ref: useRef<HTMLInputElement>(null),
    },
    provincialDastoorolAmal: {
      name: 'دستورالعمل بازدید های استانی',
      link: `${import.meta.env.VITE_FRONT_URL}/operation/planning/aja/${id}/PLANNING?finaltab=1`,
      ref: useRef<HTMLInputElement>(null),
    },
    peyvast1: {
      name: `برنامه بازرسی‌ها، نظارت و ارزیابی‌‌های پیش‌بینی‌شده (پیوست الف)`,
      link: `${import.meta.env.VITE_FRONT_URL}/operation/planning/aja/unit-report/${id}`,
    },
    peyvast2: {
      name: 'بازرسی‌های تجمیعی حوزه ، ایمنی، ارزشیابی، صیانت و رسیدگی‌ها (پیوست ب)',
      link: `${import.meta.env.VITE_FRONT_URL}/operation/planning/scope/report/${planData?.year}`,
    },
    peyvast3: {
      name: 'طرح‌ریزی بازرسی و نظارت تخصصی - ستادی معاونت‌ها، سازمان‌ها و  اداره‌های ستاد آجا (پیوست پ)',
      link: `${import.meta.env.VITE_FRONT_URL}/operation/planning/deputy/report/${planData?.year}`,
    },
  });

  const [avamerSadere, setAvamerSadere] = useState('');
  const [error, setError] = useState<string[] | undefined>();

  const [selectedPanelIndex, setSelectedPanelIndex] = useState<number>(
    indextab !== null ? +indextab : 7
  );

  const [natureList, setNatureList] = useState([] as APINature[]);
  const [activeStep, setActiveStep] = useState(0);
  const organizations = Object.keys(OrganizationsInfoTitles);
  const [selectedInspectionNatureIndex, setSelectedInspectionNatureIndex] =
    useState<string>('a7271b0e-d4e9-410c-b6d5-285b89ccb9f9');
  const [inspectionTypeId, setInspectionTypeId] = useState('');
  const [organozationId, setOrganozationId] = useState('');
  const [natureId, setNatureId] = useState('');
  const [dastoorolAmalFlag, setDastoorolAmalFlag] = useState(false);
  const [gardeshKarFlag, setGardeshKarFlag] = useState(false);
  const [provincialGardeshKarFlag, setProvincialGardeshKarFlag] =
    useState(false);
  const [provincialDastoorolAmalFlag, setProvincialDastoorolAmalFlag] =
    useState(false);
  const [deputyPlanningFlag, setDeputyPlanningFlag] = useState(false);
  const [scopePlanningFlag, setScopePlanningFlag] = useState(false);
  const [documentFlag, setDocumentFlag] = useState(false);

  const [selectedViewType, setSelectedViewType] = useState<
    InspectionPlanningViewTypeEnum | undefined
  >(InspectionPlanningViewTypeEnum.PLANNING);

  const navigate = useNavigate();
  const [htmlText, setHtmlText] = useState<string>('');
  const [gardeshKarText, setGardeshKarText] = useState<string>('');
  const [provincialGardeshKarText, setProvincialGardeshKarText] = useState('');
  const [provincialDastoorolAmalText, setProvincialDastoorolAmalText] =
    useState('');

  useEffect(() => {
    if (planData) {
      setGardeshKarText(
        GardeshKar({
          AJA: true,
          totalInspection: planData?.number,
          systematic:
            planData?.inspectionType?.find(
              item => item.key === 'BARNAMEI_SYSTEMATIC'
            )?.number ?? 0,
          gheireMoteraghebeh:
            planData?.inspectionType?.find(
              item => item.key === 'GHEIRE_MOTERAGHEBEH'
            )?.number ?? 0,
          peigiri:
            planData?.inspectionType?.find(
              item => item.key === 'PEYGIRI_BAZRASI'
            )?.number ?? 0,
          nezaratsetadi:
            planData?.inspectionType?.find(
              item => item.key === 'NEZARAT_SETADI'
            )?.number ?? 0,
          khodArzyabi:
            planData?.inspectionType?.find(item => item.key === 'KHOD_ARZYABI')
              ?.number ?? 0,

          rastiAzmayiYear: planData?.year - 1,
          rastiAzmayi:
            planData?.inspectionType?.find(item => item.key === 'RASTY_AZMAIE')
              ?.number ?? 0,
          moavenBazrasi:
            planData?.inspectionType?.find(
              item => item.key === 'ARZYABI_MOAVEN_BAZRASI'
            )?.number ?? 0,
          year: planData?.year,
          data: planData,
          value: counterGardesh1?.value,
        })
      );
      const currentTypeData = planData?.inspectionType?.find(
        (t: any) => t.key === 'PROVINCIAL_PISH_BAZDID'
      );
      const provinces = (currentTypeData as any)?.provinces || [];
      setProvincialGardeshKarText(
        ProvincialGardeshKar(
          planData.year,
          provinces,
          counterProvGardesh1?.value
        )
      );
      setProvincialDastoorolAmalText(
        ProvincialDastoorolAmal(
          planData.year,
          counterProvAmal2?.value,
          forces?.data
        )
      );
      setHtmlText(
        DastoorolAmal({
          AJA: true,
          totalInspection: planData?.number,
          systematic:
            planData?.inspectionType?.find(
              item => item.key === 'BARNAMEI_SYSTEMATIC'
            )?.number ?? 0,
          gheireMoteraghebeh:
            planData?.inspectionType?.find(
              item => item.key === 'GHEIRE_MOTERAGHEBEH'
            )?.number ?? 0,
          peigiri:
            planData?.inspectionType?.find(
              item => item.key === 'PEYGIRI_BAZRASI'
            )?.number ?? 0,
          nezaratsetadi:
            planData?.inspectionType?.find(
              item => item.key === 'NEZARAT_SETADI'
            )?.number ?? 0,
          khodArzyabi:
            planData?.inspectionType?.find(item => item.key === 'KHOD_ARZYABI')
              ?.number ?? 0,

          rastiAzmayiYear: planData?.year - 1,
          rastiAzmayi:
            planData?.inspectionType?.find(item => item.key === 'RASTY_AZMAIE')
              ?.number ?? 0,
          moavenBazrasi:
            planData?.inspectionType?.find(
              item => item.key === 'ARZYABI_MOAVEN_BAZRASI'
            )?.number ?? 0,
          year: planData?.year,
          tableData: planData,
          recieverForces: forces?.data,
          value: counterAmal2?.value,
        })
      );
      planData?.status === PLANNING_STATE.WAITING_FOR_APPROVE_DETAILS &&
        setDisableFlag(true);
      planData?.status === PLANNING_STATE.WAITING_FOR_APPROVE_DETAILS &&
        setSelectedInspectionTypeIndex(TAB_TITLES.length - 1);
    }
  }, [planData, forces]);

  const handleGardeshKarText = (text: string) => {
    setGardeshKarText(text);
  };
  const handleHtmlText = (text: string) => {
    setHtmlText(text);
  };

  const handleSelectInspectionPlanningType = (
    e: React.SyntheticEvent,
    InspectionTypeIndex: number
  ) => {
    if (InspectionTypeIndex !== TAB_TITLES.length - 1) {
      setSelectedInspectionTypeIndex(InspectionTypeIndex ?? 0);

      const currentKey = ALL_STEPS[InspectionTypeIndex];
      if (!PROVINCIAL_KEYS.includes(currentKey)) {
        setSelectedPanelIndex(0);
        setSelectedInspectionNatureIndex(
          'a7271b0e-d4e9-410c-b6d5-285b89ccb9f9'
        );
        setNatureId('a7271b0e-d4e9-410c-b6d5-285b89ccb9f9');
        setActiveStep(0);
      }
    } else {
      setSelectedInspectionTypeIndex(InspectionTypeIndex ?? 0);
    }
  };

  const handleSelectInspectionNatureIndex = (
    e: React.SyntheticEvent,
    InspectionNatureIndex: NatureInfoEnum
  ) => {
    setSelectedInspectionNatureIndex(InspectionNatureIndex);
    setNatureId(InspectionNatureIndex);
    setActiveStep(
      natureList.findIndex(
        item => item.organizationTypeId === InspectionNatureIndex
      )
    );
  };
  const handleSelectFabs = (viewType?: InspectionPlanningViewTypeEnum) => {
    setSelectedViewType(viewType);
  };
  const handlePreviewPanel = (e: React.SyntheticEvent, index: number) => {
    setSelectedPanelIndex(index ?? 0);
    setSelectedInspectionNatureIndex(natureList[0]?.organizationTypeId);
    setNatureId(natureList[0]?.organizationTypeId);
    setActiveStep(0);
  };

  useEffect(() => {
    const currentKey = ALL_STEPS[selectedInspectionTypeIndex];
    if (
      PROVINCIAL_KEYS.includes(currentKey) ||
      selectedInspectionTypeIndex === TAB_TITLES.length - 1
    )
      return;

    setNatureList(
      planData?.inspectionType
        ?.find(
          item =>
            item.key ===
            (ALL_STEPS[
              selectedInspectionTypeIndex
            ] as keyof typeof inspectionTypeNames)
        )
        ?.organizations?.find(
          organ =>
            organ.organizationUnitName ===
            organizationTypes[
              organizations[
                selectedPanelIndex
              ] as keyof typeof OrganizationTypeEnum
            ]
        )?.organizationType ?? ([] as APINature[])
    );

    setInspectionTypeId(
      planData?.inspectionType?.find(
        item =>
          item.key ===
          (ALL_STEPS[
            selectedInspectionTypeIndex
          ] as keyof typeof inspectionTypeNames)
      )?.id ?? ''
    );

    setOrganozationId(
      planData?.inspectionType
        ?.find(
          item =>
            item.key ===
            (ALL_STEPS[
              selectedInspectionTypeIndex
            ] as keyof typeof inspectionTypeNames)
        )
        ?.organizations?.find(
          organ =>
            organ.organizationUnitName ===
            organizationTypes[
              organizations[
                selectedPanelIndex
              ] as keyof typeof OrganizationTypeEnum
            ]
        )?.id ?? ''
    );

    let x =
      planData?.inspectionType
        ?.find(
          item =>
            item.key ===
            (ALL_STEPS[
              selectedInspectionTypeIndex
            ] as keyof typeof inspectionTypeNames)
        )
        ?.organizations?.find(
          organ =>
            organ.organizationUnitName ===
            organizationTypes[
              organizations[
                selectedPanelIndex
              ] as keyof typeof OrganizationTypeEnum
            ]
        )?.organizationType ?? ([] as APINature[]);
    setNatureId(x[0]?.organizationTypeId);
    setActiveStep(0);
  }, [planData, selectedInspectionTypeIndex, selectedPanelIndex]);

  const handleNext = (unitsData: Array<APISuggestionUnit>) => {
    mutate(
      {
        entity: InspectionApis.annualPlanning.suggestionConflict,
        method: 'POST',
        data: {
          annualPlanInspectionId: inspectionTypeId,
          organizationParentId: organozationId,
          organizationTypeId: natureId,
          selectionOrgAndSeasons: [
            ...unitsData.map((item: APISuggestionUnit) => ({
              organizationId: item.organizationId,
              organizationName: item.organizationName,
              organizationReference: item.organizationReference ?? undefined,
              organizationReferenceName:
                item.organizationReferenceName ?? undefined,
              season: item.season,
            })),
          ],
        },
      } as any,
      {
        onSuccess: (res: any) => {
          if (activeStep === natureList.length - 1) {
            selectedPanelIndex !== 4
              ? setSelectedPanelIndex(prevIndex => prevIndex + 1)
              : selectedInspectionTypeIndex !== 7
                ? (() => {
                    setSelectedInspectionTypeIndex(prev => prev + 1);
                    setSelectedPanelIndex(0);
                  })()
                : navigate('/operation/planning/aja');
          } else {
            setActiveStep(prevActiveStep => prevActiveStep + 1);
            setNatureId(natureList[activeStep + 1].organizationTypeId);
          }
        },
      }
    );
  };
  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
    setNatureId(natureList[activeStep - 1].organizationTypeId);
  };

  const handleUploadButton = key => {
    console.log(filesToUpload[key].ref);
    if (!filesToUpload[key].ref || !filesToUpload[key].ref.current) return;
    console.log('dfsdfsdf');
    filesToUpload[key].ref.current.click();
  };

  const handleUpload = async (
    uploadedFile: File | null,
    uploadKey: string,
    uploadLink: string | null,
    uploadName: string
  ) => {
    const formData = new FormData();
    if (uploadedFile || uploadLink) {
      if (uploadedFile) formData.append('file', uploadedFile);
      formData.append('description', uploadName);
      formData.append('key', uploadKey);
      if (uploadLink) formData.append('link', uploadLink);
      mutateFile(
        {
          entity: `api/file-storages/upload-file/${myId}`,
          method: 'POST',
          data: formData,
        } as any,
        {
          onSuccess: (res: any) => {
            if (!res) {
              setError(res.message);
            } else {
              snackbar('آپلود گردشکار با موفقیت انجام شد', 'success', 5000);
            }
          },
          onError: () => snackbar('خطا در آپلود', 'error', 5000),
        }
      );
    }
  };
  const handleAvamer = (text: string) => {
    setAvamerSadere(text);
  };

  const handleFinalSubmit = async () => {
    for (const key of Object.keys(filesToUpload)) {
      const item = filesToUpload[key];
      if (!item.link && !item.file) {
        snackbar('لطفا تمام فایل ها را بارگذاری نمایید', 'error', 5000);
        return;
      }
    }
    for (const key of Object.keys(filesToUpload)) {
      await handleUpload(
        filesToUpload[key].file,
        key,
        filesToUpload[key].link,
        filesToUpload[key].name
      );
    }
    mutate(
      {
        entity: InspectionApis.annualPlanning.saveCartable(myId),
        method: 'post',
      } as any,
      {
        onSuccess: () => {
          navigate('/amar');
        },
        onError: () => {
          snackbar('خطا در ارسال به کارتابل', 'error', 5000);
        },
      }
    );
  };

  const renderProvincialTable = () => {
    const currentKey = ALL_STEPS[selectedInspectionTypeIndex];
    const currentTypeData = planData?.inspectionType?.find(
      (t: any) => t.key === currentKey
    );
    const provinces = (currentTypeData as any)?.provinces || [];

    if (!provinces || provinces.length === 0) {
      return (
        <Box p={3} textAlign="center">
          <Typography color="textSecondary">
            هیچ استانی برای این مرحله در نظر گرفته نشده است.
          </Typography>
        </Box>
      );
    }

    return (
      <Table sx={{ border: '1px solid #e0e0e0', mt: 2 }}>
        <TableHead sx={{ bgcolor: '#f5f5f5' }}>
          <TableRow>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>
              نام استان
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>
              فصل بازرسی
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>
              ماه بازرسی
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {provinces.map((p: any, idx: number) => (
            <TableRow key={idx}>
              <TableCell align="center">{p.provinceName || '-'}</TableCell>
              <TableCell align="center">
                {SeasonLabels[p.season] || p.season || '-'}
              </TableCell>
              <TableCell align="center">
                {Months.find(i => i.key === p.month)?.label || '-'}
              </TableCell>{' '}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const isProvincialStep = PROVINCIAL_KEYS.includes(
    ALL_STEPS[selectedInspectionTypeIndex]
  );
  const isFinalTab = selectedInspectionTypeIndex === TAB_TITLES.length - 1;

  return (
    <>
      {
        <Grid
          container
          justifyContent="center"
          alignItems={'center'}
          spacing={1}
          marginTop={0}
        >
          <Grid size={{ xs: 11 }}>
            <Box
              display={'flex'}
              justifyContent={'flex-start'}
              alignItems={'center'}
            >
              <Icon sx={{ fontSize: 40, m: 1 }} color={'primary'} />
              <Typography
                variant="h6"
                component="h2"
                fontWeight={'bold'}
                align="center"
              >
                {myservice?.title}
              </Typography>
            </Box>

            <Box
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'bottom'}
              padding={2}
            >
              <Typography variant="subtitle1" component={'h3'} marginLeft={2}>
                {myservice?.description}
              </Typography>
              <BackButton
                onBack={() => navigate(`/operation/planning/aja`)}
                minWidth={150}
                color="primary"
                text="بازگشت"
              />
            </Box>
          </Grid>

          <Grid size={{ xs: 11 }} paddingTop={0}>
            <MatnaTabBar
              selectedTabIndex={selectedInspectionTypeIndex}
              tabs={TAB_TITLES}
              onSelectTab={index =>
                handleSelectInspectionPlanningType(null, index)
              }
            />

            {!isFinalTab && (
              <Box mt={2}>
                {isProvincialStep ? (
                  <Paper elevation={1} sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom color="primary">
                      لیست استان‌های انتخاب شده برای:{' '}
                      {TAB_TITLES[selectedInspectionTypeIndex]}
                    </Typography>
                    {renderProvincialTable()}
                  </Paper>
                ) : (
                  <Box>
                    <ServiceTabs
                      selected={selectedPanelIndex}
                      data={myservice}
                      click={handlePreviewPanel}
                    />
                    <InspectionNatureTabs
                      selectedNatureId={natureId}
                      natures={natureList}
                      onClick={handleSelectInspectionNatureIndex}
                    />
                    <ServicePanel
                      activeStep={activeStep}
                      handleNext={handleNext}
                      handleBack={handleBack}
                      idData={[inspectionTypeId, organozationId]}
                      click={handleSelectFabs}
                      inspectionViewType={selectedViewType}
                      type={myservice?.type}
                      servicePanelData={
                        organizationTypes[
                          organizations[
                            selectedPanelIndex
                          ] as keyof typeof OrganizationTypeEnum
                        ]
                      }
                      natureId={natureId}
                      inspectionType={selectedInspectionTypeIndex}
                      natureList={natureList}
                    />
                  </Box>
                )}
              </Box>
            )}
          </Grid>

          {/* تب ثبت نهایی */}
          {isFinalTab && (
            <Paper
              elevation={3}
              sx={{
                mt: 4,
                display: 'flex',
                alignContent: 'center',
                maxWidth: '80%',
                padding: '10px',
              }}
            >
              <Stack direction={'column'} spacing={2}>
                {!disableFlag && (
                  <Stack spacing={1}>
                    <Button
                      variant={gardeshKarFlag ? 'contained' : 'outlined'}
                      size="large"
                      sx={{ mr: 3 }}
                      onClick={() => setGardeshKarFlag(showprev => !showprev)}
                      endIcon={<HistoryEdu />}
                    >
                      گردش کار بازرسی ها و نظارت
                    </Button>
                    <Button
                      variant={dastoorolAmalFlag ? 'contained' : 'outlined'}
                      size="large"
                      sx={{ mr: 3 }}
                      onClick={() =>
                        setDastoorolAmalFlag(showprev => !showprev)
                      }
                      endIcon={<HistoryEdu />}
                    >
                      دستور العمل بازرسی ها و نظارت
                    </Button>
                    <Button
                      variant={
                        provincialGardeshKarFlag ? 'contained' : 'outlined'
                      }
                      size="large"
                      sx={{ mr: 3 }}
                      onClick={() =>
                        setProvincialGardeshKarFlag(showprev => !showprev)
                      }
                      endIcon={<HistoryEdu />}
                    >
                      گردش کار بازدید های استانی
                    </Button>
                    <Button
                      variant={
                        provincialDastoorolAmalFlag ? 'contained' : 'outlined'
                      }
                      size="large"
                      sx={{ mr: 3 }}
                      onClick={() =>
                        setProvincialDastoorolAmalFlag(showprev => !showprev)
                      }
                      endIcon={<HistoryEdu />}
                    >
                      دستورالعمل بازدید های استانی
                    </Button>
                    <Button
                      endIcon={<Book />}
                      color="info"
                      onClick={() => setDocumentFlag(true)}
                      variant="outlined"
                    >
                      برنامه بازرسی‌ها، نظارت و ارزیابی‌‌های پیش‌بینی‌شده معاونت
                      بازرسی و ایمنی آجا (پیوست الف)
                    </Button>
                    <Button
                      variant={scopePlanningFlag ? 'contained' : 'outlined'}
                      size="large"
                      color="info"
                      sx={{ mr: 3 }}
                      onClick={() =>
                        setScopePlanningFlag(showprev => !showprev)
                      }
                      endIcon={<Book />}
                    >
                      بازرسی‌های تجمیعی حوزه ، ایمنی، ارزشیابی، صیانت و
                      رسیدگی‌ها (پیوست ب)
                    </Button>
                    <Button
                      variant={deputyPlanningFlag ? 'contained' : 'outlined'}
                      size="large"
                      sx={{ mr: 3 }}
                      color="info"
                      onClick={() =>
                        setDeputyPlanningFlag(showprev => !showprev)
                      }
                      endIcon={<Book />}
                    >
                      طرح‌ریزی بازرسی و نظارت تخصصی - ستادی معاونت‌ها، سازمان‌ها
                      و اداره‌های ستاد آجا (پیوست پ)
                    </Button>
                  </Stack>
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
                  <Stack spacing={1}>
                    {Object.keys(filesToUpload).map(key => {
                      if (!filesToUpload[key].link) {
                        return (
                          <Tooltip
                            title={
                              filesToUpload[key].file
                                ? 'نام فایل: ' +
                                  filesToUpload[key].file.name +
                                  ' __ سایز فایل: ' +
                                  filesToUpload[key].file.size
                                : 'فایلی انتخاب نشده'
                            }
                            sx={{ ml: 3 }}
                          >
                            <Button
                              variant={
                                filesToUpload[key].file ? 'contained' : 'text'
                              }
                              color={
                                filesToUpload[key].file
                                  ? 'secondary'
                                  : 'primary'
                              }
                              size="large"
                              onClick={e => {
                                e.preventDefault();
                                handleUploadButton(key);
                              }}
                              endIcon={
                                filesToUpload[key].file ? (
                                  <CheckCircle />
                                ) : (
                                  <Upload />
                                )
                              }
                            >
                              {filesToUpload[key].name}
                            </Button>
                          </Tooltip>
                        );
                      }
                    })}
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
                  </Stack>
                )}
                {Object.keys(filesToUpload).map(key => {
                  return (
                    <input
                      hidden
                      ref={filesToUpload[key].ref}
                      type="file"
                      id={key}
                      name={key}
                      aria-label="kopk"
                      onChange={e => {
                        setFilesToUpload(oldFiles => {
                          const newFiles = { ...oldFiles };
                          newFiles[key].file = !!e.target.files
                            ? e.target.files[0]
                            : null;
                          return newFiles;
                        });
                      }}
                    />
                  );
                })}
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
                      onClick={handleFinalSubmit}
                    >
                      تایید نهایی
                    </Button>
                  </Grid>
                )}
              </Stack>
            </Paper>
          )}
          {selectedInspectionTypeIndex === TAB_TITLES.length - 1 &&
            !disableFlag &&
            gardeshKarFlag && (
              <Modal
                open={gardeshKarFlag}
                onClose={() => {
                  setGardeshKarFlag(false);
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
                  {gardeshKarFlag && (
                    <Grid container width={'22cm'}>
                      <Grid size={{ xs: 12, md: 12 }}>
                        <Button
                          onClick={() => setGardeshKarFlag(false)}
                          color="error"
                          variant="contained"
                          sx={{ margin: '10px' }}
                        >
                          بستن
                        </Button>
                        <MatnaEditor
                          initialData={gardeshKarText}
                          onChange={(_, editor) => {
                            handleGardeshKarText(editor.getData());
                          }}
                        />
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              </Modal>
            )}
          {selectedInspectionTypeIndex === TAB_TITLES.length - 1 &&
            !disableFlag &&
            provincialGardeshKarFlag && (
              <Modal
                open={provincialGardeshKarFlag}
                onClose={() => {
                  setProvincialGardeshKarFlag(false);
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
                  {provincialGardeshKarFlag && (
                    <Grid container width={'22cm'}>
                      <Grid size={{ xs: 12, md: 12 }}>
                        <Button
                          onClick={() => setProvincialGardeshKarFlag(false)}
                          color="error"
                          variant="contained"
                          sx={{ margin: '10px' }}
                        >
                          بستن
                        </Button>
                        <MatnaEditor
                          initialData={provincialGardeshKarText}
                          onChange={(_, editor) => {
                            setProvincialGardeshKarText(editor.getData());
                          }}
                        />
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              </Modal>
            )}
          {selectedInspectionTypeIndex === TAB_TITLES.length - 1 &&
            !disableFlag &&
            provincialDastoorolAmalFlag && (
              <Modal
                open={provincialDastoorolAmalFlag}
                onClose={() => {
                  setProvincialDastoorolAmalFlag(false);
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
                  {provincialDastoorolAmalFlag && (
                    <Grid container width={'22cm'}>
                      <Grid size={{ xs: 12, md: 12 }}>
                        <Button
                          onClick={() => setProvincialDastoorolAmalFlag(false)}
                          color="error"
                          variant="contained"
                          sx={{ margin: '10px' }}
                        >
                          بستن
                        </Button>
                        <MatnaEditor
                          initialData={provincialDastoorolAmalText}
                          onChange={(_, editor) => {
                            setProvincialDastoorolAmalText(editor.getData());
                          }}
                        />
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              </Modal>
            )}
          {selectedInspectionTypeIndex === TAB_TITLES.length - 1 &&
            !disableFlag &&
            dastoorolAmalFlag && (
              <Modal
                open={dastoorolAmalFlag}
                onClose={() => {
                  setDastoorolAmalFlag(false);
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
                  {dastoorolAmalFlag && (
                    <Grid container width={'22cm'}>
                      <Grid size={{ xs: 12, md: 12 }}>
                        <Button
                          onClick={() => setDastoorolAmalFlag(false)}
                          color="error"
                          variant="contained"
                          sx={{ marginY: '10px', paddingX: '20px' }}
                        >
                          بستن
                        </Button>
                        <MatnaEditor
                          initialData={htmlText}
                          onChange={(_, editor) => {
                            handleHtmlText(editor.getData());
                          }}
                        />
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              </Modal>
            )}
          {selectedInspectionTypeIndex === TAB_TITLES.length - 1 &&
            !disableFlag &&
            deputyPlanningFlag && (
              <Modal
                open={deputyPlanningFlag}
                onClose={() => {
                  setDeputyPlanningFlag(false);
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
                  width={'95%'}
                  padding={1}
                  bgcolor={'white'}
                  minHeight={'40vh'}
                  overflow={'auto'}
                  maxHeight={'90vh'}
                  justifyContent={'center'}
                >
                  <DeputyPlanningReport
                    year={planData?.year}
                    onBack={() => setDeputyPlanningFlag(false)}
                  />
                </Grid>
              </Modal>
            )}
          {selectedInspectionTypeIndex === TAB_TITLES.length - 1 &&
            !disableFlag &&
            scopePlanningFlag && (
              <Modal
                open={scopePlanningFlag}
                onClose={() => {
                  setScopePlanningFlag(false);
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
                  width={'95%'}
                  padding={1}
                  bgcolor={'white'}
                  minHeight={'40vh'}
                  overflow={'auto'}
                  maxHeight={'90vh'}
                  justifyContent={'center'}
                >
                  <ScopePlanningReport
                    year={planData?.year}
                    onBack={() => setScopePlanningFlag(false)}
                  />
                </Grid>
              </Modal>
            )}
          {selectedInspectionTypeIndex === TAB_TITLES.length - 1 &&
            !disableFlag &&
            documentFlag && (
              <Modal
                open={documentFlag}
                onClose={() => {
                  setDocumentFlag(false);
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
                  width={'95%'}
                  padding={1}
                  bgcolor={'white'}
                  minHeight={'40vh'}
                  overflow={'auto'}
                  maxHeight={'90vh'}
                  justifyContent={'center'}
                >
                  <PlanningReport
                    annualPlanningId={myId}
                    onBack={() => setDocumentFlag(false)}
                  />
                </Grid>
              </Modal>
            )}
        </Grid>
      }
    </>
  );
}
