import {
  Box,
  Card,
  CardContent,
  Grid,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useMemo, useState } from 'react';
import { MatnaDataGrid } from '@/components/data-grid/MatnaDataGrid.tsx';
import { type GridColDef, GridToolbar } from '@mui/x-data-grid';
import {
  Deputies,
  DeputiesEnum,
  organizationTypes,
  organs,
} from '../../types.ts';
import { Book } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router';
import BackButton from '@/components/button/BackButton';
import { OrganizationTypeEnum } from '../../types.ts';
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
};
export default function ScopeDocsAPI() {
  const [selectedDeputyIndex, setSelectedDeputyIndex] = useState<DeputiesEnum>(
    DeputiesEnum.amad_poshtibani
  );

  const handleSelectDeputyIndex = (
    e: React.SyntheticEvent,
    deputy: DeputiesEnum
  ) => {
    setSelectedDeputyIndex(deputy || DeputiesEnum.amad_poshtibani);
  };
  const navigate = useNavigate();
  const { selectedYear } = useParams();

  const { data: finalReport } = useApiQuery<any, any, any, any>({
    url: InspectionApis.ExpertSuperVision.finalReport(selectedYear),
    select: (res: any) => res.data as Array<any>,
    enabled: !!selectedYear && selectedYear !== 'new',
  });

  const rows = useMemo(
    (): any[] => [
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

  const myRenderCell = ({
    row,
    deputy,
  }: {
    row: any;
    deputy: DeputiesEnum;
  }) => {
    // const inspectionScope = row?.DEPUTIES?.[deputy];
    const inspectionScope = finalReport?.organizations
      ?.find((item: any) => item.key === deputy)
      ?.season?.find((sItem: any) => sItem?.season === row?.seasonId)?.force;
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
                  ?.forceOrganizations?.map((unit: any, unitKey: number) => (
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
        },
      },
      {
        headerAlign: 'center',
        field: DeputiesEnum.amad_poshtibani,
        headerName: Deputies.amad_poshtibani,
        cellClassName: () => 'lowPaddingCell',
        flex: 2,
        sortable: false,
        renderCell: ({ row }: { row: any }) =>
          myRenderCell({ row, deputy: DeputiesEnum.amad_poshtibani }),
      },
      {
        cellClassName: () => 'lowPaddingCell',
        headerClassName: () => 'myh',
        field: DeputiesEnum.amaliyat,
        headerName: Deputies.amaliyat,
        flex: 2,
        renderCell: ({ row }: { row: any }) =>
          myRenderCell({ row, deputy: DeputiesEnum.amaliyat }),
      },
      {
        cellClassName: () => 'lowPaddingCell',
        headerClassName: () => 'myh',

        field: DeputiesEnum.atf,
        headerName: 'عطف',
        flex: 2,
        renderCell: ({ row }: { row: any }) =>
          myRenderCell({ row, deputy: DeputiesEnum.atf }),
      },
      {
        cellClassName: () => 'lowPaddingCell',
        headerClassName: () => 'myh',

        field: DeputiesEnum.fava,
        headerName: Deputies.fava,
        flex: 2,
        renderCell: ({ row }: { row: any }) =>
          myRenderCell({ row, deputy: DeputiesEnum.fava }),
      },
      {
        cellClassName: () => 'lowPaddingCell',
        headerClassName: () => 'myh',

        field: DeputiesEnum.mohandesi,
        headerName: Deputies.mohandesi,
        flex: 2,
        renderCell: ({ row }: { row: any }) =>
          myRenderCell({ row, deputy: DeputiesEnum.mohandesi }),
      },
      {
        cellClassName: () => 'lowPaddingCell',
        headerClassName: () => 'myh',
        field: DeputiesEnum.sahadam,
        headerName: 'ساحادم',
        flex: 2,
        renderCell: ({ row }: { row: any }) =>
          myRenderCell({ row, deputy: DeputiesEnum.sahadam }),
      },
      {
        cellClassName: () => 'lowPaddingCell',
        headerClassName: () => 'myh',
        field: DeputiesEnum.tarbiat_amozesh,
        headerName: Deputies.tarbiat_amozesh,
        flex: 2,
        renderCell: ({ row }: { row: any }) =>
          myRenderCell({ row, deputy: DeputiesEnum.tarbiat_amozesh }),
      },
      {
        cellClassName: () => 'lowPaddingCell',
        headerClassName: () => 'myh',
        field: DeputiesEnum.tarh_barnameh,
        headerName: Deputies.tarh_barnameh,
        flex: 2,
        headerAlign: 'center',
        renderCell: ({ row }: { row: any }) =>
          myRenderCell({ row, deputy: DeputiesEnum.tarh_barnameh }),
      },
    ],
    [finalReport]
  );

  return (
    <Box
      sx={{ padding: 0, paddingTop: 4, borderRadius: 1, mb: 2, width: '100%' }}
    >
      <Grid container>
        <Grid
          size={{ md: 12 }}
          m={2}
          display={'flex'}
          justifyContent={'space-between'}
        >
          <Box display="flex" mb={1}>
            <Book />
            <Typography variant="h6" component={'h3'}>
              گزارشات نظارت تخصصی معاونت‌های سال {selectedYear}
            </Typography>
          </Box>
          <BackButton
            onBack={() => navigate(-1)}
            minWidth={150}
            text="بازگشت"
            color="primary"
          />
        </Grid>
        <Grid size={{ md: 12 }} p={2} pt={0}>
          <MatnaDataGrid
            rows={rows}
            columns={columns}
            loading={false}
            getRowHeight={() => 'auto'}
            sx={{
              borderColor: '#023e8a',
              borderWidth: '2px',
              fontSize: 'smaller',
              width: '100%',
            }}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                csvOptions: { disableToolbarButton: true },
              },
            }}
            disableDensitySelector
            disableColumnSelector
            disableRowSelectionOnClick
          />
        </Grid>
      </Grid>
    </Box>
  );
}
