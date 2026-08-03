import { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Button,
  Fab,
  Paper,
  Skeleton,
  Tooltip,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Grid,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useParams } from 'react-router';

import {
  PAGINATION_DEFAULT_VALUE_OLD,
  type PaginationQueryParam,
} from '@/types/api.ts';
import { useApiQuery } from '@/hooks/useApi';
import { useSnackbar } from '@/hooks/useSnackbar';
import { useMutation } from '@tanstack/react-query';
import { useLegacyApi } from '@/hooks/useLegacyApi';

interface Official {
  id?: string;
  inspectionId: string;
  degree: string;
  nameAndFamily: string;
  personNumber: string;
  organizationJob: string;
  dateAppointment: string;
}

interface OfficialsQueryParams {
  inspectionId?: string;
}

export default function SelfAssessmentConfigurationStep6({
  inspectionInformation,
  refetchStep,
}) {
  const snackbar = useSnackbar();
  const { id: inspectionId } = useParams<{ id: string }>();
  const legacyApi = useLegacyApi();
  const { mutate } = useMutation({
    mutationFn: legacyApi.request,
  });

  const [filters, setFilters] = useState<
    PaginationQueryParam<OfficialsQueryParams>
  >(() => ({
    ...PAGINATION_DEFAULT_VALUE_OLD,
    inspectionId: inspectionId,
  }));

  const [officials, setOfficials] = useState<Official[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update filters when inspectionId changes
  useEffect(() => {
    if (inspectionId) {
      setFilters(prev => ({
        ...prev,
        inspectionId: inspectionId,
        page: 1,
      }));
    }
  }, [inspectionId]);

  // Fetch existing officials
  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useApiQuery<Official[], PaginationQueryParam<OfficialsQueryParams>>({
    url: '/profile_organization_official/find-by-inspection',
    params: filters,
    enabled: !!filters.inspectionId, // Only fetch when inspectionId is available
  });

  // Initialize data when fetched
  useEffect(() => {
    if (response?.data) {
      setOfficials(response.data);
    }
  }, [response?.data]);

  // Handle field changes
  const handleFieldChange = useCallback(
    (index: number, field: keyof Official, value: string) => {
      setOfficials(prev =>
        prev.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        )
      );
    },
    []
  );

  // Add new official row
  const handleAddOfficial = () => {
    if (!inspectionId) {
      snackbar('شناسه بازرسی یافت نشد', 'error', 5000);
      return;
    }

    const newOfficial: Official = {
      inspectionId: inspectionId,
      degree: '',
      nameAndFamily: '',
      personNumber: '',
      organizationJob: '',
      dateAppointment: '',
    };

    setOfficials(prev => [...prev, newOfficial]);
  };

  // Remove official row
  const handleRemoveOfficial = useCallback((index: number) => {
    setOfficials(prev => prev.filter((_, i) => i !== index));
  }, []);

  if (error) {
    return (
      <Box p={2}>
        <Paper
          sx={{ p: 2, bgcolor: 'error.light', color: 'error.contrastText' }}
        >
          <Typography variant="body1" gutterBottom>
            خطا در دریافت اطلاعات
          </Typography>
          <Typography variant="body2" gutterBottom>
            {error.response?.data?.message || error.message}
          </Typography>
          <Button onClick={() => refetch()} variant="contained" sx={{ mt: 1 }}>
            تلاش مجدد
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{ width: '100%', maxWidth: '100vw', p: 2, boxSizing: 'border-box' }}
    >
      {/* Header */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography fontWeight={700} variant="h5">
            مشخصات ارکان مسئولین یگان
          </Typography>
        </Box>

        {!inspectionId && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            شناسه بازرسی یافت نشد. لطفا از صفحه قبلی مجددا وارد شوید.
          </Alert>
        )}
      </Paper>

      {/* Data Table */}
      {isLoading ? (
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 1 }} />
      ) : (
        <Grid container marginBottom={"100px"}>
          <TableContainer
            component={Paper}
            sx={{
              border: '1px solid #ddd',
              maxHeight: '600px',
              overflow: 'auto',
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell
                    align="center"
                    sx={{
                      border: '1px solid #ddd',
                      backgroundColor: 'primary.light',
                      color: 'primary.contrastText',
                      fontWeight: 'bold',
                    }}
                  >
                    ردیف
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      border: '1px solid #ddd',
                      backgroundColor: 'primary.light',
                      color: 'primary.contrastText',
                      fontWeight: 'bold',
                    }}
                  >
                    درجه
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      border: '1px solid #ddd',
                      backgroundColor: 'primary.light',
                      color: 'primary.contrastText',
                      fontWeight: 'bold',
                    }}
                  >
                    نام و نام خانوادگی
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      border: '1px solid #ddd',
                      backgroundColor: 'primary.light',
                      color: 'primary.contrastText',
                      fontWeight: 'bold',
                    }}
                  >
                    شماره کارگزینی
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      border: '1px solid #ddd',
                      backgroundColor: 'primary.light',
                      color: 'primary.contrastText',
                      fontWeight: 'bold',
                    }}
                  >
                    شغل سازمانی
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      border: '1px solid #ddd',
                      backgroundColor: 'primary.light',
                      color: 'primary.contrastText',
                      fontWeight: 'bold',
                    }}
                  >
                    تاریخ انتصاب
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      border: '1px solid #ddd',
                      backgroundColor: 'primary.light',
                      color: 'primary.contrastText',
                      fontWeight: 'bold',
                    }}
                  >
                    عملیات
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {officials.map((official, index) => (
                  <TableRow key={index}>
                    <TableCell align="center" sx={{ border: '1px solid #ddd' }}>
                      {index + 1}
                    </TableCell>
                    <TableCell sx={{ border: '1px solid #ddd' }}>
                      <TextField
                        value={official.degree}
                        onChange={e =>
                          handleFieldChange(index, 'degree', e.target.value)
                        }
                        placeholder="درجه"
                        fullWidth
                        size="small"
                        disabled={isSubmitting}
                      />
                    </TableCell>
                    <TableCell sx={{ border: '1px solid #ddd' }}>
                      <TextField
                        value={official.nameAndFamily}
                        onChange={e =>
                          handleFieldChange(
                            index,
                            'nameAndFamily',
                            e.target.value
                          )
                        }
                        placeholder="نام و نام خانوادگی"
                        fullWidth
                        size="small"
                        disabled={isSubmitting}
                      />
                    </TableCell>
                    <TableCell sx={{ border: '1px solid #ddd' }}>
                      <TextField
                        value={official.personNumber}
                        onChange={e =>
                          handleFieldChange(
                            index,
                            'personNumber',
                            e.target.value
                          )
                        }
                        placeholder="شماره کارگزینی"
                        fullWidth
                        size="small"
                        disabled={isSubmitting}
                      />
                    </TableCell>
                    <TableCell sx={{ border: '1px solid #ddd' }}>
                      <TextField
                        value={official.organizationJob}
                        onChange={e =>
                          handleFieldChange(
                            index,
                            'organizationJob',
                            e.target.value
                          )
                        }
                        placeholder="شغل سازمانی"
                        fullWidth
                        size="small"
                        disabled={isSubmitting}
                      />
                    </TableCell>
                    <TableCell sx={{ border: '1px solid #ddd' }}>
                      <TextField
                        value={official.dateAppointment}
                        onChange={e =>
                          handleFieldChange(
                            index,
                            'dateAppointment',
                            e.target.value
                          )
                        }
                        placeholder="تاریخ انتصاب"
                        fullWidth
                        size="small"
                        disabled={isSubmitting}
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ border: '1px solid #ddd' }}>
                      <Tooltip title="حذف">
                        <Fab
                          size="small"
                          color="error"
                          onClick={() => handleRemoveOfficial(index)}
                          disabled={isSubmitting}
                        >
                          <Delete fontSize="small" />
                        </Fab>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}

                {officials.length === 0 && !isLoading && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      align="center"
                      sx={{ border: '1px solid #ddd', py: 3 }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        هیچ مسئولی ثبت نشده است. برای افزودن مسئول جدید روی دکمه
                        + کلیک کنید.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Grid
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            size={{ md: 11 }}
          >
            <Button
              variant="contained"
              sx={{
                marginY: 1,
              }}
              onClick={handleAddOfficial}
            >
              افزودن مسئول جدید
            </Button>
            <Button
              variant="contained"
              color="success"
              sx={{
                marginY: 1,
                marginX: 1,
              }}
              onClick={handleAddOfficial}
            >
              ثبت تغییرات
            </Button>
          </Grid>
        </Grid>
      )}

      <Button
        variant="contained"
        color="error"
        // disabled
        onClick={() => {
          mutate(
            {
              entity: `/information`,
              method: 'put',
              data: {
                ...inspectionInformation,
                state: 'EKHTESAS_AFRAD',
              },
            } as any,
            {
              onSuccess: (_: any) => {
                refetchStep();
              },
              onError: () => {},
            }
          );
        }}
        sx={{ margin: '10px' }}
      >
        مرحله قبل
      </Button>

      <Button
        variant="contained"
        onClick={() => {
          mutate(
            {
              entity: `/information`,
              method: !!inspectionInformation?.id ? 'put' : 'post',
              data: {
                ...inspectionInformation,
                state: 'EKHTESAS_BAZBINEH',
              },
            } as any,
            {
              onSuccess: (_: any) => {
                refetchStep();
              },
              onError: () => {},
            }
          );
        }}
      >
        ثبت و ادامه
      </Button>
    </Box>
  );
}
