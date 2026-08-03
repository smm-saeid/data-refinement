import { useLegacyApi } from '@/hooks/useLegacyApi';
import { useSnackbar } from '@/hooks/useSnackbar';
import {
  Add,
  Delete,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useCallback, useEffect, useState } from 'react';

const ReviewCard = React.memo(function ReviewCard({
  review,
  index,
  onQuestionChange,
  onFactorChange,
  moveUpReview,
  onDelete,
  onReAdd,
}: any) {

  function editOrRemoveBadge() {
    if (review.hasRemoved) {
      return <Chip
        label={`حذف شده`}
        color="error"
        size="small"
        sx={{ fontWeight: 700, mr: 2 }}
      />;
    } else if (review.altered) {
      return <Chip
        label={`ویرایش شده`}
        color="warning"
        size="small"
        sx={{ fontWeight: 700, mr: 2 }}
      />
    }
    else {
      return null;
    }
  }

  return (
    <Card key={review.id} variant="outlined">
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Chip
            label={`سوال ${index + 1}`}
            color="primary"
            size="small"
            sx={{ fontWeight: 700, mr: 2 }}
          />
          {editOrRemoveBadge()}
          <Box sx={{ flexGrow: 1 }} />
          <Box display="flex" gap={0.5}>
            <IconButton
              onClick={() => moveUpReview(review.id)}
              color="primary"
              size="small"
            >
              <KeyboardArrowUp />
            </IconButton>
            <IconButton color="primary" size="small">
              <KeyboardArrowDown />
            </IconButton>
            {review.hasRemoved ? (
              <IconButton
                onClick={() => onReAdd(index)}
                color="info"
                size="small"
              >
                <Add />
              </IconButton>
            ) : (
              <IconButton
                onClick={() => onDelete(index)}
                color="error"
                size="small"
              >
                <Delete />
              </IconButton>
            )}
          </Box>
        </Box>
        <Stack direction={'row'} spacing={2}>
          <TextField
            label={'متن سوال'}
            fullWidth
            required
            multiline
            rows={3}
            size="medium"
            value={review.question}
            onChange={event => {
              onQuestionChange(index, event.target.value);
            }}
          />
          <TextField
            label="ضریب اهمیت"
            type="number"
            fullWidth
            required
            value={review.factor}
            inputProps={{
              min: 1,
              max: 10,
              step: 0.5,
            }}
            sx={{
              width: 200,
            }}
            size="medium"
            onChange={event => {
              onFactorChange(index, Number(event.target.value));
            }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
});

const ReviewGroupEditor = ({
  reviewGroupId,
  reviewGroupName,
  onClose,
  onDone,
  inspectionId,
  inspectorId,
}) => {
  const legacyApi = useLegacyApi();

  const { data: initialReviewList } = useQuery<any, any, any>({
    queryKey: [`review-customize/find-by-review-group-inspection?groupId=${reviewGroupId}&inspectionId=${inspectionId}`],
    queryFn: () =>
      legacyApi.get(`review-customize/find-by-review-group-inspection?groupId=${reviewGroupId}&inspectionId=${inspectionId}`),
    select: (res: any) => {
      return res?.data;
    },
    gcTime: 0,
  } as any);

  const { mutate } = useMutation({
    mutationFn: legacyApi.request,
  });

  const snackbar = useSnackbar();

  const checkIfReviewHasAltered = (newList, oldList, index) => {
    console.log(oldList[index])

    return ((newList[index].question != oldList[index].question) || (newList[index].factor != oldList[index].factor))
  }

  const onQuestionChange = useCallback((index, value) => {
    setReviewList(oldList => {
      if (index >= 0) {
        const newList = [...oldList];
        newList[index] = { ...newList[index] };
        newList[index].question = value;
        if (checkIfReviewHasAltered(newList, initialReviewList, index)) {
          newList[index].altered = true
        }
        else {
          newList[index].altered = false
        }
        return newList;
      } else {
        return oldList;
      }
    });
  }, [initialReviewList]);

  const onFactorChange = useCallback((index, value) => {
    setReviewList(oldList => {
      if (index >= 0) {
        const newList = [...oldList];
        newList[index] = { ...newList[index] };
        newList[index].factor = value;
        if (checkIfReviewHasAltered(newList, initialReviewList, index)) {
          newList[index].altered = true
        }
        else {
          newList[index].altered = false
        }
        return newList;
      } else {
        return oldList;
      }
    });
  }, [initialReviewList]);

  const onDelete = useCallback(index => {
    setReviewList(oldList => {
      if (index >= 0) {
        const newList = [...oldList];
        newList[index] = { ...newList[index] };
        newList[index].hasRemoved = true;
        return newList;
      } else {
        return oldList;
      }
    });
  }, []);

  const onReAdd = useCallback(index => {
    setReviewList(oldList => {
      if (index >= 0) {
        const newList = [...oldList];
        newList[index] = { ...newList[index] };
        newList[index].hasRemoved = false;
        return newList;
      } else {
        return oldList;
      }
    });
  }, []);

  const [reviewList, setReviewList] = useState(null);

  useEffect(() => {
    if (initialReviewList != null) {
      setReviewList(initialReviewList);
    }
  }, [initialReviewList]);

  const moveUpReview = useCallback(id => {
    setReviewList(oldList => {
      const index = oldList.findIndex(e => e.id == id);
      if (index > 0) {
        const newList = [...oldList];
        [newList[index - 1], newList[index]] = [
          newList[index],
          newList[index - 1],
        ];
        return newList;
      } else {
        return oldList;
      }
    });
  }, []);

  const factorSum = reviewList?.filter(e => e.hasRemoved != true).reduce((p , c, _, __) => {return p + c.factor}, 0);

  return (
    <>
      <DialogTitle>ویرایش بازبینه {reviewGroupName}</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          {reviewList == null ? (
            <Skeleton height={500} />
          ) : (
            reviewList.map((e, index) => {
              return (
                <ReviewCard
                  key={e.id}
                  review={e}
                  onQuestionChange={onQuestionChange}
                  onFactorChange={onFactorChange}
                  index={index}
                  moveUpReview={moveUpReview}
                  onDelete={onDelete}
                  onReAdd={onReAdd}
                />
              );
            })
          )}
        </Stack>
      </DialogContent>
      <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
        <Box marginLeft={3}>
          <Typography>مجموع ضرایب {factorSum}</Typography>
        </Box>
        <DialogActions>
          <Button onClick={onClose} color="inherit">
            لغو
          </Button>
          <Button
            onClick={() => {
              if (factorSum != 100) {
                snackbar("مجموع ضرایب باید دقیقا 100 باشد.", "error", 3000);
                return;
              }
              mutate(
                {
                  entity: `/review-customize/replace-review-customize`,
                  method: 'post',
                  data: reviewList.filter(e => !(e.hasRemoved)).map((e, _) => {
                    return {
                      id: e.id,
                      reviewNewId: e.reviewNewId,
                      question: e.question,
                      factor: e.factor,
                      reviewGroupNewId: reviewGroupId,
                      inspectionId: inspectionId,
                      inspectorPersonNumber: inspectorId,
                    };
                  }),
                } as any,
                {
                  onSuccess: (_: any) => {
                    onDone();
                  },
                  onError: () => { },
                }
              );
            }}
            variant="contained"
            color="primary"
          >
            تایید
          </Button>
        </DialogActions>
      </Stack>
    </>
  );
};

export default ReviewGroupEditor;
