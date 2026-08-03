// src/components/common/DataGridWrapper.tsx
import {
  DataGrid,
  type DataGridProps,
  gridPageCountSelector,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid';
import MuiPagination from '@mui/material/Pagination';

import { Box, Paper, type TablePaginationProps } from '@mui/material';
import { faIR } from '@mui/x-data-grid/locales'; // ✅ Import built-in Persian locale

// ✅ Extract the locale text
const PERSIAN_LOCALE_TEXT = faIR.components.MuiDataGrid.defaultProps.localeText;

export interface DataGridWrapperProps<R extends Record<string, any> = any>
  extends Omit<DataGridProps<R>, 'localeText'> {
  height?: number | string;
  withPaper?: boolean;
  /**
   * Custom locale text (will be merged with default Persian locale)
   */
  localeText?: Partial<typeof PERSIAN_LOCALE_TEXT>;
}

function paginationDisplayedRows({
  from,
  to,
  count,
  estimated,
}: {
  from: number;
  to: number;
  count: number;
  estimated?: number;
}) {
  if (!estimated) {
    return `${from}–${to} از ${count !== -1 ? count : `بیشتر از ${to}`}`;
  }
  const estimatedLabel =
    estimated && estimated > to ? `حدود ${estimated}` : `بیشتر از ${to}`;
  return `${from}–${to} از ${count !== -1 ? count : estimatedLabel}`;
}

function Pagination({
  page,
  onPageChange,
  className,
}: Pick<TablePaginationProps, 'page' | 'onPageChange' | 'className'>) {
  const apiRef = useGridApiContext();
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <MuiPagination
      color="primary"
      className={className}
      count={pageCount}
      page={page + 1}
      onChange={(event, newPage) => {
        onPageChange(event as any, newPage - 1);
      }}
      siblingCount={1}
      boundaryCount={1}
    />
  );
}

export function MatnaDataGrid<R extends Record<string, any> = any>({
  height = 'auto',
  withPaper = true,
  localeText,
  disableRowSelectionOnClick = true,
  disableColumnMenu = false,
  paginationMode = 'server',
  sx,
  ...props
}: DataGridWrapperProps<R>) {
  const dataGrid = (
    <DataGrid<R>
      {...props}
      disableRowSelectionOnClick={disableRowSelectionOnClick}
      disableColumnMenu={disableColumnMenu}
      paginationMode={paginationMode}
      localeText={{
        ...PERSIAN_LOCALE_TEXT,
        paginationDisplayedRows,
        ...localeText,
      }}
      pageSizeOptions={[1, 5, 10, 25, 50, 100]}
      sx={sx}
      slotProps={{
        basePagination: {
          material: {
            ActionsComponent: Pagination,
          },
        },
      }}
    />
  );

  if (!withPaper) {
    return (
      <Box sx={{ height, width: '100%', maxWidth: '100%' }}>{dataGrid}</Box>
    );
  }

  return (
    <Paper
      sx={{
        height,
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden',
      }}
    >
      {dataGrid}
    </Paper>
  );
}
