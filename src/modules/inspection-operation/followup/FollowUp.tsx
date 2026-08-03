import { useState, useMemo } from 'react';
import { Grid, Box, Paper, Button, Typography, Skeleton, Chip, Alert } from '@mui/material';
import { useApiQuery } from '@/hooks/useApi';
import { PAGINATION_DEFAULT_VALUE_OLD, type PaginationQueryParamOld } from '@/types/api';
import { useParams, useNavigate } from 'react-router';
import { MatnaDataGrid } from '@/components/data-grid/MatnaDataGrid';
import type {GridColDef, GridRenderCellParams} from '@mui/x-data-grid';
import InspectionApis from '../api';

type InspectionQueryParams = {
    status?: string;
    season?: string;
    organizationUnitName?: string;
    forceOrganizationUnitName?: string;
};

type PaginationModel = {
    page: number;
    pageSize: number;
};

export const inspection_status: Record<string, string> = {
    "not executed": "اجرا نشده",
    "under execution": "در حین اجرا",
    "executed": "اجرا شده",
    "in progress": "در حال انجام",
    "pending": "در انتظار",
    "completed": "تکمیل شده",
    "cancelled": "لغو شده",
    "draft": "پیش‌نویس",
};

export const inspection_period: Record<string, string> = {
    "first_season": "سه‌ماهه اول",
    "secound_season": "سه‌ماهه دوم",
    "THREE_SEASON": "سه‌ماهه سوم",
    "FOUR_SEASON": "سه‌ماهه چهارم",
    "null": "تعیین نشده",
    "undefined": "تعیین نشده",
};

const getStatusColor = (status: string): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    const statusLower = status?.toLowerCase();

    if (statusLower?.includes('executed') && !statusLower?.includes('not')) {
        return 'success';
    }
    if (statusLower?.includes('not executed')) {
        return 'error';
    }
    if (statusLower?.includes('progress') || statusLower?.includes('under execution')) {
        return 'warning';
    }
    if (statusLower?.includes('pending')) {
        return 'info';
    }
    if (statusLower?.includes('completed')) {
        return 'success';
    }
    if (statusLower?.includes('cancelled')) {
        return 'error';
    }
    return 'default';
};

export default function Followup() {
    const navigate = useNavigate();
    const { type } = useParams<{ type?: string }>();

    const [filters, setFilters] = useState<PaginationQueryParamOld<InspectionQueryParams>>({
        ...PAGINATION_DEFAULT_VALUE_OLD,
        currentPage: 1,
        pageSize: 10,
    });

    const {
        data: response,
        isLoading,
        error,
        refetch,
    } = useApiQuery<any, PaginationQueryParamOld<InspectionQueryParams>>({
        url: InspectionApis.FollowUp.list,
        params: filters,
    });

    const itemFilter = ["not executed", "cancelled"];

    const filteredData = useMemo(() => {
        // اگر خطا وجود دارد یا دیتا وجود ندارد، آرایه خالی برگردان
        if (error) return [];

        const template = response?.data;
        if (!template || !Array.isArray(template)) return [];
        return template.filter((item: any) => !itemFilter.includes(item.status));
    }, [response?.data, error]);

    const paginationInfo = useMemo(() => {
        let currentPage = filters.currentPage;
        let pageSize = filters.pageSize;
        let totalCount = filteredData.length;

        if (response?.data?.pagination) {
            currentPage = response.data.pagination.currentPage || filters.currentPage;
            pageSize = response.data.pagination.pageSize || filters.pageSize;
            totalCount = response.data.pagination.totalCount || filteredData.length;
        }

        return { currentPage, pageSize, totalCount };
    }, [response, filters, filteredData]);

    const rowsWithIndex = useMemo(() => {
        const { currentPage, pageSize } = paginationInfo;
        return filteredData.map((row: any, index: number) => ({
            ...row,
            rowNumber: index + 1 + ((currentPage - 1) * pageSize)
        }));
    }, [filteredData, paginationInfo]);

    const handlePaginationChange = (model: PaginationModel) => {
        setFilters(prev => ({
            ...prev,
            currentPage: model.page + 1,
            pageSize: model.pageSize
        }));
    };

    const formatExecutionDate = (timestamp: number): string => {
        if (!timestamp) return '-';
        try {
            const date = new Date(timestamp);
            return date.toLocaleDateString('fa-IR');
        } catch (e) {
            return '-';
        }
    };

    const handleViewDetails = (row: any) => {
        navigate(`/operation/planning/followup/FollowupDetails/${row.id}`, {
            state: {
                inspectionId: row.id,
                inspectionData: row
            }
        });
    };

    const columns = useMemo<GridColDef[]>(
        () => [
            {
                headerName: 'ردیف',
                field: 'rowNumber',
                width: 80,
                align: 'center',
                headerAlign: 'center',
                sortable: false,
                renderCell: (params: GridRenderCellParams) => {
                    return (
                        <Typography variant="body2" fontWeight="medium">
                            {params.value}
                        </Typography>
                    );
                },
            },
            {
                headerName: 'زمان اجرا',
                field: 'season',
                flex: 1,
                minWidth: 120,
                align: 'center',
                headerAlign: 'center',
                renderCell: (params: GridRenderCellParams) => {
                    const seasonValue = params.row.season ? String(params.row.season) : 'null';
                    const persianText = inspection_period[seasonValue as keyof typeof inspection_period] || params.row.season || '-';
                    return (
                        <Typography variant="body2">
                            {persianText}
                        </Typography>
                    );
                },
            },
            {
                headerName: 'تاریخ اجرا',
                field: 'executionDate',
                flex: 1,
                minWidth: 120,
                align: 'center',
                headerAlign: 'center',
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="body2" dir="ltr">
                        {formatExecutionDate(params.row.executionDate)}
                    </Typography>
                ),
            },
            {
                headerName: 'نیرو',
                field: 'forceOrganizationUnitName',
                flex: 1,
                minWidth: 120,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="body2">
                        {params.row.forceOrganizationUnitName || '-'}
                    </Typography>
                ),
            },
            {
                headerName: 'نوع بازرسی',
                field: 'annualPlanInspectionName',
                flex: 1.5,
                minWidth: 150,
                renderCell: (params: GridRenderCellParams) => (
                    <Typography variant="body2">
                        {params.row.annualPlanInspectionName || '-'}
                    </Typography>
                ),
            },
            {
                headerName: 'وضعیت',
                field: 'status',
                flex: 1,
                minWidth: 130,
                align: 'center',
                headerAlign: 'center',
                renderCell: (params: GridRenderCellParams) => {
                    const statusKey = params.row.status ? String(params.row.status) : '';
                    const persianStatus = inspection_status[statusKey as keyof typeof inspection_status] || params.row.status || '-';
                    return (
                        <Chip
                            label={persianStatus}
                            color={getStatusColor(params.row.status)}
                            size="small"
                            sx={{
                                minWidth: '100px',
                                fontWeight: 'medium'
                            }}
                        />
                    );
                },
            },
            {
                headerName: 'عملیات',
                field: 'actions',
                flex: 1,
                minWidth: 150,
                align: 'center',
                headerAlign: 'center',
                sortable: false,
                renderCell: (params: GridRenderCellParams) => {
                    const getButtonText = () => {
                        switch (type) {
                            case 'start':
                                return 'شروع پیگیری';
                            case 'finished':
                                return 'مشاهده جزییات پیگیری';
                            default:
                                return 'مشاهده جزییات پیگیری';
                        }
                    };

                    const getButtonColor = () => {
                        switch (type) {
                            case 'start':
                                return 'success';
                            case 'finished':
                                return 'info';
                            default:
                                return 'primary';
                        }
                    };

                    return (
                        <Button
                            variant="contained"
                            color={getButtonColor()}
                            size="small"
                            onClick={() => handleViewDetails(params.row)}
                            sx={{
                                minWidth: '130px',
                                fontSize: '0.75rem',
                                py: 0.5,
                            }}
                        >
                            {getButtonText()}
                        </Button>
                    );
                },
            },
        ],
        [type, navigate]
    );

    // نمایش خطا در صورت وجود
    if (error) {
        console.error('API Error:', error);
        return (
            <Box p={2}>
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    action={
                        <Button color="inherit" size="small" onClick={() => refetch()}>
                            تلاش مجدد
                        </Button>
                    }
                >
                    <Typography variant="subtitle1" fontWeight="bold">
                        خطا در دریافت داده‌ها
                    </Typography>
                    <Typography variant="body2">
                        {error.response?.data?.message || error.message || 'خطای ناشناخته رخ داده است'}
                    </Typography>
                </Alert>
            </Box>
        );
    }

    const { currentPage, pageSize, totalCount } = paginationInfo;

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 4 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid size={{ md: 4, xs: 12 }}>
                        <Typography fontWeight={700} variant="h5" gutterBottom>
                            پیگیری بازرسی
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            تعداد رکوردها: {totalCount}
                        </Typography>
                    </Grid>
                    <Grid size={{ md: 4, xs: 12 }}>
                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        </Box>
                    </Grid>
                    <Grid size={{ md: 4, xs: 12 }}>
                        <Grid container spacing={2} justifyContent="end" alignItems="center">
                            <Button
                                variant="outlined"
                                onClick={() => refetch()}
                                disabled={isLoading}
                                startIcon={isLoading ? <Skeleton width={20} height={20} /> : null}
                            >
                                {isLoading ? 'در حال بارگذاری...' : 'بروزرسانی'}
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>

            <Box sx={{ width: '100%' }}>
                {isLoading ? (
                    <Paper elevation={2} sx={{ p: 2 }}>
                        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 1 }} />
                    </Paper>
                ) : (
                    <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
                        <MatnaDataGrid
                            rows={rowsWithIndex}
                            columns={columns}
                            checkboxSelection={false}
                            paginationMode="client"
                            rowCount={totalCount}
                            loading={isLoading}
                            pageSizeOptions={[10, 20, 50]}
                            paginationModel={{
                                page: currentPage - 1,
                                pageSize: pageSize,
                            }}
                            onPaginationModelChange={handlePaginationChange}
                            getRowId={(row) => row.id || Math.random().toString()}
                            height={630}
                            sx={{
                                '& .MuiDataGrid-cell': {
                                    borderBottom: '1px solid #e0e0e0',
                                    display: 'flex',
                                    alignItems: 'center',
                                },
                                '& .MuiDataGrid-columnHeaders': {
                                    backgroundColor: '#f8f9fa',
                                    borderBottom: '2px solid #dee2e6',
                                    fontWeight: 'bold',
                                },
                                '& .MuiDataGrid-row:hover': {
                                    backgroundColor: '#f5f5f5',
                                },
                            }}
                        />
                    </Paper>
                )}
            </Box>

            {!isLoading && !error && rowsWithIndex.length > 0 && (
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                        صفحه {currentPage} از {Math.ceil(totalCount / pageSize)} -
                        نمایش {rowsWithIndex.length} از {totalCount} رکورد
                    </Typography>
                </Box>
            )}

            {!isLoading && !error && rowsWithIndex.length === 0 && (
                <Paper sx={{ p: 4, textAlign: 'center', mt: 2 }}>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h2" sx={{ fontSize: '4rem' }}>
                            📋
                        </Typography>
                    </Box>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        هیچ داده‌ای یافت نشد
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        در حال حاضر هیچ بازرسی برای نمایش وجود ندارد.
                    </Typography>
                    <Button
                        variant="outlined"
                        onClick={() => refetch()}
                        disabled={isLoading}
                    >
                        بروزرسانی
                    </Button>
                </Paper>
            )}
        </Box>
    );
}