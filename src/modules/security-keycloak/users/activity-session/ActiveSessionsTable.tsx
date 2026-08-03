import { useState } from 'react';
import type { GridColDef } from '@mui/x-data-grid';
import {
  Box,
  Button,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { Logout as TerminateIcon } from '@mui/icons-material';
import { useApiMutation } from '@/hooks/useApi';
import { MatnaDataGrid } from '../../../../components/data-grid/MatnaDataGrid';
import keycloakApis from '../../apis';
import type { ActiveSession } from '../../types';

interface ActiveSessionsTableProps {
  data: ActiveSession[];
  loading: boolean;
  onSuccess: () => void;
  paginationModel: { page: number; pageSize: number };
  onPaginationChange: (model: any) => void;
  rowCount: number;
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'بدون تاریخ';
  const date = new Date(dateString);
  return date.toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });
};

const getSessionTypeLabel = (type: string) => {
  const typeMapping = {
    LOGIN: 'ورود',
    LOGOUT: 'خروج',
    REFRESH_TOKEN: 'تازه‌سازی توکن',
    CLIENT_LOGIN: 'ورود کلاینت',
  };
  return typeMapping[type as keyof typeof typeMapping] || type;
};

const getSessionTypeColor = (type: string) => {
  const colorMapping = {
    LOGIN: 'success',
    LOGOUT: 'info',
    REFRESH_TOKEN: 'warning',
    CLIENT_LOGIN: 'secondary',
  };
  return colorMapping[type as keyof typeof colorMapping] || 'default';
};

export function ActiveSessionsTable({
  data,
  loading,
  onSuccess,
  paginationModel,
  onPaginationChange,
  rowCount,
}: ActiveSessionsTableProps) {
  const [terminateDialogOpen, setTerminateDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<ActiveSession | null>(
    null
  );

  const terminateMutation = useApiMutation<any, any>({
    url: keycloakApis.session.terminate,
    method: 'POST',
    onSuccess: () => {
      onSuccess();
      setTerminateDialogOpen(false);
      setSelectedSession(null);
    },
  });

  const handleTerminate = (session: ActiveSession) => {
    setSelectedSession(session);
    setTerminateDialogOpen(true);
  };

  const confirmTerminate = async () => {
    if (selectedSession) {
      await terminateMutation.mutateAsync({
        paginationModel: {},
        searchModel: {
          sessionId: selectedSession.id,
          username: selectedSession.username,
        },
      });
    }
  };

  const cancelTerminate = () => {
    setTerminateDialogOpen(false);
    setSelectedSession(null);
  };

  const columns: GridColDef<ActiveSession>[] = [
    {
      field: 'rowIndex',
      headerName: 'ردیف',
      flex: 0.5,
      renderCell: params => {
        const page = paginationModel.page;
        const pageSize = paginationModel.pageSize;
        return (
          page * pageSize +
          params.api.getRowIndexRelativeToVisibleRows(params.id) +
          1
        );
      },
    },
    {
      field: 'username',
      headerName: 'نام کاربری',
      flex: 1,
    },
    {
      field: 'time',
      headerName: 'زمان',
      flex: 1.5,
      valueFormatter: value => formatDate(value),
    },
    {
      field: 'type',
      headerName: 'نوع فعالیت',
      flex: 1,
      renderCell: params => (
        <Chip
          label={getSessionTypeLabel(params.value)}
          color={getSessionTypeColor(params.value) as any}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'عملیات',
      flex: 0.8,
      renderCell: params => (
        <ActionButtons
          session={params.row}
          onTerminate={handleTerminate}
          loading={terminateMutation.isPending}
        />
      ),
    },
  ];

  // Transform data for MatnaDataGrid
  const rows = data.map((session, index) => ({
    id: session.id || `session-${index}-${session.username}`,
    ...session,
  }));

  return (
    <Box>
      {terminateMutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          خطا در خاتمه نشست:{' '}
          {terminateMutation.error?.response?.data?.message || 'خطای ناشناخته'}
        </Alert>
      )}

      <MatnaDataGrid
        rows={rows}
        columns={columns}
        loading={loading || terminateMutation.isPending}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationChange}
        rowCount={rowCount}
        paginationMode="server"
      />

      {/* Terminate Session Confirmation Dialog */}
      <Dialog
        open={terminateDialogOpen}
        onClose={cancelTerminate}
        aria-labelledby="terminate-session-dialog"
      >
        <DialogTitle id="terminate-session-dialog">
          تایید خاتمه نشست
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            آیا از خاتمه نشست کاربر <strong>{selectedSession?.username}</strong>{' '}
            اطمینان دارید؟ این عمل باعث خروج کاربر از سیستم خواهد شد.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={cancelTerminate}
            disabled={terminateMutation.isPending}
          >
            انصراف
          </Button>
          <Button
            onClick={confirmTerminate}
            color="error"
            variant="contained"
            disabled={terminateMutation.isPending}
            startIcon={<TerminateIcon />}
          >
            {terminateMutation.isPending ? 'در حال پردازش...' : 'خاتمه نشست'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

interface ActionButtonsProps {
  session: ActiveSession;
  onTerminate: (session: ActiveSession) => void;
  loading: boolean;
}

function ActionButtons({ session, onTerminate, loading }: ActionButtonsProps) {
  return (
    <Button
      variant="outlined"
      color="error"
      size="small"
      onClick={() => onTerminate(session)}
      disabled={loading}
      startIcon={<TerminateIcon />}
    >
      خاتمه نشست
    </Button>
  );
}
