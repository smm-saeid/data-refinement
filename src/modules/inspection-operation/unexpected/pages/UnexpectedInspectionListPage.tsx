import { Box, Button, Chip, Grid, TextField, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import PaginatedMatnaDataGrid from '@/components/data-grid/PaginatedMatnaDataGrid.tsx';

const SEASON_LABELS: Record<string, string> = {
  FIRST_SEASON: 'سه ماهه اول',
  SECOUND_SEASON: 'سه ماهه دوم',
  THIRD_SEASON: 'سه ماهه سوم',
  FOURTH_SEASON: 'سه ماهه چهارم',
};

const getSeasonLabel = (season: string) =>
  SEASON_LABELS[season] || SEASON_LABELS[season?.toUpperCase()] || season || '';

const VerificationInspectionListPage = () => {
  const navigate = useNavigate();

  const [year, setYear] = useState<number>(1404);

  const columns_text = useMemo(
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
        headerName: 'ماهیت',
        field: 'orgType',
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
            <Button
              variant="contained"
              color="info"
              onClick={() =>
                navigate(
                  '/operation/unexpected-inspection/start-configuration/' +
                    row.id
                )
              }
            >
              مشاهده
            </Button>
          );
        },
      },
    ],
    []
  );

  const handleYearChange = event => {
    if (/^\d{0,4}/.test(event.target.value)) {
      setYear(event.target.value);
    }
  };

  const isYearInvalid =
    year && (!/^\d{4}$/.test(String(year)) || Number(year) <= 1350);

  return (
    <Box>
      <Box sx={{ margin: '20px' }}>
        <Grid container spacing={2}>
          <Grid
            size={{ xs: 10 }}
            sx={{ display: 'flex', justifyContent: 'flex-start' }}
          >
            <Typography fontWeight={700} variant="h5">
              بازرسی غیرمترقبه سال {year}
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
            url={'/inspection/program/inspection-by-filter'}
            params={{ year: year }}
            columns={columns_text}
            numberOfRowsInPage={10}
          />
        )}
      </Box>
    </Box>
  );
};

export default VerificationInspectionListPage;
