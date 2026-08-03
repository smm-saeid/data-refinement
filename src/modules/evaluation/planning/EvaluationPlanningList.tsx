import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ListICon from '@mui/icons-material/List';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {
  Button,
  Chip,
  DialogActions,
  DialogContent,
  DialogContentText,
  Fab,
  Grid,
  Tooltip,
  Typography,
} from '@mui/material';
import { Modal, Dialog, DialogTitle } from '@mui/material';
import {
  GridCheckCircleIcon,
  type GridColDef,
} from '@mui/x-data-grid';
import { MatnaDataGrid } from '@/components/data-grid/MatnaDataGrid';
import { useNavigate } from 'react-router';
import { useMemo, useState } from 'react';
import {
  PAGINATION_DEFAULT_VALUE_OLD,
  type PaginationQueryParamOld,
} from '@/types/api';
import { useSnackbar } from '@/hooks/useSnackbar';
import { useApiMutation, useApiQuery } from '@/hooks/useApi';
import EvaluationApis from '@/modules/evaluation/apis';

type EvaluationRoleParams = {
  title?: string;
  organizationUnitName?: string;
  year?: string;
  status?: string;
};

export default function EvaluationPlanningList() {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const snackbar = useSnackbar();
  const [filters] = useState<
    PaginationQueryParamOld<EvaluationRoleParams>
  >({ ...PAGINATION_DEFAULT_VALUE_OLD });

  const { data: response, isLoading } = useApiQuery<
    PaginationQueryParamOld<any>
  >({
    url: EvaluationApis.planning.list,
    params: filters,
  });

  const { mutate: createEvaluationMutate } = useApiMutation({
    url: EvaluationApis.planning.create,
  });

  function createEvalutaion() {
    createEvaluationMutate({
      onSuccess: () => {
        console.log('success');

        snackbar('عملیات با موفقیت انجام شد', 'success', 5000);
      },
      onError: () => {
        console.log('fail');

        snackbar('رکورد شما موجود می باشد', 'error', 5000);
      },
    });
  }

  function handleOpen() {
    setOpenModal(true);
  }

  function handleClose() {
    setOpenModal(false);
  }

  function executionHandling() {
    navigate('/evaluation-role-select');
  }

  const columns: GridColDef<EvaluationRoleParams>[] = useMemo(
    () => [
      { field: 'title', headerName: 'عنوان', flex: 3, display: 'flex' },
      {
        field: 'organizationUnitName',
        headerName: 'نیرو',
        flex: 1,
        display: 'flex',
      },
      { field: 'year', headerName: ' سال', flex: 2, display: 'flex' },
      {
        field: 'status',
        headerName: ' وضعیت',
        flex: 3,
        display: 'flex',
        renderCell: ({ row }: { row: any }) => {
          switch (row.status) {
            case 'INITIALIZING':
              return <Chip label="شروع شده" sx={{ bgcolor: 'skyblue' }} />;
          }
        },
      },
      {
        field: 'planningStart',
        headerName: 'عملیات',
        flex: 4,
        renderCell: () => {
          return (
            <Grid style={{ display: 'flex' }}>
              <Tooltip title="شروع طرح ریزی" sx={{ marginLeft: '5px' }}>
                <Fab
                  size="small"
                  color="success"
                  onClick={() => executionHandling()}
                >
                  <AddCircleIcon />
                </Fab>
              </Tooltip>
              <Tooltip title="برنامه‌ریزی" sx={{ marginLeft: '5px' }}>
                <Fab size="small" color="primary">
                  <ListICon />
                </Fab>
              </Tooltip>
              <Tooltip title=" اجرا" sx={{ marginLeft: '5px' }}>
                <Fab size="small" color="primary">
                  <PlayArrowIcon />
                </Fab>
              </Tooltip>
              <Tooltip title=" پایان" sx={{ marginLeft: '5px' }}>
                <Fab size="small" color="warning">
                  <GridCheckCircleIcon />
                </Fab>
              </Tooltip>
            </Grid>
          );
        },
      },
    ],
    []
  );

  return (
    <Grid container justifyContent={'center'}>
      <Grid
        container
        size={{ xs: 11 }}
        display={'flex'}
        justifyContent={'space-between'}
      >
        <Typography fontWeight={700} variant="h5">
          طرح ریزی ارزشیابی
        </Typography>

        <Button
          variant="contained"
          onClick={() => handleOpen()}
          color="success"
        >
          ارزشیابی جدید
        </Button>
      </Grid>
      <Grid size={{ md: 11 }}>
        <MatnaDataGrid
          sx={{ marginTop: '30px' }}
          rows={response?.data}
          columns={columns}
          loading={isLoading}
          paginationModel={{
            page: response?.meta?.pagination?.currentPage || 1,
            pageSize: response?.meta?.pagination?.pageSize || 10,
          }}
          rowCount={response?.meta?.pagination?.count || 10}
        />
      </Grid>
      <Modal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
        sx={{ justifyContent: 'center', display: 'flex', alignItems: 'center' }}
        aria-labelledby="modal-city-select"
        aria-describedby="modal-city-select-description"
      >
        <Dialog
          maxWidth="lg"
          open={openModal}
          onClose={() => {
            setOpenModal(false);
          }}
        >
          <DialogTitle>ارزشیابی جدید</DialogTitle>
          <DialogContent>
            <DialogContentText>
              آیا اطمینان دارید که میخواهید ارزشیابی جدید ایجاد کنید؟
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button onClick={createEvalutaion}>بلی</Button>
            <Button onClick={handleClose}>خیر</Button>
          </DialogActions>
        </Dialog>
      </Modal>
    </Grid>
  );
}
