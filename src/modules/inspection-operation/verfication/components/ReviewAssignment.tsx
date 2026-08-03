import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  Grid,
  IconButton,
  Modal,
  Paper,
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

import { MatnaDataGrid } from '@/components/data-grid/MatnaDataGrid';
import { useParams } from 'react-router';
import { useSnackbar } from '@/hooks/useSnackbar';
import { useLegacyApi } from 'hooks/useLegacyApi.ts';

export default function ReviewAssignment({
  listSkills,
  reviewAssignmentList,
  setReviewAssignmentList,
}: any) {
  let legacyApi = useLegacyApi();
  const { inspectionId: id } = useParams();
  const snackbar = useSnackbar();
  const { data: review_lists } = useQuery<any, any, any>({
    queryKey: [
      `review-group/find-by-inspection-id-for-verification?verificationInspectionId=${id}`,
    ],
    queryFn: () => legacyApi.get(`review-group/find-by-inspection-id-for-verification?verificationInspectionId=${id}`),
    select: (res: any) => res?.data,
  } as any);

  const [selectedItem, setSelectedItem] = useState<any>();
  const { mutate } = useMutation({
    mutationFn: legacyApi.request,
  });
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const columns: Array<any> = useMemo(
    () => [
      { field: 'name', headerName: 'نام', flex: 2 },
      { field: 'organizationTypeName', headerName: 'ماهیت', flex: 1 },
      { field: 'organizationUnitForceName', headerName: 'نیرو', flex: 1 },
      { field: 'orgSpecialityName', headerName: 'تخصص', flex: 1 },
      {
        field: 'action',
        headerName: '',
        align: 'center',
        flex: 1,
        renderCell: ({ row }: any) => {
          return (
            <Button
              color="info"
              onClick={() => {
                setReviewAssignmentList((list: any) => {
                  let newList = [...list];
                  newList[selectedItem].reviewGroupId = row.id;
                  newList[selectedItem].reviewGroupName = row.name;
                  return newList;
                });
                handleClose();
              }}
            >
              انتخاب
            </Button>
          );
        },
      },
    ],
    [reviewAssignmentList, selectedItem]
  );

  const SEARCH_INPUTS = useMemo(
    () => [
      {
        name: 'inspectors',
        inputType: 'autocomplete',
        label: 'بازرس',
        options: listSkills?.map((item: any) => {
          return {
            title:
              item.personInfoName +
              ' ' +
              item.personInfoFamily +
              ' - ' +
              item.position,
            value: item.id,
          };
        }),
      },
    ],
    [listSkills]
  );

  const deleteAssignment = (id: any) => {
    if (typeof id === 'number') {
      setReviewAssignmentList((list: any) =>
        list.filter((item: any) => item.id != id)
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
                list.filter((item: any) => item.id != id)
              );
            } else {
              snackbar('خطا در حذف', 'error', 5000);
            }
          },
        }
      );
    }
  };

  useEffect(() => {
    console.log(reviewAssignmentList, SEARCH_INPUTS[0].options);
  }, [reviewAssignmentList, SEARCH_INPUTS]);

  return (
    <Grid container justifyContent={'center'}>
      <Grid size={{xs: 11}}>
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
                        options={SEARCH_INPUTS[0].options}
                        getOptionLabel={(option: any) => {
                          if (typeof option !== 'object') {
                            let result = SEARCH_INPUTS[0]?.options?.find(
                              (op: any) => op?.value === option
                            );
                            return result?.title || '';
                          }
                          return option?.title || '';
                        }}
                        filterOptions={(ops, state) => {
                          //@ts-ignore
                          let temp = ops?.filter((op: TOption) =>
                            op?.title?.includes(state?.inputValue)
                          );
                          return temp;
                        }}
                        id={`autocomplete-rev-g-${index}`}
                        value={assignment?.personSpecialityId}
                        onChange={(event: any, newValue: any) => {
                          let newList = [...reviewAssignmentList];
                          newList[index].personSpecialityId = newValue
                            ? newValue.value
                            : newValue;
                          setReviewAssignmentList(newList);
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
                              setSelectedItem(index);
                              handleOpen();
                            }}
                          >
                            تغییر بازبینه
                          </Button>
                        </Box>
                      ) : (
                        <Button
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
                      id: new Date()?.getTime(),
                      reviewGroupId: null,
                      reviewGroupName: '',
                      personSpecialityId: null,
                    },
                  ];
                });
              }}
            >
              <Typography>افزودن</Typography>
            </Button>
          </Box>
        </TableContainer>
      </Grid>
      <Modal open={open} onClose={handleClose}>
        <Fragment>
          <Dialog fullWidth maxWidth={'lg'} open={open} onClose={handleClose}>
            <MatnaDataGrid
              rows={review_lists}
              columns={columns}
              rowCount={review_lists?.length}
            />
          </Dialog>
        </Fragment>
      </Modal>
    </Grid>
  );
}
