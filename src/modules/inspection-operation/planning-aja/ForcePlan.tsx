import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  MenuItem,
  Select,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { MatnaDataGrid } from '@/components/data-grid/MatnaDataGrid';
import type { GridColDef } from '@mui/x-data-grid';
import { useNavigate, useParams } from 'react-router';
import BackButton from '@/components/button/BackButton';
import { ImportContacts } from '@mui/icons-material';
import { useApiQuery } from '@/hooks/useApi';
import InspectionApis from '@/modules/inspection-operation/api';
import type { AnnualPlanning, FinalReportData } from '../types';

export type SeasonData = {
  id: number;
  season: string;
  seasonId: number;
  label: string;
};

export default function ForcePlan() {
  const navigate = useNavigate();
  const { id } = useParams();

  /* ---------------- Fetch Plan Meta Data ---------------- */
  const { data: planData } = useApiQuery<
    AnnualPlanning,
    any,
    any,
    AnnualPlanning
  >({
    url: InspectionApis.annualPlanning.find(id),
    select: (response): AnnualPlanning =>
      response?.data ?? ({} as AnnualPlanning),
  });

  /* ---------------- Fetch Final Report Data ---------------- */
  const year = planData?.year;
  const {
    data: finalReport,
    refetch,
    status,
  } = useApiQuery<FinalReportData, any, any, FinalReportData>({
    url: year ? InspectionApis.annualPlanning.finalReport(year) : null,
    select: res => res.data,
    enabled: !!year,
  });

  /* ---------------- Extract list of forces dynamically ---------------- */
  const forceList = useMemo(() => {
    if (!finalReport) return [];

    const set = new Set<string>();

    finalReport?.inspectionType.forEach(type => {
      type?.season.forEach(season => {
        season?.organizations.forEach(org => {
          set.add(org.forceName);
        });
      });
    });

    return [...set];
  }, [finalReport]);

  /* ---------------- User-selected force ---------------- */
  const [selectedForce, setSelectedForce] = useState<string>('');

  useEffect(() => {
    if (forceList.length > 0 && !selectedForce) {
      setSelectedForce(forceList[0]); // default to first available force
    }
  }, [forceList]);

  /* ---------------- Build Season Rows ---------------- */
  {
    /*
  const rows = useMemo(() => {
    if (!finalReport) return [];

    const allSeasons = new Set<string>();

    finalReport?.inspectionType.forEach(type => {
      type?.season.forEach(s => allSeasons.add(s.season));
    });

    return [...allSeasons].map((s, idx) => ({
      id: idx + 1,
      season: s,
    }));
  }, [finalReport]);
  */
  }

  const rows = useMemo(
    (): SeasonData[] => [
      { id: 1, season: 'first_season', seasonId: 1, label: 'بهار' },
      { id: 2, season: 'secound_season', seasonId: 2, label: 'تابستان' },
      { id: 3, season: 'third_season', seasonId: 3, label: 'پاییز' },
      { id: 4, season: 'forth_season', seasonId: 4, label: 'زمستان' },
    ],
    []
  );

  /* ---------------- Build Dynamic Columns ---------------- */
  const columns: GridColDef[] = [
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
            <Typography variant="subtitle1" component="div" fontWeight={'bold'}>
              {row.label}
            </Typography>
          </Box>
        );
      },
    },

    ...(Array.isArray(finalReport?.inspectionType)
      ? (finalReport?.inspectionType?.map(type => ({
          field: type.key,
          headerName: type.name,
          headerAlign: 'center',
          align: 'center',
          sortable: false,
          flex: 1.5,
          renderCell: ({ row }: any) => {
            const seasonBlock = type.season.find(s => s.season === row.season);
            if (!seasonBlock) return null;

            const orgs = seasonBlock.organizations.filter(
              org => org.forceName === selectedForce
            );
            const units = orgs.flatMap(org => org.units);
            if (!units.length) return null;

            return (
              <Card sx={{ width: '100%' }}>
                <CardContent sx={{ padding: '5px', fontSize: '12px' }}>
                  {units?.map((u, index) => {
                    if (!u || !u.organizationName) return null; // completely safe
                    return (
                      <div key={u.organizationId ?? index}>
                        {u.organizationName}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            );
          },
        })) as GridColDef[])
      : []),
  ];

  return (
    <Box sx={{ paddingTop: 4, width: '100%' }}>
      <Grid container justifyContent={'center'}>
        <Grid
          size={{ md: 11 }}
          display={'flex'}
          justifyContent={'space-between'}
          padding={2}
          alignItems="center"
        >
          <Box display={'flex'} alignItems="center">
            <ImportContacts />
            <Typography ml={1} variant="subtitle1">
              گزارش طرح‌ریزی صورت گرفته توسط نیرو سال {year}
            </Typography>
          </Box>

          <BackButton
            text="بازگشت"
            color="primary"
            minWidth={150}
            onBack={() => navigate(`/operation/planning/aja`)}
          />
        </Grid>

        {/* -------------------- Force Selector -------------------- */}
        {forceList.length > 0 && (
          <Grid size={{ md: 11 }} mb={2}>
            <Typography fontWeight="bold" mb={1}>
              انتخاب نیرو:
            </Typography>
            <Select
              value={selectedForce}
              onChange={e => setSelectedForce(e.target.value)}
              sx={{ minWidth: 250, background: 'white' }}
            >
              {forceList.map(force => (
                <MenuItem key={force} value={force}>
                  {force}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        )}

        {/* -------------------- Data Grid -------------------- */}
        <Grid size={{ md: 11 }}>
          <MatnaDataGrid
            rows={rows}
            columns={columns}
            rowCount={rows.length}
            loading={!finalReport}
            hideFooter
            getRowHeight={() => 'auto'}
            sx={{
              borderColor: '#023e8a',
              borderWidth: 2,
              fontSize: 'smaller',
              width: '100%',
            }}
            disableDensitySelector
            disableColumnSelector
            disableRowSelectionOnClick
            disableColumnFilter
          />
        </Grid>
      </Grid>
    </Box>
  );
}
