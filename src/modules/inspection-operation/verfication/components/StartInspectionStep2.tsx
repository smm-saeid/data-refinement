import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  Grid,
  IconButton,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';

import React, { useEffect, useState } from 'react';

import { Close, Delete } from '@mui/icons-material';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { TOption } from '@/types/render';
import { useLegacyApi } from '@/hooks/useLegacyApi.ts';
import MatnaPersonnelPicker from '@/components/MatnaPersonnelPicker';
import { useSnackbar } from '@/hooks/useSnackbar';

export interface IndicatorInterface {
  id: string | number;
  title: string;
  weight: string | number;
}
const StartInspectionStep2 = ({ inspectionInformation, refetchStep }: any) => {
  const legacyApi = useLegacyApi();
  const snackbar = useSnackbar();

  const [openPersonnelList, setOpenPersonnelList] = React.useState(false);
  const handleOpenPersonnelList = () => setOpenPersonnelList(true);
  const handleClosePersonnelList = () => setOpenPersonnelList(false);

  const [selectedSkillIndex, setSelectedListIndex] = useState(null);

  const { data: orgs, status: organizationStatus } = useQuery<any, any, any>({
    queryKey: [`/organizations?pageSize=1000&currentPage=1`],
    queryFn: () => legacyApi.get(`/organizations?pageSize=1000&currentPage=1`),
    select: (res: any) => {
      return res?.data?.rows?.filter(
        (value: any, index: any, self: any) =>
          index === self.findIndex((t: any) => t.name === value.name)
      );
    },
  } as any);

  const [leadInfo, setLeadInfo] = useState(null);
  const [deputy, setDeputy] = useState(null);

  const [inspectorsList, setInspectorsList] = useState([]);

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

  useEffect(() => {
    setInspectorsList(experts);
  }, [experts]);

  const { data: speciality, status: specialityStatus } = useQuery<
    any,
    any,
    any
  >({
    queryKey: [
      `/org-speciality/find-org-speciality-for-verification?verificationInspectionId=${inspectionInformation.inspectionId}`,
    ],
    queryFn: () =>
      legacyApi.get(
        `/org-speciality/find-org-speciality-for-verification?verificationInspectionId=${inspectionInformation.inspectionId}`
      ),
    select: (res: any) => {
      return res?.data?.map((item: any) => {
        return {
          title: item.description,
          value: item.id,
        };
      });
    },
  });

  const { data: leadInitialInfo, status: leadInitialInfoStatus } = useQuery<
    any,
    any,
    any
  >({
    queryKey: [
      `api/lead-inspection/find-by-inspection?inspectionId=${inspectionInformation.inspectionId}`,
    ],
    queryFn: () =>
      legacyApi.get(
        `/lead-inspection/find-by-inspection?inspectionId=${inspectionInformation.inspectionId}`
      ),
    select: (res: any) => {
      return res.data;
    },
    gcTime: 0,
    enabled: !!speciality,
  });

  useEffect(() => {
    if (leadInitialInfo) {
      console.log(leadInitialInfo);
      setLeadInfo(leadInitialInfo.find(lead => lead.post == 'lead'));
      console.log(leadInitialInfo.find(lead => lead.post == 'lead'));
      setDeputy(leadInitialInfo.find(lead => lead.post == 'deputy'));
    }
  }, [leadInitialInfo]);

  const { mutate } = useMutation({
    mutationFn: legacyApi.request,
  });

  const deleteInspector = index => {
    if (
      inspectorsList[index].id === undefined ||
      typeof inspectorsList[index].id != 'string'
    ) {
      setInspectorsList((list: any) => {
        let newList = [...list];
        newList = newList.filter((_, i) => {
          return i != index;
        });
        return newList;
      });
      return;
    }
    let oldList = inspectorsList;
    mutate(
      {
        entity: `/person-speciality/${inspectorsList[index].id}`,
        method: 'delete',
      } as any,
      {
        onError: () => {
          setInspectorsList(oldList);
        },
      }
    );
    setInspectorsList((list: any) => {
      let newList = [...list];
      newList = newList.filter((_, i) => {
        return i != index;
      });
      return newList;
    });
    return;
  };

  function clearPersonnelOfIndex(index) {
    setInspectorsList(listSkills => {
      let newList = [...listSkills];
      newList[index] = { ...listSkills[index] };
      newList[index].personNumber = null;
      newList[index].name = null;
      newList[index].family = null;
      return newList;
    });
  }

  return (
    <>
      {organizationStatus === 'success' &&
      specialityStatus === 'success' &&
      leadInitialInfoStatus == 'success' ? (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center" width="5%">
                    {' '}
                  </TableCell>
                  <TableCell align="center" width="15%">
                    نام تخصص
                  </TableCell>
                  <TableCell align="center" width="20%">
                    یگان/معاونت/سازمان/اداره
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
                <TableRow>
                  <TableCell align="center" width="5%">
                    {' '}
                  </TableCell>
                  <TableCell align="center" width="15%">
                    -------
                  </TableCell>
                  <TableCell>
                    <Autocomplete
                      fullWidth
                      options={orgs}
                      key={leadInfo?.id}
                      getOptionLabel={(option: any) => {
                        if (typeof option !== 'object') {
                          let result = orgs.find(
                            (op: any) => op?.id === option
                          );
                          return result?.name || '';
                        }
                        return option?.name || '';
                      }}
                      filterOptions={(ops, state) => {
                        //@ts-ignore
                        return ops?.filter(op =>
                          op?.name?.includes(state?.inputValue)
                        );
                      }}
                      value={leadInfo?.organizationUnitId}
                      onChange={(_: any, newValue: any) => {
                        setLeadInfo(oldValue => {
                          return {
                            id: oldValue?.id,
                            description: oldValue?.description,
                            organizationUnitId: newValue?.id ?? newValue,
                          };
                        });
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
                  <TableCell align="center" width="20%">
                    رئیس هیئت بازرسی
                  </TableCell>
                  <TableCell align="center">
                    {!!leadInfo?.personNumber ? (
                      <Grid>
                        <Grid>
                          <Typography variant="body2">{`${leadInfo?.name ?? ''} ${leadInfo?.family ?? ''} \n (${leadInfo?.personNumber})`}</Typography>
                        </Grid>
                        <Grid>
                          <IconButton
                            color="error"
                            onClick={() => {
                              setLeadInfo(oldValue => {
                                return {
                                  ...oldValue,
                                  personNumber: null,
                                  name: null,
                                  family: null,
                                };
                              });
                            }}
                          >
                            <Close />
                          </IconButton>
                        </Grid>
                      </Grid>
                    ) : (
                      <Button
                        disabled={leadInfo?.organizationUnitId == null}
                        onClick={() => {
                          // -1 for boss
                          setSelectedListIndex(-1);
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
                      value={leadInfo?.description}
                      onChange={(event: any) => {
                        setLeadInfo(oldvalue => {
                          return {
                            ...oldvalue,
                            description: event.target.value,
                          };
                        });
                      }}
                      multiline
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="center" width="5%">
                    {' '}
                  </TableCell>
                  <TableCell align="center" width="15%">
                    -------
                  </TableCell>
                  <TableCell>
                    <Autocomplete
                      fullWidth
                      options={orgs}
                      key={deputy?.id}
                      getOptionLabel={(option: any) => {
                        if (typeof option !== 'object') {
                          let result = orgs.find(
                            (op: any) => op?.id === option
                          );
                          return result?.name || '';
                        }
                        return option?.name || '';
                      }}
                      filterOptions={(ops, state) => {
                        //@ts-ignore
                        return ops?.filter(op =>
                          op?.name?.includes(state?.inputValue)
                        );
                      }}
                      value={deputy?.organizationUnitId}
                      onChange={(_: any, newValue: any) => {
                        setDeputy(oldValue => {
                          return {
                            id: oldValue?.id,
                            description: oldValue?.description,
                            organizationUnitId: newValue?.id ?? newValue,
                          };
                        });
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
                  <TableCell align="center" width="20%">
                    افسر هماهنگ کننده
                  </TableCell>
                  <TableCell align="center">
                    {!!deputy?.personNumber ? (
                      <Grid>
                        <Grid>
                          <Typography variant="body2">{`${deputy?.name ?? ''} ${deputy?.family ?? ''} \n (${deputy?.personNumber})`}</Typography>
                        </Grid>
                        <Grid>
                          <IconButton
                            color="error"
                            onClick={() => {
                              setDeputy(oldValue => {
                                return {
                                  ...oldValue,
                                  personNumber: null,
                                  name: null,
                                  family: null,
                                };
                              });
                            }}
                          >
                            <Close />
                          </IconButton>
                        </Grid>
                      </Grid>
                    ) : (
                      <Button
                        disabled={deputy?.organizationUnitId == null}
                        onClick={() => {
                          // -1 for lead
                          setSelectedListIndex(-2);
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
                      value={deputy?.description}
                      onChange={(event: any) => {
                        setDeputy(oldvalue => {
                          return {
                            ...oldvalue,
                            description: event.target.value,
                          };
                        });
                      }}
                      multiline
                    />
                  </TableCell>
                </TableRow>
                {inspectorsList.map((skill_data: any, index: any) => (
                  <TableRow key={index}>
                    <TableCell>
                      <IconButton
                        color="error"
                        onClick={() => {
                          deleteInspector(index);
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <Autocomplete
                        options={speciality}
                        getOptionLabel={(option: TOption) => {
                          if (typeof option !== 'object') {
                            let result = speciality.find(
                              (op: TOption) => op?.value === option
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
                        id={`autocomplete-skill-${index}`}
                        value={skill_data.commonBaseDataFieldId}
                        onChange={(_: any, newValue: any) => {
                          clearPersonnelOfIndex(index);
                          setInspectorsList(listSkills => {
                            let newList = [...listSkills];
                            newList[index].position =
                              `بازرس ${newValue?.title ?? newValue}`;
                            newList[index].commonBaseDataFieldId = newValue
                              ? newValue.value
                              : newValue;
                            newList[index].commonBaseDataFieldValue = newValue
                              ? newValue.title
                              : null;
                            return newList;
                          });
                        }}
                        disabled={
                          !!skill_data.assignStatus &&
                          skill_data.assignStatus !== 'pending'
                        }
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
                      <Autocomplete
                        fullWidth
                        options={orgs}
                        getOptionLabel={(option: any) => {
                          if (typeof option !== 'object') {
                            let result = orgs.find(
                              (op: any) => op?.id === option
                            );
                            return result?.name || '';
                          }
                          return option?.name || '';
                        }}
                        filterOptions={(ops, state) => {
                          //@ts-ignore
                          return ops?.filter(op =>
                            op?.name?.includes(state?.inputValue)
                          );
                        }}
                        id={`autocomplete-org-${index}`}
                        value={inspectorsList[index].organizationUnitId}
                        disabled={
                          !!skill_data.assignStatus &&
                          skill_data.assignStatus !== 'pending'
                        }
                        onChange={(_: any, newValue: any) => {
                          clearPersonnelOfIndex(index);
                          setInspectorsList(listSkills => {
                            let newList = [...listSkills];
                            newList[index] = { ...listSkills[index] };
                            newList[index].organizationUnitId = newValue
                              ? newValue.id
                              : newValue;
                            newList[index].organizationUnitName = newValue
                              ? newValue.name
                              : null;
                            return newList;
                          });
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
                      <TextField
                        hiddenLabel
                        size="small"
                        fullWidth
                        value={inspectorsList[index].position}
                        onChange={(event: any) => {
                          let newList = [...inspectorsList];
                          newList[index].position = event.target.value;
                          setInspectorsList(newList);
                        }}
                        disabled={
                          !!skill_data.assignStatus &&
                          skill_data.assignStatus !== 'pending'
                        }
                        multiline
                      />
                    </TableCell>
                    <TableCell align="center">
                      {!!inspectorsList[index].personNumber ? (
                        <Grid>
                          <Grid>
                            <Typography variant="body2">{`${inspectorsList[index].name ?? ''} ${inspectorsList[index].family ?? ''} \n (${inspectorsList[index].personNumber})`}</Typography>
                          </Grid>
                          <Grid>
                            <IconButton
                              color="error"
                              onClick={() => {
                                clearPersonnelOfIndex(index);
                              }}
                              disabled={
                                !!skill_data.assignStatus &&
                                skill_data.assignStatus !== 'pending'
                              }
                            >
                              <Close />
                            </IconButton>
                          </Grid>
                        </Grid>
                      ) : (
                        <Button
                          disabled={
                            inspectorsList[index].organizationUnitId == null
                          }
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
                        value={inspectorsList[index].requestDescription}
                        onChange={(event: any) => {
                          let newList = [...inspectorsList];
                          newList[index].requestDescription =
                            event.target.value;
                          setInspectorsList(newList);
                        }}
                        multiline
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
                  setInspectorsList((list: any) => {
                    return [
                      ...list,
                      {
                        id: new Date().getTime(),
                        orgSpecialityId: null,
                        organizationUnitId: null,
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
                          state: 'MOSHAKHASAT_ESTEHZARIYE',
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
                    if (leadInfo?.personNumber == null) {
                      snackbar(
                        'رئیس هیت بازرسی انتخاب نشده است.',
                        'error',
                        2000
                      );
                      return;
                    }
                    if (
                      inspectorsList.filter(i => i.organizationUnitId != null)
                        .length == 0
                    ) {
                      snackbar('لیست بازرسان نباید خالی باشد.', 'error', 2000);
                      return;
                    }
                    if (leadInfo?.id != null) {
                      mutate({
                        entity: `lead-inspection`,
                        method: 'put',
                        data: {
                          ...leadInfo,
                          inspectionId: inspectionInformation.inspectionId,
                        },
                      });
                    } else {
                      mutate({
                        entity: `lead-inspection`,
                        method: 'post',
                        data: {
                          ...leadInfo,
                          post: 'lead',
                          inspectionId: inspectionInformation.inspectionId,
                        },
                      });
                    }
                    if (deputy?.id != null) {
                      if (deputy?.personNumber == null) {
                        mutate({
                          entity: `lead-inspection/` + deputy?.id,
                          method: 'delete',
                        });
                      } else {
                        mutate({
                          entity: `lead-inspection`,
                          method: 'put',
                          data: {
                            ...deputy,
                            post: 'deputy',
                            inspectionId: inspectionInformation.inspectionId,
                          },
                        });
                      }
                    } else if (deputy?.personNumber) {
                      mutate({
                        entity: `lead-inspection`,
                        method: 'post',
                        data: {
                          ...deputy,
                          post: 'deputy',
                          inspectionId: inspectionInformation.inspectionId,
                        },
                      });
                    }
                    mutate(
                      {
                        entity: `/person-speciality`,
                        method: 'post',
                        data: inspectorsList
                          .filter(i => i.organizationUnitId != null)
                          .map(item => {
                            return {
                              id: typeof item.id == 'number' ? null : item.id,
                              commonBaseDataFieldId: item.commonBaseDataFieldId,
                              inspectionId: inspectionInformation.inspectionId,
                              organizationUnitId: item.organizationUnitId,
                              position: item.position,
                              requestDescription: item.requestDescription,
                              personNumber: item.personNumber,
                            };
                          }),
                      } as any,
                      {
                        onSuccess: (_: any) => {
                          mutate(
                            {
                              entity: `/information`,
                              method: 'put',
                              data: {
                                ...inspectionInformation,
                                state: 'SODOR_ESTEHZARIYE',
                              },
                            } as any,
                            {
                              onSuccess: (_: any) => {
                                refetchStep();
                              },
                              onError: () => {},
                            }
                          );
                        },
                        onError: () => {},
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
        </>
      ) : (
        <Skeleton height={300} />
      )}

      <Dialog
        fullWidth
        maxWidth={'lg'}
        open={openPersonnelList}
        onClose={handleClosePersonnelList}
      >
        {selectedSkillIndex == -1 && !!leadInfo?.organizationUnitId ? (
          <MatnaPersonnelPicker
            orgId={leadInfo?.organizationUnitId}
            onPersonnelSelect={row => {
              setLeadInfo(oldData => {
                return {
                  ...oldData,
                  personNumber: row?.personnelCode,
                  name: row?.firstName,
                  family: row?.lastName,
                };
              });
              setSelectedListIndex(null);
              handleClosePersonnelList();
            }}
          />
        ) : selectedSkillIndex == -2 && !!deputy?.organizationUnitId ? (
          <MatnaPersonnelPicker
            orgId={deputy?.organizationUnitId}
            onPersonnelSelect={row => {
              setDeputy(oldData => {
                return {
                  ...oldData,
                  personNumber: row?.personnelCode,
                  name: row?.firstName,
                  family: row?.lastName,
                };
              });
              setSelectedListIndex(null);
              handleClosePersonnelList();
            }}
          />
        ) : null}
        {selectedSkillIndex != null &&
        selectedSkillIndex >= 0 &&
        inspectorsList?.length > 0 ? (
          <MatnaPersonnelPicker
            orgId={inspectorsList[selectedSkillIndex].organizationUnitId}
            onPersonnelSelect={row => {
              let newList = [...inspectorsList];
              if (selectedSkillIndex != null) {
                newList[selectedSkillIndex].personNumber = row?.personnelCode;
                newList[selectedSkillIndex].name = row?.firstName;
                newList[selectedSkillIndex].family = row?.lastName;
              }
              setInspectorsList(newList);
              setSelectedListIndex(null);
              handleClosePersonnelList();
            }}
          />
        ) : (
          <div />
        )}
      </Dialog>
    </>
  );
};

export default StartInspectionStep2;
