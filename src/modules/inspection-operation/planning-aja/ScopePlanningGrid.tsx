import {
  Box,
  Button,
  Chip,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { MatnaDataGrid } from '@/components/data-grid/MatnaDataGrid';
import TableActions from 'components/table/TableActions';
import { useEffect, useMemo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import ConfirmBox from '@/components/confirm-box/ConfirmBox';
import { useSnackbar } from 'hooks/useSnackbar';
import type { GridColDef } from '@mui/x-data-grid';
import { PLANNING_STATE, type states, stateTitles } from '../types';
import { AddCircle, Book, CompareArrows, Edit } from '@mui/icons-material';
import InspectionApis from '../api';
import { useApiQuery } from '@/hooks/useApi';
import { useLegacyApi } from '@/hooks/useLegacyApi';
import { SeasonOptions } from 'modules/inspection-operation/planning-aja/types.ts';

/* -------------------- components -------------------- */

const SeasonNumbers = ({ seasons }: { seasons?: any[] }) => (
  <Box pt={1.5} pb={1.5}>
    {SeasonOptions.map((season, index) => (
      <Typography
        key={season.value}
        textAlign="center"
        variant="subtitle2"
        borderBottom={index !== 3 ? 'dotted 1px lightgrey' : 'none'}
      >
        {seasons?.find(s => s.season === season.value)?.number ?? '-'}
      </Typography>
    ))}
  </Box>
);

/* -------------------- main component -------------------- */

export default function ScopePlanningGrid() {
  const snackbar = useSnackbar();
  const navigate = useNavigate();
  const legacyApi = useLegacyApi();
  const [selectedItem, setSelectedItem] = useState<any>();

  const { mutate } = useMutation({
    mutationFn: legacyApi.request,
  });

  const { data: scope, refetch: scopeRefetch } = useApiQuery({
    url: InspectionApis.scopePlanning.list,
    select: (res: any) => res.data,
  });

  /* -------------------- rows -------------------- */

  const rows = useMemo(() => {
    if (!scope) return [];
    return scope.map((item: any, index: number) => ({
      id: index,
      year: item.year,
      status: item.status,
      percent: item.percent ?? 0,
      organizations: item.organizations,
    }));
  }, [scope]);

  /* -------------------- actions -------------------- */

  const handleAddNewYear = () => {
    mutate(
      {
        entity: `/expert-supervision/add-year/type/scope`,
        method: 'POST',
      } as any,
      {
        onSuccess: scopeRefetch,
        onError: () => {
          snackbar(
            'برای این امر ابتدا نیاز است هیچکدام از سال‌های قبلی در مرحله طرح‌ریزی نباشند',
            'error',
            5000
          );
        },
      }
    );
  };

  /* -------------------- columns -------------------- */

  const seasonColumn: GridColDef = {
    field: 'SEASON',
    headerName: 'بازه زمانی',
    display: 'flex',
    flex: 1,
    align: 'center',
    headerAlign: 'center',
    renderCell: () => (
      <Box pt={1.5} pb={1.5}>
        {SeasonOptions.map((season, index) => (
          <Typography
            key={index}
            variant="subtitle2"
            borderBottom={index !== 3 ? 'dotted 1px lightgrey' : 'none'}
          >
            {season.label}
          </Typography>
        ))}
      </Box>
    ),
  };

  const scopeColumns: GridColDef[] = useMemo(() => {
    if (!scope?.length) return [];

    return scope[0].organizations.map((org: any) => ({
      field: org.key,
      headerName: org.organizationName,
      display: 'flex',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }) => {
        const targetOrg = row.organizations.find((o: any) => o.key === org.key);

        return (
          <Box
            sx={{ cursor: 'pointer', color: 'navy' }}
            onClick={() => navigate(`${row.id}/${org.key}`)}
          >
            <SeasonNumbers seasons={targetOrg?.season} />
          </Box>
        );
      },
    }));
  }, [scope, navigate]);

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'year',
        headerName: 'سال طرح‌ریزی',
        display: 'flex',
        flex: 1,
        align: 'center',
        headerAlign: 'center',
      },
      seasonColumn,
      ...scopeColumns,
      {
        field: 'status',
        headerName: 'وضعیت',
        display: 'flex',
        flex: 1.5,
        align: 'center',
        headerAlign: 'center',
        renderCell: params => {
          switch (params.row.status) {
            case PLANNING_STATE.PRE_PLANNING:
              return <Chip label={stateTitles.PRE_PLANNING} />;
            case PLANNING_STATE.WAITING_FOR_APPROVE:
              return <Chip label={stateTitles.WAITING_FOR_APPROVE} />;
            case PLANNING_STATE.PLANNING:
              return <Chip label={stateTitles.PLANNING} color="success" />;
            case PLANNING_STATE.WAITING_FOR_APPROVE_DETAILS:
              return <Chip label={stateTitles.WAITING_FOR_APPROVE_DETAILS} />;
            case PLANNING_STATE.IN_PROGRESS:
              return <Chip label={stateTitles.IN_PROGRESS} />;
            case PLANNING_STATE.FINISHED:
              return <Chip label={stateTitles.FINISHED} color="error" />;
            default:
              return <Chip label="طرح ریزی نشده" color="warning" />;
          }
        },
      },
      {
        field: 'action',
        headerName: '',
        display: 'flex',
        flex: 1,
        align: 'center',
        headerAlign: 'center',
        renderCell: ({ row }) => {
          return (
            <>
              <Tooltip title="مشاهده گزارش">
                <IconButton
                  onClick={() => {
                    navigate(`/operation/planning/scope/report/${row.year}`);
                  }}
                >
                  <Book color="info" />
                </IconButton>
              </Tooltip>
              <Tooltip title="لیست تداخلات" arrow>
                <NavLink to={`/operation/planning/conflicts/${row.year}`}>
                  <IconButton color="info">
                    <CompareArrows />
                  </IconButton>
                </NavLink>
              </Tooltip>
              <TableActions
                onChangeState={() => {
                  mutate(
                    {
                      entity: `expert-supervision/edit-state/${row.status}/${row.year}/scope`,
                      method: 'PUT',
                    } as any,
                    {
                      onSuccess: () => {
                        snackbar('وضعیت با موفقیت تغییر کرد', 'success', 5000);
                        scopeRefetch();
                      },
                      onError() {
                        snackbar('خطا در تغییر وضعیت', 'error', 5000);
                      },
                    }
                  );
                }}
              />
            </>
          );
        },
      },
    ],
    [scopeColumns]
  );

  /* -------------------- render -------------------- */

  return (
    <Grid container>
      <ConfirmBox
        open={!!selectedItem}
        handleClose={() => setSelectedItem(undefined)}
        handleSubmit={() => {}}
        title=""
        message=""
      />

      <Grid
        size={{ sm: 12 }}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography variant="h6" fontWeight={500}>
          طرح‌ریزی تجمیعی حوزه‌های معاونت بازرسی
        </Typography>

        <Grid container spacing={2}>
          <Button
            sx={{ mb: 2, ml: 1 }}
            variant="contained"
            endIcon={<Edit />}
            onClick={() => navigate('new')}
          >
            ویرایش
          </Button>

          <Button
            sx={{ mb: 2 }}
            variant="contained"
            color="success"
            endIcon={<AddCircle />}
            onClick={handleAddNewYear}
          >
            ایجاد طرح‌ریزی جدید
          </Button>
        </Grid>
      </Grid>

      <MatnaDataGrid
        getRowHeight={() => 'auto'}
        rows={rows}
        columns={columns}
        rowCount={rows.length}
        hideFooter
        disableDensitySelector
        disableColumnSelector
        disableRowSelectionOnClick
        initialState={{
          sorting: {
            sortModel: [{ field: 'year', sort: 'desc' }],
          },
        }}
      />
    </Grid>
  );
}
