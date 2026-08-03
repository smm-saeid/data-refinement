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
  Tooltip,
  Typography,
} from '@mui/material';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { Close, Delete } from '@mui/icons-material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { useSnackbar } from '@/hooks/useSnackbar';
import { useLegacyApi } from 'hooks/useLegacyApi.ts';
import MatnaPersonnelPicker from '@/components/MatnaPersonnelPicker';

const Expertise = ({ listSkills, setListSkills, organizationUnit }: any) => {
  const legacyApi = useLegacyApi();
  const { inspectionId: id } = useParams();
  const [open, setOpen] = React.useState(false);
  const snackbar = useSnackbar();
  const [inspectorModal, setInspectorModal] = React.useState(false);
  const [autoCompleteValue, setAutoCompleteValue] = React.useState(undefined);
  const [selectedUnit, setSelectedUnit] = useState(
    organizationUnit?.id ?? '6268a88a-8edd-471d-b385-9d26fc59186b'
  );

  const { mutate } = useMutation({
    mutationFn: legacyApi.request,
  });

  const [openPersonnelList, setOpenPersonnelList] = React.useState(false);
  const handleOpenPersonnelList = () => setOpenPersonnelList(true);
  const handleClosePersonnelList = () => setOpenPersonnelList(false);

  const [selectedSkillIndex, setSelectedListIndex] = useState(null);


  const { data: specialityData, status: speciality_Status } = useQuery<
    any,
    any,
    any,
    any
  >({
    queryKey: [
      `org-speciality/find-org-speciality-for-verification?verificationInspectionId=${id}`,
    ],
    queryFn: () => legacyApi.get(`org-speciality/find-org-speciality-for-verification?verificationInspectionId=${id}`),
    select: (res: any) => res?.data,
    enabled: !!selectedUnit,
  });

  const { data: inspectorPerson } = useQuery<any, any, any, any>({
    queryKey: [
      `/person-speciality/find-by-inspection-id-for-person-info?verificationInspectionId=${id}`,
    ],
    queryFn: () => legacyApi.get(`/person-speciality/find-by-inspection-id-for-person-info?verificationInspectionId=${id}`),
    select: (res: any) => res?.data,
    enabled: !!id,
  });

  const columns: Array<any> = useMemo(
    () => [
      {
        field: 'fullname',
        headerName: 'نام و نام خانوادگی',
        flex: 2,
        renderCell: ({ row }: any) => {
          return row.name + ' ' + row.family;
        },
      },
      { field: 'personNumber', headerName: 'شماره پرسنلی', flex: 2 },
      { field: 'field', headerName: 'تخصص', flex: 2 },
      { field: 'fieldCode', headerName: 'کد تخصص', flex: 2 },
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
                let newList = [...listSkills];
                if (selectedSkillIndex != null) {
                  newList[selectedSkillIndex].personInfoPersonNumber =
                    row?.personNumber;
                  newList[selectedSkillIndex].personInfoName = row?.name;
                  newList[selectedSkillIndex].personInfoFamily = row?.family;
                  newList[selectedSkillIndex].personInfoId = row?.id;
                }
                setListSkills(newList);
                setSelectedListIndex(null);
                handleClosePersonnelList();
              }}
            >
              انتخاب
            </Button>
          );
        },
      },
    ],
    [listSkills, selectedSkillIndex]
  );

  useEffect(() => {
    if (speciality_Status == 'success') {
      if (!listSkills || listSkills?.length === 0) {
        setListSkills(
          specialityData?.map((i: any) => ({
            ...i,
            organizationUnitId: organizationUnit?.id,
          }))
        );
      }
    }
  }, [speciality_Status]);
  useEffect(() => {
    console.log('listSkills=>', listSkills);
    console.log('specialityData=>', specialityData);
  }, [listSkills, speciality_Status]);

  const [MUI_X_PRODUCTS, setMUI_X_PRODUCTS] = useState([
    {
      id: 'zerehi',
      label: 'تیپ زرهی',
      children: [
        { id: 'aghidati', label: 'عقیدتی' },
        { id: 'hefa', label: 'حفاظت اطلاعات' },
        { id: 'et', label: 'گروهان اطلاعات' },

        { id: 'moh', label: 'گروهان مهندسی رزمی' },
        { id: 'pad', label: 'گردان پدافند هوایی' },
        { id: 'posh', label: 'گردان پشتیبانی' },

        { id: 'top', label: 'گردان توپخانه' },
        { id: 'tank', label: 'گردان تانک' },
        { id: 'hojom', label: 'کد مکانیزه هجومی' },
      ],
    },
    {
      id: 'behd',
      label: 'گروهان بهداشت و درمان',
      children: [],
    },
    {
      id: 'fava',
      label: 'گروهان فاوا ',
      children: [],
    },
    {
      id: 'jang',
      label: 'گروهان جنگ نوین ',
      children: [],
    },
    {
      id: 'gharar',
      label: 'گروهان قرارگاه ',
      children: [],
    },
    {
      id: 'khadam',
      label: 'گروهان خدمات پادگانی ',
      children: [],
    },
  ]);
  function shama(data: any) {
    return data?.map((unitItem: any) => ({
      id: unitItem?.id,
      label: unitItem?.name,
      children: shama(unitItem?.childrenChartDtoList),
    }));
  }



  const deleteInspector = (id: any) => {
    if (typeof id === 'number') {
      setListSkills((list: any) => list.filter((item: any) => item.id != id));
      snackbar('بازرس با موفقیت حذف شد.', 'success', 5000);
    } else {
      mutate(
        {
          entity: `/person-speciality/${id}`,
          method: 'delete',
        } as any,
        {
          onSuccess: (res: any) => {
            if (res.data) {
              snackbar('بازرس با موفقیت حذف شد.', 'success', 5000);
              setListSkills((list: any) =>
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

  return (
    <>
      <Box
        width={'100%'}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        paddingBottom={'10px'}
      >
        <Button
          variant="outlined"
          onClick={() => setInspectorModal(true)}
          color="info"
        >
          <Typography>مشاهده بازرسان خودارزیابی</Typography>
        </Button>
      </Box>
      {speciality_Status === 'success' ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead sx={{ bgcolor: 'lightsalmon', borderColor: 'black' }}>
              <TableRow>
                <TableCell align="center" width="5%">
                  حذف
                </TableCell>
                <TableCell align="center" width="15%">
                  نام تخصص
                </TableCell>
                <TableCell align="center" width="20%">
                  سمت در هیئت بازرسی
                </TableCell>
                <TableCell align="center" width="20%">
                  انتخاب بازرس
                </TableCell>
                <TableCell align="center" width="20%">
                  توضیحات مربوطه
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listSkills?.map((skill_data: any, index: any) => (
                <TableRow key={index}>
                  <TableCell>
                    <IconButton
                      color="error"
                      onClick={() => {
                        deleteInspector(skill_data.id);
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <Autocomplete
                      id="program"
                      onChange={(event: any, newValue: any) => {
                        if (newValue?.id) {
                          let newList = [...listSkills];
                          newList[index].orgSpecialityId =
                            newValue?.id ?? newValue?.orgSpecialityName;
                          newList[index].orgSpecialityName =
                            newValue?.orgSpecialityName ?? '';
                          setListSkills(newList);
                        }

                        setAutoCompleteValue(undefined);
                      }}
                      renderOption={(props: any, option: any) => (
                        <li {...props} key={option.id}>
                          {option?.name}
                        </li>
                      )}
                      defaultValue={skill_data}
                      value={autoCompleteValue}
                      clearOnBlur
                      options={specialityData ?? []}
                      sx={{ width: 300 }}
                      getOptionLabel={(option: any) =>
                        option?.name || option?.orgSpecialityName
                      }
                      renderInput={(params: any) => (
                        <TextField {...params} label="تخصص مربوطه " />
                      )}
                      isOptionEqualToValue={(option, value) => {
                        return `${option?.id}` === `${value?.id}`;
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      hiddenLabel
                      size="small"
                      fullWidth
                      value={listSkills[index]?.position}
                      onChange={(event: any) => {
                        let newList = [...listSkills];
                        newList[index].position = event.target.value;
                        setListSkills(newList);
                      }}
                      disabled={
                        !!skill_data.assignStatus &&
                        skill_data.assignStatus !== 'pending'
                      }
                      multiline
                      inputProps={{ style: { padding: 0 } }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    {!!listSkills[index]?.personInfoId &&
                    !!listSkills[index]?.personInfoPersonNumber &&
                    !!listSkills[index]?.personInfoName &&
                    !!listSkills[index]?.personInfoFamily ? (
                      <Grid>
                        <Grid>
                          <Typography variant="body2">{`${listSkills[index].personInfoName} ${listSkills[index].personInfoFamily} - (${listSkills[index].personInfoPersonNumber})`}</Typography>
                        </Grid>
                        <Grid>
                          <Tooltip title="حذف">
                            <IconButton
                              color="error"
                              onClick={() => {
                                let newList = [...listSkills];
                                newList[index].personInfoPersonNumber = null;
                                newList[index].personInfoName = null;
                                newList[index].personInfoFamily = null;
                                newList[index].personInfoId = null;
                                setListSkills(newList);
                              }}
                              disabled={
                                !!skill_data.assignStatus &&
                                skill_data.assignStatus !== 'pending'
                              }
                            >
                              <Close />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    ) : (
                      <Button
                        onClick={() => {
                          setSelectedListIndex(index);
                          handleOpenPersonnelList();
                        }}
                      >
                        لیست افراد
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    <TextField
                      hiddenLabel
                      size="small"
                      fullWidth
                      value={listSkills[index]?.requestDescription}
                      onChange={(event: any) => {
                        let newList = [...listSkills];
                        newList[index].requestDescription = event.target.value;
                        setListSkills(newList);
                      }}
                      multiline
                      inputProps={{ style: { padding: 0 } }}
                      disabled={
                        !!skill_data.assignStatus &&
                        skill_data.assignStatus !== 'pending'
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
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
                setListSkills((list: any) => {
                  return [
                    ...list,
                    {
                      id: new Date().getTime(),
                      orgSpecialityId: null,
                      organizationUnitId: organizationUnit?.id,
                      personInfoId: null,
                      personnelName: null,
                      requestDescription: '',
                      position: '',
                    },
                  ];
                });
              }}
            >
              <Typography variant="body2">افزودن تخصص</Typography>
            </Button>
          </Box>
        </TableContainer>
      ) : null}
      <Modal
        open={inspectorModal}
        onClose={() => setInspectorModal(!inspectorModal)}
      >
        <Fragment>
          <Dialog
            maxWidth={'md'}
            open={inspectorModal}
            onClose={() => setInspectorModal(!inspectorModal)}
          >
            <Box width={'100%'} textAlign={'center'} padding={'20px'}>
              <Typography>لیست بازرس های خودارزیابی یگان</Typography>
            </Box>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">ردیف</TableCell>
                    <TableCell align="center">نام و نام خانوادگی</TableCell>
                    <TableCell align="center">سمت</TableCell>
                    <TableCell align="center">کد پرسنلی</TableCell>
                    <TableCell align="center">تخصص مربوطه</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inspectorPerson?.map(
                    (inspectorItem: any, inspectorIndex: any) => (
                      <TableRow key={inspectorIndex}>
                        <TableCell align="center">
                          {inspectorIndex + 1}
                        </TableCell>
                        <TableCell align="center">
                          {inspectorItem?.personInfoName +
                            ' ' +
                            inspectorItem?.personInfoFamily}
                        </TableCell>
                        <TableCell align="center">
                          {inspectorItem?.position}
                        </TableCell>
                        <TableCell align="center">
                          {inspectorItem?.personInfoPersonNumber}
                        </TableCell>
                        <TableCell align="center">
                          {inspectorItem?.orgSpecialityName}
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Dialog>
        </Fragment>
      </Modal>

      <Modal open={openPersonnelList} onClose={handleClosePersonnelList}>
        <Fragment>
          <Dialog
            fullWidth
            maxWidth={'lg'}
            open={openPersonnelList}
            onClose={handleClosePersonnelList}
          >
            {selectedSkillIndex != null && listSkills?.length > 0 ? (
              <MatnaPersonnelPicker
                orgId={listSkills[selectedSkillIndex].organizationUnitId}
                onPersonnelSelect={row => {
                  let newList = [...listSkills];
                  if (selectedSkillIndex != null) {
                    newList[selectedSkillIndex].personNumber =
                      row?.personnelCode;
                    newList[selectedSkillIndex].personInfoName = row?.firstName;
                    newList[selectedSkillIndex].personInfoFamily =
                      row?.lastName;
                  }
                  setListSkills(newList);
                  setSelectedListIndex(null);
                  handleClosePersonnelList();
                }}
              />
            ) : (
              <div />
            )}
          </Dialog>
        </Fragment>
      </Modal>
    </>
  );
};

export default Expertise;
