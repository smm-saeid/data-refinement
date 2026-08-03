import React, { useState, useEffect } from 'react';
import {
  Grid,
  Box,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';
import { useApiQuery, useApiMutation } from '@/hooks/useApi';
import {
  PAGINATION_DEFAULT_VALUE_OLD,
  type PaginationQueryParamOld,
} from '@/types/api';
import { useParams } from 'react-router';
import { useSnackbar } from '@/hooks/useSnackbar';
import { BaseInfoTypeForm } from './BaseInfoTypeForm';
import { BaseInfoTypeTable } from './BaseInfoTypeTable';
import { BaseInfoTypeEdit } from './BaseInfoTypeEdit';
import { BaseInfoApis } from '@/modules/base-info/apis';
import type { BaseInfoType } from './types';

type BaseInfoTypeQueryParams = {
  title?: string;
  className?: string;
  isActive?: boolean;
  description?: string;
  parentId?: number | null;
};

export function BaseInfoType() {
  const snackbar = useSnackbar();
  const { commonBaseTypeId } = useParams<{ commonBaseTypeId?: string }>();

  const [title, setTitle] = useState('');
  const [className, setClassName] = useState('');
  const [description, setDescription] = useState('');
  const [check, setCheck] = useState(true);
  const [rows, setRows] = useState<any[]>([]);
  const [editData, setEditData] = useState<any | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedCommonBaseType, setSelectedCommonBaseType] = useState<{
    id: number;
    title: string;
  } | null>(null);

  const [filters, setFilters] = useState<
    PaginationQueryParamOld<BaseInfoTypeQueryParams>
  >({
    ...PAGINATION_DEFAULT_VALUE_OLD,
    title: '',
    className: '',
    isActive: undefined,
    description: '',
    parentId: commonBaseTypeId ? Number(commonBaseTypeId) : null,
  });


  const {
    data: commonTypeResponse,
    isLoading: commonLoading,
    error: commonError,
    refetch: refetchCommon,
  } = useApiQuery<
    BaseInfoType[],
    PaginationQueryParamOld<BaseInfoTypeQueryParams>
  >({
    url: BaseInfoApis.baseInfoType.list,
    params: filters,
  });

  const commonTypeOptions = React.useMemo(() => {
    return (
      commonTypeResponse?.data?.map(item => ({
        id: Number(item.id),
        title: item.title,
      })) ?? []
    );
  }, [commonTypeResponse]);

  useEffect(() => {
    if (!commonBaseTypeId || commonTypeOptions.length === 0) return;

    const match = commonTypeOptions.find(
      opt => opt.id.toString() === commonBaseTypeId
    );
    if (match) {
      setSelectedCommonBaseType({
        id: Number(match.id),
        title: match.title,
      });
    }
  }, [commonBaseTypeId, commonTypeOptions]);


  const {
    data: response,
    isLoading,
    error,
    refetch,
   } = useApiQuery<BaseInfoType[], PaginationQueryParamOld<BaseInfoTypeQueryParams>>({
    url: BaseInfoApis.baseInfoType.list,
    params: filters,
  });

  useEffect(() => {
    if (response?.data) {
      setRows(
        response.data.map((r: any, i: number) => ({
          ...r,
          rowindex:
            i + 1 + ((filters.currentPage ?? 1) - 1) * (filters.pageSize ?? 10),
        }))
      );
    }
  }, [response, filters]);

  const updateFilters = (updates: Partial<BaseInfoTypeQueryParams>) => {

    setFilters(prev => ({ ...prev, ...updates, page: 1 }));

    refetch();
  };

  const resetFilters = () => {
    setFilters({
      ...PAGINATION_DEFAULT_VALUE_OLD,
      title: '',
      className: '',
      isActive: undefined,
      description: '',
      parentId: commonBaseTypeId ? Number(commonBaseTypeId) : null,
    });
    refetch();
  };

  const handlePaginationChange = (model: { page: number; pageSize: number }) => {
    setFilters(prev => ({ ...prev, page: model.page, size: model.pageSize }));

    refetch();
  };

  const { mutate: createMutate } = useApiMutation({
    url: BaseInfoApis.baseInfoType.save,
    method: 'POST',
    onSuccess: () => {
      snackbar('عملیات با موفقیت انجام شد', 'success', 3000);
      refetch();
    },
        onError: () => snackbar('خطا در ذخیره داده', 'error', 3000),
  });

 
  const { mutate: updateMutate } = useApiMutation({
    url: BaseInfoApis.baseInfoType.update,
    method: 'PUT',
    onSuccess: () => {
      snackbar('ویرایش با موفقیت انجام شد', 'success', 3000);
      setEditOpen(false);
      refetch();
    },
    onError: () => snackbar('خطا در ویرایش داده', 'error', 3000),
  });

  
  const { mutate: deleteMutate } = useApiMutation({
    url: BaseInfoApis.baseInfoType.delete(deleteId), 
    method: 'DELETE',
    onSuccess: () => {
      snackbar('حذف با موفقیت انجام شد', 'success', 3000);
      setDeleteDialogOpen(false);
      setDeleteId(null);
      refetch();
    },
    onError: () => snackbar('خطا در حذف داده', 'error', 3000),

  });

  const SubmitHandler = () => {
    createMutate({
      title,
      className,
      isActive: check,
      description,
      parentId: selectedCommonBaseType?.id,
    });

  };

  const handleEditClick = (row: any) => {
    setEditData(row);
    setEditOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editData?.id) return;
   updateMutate(editData);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!deleteId) return;
     deleteMutate({ id: deleteId }); 
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setDeleteId(null);
  };

  if (error) {
    return (
      <Box p={2}>
        <Paper sx={{ p: 2, bgcolor: 'error.light' }}>
          خطا: {error.response?.data?.message || error.message}
        </Paper>
      </Box>
    );
  }

  return (
    <Grid>
      <BaseInfoTypeForm
        title={title}
        className={className}
        description={description}
        check={check}
        options={commonTypeOptions}
        selectedCommonBaseType={selectedCommonBaseType}
        setTitle={setTitle}
        setClassName={setClassName}
        setDescription={setDescription}
        setCheck={setCheck}
        setSelectedCommonBaseType={setSelectedCommonBaseType}
        onSubmit={() => {
          updateFilters({ title, className, description, isActive: check });
          SubmitHandler();
        }}
        onReset={resetFilters}
      />

      <BaseInfoTypeTable
        rows={rows}
        filters={filters}
        setFilters={updateFilters}
        isLoading={isLoading}
        rowCount={response?.meta?.pagination?.count || 0}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        onPaginationModelChange={handlePaginationChange}
      />

      <BaseInfoTypeEdit
        open={editOpen}
        editData={editData}
        options={commonTypeOptions}
        selectedCommonBaseType={selectedCommonBaseType}
        setEditData={setEditData}
        onClose={() => setEditOpen(false)}
        onSave={handleSaveEdit}
        setSelectedCommonBaseType={setSelectedCommonBaseType}

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
