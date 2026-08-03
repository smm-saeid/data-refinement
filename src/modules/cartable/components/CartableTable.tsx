import { useRef, useState } from 'react';
import type { GridColDef } from '@mui/x-data-grid';
import {
  Box,
  Paper,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  Autocomplete,
  Grid,
  Alert,
} from '@mui/material';
import {
  ArrowForward as NextIcon,
  ArrowBack as PrevIcon,
  History as HistoryIcon,
  Visibility as VisibilityIcon,
  Attachment,
  Download,
  Upload,
  Send,
  Description,
} from '@mui/icons-material';
import { MatnaDataGrid } from '@/components/data-grid/MatnaDataGrid';
import { useApiQuery, useApiMutation } from '@/hooks/useApi';
import { PAGINATION_DEFAULT_VALUE_OLD } from '@/types/api';
import { type WorkflowItem, CartableTab } from '../types.tsx';
import CartableApis from '@/modules/cartable/apis.ts';
import { NavLink } from 'react-router';
import jalali from '@/lib/jalali';
import { TitleDivider } from '@/components/form/FormField.tsx';
import { axiosClient } from '@/lib/axios-client';
import { useSnackbar } from '@/hooks/useSnackbar.ts';
import { useLegacyApi } from '@/hooks/useLegacyApi.ts';
import { useMutation } from '@tanstack/react-query';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmBox from 'components/confirm-box/ConfirmBox.tsx';
import CartableSendNotice from 'modules/cartable/components/CartableSendNotice.tsx';

interface StepUser {
  username: string;
  firstName: string;
  lastName: string;
  fullName: string;
}

interface Step {
  id: string;
  role: string;
  roleName: string;
  stepOrder: number;
}

export default function CartableTable({ type, filters }) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [openNextDialog, setOpenNextDialog] = useState(false);
  const [openPrevDialog, setOpenPrevDialog] = useState(false);
  const [comment, setComment] = useState('');
  const [openHistory, setOpenHistory] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: PAGINATION_DEFAULT_VALUE_OLD.currentPage - 1,
    pageSize: PAGINATION_DEFAULT_VALUE_OLD.pageSize,
  });
  const [nextSteps, setNextSteps] = useState<Step[]>([]);
  const [prevSteps, setPrevSteps] = useState<Step[]>([]);
  const [selectedRole, setSelectedRole] = useState<Step | null>(null);
  const [selectedUser, setSelectedUser] = useState<StepUser | null>(null);
  const [roleUsers, setRoleUsers] = useState<Record<string, StepUser[]>>({});
  const [loadingNavigation, setLoadingNavigation] = useState(false);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [actionType, setActionType] = useState(null);
  const snackbar = useSnackbar();
  const legacyApi = useLegacyApi();
  const [file, setFile] = useState<File | null>(null);
  const uploadRef = useRef<HTMLInputElement>(null);
  const uploadRef2 = useRef<HTMLInputElement>(null);
  const [uploadDescription, SetUploadDescription] = useState('');
  const [myId, setMyId] = useState<string | null>(null);
  const [selectedAttachmentItem, setSelectedAttachmentItem] = useState(null);
  const [showNoticeDialog, setShowNoticeDialog] = useState(false);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState('');
  useState(false);

  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useApiQuery({
    url:
      type === CartableTab.NOTICE.key
        ? CartableApis.notices
        : CartableApis.list,
    params: {
      pageSize: paginationModel.pageSize,
      currentPage: paginationModel.page + 1,
      tab: type,
      q: filters?.search,
    },
  });

  const changeStepMutation = useApiMutation({
    url: CartableApis.changeStep,
    method: 'PUT',
    config: {
      params: {
        cartableId: selectedItemId,
        comment: comment || null,
        stepGoalId: selectedRole?.id,
        recipient: selectedUser?.username,
        actionType,
      },
    },
  });

  const finalApproveMutation = useApiMutation({
    url: CartableApis.finalApprove,
    method: 'PUT',
    config: {
      params: {
        cartableId: selectedItemId,
      },
    },
  });

  const { data: historyResponse, isLoading: historyLoading } = useApiQuery({
    url: CartableApis.history,
    params: { cartableId: selectedItemId },
    enabled: !!selectedItemId && openHistory,
  });

  const {
    data: showReport,
    isLoading: showReportLoading,
    refetch: showReportRefetch,
  } = useApiQuery({
    url: CartableApis.attachments(documentId),
    enabled: !!documentId,
  });

  const { mutate: mutateFile } = useMutation({
    mutationFn: legacyApi.requestFile,
  });

  const fetchNavigationAndUsers = async (
    cartableId: string,
    isNext: boolean,
    flowRuleSectionId?: string
  ) => {
    setLoadingNavigation(true);
    try {
      const navResponse = await axiosClient.get(
        CartableApis.stepNavigation(cartableId),
        { params: { flowRuleSectionId } }
      );
      const steps = isNext
        ? navResponse.data.nextSteps
        : navResponse.data.previousSteps;

      if (isNext) {
        setNextSteps(steps || []);
      } else {
        setPrevSteps(steps || []);
      }

      if (steps?.length > 0) {
        const usersMap: Record<string, StepUser[]> = {};

        await Promise.all(
          steps.map(async (step: Step) => {
            try {
              const userResponse = await axiosClient.get(
                CartableApis.getUsersByRole(step.role)
              );
              usersMap[step.role] = userResponse.data || [];
            } catch (e) {
              usersMap[step.role] = [];
            }
          })
        );

        setRoleUsers(usersMap);
      }
    } catch (e) {
      console.error('Error fetching navigation:', e);
    } finally {
      setLoadingNavigation(false);
    }
  };

  const handleNextStepClick = (item: WorkflowItem) => {
    setSelectedItemId(item.id);
    setComment('');
    setSelectedRole(null);
    setSelectedUser(null);
    setNextSteps([]);
    setRoleUsers({});
    setOpenNextDialog(true);
    fetchNavigationAndUsers(item.id, true, item.flowRuleSectionId);
  };

  const handlePrevStepClick = (item: WorkflowItem) => {
    setSelectedItemId(item.id);
    setComment('');
    setSelectedRole(null);
    setSelectedUser(null);
    setPrevSteps([]);
    setRoleUsers({});
    setOpenPrevDialog(true);
    fetchNavigationAndUsers(item.id, false, item.flowRuleSectionId);
  };

  const handleShowHistory = (id: string) => {
    setSelectedItemId(id);
    setOpenHistory(true);
  };

  const handleShowReport = (id: string) => {
    setDocumentId(id);
    setShowReportModal(true);
    showReport;
    setMyId(id);
  };

  const handleUpload = async (uploadFile: File | null) => {
    const formData = new FormData();
    if (!!uploadFile) {
      formData.append('file', uploadFile);
      formData.append('description', uploadDescription);
      mutateFile(
        {
          entity: `api/file-storages/upload-file/${myId}`,
          method: 'POST',
          data: formData,
        } as any,
        {
          onSuccess: () => {
            snackbar('آپلود با موفقیت انجام شد', 'success', 5000);
            showReportRefetch();
          },
          onError: () => {
            snackbar('خطا در آپلود فایل', 'error', 5000);
          },
        }
      );
    }
  };

  const handleUploadButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!uploadRef || !uploadRef.current) return;
    uploadRef.current.click();
  };

  const handleUploadDescription = (text: string) => {
    SetUploadDescription(text);
  };

  const handleDetailsRouting = (
    entityName: string,
    documentId: string,
    operationType: string
  ) => {
    if (operationType != null) {
      switch (operationType) {
        case 'CONFIRM_PERSON_SPECIALITY_UNIT_BARNAMEI_SYSTEMATIC':
          return `/operation/scheduled-inspection/assign-inspector/${documentId}`;
        default:
          return '#';
      }
    }
    switch (entityName) {
      case 'AnnualPlanning':
        return `/operation/planning/aja/${documentId}/PLANNING`;
      case 'Inspection':
        return `/operation/scheduled-inspection/start-configuration/${documentId}`;
      case 'Instruction':
        return `/operation/scheduled-inspection/start-configuration/${documentId}`;
      case 'ExpertSupervision-scope':
        return `/operation/planning/scope`;
      case 'ExpertSupervision-supervision':
        return `/operation/planning/deputy`;
      default:
        return '#';
    }
  };

  const handleDownload = async (id: string) => {
    // setDownloadId(id);
    // downloadFile;
    const response = await axiosClient.get(CartableApis.downloadFile(id), {
      responseType: 'blob',
    });
    const blob = response.data;
    const blobUrl = URL.createObjectURL(blob);

    const fileDetails = showReport?.data.find(e => e.id == id);
    const fullFileName = `${fileDetails?.fileName}`;
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fullFileName;
    link.click();
  };

  const handleManageDescription = (row: any) => {
    setSelectedDescription(row.description);
    setShowDescriptionModal(true);
  };

  const handleRemoveAttachment = async (id: string) => {
    await axiosClient.delete(CartableApis.removeAttachment(id));
    showReportRefetch();
    setSelectedAttachmentItem(null);
  };

  const handleFinalApprove = async () => {
    try {
      await finalApproveMutation.mutateAsync({});

      setOpenNextDialog(false);
      setOpenPrevDialog(false);
      setComment('');
      setSelectedRole(null);
      setSelectedUser(null);
      await refetch();
    } catch (e) {
      console.error('خطا در تایید نهایی:', e);
    }
  };

  const handleSubmitChangeStep = async (_actionType: 'APPROVE' | 'REJECT') => {
    if (!selectedItemId || !selectedRole || !selectedUser) return;

    setActionType(_actionType);

    try {
      await changeStepMutation.mutateAsync({});

      setOpenNextDialog(false);
      setOpenPrevDialog(false);
      setComment('');
      setSelectedRole(null);
      setSelectedUser(null);
      await refetch();
    } catch (e) {
      console.error('خطا در تغییر مرحله:', e);
    }
  };

  const handleCloseDialog = () => {
    setOpenNextDialog(false);
    setOpenPrevDialog(false);
    setComment('');
    setSelectedRole(null);
    setSelectedUser(null);
    setNextSteps([]);
    setPrevSteps([]);
    setRoleUsers({});
  };

  const availableSteps = openNextDialog ? nextSteps : prevSteps;
  const availableUsers = selectedRole ? roleUsers[selectedRole.role] || [] : [];

  const columns: GridColDef<WorkflowItem>[] = [
    { field: 'title', headerName: 'عنوان', flex: 1.5 },
    {
      field: 'sender',
      headerName: 'فرستنده',
      flex: 1,
      renderCell: params => (
        <Box display="flex" flexDirection="column">
          <Typography variant="body2">
            {params.row.senderName} {params.row.senderLastname}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.senderRole}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'recipient',
      headerName: 'گیرنده',
      flex: 1,
      renderCell: params => (
        <Box display="flex" flexDirection="column">
          <Typography variant="body2">
            {params.row.recipientName} {params.row.recipientLastname}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.recipientRole}
          </Typography>
        </Box>
      ),
    },
    { field: 'flowRuleName', headerName: 'جریان کاری', flex: 1 },
    {
      field: 'state',
      headerName: 'وضعیت',
      flex: 1,
      renderCell: params => (
        <Chip
          label={getStateLabel(params.value)}
          color={getStateColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: 'sendDate',
      headerName: 'تاریخ ارسال',
      flex: 1,
      valueFormatter: value => jalali.timestampToJalali(value),
    },
    {
      field: 'description',
      headerName: 'توضیحات',
      align: 'center',
      flex: 0.6,
      renderCell: params => (
        <Tooltip title="توضیحات کارتابل">
          <IconButton
            size="small"
            color="info"
            onClick={() => handleManageDescription(params.row)}
          >
            <Description fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
    {
      field: 'actions',
      headerName: 'عملیات',
      minWidth: 200,
      sortable: false,
      filterable: false,
      renderCell: params => (
        <Box>
          {type == CartableTab.PENDING.key &&
            params?.row?.type != 'TO_NOTIFY' && (
              <Tooltip title="مرحله قبل">
                <IconButton
                  size="small"
                  color="warning"
                  onClick={() => handlePrevStepClick(params.row)}
                >
                  <NextIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          {type == CartableTab.PENDING.key &&
            params?.row?.type != 'TO_NOTIFY' && (
              <Tooltip title="مرحله بعد">
                <IconButton
                  size="small"
                  color="success"
                  onClick={() => handleNextStepClick(params.row)}
                >
                  <PrevIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          <Tooltip title="گردش مدرک">
            <IconButton
              size="small"
              color="warning"
              onClick={() => handleShowHistory(params.row.id)}
            >
              <HistoryIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="جزییات">
            {type !== CartableTab.NOTICE.key && (
              <NavLink
                to={handleDetailsRouting(
                  params.row.entityName,
                  params.row.documentId,
                  params.row.operation
                )}
              >
                <IconButton size="small" color="info">
                  <VisibilityIcon fontSize="small" />
                </IconButton>
              </NavLink>
            )}
          </Tooltip>
          <Tooltip title="مشاهده پیوست ها">
            <IconButton
              size="small"
              onClick={() => {
                handleShowReport(params.row.documentId);
              }}
            >
              <Attachment fontSize="small" />
            </IconButton>
          </Tooltip>
          {type == CartableTab.PENDING.key &&
            params?.row?.type == 'TO_NOTIFY' && (
              <Tooltip title="ابلاغ">
                <IconButton
                  size="small"
                  color="success"
                  onClick={() => {
                    setSelectedItem(params?.row);
                    setShowNoticeDialog(true);
                  }}
                >
                  <Send fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
        </Box>
      ),
    },
  ];

  const showReportColumns: GridColDef<WorkflowItem>[] = [
    {
      field: 'key',
      headerName: 'فایل',
      flex: 5,
      renderCell: params => {
        return <Chip label={params.row.description} />;
      },
    },
    {
      field: 'action',
      headerName: 'عملیات',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      renderCell: params => (
        <>
          {params.row.link ? (
            <Tooltip title="مشاهده گردش کار">
              <NavLink to={params.row.link}>
                <IconButton size="small" color="info">
                  <VisibilityIcon fontSize="small" />
                </IconButton>
              </NavLink>
            </Tooltip>
          ) : null}
          {params.row.fileName ? (
            <Tooltip title="دانلود">
              <IconButton
                size="small"
                color="info"
                onClick={() => {
                  handleDownload(params.row.id);
                }}
              >
                <Download fontSize="small" />
              </IconButton>
            </Tooltip>
          ) : null}
          <Tooltip title="حذف">
            <IconButton
              size="small"
              color="error"
              onClick={() => {
                setSelectedAttachmentItem(params.row);
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  if (error) {
    return (
      <Box p={2}>
        <Paper sx={{ p: 2, bgcolor: 'error.light' }}>
          <Typography color="error.contrastText">
            خطا: {error.response?.data?.message || error.message}
          </Typography>
        </Paper>
      </Box>
    );
  }

  const renderDialogContent = (isNext: boolean) => {
    if (loadingNavigation) {
      return <Typography>در حال بارگذاری...</Typography>;
    }

    if (!isNext && prevSteps.length === 0) {
      return (
        <Alert severity="warning" sx={{ mt: 1 }}>
          این وظیفه در اولین مرحله قرار دارد و امکان بازگشت به مرحله قبل وجود
          ندارد.
        </Alert>
      );
    }

    if (isNext && nextSteps.length === 0) {
      return (
        <Grid container justifyContent="center" alignItems="center" spacing={2}>
          <Button
            onClick={() => handleFinalApprove()}
            variant="contained"
            color="success"
          >
            تایید نهایی
          </Button>
        </Grid>
      );
    }

    return (
      <Box>
        <Grid container spacing={2}>
          <TitleDivider label="ارجاع به" />
          <Grid size={{ xs: 12, md: 6 }}>
            <Autocomplete
              options={availableSteps}
              getOptionLabel={option => option.roleName}
              value={selectedRole}
              onChange={(_, newValue) => {
                setSelectedRole(newValue);
                setSelectedUser(null);
              }}
              renderInput={params => <TextField {...params} label="نقش" />}
              sx={{ pt: 1 }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Autocomplete
              options={availableUsers}
              getOptionLabel={option => option.fullName}
              value={selectedUser}
              onChange={(_, newValue) => setSelectedUser(newValue)}
              disabled={!selectedRole}
              renderInput={params => <TextField {...params} label="کاربر" />}
              sx={{ pt: 1 }}
            />
          </Grid>
          <TitleDivider label="توضیحات" />
          <Grid size={{ xs: 12 }}>
            <TextField
              label="توضیحات"
              multiline
              minRows={3}
              fullWidth
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
          </Grid>
        </Grid>
      </Box>
    );
  };

  return (
    <>
      <MatnaDataGrid
        rows={response?.data || []}
        columns={columns}
        loading={isLoading}
        paginationModel={paginationModel}
        rowCount={response?.meta?.pagination?.count || 0}
        onPaginationModelChange={setPaginationModel}
      />

      <Dialog
        open={openNextDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>ارسال به مرحله بعد</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {renderDialogContent(true)}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            {nextSteps.length === 0 && !loadingNavigation ? 'بستن' : 'انصراف'}
          </Button>
          {nextSteps.length > 0 && (
            <Button
              onClick={() => handleSubmitChangeStep('APPROVE')}
              variant="contained"
              color="success"
              disabled={
                changeStepMutation.isPending || !selectedRole || !selectedUser
              }
            >
              تایید و ارسال
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Dialog
        open={openPrevDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>بازگشت به مرحله قبل</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {renderDialogContent(false)}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            {prevSteps.length === 0 && !loadingNavigation ? 'بستن' : 'انصراف'}
          </Button>
          {prevSteps.length > 0 && (
            <Button
              onClick={() => handleSubmitChangeStep('REJECT')}
              variant="contained"
              color="warning"
              disabled={
                changeStepMutation.isPending || !selectedRole || !selectedUser
              }
            >
              تایید و بازگشت
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Dialog
        open={openHistory}
        onClose={() => setOpenHistory(false)}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle color="info">گردش مدرک</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {historyLoading && (
            <Typography variant="body2" color="text.secondary">
              در حال بارگذاری...
            </Typography>
          )}

          {!historyLoading &&
            (!historyResponse?.data || historyResponse.data.length === 0) && (
              <Typography variant="body2" color="text.secondary">
                تاریخچه‌ای ثبت نشده است.
              </Typography>
            )}

          <List sx={{ mt: 1 }}>
            {historyResponse?.data?.map(item => (
              <ListItem
                key={item.id}
                sx={{
                  mb: 1.5,
                  border: '1px solid',
                  borderColor: 'skyblue',
                  borderRadius: 2,
                  alignItems: 'flex-start',
                }}
              >
                <ListItemText
                  primary={
                    <Box display="flex" justifyContent="space-between">
                      <Box fontSize={18} fontWeight={600}>
                        کاربر: {item.user}
                      </Box>
                      <Box fontSize={18} fontWeight={600}>
                        نام: {item.userFirstName}
                      </Box>
                      <Box fontSize={18} fontWeight={600}>
                        نام خانوادگی: {item.userLastName}
                      </Box>
                      <Box fontSize={18} fontWeight={600}>
                        نقش: {item.userRoleName}
                      </Box>
                      <Box fontSize={18} color="text.secondary">
                        تاریخ:{' '}
                        {new Date(item.actionDate).toLocaleString('fa-IR')}
                      </Box>
                    </Box>
                  }
                  secondary={
                    <Box mt={1}>
                      <Box fontSize={18}>
                        نوع عملیات: {getActionLabel(item.actionType)}
                      </Box>
                      <Box fontSize={18} color="text.secondary" mt={0.5}>
                        توضیح: {item.comment || '-'}
                      </Box>
                    </Box>
                  }
                  slotProps={{
                    secondary: {
                      component: 'div',
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
          <Button
            onClick={() => setOpenHistory(false)}
            sx={{
              margin: '10px',
            }}
            color="error"
            variant="contained"
          >
            بستن
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showReportModal}
        onClose={() => setShowReportModal(false)}
        fullWidth
        maxWidth={'md'}
      >
        <Grid display={"flex"} justifyContent={"space-between"}>
          <DialogTitle>پیوست ها</DialogTitle>
          <Button
            onClick={() => setShowReportModal(false)}
            sx={{
              margin: '10px',
            }}
            color="error"
            variant="contained"
          >
            بستن
          </Button>
        </Grid>
        <DialogContent>
          {showReportLoading && (
            <Typography variant="body2" color="text.secondary">
              در حال بارگذاری...
            </Typography>
          )}

          {!showReportLoading &&
            (!showReport?.data || showReport.data.length === 0) && (
              <Typography variant="body2" color="text.secondary">
                پیوستی موجود نمی باشد
              </Typography>
            )}
          <TitleDivider label="بارگذاری مدارک" />

          <Box display={'flex'} margin={'10px'}>
            <Button
              size="small"
              variant={file ? 'contained' : 'text'}
              color={file ? 'primary' : 'info'}
              endIcon={<Upload />}
              sx={{
                justifyContent: 'flex-end',
                margin: '10px',
                paddingX: '30px',
              }}
              onClick={handleUploadButton}
            >
              آپلود فایل
            </Button>
            <input
              hidden
              ref={uploadRef}
              type="file"
              aria-label="kopk"
              onChange={e => {
                setFile(!!e.target.files ? e.target.files[0] : null);
              }}
            />
            <input
              hidden
              ref={uploadRef2}
              type="file"
              aria-label="kopk"
              onChange={e => {
                setFile(!!e.target.files ? e.target.files[0] : null);
              }}
            />
            <TextField
              fullWidth
              label={'توضیحات'}
              sx={{ margin: '10px' }}
              value={uploadDescription}
              onChange={e => handleUploadDescription(e.target.value)}
            />
          </Box>
          <Box
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            marginTop={'10px'}
          >
            <Button
              color="success"
              variant="contained"
              onClick={() => {
                if (!!file) {
                  handleUpload(file);
                } else {
                  snackbar(
                    'لطفا ابتدا فایل را بارگذاری کنید.',
                    'warning',
                    5000
                  );
                }
              }}
            >
              تایید نهایی
            </Button>
          </Box>
          <TitleDivider label="لیست پیوست ها" />
          <MatnaDataGrid
            rows={showReport?.data || []}
            columns={showReportColumns}
            loading={showReportLoading}
            paginationModel={{
              page: showReport?.meta?.pagination?.currentPage || 1,
              pageSize: showReport?.meta?.pagination?.pageSize || 10,
            }}
            rowCount={showReport?.meta?.pagination?.count || 0}
          />
        </DialogContent>
      </Dialog>

      <ConfirmBox
        open={!!selectedAttachmentItem}
        handleClose={() => setSelectedAttachmentItem(null)}
        handleSubmit={() => handleRemoveAttachment(selectedAttachmentItem.id)}
        title="حذف پیوست"
        message="آیا از حذف پیوست اطمینان دارید؟"
      />

      <Dialog
        open={showNoticeDialog}
        onClose={() => setShowNoticeDialog(false)}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>انتخاب یگان جهت ابلاغ</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <CartableSendNotice
            cartableId={selectedItem?.id}
            flowRuleId={selectedItem?.flowRuleId}
            onClose={() => setShowNoticeDialog(false)}
            onSuccess={() => refetch()}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={showDescriptionModal}
        onClose={() => setShowDescriptionModal(false)}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle color="info">توضیحات</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {isLoading && (
            <Typography variant="body2" color="text.secondary">
              در حال بارگذاری...
            </Typography>
          )}

          {!isLoading && (!response?.data || response.data.length === 0) && (
            <Typography variant="body2" color="text.secondary">
              تاریخچه‌ای ثبت نشده است.
            </Typography>
          )}
          <Grid
            display={'flex'}
            justifyContent={'center'}
            border={'1px solid'}
            borderColor={'skyblue'}
            borderRadius={5}
            p={5}
          >
            <Typography variant="h6" fontSize={15} color="textDisabled" mr={1}>
              توضیحات مربوطه کارتابل ارجاعی یا ابلاغیه:
            </Typography>
            <Typography>
              {selectedDescription
                ? selectedDescription
                : 'برای این مورد توضیحاتی ثبت نشده است.'}
            </Typography>
          </Grid>
          <Button
            onClick={() => setShowDescriptionModal(false)}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '10px',
            }}
            color="error"
            variant="contained"
          >
            بستن
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}

function getStateLabel(state): string {
  const labels = {
    IN_PROGRESS: 'جاری',
    SENT: 'ارسال‌شده',
    APPROVED: 'به اتمام رسیده',
    RETURNED: 'برگشت خورده',
  } as const;
  return (labels as any)[state] ?? state;
}

function getActionLabel(action): string {
  const labels = {
    APPROVE: 'تایید',
    REJECT: 'عدم تایید',
    SUBMIT: 'ارسال',
  } as const;
  return (labels as any)[action] ?? action;
}

function getStateColor(
  state
):
  | 'default'
  | 'primary'
  | 'secondary'
  | 'error'
  | 'info'
  | 'success'
  | 'warning' {
  const labels = {
    IN_PROGRESS: 'primary',
    SENT: 'info',
    APPROVED: 'success',
    RETURNED: 'error',
  } as const;
  return (labels as any)[state] ?? 'default';
}
