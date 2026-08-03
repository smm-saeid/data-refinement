import {
  Box,
  Button,
  Chip,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { type GridColDef } from '@mui/x-data-grid';
import { MatnaDataGrid } from '@/components/data-grid/MatnaDataGrid';
import { useNavigate } from 'react-router';
import BackButton from '@/components/button/BackButton';
import {
  PAGINATION_DEFAULT_VALUE_OLD,
  type PaginationQueryParamOld,
} from '@/types/api';
import { useSnackbar } from '@/hooks/useSnackbar';
import ConfirmBox from '@/components/confirm-box/ConfirmBox';
import { useApiMutation, useApiQuery } from '@/hooks/useApi';
import EvaluationApis from '@/modules/evaluation/apis';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { useState } from 'react';

type RowData = {
  id: string;
  firstName: string;
  lastName: string;
  year: string;
  personnelNumber: number;
  degree: string;
  isSelected: boolean;
};

type EvaluationRoleParams = {
  firstName?: string;
  lastName?: string;
  personnelNumber?: string;
  evaluationStatus?: string;
};

export default function EvaluationPlanningConfirm() {
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const [filters] = useState<
    PaginationQueryParamOld<EvaluationRoleParams>
  >({ ...PAGINATION_DEFAULT_VALUE_OLD });
  const [selectedItem, setSelectedItem] = useState<RowData>();
  const { data: result, isLoading } = useApiQuery<PaginationQueryParamOld<any>>(
    {
      url: EvaluationApis.planning.findByOrg,
      params: filters,
    }
  );

  function executionHandling() {
    navigate('/evaluation-and-survey-subsystem/cartable/created');
  }

  const { mutate: createEvaluationMutate } = useApiMutation({
    url: `evaluation/accept-planning`,
  });

  function createEvalutaion() {
    createEvaluationMutate({
      onSuccess: () => {
        console.log('success');
        executionHandling();
        snackbar('عملیات با موفقیت انجام شد', 'success', 5000);
      },
      onError: () => {
        console.log('fail');
        snackbar('رکورد شما موجود می باشد', 'error', 5000);
      },
    });
  }

  const columns: GridColDef[] = [
    { field: 'firstName', headerName: 'نام', flex: 1, display: 'flex' },
    { field: 'lastName', headerName: 'نشان', flex: 1, display: 'flex' },
    {
      field: 'personnelNumber',
      headerName: ' شماره پرسنلی',
      flex: 1,
      display: 'flex',
    },
    { field: 'organizationName', headerName: 'یگان', flex: 2, display: 'flex' },
    {
      field: 'evaluationStatus',
      headerName: 'وضعیت',
      flex: 2,
      display: 'flex',
      renderCell: ({ row }: { row: any }) => {
        switch (row.evaluationStatus) {
          case 'PLANING':
            return <Chip label="در حال طرح ریزی" color="warning" />;

          case 'COMPLETED_PLANING':
            return <Chip label="تکمیل طرح ریزی" color="info" />;

          case 'EXECUTION':
            return <Chip label="در حال اجرا" color="primary" />;

          case 'COMPLETED':
            return <Chip label="تکمیل شده" color="success" />;
        }
      },
    },
    { field: 'degree', headerName: 'درجه', flex: 1, display: 'flex' },
    {
      field: 'action',
      headerName: 'عملیات',
      flex: 1,
      display: 'flex',
      renderCell: ({ row }: { row: RowData }) => {
        return (
          <Tooltip title="حذف" arrow>
            <IconButton onClick={() => setSelectedItem(row)} color="error">
              <DeleteOutlineOutlinedIcon />
            </IconButton>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <Grid container justifyContent={'center'}>
      <Grid size={{ md: 11 }} display={'flex'} justifyContent={'space-between'}>
        <Typography fontWeight={700} variant="h5">
          طرح ریزی ارزشیابی
        </Typography>
        <BackButton
          text="بازگشت"
          color="primary"
          minWidth={300}
          onBack={() => navigate(-1)}
        />
      </Grid>
      <Grid size={{ md: 11 }} mt={2}>
        <MatnaDataGrid
          rows={result?.data}
          columns={columns}
          loading={isLoading}
          rowCount={result?.meta?.pagination?.count || 10}
          getRowId={row => row.personnelNumber}
          sx={{ marginBottom: '12px' }}
          checkboxSelection={false}
        />
      </Grid>

      <Grid
        size={{ md: 2 }}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Button
          onClick={() => createEvalutaion()}
          fullWidth
          variant="contained"
          color="success"
          sx={{ minWidth: '100px', m: 2 }}
        >
          ثبت نهایی
        </Button>
      </Grid>

      <Box>
        <ConfirmBox
          open={!!selectedItem}
          handleClose={() => setSelectedItem(undefined)}
          handleSubmit={() => {
            createEvaluationMutate(
              {
                url: `evaluation/${selectedItem?.id}`,
                method: 'delete',
                data: [selectedItem?.id],
              } as any,
              {
                onSuccess: (res: any) => {
                  if (res.message !== 'ok') {
                    snackbar('خطا در حذف اطلاعات', 'error', 5000);
                  } else {
                    snackbar(
                      `${selectedItem?.personnelNumber} با موفقیت حذف شد`,
                      'success',
                      5000
                    );
                  }
                  setSelectedItem(undefined);
                },
              }
            );
          }}
          title={`حذف ${selectedItem?.personnelNumber}`}
          message={`آیا از حذف   ${selectedItem?.firstName} ${selectedItem?.lastName} اطمینان دارید؟`}
        />
      </Box>
    </Grid>
  );
}
