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
import { MatnaDataGrid } from 'components/data-grid/MatnaDataGrid.tsx';
import { useEffect, useMemo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import ConfirmBox from 'components/confirm-box/ConfirmBox.tsx';
import { useSnackbar } from 'hooks/useSnackbar.ts';
import { type GridColDef } from '@mui/x-data-grid';
import { PLANNING_STATE, stateTitles } from '../types.ts';
import {
  AddCircle,
  Book,
  ChangeCircleOutlined,
  Edit,
  CompareArrows,
} from '@mui/icons-material';
import { useApiQuery } from 'hooks/useApi.ts';
import { useLegacyApi } from 'hooks/useLegacyApi.ts';

/* ---------------- types ---------------- */

type SeasonKey =
  | 'first_season'
  | 'secound_season'
  | 'third_season'
  | 'fourth_season';

type ApiItem = {
  status: string;
  organizationId: string;
  organizationName: string;
  season: {
    season: SeasonKey;
    number: number;
  }[];
};

type RowType = {
  id: number;
  year: string;
  organizationName: string;
  seasons: {
    season: SeasonKey;
    number: number;
  }[];
  percent: string;
  status: string;
};

/* ---------------- component ---------------- */

export default function ListPage() {
  const snackbar = useSnackbar();
  const navigate = useNavigate();
  const legacyApi = useLegacyApi();

  const currentYear = new Date().toLocaleDateString('fa-IR-u-nu-latn', {
    year: 'numeric',
  });

  const [selectedYear, setSelectedYear] = useState<string>(currentYear);
  const [rows, setRows] = useState<RowType[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>();

  /* ---------------- mutations (UNCHANGED) ---------------- */

  const { mutate } = useMutation({
    mutationFn: legacyApi.request,
  });

  const handleAddNewYear = () => {
    mutate(
      {
        entity: `/expert-supervision/add-year/type/supervision`,
        method: 'POST',
      } as any,
      {
        onError: () => {
          snackbar(
            'برای این امر ابتدا نیاز است هیچکدام از سال های قبلی در مرحله طرح ریزی نباشند',
            'error',
            5000
          );
        },
        onSuccess: () => {
          // intentionally empty – backend decides year
        },
      }
    );
  };

  /* ---------------- API by year ---------------- */

  const { data, isLoading, refetch } = useApiQuery({
    url: selectedYear
      ? `expert-supervision/type/supervision/year/${selectedYear}`
      : null,
    select: (res: any) => res.data as ApiItem[],
    enabled: !!selectedYear,
  });

  /* ---------------- map api → rows ---------------- */

  useEffect(() => {
    if (!data) return;

    const mapped: RowType[] = data.map((item, index) => ({
      id: index,
      year: selectedYear,
      organizationName: item.organizationName,
      seasons: item.season,
      percent: '-',
      status: item?.status,
    }));

    setRows(mapped);
  }, [data, selectedYear]);

  /* ---------------- render seasons ---------------- */

  const renderSeasonNumbers = (row: RowType) => {
    const order: SeasonKey[] = [
      'first_season',
      'secound_season',
      'third_season',
      'fourth_season',
    ];

    return (
      <Box pt={1.5} pb={1.5}>
        {order.map((s, index) => (
          <Typography
            key={s}
            textAlign="center"
            variant="subtitle2"
            borderBottom={index !== 3 ? 'dotted 1px lightgrey' : 'none'}
          >
            {row.seasons.find(i => i.season === s)?.number ?? '-'}
          </Typography>
        ))}
      </Box>
    );
  };

  /* ---------------- columns ---------------- */

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'organizationName',
        headerName: 'معاونت / سازمان',
        display: 'flex',
        flex: 2,
        align: 'center',
        headerAlign: 'center',
      },
      {
        field: 'SEASON',
        headerName: 'بازه زمانی',
        flex: 1.2,
        align: 'center',
        headerAlign: 'center',
        renderCell: () => (
          <Box pt={1.5} pb={1.5}>
            {['سه ماهه اول', 'سه ماهه دوم', 'سه ماهه سوم', 'سه ماهه چهارم'].map(
              (label, index) => (
                <Typography
                  key={index}
                  variant="subtitle2"
                  borderBottom={index !== 3 ? 'dotted 1px lightgrey' : 'none'}
                >
                  {label}
                </Typography>
              )
            )}
          </Box>
        ),
      },
      {
        field: 'numbers',
        headerName: 'تعداد بازرسی',
        flex: 1.2,
        align: 'center',
        headerAlign: 'center',
        renderCell: ({ row }) => renderSeasonNumbers(row),
      },
      {
        field: 'status',
        headerName: 'وضعیت',
        display: 'flex',
        flex: 1,
        align: 'center',
        headerAlign: 'center',
        renderCell: params => {
          switch (params.row.status) {
            case PLANNING_STATE.PRE_PLANNING:
              return <Chip label={stateTitles.PRE_PLANNING} />;
            case PLANNING_STATE.WAITING_FOR_APPROVE:
              return <Chip label={stateTitles.WAITING_FOR_APPROVE} />;
            case PLANNING_STATE.PLANNING:
              return <Chip label={stateTitles.PLANNING} />;
            case PLANNING_STATE.WAITING_FOR_APPROVE_DETAILS:
              return <Chip label={stateTitles.WAITING_FOR_APPROVE_DETAILS} />;
            case PLANNING_STATE.IN_PROGRESS:
              return <Chip label={stateTitles.IN_PROGRESS} />;
            case PLANNING_STATE.FINISHED:
              return <Chip label={stateTitles.FINISHED} color='error' />;
            default:
              return <Chip label="طرح ریزی نشده" color="warning" />;
          }
        },
      },
      {
        field: 'action',
        headerName: 'عملیات',
        display: 'flex',
        headerAlign: 'center',
        flex: 1,
        align: 'center',
        renderCell: ({ row }) => (
          <Box>
            <Tooltip title="مشاهده گزارش">
              <IconButton
                onClick={() =>
                  navigate(`/operation/planning/deputy/report/${row.year}`)
                }
              >
                <Book color="info" />
              </IconButton>
            </Tooltip>
            <Tooltip title="تغییر وضعیت">
              <IconButton
                onClick={() => {
                  mutate(
                    {
                      entity: `expert-supervision/edit-state/${row.status}/${row.year}/supervision`,
                      method: 'PUT',
                    } as any,
                    {
                      onSuccess: () => {
                        snackbar('وضعیت با موفقیت تغییر کرد', 'success', 5000);
                        refetch();
                      },
                      onError() {
                        snackbar('خطا در تغییر وضعیت', 'error', 5000);
                      },
                    }
                  );
                }}
              >
                <ChangeCircleOutlined color="warning" />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [mutate]
  );

  /* ---------------- render ---------------- */

  return (
    <Grid container justifyContent="space-between">
      <ConfirmBox
        open={!!selectedItem}
        handleClose={() => setSelectedItem(undefined)}
        handleSubmit={() => setSelectedItem(undefined)}
        title="حذف طرح ریزی"
        message="آیا از حذف اطمینان دارید؟"
      />

      {/* ---------- header ---------- */}
      <Grid display="flex" justifyContent="flex-start">
        <Typography variant="h6" fontWeight={500}>
          طرح ریزی تخصصی معاونت ها
        </Typography>
      </Grid>

      <Grid
        container
        display="flex"
        justifyContent="flex-end"
        spacing={1}
        alignItems="center"
      >
        {/* 🔹 فیلتر سال */}
        <TextField
          label="سال شمسی"
          value={selectedYear}
          onChange={e => setSelectedYear(e.target.value)}
          sx={{ width: 120, mb: 2, ml: 2 }}
        />

        {/* 🔹 دکمه‌ها (بدون تغییر عملکرد) */}
        <Button
          sx={{ mb: 2 }}
          variant="contained"
          endIcon={<Edit />}
          onClick={() => navigate('new')}
        >
          ویرایش
        </Button>

        <NavLink to={`/operation/planning/conflicts/${selectedYear}`}>
          <Button
            sx={{ mb: 2 }}
            variant="contained"
            color="warning"
            endIcon={<CompareArrows />}
          >
            لیست تداخلات
          </Button>
        </NavLink>

        <Button
          sx={{ mb: 2 }}
          variant="contained"
          color="success"
          endIcon={<AddCircle />}
          onClick={handleAddNewYear}
        >
          ایجاد طرح ریزی جدید
        </Button>
      </Grid>

      {/* ---------- table ---------- */}
      <MatnaDataGrid
        className="professional-planning"
        getRowHeight={() => 'auto'}
        columnHeaderHeight={120}
        rows={rows}
        columns={columns}
        loading={isLoading}
        hideFooter
        disableDensitySelector
        disableColumnSelector
        disableRowSelectionOnClick
      />
    </Grid>
  );
}
