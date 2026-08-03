import {
  Box,
  Button,
  Dialog,
  Grid,
  IconButton,
  Modal,
  Paper,
  Skeleton,
  TextField,
  Typography,
} from '@mui/material';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import moment from 'moment-jalaali';
import { useForm } from 'react-hook-form';
import DisabledTextInput from 'components/DisabledTextInput';
import { useLegacyApi } from 'hooks/useLegacyApi.ts';
import { useSnackbar } from 'hooks/useSnackbar.ts';
import PaginatedMatnaDataGrid from 'components/data-grid/PaginatedMatnaDataGrid.tsx';
import { Close } from '@mui/icons-material';
import MatnaPersonnelPicker from 'components/MatnaPersonnelPicker.tsx';
import BackButton from 'components/button/BackButton.tsx';

export default function Shooting() {
  const { id } = useParams();
  const snackbar = useSnackbar();
  const [grade, setGrade] = useState(0);
  const [isOpen, setIsOpen] = React.useState(false);
  const legacyApi = useLegacyApi();
  const [refetchKey, setRefetchKey] = useState(0);

  const { mutate } = useMutation({
    mutationFn: legacyApi.request,
  });

  const [openPersonnelList, setOpenPersonnelList] = React.useState(false);
  const handleOpenPersonnelList = () => setOpenPersonnelList(true);
  const handleClosePersonnelList = () => setOpenPersonnelList(false);

  const handleClose = () => {
    setPerson(null);
    setGrade(0);
    setIsOpen(false);
  };

  const [person, setPerson] = useState(null);

  const {
    data: inspection,
    status: inspection_status,
    refetch: inspection_refetch,
  } = useQuery<any, any, any>({
    queryKey: [`/inspection/id/${id}`],
    queryFn: () => legacyApi.get(`/inspection/id/${id}`),
    select: (res: any) => res?.data,
  } as any);

  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
  } = useForm<any>();

  const remove = (id: any) => {
    mutate(
      {
        entity: `/shooting/${id}`,
        method: 'delete',
      } as any,
      {
        onSuccess: (res: any) => {
          snackbar('با موفقیت حذف شد.', 'success', 5000);
          setRefetchKey(k => k + 1);
        },
      }
    );
  };

  const columns_text = useMemo(
    () => [
      {
        headerName: 'یگان',
        field: 'organizationUnitName',
        flex: 2,
      },
      {
        headerName: 'نام و نام خانوادگی',
        field: 'personFullName',
        flex: 2,
        renderCell: ({ row }: { row: any }) => {
          return row?.personName + ' ' + row?.personFamily;
        },
      },
      {
        headerName: 'شماره پرسنلی',
        field: 'personNumber',
        flex: 2,
      },
      {
        headerName: 'نمره',
        field: 'grade',
        flex: 1,
      },
      {
        headerName: 'عملیات',
        field: 'action',
        flex: 1,
        renderCell: ({ row }: { row: any }) => {
          return (
            <Button
              variant="contained"
              color="error"
              onClick={() => remove(row?.id)}
            >
              حذف
            </Button>
          );
        },
      },
    ],
    []
  );

  const sendData = () => {
    mutate(
      {
        entity: `/shooting`,
        method: 'POST',
        data: {
          personNumber: person.personCode,
          grade: grade,
          dateRegistration: new Date(),
          inspectionId: id,
          organizationUnitId: inspection?.organizationUnitId,
        },
      } as any,
      {
        onSuccess: (res: any) => {
          snackbar('با موفقیت اضافه شد.', 'success', 5000);
          setTimeout(() => handleClose(), 1000);
          setRefetchKey(k => k + 1);
        },
      }
    );
  };

  return (
    <Box>
      <Box sx={{ margin: '20px' }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 8 }}>
            <Typography fontWeight={700} variant="h5">
              تیراندازی برای بازرسی {inspection?.organizationUnitName} -{' '}
              {inspection?.annualPlanInspectionName}
            </Typography>
          </Grid>
          <Grid size={{ xs: 4 }}>
            <Grid
              container
              spacing={2}
              justifyContent={'end'}
              alignItems={'center'}
            >
              <Grid>
                <Button onClick={() => setIsOpen(true)} variant={'contained'}>
                  افزودن
                </Button>
              </Grid>
              <Grid pt={2}>
                <BackButton />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ width: '100%' }}>
        <Paper elevation={2} sx={{ padding: '5px' }}>
          <PaginatedMatnaDataGrid
            url={'/shooting/find-by-parameter'}
            params={{ inspectionId: id }}
            columns={columns_text}
            numberOfRowsInPage={10}
            refetchKey={refetchKey}
          />
        </Paper>
      </Box>

      <Modal open={isOpen} onClose={handleClose}>
        <Fragment>
          <Dialog maxWidth={'md'} open={isOpen} onClose={handleClose}>
            <Grid container spacing={2} padding={'20px'}>
              <Grid size={{ xs: 12 }}>
                <Typography>
                  برای افزودن نمره تیراندازی، فیلد های موجود را وارد کنید.
                </Typography>
              </Grid>

              <Grid size={{ md: 4, xs: 12 }}>
                {person != null ? (
                  <Grid>
                    <IconButton
                      color="error"
                      onClick={() => {
                        setPerson(null);
                        setGrade(0);
                      }}
                    >
                      <Close />
                    </IconButton>
                  </Grid>
                ) : (
                  <Button
                    onClick={() => {
                      handleOpenPersonnelList();
                    }}
                  >
                    لیست افراد
                  </Button>
                )}
              </Grid>

              <Grid container size={{ xs: 12 }} spacing={2}>
                {person != null ? (
                  <>
                    <Grid size={{ xs: 4 }}>
                      <DisabledTextInput
                        value={person?.personCode}
                        label={'کد پرسنلی'}
                      />
                    </Grid>
                    <Grid size={{ xs: 4 }}>
                      <DisabledTextInput
                        value={person?.name + ' ' + person?.family}
                        label={'نام و نام خانوادگی'}
                      />
                    </Grid>
                    <Grid size={{ xs: 4 }}>
                      <DisabledTextInput
                        value={inspection?.organizationUnitName}
                        label={'یگان'}
                      />
                    </Grid>
                  </>
                ) : null}
              </Grid>
              <Grid size={{ md: 4, xs: 12 }}>
                <TextField
                  label={'نمره تیراندازی'}
                  type="number"
                  value={grade}
                  onChange={(event: any) => {
                    let newGrade = 0;
                    if (parseInt(event.target.value) > 100) newGrade = 100;
                    else if (parseInt(event.target.value) < 0) newGrade = 0;
                    else newGrade = parseInt(event.target.value);
                    setGrade(newGrade);
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Button
                  variant="contained"
                  onClick={handleSubmit(sendData)}
                  disabled={!person}
                >
                  ثبت
                </Button>
              </Grid>
            </Grid>
          </Dialog>
        </Fragment>
      </Modal>

      <Dialog
        fullWidth
        maxWidth={'lg'}
        open={openPersonnelList}
        onClose={handleClosePersonnelList}
      >
        {inspection?.organizationUnitId != null ? (
          <MatnaPersonnelPicker
            orgId={inspection?.organizationUnitId}
            onPersonnelSelect={row => {
              setPerson({
                personCode: row?.personnelCode,
                name: row?.firstName,
                family: row?.lastName,
              });
              handleClosePersonnelList();
            }}
          />
        ) : (
          <Skeleton height={300} />
        )}
      </Dialog>
    </Box>
  );
}
