import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { MatnaDataGrid } from '@/components/data-grid/MatnaDataGrid';
import TableActions from '@/components/table/TableActions';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import CreateNewItem from '@/components/button/CreateNewItem';
import ConfirmBox from '@/components/confirm-box/ConfirmBox';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { useSnackbar } from '@/hooks/useSnackbar';
import { type GridColDef } from '@mui/x-data-grid';
import {
  inspectionTypeNames,
  type ForcePlan,
  PLANNING_STATE,
  type states,
  stateTitles,
} from '../types';
import '../planning-aja/styles/planning-grid.css';
import { AddCircle, Book, Map } from '@mui/icons-material';
import { type AnnualPlanning } from '../types';
import { useApiMutation, useApiQuery } from '@/hooks/useApi';
import InspectionApis from '../api';
import { PAGINATION_DEFAULT_VALUE_OLD } from '@/types/api';

export default function PlanningForceGrid() {
  const snackbar = useSnackbar();
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<ForcePlan>();

  const { data: user_data } = useApiQuery<any>({
    url: InspectionApis.organizations.currentOrg,
  });

  const { data: forcesdata } = useApiQuery<any>({
    url: InspectionApis.annualPlanning.list,
    params: PAGINATION_DEFAULT_VALUE_OLD,
  });

  const { mutate: createCitiesMutate } = useApiMutation({
    url: InspectionApis.cities.list(selectedItem?.id),
    method: 'DELETE',
  });

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
  const myRenderCell = ({ row, type }: { row: any; type: string }) => {
    const inspectiontype = row?.inspectionType?.find(
      (item: any) => item.key === type
    )?.organizations;
    return (
      <Box height="100%" pt={1.5} pb={1.5} alignContent="center">
        <Typography
          textAlign="center"
          component="p"
          variant="subtitle2"
          borderBottom="dotted 1px lightgrey"
        >
          {inspectiontype?.[0] ? inspectiontype[0]?.number : '-'}
        </Typography>
        <Typography textAlign="center" component="p" variant="subtitle2">
          {inspectiontype?.[1] ? inspectiontype[1]?.number : '-'}
        </Typography>
      </Box>
    );
  };
  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'year', headerName: 'سال طرح ریزی', flex: 1, display: 'flex' },
      {
        field: 'number',
        headerName: 'تعداد کل نیرو',
        flex: 1,
        display: 'flex',
      },
      {
        field: 'niroo',
        headerName: 'عامل',
        cellClassName: () => 'nirooData',
        flex: 1,
        renderCell: ({ row }: { row: any }) => (
          <Box height="100%" pt={1.5} pb={1.5} alignContent="center">
            <Typography variant="subtitle2" borderBottom="dotted 1px lightgrey">
              {user_data?.data?.name}
              ({mySum(row, user_data?.data)})
            </Typography>
            <Typography
              variant="subtitle2"
              onClick={() => navigate(`AJAPlan/${row.id}`)}
              sx={{ cursor: 'pointer', color: 'navy' }}
            >
              آجا (
              {Object.keys(row?.INSPECTIONTYPES ?? {})?.reduce((sum, key) => {
                return (
                  sum +
                  (row?.INSPECTIONTYPES[key as keyof typeof inspectionTypeNames]
                    ?.ORGANIZATION?.['AJA']?.total ?? 0)
                );
              }, 0) ?? 0}
              )
              <IconButton color="primary" sx={{ padding: '0 5px' }}>
                <VisibilityOutlinedIcon fontSize="small" />
              </IconButton>
            </Typography>
          </Box>
        ),
      },
      {
        cellClassName: () => 'nirooData',
        field: 'BARNAMEI_SYSTEMATIC',
        headerName: 'برنامه‌ای (سیستماتیک)',
        flex: 1,
        renderCell: ({ row }: { row: ForcePlan }) =>
          myRenderCell({ row, type: 'BARNAMEI_SYSTEMATIC' }),
      },
      {
        cellClassName: () => 'nirooData',
        field: 'PEYGIRI_BAZRASI',
        headerName: 'پیگیری بازرسی',
        flex: 1,
        renderCell: ({ row }: { row: ForcePlan }) =>
          myRenderCell({ row, type: 'PEYGIRI_BAZRASI' }),
      },
      {
        cellClassName: () => 'nirooData',
        field: 'KHOD_ARZYABI',
        headerName: 'برنامه‌ای خود ارزیابی',
        flex: 1,
        renderCell: ({ row }: { row: ForcePlan }) =>
          myRenderCell({ row, type: 'KHOD_ARZYABI' }),
      },
      {
        cellClassName: () => 'nirooData',
        field: 'RASTY_AZMAIE',
        headerName: 'راستی آزمایی',
        flex: 1,
        renderCell: ({ row }: { row: ForcePlan }) =>
          myRenderCell({ row, type: 'RASTY_AZMAIE' }),
      },
      {
        cellClassName: () => 'nirooData',
        field: 'GHEIRE_MOTERAGHEBEH',
        headerName: 'غیر مترقبه (خاص)',
        flex: 1,
        renderCell: ({ row }: { row: ForcePlan }) =>
          myRenderCell({ row, type: 'GHEIRE_MOTERAGHEBEH' }),
      },
      {
        cellClassName: () => 'nirooData',
        field: 'NEZARAT_SETADI',
        headerName: 'نظارت ستادی',
        flex: 1,
        renderCell: ({ row }: { row: ForcePlan }) =>
          myRenderCell({ row, type: 'NEZARAT_SETADI' }),
      },
      {
        cellClassName: () => 'nirooData',
        field: 'ARZYABI_MOAVEN_BAZRASI',
        headerName: 'ارزیابی معاون بازرسی',
        flex: 1,
        renderCell: ({ row }: { row: ForcePlan }) =>
          myRenderCell({ row, type: 'ARZYABI_MOAVEN_BAZRASI' }),
      },
      {
        display: 'flex',
        field: 'status',
        headerName: 'وضعیت',
        flex: 1,
        renderCell: ({ row }: { row: any }) => (
          <Typography
            variant="subtitle2"
            color={
              row.status === PLANNING_STATE.IN_PROGRESS
                ? 'orange'
                : row.status === PLANNING_STATE.FINISHED
                  ? 'gray'
                  : row.status === PLANNING_STATE.PRE_PLANNING
                    ? 'green'
                    : 'teal'
            }
          >
            {(stateTitles as states)[row?.status]}
          </Typography>
        ),
      },
      {
        display: 'flex',
        headerName: 'عملیات',
        field: 'action___',
        flex: 1.5,
        headerAlign: 'center',
        align: 'center',
        renderCell: ({ row }: { row: AnnualPlanning }) => {
          return (
            <Box>
              <TableActions
                onEdit={
                  [
                    PLANNING_STATE.PRE_PLANNING,
                    PLANNING_STATE.PLANNING,
                    PLANNING_STATE.WAITING_FOR_APPROVE,
                  ].includes(row.status)
                    ? () => {
                        navigate(`${row.id}/${row.status}`);
                      }
                    : undefined
                }
                onManage={
                  row.status === PLANNING_STATE.PLANNING
                    ? () => {
                        navigate(
                          `/operation/planning/aja/units/${row.id}`
                        );
                      }
                    : undefined
                }
                // actions={[
                //   ...(row.status === PLANNING_STATE.IN_PROGRESS
                //     ? [
                //         {
                //           title: 'افزودن بازرسی بنا به دستور',
                //           icon: <AddCircle />,
                //           handler: () => {
                //             navigate(
                //               `/operation/planning/force/addCommandBasedInspection/${row.id}`
                //             );
                //           },
                //         },
                //       ]
                //     : []),
                // ]}
              />
              {row.status === PLANNING_STATE.PLANNING ? (
                <Tooltip title="گزارش یگان ها">
                  <IconButton
                    color="info"
                    onClick={() =>
                      navigate(`/inspection/Documents/planning/${row.year}`)
                    }
                  >
                    <Book />
                  </IconButton>
                </Tooltip>
              ) : null}
              {row.status === PLANNING_STATE.PLANNING ? (
                <Tooltip title="نقشه یگان‌ها">
                  <IconButton
                    color="info"
                    onClick={() =>
                      navigate(`/inspection/Documents/Map/${row.year}`)
                    }
                  >
                    <Map />
                  </IconButton>
                </Tooltip>
              ) : null}
            </Box>
          );
        },
      },
    ],
    [user_data, forcesdata]
  );

  return (
    <Box>
      <ConfirmBox
        open={!!selectedItem}
        handleClose={() => setSelectedItem(undefined)}
        handleSubmit={() => {
          createCitiesMutate(
            {
              entity: `cities/${selectedItem?.id}`,
              method: 'delete',
            } as any,
            {
              onSuccess: (res: any) => {
                if (res.message !== 'ok') {
                  snackbar('خطا در حذف طرح ریزی', 'error', 5000);
                } else {
                  snackbar(
                    `طرح ریزی ${selectedItem?.YEAR} با موفقیت حذف شد`,
                    'success',
                    5000
                  );
                }
                setSelectedItem(undefined);
              },
            }
          );
        }}
        title={`حذف طرح ریزی ${selectedItem?.YEAR}`}
        message={`آیا از حذف طرح ریزی ${selectedItem?.YEAR} اطمینان دارید؟`}
      />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        <CreateNewItem
          sx={null}
          url={null}
          icon={null}
          key={null}
          name="طرح ریزی"
        />
      </Box>
      <MatnaDataGrid
        getRowHeight={() => 'auto'}
        rows={forcesdata?.data}
        rowCount={forcesdata?.data?.count ?? 0}
        columns={columns}
        slotProps={{
          toolbar: {
            csvOptions: { disableToolbarButton: true },
          },
        }}
        disableDensitySelector
        disableColumnSelector
        disableRowSelectionOnClick
      />
    </Box>
  );
}
