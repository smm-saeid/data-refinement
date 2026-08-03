import {
  Box,
  Chip,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import DisabledTextInput from '@/components/form/DisabledTextInput';
import { useQuery } from '@tanstack/react-query';
import { useLegacyApi } from 'hooks/useLegacyApi.ts';
import { useParams } from 'react-router';
import type { InspectionReviewResponse } from 'modules/inspection-operation/head-inspector/types.ts';

const GradeChip = ({ grade }: { grade: number }) => {
  if (grade >= 90) return <Chip label="عالی" color="success" size="small" />;
  if (grade >= 80)
    return <Chip label="خیلی خوب" color="success" size="small" />;
  if (grade >= 75) return <Chip label="خوب" color="info" size="small" />;
  if (grade >= 65)
    return <Chip label="قابل قبول" color="warning" size="small" />;
  if (grade >= 0)
    return <Chip label="غیر قابل قبول" color="error" size="small" />;
  return <Chip label="نامعتبر" size="small" />;
};

const StatusChip = ({ grade }: { grade: number }) => {
  if (grade > 90) return <Chip label="حسن" color="success" size="small" />;
  if (grade > 75) return <Chip label="انجام وظیفه" color="info" size="small" />;
  if (grade > 0) return <Chip label="عیب/نقص" color="error" size="small" />;
  return <Chip label="نامعتبر" size="small" />;
};

const ReviewSummary = () => {
  const { id } = useParams();
  const legacyApi = useLegacyApi();

  const { data, isLoading } = useQuery({
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

  const { data: inspectionData } = useQuery({
    queryKey: [`/inspection/id/${id}`],
    queryFn: () =>
      legacyApi.get(`/inspection/id/${id}`).then((res: any) => res.data),
    enabled: !!id,
  });

  if (isLoading) return <Box p={3}>در حال بارگذاری اطلاعات...</Box>;

  return (
    <Box sx={{ margin: '20px' }}>
      <Grid container spacing={2}>
        {data?.finalReviewReports?.map((item, index) => (
          <Grid
            container
            size={{ xs: 12 }}
            spacing={1}
            marginTop={index !== 0 ? '50px' : '0px'}
            key={index}
          >
            <Paper elevation={3} sx={{ width: '100%', padding: '20px' }}>
              <Typography
                variant="h6"
                textAlign={'center'}
                marginBottom={'10px'}
                fontWeight="bold"
              >
                بازبینه {item?.personSpecialityReviewGroupDto?.reviewGroupName}
              </Typography>

              <Grid container spacing={2} mb={3}>
                <Grid size={{ xs: 12, md: 6 }} container spacing={1}>
                  <Grid size={{ xs: 12 }} fontWeight="bold">
                    مشخصات بازرس:
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <DisabledTextInput
                      label={'رسته/درجه'}
                      value={
                        item?.personSpecialityReviewGroupDto?.inspectorDegree
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <DisabledTextInput
                      label={'نام و نام خانوادگی'}
                      value={`${item?.personSpecialityReviewGroupDto?.inspectorName} ${item?.personSpecialityReviewGroupDto?.inspectorFamily}`}
                    />
                  </Grid>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }} container spacing={1}>
                  <Grid size={{ xs: 12 }} fontWeight="bold">
                    مشخصات بازرسی شونده:
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <DisabledTextInput
                      label={'درجه'}
                      value={
                        item?.personSpecialityReviewGroupDto
                          ?.inspectedFirstDegree
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <DisabledTextInput
                      label={'نام و نام خانوادگی'}
                      value={`${item?.personSpecialityReviewGroupDto?.inspectedFirstName} ${item?.personSpecialityReviewGroupDto?.inspectedFirstFamily}`}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <TableContainer component={Paper} sx={{ mb: 3 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                      <TableCell align="center">ردیف</TableCell>
                      <TableCell align="center" width="50%">
                        پرسش
                      </TableCell>
                      <TableCell align="center">ضریب</TableCell>
                      <TableCell align="center">میزان عملکرد</TableCell>
                      <TableCell align="center">نتیجه</TableCell>
                      <TableCell align="center">اثر بخشی</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {item?.reviews?.map((review, i) => (
                      <TableRow key={review.id}>
                        <TableCell align="center">{i + 1}</TableCell>
                        <TableCell align="right">{review.question}</TableCell>
                        <TableCell align="center">{review.factor}</TableCell>
                        <TableCell align="center">{review.grade}</TableCell>
                        <TableCell align="center">
                          <StatusChip grade={review.grade} />
                        </TableCell>
                        <TableCell align="center">
                          {review.effectiveness}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow sx={{ bgcolor: '#e3f2fd' }}>
                      <TableCell
                        colSpan={2}
                        align="center"
                        sx={{ fontWeight: 'bold' }}
                      >
                        میانگین / جمع
                      </TableCell>
                      <TableCell align="center">
                        {item.reviews.reduce(
                          (acc, curr) => acc + curr.factor,
                          0
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {item.avgGrade?.toFixed(2)}
                      </TableCell>
                      <TableCell align="center">
                        <StatusChip grade={item.avgGrade} />
                      </TableCell>
                      <TableCell align="center">
                        {item.avgEffectiveness?.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Typography
                textAlign={'center'}
                variant="h6"
                marginBottom={'10px'}
              >
                نکات مشهوده (محاسن، معایب، نواقص)
              </Typography>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                      <TableCell align="center" width="15%">
                        عنوان
                      </TableCell>
                      <TableCell align="center" width="10%">
                        شناسه
                      </TableCell>
                      <TableCell align="center">شرح</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[
                      ...item.advantages.map((x, i) => ({
                        ...x,
                        label: 'محاسن',
                        color: 'success',
                        code: 'H',
                        idx: i + 1,
                      })),
                      ...item.deficiencies
                        .filter(x => x.type === 'نقص')
                        .map((x, i) => ({
                          ...x,
                          label: 'نواقص',
                          color: 'warning',
                          code: 'D',
                          idx: i + 1,
                        })),
                      ...item.deficiencies
                        .filter(x => x.type === 'عیب')
                        .map((x, i) => ({
                          ...x,
                          label: 'عیوب',
                          color: 'error',
                          code: 'F',
                          idx: i + 1,
                        })),
                    ].map((row, index) => (
                      <TableRow key={index}>
                        <TableCell align="center">
                          <Chip
                            label={row.label}
                            color={row.color as any}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="center" dir="ltr">
                          {inspectionData?.organizationUnitCode}
                          {row.code}
                          {row.idx}
                        </TableCell>
                        <TableCell align="right">
                          <Typography
                            variant="body2"
                            color={
                              row.color === 'error' ? 'error' : 'textPrimary'
                            }
                          >
                            {row.description}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        ))}

        <Grid size={{ xs: 12 }} marginTop={4}>
          <Paper sx={{ p: 2, overflowX: 'auto' }}>
            <Typography variant="h6" textAlign="center" gutterBottom>
              جدول خلاصه عملکرد محورها
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#eeeeee' }}>
                    <TableCell align="center">ردیف</TableCell>
                    <TableCell align="center">محور</TableCell>
                    <TableCell align="center">تعداد بازبینه</TableCell>
                    <TableCell align="center">فعالیت</TableCell>
                    <TableCell align="center">حسن</TableCell>
                    <TableCell align="center">عیب</TableCell>
                    <TableCell align="center">انجام وظیفه</TableCell>
                    <TableCell align="center">نمره کل</TableCell>
                    <TableCell align="center">اثربخشی</TableCell>
                    <TableCell align="center">نمره بهره‌وری</TableCell>
                    <TableCell align="center">کیفیت</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.finalReport?.reports?.map((report, index) => (
                    <TableRow key={index}>
                      <TableCell align="center">{index + 1}</TableCell>
                      <TableCell align="center">{report.name}</TableCell>
                      <TableCell align="center">{report.count}</TableCell>
                      <TableCell align="center">{report.activities}</TableCell>
                      <TableCell align="center">
                        {report.advantage_count}
                      </TableCell>
                      <TableCell align="center">
                        {report.deficiency_count}
                      </TableCell>
                      <TableCell align="center">
                        {report.moderate_count}
                      </TableCell>
                      <TableCell align="center">
                        {report.total_grade.toFixed(2)}
                      </TableCell>
                      <TableCell align="center">
                        {report.total_effectiveness.toFixed(2)}
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                        {report.effective_grade.toFixed(2)}
                      </TableCell>
                      <TableCell align="center">
                        <GradeChip grade={report.effective_grade} />
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow sx={{ bgcolor: '#e0f7fa' }}>
                    <TableCell colSpan={2} align="center">
                      <b>معدل کل</b>
                    </TableCell>
                    <TableCell align="center">
                      {data?.finalReport?.reports?.reduce(
                        (a, b) => a + b.count,
                        0
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {data?.finalReport?.reports?.reduce(
                        (a, b) => a + b.activities,
                        0
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {data?.finalReport?.reports?.reduce(
                        (a, b) => a + b.advantage_count,
                        0
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {data?.finalReport?.reports?.reduce(
                        (a, b) => a + b.deficiency_count,
                        0
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {data?.finalReport?.reports?.reduce(
                        (a, b) => a + b.moderate_count,
                        0
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {data?.finalReport?.avg_grade.toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      {data?.finalReport?.avg_productivity.toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      <b>{data?.finalReport?.avg_effective_grade.toFixed(2)}</b>
                    </TableCell>
                    <TableCell align="center">
                      <GradeChip
                        grade={data?.finalReport?.avg_effective_grade || 0}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <TableContainer sx={{ mt: 4 }}>
              <Table size="small" bordered>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#eee' }}>
                    <TableCell align="center">آمار سازمانی</TableCell>
                    <TableCell align="center">تیراندازی</TableCell>
                    <TableCell align="center">دانش نظامی</TableCell>
                    <TableCell align="center">تاثیر آمار</TableCell>
                    <TableCell align="center">تاثیر تیراندازی</TableCell>
                    <TableCell align="center">تاثیر دانش</TableCell>
                    <TableCell align="center">نمره نهایی</TableCell>
                    <TableCell align="center">نتیجه کیفی</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell align="center">
                      {data?.finalReport?.stats?.toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      {data?.finalReport?.shootingGrade?.toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      {data?.finalReport?.militaryKnowledgeGrade?.toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      {data?.finalReport?.effectiveStats?.toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      {data?.finalReport?.effectiveShooting?.toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      {data?.finalReport?.effectiveMilitaryKnowledge?.toFixed(
                        2
                      )}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}
                    >
                      {data?.finalReport?.finalGradeAfterEffect?.toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      <GradeChip
                        grade={data?.finalReport?.finalGradeAfterEffect || 0}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReviewSummary;
