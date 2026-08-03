import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useApiQuery } from '@/hooks/useApi.ts';
import { MatnaDataGrid } from '@/components/data-grid/MatnaDataGrid.tsx';
import type { GridPaginationModel } from '@mui/x-data-grid';

const PaginatedMatnaDataGrid = ({
  url,
  params,
  columns,
  numberOfRowsInPage,
  refetchKey,
}: {
  url: string;
  params: any;
  columns: Array<any>;
  numberOfRowsInPage: number;
  refetchKey?: number;
}) => {
  const [paginationFilters, setPaginationFilters] = useState({
    currentPage: 1,
    pageSize: numberOfRowsInPage,
  });

  const { data, status, isLoading } = useApiQuery({
    url: url,
    params: {
      ...paginationFilters,
      ...params,
    },
    queryKey: ['grid', url, paginationFilters, params, refetchKey],
  });

  const handlePaginationModelChange = (model: GridPaginationModel) => {
    setPaginationFilters(prev => ({
      currentPage: model.page + 1,
      pageSize: model.pageSize,
    }));
  };

  useEffect(() => {
    setPaginationFilters({ currentPage: 1, pageSize: numberOfRowsInPage });
  }, [JSON.stringify(params), numberOfRowsInPage]);

  return  <MatnaDataGrid
    rows={data?.data as Array<any> ?? []}
    columns={columns}
    loading={isLoading}
    rowCount={data?.meta?.pagination?.count ?? 0}
    paginationMode={'server'}
    paginationModel={{
      page: paginationFilters.currentPage - 1,
      pageSize: paginationFilters.pageSize,
    }}
    onPaginationModelChange={handlePaginationModelChange}
    autoHeight
    getRowId={row => row.id}
  />;
};

export default PaginatedMatnaDataGrid;
