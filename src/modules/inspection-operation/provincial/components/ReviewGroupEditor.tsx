// import { useLegacyApi } from '@/hooks/useLegacyApi';
// import { useSnackbar } from '@/hooks/useSnackbar';
// import {
//   Add,
//   Delete,
//   KeyboardArrowDown,
//   KeyboardArrowUp,
// } from '@mui/icons-material';
// import {
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Chip,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   IconButton,
//   Skeleton,
//   Stack,
//   TextField,
//   Typography,
// } from '@mui/material';
// import { useMutation, useQuery } from '@tanstack/react-query';
// import React, { useCallback, useEffect, useState } from 'react';

// const ReviewCard = React.memo(function ReviewCard({
//   review,
//   index,
//   onQuestionChange,
//   onFactorChange,
//   moveUpReview,
//   onDelete,
//   onReAdd,
// }: any) {

//   function editOrRemoveBadge() {
//     if (review.hasRemoved) {
//       return <Chip
//         label={`حذف شده`}
//         color="error"
//         size="small"
//         sx={{ fontWeight: 700, mr: 2 }}
//       />;
//     } else if (review.altered) {
//       return <Chip
//         label={`ویرایش شده`}
//         color="warning"
//         size="small"
//         sx={{ fontWeight: 700, mr: 2 }}
//       />
//     }
//     else {
//       return null;
//     }
//   }

//   return (
//     <Card key={review.id} variant="outlined">
//       <CardContent>
//         <Box display="flex" alignItems="center" mb={2}>
//           <Chip
//             label={`سوال ${index + 1}`}
//             color="primary"
//             size="small"
//             sx={{ fontWeight: 700, mr: 2 }}
//           />
//           {editOrRemoveBadge()}
//           <Box sx={{ flexGrow: 1 }} />
//           <Box display="flex" gap={0.5}>
//             <IconButton
//               onClick={() => moveUpReview(review.id)}
//               color="primary"
//               size="small"
//             >
//               <KeyboardArrowUp />
//             </IconButton>
//             <IconButton color="primary" size="small">
//               <KeyboardArrowDown />
//             </IconButton>
//             {review.hasRemoved ? (
//               <IconButton
//                 onClick={() => onReAdd(index)}
//                 color="info"
//                 size="small"
//               >
//                 <Add />
//               </IconButton>
//             ) : (
//               <IconButton
//                 onClick={() => onDelete(index)}
//                 color="error"
//                 size="small"
//               >
//                 <Delete />
//               </IconButton>
//             )}
//           </Box>
//         </Box>
//         <Stack direction={'row'} spacing={2}>
//           <TextField
//             label={'متن سوال'}
//             fullWidth
//             required
//             multiline
//             rows={3}
//             size="medium"
//             value={review.question}
//             onChange={event => {
//               onQuestionChange(index, event.target.value);
//             }}
//           />
//           <TextField
//             label="ضریب اهمیت"
//             type="number"
//             fullWidth
//             required
//             value={review.factor}
//             inputProps={{
//               min: 1,
//               max: 10,
//               step: 0.5,
//             }}
//             sx={{
//               width: 200,
//             }}
//             size="medium"
//             onChange={event => {
//               onFactorChange(index, Number(event.target.value));
//             }}
//           />
//         </Stack>
//       </CardContent>
//     </Card>
//   );
// });

// const ReviewGroupEditor = ({
//   reviewGroupId,
//   reviewGroupName,
//   onClose,
//   onDone,
//   inspectionId,
//   inspectorId,
// }) => {
//   const legacyApi = useLegacyApi();

//   const { data: initialReviewList } = useQuery<any, any, any>({
//     queryKey: [`review-customize/find-by-review-group-inspection?groupId=${reviewGroupId}&inspectionId=${inspectionId}`],
//     queryFn: () =>
//       legacyApi.get(`review-customize/find-by-review-group-inspection?groupId=${reviewGroupId}&inspectionId=${inspectionId}`),
//     select: (res: any) => {
//       return res?.data;
//     },
//     gcTime: 0,
//   } as any);

//   const { mutate } = useMutation({
//     mutationFn: legacyApi.request,
//   });

//   const snackbar = useSnackbar();

//   const checkIfReviewHasAltered = (newList, oldList, index) => {
//     console.log(oldList[index])

//     return ((newList[index].question != oldList[index].question) || (newList[index].factor != oldList[index].factor))
//   }

//   const onQuestionChange = useCallback((index, value) => {
//     setReviewList(oldList => {
//       if (index >= 0) {
//         const newList = [...oldList];
//         newList[index] = { ...newList[index] };
//         newList[index].question = value;
//         if (checkIfReviewHasAltered(newList, initialReviewList, index)) {
//           newList[index].altered = true
//         }
//         else {
//           newList[index].altered = false
//         }
//         return newList;
//       } else {
//         return oldList;
//       }
//     });
//   }, [initialReviewList]);

//   const onFactorChange = useCallback((index, value) => {
//     setReviewList(oldList => {
//       if (index >= 0) {
//         const newList = [...oldList];
//         newList[index] = { ...newList[index] };
//         newList[index].factor = value;
//         if (checkIfReviewHasAltered(newList, initialReviewList, index)) {
//           newList[index].altered = true
//         }
//         else {
//           newList[index].altered = false
//         }
//         return newList;
//       } else {
//         return oldList;
//       }
//     });
//   }, [initialReviewList]);

//   const onDelete = useCallback(index => {
//     setReviewList(oldList => {
//       if (index >= 0) {
//         const newList = [...oldList];
//         newList[index] = { ...newList[index] };
//         newList[index].hasRemoved = true;
//         return newList;
//       } else {
//         return oldList;
//       }
//     });
//   }, []);

//   const onReAdd = useCallback(index => {
//     setReviewList(oldList => {
//       if (index >= 0) {
//         const newList = [...oldList];
//         newList[index] = { ...newList[index] };
//         newList[index].hasRemoved = false;
//         return newList;
//       } else {
//         return oldList;
//       }
//     });
//   }, []);

//   const [reviewList, setReviewList] = useState(null);

//   useEffect(() => {
//     if (initialReviewList != null) {
//       setReviewList(initialReviewList);
//     }
//   }, [initialReviewList]);

//   const moveUpReview = useCallback(id => {
//     setReviewList(oldList => {
//       const index = oldList.findIndex(e => e.id == id);
//       if (index > 0) {
//         const newList = [...oldList];
//         [newList[index - 1], newList[index]] = [
//           newList[index],
//           newList[index - 1],
//         ];
//         return newList;
//       } else {
//         return oldList;
//       }
//     });
//   }, []);

//   const factorSum = reviewList?.filter(e => e.hasRemoved != true).reduce((p , c, _, __) => {return p + c.factor}, 0);

//   return (
//     <>
//       <DialogTitle>ویرایش بازبینه {reviewGroupName}</DialogTitle>
//       <DialogContent>
//         <Stack spacing={2}>
//           {reviewList == null ? (
//             <Skeleton height={500} />
//           ) : (
//             reviewList.map((e, index) => {
//               return (
//                 <ReviewCard
//                   key={e.id}
//                   review={e}
//                   onQuestionChange={onQuestionChange}
//                   onFactorChange={onFactorChange}
//                   index={index}
//                   moveUpReview={moveUpReview}
//                   onDelete={onDelete}
//                   onReAdd={onReAdd}
//                 />
//               );
//             })
//           )}
//         </Stack>
//       </DialogContent>
//       <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
//         <Box marginLeft={3}>
//           <Typography>مجموع ضرایب {factorSum}</Typography>
//         </Box>
//         <DialogActions>
//           <Button onClick={onClose} color="inherit">
//             لغو
//           </Button>
//           <Button
//             onClick={() => {
//               if (factorSum != 100) {
//                 snackbar("مجموع ضرایب باید دقیقا 100 باشد.", "error", 3000);
//                 return;
//               }
//               mutate(
//                 {
//                   entity: `/review-customize/replace-review-customize`,
//                   method: 'post',
//                   data: reviewList.filter(e => !(e.hasRemoved)).map((e, _) => {
//                     return {
//                       id: e.id,
//                       reviewNewId: e.reviewNewId,
//                       question: e.question,
//                       factor: e.factor,
//                       reviewGroupNewId: reviewGroupId,
//                       inspectionId: inspectionId,
//                       inspectorPersonNumber: inspectorId,
//                     };
//                   }),
//                 } as any,
//                 {
//                   onSuccess: (_: any) => {
//                     onDone();
//                   },
//                   onError: () => { },
//                 }
//               );
//             }}
//             variant="contained"
//             color="primary"
//           >
//             تایید
//           </Button>
//         </DialogActions>
//       </Stack>
//     </>
//   );
// };

// export default ReviewGroupEditor;
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  Paper,
  IconButton,
  Stack,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSnackbar } from '@/hooks/useSnackbar';
import { useLegacyApi } from '@/hooks/useLegacyApi.ts';
import KeypadTextField from './KeypadTextField';

const ReviewGroupEditor = ({
  reviewGroupId,
  reviewGroupName,
  onClose,
  onDone,
  inspectorId,
  inspectionId,
}) => {
  const legacyApi = useLegacyApi();
  const snackbar = useSnackbar();

  const [reviews, setReviews] = useState([]);
  const [currentReview, setCurrentReview] = useState({
    advantages: '',
    disadvantages: '',
    sectionVisited: '',
    description: '',
  });

  // Fetch existing reviews for this inspector and review group
  const {
    data: existingReviews,
    refetch: refetchReviews,
    isLoading: isLoadingReviews,
  } = useQuery({
    queryKey: ['reviews-fetch', inspectionId, inspectorId, reviewGroupId],
    queryFn: () =>
      legacyApi.get(
        `/reviews/fetch?inspectionId=${inspectionId}&inspectorId=${inspectorId}&reviewGroupId=${reviewGroupId}`
      ),
    select: res => res?.data || [],
    enabled: !!inspectionId && !!inspectorId && !!reviewGroupId,
  });

  useEffect(() => {
    if (existingReviews) {
      setReviews(existingReviews);
    }
  }, [existingReviews]);

  // Fix the mutation - define the type of data it expects
  const { mutate: saveReviews, isPending: isSaving } = useMutation({
    mutationFn: (data: any) => {
      // Using the correct structure for legacyApi.request
      return legacyApi.request({
        entity: '/person-speciality-review-group/reviews',
        method: 'post',
        data: data,
        // headers: {
        //   'Content-Type': 'application/json',
        // },
      });
    },
    onSuccess: () => {
      snackbar('بازبینه با موفقیت ذخیره شد', 'success', 5000);
      refetchReviews();
      onDone();
    },
    onError: error => {
      console.error('Save error:', error);
      snackbar('خطا در ذخیره بازبینه', 'error', 5000);
    },
  });

  // Alternative approach using mutateAsync if needed
  const { mutateAsync: saveReviewsAsync, isPending: isSavingAsync } =
    useMutation({
      mutationFn: (data: any) => {
        return legacyApi.request({
          entity: '/person-speciality-review-group/reviews',
          method: 'post',
          data: data,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      },
    });

  const handleAddReview = () => {
    // Check if at least one field has content
    if (
      currentReview.advantages ||
      currentReview.disadvantages ||
      currentReview.sectionVisited ||
      currentReview.description
    ) {
      setReviews([
        ...reviews,
        {
          ...currentReview,
          id: Date.now().toString(),
          reviewGroupId,
          inspectorId,
          inspectionId,
        },
      ]);
      setCurrentReview({
        advantages: '',
        disadvantages: '',
        sectionVisited: '',
        description: '',
      });
    } else {
      snackbar('حداقل یک فیلد را پر کنید', 'warning', 5000);
    }
  };

  const handleRemoveReview = index => {
    const updatedReviews = reviews.filter((_, i) => i !== index);
    setReviews(updatedReviews);
  };

  const handleSaveAll = () => {
    if (reviews.length === 0) {
      snackbar('حداقل یک مورد باید وارد شود', 'warning', 5000);
      return;
    }

    // Prepare the data in the format expected by the API
    const saveData = {
      inspectionId: inspectionId,
      inspectorId: inspectorId,
      reviewGroupId: reviewGroupId,
      reviews: reviews.map(review => ({
        advantages: review.advantages || '',
        disadvantages: review.disadvantages || '',
        sectionVisited: review.sectionVisited || '',
        description: review.description || '',
      })),
    };

    // Call the mutation with the data
    saveReviews(saveData);
  };

  // Alternative save handler if the above doesn't work
  const handleSaveAllAlternative = async () => {
    if (reviews.length === 0) {
      snackbar('حداقل یک مورد باید وارد شود', 'warning', 5000);
      return;
    }

    try {
      const saveData = {
        inspectionId: inspectionId,
        inspectorId: inspectorId,
        reviewGroupId: reviewGroupId,
        reviews: reviews.map(review => ({
          advantages: review.advantages || '',
          disadvantages: review.disadvantages || '',
          sectionVisited: review.sectionVisited || '',
          description: review.description || '',
        })),
      };

      await saveReviewsAsync(saveData);
      snackbar('بازبینه با موفقیت ذخیره شد', 'success', 5000);
      refetchReviews();
      onDone();
    } catch (error) {
      console.error('Save error:', error);
      snackbar('خطا در ذخیره بازبینه', 'error', 5000);
    }
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6">ویرایش بازبینه - {reviewGroupName}</Typography>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {/* Current Review Input Form */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, mb: 2, bgcolor: '#f8f9fa' }}>
              <Typography variant="subtitle1" gutterBottom>
                ثبت نظر جدید
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <KeypadTextField
                    fullWidth
                    label="مزایا"
                    value={currentReview.advantages}
                    onChange={e =>
                      setCurrentReview({
                        ...currentReview,
                        advantages: e.target.value,
                      })
                    }
                    multiline
                    rows={2}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <KeypadTextField
                    fullWidth
                    label="معایب"
                    value={currentReview.disadvantages}
                    onChange={e =>
                      setCurrentReview({
                        ...currentReview,
                        disadvantages: e.target.value,
                      })
                    }
                    multiline
                    rows={2}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <KeypadTextField
                    fullWidth
                    label="بخش بازدید شده"
                    value={currentReview.sectionVisited}
                    onChange={e =>
                      setCurrentReview({
                        ...currentReview,
                        sectionVisited: e.target.value,
                      })
                    }
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <KeypadTextField
                    fullWidth
                    label="توضیحات"
                    value={currentReview.description}
                    onChange={e =>
                      setCurrentReview({
                        ...currentReview,
                        description: e.target.value,
                      })
                    }
                    multiline
                    rows={3}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={handleAddReview}
                    fullWidth
                    disabled={isSaving || isLoadingReviews}
                  >
                    {isLoadingReviews ? 'در حال بارگذاری...' : 'افزودن نظر'}
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* List of Saved Reviews */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              نظرات ثبت شده ({reviews.length})
            </Typography>
            {isLoadingReviews ? (
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="textSecondary">
                  در حال بارگذاری...
                </Typography>
              </Paper>
            ) : reviews.length === 0 ? (
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="textSecondary">
                  هیچ نظری ثبت نشده است
                </Typography>
              </Paper>
            ) : (
              <Stack spacing={2}>
                {reviews.map((review, index) => (
                  <Paper
                    key={review.id || index}
                    sx={{ p: 2, position: 'relative', bgcolor: '#fff' }}
                  >
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemoveReview(index)}
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                      disabled={isSaving}
                    >
                      <Delete />
                    </IconButton>
                    <Grid container spacing={1} sx={{ mt: 0 }}>
                      {review.advantages && (
                        <Grid item xs={12}>
                          <Typography
                            variant="caption"
                            color="textSecondary"
                            display="block"
                          >
                            مزایا:
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ bgcolor: '#f5f5f5', p: 1, borderRadius: 1 }}
                          >
                            {review.advantages}
                          </Typography>
                        </Grid>
                      )}
                      {review.disadvantages && (
                        <Grid item xs={12}>
                          <Typography
                            variant="caption"
                            color="textSecondary"
                            display="block"
                          >
                            معایب:
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ bgcolor: '#f5f5f5', p: 1, borderRadius: 1 }}
                          >
                            {review.disadvantages}
                          </Typography>
                        </Grid>
                      )}
                      {review.sectionVisited && (
                        <Grid item xs={12}>
                          <Typography
                            variant="caption"
                            color="textSecondary"
                            display="block"
                          >
                            بخش بازدید شده:
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ bgcolor: '#f5f5f5', p: 1, borderRadius: 1 }}
                          >
                            {review.sectionVisited}
                          </Typography>
                        </Grid>
                      )}
                      {review.description && (
                        <Grid item xs={12}>
                          <Typography
                            variant="caption"
                            color="textSecondary"
                            display="block"
                          >
                            توضیحات:
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ bgcolor: '#f5f5f5', p: 1, borderRadius: 1 }}
                          >
                            {review.description}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  </Paper>
                ))}
              </Stack>
            )}
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          color="inherit"
          variant="outlined"
          disabled={isSaving}
        >
          انصراف
        </Button>
        <Button
          onClick={handleSaveAll}
          variant="contained"
          color="primary"
          disabled={isSaving || reviews.length === 0 || isLoadingReviews}
        >
          {isSaving ? 'در حال ذخیره...' : 'ذخیره همه'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewGroupEditor;
