import { MatnaDataGrid } from '@/components/data-grid/MatnaDataGrid.tsx';
import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useLegacyApi } from '@/hooks/useLegacyApi.ts';
import { Button } from '@mui/material';import type { GridColDef } from '@mui/x-data-grid';
;

const MatnaPersonnelPicker = ({ orgId, onPersonnelSelect }) => {
  const [personnel, setPersonnel] = useState([]);

  const legacyApi = useLegacyApi();


  const { data: organization } = useQuery<any, any, any>({
    queryKey: [`/organizations/id/${orgId}`],
    queryFn: () => legacyApi.get(`/organizations/id/${orgId}`),
  });

  const [paginationModel, setPaginationModel] = useState({pageSize:10, page: 0});
  const [loading, setLoading] = useState(true);

  const { mutate: fetchpersonnel } = useMutation({
    mutationFn: legacyApi.request,
  });


  useEffect(() => {
    if (organization != null) {
      {
        fetchpersonnel(
          {
            method: 'post',
            entity: 'accounts/search',
            data: {
              searchModel: { unitCode: organization.data.code },
            },
          },
          {
            onSuccess: res => {
              setPersonnel(res.responseList);
              setLoading(false);
            },
            onError: err => {
              setLoading(false);
            }
          }
        );
      }
    }
  }, [organization]);

  const columns: Array<GridColDef> = useMemo(
    () => [
      {
        field: 'fullname',
        headerName: 'نام و نام خانوادگی',
        flex: 2,
        filterable: true,
        renderCell: ({ row }: any) => {
          return row.firstName + ' ' + row.lastName;
        },
        valueGetter: (value, row) => {
          return row.firstName + ' ' + row.lastName;
        },
      },
      { field: 'degree', headerName: 'درجه', flex: 2 },
      { field: 'personnelCode', headerName: 'شماره پرسنلی', flex: 2 },
      { field: 'occupationTitle', headerName: 'عنوان', flex: 2 },
      {
        field: 'action',
        headerName: '',
        align: 'center',
        flex: 1,
        renderCell: ({ row }: any) => {
          return (
            <Button color="info" onClick={() => onPersonnelSelect(row)}>
              انتخاب
            </Button>
          );
        },
      },
    ],
    []
  );

  return (
    <div>
      <MatnaDataGrid
        loading={loading}
        rows={personnel ?? []}
        columns={columns}
        rowCount={(personnel ?? []).length}
        getRowId={row => row.personnelCode} 
        paginationMode='client'
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        filterMode='client'
      />
    </div>
  );
};

export default MatnaPersonnelPicker;
