import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Grid,
} from '@mui/material';
import { useApiQuery } from 'hooks/useApi.ts';
import CartableApis from 'modules/cartable/apis.ts';
import { useMutation } from '@tanstack/react-query';
import { useLegacyApi } from 'hooks/useLegacyApi.ts';
import { useSnackbar } from 'hooks/useSnackbar.ts';
import type { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { MatnaDataGrid } from 'components/data-grid/MatnaDataGrid.tsx';

export default function CartableSendNotice({ flowRuleId, cartableId, onClose, onSuccess }) {
  const [selectedUnits, setSelectedUnits] = useState([]);

  const [rowSelectionModel, setRowSelectionModel] = useState({
    type: 'include' as 'include' | 'exclude',
    ids: new Set<any>([]),
  });

  const { data: receiverUnits, isLoading } = useApiQuery({
    url: CartableApis.noticeReceiverUnits,
    params: {},
    select: (res: any) => res.data as any,
  });

  const legacyApi = useLegacyApi();
  const snackbar = useSnackbar();

  const { mutate, isPending } = useMutation({
    mutationFn: legacyApi.request,
  });

  const handleSubmit = () => {
    if (selectedUnits.length == 0) {
      snackbar('لطفا یگان های مورد نظر را انتخاب کنید.', 'error', 5000);
      return;
    }

    const params = {
      flowRuleId,
      organizationUnitIds: selectedUnits.map(unit => unit.id),
    };
    mutate(
      {
        entity: CartableApis.sendNotice,
        method: 'post',
        data: params,
      } as any,
      {
        onSuccess: () => {
          snackbar('عملیات با موفقیت انجام شد', 'success', 5000);
          onClose();
          onSuccess();
        },
        onError: () => snackbar('خطا در انجام عملیات', 'error', 5000),
      }
    );
  };

  const handleFinalSubmit = () => {
    mutate(
      {
        entity: CartableApis.approveNotice(cartableId),
        method: 'put',
        data: {},
      } as any,
      {
        onSuccess: () => {
          snackbar('عملیات با موفقیت انجام شد', 'success', 5000);
          onClose();
          onSuccess();
        },
        onError: () => snackbar('خطا در انجام عملیات', 'error', 5000),
      }
    );
  };

  const handleSelectionChange = (newSelectionModel: GridRowSelectionModel) => {
    const newSelectedIds = Array.from(newSelectionModel.ids);
    if(newSelectionModel.type === 'include') {
      setSelectedUnits(receiverUnits.filter(i => newSelectedIds.includes(i.id)));
    } else if (newSelectionModel.type === 'exclude') {
      setSelectedUnits(receiverUnits.filter(i => !newSelectedIds.includes(i.id)));
    }
    setRowSelectionModel(newSelectionModel);
  };

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'name',
        headerName: 'نام یگان',
        flex: 2,
        align: 'center',
        headerAlign: 'center',
      },
      {
        field: 'code',
        headerName: 'کد یگان',
        flex: 1,
        align: 'center',
        headerAlign: 'center',
      },
      {
        field: 'type',
        headerName: 'نوع گیرنده',
        flex: 1.5,
        align: 'center',
        headerAlign: 'center',
        valueGetter: (_, row) => {
          const types = [];
          if (row.force) types.push('نیرو');
          if (row.expertSupervision) types.push('گیرنده یکم');
          return types.join(', ');
        },
      },
    ],
    []
  );

  return (
    <>
      <Grid container justifyContent="center" alignItems={'center'} spacing={1}>
        <Grid size={{ xs: 12 }}>
          <Box
            sx={{ mt: 1, height: 'calc(100vh - 250px)', overflowY: 'scroll' }}
          >
            <MatnaDataGrid
              rows={receiverUnits}
              rowCount={receiverUnits?.length || 0}
              columns={columns}
              loading={isLoading}
              checkboxSelection
              disableRowSelectionOnClick
              rowSelectionModel={rowSelectionModel}
              onRowSelectionModelChange={handleSelectionChange}
              sx={{ backgroundColor: 'white', minHeight: 400 }}
              hideFooter={true}
            />
          </Box>
          <Grid display="flex" justifyContent="end" sx={{ mt: 2 }} gap={2}>
            <Button color="error" variant="contained" onClick={() => onClose()}>
              بستن
            </Button>
            <Button
              disabled={isPending}
              color="success"
              variant="contained"
              onClick={() => handleSubmit()}
            >
              ابلاغ
            </Button>

            <Button
              disabled={isPending}
              color="info"
              variant="contained"
              onClick={() => handleFinalSubmit()}
            >
              اتمام ابلاغ
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
