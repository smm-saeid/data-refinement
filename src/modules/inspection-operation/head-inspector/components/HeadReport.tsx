import { Box, Grid, Skeleton, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { useMemo, useState } from 'react';
import { useLegacyApi } from 'hooks/useLegacyApi.ts';
import { generateHeadReportHtml } from './ReportGenerator';
import MatnaEditor from 'components/MatnaEditor';
import type { InspectionReviewResponse } from 'modules/inspection-operation/head-inspector/types.ts';

export default function HeadReport() {
  const { id } = useParams();
  const legacyApi = useLegacyApi();
  const [editorData, setEditorData] = useState('');

  const { data: reviewsData, isLoading: isReviewsLoading } = useQuery({
    queryKey: ['inspection-reviews', id],
    queryFn: async () => {
      const res = await legacyApi.get(
        `/review-customize/find-all-reviews?inspectionId=${id}`
      );
      return res.data as InspectionReviewResponse;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const { data: inspectionData, isLoading: isInspectionLoading } = useQuery({
    queryKey: [`/inspection/id/${id}`],
    queryFn: () =>
      legacyApi.get(`/inspection/id/${id}`).then((res: any) => res.data),
    enabled: !!id,
  });

  const { data: infoData, isLoading: isInfoLoading } = useQuery({
    queryKey: [`/information/inspection-id/${id}`],
    queryFn: () =>
      legacyApi
        .get(`/information/inspection-id/${id}`)
        .then((res: any) => res.data),
    enabled: !!id,
  });

  const { data: experts, isLoading: isExpertsLoading } = useQuery({
    queryKey: [`/person-speciality/inspection/${id}`],
    queryFn: () =>
      legacyApi
        .get(
          `/person-speciality/find-by-inspection?pageSize=1000&currentPage=1&inspectionId=${id}`
        )
        .then((res: any) => res?.data?.rows),
    enabled: !!id,
  });

  const { data: encouragement, isLoading: isEncouragementLoading } = useQuery({
    queryKey: [`/encouragement/${id}`],
    queryFn: () =>
      legacyApi
        .get(`/encouragement/find-by-inspection?inspectionId=${id}`)
        .then((res: any) => res?.data),
    enabled: !!id,
  });

  const isLoading =
    isReviewsLoading ||
    isInspectionLoading ||
    isInfoLoading ||
    isExpertsLoading ||
    isEncouragementLoading;

  const initialHtml = useMemo(
    () =>
      !isLoading && inspectionData && reviewsData
        ? generateHeadReportHtml(
            inspectionData,
            reviewsData,
            experts,
            encouragement,
            infoData
          )
        : '',
    [inspectionData, reviewsData, experts, encouragement, infoData, isLoading]
  );

  return (
    <Box sx={{ margin: '20px' }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          {isLoading || !initialHtml ? (
            <Box
              sx={{
                width: '100%',
                height: '500px',
                bgcolor: 'white',
                p: 2,
                borderRadius: 2,
              }}
            >
              <Typography variant="body1" gutterBottom>
                در حال تولید گزارش...
              </Typography>
              <Skeleton
                variant="rectangular"
                width="100%"
                height={60}
                sx={{ mb: 1 }}
              />
              <Skeleton variant="text" width="60%" sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" width="100%" height={300} />
            </Box>
          ) : (
            <MatnaEditor
              key="loaded-editor"
              initialData={initialHtml}
              onChange={(_, editor) => {
                setEditorData(editor.getData());
              }}
            />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
