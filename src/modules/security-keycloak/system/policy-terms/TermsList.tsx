import { useState } from 'react';
import { Box, Paper, Divider, Typography, Alert } from '@mui/material';

import {
  useKeycloakApiQuery,
  useKeycloakApiMutation,
} from '../../../../hooks/useApiKeycloak';
import keycloakApis from '../../apis';
import type {
  Term,
  TermsResponse,
  CreateTermRequest,
  UpdateTermRequest,
  DeleteTermRequest,
} from '../../types';
import { TermsTable } from './TermsTable';
import { TermForm } from './TermForm';
import { TermEditModal } from './TermEditModal';
import { PAGINATION_DEFAULT_VALUE } from '@/types/api';
import {
  NotificationProvider,
  useNotification,
} from '../../NotificationContext';

export function TermsList() {
  return (
    <NotificationProvider>
      <TermsListContext />
    </NotificationProvider>
  );
}

function TermsListContext() {
  const [editingTerm, setEditingTerm] = useState<Term | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [filters, setFilters] = useState<any>({
    ...PAGINATION_DEFAULT_VALUE,
    page: 1,
    pageSize: 10,
    name: '',
    description: '',
  });

  const requestBody = {
    paginationModel: {
      offset: filters.page ? (filters.page - 1) * (filters.pageSize || 10) : 0,
      pageSize: filters.pageSize || 10,
    },
    searchModel: {
      name: filters.name || undefined,
      description: filters.description || undefined,
    },
  };
  const { showNotification } = useNotification();

  // Fetch terms
  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useKeycloakApiQuery<TermsResponse>({
    url: keycloakApis.terms.list,
    config: {
      data: requestBody,
    },
  });

  // Create mutation
  const createMutation = useKeycloakApiMutation<
    TermsResponse,
    CreateTermRequest
  >({
    url: keycloakApis.terms.create,
    method: 'POST',
    onSuccess: () => {
      showNotification('قانون با موفقیت ایجاد شد');
      refetch();
    },
    onError: error => {
      showNotification('خطا در ایجاد قانون', 'error');
    },
  });

  // Update mutation
  const updateMutation = useKeycloakApiMutation<
    TermsResponse,
    UpdateTermRequest
  >({
    url: keycloakApis.terms.update,
    method: 'POST',
    onSuccess: () => {
      showNotification('قانون با موفقیت ویرایش شد');
      refetch();
      setIsModalOpen(false);
      setEditingTerm(null);
    },
    onError: error => {
      showNotification('خطا در ویرایش قانون', 'error');
    },
  });

  // Delete mutation
  const deleteMutation = useKeycloakApiMutation<
    TermsResponse,
    DeleteTermRequest
  >({
    url: keycloakApis.terms.delete,
    method: 'POST',
    onSuccess: () => {
      showNotification('قانون با موفقیت حذف شد');
      refetch();
    },
    onError: error => {
      showNotification('خطا در حذف قانون', 'error');
    },
  });

  const handleCreate = (values: CreateTermRequest) => {
    createMutation.mutate({
      paginationModel: {},
      searchModel: values,
    });
  };

  const handleUpdate = (values: UpdateTermRequest) => {
    updateMutation.mutate({
      paginationModel: {},
      searchModel: values,
    });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate({
      paginationModel: {},
      searchModel: { id },
    });
  };

  const handleEdit = (term: Term) => {
    setEditingTerm(term);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTerm(null);
  };

  if (error) {
    return (
      <Box p={2}>
        <Alert severity="error" sx={{ mb: 2 }}>
          خطا در دریافت اطلاعات:{' '}
          {error.response?.data?.message || error.message}
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{ width: '100%', maxWidth: '100vw', p: 2, boxSizing: 'border-box' }}
    >
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          قوانین و مقررات امنیتی
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" component="h2" gutterBottom align="center">
          ثبت قوانین جدید
        </Typography>

        <TermForm
          onSubmit={handleCreate}
          isLoading={createMutation.isPending}
        />
      </Paper>

      <TermsTable
        terms={response?.data?.responseList || []}
        loading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isDeleting={deleteMutation.isPending}
      />

      <TermEditModal
        open={isModalOpen}
        term={editingTerm}
        onClose={handleCloseModal}
        onUpdate={handleUpdate}
        isLoading={updateMutation.isPending}
      />
    </Box>
  );
}
