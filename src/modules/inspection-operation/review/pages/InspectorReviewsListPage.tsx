import { Box, Button, Chip, Grid, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import PaginatedMatnaDataGrid from '@/components/data-grid/PaginatedMatnaDataGrid.tsx';

const SEASON_LABELS: Record<string, string> = {
  ONE_SEASON: 'سه ماهه اول',
  TWO_SEASON: 'سه ماهه دوم',
  THREE_SEASON: 'سه ماهه سوم',
  FOUR_SEASON: 'سه ماهه چهارم',
};

const getSeasonLabel = (season: string) =>
  SEASON_LABELS[season] || SEASON_LABELS[season?.toUpperCase()] || season || '';

const InspectorReviewsListPage = () => {
  let navigate = useNavigate();

  const columns_text = useMemo(
    () => [
      {
        headerName: 'نام بازبینه',
        field: 'reviewGroupName',
        flex: 2,
      },
      {
        headerName: 'نام یگان',
        field: 'organizationName',
        flex: 1,
      },
      {
        headerName: 'عملیات',
        field: 'action',
        flex: 1,
        align: 'center',
        headerAlign: 'center',
        renderCell: ({ row }: { row: any }) => {
          return (
            <Button
              variant="contained"
              color= {(row.status == null || row.status == "GRADING") ? "info" : row.status == "ADVANTAGE_DEFICIENCY" ? "success" : "warning"}
              onClick={() => {
                  if (row.status == null || row.status == "GRADING") {
                    navigate(`fill-review/${row.inspectionId}/${row.reviewGroupId}`)
                  }
                  else if (row.status == "ADVANTAGE_DEFICIENCY") {
                    navigate(`tables/${row.inspectionId}/${row.reviewGroupId}`)
                  }
                  else if (row.status == "DONE") {
                    navigate(`report/${row.inspectionId}/${row.reviewGroupId}`)
                  }
                }
              }
            >
             { (row.status == null || row.status == "GRADING") ? "نمره دهی" : row.status == "ADVANTAGE_DEFICIENCY" ? "ثبت نتیجه" : "مشاهده گزارش"} 
            </Button>
          );
        },
      },
    ],
    []
  );

  return (
    <Box>
      <Box sx={{ margin: '20px' }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 4 }}>
            <Typography fontWeight={700} variant="h5">
              لیست بازبینه های بازرس
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ width: '100%' }}>
        <PaginatedMatnaDataGrid
          url={'person-speciality-review-group/all-review-groups'}
          params={{}}
          columns={columns_text}
          numberOfRowsInPage={10}
        />
      </Box>
    </Box>
  );
};

export default InspectorReviewsListPage;