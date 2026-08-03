import {
  Grid,
  Box,
  Container,
  Typography,
  Alert,
  Skeleton,
} from '@mui/material';
import { useApiQuery } from '@/hooks/useApi';
import type { PlanningTarget } from './types.ts';
import TargetProgramsCard from './components/TargetProgramsCard';
import InspectionOperationApis from '@/modules/inspection-operation/api.ts';
import { useState } from 'react';
import {
  PAGINATION_DEFAULT_VALUE,
  type PaginationQueryParam,
} from 'types/api.ts';

type TargetsQueryParams = {
  name?: string;
  developmentProgramId?: string;
  axisId?: string;
  departmentCode?: string;
};

export default function OperationPlanningDashboard() {
  const [filters, setFilters] = useState<
    PaginationQueryParam<TargetsQueryParams>
  >({
    ...PAGINATION_DEFAULT_VALUE,
  });

  const apiParams = {
    ...filters,
    'department-code': 'OPERATION',
  };

  const { data, isLoading, error, refetch } = useApiQuery<PlanningTarget[]>({
    url: InspectionOperationApis.planning.targets,
    params: apiParams,
  });

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert
          severity="error"
          action={
            <Box component="button" onClick={() => refetch()}>
              تلاش مجدد
            </Box>
          }
        >
          خطا در دریافت اهداف
        </Alert>
      </Container>
    );
  }

  const targets = data?.data ?? [];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" fontWeight={700}>
          داشبورد عملیات بازرسی
        </Typography>
        <Typography variant="body2" color="text.secondary">
          مشاهده اهداف، برنامه‌ها و فعالیت‌ها
        </Typography>
      </Box>
      {isLoading ? (
        <Grid container spacing={3}>
          {Array.from({ length: 3 }).map((_, idx) => (
            <Grid size={{ xs: 12 }} key={idx}>
              <Skeleton variant="rounded" height={180} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={3}>
          {targets.map(target => (
            <Grid size={{ xs: 12 }} key={target.id}>
              <TargetProgramsCard target={target} />
            </Grid>
          ))}
          {!targets.length && (
            <Grid size={{ xs: 12 }}>
              <Alert severity="info">
                برای این دپارتمان هدفی ثبت نشده است.
              </Alert>
            </Grid>
          )}
        </Grid>
      )}
    </Container>
  );
}
