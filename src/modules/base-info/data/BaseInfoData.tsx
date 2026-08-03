// src/modules/base-info/components/BaseInfoData.tsx
import  { useState, useEffect, useMemo } from 'react';
import {
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';
import { useApiQuery, useApiMutation } from '@/hooks/useApi';
import { useSnackbar } from '@/hooks/useSnackbar';
import {
  PAGINATION_DEFAULT_VALUE_OLD,
  type PaginationQueryParamOld,
} from '@/types/api';
import { useParams } from 'react-router';
import { BaseInfoDataForm } from './BaseInfoDataForm';
import { BaseInfoDataTable } from './BaseInfoDataTable';
import { BaseInfoDataEdit } from './BaseInfoDataEdit';
import { BaseInfoApis } from '@/modules/base-info/apis';
import type { baseInfoData } from './types';

type BaseInfoQueryParams = {
  id?:any;
  key?: string;
  value?: string;
  isActive?: boolean;
  description?: string;
  parentId?: number | null;
  orderNo?: number | null;
  commonBaseTypeId?: number;
};

export function BaseInfoData() {
  const snackbar = useSnackbar();
  const { className, id, title } = useParams();
  const idNum = id ? Number(id) : undefined;

  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [check, setCheck] = useState(true);
  const [description, setDescription] = useState('');
  const [orderNo, setOrderNo] = useState<number | null>(null);
  const [selectedValue, setSelectedValue] = useState<{ id: number; value: string } | null>(null);

 const [rows, setRows] = useState<baseInfoData[]>([]);
  const [editData, setEditData] = useState<baseInfoData | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [filters, setFilters] = useState<PaginationQueryParamOld<BaseInfoQueryParams>>({
    ...PAGINATION_DEFAULT_VALUE_OLD,
    key: '',
    value: '',
    isActive: undefined,
    description: '',
    parentId: id ? Number(id) : null,
    orderNo: null,
  });


  const { data: commonDataResponse } = useApiQuery<baseInfoData[], PaginationQueryParamOld<BaseInfoQueryParams>, any>({
    url: BaseInfoApis.baseInfoData.get(id ?? ''),
    params: filters,
  });



  const commonDataOptions = useMemo(() => {
    return commonDataResponse?.data?.map(item => ({
      id: Number(item.id),
      value: item.value,
    })) ?? [];

  }, [commonDataResponse]);

  useEffect(() => {
    if (!id || commonDataOptions.length === 0) return;
    const match = commonDataOptions.find(opt => opt.id.toString() === id);
    if (match) setSelectedValue({ id: Number(match.id), value: match.value });
  }, [id, commonDataOptions]);

  const { data: response, refetch } = useApiQuery<baseInfoData[], PaginationQueryParamOld<BaseInfoQueryParams>, any>({
    url: BaseInfoApis.baseInfoData.list(className ?? ''),
    params: { ...filters, commonBaseTypeId: idNum },
  });


  useEffect(() => {
    if (!response?.data) return;
    setRows(
      response.data.map((r: any, i: number) => ({
        ...r,
        rowindex: i + 1 + ((filters.currentPage ?? 1) - 1) * (filters.pageSize ?? 10),
      }))
    );

  }, [response, filters.currentPage, filters.pageSize]);

  const updateFilters = (updates: Partial<BaseInfoQueryParams>) => {
    setFilters(prev => ({ ...prev, ...updates, page: 0 }));
  };

  const handlePaginationChange = (model: any) => {
    setFilters(prev => ({ ...prev, page: model.page, size: model.pageSize }));
  };

  const createMutation = useApiMutation({
    url: BaseInfoApis.baseInfoData.save,
    method: 'POST',
  });

  const { mutate: updateMutate } = useApiMutation({
    url: BaseInfoApis.baseInfoData.update,
    method: 'PUT',
    onSuccess: () => {
      snackbar('ویرایش با موفقیت انجام شد', 'success', 3000);
      setEditOpen(false);
      refetch();

    },
        onError: () => snackbar('خطا در ویرایش داده', 'error', 3000),
  });

  const deleteMutation = useApiMutation({
    url: BaseInfoApis.baseInfoData.delete(deleteId), 
    method: 'DELETE',

  });

  // Create new base info
  const SubmitHandler = () => {
 
    createMutation.mutate(
      {

        entity: BaseInfoApis.baseInfoData.save,
        method: 'POST',
        data: {
        key,
        value,
        orderNo,
        isActive: check,
        parentId: selectedValue?.id,
        commonBaseTypeId: idNum,
        commonBaseTypeName: title,
        description,
        },
      },
      {
        onSuccess: () => {
          snackbar('عملیات با موفقیت انجام شد', 'success', 3000);
          refetch();
        },
        onError: () => snackbar('خطا در ذخیره داده', 'error', 3000),
      }
    );
  };

  const handleEditClick = (row: any) => {
    setEditData(row);
    setEditOpen(true);
  };

const handleSaveEdit = () => {
  if (!editData) return;
  updateMutate(
    {
      ...editData,
      key: editData.key ?? '',          
      value: editData.value ?? '',      
      description: editData.description ?? '',
      orderNo: editData.orderNo ?? null,
      isActive: check,                  
      parentId: selectedValue?.id,
      commonBaseTypeId: editData.commonBaseTypeId ?? idNum ?? 0,
      commonBaseTypeName: editData.commonBaseTypeName ?? title ?? '',
    },
  );
};

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!deleteId) return;
     deleteMutation.mutate(
      { id: deleteId },

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

  return (
    <Grid>
      <BaseInfoDataForm
        keyValue={key}
        value={value}
        orderNo={orderNo}
        check={check}
        description={description}
        options={commonDataOptions}
        selectedValue={selectedValue}
        idNum={idNum}
        title={title}
        setKey={setKey}
        setValue={setValue}
        setOrderNo={setOrderNo}
        setCheck={setCheck}
        setDescription={setDescription}
        onSubmit={SubmitHandler}
        setSelectedValue={setSelectedValue}
      />

      <BaseInfoDataTable
        rows={rows}
        filters={filters}
        setFilters={setFilters}
        isLoading={false}
        rowCount={response?.meta?.pagination?.count || 0}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        onPaginationModelChange={handlePaginationChange}
      />

      <BaseInfoDataEdit
        open={editOpen}
        editData={editData}
        options={commonDataOptions}
        selectedValue={selectedValue}
        setEditData={setEditData}
        onClose={() => setEditOpen(false)}
        onSave={handleSaveEdit}
        setCheck={setCheck}
        idNum={idNum}
        title={title}
        setSelectedValue={setSelectedValue}
        check={check}
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
    </Grid>
  );
}
