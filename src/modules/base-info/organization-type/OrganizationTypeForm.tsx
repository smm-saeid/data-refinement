import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Autocomplete,
  Button,
  Typography,
  Grid,
  Paper,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import {
  PAGINATION_DEFAULT_VALUE_OLD,
  type PaginationQueryParamOld,
} from '@/types/api';

import { useSnackbar } from '@/hooks/useSnackbar';
import { useApiQuery, useApiMutation } from '@/hooks/useApi';
import { BaseInfoApis } from '@/modules/base-info/apis';
import type { Unit, Force, Essence, UnitType } from '../types';
import type { organizationType } from './types';
import { useMutation } from '@tanstack/react-query';
import { OrganizationTypeTable } from './OrganizationTypeTable';



type OrganizationTypeQueryParams = {
  organizationUnitName?: string;
  commonBaseDataUnitTypeValue?: string;
};



export function OrganizationTypeForm() {
  const snackbar = useSnackbar();

  const { mutateAsync: saveForm } = useApiMutation({
    url: BaseInfoApis.OrganizationForm.saveForm.create,
    method: 'POST',
  });

  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [selectedForce, setSelectedForce] = useState<Force | null>(null);
  const [selectedEssence, setSelectedEssence] = useState<Essence | null>(null);
  const [selectedUnitType, setSelectedUnitType] = useState<UnitType | null>(
    null
  );

  const [unitInput, setUnitInput] = useState('');
  const [forceInput, setForceInput] = useState('');
  const [essenceInput, setEssenceInput] = useState('');
  const [unitTypeInput, setUnitTypeInput] = useState('');

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

    const [filters, setFilters] = useState<
      PaginationQueryParamOld<OrganizationTypeQueryParams>
    >({
      ...PAGINATION_DEFAULT_VALUE_OLD,
      organizationUnitName: '',
      commonBaseDataUnitTypeValue: '',
    });

  const [rows, setRows] = useState<any[]>([]);
  const { data: unitOptions = [] } = useApiQuery<Unit[], void>({
    url: BaseInfoApis.OrganizationForm.units.completeName(unitInput),
    enabled: !!unitInput,
  })
  const { data: forceOptions = [] } = useApiQuery<Force[], void>({
    url: selectedUnit
      ? BaseInfoApis.OrganizationForm.forces.search('force') +
        '?currentPage=1&pageSize=10'
      : '',
    enabled: !!selectedUnit,
  });

  const { data: essenceOptions = [] } = useApiQuery<Essence[], void>({
    url: selectedForce
      ? BaseInfoApis.OrganizationForm.essences.childrenByParentId(
          selectedForce.id
        )
      : '',
    enabled: !!selectedForce,
  });

  const { data: unitTypeOptions = [] } = useApiQuery<UnitType[], void>({
    url: selectedForce
      ? BaseInfoApis.OrganizationForm.unitTypes.childrenByParentId(
          selectedForce.id
        )
      : '',
    enabled: !!selectedEssence,
  });

  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useApiQuery<
    organizationType[],
    PaginationQueryParamOld<OrganizationTypeQueryParams>
  >({
    url: BaseInfoApis.OrganizationForm.saveForm.list,
    params: filters,
  });

  useEffect(() => {
    if (response?.data) {
      setRows(
        response.data.map((r: any, i: number) => ({
          ...r,
          rowindex:
            i + 1 + ((filters.currentPage ?? 1) - 1) * (filters.pageSize ?? 10),
        }))
      );
    }
  }, [response, filters]);

  const updateFilters = (updates: Partial<OrganizationTypeQueryParams>) => {
    setFilters(prev => ({
      ...prev,
      ...updates,
      page: 1,
    }));
    refetch();
  };

  const resetFilters = () => {
    setFilters({
      ...PAGINATION_DEFAULT_VALUE_OLD,
      organizationUnitName: '',
      commonBaseDataUnitTypeValue: '',
    });
    refetch();
  };

  const handlePaginationChange = (model: {
    page: number;
    pageSize: number;
  }) => {
    setFilters(prev => ({
      ...prev,
      page: model.page,
      size: model.pageSize,
    }));
    refetch();
  };

  const { mutate } = useMutation({
    mutationFn: async (vars: {
      entity: string;
      method: string;
      data?: any;
    }) => {
      const res = await fetch(vars.entity, {
        method: vars.method,
        body: vars.data ? JSON.stringify(vars.data) : undefined,
      });
      if (!res.ok) throw new Error('Network error');
      return res.json();
    },
  });



  useEffect(() => {
    setSelectedForce(null);
    setForceInput('');
    setSelectedEssence(null);
    setEssenceInput('');
    setSelectedUnitType(null);
    setUnitTypeInput('');
  }, [selectedUnit]);

  useEffect(() => {
    setSelectedEssence(null);
    setEssenceInput('');
    setSelectedUnitType(null);
    setUnitTypeInput('');
  }, [selectedForce]);

  useEffect(() => {
    setSelectedUnitType(null);
    setUnitTypeInput('');
  }, [selectedEssence]);

  const handleSubmit = async () => {
    if (!selectedUnit || !selectedUnitType) {
      snackbar('لطفاً یگان و نوع یگان را انتخاب کنید', 'error', 3000);
      return;
    }

    try {
      await saveForm({
        organizationUnitId: selectedUnit.id,
        commonBaseDataUnitTypeId: selectedUnitType.id,
        organizationUnitName: null,
        commonBaseDataUnitTypeValue: null,
      });
      snackbar('ثبت با موفقیت انجام شد!', 'success', 3000);
    } catch (err: any) {
      console.error(err);
      snackbar(
        err?.response?.data?.message || 'خطا در ثبت اطلاعات',
        'error',
        3000
      );
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    mutate(
      {
        entity: BaseInfoApis.OrganizationForm.saveForm.delete(deleteId),
        method: 'DELETE',
      },
      {
        onSuccess: () => {
          snackbar('حذف با موفقیت انجام شد', 'success', 3000);
          refetch();
          setDeleteDialogOpen(false);
          setDeleteId(null);
        },
        onError: () => snackbar('خطا در حذف داده', 'error', 3000),
      }
    );
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setDeleteId(null);
  };

  if (error) {
    return (
      <Box p={2}>
        <Paper sx={{ p: 2, bgcolor: 'error.light' }}>
          خطا: {error.response?.data?.message || error.message}
        </Paper>
      </Box>
    );
  }

  function toArray<T>(data: T[] | { data: T[] } | undefined): T[] {
    if (!data) return [];
    return Array.isArray(data) ? data : (data.data ?? []);
  }
  const forcesArray = toArray(forceOptions);
  return (
    <Box sx={{ width: '100%', p: 2, boxSizing: 'border-box' }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" mb={2}>
          فرم انتخاب یگان و مشخصات
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ md: 2.5 }}>
            <Autocomplete
              options={toArray(unitOptions)}
              getOptionLabel={opt => opt.name}
              value={selectedUnit}
              onChange={(_, v) => setSelectedUnit(v)}
              inputValue={unitInput}
              onInputChange={(_, v) => {
                // فقط حروف فارسی و فاصله
                const persianOnly = v.replace(/[^آ-یءئإأؤ ؤٔ‌]/g, '');
                setUnitInput(persianOnly);
              }}
              renderInput={params => (
                <TextField {...params} label="نام یگان" fullWidth />
              )}
            />
          </Grid>

          <Grid size={{ md: 2.5 }}>
            <TextField
              select
              label="نیرو"
              fullWidth
              value={selectedForce?.id || ''}
              onChange={e => {
                const selected =
                  forcesArray.find(f => f.id === e.target.value) || null;
                setSelectedForce(selected);
              }}
              disabled={!selectedUnit}
            >
              {forcesArray.map(force => (
                <MenuItem key={force.id} value={force.id}>
                  {force.value}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ md: 2.5 }}>
            <TextField
              select
              label="ماهیت"
              fullWidth
              value={selectedEssence?.id || ''}
              onChange={e => {
                const selected =
                  toArray(essenceOptions).find(
                    opt => opt.id === e.target.value
                  ) || null;
                setSelectedEssence(selected);
              }}
              disabled={!selectedForce}
            >
              {toArray(essenceOptions).map(essence => (
                <MenuItem key={essence.id} value={essence.id}>
                  {essence.value}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ md: 2.5 }}>
            <TextField
              select
              label="نوع یگان"
              fullWidth
              value={selectedUnitType?.id || ''}
              onChange={e => {
                const selected =
                  toArray(unitTypeOptions).find(
                    opt => opt.id === e.target.value
                  ) || null;
                setSelectedUnitType(selected);
              }}
              onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUnitTypeInput(e.target.value)
              }
              disabled={!selectedEssence}
            >
              {toArray(unitTypeOptions).map(unitType => (
                <MenuItem key={unitType.id} value={unitType.id}>
                  {unitType.value}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ md: 2 }}>
            <Button
              variant="contained"
              color="success"
              fullWidth
              sx={{ mt: 1 }}
              onClick={handleSubmit}
            >
              ثبت
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <OrganizationTypeTable
        rows={rows}
        filters={filters}
        setFilters={updateFilters}
        isLoading={isLoading}
        rowCount={response?.meta?.pagination?.count || 0}
        // onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        onPaginationModelChange={handlePaginationChange}
      />

      <Dialog
        open={deleteDialogOpen}
        onClose={cancelDelete}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">تأیید حذف</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            آیا از حذف این مورد اطمینان دارید؟
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            انصراف
          </Button>
          <Button onClick={confirmDelete} color="error" autoFocus>
            حذف
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
