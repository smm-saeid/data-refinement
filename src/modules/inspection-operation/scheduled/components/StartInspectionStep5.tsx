import {
  Autocomplete,
  Box,
  Button,
  Card,
  Dialog,
  Grid,
  IconButton,
  Modal,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { Delete } from '@mui/icons-material';
import { useMutation, useQuery } from '@tanstack/react-query';

import { useSnackbar } from '@/hooks/useSnackbar';
import { useLegacyApi } from '@/hooks/useLegacyApi.ts';
import { MatnaDataGrid } from '@/components/data-grid/MatnaDataGrid.tsx';
import ReviewGroupEditor from './ReviewGroupEditor';

export interface IndicatorInterface {
  id: string | number;
  title: string;
  weight: string | number;
}

const ReviewPicker = ({ fieldId, onReviewSelect, inspectorId, inspectionId, onClose, selectedReviewsList }) => {

  let legacyApi = useLegacyApi();
  let snackbar = useSnackbar();
  const [selectedReview, setSelectedReview] = useState(null);

  const {
    data: reviewsList,
    isLoading
  } = useQuery<any, any, any>({
    queryKey: [
      `/review-group-new/find-by-field-id?fieldId=${fieldId}`
    ],
    queryFn: () =>
      legacyApi.get(
        `/review-group-new/find-by-field-id?fieldId=${fieldId}`
      ),
    select: (res: any) => {
      return res?.data;
    },
  } as any);

  const columns = [
    { field: 'name', headerName: 'نام', flex: 2 },
    { field: 'organizationTypeName', headerName: 'ماهیت', flex: 1 },
    { field: 'organizationUnitForceName', headerName: 'نیرو', flex: 1 },
    { field: 'orgSpecialityName', headerName: 'تخصص', flex: 1 },
    {
      field: 'action',
      headerName: '',
      flex: 1,
      renderCell: ({ row }: any) => {
        return (
          <Button
            color="info"
            onClick={() => {
              if (selectedReviewsList.findIndex(r => r.reviewGroupId == row.id) >= 0) {
                snackbar("هر بازبینه را فقط میتوان به یک بازرس اختصاص داد.", 'error', 5000);
                return;
              }
              setSelectedReview(row);
            }}
          >
            انتخاب
          </Button>
        );
      },
    },
  ];

  if (selectedReview) {
    return <ReviewGroupEditor
      reviewGroupId={selectedReview.id}
      reviewGroupName={selectedReview.name}
      onClose={onClose}
      onDone={() => onReviewSelect(selectedReview)}
      inspectorId={inspectorId}
      inspectionId={inspectionId}
    />
  }
  else {
    return <MatnaDataGrid loading={isLoading} columns={columns} rows={reviewsList} paginationMode={'client'} />;
  }
}

const StartInspectionStep5 = ({ inspectionInformation, refetchStep }: any) => {
  const legacyApi = useLegacyApi();
  const snackbar = useSnackbar();
  const { mutate } = useMutation({
    mutationFn: legacyApi.request,
  });


  const [selectedExpertToAddReview, setSelectedExpertToAddReview] = useState(null);
  const [selectedReviewToEdit, setSelectedReviewToEdit] = useState(null);
  const [expertsList, setExpertsList] = useState([]);

  const { data: initialExpertsList } = useQuery<any, any, any>({
    queryKey: [
      `/person-speciality/find-by-inspection?pageSize=1000&currentPage=1&inspectionId=${inspectionInformation.inspectionId}`,
    ],
    queryFn: () =>
      legacyApi.get(
        `/person-speciality/find-by-inspection?pageSize=1000&currentPage=1&inspectionId=${inspectionInformation.inspectionId}`
      ),
    select: (res: any) => {
      return res?.data?.rows;
    },
  } as any);

  const {
    data: initialReviewAssignmentList,
    refetch: refetchReviewAssignmentLis
  } = useQuery<any, any, any>({
    queryKey: [
      `/person-speciality-review-group/find-by-inspection-id?inspectionId=${inspectionInformation.inspectionId}`,
    ],
    queryFn: () =>
      legacyApi.get(
        `/person-speciality-review-group/find-by-inspection-id?inspectionId=${inspectionInformation.inspectionId}`
      ),
    select: (res: any) => {
      if (Array.isArray(res?.data)) {
        return res?.data;
      }
      return [];
    },
  } as any);

  useEffect(() => {
    if (initialExpertsList != null && initialReviewAssignmentList != null) {
      const newExpertsList = [...initialExpertsList].map(expert => {
        const id = expert.id;
        return { ...expert, reviews: initialReviewAssignmentList.filter(r => r.personSpecialityId == id) }
      });
      setExpertsList(newExpertsList);
    }
  }, [initialReviewAssignmentList, initialExpertsList]);

  const deleteAssignment = (personSpecialityReviewGroupId, reviewGroupId) => {
    mutate(
      {
        entity: `review-customize/delete-by-inspection-group?inspectionId=${inspectionInformation.inspectionId}&groupId=${reviewGroupId}&personSpecialityReviewGroupId=${personSpecialityReviewGroupId}`,
        method: 'delete',
      } as any,
      {
        onSuccess: (res: any) => {
          snackbar('با موفقیت حذف شد.', 'success', 5000);
          refetchReviewAssignmentLis();
        },
        onError: () => {
          snackbar('خطا در حذف', 'error', 5000);
        },
      }
    );
  };

  const selectedReviewsList = () => {
    let out = [];
    expertsList.forEach(e => {
      out = [...out, ...e.reviews];
    })
    return out;
  };

  const doAllExpertsHaveReview = () => {
    let result = true;
    expertsList.forEach(e => {
      if (e.reviews.length == 0) {
        result = false;
      }
    })
    return result;
  }

  const updateReviewAssignmentList = (reviews) => {
    mutate(
      {
        entity: `/person-speciality-review-group?inspectionId=${inspectionInformation.inspectionId}`,
        method: 'post',
        data: reviews.filter(i => i.personSpecialityId != null && i.reviewGroupId != null).map((item: any) => ({
          ...(typeof item.id === "string" && { id: item.id }),
          personSpecialityId: item.personSpecialityId,
          reviewGroupId: item.reviewGroupId,
        })),
      } as any,
      {
        onSuccess: (_: any) => {
          refetchReviewAssignmentLis();
        },
        onError: () => { },
      }
    );
  }

  return (
    <Grid container justifyContent={'center'}>
      <Grid>
        <TableContainer component={Paper}>
          <Table
            aria-label="simple table"
            sx={{
              minWidth: 1000,
              '& td': {
                padding: '10px !important',
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell width={'10%'}>درجه</TableCell>
                <TableCell width={'20%'}>بازرس</TableCell>
                <TableCell width={'20%'}>تخصص</TableCell>
                <TableCell>بازبینه ها</TableCell>
                <TableCell width={'10%'}>عملیات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expertsList.length == 0 ? [...Array(10).keys()].map(i => {
                return <TableRow key={i}>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                </TableRow>
              }) : null}
              {expertsList?.map((expert: any, index: any) => {
                return (
                  <TableRow key={index}>
                    <TableCell>
                      {expert.degree}
                    </TableCell>
                    <TableCell>
                      {expert.name + " " + expert.family}
                    </TableCell>
                    <TableCell>
                      {expert.commonBaseDataFieldValue}
                    </TableCell>
                    <TableCell>
                      {
                        expert.reviews.map(r => {
                          return <Card style={{ margin: 10, padding: 10 }}>

                            <Stack direction={'row'}>
                              <Box>
                                <Typography>{r.reviewGroupName}</Typography>
                                <Button
                                  onClick={() => {
                                    setSelectedReviewToEdit(r);
                                  }}
                                >
                                  ویرایش بازبینه
                                </Button>
                                <IconButton
                                  color='error'
                                  onClick={() => {
                                    deleteAssignment(r.id, r.reviewGroupId);
                                  }}
                                >
                                  <Delete />
                                </IconButton>
                              </Box>
                            </Stack>
                          </Card>
                        })
                      }
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => {
                          setSelectedExpertToAddReview(expert);
                        }}
                      >
                        افزودن بازبینه
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Box margin={'50px'}>
          <Grid container>
            <Grid size={{ xs: 8 }}>
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  mutate(
                    {
                      entity: `/information`,
                      method: 'put',
                      data: {
                        ...inspectionInformation,
                        state: "EKHTESAS_AFRAD",
                      },
                    } as any,
                    {
                      onSuccess: (_: any) => {
                        refetchStep();
                      },
                      onError: () => { },
                    }
                  );
                }}
                sx={{ margin: '10px' }}
              >
                مرحله قبل
              </Button>

              <Button
                variant={'contained'}
                onClick={() => {
                  if (doAllExpertsHaveReview() == false) {
                    snackbar("به تمام بازرس ها باید بازبینه اختصاص یابد.", "error", 5000);
                    return;
                  }
                  mutate(
                    {
                      entity: `/person-speciality-review-group?inspectionId=${inspectionInformation.inspectionId}`,
                      method: 'post',
                      data: selectedReviewsList().filter(i => i.personSpecialityId != null && i.reviewGroupId != null).map((item: any) => ({
                        ...(typeof item.id === "string" && { id: item.id }),
                        personSpecialityId: item.personSpecialityId,
                        reviewGroupId: item.reviewGroupId,
                      })),
                    } as any,
                    {
                      onSuccess: (_: any) => {
                        mutate(
                          {
                            entity: `/information`,
                            method: 'put',
                            data: {
                              ...inspectionInformation,
                              state: "SODOR_DASTOROLAMAL",
                            },
                          } as any,
                          {
                            onSuccess: (_: any) => {
                              refetchStep();
                            },
                            onError: () => { },
                          }
                        );
                      },
                      onError: () => { },
                    }
                  );
                }}
                sx={{ margin: '10px' }}
              >
                ثبت و ادامه
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Grid>
      <Dialog fullWidth maxWidth={'lg'} open={!!selectedExpertToAddReview} onClose={() => { setSelectedExpertToAddReview(null) }}>
        {(!!selectedExpertToAddReview) ? <ReviewPicker
          selectedReviewsList={selectedReviewsList()}
          inspectionId={selectedExpertToAddReview.inspectionId}
          inspectorId={selectedExpertToAddReview.personNumber}
          fieldId={selectedExpertToAddReview.commonBaseDataFieldId}
          onClose={() => setSelectedExpertToAddReview(null)}
          onReviewSelect={
            (row) => {
              updateReviewAssignmentList([...selectedReviewsList(), { id: new Date().getTime(), reviewGroupId: row.id, reviewGroupName: row.name, personNumber: selectedExpertToAddReview.personNumber, personSpecialityId: selectedExpertToAddReview.id }]);
              setSelectedExpertToAddReview(null);
            }
          } /> : null
        }
      </Dialog>
      <Dialog fullWidth maxWidth={'lg'} open={!!selectedReviewToEdit} onClose={() => setSelectedReviewToEdit(null)}>
        {!!selectedReviewToEdit ? <ReviewGroupEditor
          reviewGroupId={selectedReviewToEdit.reviewGroupId}
          reviewGroupName={selectedReviewToEdit.reviewGroupName}
          onClose={() => setSelectedReviewToEdit(null)}
          onDone={() => setSelectedReviewToEdit(null)}
          inspectorId={selectedReviewToEdit.personNumber}
          inspectionId={inspectionInformation.inspectionId}
        /> : null}
      </Dialog>
    </Grid>
  );
};

export default StartInspectionStep5;
