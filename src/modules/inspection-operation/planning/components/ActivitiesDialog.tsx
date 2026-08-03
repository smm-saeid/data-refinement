import { useMemo, useState } from 'react';
import {
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
} from '@mui/material';
import { MatnaDataGrid } from '@/components/data-grid/MatnaDataGrid';
import { useApiQuery } from '@/hooks/useApi';
import type { ActivityItem } from '../types.ts';
import InspectionOperationApis from '@/modules/inspection-operation/api.ts';

type Props = {
  programId?: string;
  programName?: string;
  open: boolean;
  onClose: () => void;
};

const PAGE_SIZE = 10;

const statusMap: Record<string, { label: string; color: 'default' | 'info' | 'success' | 'warning' }> = {
  PLANNING: { label: 'طرح‌ریزی', color: 'info' },
  IN_PROGRESS: { label: 'در حال اجرا', color: 'warning' },
  DONE: { label: 'انجام‌شده', color: 'success' },
};

export default function ActivitiesDialog({ programId, programName, open, onClose }: Props) {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: PAGE_SIZE });

  const { data, isLoading } = useApiQuery<ActivityItem[]>({
    url: InspectionOperationApis.planning.activities,
    params: {
      programId,
      page: paginationModel.page,
      size: paginationModel.pageSize,
    },
    enabled: open && Boolean(programId),
  });

  const rows = data?.data ?? [];
  const total = data?.meta?.pagination?.count ?? rows.length;

  const columns = useMemo(
    () => [
      { field: 'name', headerName: 'عنوان فعالیت', flex: 1.5 },
      {
        field: 'status',
        headerName: 'وضعیت',
        flex: 0.6,
        renderCell: params => {
          const info = statusMap[params.value] ?? { label: params.value, color: 'default' };
          return <Chip label={info.label} color={info.color} size="small" />;
        },
      },
      { field: 'description', headerName: 'توضیحات', flex: 1 },
    ],
    []
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>فعالیت‌های {programName}</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {!rows.length && !isLoading ? (
          <Typography variant="body2" color="text.secondary">
            فعالیتی ثبت نشده است.
          </Typography>
        ) : (
          <MatnaDataGrid
            rows={rows}
            columns={columns}
            loading={isLoading}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[PAGE_SIZE]}
            rowCount={total}
            paginationMode="server"
            autoHeight
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>بستن</Button>
      </DialogActions>
    </Dialog>
  );
}