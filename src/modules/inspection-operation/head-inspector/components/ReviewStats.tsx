// import { Box, Grid, Paper, Typography } from '@mui/material';
// import { BarChart } from '@mui/x-charts/BarChart';
// import {PieChart, blueberryTwilightPalette, cheerfulFiestaPalette, mangoFusionPalette} from '@mui/x-charts';
// import { ResponsiveContainer } from 'recharts';
// import { useQuery } from '@tanstack/react-query';
// import { useParams } from 'react-router';
// import { useLegacyApi } from 'hooks/useLegacyApi.ts';
// import type { InspectionReviewResponse } from 'modules/inspection-operation/head-inspector/types.ts';
//
// const ReviewStats = () => {
//   const { id } = useParams();
//   const legacyApi = useLegacyApi();
//
//   const { data, isLoading } = useQuery({
//     queryKey: ['inspection-reviews', id],
//     queryFn: async () => {
//       const res = await legacyApi.get(
//         `/review-customize/find-all-reviews?inspectionId=${id}`
//       );
//       return res.data as InspectionReviewResponse;
//     },
//     enabled: !!id,
//     staleTime: 1000 * 60 * 5,
//     refetchOnWindowFocus: false,
//   });
//
//   const color_array = [
//     blueberryTwilightPalette,
//     mangoFusionPalette,
//     cheerfulFiestaPalette,
//   ];
//
//   if (isLoading) return <Box p={3}>در حال دریافت اطلاعات آماری...</Box>;
//   if (!data) return null;
//
//   const pieData = [
//     {
//       id: 0,
//       value: data.finalReviewReports?.reduce(
//         (acc, curr) => acc + curr.advantageNumber,
//         0
//       ),
//       label: 'محاسن',
//     },
//     {
//       id: 1,
//       value: data.finalReviewReports?.reduce(
//         (acc, curr) => acc + curr.deficiencyNumber,
//         0
//       ),
//       label: 'معایب/نواقص',
//     },
//     {
//       id: 2,
//       value: data.finalReviewReports?.reduce(
//         (acc, curr) => acc + curr.moderateNumber,
//         0
//       ),
//       label: 'انجام وظیفه',
//     },
//   ];
//
//   return (
//     <Box sx={{ margin: '20px' }}>
//       <Grid container spacing={3}>
//         <Grid size={{ xs: 12 }}>
//           <Paper sx={{ p: 2 }}>
//             <Typography variant="h6" mb={2} textAlign="center">
//               نمودار نمرات هر محور
//             </Typography>
//             <ResponsiveContainer width="100%" height={400}>
//               <BarChart
//                 dataset={data.finalReport?.reports}
//                 xAxis={[{ scaleType: 'band', dataKey: 'name' }]}
//                 series={[
//                   {
//                     dataKey: 'total_grade',
//                     label: 'نمره خام',
//                     valueFormatter: v => v?.toFixed(2),
//                   },
//                 ]}
//                 colors={color_array[1]('dark').slice(2)}
//                 height={350}
//               />
//             </ResponsiveContainer>
//           </Paper>
//         </Grid>
//         <Grid size={{ xs: 12 }}>
//           <Paper sx={{ p: 2 }}>
//             <Typography variant="h6" mb={2} textAlign="center">
//               توزیع عملکرد (محاسن، معایب، انجام وظیفه)
//             </Typography>
//             <PieChart
//               series={[
//                 {
//                   data: pieData,
//                   innerRadius: 30,
//                   paddingAngle: 5,
//                   cornerRadius: 5,
//                   highlightScope: { faded: 'global', highlighted: 'item' },
//                 },
//               ]}
//               colors={['#4caf50', '#f44336', '#2196f3']}
//               height={350}
//             />
//           </Paper>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };
//
export  default {};
