import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import type { GridColDef } from '@mui/x-data-grid';
import {
  DeputiesEnum,
  organizationTypes,
  organs,
  OrganizationTypeEnum,
  type FinalReportData,
} from '../../types.ts';
import { Book, Map } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router';
import BackButton from '@/components/button/BackButton.tsx';
import ProvincePanel from './ProvincePanel.tsx';
import { useApiQuery } from '@/hooks/useApi.ts';
import InspectionApis from '@/modules/inspection-operation/api.ts';

export type SeasonData = {
  id: number;
  season: string;
  seasonId:
    | 'first_season'
    | 'secound_season'
    | 'third_season'
    | 'fourth_season';
  color: string;
};

export default function MapDocument() {
  const [selectedinsTypeIndex, setSelectedinsTypeIndex] =
    useState<DeputiesEnum>(DeputiesEnum.amad_poshtibani);
  const [niroo, setNiroo] = useState({
    value: null,
    name: 'همه',
  });

  const nirooItems = [
    {
      value: null,
      name: 'همه',
    },
    {
      value: '45c4d624-919d-4313-be7c-acd32e669783',
      name: 'نزاجا',
    },
    {
      value: 'ec9f60dd-119d-4e3d-965f-6b8e2605efa6',
      name: 'نداجا',
    },
    {
      value: '0136a680-9c32-4a00-bd77-4b624f60908a',
      name: 'نهاجا',
    },
    {
      value: '9432e347-9959-468e-afa3-f11a12c24435',
      name: 'نپاجا',
    },
    {
      value: '09c4a69c-c159-43b6-9968-c5a41239a5fb',
      name: 'یگانهای تابعه آجا',
    },
  ];

  const handleSelectinsTypeIndex = (
    e: React.SyntheticEvent,
    insType: DeputiesEnum
  ) => {
    setSelectedinsTypeIndex(insType || DeputiesEnum.amad_poshtibani);
  };
  const navigate = useNavigate();
  const [year, setYear] = useState(0);
  const { selectedYear } = useParams();

  const {
    data: finalReport,
    refetch,
    status,
  } = useApiQuery<FinalReportData, any, any, FinalReportData>({
    url: selectedYear
      ? InspectionApis.annualPlanning.finalReport(selectedYear)
      : null,
    select: res => res.data,
    enabled: !!selectedYear && selectedYear !== 'new',
  });

  const rows = useMemo(
    (): SeasonData[] => [
      { id: 1, season: 'بهار', seasonId: 'first_season', color: 'yellowgreen' },
      { id: 2, season: 'تابستان', seasonId: 'secound_season', color: 'orange' },
      {
        id: 3,
        season: 'پاییز',
        seasonId: 'third_season',
        color: 'lightsalmon',
      },
      { id: 4, season: 'زمستان', seasonId: 'fourth_season', color: 'skyblue' },
    ],
    []
  );

  const myRenderCell = ({ row, insType }: { row: any; insType: any }) => {
    // const inspectionScope = row?.DEPUTIES?.[insType];
    const inspectionScope = finalReport?.inspectionType
      ?.find(item => item.key === insType)
      ?.season?.find(oItem => oItem?.season === row?.seasonId)?.organizations;
    const seasonIndex = [
      'first_season',
      'secound_season',
      'third_season',
      'fourth_season',
    ];
    console.log('organs=>', organs);
    return (
      <Box
        display={'flex'}
        minHeight={'80px'}
        justifyContent={'center'}
        flexDirection={'column'}
        bgcolor={row.color}
      >
        {inspectionScope &&
          organs.map((orgItem, orgKey) => (
            <Card
              key={orgKey}
              sx={{
                width: '98%',
                justifyContent: 'center',
                m: '2px',
                opacity: '80%',
              }}
            >
              <CardContent
                sx={{
                  padding: '5px',
                  display: 'block',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  justifyContent: 'start',
                  whiteSpace: 'nowrap',
                  minHeight: '100px',
                }}
              >
                {inspectionScope
                  ?.find((dItem: any) => dItem?.forceKey === orgItem)
                  ?.units?.map((unit: any, unitKey: number) => (
                    <Tooltip title={unit?.organizationName}>
                      <Typography
                        key={unitKey}
                        display={'block'}
                        variant="caption"
                        overflow={'hidden'}
                        textOverflow={'ellipsis'}
                      >
                        -{unit?.organizationName}
                      </Typography>
                    </Tooltip>
                  ))}
              </CardContent>
            </Card>
          ))}
      </Box>
    );
  };
  //   "بازرسی بنا به دستور",

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'season',
        headerName: 'فصل',
        flex: 0.7,
        sortable: false,
        align: 'center',
        renderCell: ({ row }: { row: SeasonData }) => {
          return (
            <Box
              sx={{ display: 'flex', height: '100%', flexDirection: 'column' }}
              alignItems="center"
              justifyContent="center"
            >
              <Typography
                variant="subtitle1"
                component="div"
                fontWeight={'bold'}
              >
                {row?.season}
              </Typography>
            </Box>
          );
        },
      },
      {
        field: 'forces',
        headerName: 'نیروها',
        flex: 0.7,
        sortable: false,
        align: 'center',
        renderCell: ({ row }: { row: SeasonData }) => {
          return (
            <Box
              sx={{ display: 'flex', height: '100%', flexDirection: 'column' }}
              alignItems="center"
              justifyContent="center"
            >
              {Object.keys(organizationTypes)?.map(
                (orgKey: string, orgIndex: number) => (
                  <Typography
                    variant="body2"
                    component="div"
                    minHeight={'100px'}
                    textAlign={'center'}
                    fontWeight={'bold'}
                  >
                    {
                      organizationTypes[
                        orgKey as keyof typeof OrganizationTypeEnum
                      ]
                    }
                  </Typography>
                )
              )}
            </Box>
          );
        },
      },
      {
        headerAlign: 'center',
        field: 'RASTY_AZMAIE',
        headerName: 'راستی آزمایی',
        cellClassName: () => 'lowPaddingCell',
        flex: 2,
        sortable: false,
        renderCell: ({ row }: { row: any }) =>
          myRenderCell({ row, insType: 'RASTY_AZMAIE' }),
      },
      {
        cellClassName: () => 'lowPaddingCell',
        headerClassName: () => 'myh',
        field: 'PEYGIRI_BAZRASI',
        headerName: 'پیگیری بازرسی',
        flex: 2,
        renderCell: ({ row }: { row: any }) =>
          myRenderCell({ row, insType: 'PEYGIRI_BAZRASI' }),
      },
      {
        cellClassName: () => 'lowPaddingCell',
        headerClassName: () => 'myh',

        field: 'KHOD_ARZYABI',
        headerName: 'برنامه ای به روش خودارزیابی',
        flex: 2,
        renderCell: ({ row }: { row: any }) =>
          myRenderCell({ row, insType: 'KHOD_ARZYABI' }),
      },
      {
        cellClassName: () => 'lowPaddingCell',
        headerClassName: () => 'myh',

        field: 'ARZYABI_MOAVEN_BAZRASI',
        headerName: 'ارزیابی معاون بازرسی',
        flex: 2,
        renderCell: ({ row }: { row: any }) =>
          myRenderCell({ row, insType: 'ARZYABI_MOAVEN_BAZRASI' }),
      },
      {
        cellClassName: () => 'lowPaddingCell',
        headerClassName: () => 'myh',

        field: 'GHEIRE_MOTERAGHEBEH',
        headerName: 'غیر مترقبه (خاص) ',
        flex: 2,
        renderCell: ({ row }: { row: any }) =>
          myRenderCell({ row, insType: 'GHEIRE_MOTERAGHEBEH' }),
      },
      {
        cellClassName: () => 'lowPaddingCell',
        headerClassName: () => 'myh',
        field: 'BARNAMEI_SYSTEMATIC',
        headerName: 'برنامه‌ای (سیستماتیک)',
        flex: 2,
        renderCell: ({ row }: { row: any }) =>
          myRenderCell({ row, insType: 'BARNAMEI_SYSTEMATIC' }),
      },
      {
        cellClassName: () => 'lowPaddingCell',
        headerClassName: () => 'myh',
        field: 'NEZARAT_SETADI',
        headerName: 'نظارت ستادی',
        flex: 2,
        headerAlign: 'center',
        renderCell: ({ row }: { row: any }) =>
          myRenderCell({ row, insType: 'NEZARAT_SETADI' }),
      },
    ],
    [finalReport]
  );

  useEffect(() => {}, []);

  return (
    <Box
      sx={{ padding: 0, paddingTop: 4, borderRadius: 1, mb: 2, width: '100%' }}
    >
      {
        <Grid container>
          <Grid
            container
            size={{ md: 12 }}
            m={2}
            display={'flex'}
            justifyContent={'space-between'}
          >
            <Box display="flex" mb={1}>
              <Map />
              <Typography variant="h6" component={'h3'}>
                نقشه راهنمای بازرسی سال {selectedYear}
              </Typography>
              <Autocomplete
                id="niroo"
                onChange={(event, newValue) => {
                  setNiroo(newValue);
                }}
                renderOption={(props, option) => (
                  <li {...props} key={option.value}>
                    {option.name}
                  </li>
                )}
                value={niroo}
                // inputValue={niroo}
                clearOnBlur
                options={nirooItems}
                sx={{ width: 200, ml: 2 }}
                getOptionLabel={option => option.name}
                renderInput={params => (
                  <TextField {...params} label="نیروی انتخابی" />
                )}
                isOptionEqualToValue={(option, value) => {
                  return `${option}` === `${value}`;
                }}
              />
            </Box>
            <Box display="flex">
              <Tooltip
                sx={{ mb: 2, mr: 2 }}
                title="گزارش یگان‌های راهنمایی بازرسی "
              >
                <IconButton
                  onClick={() =>
                    navigate(
                      `/operation/planning/aja/unit-report/${finalReport?.id}`
                    )
                  }
                >
                  <Book color="info" />
                </IconButton>
              </Tooltip>

              <BackButton
                onBack={() => navigate(-1)}
                minWidth={150}
                color="primary"
                text="بازگشت"
              />
            </Box>
          </Grid>
          <Grid size={{ md: 12 }} p={2} pt={0}>
            <ProvincePanel
              yearSelected={selectedYear ?? '1400'}
              forceId={niroo?.value}
            />
          </Grid>
        </Grid>
      }
    </Box>
  );
}
