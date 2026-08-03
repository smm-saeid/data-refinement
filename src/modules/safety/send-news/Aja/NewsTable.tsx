import React from 'react';
import {
  Box,
  Switch,
  Typography,
  IconButton,
  Paper,
  Chip,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { MatnaDataGrid } from '../../../../components/data-grid/MatnaDataGrid';

export type AwarenessClass = {
  classDate: string;
  unitName: string;
  subject: string;
  participants: string;
  instructor: string;
};

export type InspectionItem = {
  date: string;
  unit: string;
  description: string;
  result: string;
};

export type CeremonyItem = {
  date: string;
  title: string;
  location: string;
  participants: string;
  description: string;
};

export type IncidentItem = {
  date: string;
  type: string;
  location: string;
  description: string;
  actions: string;
};

export type PublicAidItem = {
  date: string;
  type: string;
  location: string;
  description: string;
  beneficiaries: string;
};

export type ImportantEventItem = {
  date: string;
  title: string;
  description: string;
  impact: string;
};

export type NewsItem = {
  id: string;
  newsletterNo: number;
  reportDate: string;
  inspection: InspectionItem[];
  ceremony: CeremonyItem[];
  incident: IncidentItem[];
  awarenessClass: AwarenessClass[];
  publicAid: PublicAidItem[];
  importantEvent: ImportantEventItem[];
  archived: boolean;
};

interface NewsTableProps {
  data: NewsItem[];
  onView: (item: NewsItem) => void;
  onEdit: (item: NewsItem) => void;
  onDelete: (id: string) => void;
  onArchiveToggle: (id: string) => void;
  formatDateForDisplay: (dateString: string) => string;
}

const NewsTable = ({
  data,
  onView,
  onEdit,
  onDelete,
  onArchiveToggle,
  formatDateForDisplay,
}: NewsTableProps) => {
  const theme = useTheme();

  const columns = [
    {
      field: 'reportDate',
      headerName: 'تاریخ',
      width: 150,
      renderCell: (params: any) => (
        <Chip
          label={formatDateForDisplay(params.value)}
          variant="outlined"
          color="primary"
          size="small"
        />
      ),
    },
    {
      field: 'newsletterNo',
      headerName: 'شماره خبرنامه',
      width: 150,
      renderCell: (params: any) => (
        <Typography variant="body2" fontWeight="bold">
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'archived',
      headerName: 'وضعیت',
      width: 120,
      renderCell: (params: any) => (
        <Tooltip title={params.value ? 'غیرفعال کردن آرشیو' : 'آرشیو کردن'}>
          <Switch
            checked={!params.value}
            onChange={() => onArchiveToggle(params.row.id)}
            color="primary"
          />
        </Tooltip>
      ),
    },
    {
      field: 'actions',
      headerName: 'عملیات',
      width: 200,
      renderCell: (params: any) => (
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
          <Tooltip title="مشاهده">
            <IconButton
              color="info"
              onClick={() => onView(params.row)}
              size="small"
            >
              <ViewIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="ویرایش">
            <IconButton
              color="primary"
              onClick={() => onEdit(params.row)}
              size="small"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="حذف">
            <IconButton
              color="error"
              onClick={() => onDelete(params.row.id)}
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <MatnaDataGrid
      rows={data}
      columns={columns}
      getRowId={row => row.id}
      initialState={{
        pagination: {
          paginationModel: { page: 0, pageSize: 10 },
        },
      }}
      sx={{
        '& .MuiDataGrid-row': {
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        },
        '& .MuiDataGrid-row.Mui-selected': {
          backgroundColor: theme.palette.action.selected,
        },
        '& .MuiDataGrid-cell': {
          borderBottom: `1px solid ${theme.palette.divider}`,
        },
      }}
      getRowClassName={params => (params.row.archived ? 'archived-row' : '')}
      localeText={{
        noRowsLabel: 'موردی یافت نشد',
        // MuiTablePagination: {
        //     labelRowsPerPage: "تعداد ردیف در صفحه:",
        // }
      }}
    />
  );
};

export default NewsTable;
