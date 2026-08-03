// import {
//   Autocomplete,
//   Box,
//   Button,
//   Card,
//   Dialog,
//   Grid,
//   IconButton,
//   Modal,
//   Paper,
//   Skeleton,
//   Stack,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TextField,
//   Typography,
// } from '@mui/material';
// import { Fragment, useEffect, useMemo, useState } from 'react';
// import { Delete } from '@mui/icons-material';
// import { useMutation, useQuery } from '@tanstack/react-query';

// import { useSnackbar } from '@/hooks/useSnackbar';
// import { useLegacyApi } from '@/hooks/useLegacyApi.ts';
// import { MatnaDataGrid } from '@/components/data-grid/MatnaDataGrid.tsx';
// import ReviewGroupEditor from './ReviewGroupEditor';

// export interface IndicatorInterface {
//   id: string | number;
//   title: string;
//   weight: string | number;
// }

// const ReviewPicker = ({ fieldId, onReviewSelect, inspectorId, inspectionId, onClose, selectedReviewsList }) => {

//   let legacyApi = useLegacyApi();
//   let snackbar = useSnackbar();
//   const [selectedReview, setSelectedReview] = useState(null);

//   const {
//     data: reviewsList,
//     isLoading
//   } = useQuery<any, any, any>({
//     queryKey: [
//       `/review-group-new/find-by-field-id?fieldId=${fieldId}`
//     ],
//     queryFn: () =>
//       legacyApi.get(
//         `/review-group-new/find-by-field-id?fieldId=${fieldId}`
//       ),
//     select: (res: any) => {
//       return res?.data;
//     },
//   } as any);

//   const columns = [
//     { field: 'name', headerName: 'نام', flex: 2 },
//     { field: 'organizationTypeName', headerName: 'ماهیت', flex: 1 },
//     { field: 'organizationUnitForceName', headerName: 'نیرو', flex: 1 },
//     { field: 'orgSpecialityName', headerName: 'تخصص', flex: 1 },
//     {
//       field: 'action',
//       headerName: '',
//       flex: 1,
//       renderCell: ({ row }: any) => {
//         return (
//           <Button
//             color="info"
//             onClick={() => {
//               if (selectedReviewsList.findIndex(r => r.reviewGroupId == row.id) >= 0) {
//                 snackbar("هر بازبینه را فقط میتوان به یک بازرس اختصاص داد.", 'error', 5000);
//                 return;
//               }
//               setSelectedReview(row);
//             }}
//           >
//             انتخاب
//           </Button>
//         );
//       },
//     },
//   ];

//   if (selectedReview) {
//     return <ReviewGroupEditor
//       reviewGroupId={selectedReview.id}
//       reviewGroupName={selectedReview.name}
//       onClose={onClose}
//       onDone={() => onReviewSelect(selectedReview)}
//       inspectorId={inspectorId}
//       inspectionId={inspectionId}
//     />
//   }
//   else {
//     return <MatnaDataGrid loading={isLoading} columns={columns} rows={reviewsList} paginationMode={'client'} />;
//   }
// }

// const StartInspectionStep5 = ({ inspectionInformation, refetchStep }: any) => {
//   const legacyApi = useLegacyApi();
//   const snackbar = useSnackbar();
//   const { mutate } = useMutation({
//     mutationFn: legacyApi.request,
//   });

//   const [selectedExpertToAddReview, setSelectedExpertToAddReview] = useState(null);
//   const [selectedReviewToEdit, setSelectedReviewToEdit] = useState(null);
//   const [expertsList, setExpertsList] = useState([]);

//   const { data: initialExpertsList } = useQuery<any, any, any>({
//     queryKey: [
//       `/person-speciality/find-by-inspection?pageSize=1000&currentPage=1&inspectionId=${inspectionInformation.inspectionId}`,
//     ],
//     queryFn: () =>
//       legacyApi.get(
//         `/person-speciality/find-by-inspection?pageSize=1000&currentPage=1&inspectionId=${inspectionInformation.inspectionId}`
//       ),
//     select: (res: any) => {
//       return res?.data?.rows;
//     },
//   } as any);

//   const {
//     data: initialReviewAssignmentList,
//     refetch: refetchReviewAssignmentLis
//   } = useQuery<any, any, any>({
//     queryKey: [
//       `/person-speciality-review-group/find-by-inspection-id?inspectionId=${inspectionInformation.inspectionId}`,
//     ],
//     queryFn: () =>
//       legacyApi.get(
//         `/person-speciality-review-group/find-by-inspection-id?inspectionId=${inspectionInformation.inspectionId}`
//       ),
//     select: (res: any) => {
//       if (Array.isArray(res?.data)) {
//         return res?.data;
//       }
//       return [];
//     },
//   } as any);

//   useEffect(() => {
//     if (initialExpertsList != null && initialReviewAssignmentList != null) {
//       const newExpertsList = [...initialExpertsList].map(expert => {
//         const id = expert.id;
//         return { ...expert, reviews: initialReviewAssignmentList.filter(r => r.personSpecialityId == id) }
//       });
//       setExpertsList(newExpertsList);
//     }
//   }, [initialReviewAssignmentList, initialExpertsList]);

//   const deleteAssignment = (personSpecialityReviewGroupId, reviewGroupId) => {
//     mutate(
//       {
//         entity: `review-customize/delete-by-inspection-group?inspectionId=${inspectionInformation.inspectionId}&groupId=${reviewGroupId}&personSpecialityReviewGroupId=${personSpecialityReviewGroupId}`,
//         method: 'delete',
//       } as any,
//       {
//         onSuccess: (res: any) => {
//           snackbar('با موفقیت حذف شد.', 'success', 5000);
//           refetchReviewAssignmentLis();
//         },
//         onError: () => {
//           snackbar('خطا در حذف', 'error', 5000);
//         },
//       }
//     );
//   };

//   const selectedReviewsList = () => {
//     let out = [];
//     expertsList.forEach(e => {
//       out = [...out, ...e.reviews];
//     })
//     return out;
//   };

//   const doAllExpertsHaveReview = () => {
//     let result = true;
//     expertsList.forEach(e => {
//       if (e.reviews.length == 0) {
//         result = false;
//       }
//     })
//     return result;
//   }

//   const updateReviewAssignmentList = (reviews) => {
//     mutate(
//       {
//         entity: `/person-speciality-review-group?inspectionId=${inspectionInformation.inspectionId}`,
//         method: 'post',
//         data: reviews.filter(i => i.personSpecialityId != null && i.reviewGroupId != null).map((item: any) => ({
//           ...(typeof item.id === "string" && { id: item.id }),
//           personSpecialityId: item.personSpecialityId,
//           reviewGroupId: item.reviewGroupId,
//         })),
//       } as any,
//       {
//         onSuccess: (_: any) => {
//           refetchReviewAssignmentLis();
//         },
//         onError: () => { },
//       }
//     );
//   }

//   return (
//     <Grid container justifyContent={'center'}>
//       <Grid>
//         <TableContainer component={Paper}>
//           <Table
//             aria-label="simple table"
//             sx={{
//               minWidth: 1000,
//               '& td': {
//                 padding: '10px !important',
//               },
//             }}
//           >
//             <TableHead>
//               <TableRow>
//                 <TableCell width={'10%'}>درجه</TableCell>
//                 <TableCell width={'20%'}>بازرس</TableCell>
//                 <TableCell width={'20%'}>تخصص</TableCell>
//                 <TableCell>بازبینه ها</TableCell>
//                 <TableCell width={'10%'}>عملیات</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {expertsList.length == 0 ? [...Array(10).keys()].map(i => {
//                 return <TableRow key={i}>
//                   <TableCell>
//                     <Skeleton />
//                   </TableCell>
//                   <TableCell>
//                     <Skeleton />
//                   </TableCell>
//                   <TableCell>
//                     <Skeleton />
//                   </TableCell>
//                   <TableCell>
//                     <Skeleton />
//                   </TableCell>
//                 </TableRow>
//               }) : null}
//               {expertsList?.map((expert: any, index: any) => {
//                 return (
//                   <TableRow key={index}>
//                     <TableCell>
//                       {expert.degree}
//                     </TableCell>
//                     <TableCell>
//                       {expert.name + " " + expert.family}
//                     </TableCell>
//                     <TableCell>
//                       {expert.commonBaseDataFieldValue}
//                     </TableCell>
//                     <TableCell>
//                       {
//                         expert.reviews.map(r => {
//                           return <Card style={{ margin: 10, padding: 10 }}>

//                             <Stack direction={'row'}>
//                               <Box>
//                                 <Typography>{r.reviewGroupName}</Typography>
//                                 <Button
//                                   onClick={() => {
//                                     setSelectedReviewToEdit(r);
//                                   }}
//                                 >
//                                   ویرایش بازبینه
//                                 </Button>
//                                 <IconButton
//                                   color='error'
//                                   onClick={() => {
//                                     deleteAssignment(r.id, r.reviewGroupId);
//                                   }}
//                                 >
//                                   <Delete />
//                                 </IconButton>
//                               </Box>
//                             </Stack>
//                           </Card>
//                         })
//                       }
//                     </TableCell>
//                     <TableCell>
//                       <Button
//                         onClick={() => {
//                           setSelectedExpertToAddReview(expert);
//                         }}
//                       >
//                         افزودن بازبینه
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 );
//               })}
//             </TableBody>
//           </Table>
//         </TableContainer>
//         <Box margin={'50px'}>
//           <Grid container>
//             <Grid size={{ xs: 8 }}>
//               <Button
//                 variant="contained"
//                 color="error"
//                 onClick={() => {
//                   mutate(
//                     {
//                       entity: `/information`,
//                       method: 'put',
//                       data: {
//                         ...inspectionInformation,
//                         state: "EKHTESAS_AFRAD",
//                       },
//                     } as any,
//                     {
//                       onSuccess: (_: any) => {
//                         refetchStep();
//                       },
//                       onError: () => { },
//                     }
//                   );
//                 }}
//                 sx={{ margin: '10px' }}
//               >
//                 مرحله قبل
//               </Button>

//               <Button
//                 variant={'contained'}
//                 onClick={() => {
//                   if (doAllExpertsHaveReview() == false) {
//                     snackbar("به تمام بازرس ها باید بازبینه اختصاص یابد.", "error", 5000);
//                     return;
//                   }
//                   mutate(
//                     {
//                       entity: `/person-speciality-review-group?inspectionId=${inspectionInformation.inspectionId}`,
//                       method: 'post',
//                       data: selectedReviewsList().filter(i => i.personSpecialityId != null && i.reviewGroupId != null).map((item: any) => ({
//                         ...(typeof item.id === "string" && { id: item.id }),
//                         personSpecialityId: item.personSpecialityId,
//                         reviewGroupId: item.reviewGroupId,
//                       })),
//                     } as any,
//                     {
//                       onSuccess: (_: any) => {
//                         mutate(
//                           {
//                             entity: `/information`,
//                             method: 'put',
//                             data: {
//                               ...inspectionInformation,
//                               state: "SODOR_DASTOROLAMAL",
//                             },
//                           } as any,
//                           {
//                             onSuccess: (_: any) => {
//                               refetchStep();
//                             },
//                             onError: () => { },
//                           }
//                         );
//                       },
//                       onError: () => { },
//                     }
//                   );
//                 }}
//                 sx={{ margin: '10px' }}
//               >
//                 ثبت و ادامه
//               </Button>
//             </Grid>
//           </Grid>
//         </Box>
//       </Grid>
//       <Dialog fullWidth maxWidth={'lg'} open={!!selectedExpertToAddReview} onClose={() => { setSelectedExpertToAddReview(null) }}>
//         {(!!selectedExpertToAddReview) ? <ReviewPicker
//           selectedReviewsList={selectedReviewsList()}
//           inspectionId={selectedExpertToAddReview.inspectionId}
//           inspectorId={selectedExpertToAddReview.personNumber}
//           fieldId={selectedExpertToAddReview.commonBaseDataFieldId}
//           onClose={() => setSelectedExpertToAddReview(null)}
//           onReviewSelect={
//             (row) => {
//               updateReviewAssignmentList([...selectedReviewsList(), { id: new Date().getTime(), reviewGroupId: row.id, reviewGroupName: row.name, personNumber: selectedExpertToAddReview.personNumber, personSpecialityId: selectedExpertToAddReview.id }]);
//               setSelectedExpertToAddReview(null);
//             }
//           } /> : null
//         }
//       </Dialog>
//       <Dialog fullWidth maxWidth={'lg'} open={!!selectedReviewToEdit} onClose={() => setSelectedReviewToEdit(null)}>
//         {!!selectedReviewToEdit ? <ReviewGroupEditor
//           reviewGroupId={selectedReviewToEdit.reviewGroupId}
//           reviewGroupName={selectedReviewToEdit.reviewGroupName}
//           onClose={() => setSelectedReviewToEdit(null)}
//           onDone={() => setSelectedReviewToEdit(null)}
//           inspectorId={selectedReviewToEdit.personNumber}
//           inspectionId={inspectionInformation.inspectionId}
//         /> : null}
//       </Dialog>
//     </Grid>
//   );
// };

// export default StartInspectionStep5;
import {
  Box,
  Button,
  Card,
  CardContent, // این مهم بود که جا افتاده بود
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  LinearProgress,
  Collapse,
  CircularProgress,
} from '@mui/material';
import {
  Delete,
  Edit,
  Add,
  ExpandMore,
  CheckCircle,
  Cancel,
  Warning,
  Info,
  CheckCircleOutline,
  Person,
  Business,
  LocationOn,
  Assignment,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useSnackbar } from '@/hooks/useSnackbar';

// Mock data for units in the province
const MOCK_UNITS = [
  { id: 'u1', name: 'لشکر ۲۱ پیاده', code: 'L-21' },
  { id: 'u2', name: 'تیپ ۵۵ هوابرد', code: 'T-55' },
  { id: 'u3', name: 'گردان ۱۱۰ زرهی', code: 'G-110' },
  { id: 'u4', name: 'پایگاه هوایی شهید فکوری', code: 'PA-1' },
  { id: 'u5', name: 'ناوگان دریایی بندرعباس', code: 'ND-1' },
];

// Mock review templates
const MOCK_REVIEW_TEMPLATES = [
  {
    id: 'rt1',
    name: 'بازبینه عملیاتی',
    icon: '⚔️',
    color: '#dc3545',
    fields: ['آمادگی رزمی', 'تجهیزات', 'نیروی انسانی'],
  },
  {
    id: 'rt2',
    name: 'بازبینه اطلاعاتی',
    icon: '📡',
    color: '#0d6efd',
    fields: ['سیستم‌های اطلاعاتی', 'امنیت', 'گزارش‌دهی'],
  },
  {
    id: 'rt3',
    name: 'بازبینه پشتیبانی',
    icon: '📦',
    color: '#198754',
    fields: ['تدارکات', 'آماد و پشتیبانی', 'تجهیزات پشتیبانی'],
  },
  {
    id: 'rt4',
    name: 'بازبینه آموزشی',
    icon: '📚',
    color: '#6f42c1',
    fields: ['برنامه آموزشی', 'کیفیت آموزش', 'تجهیزات آموزشی'],
  },
  {
    id: 'rt5',
    name: 'بازبینه بهداشتی',
    icon: '🏥',
    color: '#20c997',
    fields: ['امکانات پزشکی', 'بهداشت محیط', 'دارو و تجهیزات'],
  },
];

// Mock checklist items
const MOCK_CHECKLIST_ITEMS = {
  rt1: [
    {
      id: 'c1',
      title: 'وضعیت آمادگی رزمی',
      category: 'آمادگی',
      description: 'ارزیابی سطح آمادگی رزمی یگان',
    },
    {
      id: 'c2',
      title: 'کیفیت تجهیزات',
      category: 'تجهیزات',
      description: 'وضعیت تجهیزات و ادوات نظامی',
    },
    {
      id: 'c3',
      title: 'تعداد نیروی انسانی',
      category: 'نیروی انسانی',
      description: 'وضعیت نیروی انسانی موجود',
    },
    {
      id: 'c4',
      title: 'سطح آموزش نیروها',
      category: 'آموزش',
      description: 'کیفیت آموزش و توانمندی نیروها',
    },
  ],
  rt2: [
    {
      id: 'c5',
      title: 'سیستم‌های اطلاعاتی',
      category: 'فناوری',
      description: 'وضعیت سیستم‌های اطلاعاتی و ارتباطی',
    },
    {
      id: 'c6',
      title: 'امنیت اطلاعات',
      category: 'امنیت',
      description: 'سطح امنیت اطلاعات و مدارک',
    },
    {
      id: 'c7',
      title: 'دقت گزارش‌ها',
      category: 'گزارش‌دهی',
      description: 'کیفیت و دقت گزارش‌های اطلاعاتی',
    },
  ],
  rt3: [
    {
      id: 'c8',
      title: 'وضعیت تدارکات',
      category: 'تدارکات',
      description: 'وضعیت تدارکات و تامین نیازها',
    },
    {
      id: 'c9',
      title: 'آماد پشتیبانی',
      category: 'پشتیبانی',
      description: 'سطح آماد پشتیبانی یگان',
    },
    {
      id: 'c10',
      title: 'تجهیزات پشتیبانی',
      category: 'تجهیزات',
      description: 'وضعیت تجهیزات پشتیبانی',
    },
  ],
  rt4: [
    {
      id: 'c11',
      title: 'برنامه آموزشی',
      category: 'برنامه‌ریزی',
      description: 'کیفیت برنامه‌های آموزشی',
    },
    {
      id: 'c12',
      title: 'کیفیت آموزش',
      category: 'ارزیابی',
      description: 'کیفیت ارائه آموزش به کارکنان',
    },
  ],
  rt5: [
    {
      id: 'c13',
      title: 'امکانات پزشکی',
      category: 'تجهیزات',
      description: 'وضعیت تجهیزات و امکانات پزشکی',
    },
    {
      id: 'c14',
      title: 'بهداشت محیط',
      category: 'بهداشت',
      description: 'وضعیت بهداشت محیط و اماکن',
    },
  ],
};

// Checklist Item Component
const ChecklistItem = ({ item, value, onChange, index }) => {
  const [showDescription, setShowDescription] = useState(false);

  const statusColors = {
    عالی: '#28a745',
    خوب: '#17a2b8',
    متوسط: '#ffc107',
    ضعیف: '#fd7e14',
    'بسیار ضعیف': '#dc3545',
  };

  const statusIcons = {
    عالی: <CheckCircle sx={{ color: '#28a745' }} />,
    خوب: <CheckCircleOutline sx={{ color: '#17a2b8' }} />,
    متوسط: <Info sx={{ color: '#ffc107' }} />,
    ضعیف: <Warning sx={{ color: '#fd7e14' }} />,
    'بسیار ضعیف': <Cancel sx={{ color: '#dc3545' }} />,
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 2,
        border: '1px solid #e0e0e0',
        borderRadius: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: '#1976d2',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
        bgcolor: value?.status ? 'rgba(25, 118, 210, 0.02)' : 'transparent',
      }}
    >
      <Grid container spacing={2} alignItems="flex-start">
        <Grid item xs={12} md={3}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <Chip
              label={`${index + 1}`}
              size="small"
              color="primary"
              sx={{ minWidth: 30, fontWeight: 'bold' }}
            />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {item.title}
              </Typography>
              <Chip
                label={item.category}
                size="small"
                variant="outlined"
                sx={{ mt: 0.5, fontSize: '0.65rem', height: 20 }}
              />
              <Tooltip title={item.description}>
                <IconButton
                  size="small"
                  sx={{ mt: 0.5, p: 0.5 }}
                  onClick={() => setShowDescription(!showDescription)}
                >
                  <Info fontSize="small" color="action" />
                </IconButton>
              </Tooltip>
              <Collapse in={showDescription}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mt: 0.5 }}
                >
                  {item.description}
                </Typography>
              </Collapse>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel>وضعیت</InputLabel>
            <Select
              value={value?.status || ''}
              label="وضعیت"
              onChange={e => onChange(item.id, 'status', e.target.value)}
              sx={{
                '& .MuiSelect-select': {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                },
                ...(value?.status && {
                  borderColor: statusColors[value.status] || '#ced4da',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: statusColors[value.status] || '#ced4da',
                  },
                }),
              }}
            >
              <MenuItem value="عالی">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {statusIcons['عالی']}
                  عالی
                </Box>
              </MenuItem>
              <MenuItem value="خوب">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {statusIcons['خوب']}
                  خوب
                </Box>
              </MenuItem>
              <MenuItem value="متوسط">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {statusIcons['متوسط']}
                  متوسط
                </Box>
              </MenuItem>
              <MenuItem value="ضعیف">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {statusIcons['ضعیف']}
                  ضعیف
                </Box>
              </MenuItem>
              <MenuItem value="بسیار ضعیف">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {statusIcons['بسیار ضعیف']}
                  بسیار ضعیف
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
          {value?.status && (
            <Box
              sx={{ mt: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <LinearProgress
                variant="determinate"
                value={
                  value.status === 'عالی'
                    ? 100
                    : value.status === 'خوب'
                      ? 75
                      : value.status === 'متوسط'
                        ? 50
                        : value.status === 'ضعیف'
                          ? 25
                          : 10
                }
                sx={{
                  flex: 1,
                  height: 4,
                  borderRadius: 2,
                  bgcolor: '#e9ecef',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: statusColors[value.status] || '#007bff',
                  },
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {value.status}
              </Typography>
            </Box>
          )}
        </Grid>

        <Grid item xs={12} md={5}>
          <TextField
            fullWidth
            size="small"
            label="توضیحات (اختیاری)"
            value={value?.description || ''}
            onChange={e => onChange(item.id, 'description', e.target.value)}
            multiline
            rows={2}
            placeholder="توضیحات تکمیلی..."
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

// Review Form Component
const ReviewForm = ({
  open,
  onClose,
  onSave,
  review = null,
  expertName,
  availableUnits = MOCK_UNITS,
  templates = MOCK_REVIEW_TEMPLATES,
  checklistItems = MOCK_CHECKLIST_ITEMS,
  provinceName = '',
}) => {
  const snackbar = useSnackbar();
  const [formData, setFormData] = useState({
    unitId: review?.unitId || '',
    unitName: review?.unitName || '',
    templateId: review?.templateId || '',
    provinceName: review?.provinceName || provinceName || '',
    strengths: review?.strengths || '',
    weaknesses: review?.weaknesses || '',
    suggestions: review?.suggestions || '',
    checklist: review?.checklist || {},
    status: review?.status || 'draft',
  });

  const [errors, setErrors] = useState({});
  const [selectedTemplate, setSelectedTemplate] = useState(
    review?.templateId || ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open && !review) {
      setFormData(prev => ({
        ...prev,
        provinceName: provinceName || prev.provinceName,
      }));
    }
  }, [open, provinceName, review]);

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleChecklistChange = (itemId, field, value) => {
    setFormData(prev => ({
      ...prev,
      checklist: {
        ...prev.checklist,
        [itemId]: {
          ...prev.checklist[itemId],
          [field]: value,
        },
      },
    }));
  };

  const handleTemplateChange = templateId => {
    setSelectedTemplate(templateId);
    setFormData(prev => ({
      ...prev,
      templateId: templateId,
      checklist: {},
    }));
  };

  const handleUnitChange = unitId => {
    const unit = availableUnits.find(u => u.id === unitId);
    setFormData(prev => ({
      ...prev,
      unitId: unitId,
      unitName: unit?.name || '',
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.unitId) newErrors.unitId = 'انتخاب یگان الزامی است';
    if (!formData.templateId)
      newErrors.templateId = 'انتخاب الگوی بازبینه الزامی است';
    if (!formData.provinceName) newErrors.provinceName = 'نام استان الزامی است';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const checklistItemsList = Object.keys(formData.checklist).map(key => ({
        itemId: key,
        ...formData.checklist[key],
      }));

      const reviewData = {
        ...formData,
        checklistItems: checklistItemsList,
        reviewId: review?.reviewId || `review-${Date.now()}`,
        createdAt: review?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await new Promise(resolve => setTimeout(resolve, 500));
      onSave(reviewData);
      snackbar('بازبینه با موفقیت ذخیره شد', 'success', 3000);
    } catch (error) {
      const errorMessage = error.message || 'خطا در ذخیره بازبینه';
      setErrors({ submit: errorMessage });
      snackbar(errorMessage, 'error', 5000);
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentChecklistItems = selectedTemplate
    ? checklistItems[selectedTemplate] || []
    : [];
  const selectedTemplateInfo = templates.find(t => t.id === selectedTemplate);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          {review ? '✏️ ویرایش بازبینه' : '➕ ایجاد بازبینه جدید'}
          {expertName && (
            <Typography
              variant="subtitle2"
              sx={{ color: 'rgba(255,255,255,0.8)', mt: 0.5 }}
            >
              <Person sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
              بازرس: {expertName}
            </Typography>
          )}
        </Box>
        <Chip
          label={formData.status === 'completed' ? 'تکمیل شده' : 'پیش‌نویس'}
          color={formData.status === 'completed' ? 'success' : 'warning'}
          size="small"
          sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}
        />
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {errors.submit && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errors.submit}
          </Alert>
        )}

        <Box sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="نام استان"
                value={formData.provinceName}
                onChange={e =>
                  handleFieldChange('provinceName', e.target.value)
                }
                error={!!errors.provinceName}
                helperText={errors.provinceName}
                required
                InputProps={{
                  startAdornment: (
                    <LocationOn sx={{ color: 'action.active', mr: 1 }} />
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.unitId} required>
                <InputLabel>یگان بازدید شونده</InputLabel>
                <Select
                  value={formData.unitId}
                  label="یگان بازدید شونده"
                  onChange={e => handleUnitChange(e.target.value)}
                  startAdornment={
                    <Business sx={{ color: 'action.active', mr: 1 }} />
                  }
                  sx={{ borderRadius: 2 }}
                >
                  {availableUnits.map(unit => (
                    <MenuItem key={unit.id} value={unit.id}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          width: '100%',
                        }}
                      >
                        <span>{unit.name}</span>
                        <Chip
                          label={unit.code}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                {errors.unitId && (
                  <Typography variant="caption" color="error">
                    {errors.unitId}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.templateId} required>
                <InputLabel>الگوی بازبینه</InputLabel>
                <Select
                  value={formData.templateId}
                  label="الگوی بازبینه"
                  onChange={e => handleTemplateChange(e.target.value)}
                  sx={{ borderRadius: 2 }}
                  renderValue={selected => {
                    const template = templates.find(t => t.id === selected);
                    return template ? (
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <span>{template.icon}</span>
                        <span>{template.name}</span>
                      </Box>
                    ) : (
                      ''
                    );
                  }}
                >
                  {templates.map(template => (
                    <MenuItem key={template.id} value={template.id}>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                      >
                        <span style={{ fontSize: '1.5rem' }}>
                          {template.icon}
                        </span>
                        <Box>
                          <Typography variant="body2">
                            {template.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {template.fields.join(' • ')}
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                {errors.templateId && (
                  <Typography variant="caption" color="error">
                    {errors.templateId}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {selectedTemplate && currentChecklistItems.length > 0 && (
              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    bgcolor: '#f8f9fa',
                    borderRadius: 3,
                    border: '1px solid #e9ecef',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      mb: 3,
                    }}
                  >
                    <Assignment sx={{ color: 'primary.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {selectedTemplateInfo?.icon} چک‌لیست ارزیابی -{' '}
                      {selectedTemplateInfo?.name}
                    </Typography>
                    <Chip
                      label={`${currentChecklistItems.length} آیتم`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                  <Divider sx={{ mb: 3 }} />

                  {currentChecklistItems.map((item, index) => (
                    <ChecklistItem
                      key={item.id}
                      item={item}
                      value={formData.checklist[item.id]}
                      onChange={handleChecklistChange}
                      index={index}
                    />
                  ))}
                </Paper>
              </Grid>
            )}

            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  border: '1px solid #28a745',
                  borderRadius: 2,
                  bgcolor: 'rgba(40, 167, 69, 0.02)',
                }}
              >
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
                >
                  <CheckCircle sx={{ color: '#28a745' }} />
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, color: '#28a745' }}
                  >
                    محاسن (نقاط قوت)
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  value={formData.strengths}
                  onChange={e => handleFieldChange('strengths', e.target.value)}
                  multiline
                  rows={4}
                  placeholder="نقاط قوت و محاسن یگان را وارد کنید..."
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: 'white',
                    },
                  }}
                />
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  border: '1px solid #dc3545',
                  borderRadius: 2,
                  bgcolor: 'rgba(220, 53, 69, 0.02)',
                }}
              >
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
                >
                  <Cancel sx={{ color: '#dc3545' }} />
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, color: '#dc3545' }}
                  >
                    معایب (نقاط ضعف)
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  value={formData.weaknesses}
                  onChange={e =>
                    handleFieldChange('weaknesses', e.target.value)
                  }
                  multiline
                  rows={4}
                  placeholder="نقاط ضعف و معایب یگان را وارد کنید..."
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: 'white',
                    },
                  }}
                />
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  border: '1px solid #17a2b8',
                  borderRadius: 2,
                  bgcolor: 'rgba(23, 162, 184, 0.02)',
                }}
              >
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
                >
                  <Info sx={{ color: '#17a2b8' }} />
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, color: '#17a2b8' }}
                  >
                    پیشنهادات
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  value={formData.suggestions}
                  onChange={e =>
                    handleFieldChange('suggestions', e.target.value)
                  }
                  multiline
                  rows={3}
                  placeholder="پیشنهادات برای بهبود وضعیت..."
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: 'white',
                    },
                  }}
                />
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '1px solid #e9ecef' }}>
        <Button
          onClick={onClose}
          variant="outlined"
          color="inherit"
          disabled={isSubmitting}
        >
          انصراف
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          sx={{
            borderRadius: 2,
            px: 4,
          }}
        >
          {isSubmitting ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={20} />
              <span>در حال ذخیره...</span>
            </Box>
          ) : review ? (
            'ویرایش بازبینه'
          ) : (
            'ایجاد بازبینه'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Main Component
const StartInspectionStep5 = ({
  inspectionInformation,
  setInspectionInformation,
  refetchStep,
  onStepChange,
  currentStep,
  useMockData = true,
  updateInspectionState,
  experts = [],
  setExperts,
  reviews = [],
  setReviews,
  snackbar,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [expandedExperts, setExpandedExperts] = useState({});

  const getExpertReviews = expertId => {
    return reviews.filter(r => r.expertId === expertId);
  };

  const handleAddReview = expert => {
    setSelectedExpert(expert);
    setEditingReview(null);
    setIsReviewFormOpen(true);
  };

  const handleEditReview = review => {
    setEditingReview(review);
    const expert = experts.find(e => e.id === review.expertId);
    setSelectedExpert(expert);
    setIsReviewFormOpen(true);
  };

  const handleSaveReview = async reviewData => {
    try {
      if (useMockData) {
        if (editingReview) {
          const updatedReviews = reviews.map(r =>
            r.reviewId === editingReview.reviewId
              ? { ...reviewData, expertId: selectedExpert.id }
              : r
          );
          if (setReviews) {
            setReviews(updatedReviews);
          }
          snackbar('بازبینه با موفقیت ویرایش شد', 'success', 3000);
        } else {
          const newReview = {
            ...reviewData,
            expertId: selectedExpert.id,
            expertName: `${selectedExpert.name} ${selectedExpert.family}`,
            expertDegree: selectedExpert.degree,
          };
          if (setReviews) {
            setReviews([...reviews, newReview]);
          }
          snackbar('بازبینه با موفقیت اضافه شد', 'success', 3000);
        }
        setIsReviewFormOpen(false);
        setSelectedExpert(null);
        setEditingReview(null);
      } else {
        throw new Error('Real API not implemented in dev mode');
      }
    } catch (error) {
      const errorMessage = error.message || 'خطا در ذخیره بازبینه';
      setError(errorMessage);
      snackbar(errorMessage, 'error', 3000);
      console.error('Save review error:', error);
    }
  };

  const handleDeleteReview = reviewId => {
    try {
      if (useMockData) {
        const updatedReviews = reviews.filter(r => r.reviewId !== reviewId);
        if (setReviews) {
          setReviews(updatedReviews);
        }
        snackbar('بازبینه با موفقیت حذف شد', 'success', 3000);
      } else {
        throw new Error('Real API not implemented in dev mode');
      }
    } catch (error) {
      const errorMessage = error.message || 'خطا در حذف بازبینه';
      setError(errorMessage);
      snackbar(errorMessage, 'error', 3000);
      console.error('Delete review error:', error);
    }
  };

  const toggleExpert = expertId => {
    setExpandedExperts(prev => ({
      ...prev,
      [expertId]: !prev[expertId],
    }));
  };

  const handleBack = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      if (useMockData) {
        const updatedData = {
          ...inspectionInformation,
          state: 'EKHTESAS_AFRAD',
        };

        if (setInspectionInformation) {
          setInspectionInformation(updatedData);
        }
        if (updateInspectionState) {
          updateInspectionState('EKHTESAS_AFRAD');
        }

        await refetchStep();
        onStepChange(3);
        snackbar('به مرحله قبل بازگشتید', 'success', 3000);
      } else {
        throw new Error('Real API not implemented in dev mode');
      }
    } catch (error) {
      const errorMessage = error.message || 'خطا در بازگشت';
      setError(errorMessage);
      snackbar(errorMessage, 'error', 3000);
      console.error('Back error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinue = async () => {
    const expertsWithoutReview = experts.filter(e => {
      const expertReviews = getExpertReviews(e.id);
      return expertReviews.length === 0;
    });

    if (expertsWithoutReview.length > 0) {
      const names = expertsWithoutReview
        .map(e => `${e.name} ${e.family}`)
        .join('، ');
      snackbar(
        `بازرسان زیر باید حداقل یک بازبینه داشته باشند: ${names}`,
        'warning',
        5000
      );
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      if (useMockData) {
        const updatedData = {
          ...inspectionInformation,
          state: 'SODOR_DASTOROLAMAL',
        };

        if (setInspectionInformation) {
          setInspectionInformation(updatedData);
        }
        if (updateInspectionState) {
          updateInspectionState('SODOR_DASTOROLAMAL');
        }

        await refetchStep();
        onStepChange(5);
        snackbar('به مرحله بعد رفتید', 'success', 3000);
      } else {
        throw new Error('Real API not implemented in dev mode');
      }
    } catch (error) {
      const errorMessage = error.message || 'خطا در ادامه';
      setError(errorMessage);
      snackbar(errorMessage, 'error', 3000);
      console.error('Continue error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (currentStep !== 4) return null;

  const hasExperts = experts && experts.length > 0;

  return (
    <Box sx={{ p: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Alert severity="info" sx={{ mb: 2 }}>
        <Typography variant="caption" color="success.main">
          🔧 حالت توسعه - هر بازرس می‌تواند برای هر یگان بازبینه ایجاد کند
        </Typography>
        <Typography
          variant="caption"
          display="block"
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          تعداد بازرسان: {experts?.length || 0} | تعداد بازبینه‌ها:{' '}
          {reviews?.length || 0}
        </Typography>
      </Alert>

      {!hasExperts ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography>هیچ بازرسی تعیین نشده است</Typography>
          <Typography variant="caption" color="text.secondary">
            لطفاً ابتدا در مرحله ۲ بازرسان را اضافه کنید
          </Typography>
        </Paper>
      ) : (
        <Box>
          {experts.map(expert => {
            const expertReviews = getExpertReviews(expert.id);
            const isExpanded = expandedExperts[expert.id] || false;

            return (
              <Accordion
                key={expert.id}
                expanded={isExpanded}
                onChange={() => toggleExpert(expert.id)}
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  '&:before': { display: 'none' },
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{
                    borderRadius: 2,
                    '&:hover': {
                      bgcolor: 'rgba(0,0,0,0.02)',
                    },
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{ width: '100%', flexWrap: 'wrap' }}
                  >
                    <Chip
                      label={expert.degree || '---'}
                      size="small"
                      color="primary"
                    />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {expert.name} {expert.family}
                    </Typography>
                    <Chip
                      icon={<Person />}
                      label={`کد: ${expert.personNumber || '---'}`}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      icon={<Assignment />}
                      label={`تخصص: ${expert.specialty || expert.commonBaseDataFieldValue || '---'}`}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={`${expertReviews.length} بازبینه`}
                      size="small"
                      color={expertReviews.length > 0 ? 'success' : 'warning'}
                      icon={
                        expertReviews.length > 0 ? <CheckCircle /> : <Warning />
                      }
                    />
                    <Box sx={{ flexGrow: 1 }} />
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<Add />}
                      onClick={e => {
                        e.stopPropagation();
                        handleAddReview(expert);
                      }}
                      sx={{ borderRadius: 2 }}
                    >
                      افزودن بازبینه
                    </Button>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails>
                  {expertReviews.length === 0 ? (
                    <Alert severity="info" icon={<Info />}>
                      این بازرس هنوز هیچ بازبینه‌ای ایجاد نکرده است. برای افزودن
                      بازبینه، دکمه "افزودن بازبینه" را بزنید.
                    </Alert>
                  ) : (
                    <Grid container spacing={2}>
                      {expertReviews.map(review => (
                        <Grid item xs={12} md={6} key={review.reviewId}>
                          <Card
                            sx={{
                              height: '100%',
                              borderRadius: 2,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                              },
                            }}
                          >
                            <CardContent>
                              <Stack spacing={2}>
                                <Box>
                                  <Typography
                                    variant="h6"
                                    gutterBottom
                                    sx={{ fontWeight: 600 }}
                                  >
                                    {review.templateId
                                      ? MOCK_REVIEW_TEMPLATES.find(
                                          t => t.id === review.templateId
                                        )?.icon || '📋'
                                      : '📋'}
                                    {review.templateId
                                      ? MOCK_REVIEW_TEMPLATES.find(
                                          t => t.id === review.templateId
                                        )?.name || 'بدون الگو'
                                      : 'بدون الگو'}
                                  </Typography>
                                  <Chip
                                    label={
                                      review.status === 'completed'
                                        ? '✅ تکمیل شده'
                                        : '📝 پیش‌نویس'
                                    }
                                    size="small"
                                    color={
                                      review.status === 'completed'
                                        ? 'success'
                                        : 'warning'
                                    }
                                  />
                                </Box>

                                <Divider />

                                <Box>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 1,
                                    }}
                                  >
                                    <LocationOn fontSize="small" />
                                    استان:{' '}
                                    {review.provinceName ||
                                      inspectionInformation?.provinceName ||
                                      '---'}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 1,
                                      mt: 0.5,
                                    }}
                                  >
                                    <Business fontSize="small" />
                                    یگان: {review.unitName || '---'}
                                  </Typography>
                                </Box>

                                {review.strengths && (
                                  <Box
                                    sx={{
                                      bgcolor: 'rgba(40, 167, 69, 0.05)',
                                      p: 1.5,
                                      borderRadius: 1,
                                    }}
                                  >
                                    <Typography
                                      variant="subtitle2"
                                      color="success.main"
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5,
                                      }}
                                    >
                                      <CheckCircle fontSize="small" />
                                      محاسن:
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      sx={{ whiteSpace: 'pre-wrap' }}
                                    >
                                      {review.strengths}
                                    </Typography>
                                  </Box>
                                )}

                                {review.weaknesses && (
                                  <Box
                                    sx={{
                                      bgcolor: 'rgba(220, 53, 69, 0.05)',
                                      p: 1.5,
                                      borderRadius: 1,
                                    }}
                                  >
                                    <Typography
                                      variant="subtitle2"
                                      color="error.main"
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5,
                                      }}
                                    >
                                      <Cancel fontSize="small" />
                                      معایب:
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      sx={{ whiteSpace: 'pre-wrap' }}
                                    >
                                      {review.weaknesses}
                                    </Typography>
                                  </Box>
                                )}

                                {review.suggestions && (
                                  <Box
                                    sx={{
                                      bgcolor: 'rgba(23, 162, 184, 0.05)',
                                      p: 1.5,
                                      borderRadius: 1,
                                    }}
                                  >
                                    <Typography
                                      variant="subtitle2"
                                      color="info.main"
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5,
                                      }}
                                    >
                                      <Info fontSize="small" />
                                      پیشنهادات:
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      sx={{ whiteSpace: 'pre-wrap' }}
                                    >
                                      {review.suggestions}
                                    </Typography>
                                  </Box>
                                )}

                                {review.checklistItems &&
                                  review.checklistItems.length > 0 && (
                                    <Box>
                                      <Typography
                                        variant="subtitle2"
                                        gutterBottom
                                        sx={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: 0.5,
                                        }}
                                      >
                                        <Assignment fontSize="small" />
                                        چک‌لیست:
                                      </Typography>
                                      <Box
                                        sx={{
                                          display: 'flex',
                                          flexWrap: 'wrap',
                                          gap: 0.5,
                                        }}
                                      >
                                        {review.checklistItems.map(
                                          (item, idx) => {
                                            const statusColors = {
                                              عالی: 'success',
                                              خوب: 'info',
                                              متوسط: 'warning',
                                              ضعیف: 'error',
                                              'بسیار ضعیف': 'error',
                                            };
                                            return (
                                              <Chip
                                                key={idx}
                                                label={`${item.status || 'بدون وضعیت'}`}
                                                size="small"
                                                color={
                                                  statusColors[item.status] ||
                                                  'default'
                                                }
                                                variant="outlined"
                                                sx={{ m: 0.5 }}
                                              />
                                            );
                                          }
                                        )}
                                      </Box>
                                    </Box>
                                  )}

                                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                  <Button
                                    size="small"
                                    startIcon={<Edit />}
                                    onClick={() => handleEditReview(review)}
                                    variant="outlined"
                                  >
                                    ویرایش
                                  </Button>
                                  <Button
                                    size="small"
                                    color="error"
                                    startIcon={<Delete />}
                                    onClick={() =>
                                      handleDeleteReview(review.reviewId)
                                    }
                                    variant="outlined"
                                  >
                                    حذف
                                  </Button>
                                </Box>
                              </Stack>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
      )}

      <Box margin={'50px'}>
        <Grid container>
          <Grid size={{ xs: 8 }}>
            <Button
              variant="contained"
              color="error"
              onClick={handleBack}
              sx={{ margin: '10px' }}
              disabled={isSubmitting}
            >
              مرحله قبل
            </Button>

            <Button
              variant={'contained'}
              onClick={handleContinue}
              sx={{ margin: '10px' }}
              disabled={isSubmitting || !hasExperts}
            >
              {isSubmitting ? 'در حال پردازش...' : 'ثبت و ادامه'}
            </Button>

            {hasExperts && (
              <Typography
                variant="caption"
                color="info.main"
                sx={{ display: 'block', mt: 1 }}
              >
                💡 هر بازرس باید حداقل یک بازبینه داشته باشد
              </Typography>
            )}
          </Grid>
        </Grid>
      </Box>

      <ReviewForm
        open={isReviewFormOpen}
        onClose={() => {
          setIsReviewFormOpen(false);
          setSelectedExpert(null);
          setEditingReview(null);
        }}
        onSave={handleSaveReview}
        review={editingReview}
        expertName={
          selectedExpert
            ? `${selectedExpert.name} ${selectedExpert.family}`
            : ''
        }
        availableUnits={MOCK_UNITS}
        templates={MOCK_REVIEW_TEMPLATES}
        checklistItems={MOCK_CHECKLIST_ITEMS}
        provinceName={inspectionInformation?.provinceName || ''}
      />
    </Box>
  );
};

export default StartInspectionStep5;
