import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { MatnaDataGrid } from '@/components/data-grid/MatnaDataGrid';
import { useMemo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import {
  PAGINATION_DEFAULT_VALUE_OLD,
  type PaginationQueryParamOld,
} from '@/types/api';
import CreateNewItem from '@/components/button/CreateNewItem';
import ConfirmBox from '@/components/confirm-box/ConfirmBox';
import { useSnackbar } from '@/hooks/useSnackbar';
import { type GridColDef, GridToolbar } from '@mui/x-data-grid';
import {
  organizationTypes,
  PLANNING_STATE,
  type states,
  stateTitles,
} from '../types';
import './styles/planning-grid.css';
import {
  Book,
  Inbox,
  KeyboardDoubleArrowRightOutlined,
  ManageHistoryOutlined,
  Map,
  CompareArrows,
} from '@mui/icons-material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import {
  type AnnualPlanning,
  OrganizationTypeEnum,
} from '@/modules/inspection-operation/types';
import { useApiMutation, useApiQuery } from '@/hooks/useApi';
import InspectionApis from '../api';
import { useLegacyApi } from 'hooks/useLegacyApi.ts';
import { useMutation } from '@tanstack/react-query';

export function PlanningGrid() {
  const snackbar = useSnackbar();
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<AnnualPlanning>();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const openConfirmModal = onConfirm => {
    setConfirmAction(() => onConfirm);
    setOpenConfirm(true);
  };

  const handleConfirm = () => {
    if (confirmAction) confirmAction();
    setOpenConfirm(false);
  };

  const legacyApi = useLegacyApi();

  const { mutate } = useMutation({
    mutationFn: legacyApi.request,
  });

  const { mutate: createInspectionMutate } = useApiMutation({
    url: InspectionApis.cities.list(selectedItem?.id),
    method: 'DELETE',
  });

  const myRenderCell = ({
    row,
    type,
  }: {
    row: AnnualPlanning;
    type: string;
  }) => {
    const inspectiontype = row.inspectionType?.find(item => item.key === type);
    return (
      <Box pt={1.5} pb={1.5}>
        {Object.keys(OrganizationTypeEnum).map(
          (organization, organizationKey) => {
            const dataOfCell = inspectiontype?.organizations?.find(
              item => item.key === organization
            );
            return (
              <Typography
                textAlign="center"
                component="p"
                variant="subtitle2"
                borderBottom={
                  organizationKey != 4 ? 'dotted 1px lightgrey' : 'none'
                }
                key={organizationKey}
              >
                {dataOfCell ? dataOfCell.number : '-'}
              </Typography>
            );
          }
        )}
      </Box>
    );
  };
  const mySum = (row: AnnualPlanning, selectedOrgan: string) => {
    let sum = 0;
    row.inspectionType.forEach(inspection => {
      sum =
        sum +
        (inspection?.organizations?.find(item => item.key === selectedOrgan)
          ?.number ?? 0);
    });
    return sum;
  };
  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'year',
        headerName: 'سال طرح ریزی',
        flex: 1,
        display: 'flex',
        disableColumnMenu: true,
      },
      {
        field: 'number',
        headerName: 'تعداد کل (ارتش)',
        flex: 1,
        display: 'flex',
        disableColumnMenu: true,
      },
      {
        field: 'niroo',
        headerName: 'نیرو',
        cellClassName: () => 'nirooData',
        flex: 1.8,
        renderCell: ({ row }: { row: AnnualPlanning }) => (
          <Box pt={1.5} pb={1.5}>
            {Object.keys(organizationTypes).map((ORIndex, ORKey) => (
              <Typography
                key={ORIndex}
                variant="subtitle2"
                borderBottom={ORKey !== 4 ? 'dotted 1px lightgrey' : 'none'}
              >
                {organizationTypes[ORIndex as keyof typeof organizationTypes]} (
                {mySum(row, ORIndex)})
              </Typography>
            ))}
          </Box>
        ),
        disableColumnMenu: true,
      },
      {
        cellClassName: () => 'nirooData',
        field: 'BARNAMEI_SYSTEMATIC',
        headerName: 'برنامه‌ای (سیستماتیک)',
        flex: 1,
        renderCell: ({ row }: { row: AnnualPlanning }) =>
          myRenderCell({ row, type: 'BARNAMEI_SYSTEMATIC' }),
        disableColumnMenu: true,
      },
      {
        cellClassName: () => 'nirooData',
        field: 'PEYGIRI_BAZRASI',
        headerName: 'پیگیری بازرسی',
        flex: 1,
        renderCell: ({ row }: { row: AnnualPlanning }) =>
          myRenderCell({ row, type: 'PEYGIRI_BAZRASI' }),
        disableColumnMenu: true,
      },
      {
        cellClassName: () => 'nirooData',
        field: 'KHOD_ARZYABI',
        headerName: 'برنامه‌ای خود ارزیابی',
        flex: 1,
        renderCell: ({ row }: { row: AnnualPlanning }) =>
          myRenderCell({ row, type: 'KHOD_ARZYABI' }),
        disableColumnMenu: true,
      },
      {
        cellClassName: () => 'nirooData',
        field: 'RASTY_AZMAIE',
        headerName: 'راستی آزمایی',
        flex: 1,
        renderCell: ({ row }: { row: AnnualPlanning }) =>
          myRenderCell({ row, type: 'RASTY_AZMAIE' }),
        disableColumnMenu: true,
      },
      {
        cellClassName: () => 'nirooData',
        field: 'GHEIRE_MOTERAGHEBEH',
        headerName: 'غیر مترقبه (خاص)',
        flex: 1,
        renderCell: ({ row }: { row: AnnualPlanning }) =>
          myRenderCell({ row, type: 'GHEIRE_MOTERAGHEBEH' }),
        disableColumnMenu: true,
      },
      {
        cellClassName: () => 'nirooData',
        field: 'NEZARAT_SETADI',
        headerName: 'نظارت ستادی',
        flex: 1,
        renderCell: ({ row }: { row: AnnualPlanning }) =>
          myRenderCell({ row, type: 'NEZARAT_SETADI' }),
        disableColumnMenu: true,
      },
      {
        cellClassName: () => 'nirooData',
        field: 'ARZYABI_MOAVEN_BAZRASI',
        headerName: 'ارزیابی معاون بازرسی',
        flex: 1,
        renderCell: ({ row }: { row: AnnualPlanning }) =>
          myRenderCell({ row, type: 'ARZYABI_MOAVEN_BAZRASI' }),
        disableColumnMenu: true,
      },
      {
        cellClassName: () => 'nirooData',
        field: 'SAYER',
        headerName: 'سایر',
        flex: 1,
        renderCell: ({ row }: { row: AnnualPlanning }) =>
          myRenderCell({ row, type: 'SAYER' }),
        disableColumnMenu: true,
      },
      {
        field: 'percent',
        headerName: 'گزارش طرح ریزی نیروها',
        flex: 1.5, // display: "flex",
        align: 'center',
        cellClassName: () => 'nirooData',

        renderCell: ({ row }: { row: AnnualPlanning }) => (
          <Box pt={1.5} pb={1.5}>
            {['نزاجا', 'نداجا', 'نهاجا', 'نپاجا', 'ستاد آجا'].map(
              (seasonTitle, SeasonKey) => (
                <Typography
                  key={SeasonKey}
                  variant="subtitle2"
                  borderBottom={
                    SeasonKey != 4 ? 'dotted 1px lightgrey' : 'none'
                  }
                  sx={{
                    cursor:
                      row?.status === PLANNING_STATE.PRE_PLANNING
                        ? 'default'
                        : 'pointer',
                  }}
                  onClick={
                    row?.status === PLANNING_STATE.PRE_PLANNING
                      ? undefined
                      : () => navigate(`force-plan/${row.id}`)
                  }
                  color="primary"
                >
                  {row?.status === PLANNING_STATE.PRE_PLANNING
                    ? '-'
                    : seasonTitle}

                  {row?.status !== PLANNING_STATE.PRE_PLANNING && (
                    <IconButton color="primary" sx={{ padding: '0 5px' }}>
                      <VisibilityOutlinedIcon sx={{ fontSize: '0.7em' }} />
                    </IconButton>
                  )}
                </Typography>
              )
            )}
          </Box>
        ),
        disableColumnMenu: true,
      },

      {
        display: 'flex',
        field: 'status',
        headerName: 'وضعیت',
        flex: 1.5,
        renderCell: ({ row }: { row: AnnualPlanning }) => (
          <Typography
            variant="subtitle2"
            color={
              row.status === PLANNING_STATE.PRE_PLANNING
                ? 'green'
                : row.status === PLANNING_STATE.WAITING_FOR_APPROVE
                  ? 'darkgoldenrod'
                  : row.status === PLANNING_STATE.PLANNING
                    ? 'teal'
                    : row.status === PLANNING_STATE.IN_CARTABLE
                      ? 'orange'
                      : row.status === PLANNING_STATE.IN_PROGRESS
                        ? 'darkred'
                        : row.status === PLANNING_STATE.FINISHED
                          ? 'gray'
                          : 'darksalmon'
            }
          >
            {(stateTitles as states)[row.status]}
          </Typography>
        ),
        disableColumnMenu: true,
      },
      {
        display: 'flex',
        headerName: 'عملیات',
        field: 'action___',
        flex: 1.5,
        headerAlign: 'center',
        align: 'center',
        renderCell: ({ row }: { row: AnnualPlanning }) => (
          <Box>
            {row.status == PLANNING_STATE.PRE_PLANNING && (
              <Tooltip title="ادامه" arrow>
                <IconButton
                  onClick={() => {
                    navigate(`${row.id}/pre-planning`);
                  }}
                  color="success"
                >
                  <ManageHistoryOutlined />
                </IconButton>
              </Tooltip>
            )}
            {row.status == PLANNING_STATE.WAITING_FOR_APPROVE && (
              <>
                <Tooltip title="بازگشت به مرحله قبل" arrow>
                  <IconButton
                    color="error"
                    onClick={() =>
                      openConfirmModal(() =>
                        mutate(
                          {
                            entity: `/annual-planning/change-status-to-previous/${row?.id}`,
                            method: 'put',
                          },
                          {
                            onSuccess: () => {
                              navigate(
                                `/operation/planning/aja/${row?.id}/pre-planning`
                              );
                            },
                          }
                        )
                      )
                    }
                  >
                    <KeyboardDoubleArrowRightOutlined />
                  </IconButton>
                </Tooltip>

                <Tooltip title="ادامه" arrow>
                  <IconButton
                    onClick={() => {
                      navigate(
                        `/operation/planning/aja/${row?.id}/WAITING_FOR_APPROVE`
                      );
                    }}
                    color="success"
                  >
                    <ManageHistoryOutlined />
                  </IconButton>
                </Tooltip>
              </>
            )}
            {row.status == PLANNING_STATE.PLANNING && (
              <>
                <Tooltip title="بازگشت به مرحله قبل" arrow>
                  <IconButton
                    color="error"
                    onClick={() =>
                      openConfirmModal(() =>
                        mutate(
                          {
                            entity: `/annual-planning/change-status-to-previous/${row?.id}`,
                            method: 'put',
                          },
                          {
                            onSuccess: () => {
                              navigate(
                                `/operation/planning/aja/${row?.id}/WAITING_FOR_APPROVE`
                              );
                            },
                          }
                        )
                      )
                    }
                  >
                    <KeyboardDoubleArrowRightOutlined />
                  </IconButton>
                </Tooltip>

                <Tooltip title="ادامه" arrow>
                  <IconButton
                    onClick={() => {
                      navigate(`/operation/planning/aja/${row?.id}/PLANNING`);
                    }}
                    color="success"
                  >
                    <ManageHistoryOutlined />
                  </IconButton>
                </Tooltip>
                <Tooltip title="گزارش یگان ها">
                  <NavLink to={`/operation/planning/aja/unit-report/${row.id}`}>
                    <IconButton color="info">
                      <Book />
                    </IconButton>
                  </NavLink>
                </Tooltip>
                <Tooltip title="نقشه یگان‌ها">
                  <IconButton
                    color="info"
                    onClick={() =>
                      navigate(`/operation/planning/aja/map/${row.year}`)
                    }
                  >
                    <Map />
                  </IconButton>
                </Tooltip>
              </>
            )}
            {row.status == PLANNING_STATE.WAITING_FOR_APPROVE_DETAILS && (
              <>
                <Tooltip title="بازگشت به مرحله قبل" arrow>
                  <IconButton
                    color="error"
                    onClick={() =>
                      openConfirmModal(() =>
                        mutate(
                          {
                            entity: `/annual-planning/change-status-to-previous/${row?.id}`,
                            method: 'put',
                          },
                          {
                            onSuccess: () => {
                              navigate(
                                `/operation/planning/aja/${row?.id}/PLANNING`
                              );
                            },
                          }
                        )
                      )
                    }
                  >
                    <KeyboardDoubleArrowRightOutlined />
                  </IconButton>
                </Tooltip>

                <Tooltip title="گزارش یگان ها">
                  <NavLink to={`/operation/planning/aja/unit-report/${row.id}`}>
                    <IconButton color="info">
                      <Book />
                    </IconButton>
                  </NavLink>
                </Tooltip>
              </>
            )}
            {row.status == PLANNING_STATE.IN_PROGRESS && (
              <>
                <Tooltip title="مشاهده کارتابل">
                  <IconButton
                    color="info"
                    onClick={() => navigate(`/cartable`)}
                  >
                    <Inbox />
                  </IconButton>
                </Tooltip>

                <Tooltip title="گزارش یگان ها">
                  <NavLink to={`/operation/planning/aja/unit-report/${row.id}`}>
                    <IconButton color="info">
                      <Book />
                    </IconButton>
                  </NavLink>
                </Tooltip>
              </>
            )}
            {row.status == PLANNING_STATE.IN_CARTABLE && (
              <>
                <Tooltip title="بازگشت به مرحله قبل" arrow>
                  <IconButton
                    color="error"
                    onClick={() =>
                      openConfirmModal(() =>
                        mutate(
                          {
                            entity: `/annual-planning/change-status-to-previous/${row?.id}`,
                            method: 'put',
                          },
                          {
                            onSuccess: () => {
                              refetch();
                            },
                          }
                        )
                      )
                    }
                  >
                    <KeyboardDoubleArrowRightOutlined />
                  </IconButton>
                </Tooltip>

                <Tooltip title="مشاهده کارتابل">
                  <IconButton
                    color="info"
                    onClick={() => navigate(`/cartable`)}
                  >
                    <Inbox />
                  </IconButton>
                </Tooltip>

                <Tooltip title="گزارش یگان ها">
                  <NavLink to={`/operation/planning/aja/unit-report/${row.id}`}>
                    <IconButton color="info">
                      <Book />
                    </IconButton>
                  </NavLink>
                </Tooltip>
              </>
            )}
            {row.status == PLANNING_STATE.FINISHED && (
              <>
                <Tooltip title="گزارش یگان ها">
                  <NavLink to={`/operation/planning/aja/unit-report/${row.id}`}>
                    <IconButton color="info">
                      <Book />
                    </IconButton>
                  </NavLink>
                </Tooltip>
              </>
            )}
            <Tooltip title="لیست تداخلات" arrow>
              <NavLink to={`/operation/planning/conflicts/${row.year}`}>
                <IconButton color="info">
                  <CompareArrows />
                </IconButton>
              </NavLink>
            </Tooltip>
          </Box>
        ),
        disableColumnMenu: true,
      },
    ],
    []
  );

  const {
    data: response,
    isLoading,
    refetch,
  } = useApiQuery<PaginationQueryParamOld<AnnualPlanning[]>>({
    url: InspectionApis.annualPlanning.list,
    params: PAGINATION_DEFAULT_VALUE_OLD,
  });

  const data = response?.data?.filter(item => item.id !== '0');

  return (
    <Grid container justifyContent={'center'}>
      <ConfirmBox
        open={!!selectedItem}
        handleClose={() => setSelectedItem(undefined)}
        handleSubmit={() => {
          createInspectionMutate({
            onSuccess: (res: any) => {
              if (res.message !== 'ok') {
                snackbar('خطا در حذف طرح ریزی', 'error', 5000);
              } else {
                snackbar(
                  `طرح ریزی ${selectedItem?.year} با موفقیت حذف شد`,
                  'success',
                  5000
                );
              }
              setSelectedItem(undefined);
            },
          });
        }}
        title={`حذف طرح ریزی ${selectedItem?.year}`}
        message={`آیا از حذف طرح ریزی ${selectedItem?.year} اطمینان دارید؟`}
      />
      <Grid size={{ md: 11 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <CreateNewItem
            name="طرح ریزی"
            sx={null}
            url={null}
            icon={null}
            key={null}
          />
        </Box>
      </Grid>

      <Grid size={{ md: 11 }}>
        <MatnaDataGrid
          getRowHeight={() => 'auto'}
          rows={data}
          rowCount={3}
          columns={columns}
          slots={{ toolbar: GridToolbar }}
          initialState={{
            sorting: {
              sortModel: [{ field: 'year', sort: 'desc' }],
            },
          }}
          slotProps={{
            toolbar: {
              csvOptions: { disableToolbarButton: true },
              printOptions: {
                fields: [
                  'year',
                  'number',
                  'BARNAMEI_SYSTEMATIC',
                  'PEYGIRI_BAZRASI',
                  'KHOD_ARZYABI',
                  'RASTY_AZMAIE',
                  'GHEIRE_MOTERAGHEBEH',
                  'NEZARAT_SETADI',
                  'ARZYABI_MOAVEN_BAZRASI',
                  'BAZRASI_BANA_BE_DASTOOR',
                  'SAYER',
                  'status',
                ],
                hideFooter: true,
                hideToolbar: true,
              },
            },
          }}
          paginationModel={{
            page: response?.meta?.pagination?.currentPage || 1,
            pageSize: response?.meta?.pagination?.pageSize || 10,
          }}
          loading={isLoading}
          disableDensitySelector
          disableColumnSelector
          disableRowSelectionOnClick
          disableColumnSorting
        />
      </Grid>
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>تأیید عملیات</DialogTitle>

        <DialogContent>آیا از بازگشت به مرحله قبل اطمینان دارید؟</DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>انصراف</Button>
          <Button onClick={handleConfirm} color="error" variant="contained">
            تأیید
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
