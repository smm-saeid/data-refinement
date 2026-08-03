import {
  Box,
  Chip,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import PaginatedMatnaDataGrid from 'components/data-grid/PaginatedMatnaDataGrid.tsx';
import InspectionApis from 'modules/inspection-operation/api.ts';
import { useMemo, useState } from 'react';
import { SeasonLabels } from 'modules/inspection-operation/planning-aja/types.ts';
import { NavLink } from 'react-router';
import { GpsNotFixed, Grading, School, Summarize } from '@mui/icons-material';

export default function InspectionsList() {

  const [year, setYear] = useState<number>(1404);

  const isYearInvalid =
    year && (!/^\d{4}$/.test(String(year)) || Number(year) <= 1350);

  const handleYearChange = event => {
    if (/^\d{0,4}/.test(event.target.value)) {
      setYear(event.target.value);
    }
  };

  const getSeasonLabel = (season: string) =>
    SeasonLabels[season] || SeasonLabels[season] || season || '';

  const columns = useMemo(
    () => [
      {
        headerName: 'یگان',
        field: 'organizationUnitName',
        flex: 1,
      },
      {
        headerName: 'سه‌ماهه',
        field: 'season',
        flex: 1,
        renderCell: params => getSeasonLabel(params.row.season),
      },
      {
        headerName: 'نیرو',
        field: 'forceOrganizationUnitName',
        flex: 0.5,
      },
      {
        headerName: 'نوع بازرسی',
        field: 'annualPlanInspectionName',
        flex: 1,
      },
      {
        headerName: 'وضعیت',
        field: 'status',
        flex: 1,
        renderCell: ({ row }: { row: any }) => {
          switch (row.status) {
            case 'not executed':
              return <Chip label="پیکربندی" sx={{ bgcolor: 'skyblue' }} />;
            case 'initialized':
              return <Chip label="در انتظار اجرا" color="info" />;
            case 'on the execution':
              return <Chip label="در حال اجرا" sx={{ bgcolor: 'salmon' }} />;
            case 'executed':
              return <Chip label="پایان یافته" />;
          }
        },
      },
      {
        headerName: 'عملیات',
        field: 'action',
        flex: 1,
        renderCell: ({ row }: { row: any }) => {
          return (
            <Box>
              <Tooltip title="نمرات تیراندازی">
                <NavLink to={`/operation/head-inspector/inspections/${row.id}/shooting-scores`}>
                  <IconButton
                    color="info"
                  >
                    <GpsNotFixed />
                  </IconButton>
                </NavLink>
              </Tooltip>
              <Tooltip title="آمار سازمانی">
                <NavLink to={`/operation/head-inspector/inspections/${row.id}/unit-stats`}>
                  <IconButton
                    color="info"
                  >
                    <Grading />
                  </IconButton>
                </NavLink>
              </Tooltip>
              <Tooltip title="نمرات دانش نظامی">
                <NavLink to={`/operation/head-inspector/inspections/${row.id}/military-knowledge-scores`}>
                  <IconButton
                    color="info"
                  >
                    <School />
                  </IconButton>
                </NavLink>
              </Tooltip>
              <Tooltip title="گزارش نهایی">
                <NavLink to={`/operation/head-inspector/inspections/${row.id}/final-report`}>
                  <IconButton
                    color="info"
                  >
                    <Summarize />
                  </IconButton>
                </NavLink>
              </Tooltip>
            </Box>
          );
        },
      },
    ],
    []
  );

  return <>
    <Box>
      <Box sx={{ margin: '20px' }}>
        <Grid container spacing={2}>
          <Grid
            size={{ xs: 10 }}
            sx={{ display: 'flex', justifyContent: 'flex-start' }}
          >
            <Typography fontWeight={700} variant="h5">
              بازرسی های سال {year}
            </Typography>
          </Grid>
          <Grid
            size={{ xs: 2 }}
            sx={{ display: 'flex', justifyContent: 'flex-end' }}
          >
            <TextField
              label="سال شمسی"
              variant="outlined"
              value={year}
              onChange={handleYearChange}
              inputProps={{
                maxLength: 4,
              }}
              error={Boolean(isYearInvalid)}
              helperText={
                isYearInvalid
                  ? 'سال باید عددی ۴ رقمی و بزرگتر از ۱۳۵۰ باشد'
                  : ' '
              }
              sx={{ width: '20ch' }}
            />
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ width: '100%' }}>
        {year && /^\d{4}$/.test(String(year)) && year > 1350 && (
          <PaginatedMatnaDataGrid
            url={InspectionApis.headInspector.myInspections}
            params={{ year: year }}
            columns={columns}
            numberOfRowsInPage={10}

          />
        )}
      </Box>
    </Box>
  </>;
}
