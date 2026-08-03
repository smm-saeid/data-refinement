import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Skeleton,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useEffect, useMemo, useState, useRef } from 'react';

import type { GridColDef } from '@mui/x-data-grid';
import {
  DeputiesEnum,
  organizationTypes,
  organs,
  OrganizationTypeEnum,
  type FinalReportData,
} from '../../types.ts';
import { Book, Print } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router';
import BackButton from '@/components/button/BackButton';
import { MatnaDataGrid } from '@/components/data-grid/MatnaDataGrid.tsx';
import { useApiQuery } from '@/hooks/useApi.ts';
import InspectionApis from '@/modules/inspection-operation/api.ts';
import { useReactToPrint } from 'react-to-print';

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
export default function AJADocsAPI() {
  const [selectedinsTypeIndex, setSelectedinsTypeIndex] =
    useState<DeputiesEnum>(DeputiesEnum.amad_poshtibani);
  const [autoC, setAutoC] = useState(undefined);
  const [filteredData, setFilteredData] = useState(undefined);
  const [niroo, setNiroo] = useState({
    value: '',
    name: 'همه',
  });
  const nirooItems = [
    {
      value: '',
      name: 'همه',
    },
    {
      value: 'nezaja',
      name: 'نزاجا',
    },
    {
      value: 'nedaja',
      name: 'نداجا',
    },
    {
      value: 'nehaja',
      name: 'نهاجا',
    },
    {
      value: 'nepaja',
      name: 'نپاجا',
    },
    {
      value: 'sayer',
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

  useEffect(() => {
    // console.log(finalReport);
  }, [finalReport]);

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

    return (
      <Box
        display={'flex'}
        minHeight={'80px'}
        justifyContent={'center'}
        flexDirection={'column'}
        bgcolor={row.color}
      >
        {inspectionScope &&
          !niroo.value &&
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
                  ?.find(dItem => dItem?.forceKey === orgItem)
                  ?.units?.map((unit, unitKey: number) => (
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
        {inspectionScope && !!niroo.value && (
          <Card
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
                ?.find(dItem => dItem?.forceKey === niroo.value)
                ?.units?.map((unit, unitKey: number) => (
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
        )}
      </Box>
    );
  };

  const provincialRenderCell = (row, inspectionType) => {
    const provinces = finalReport?.inspectionType?.find(
      item => item.key === inspectionType
    )?.provinces;
    const records = provinces?.filter(item => item.season === row.seasonId);
    return (
      <Box
        display={'flex'}
        height={'100%'}
        justifyContent={'center'}
        flexDirection={'column'}
        bgcolor={row.color}
      >
        <Card
          sx={{
            width: '98%',
            justifyContent: 'center',
            m: '2px',
            opacity: '80%',
            height: '100%',

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
              height: '100%',
            }}
          >
            {records && (<div style={{whiteSpace: 'pre-line'}}>
              {records.map(item => item.provinceName).join('\n')}
            </div>)}
          </CardContent>
        </Card>
      </Box>
    );
  };

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'season',
        headerName: 'فصل',
        flex: 1,
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
                variant="subtitle2"
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
          if (niroo.value === '')
            return (
              <Box
                sx={{
                  display: 'flex',
                  height: '100%',
                  flexDirection: 'column',
                }}
                alignItems="center"
                justifyContent="center"
              >
                {Object.keys(organizationTypes)?.map(
                  (orgKey: string, orgIndex: number) => (
                    <Typography
                      key={orgIndex}
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
          else
            return (
              <Box
                sx={{
                  display: 'flex',
                  height: '100%',
                  flexDirection: 'column',
                }}
                alignItems="center"
                justifyContent="center"
              >
                <Typography
                  variant="body2"
                  component="div"
                  minHeight={'100px'}
                  textAlign={'center'}
                  fontWeight={'bold'}
                >
                  {niroo.name}
                </Typography>
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

        field: 'GHEIRE_MOTERAGHEBEH',
        headerName: 'غیر مترقبه (خاص) ',
        flex: 2,
        // align: "center",
        renderCell: ({ row }: { row: any }) =>
          myRenderCell({ row, insType: 'GHEIRE_MOTERAGHEBEH' }),
      },
      {
        cellClassName: () => 'lowPaddingCell',
        headerClassName: () => 'myh',
        field: 'BARNAMEI_SYSTEMATIC',
        headerName: 'برنامه‌ای (سیستماتیک)',
        // align: "center",
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
      {
        headerAlign: 'center',
        field: 'PROVINCIAL_PISH_BAZDID',
        headerName: 'بازرسی و ارزیابی توان و آمادگی رزم(پیش بازدید)',
        cellClassName: () => 'lowPaddingCell',
        flex: 2,
        sortable: false,
        renderCell: ({ row }) =>
          provincialRenderCell(row, 'PROVINCIAL_PISH_BAZDID'),
      },
      {
        headerAlign: 'center',
        field: 'PROVINCIAL_BAZDID_FARMANDEHI',
        headerName: 'بازدید فرماندهی از توان و آمادگی رزم(استانی)',
        cellClassName: () => 'lowPaddingCell',
        flex: 2,
        sortable: false,
        renderCell: ({ row }) =>
          provincialRenderCell(row, 'PROVINCIAL_BAZDID_FARMANDEHI'),
      },
      {
        headerAlign: 'center',
        field: 'PROVINCIAL_PEYGIRI',
        headerName: 'پیگیری مصوبات بازدیدهای استانی',
        cellClassName: () => 'lowPaddingCell',
        flex: 2,
        sortable: false,
        renderCell: ({ row }) =>
          provincialRenderCell(row, 'PROVINCIAL_PEYGIRI'),
      },
    ],
    [finalReport, niroo]
  );

  const ref = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: ref,

    pageStyle: `
    @page{
      size: A4 landscape;
      margin 20mm;
      
    }

    body {
      direcion: rtl;
    }

  .printalbe {
    direcion: rtl;
    unicode-bidi: embed;
    text-align: righ;
  }
    `,
  });

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
              <Book />
              <Typography variant="h6" component={'h3'}>
                گزارشات راهنمای بازرسی سال {selectedYear}
              </Typography>
              <Autocomplete
                id="niroo"
                onChange={(event, newValue) => {
                  setNiroo(newValue);
                  setAutoC(newValue.name);
                }}
                renderOption={(props, option) => (
                  <li {...props} key={option.value}>
                    {option.name}
                  </li>
                )}
                value={autoC}
                inputValue={autoC}
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
                title="گزارش حوزه‌های معاونت بازرسی"
              >
                <IconButton
                  onClick={() =>
                    navigate(
                      `/operation/planning/aja/scopes-api/${selectedYear}`
                    )
                  }
                >
                  <Book color="info" />
                </IconButton>
              </Tooltip>

              <Button
                sx={{ width: 150, height: 47, marginRight: 2 }}
                variant="contained"
                color="success"
                onClick={handlePrint}
              >
                <Print /> &nbsp; چاپ
              </Button>

              {/* <Button variant="contained" endIcon={<Book  color="info"/>} sx={{ minWidth: "150px", mb: 2 }} onClick={() => navigate("/inspection/planning/AJA-planning")}></Button> */}
              <BackButton
                onBack={() => navigate(-1)}
                minWidth={150}
                color="warning"
                text="بازگشت"
              />
            </Box>
          </Grid>
          <Grid size={{ md: 12 }} p={2} pt={0}>
            <MatnaDataGrid
              rows={rows}
              rowCount={rows.length}
              columns={columns}
              loading={false}
              // hideFooter
              getRowHeight={() => 'auto'}
              sx={{
                borderColor: '#023e8a',
                borderWidth: '2px',
                fontSize: 'smaller',
                width: '100%',
              }}
              disableDensitySelector
              disableColumnSelector
              disableRowSelectionOnClick
              hideFooter
            />
          </Grid>
          <div
            style={{
              width: '1100px',
              color: 'red',
              position: 'absolute',
              top: '-9999px',
              height: 2000,
            }}
          >
            <div
              ref={ref}
              className="printalbe"
              style={{ width: '100%' }}
              dir="rtl"
              color="red"
            >
              <MatnaDataGrid
                rows={rows}
                columns={columns}
                height={'auto'}
                // hideFooter
                getRowHeight={() => 'auto'}
                hideFooter
                disableDensitySelector
                disableRowSelectionOnClick
              />
              <div style={{ height: 500 }} />
            </div>
          </div>
        </Grid>
      }
    </Box>
  );
}
