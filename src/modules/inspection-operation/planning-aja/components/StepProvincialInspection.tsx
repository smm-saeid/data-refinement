import { useMemo, useState } from 'react';
import {
  Box,
  Grid,
  Autocomplete,
  TextField,
  IconButton,
  Tooltip,
  FormHelperText,
  Typography,
} from '@mui/material';
import { MatnaDataGrid } from '@/components/data-grid/MatnaDataGrid';
import { useFormContext, useWatch } from 'react-hook-form';
import { type GridColDef, type GridRowSelectionModel } from '@mui/x-data-grid';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ProvinceUnitsDialog from './ProvinceUnitsDialog';
import {
  Months,
  type MonthType,
} from '../types';
import { useApiQuery } from '@/hooks/useApi';
import InspectionApis from '../../api';

type Props = {
  stepKey: string;
  stepTitle?: string;
};

export default function StepProvincialInspection({
  stepKey,
  stepTitle,
}: Props) {
  const {
    setValue,
    control,
    formState: { errors },
  } = useFormContext();

  const { data: response, isLoading } = useApiQuery<any>({
    url: InspectionApis.commonBaseData.provinces,
    params: {},
  });

  const rows = response?.data || [];
  const FIELD_NAME = `provincial_${stepKey}`;

  const selectedProvinces =
    useWatch({
      control,
      name: FIELD_NAME,
    }) || [];

  const rowSelectionModel = useMemo(() => {
    const idsArray = selectedProvinces.map((item: any) => item.provinceId);
    return {
      type: 'include',
      ids: new Set(idsArray),
    } as GridRowSelectionModel;
  }, [selectedProvinces]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDialogData, setSelectedDialogData] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const handleSelectionChange = (newSelectionModel: GridRowSelectionModel) => {
    let newSelectedIds: number[] = [];

    if (
      newSelectionModel &&
      typeof newSelectionModel === 'object' &&
      'ids' in newSelectionModel &&
      newSelectionModel.ids instanceof Set
    ) {
      newSelectedIds = Array.from(newSelectionModel.ids) as number[];
    } else if (Array.isArray(newSelectionModel)) {
      newSelectedIds = newSelectionModel as number[];
    }

    const newFormValue = newSelectedIds.map(id => {
      const existingItem = selectedProvinces.find(
        (p: any) => p.provinceId === id
      );
      if (existingItem) return existingItem;

      return {
        provinceId: id,
        season: null,
      };
    });

    setValue(FIELD_NAME, newFormValue, { shouldValidate: true });
  };

  const handleMonthChange = (
    provinceId: number,
    month: MonthType
  ) => {
    const newFormValue = selectedProvinces.map((item: any) => {
      if (item.provinceId === provinceId) {
        return { ...item, season: month.season, month: month.key };
      }
      return item;
    });

    setValue(FIELD_NAME, newFormValue, { shouldValidate: true });
  };

  const handleOpenUnitDialog = (row: any) => {
    setSelectedDialogData({ id: row.id, name: row.value });
    setDialogOpen(true);
  };

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'value',
        headerName: 'نام استان',
        flex: 1,
        align: 'center',
        headerAlign: 'center',
      },
      {
        field: 'season',
        headerName: 'انتخاب ماه بازرسی',
        flex: 1.5,
        align: 'center',
        headerAlign: 'center',
        sortable: false,
        renderCell: params => {
          const isSelected = (rowSelectionModel as any).ids.has(params.row.id);

          if (!isSelected) return '-';

          const currentItem = selectedProvinces.find(
            (p: any) => p.provinceId === params.row.id
          );

          const currentMonthValue =
            Months.find(opt => opt.key === currentItem?.month) ||
            null;

          return (
            <Autocomplete
              options={Months}
              getOptionLabel={option => option.label}
              value={currentMonthValue}
              onChange={(_, newValue) => {
                handleMonthChange(params.row.id, newValue)
              }}
              size="small"
              sx={{ width: '90%', margin: '0 auto' }}
              renderInput={params => (
                <TextField
                  {...params}
                  placeholder="انتخاب ماه"
                  variant="standard"
                  error={!!errors?.[FIELD_NAME]}
                />
              )}
              onClick={e => e.stopPropagation()}
            />
          );
        },
      },
      {
        field: 'actions',
        headerName: 'یگان‌ها',
        flex: 0.7,
        align: 'center',
        headerAlign: 'center',
        sortable: false,
        renderCell: params => (
          <Tooltip title="مشاهده یگان‌های استان">
            <IconButton
              color="primary"
              onClick={e => {
                e.stopPropagation();
                handleOpenUnitDialog(params.row);
              }}
            >
              <VisibilityOutlinedIcon />
            </IconButton>
          </Tooltip>
        ),
      },
    ],
    [selectedProvinces, errors, FIELD_NAME, rowSelectionModel]
  );

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Grid container>
        <Grid size={{ xs: 12 }}>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ fontWeight: 'bold' }}
          >
            {stepTitle} - انتخاب استان ها
          </Typography>
        </Grid>
      </Grid>

      <Grid
        container
        justifyContent="center"
        sx={{
          height: 'calc(100vh - 400px)',
          width: '100%',
          overflowY: 'scroll',
        }}
      >
        <Grid size={{ xs: 12 }}>
          {errors[FIELD_NAME] && (
            <FormHelperText
              error
              sx={{ mb: 1, fontSize: '1rem', textAlign: 'center' }}
            >
              {errors[FIELD_NAME]?.message as string}
            </FormHelperText>
          )}

          <MatnaDataGrid
            rows={rows}
            rowCount={rows.length}
            columns={columns}
            loading={isLoading}
            checkboxSelection
            disableRowSelectionOnClick
            rowSelectionModel={rowSelectionModel}
            onRowSelectionModelChange={handleSelectionChange}
            sx={{ backgroundColor: 'white', minHeight: 400 }}
            hideFooter={true}
          />
        </Grid>
      </Grid>

      {selectedDialogData && (
        <ProvinceUnitsDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          provinceId={selectedDialogData.id}
          provinceName={selectedDialogData.name}
        />
      )}
    </Box>
  );
}
