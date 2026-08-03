import { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Autocomplete,
  IconButton,
  Dialog,
  Grid,
} from '@mui/material';
import { Delete } from '@mui/icons-material';

import { MatnaDataGrid } from '@/components/data-grid/MatnaDataGrid.tsx';
import { useSnackbar } from '@/hooks/useSnackbar';
import { useLegacyApi } from '@/hooks/useLegacyApi';
import { useMutation, useQuery } from '@tanstack/react-query';
import ReviewGroupEditor from '../../scheduled/components/ReviewGroupEditor';

const ReviewPicker = ({ fieldId, onReviewSelect, inspectorId, inspectionId, onClose }) => {

  let legacyApi = useLegacyApi();
  const [selectedReview, setSelectedReview] = useState(null);

  const {
    data: reviewsList,
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
            onClick={() => setSelectedReview(row)}
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
    return <MatnaDataGrid columns={columns} rows={reviewsList} paginationMode={'client'} />;
  }
}

export default function SelfAssessmentConfigurationStep7 ({ inspectionInformation, refetchStep,    onBack }: any) {
  const legacyApi = useLegacyApi();

  const [selectedItem, setSelectedItem] = useState(null);
  const snackbar = useSnackbar();
  const { mutate } = useMutation({
    mutationFn: legacyApi.request,
  });
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [selectedPersonSpecialityReview, selectPersonSpecialityReview] = useState(null);

  const [reviewAssignmentList, setReviewAssignmentList] = useState([]);

  const { data: experts } = useQuery<any, any, any>({
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
    setReviewAssignmentList(initialReviewAssignmentList);
  }, [initialReviewAssignmentList]);

  const options = useMemo(
    () =>  {
      if (experts == null) {
        return [];
      }
      else {
        return experts.map((item: any) => {
          return {
            title:
              item.name +
              ' ' +
              item.family,
            value: item.personNumber,
            fieldId: item.commonBaseDataFieldId,
            personSpecialityId: item.id,
          };
        });
      }
    },
    [experts]
  );

  const deleteAssignment = (id: any) => {
    if (typeof id === 'number') {
      setReviewAssignmentList((list: any) =>
        list.filter((item: any, _: any) => item.id != id)
      );
      snackbar('با موفقیت حذف شد.', 'success', 5000);
    } else {
      mutate(
        {
          entity: `/person-speciality-review-group/${id}`,
          method: 'delete',
        } as any,
        {
          onSuccess: (res: any) => {
            if (res.data) {
              snackbar('با موفقیت حذف شد.', 'success', 5000);
              setReviewAssignmentList((list: any) =>
                list.filter((item: any, _: any) => item.id != id)
              );
            } else {
              snackbar('خطا در حذف', 'error', 5000);
            }
          },
        }
      );
    }
  };

  let selectedFieldId = null
  if (selectedItem != null) {
    let personSpecialityId = reviewAssignmentList[selectedItem].personSpecialityId;
    selectedFieldId = options.find(e => e.personSpecialityId == personSpecialityId)?.fieldId;
  }

  return (
    <Grid container justifyContent={'center'}>
      <Grid>
        <TableContainer component={Paper}>
          <Table
            aria-label="simple table"
            sx={{
              minWidth: 650,
              '& td': {
                padding: '10px !important',
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell width={'80px'}></TableCell>
                <TableCell width={'40%'}>بازرس</TableCell>
                <TableCell>بازبینه</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reviewAssignmentList?.map((assignment: any, index: any) => {
                return (
                  <TableRow key={index}>
                    <TableCell align="center">
                      <IconButton
                        onClick={() => {
                          deleteAssignment(assignment.id);
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <Autocomplete
                        fullWidth
                        options={options}
                        getOptionLabel={(option: any) => {
                          if (typeof option !== 'object') {
                            let result = options.find(
                              (op: any) => op?.personSpecialityId === option
                            );
                            return result?.title || '';
                          }
                          return option?.title || '';
                        }}
                        filterOptions={(ops, state) => {
                          //@ts-ignore
                          return ops?.filter((op: TOption) =>
                            op?.title?.includes(state?.inputValue)
                          );
                        }}
                        id={`autocomplete-rev-g-${index}`}
                        value={assignment?.personSpecialityId}
                        onChange={(_: any, newValue: any) => {
                          setReviewAssignmentList((list: any) => {
                            let newList = [...list];
                            newList[index].personSpecialityId = newValue.personSpecialityId,
                              newList[index].personNumber = newValue.value;
                            newList[index].fieldId = newValue.fieldId;
                            return newList;
                          })
                        }}
                        renderInput={params => (
                          <TextField
                            {...params}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                padding: '0px!important',
                              },
                            }}
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      {assignment?.reviewGroupId ? (
                        <Box>
                          <Typography>{assignment.reviewGroupName}</Typography>
                          <Button
                            onClick={() => {
                              selectPersonSpecialityReview(assignment);
                            }}
                          >
                            ویرایش بازبینه
                          </Button>
                          <Button
                            onClick={() => {

                              setSelectedItem(index);
                              handleOpen();
                            }}
                          >
                            تغییر بازبینه
                          </Button>
                        </Box>
                      ) : (
                        <Button
                          disabled={!assignment.personSpecialityId}
                          onClick={() => {
                            setSelectedItem(index);
                            handleOpen();
                          }}
                        >
                          انتخاب بازبینه
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <Box
            margin={'20px'}
            display={'flex'}
            flexDirection={'row'}
            justifyContent={'center'}
            alignItems={'centers'}
          >
            <Button
              variant="contained"
              onClick={() => {
                setReviewAssignmentList((list: any) => {
                  return [
                    ...list,
                    {
                      id: new Date().getTime(),
                      reviewGroupId: null,
                      reviewGroupName: '',
                      personNumber: null,
                      fieldId: null,
                    },
                  ];
                });
              }}
            >
              <Typography>افزودن</Typography>
            </Button>
          </Box>
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
                      onError: () => {},
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
                  mutate(
                    {
                      entity: `/person-speciality-review-group?inspectionId=${inspectionInformation.inspectionId}`,
                      method: 'post',
                      data: reviewAssignmentList.filter(i => i.personSpecialityId != null && i.reviewGroupId != null).map((item: any) => ({
                        ...(typeof item.id === "string" && {id: item.id}),
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
      <Dialog fullWidth maxWidth={'lg'} open={open} onClose={handleClose}>
        {(selectedFieldId != null) ? <ReviewPicker
          inspectionId={inspectionInformation.inspectionId}
          inspectorId={reviewAssignmentList[selectedItem].personNumber}
          fieldId={selectedFieldId}
          onClose={handleClose}
          onReviewSelect={
            (row) => {
              setReviewAssignmentList((list: any) => {
                let newList = [...list];
                newList[selectedItem].reviewGroupId = row.id;
                newList[selectedItem].reviewGroupName = row.name;
                return newList;
              });
              handleClose();
            }
          } /> : null
        }
      </Dialog>
      <Dialog fullWidth maxWidth={'lg'} open={!!selectedPersonSpecialityReview} onClose={() => selectPersonSpecialityReview(null)}>
        {!!selectedPersonSpecialityReview ? <ReviewGroupEditor
          reviewGroupId={selectedPersonSpecialityReview.reviewGroupId}
          reviewGroupName={selectedPersonSpecialityReview.reviewGroupName}
          onClose={() => selectPersonSpecialityReview(null)}
          onDone={() => selectPersonSpecialityReview(null)}
          inspectorId={selectedPersonSpecialityReview.personNumber}
          inspectionId={inspectionInformation.inspectionId}
        /> : null}
      </Dialog>
    </Grid>
  );
};