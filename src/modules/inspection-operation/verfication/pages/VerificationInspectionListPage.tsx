import {
  Box,
  Chip,
  Fab,
  Grid,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import PaginatedMatnaDataGrid from '@/components/data-grid/PaginatedMatnaDataGrid.tsx';
import {
  Assessment,
  ChangeCircle,
  Draw,
  EditNote,
  PlayArrowOutlined,
  Tune,
} from '@mui/icons-material';
import { useLegacyApi } from 'hooks/useLegacyApi.ts';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'hooks/useSnackbar.ts';

const SEASON_LABELS: Record<string, string> = {
  FIRST_SEASON: 'سه ماهه اول',
  SECOUND_SEASON: 'سه ماهه دوم',
  THIRD_SEASON: 'سه ماهه سوم',
  FOURTH_SEASON: 'سه ماهه چهارم',
};

const getSeasonLabel = (season: string) =>
  SEASON_LABELS[season] || SEASON_LABELS[season?.toUpperCase()] || season || '';

const VerificationInspectionListPage = () => {
  const navigate = useNavigate();
  const legacyApi = useLegacyApi();
  const snackbar = useSnackbar();
  const { mutate } = useMutation({
    mutationFn: legacyApi.request,
  });

  const [year, setYear] = useState<number>(1404);

  const {
    data: allocationVerification,
    status: allocationVerification_status,
    refetch: allocationVerification_refetch,
  } = useQuery<any, any, any>({
    queryKey: [
      `/inspection/allocate-verification-to-self-review?pageSize=10&currentPage=1&year=${1404}`,
    ],
    queryFn: () =>
      legacyApi.get(
        `/inspection/allocate-verification-to-self-review?pageSize=10&currentPage=1&year=${1404}`
      ),
    select: (res: any) => res.data,
  } as any);

  const columns_text = useMemo(
    () => [
      {
        headerName: 'یگان',
        field: 'organizationUnitName',
        flex: 1,
      },
      {
        headerName: 'سه‌ماهه',
        field: 'season',
        flex: 1,
        renderCell: params => getSeasonLabel(params.row.season),
      },
      {
        headerName: 'نیرو',
        field: 'forceOrganizationUnitName',
        flex: 0.5,
      },
      {
        headerName: 'نوع بازرسی',
        field: 'annualPlanInspectionName',
        flex: 1,
      },
      // {
      //   headerName: 'ماهیت',
      //   field: 'orgType',
      //   flex: 1,
      // },
      {
        headerName: 'وضعیت',
        field: 'status',
        flex: 1,
        renderCell: ({ row }: { row: any }) => {
          switch (row.status) {
            case 'not executed':
              return <Chip label="پیکربندی" sx={{ bgcolor: 'skyblue' }} />;
            case 'initialized':
              return <Chip label="در انتظار اجرا" color="info" />;
            case 'on the execution':
              return <Chip label="در حال اجرا" sx={{ bgcolor: 'salmon' }} />;
            case 'executed':
              return <Chip label="پایان یافته" />;
          }
        },
      },
      {
        headerName: 'عملیات',
        field: 'action',
        flex: 1,
        renderCell: ({ row }: { row: any }) => {
          // return (
          //   <Button
          //     variant="contained"
          //     color="info"
          //     onClick={() =>
          //       navigate(
          //         '/operation/verification/start-configuration/' + row.id
          //       )
          //     }
          //   >
          //     مشاهده
          //   </Button>
          // );

          return (
            <Box>
              {row?.status === 'not executed' ? (
                <Box>
                  <Tooltip title="پیکربندی" sx={{ mr: 1 }}>
                    <Fab
                      color="primary"
                      size="small"
                      onClick={() =>
                        navigate(
                          `/operation/verification/start-configuration/${row.id}`,
                          { state: { row } }
                        )
                      }
                    >
                      <Tune />
                    </Fab>
                  </Tooltip>
                  {/*<Tooltip title="جزئیات خودارزیابی" sx={{ mr: 1 }}>*/}
                  {/*  <Fab*/}
                  {/*    color="info"*/}
                  {/*    size="small"*/}
                  {/*    onClick={() => {*/}
                  {/*      setSelectedId(row?.id);*/}
                  {/*      setWhoFlag(true);*/}
                  {/*    }}*/}
                  {/*  >*/}
                  {/*    <Book />*/}
                  {/*  </Fab>*/}
                  {/*</Tooltip>*/}
                  {/* <Tooltip title="شروع راستی آزمایی">
                    <Fab disabled size="small" color="secondary">
                      <PlayArrowOutlined />
                    </Fab>
                  </Tooltip> */}
                </Box>
              ) : null}
              {row?.status === 'initialized' ? (
                <Box>
                  <Tooltip title="ویرایش مجدد" sx={{ mr: 1 }}>
                    <Fab
                      size="small"
                      color="info"
                      onClick={() => {
                        mutate(
                          {
                            entity: `/inspection`,
                            method: 'put',
                            data: { ...row, status: 'not executed' },
                          } as any,
                          {
                            onSuccess: (res: any) => {
                              snackbar(
                                'تغیر وضعیت به پیکربندی',
                                'success',
                                5000
                              );
                            },
                            onError: () => {},
                          }
                        );
                      }}
                    >
                      <Draw />
                    </Fab>
                  </Tooltip>
                  <Tooltip title="شروع راستی آزمایی">
                    <Fab
                      size="small"
                      color="secondary"
                      onClick={() => {
                        mutate(
                          {
                            entity: `/inspection`,
                            method: 'put',
                            data: { ...row, status: 'on the execution' },
                          } as any,
                          {
                            onSuccess: (res: any) => {
                              snackbar(
                                'تغیر وضعیت به در حال اجرا!',
                                'success',
                                5000
                              );
                            },
                            onError: () => {},
                          }
                        );
                      }}
                    >
                      <PlayArrowOutlined />
                    </Fab>
                  </Tooltip>
                </Box>
              ) : null}

              {row?.status === 'on the execution' ? (
                <Box>
                  <Tooltip title="بررسی و پایان روند اجرا" sx={{ mr: 1 }}>
                    <Fab
                      size="small"
                      color="warning"
                      onClick={() => {
                        mutate(
                          {
                            entity: `individual-verification-scores/submit-all/${row.id}`,
                            method: 'post',
                          } as any,
                          {
                            onSuccess: (res: any) => {
                              snackbar('بررسی تایید میشود', 'success', 5000);
                            },
                            onError: () => {},
                          }
                        );
                      }}
                    >
                      <ChangeCircle />
                    </Fab>
                  </Tooltip>
                  <Tooltip title="ثبت نمرات بازرس ها" sx={{ mr: 1 }}>
                    <Fab
                      size="small"
                      color="default"
                      onClick={() =>
                        navigate(
                          `/operation/verification/under-execution/inspectors/${row.id}`
                        )
                      }
                    >
                      <Assessment />
                    </Fab>
                  </Tooltip>
                  {/* <Tooltip title="ثبت گزارشات" sx={{ mr: 1 }}>
                    <Fab size="small" color="primary"
                    onClick={() => navigate(`/inspection/RASTI_AZMAIE/UNDER_EXECUTION/Documents/${row.id}`)}
                    >
                      <EditNote />
                    </Fab>
                  </Tooltip> */}
                  {/* <Tooltip title="جزئیات">
                    <Fab size="small" color="info"
                    onClick={() => navigate(`/inspection/RASTI_AZMAIE/UNDER_EXECUTION/${row.id}`)}
                    >
                      <Book fontSize="small" />
                    </Fab>
                  </Tooltip> */}
                </Box>
              ) : null}
              {row?.status === 'executed' ? (
                <Box>
                  <Tooltip title="ثبت نمرات" sx={{ mr: 1 }}>
                    <Fab
                      size="small"
                      color="default"
                      onClick={() =>
                        navigate(
                          `/operation/verification/under-execution/inspectors/${row.id}`
                        )
                      }
                    >
                      <Assessment />
                    </Fab>
                  </Tooltip>
                  <Tooltip title="مشاهده گزارشات" sx={{ mr: 1 }}>
                    <Fab
                      size="small"
                      color="primary"
                      onClick={() =>
                        navigate(
                          `/operation/verification/under-execution/documents/${row.id}`
                        )
                      }
                    >
                      <EditNote />
                    </Fab>
                  </Tooltip>
                </Box>
              ) : null}

              {/* <Button
                variant="contained"
                color="success"
                onClick={() => navigate(`/inspection/RASTI_AZMAIE/START_EXECUTION/${row.id}`, { state: { row } })}
              ></Button> */}
            </Box>
          );
        },
      },
    ],
    []
  );

  const handleYearChange = event => {
    if (/^\d{0,4}/.test(event.target.value)) {
      setYear(event.target.value);
    }
  };

  const isYearInvalid =
    year && (!/^\d{4}$/.test(String(year)) || Number(year) <= 1350);

  return (
    <Box>
      <Box sx={{ margin: '20px' }}>
        <Grid container spacing={2}>
          <Grid
            size={{ xs: 10 }}
            sx={{ display: 'flex', justifyContent: 'flex-start' }}
          >
            <Typography fontWeight={700} variant="h5">
              بازرسی راستی آزمایی سال {year}
            </Typography>
          </Grid>
          <Grid
            size={{ xs: 2 }}
            sx={{ display: 'flex', justifyContent: 'flex-end' }}
          >
            <TextField
              label="سال شمسی"
              variant="outlined"
              value={year}
              onChange={handleYearChange}
              inputProps={{
                maxLength: 4,
              }}
              error={Boolean(isYearInvalid)}
              helperText={
                isYearInvalid
                  ? 'سال باید عددی ۴ رقمی و بزرگتر از ۱۳۵۰ باشد'
                  : ' '
              }
              sx={{ width: '20ch' }}
            />
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ width: '100%' }}>
        {year && /^\d{4}$/.test(String(year)) && year > 1350 && (
          <PaginatedMatnaDataGrid
            url={'/inspection/find-inspection-by-year-and-inspection-type'}
            params={{ year: year, inspectionType: 'RASTY_AZMAIE' }}
            columns={columns_text}
            numberOfRowsInPage={10}
          />
        )}
      </Box>
    </Box>
  );
};

export default VerificationInspectionListPage;
