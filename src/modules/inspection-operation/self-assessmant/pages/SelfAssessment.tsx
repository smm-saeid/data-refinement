import { useState, useCallback, useMemo, type JSX } from 'react';
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
  Autocomplete,
  Dialog,
  DialogTitle,
} from '@mui/material';
import {
  ArrowBackIos,
  AccountTree,
  Book,
  List,
  ViewAgenda,
} from '@mui/icons-material';
import { useNavigate } from 'react-router';

import { MatnaDataGrid } from '@/components/data-grid/MatnaDataGrid.tsx';
import {type PaginationQueryParam,} from '@/types/api.ts';
import { useApiQuery } from '@/hooks/useApi';
import type { GridColDef } from '@mui/x-data-grid';

interface OrganizationUnit {
  id: string;
  unitId: string;
  unitName: string;
  organizationName: string;
  organizationKey: string;
  seasonName: string;
  seasonNumber: number;
}
interface KhodArzyabiQueryParams {
  year?: number;
}

interface ForceOption {
  value: string;
  name: string;
}

const SelfAssessment = () => {
  const navigate = useNavigate();

  const [selectedYear] = useState<number>(1404);
  const [selectedUnit, setSelectedUnit] = useState<string>('');
  const [isSpecialitiesModalOpen, setIsSpecialitiesModalOpen] = useState(false);
  const [isStructureModalOpen, setIsStructureModalOpen] = useState(false);

  const [filters, setFilters] = useState<
    PaginationQueryParam<KhodArzyabiQueryParams>
  >(() => ({
    year: selectedYear,
  }));

  const [forceFilter, setForceFilter] = useState<ForceOption>({
    value: '',
    name: 'همه',
  });

  const forceOptions = useMemo(
    (): ForceOption[] => [
      { value: '', name: 'همه' },
      { value: 'nezaja', name: 'نزاجا' },
      { value: 'nedaja', name: 'نداجا' },
      { value: 'nehaja', name: 'نهاجا' },
      { value: 'nepaja', name: 'نپاجا' },
      { value: 'sayer', name: 'یگانهای تابعه آجا' },
    ],
    []
  );

  const { data: response, isLoading, error, refetch } = useApiQuery<PaginationQueryParam<KhodArzyabiQueryParams>>({
    url: `http://192.168.2.119:8086/api/annual-planning/final-report/year/1404`,
    params: filters,
  });

  // Fetch speciality data
  const { data: specialityResponse } = useApiQuery({
    url: '/self-review/speciality-by-organization',
    params: { organizationId: selectedUnit },
    enabled: !!selectedUnit && isSpecialitiesModalOpen,
  });

  // Fetch structure data
  const { data: structureResponse } = useApiQuery({
    url: '/organization-chart/find-by-org-id',
    params: { orgId: selectedUnit },
  });

  // Process organization units data - نسخه ساده‌شده با any
  const organizationUnits = useMemo((): OrganizationUnit[] => {
    try {
      const responseData:any = response?.data;
      if (!responseData?.inspectionType) return [];

      const khodArzyabiType = responseData.inspectionType.find(
        item => item?.key === 'KHOD_ARZYABI'
      );

      if (!khodArzyabiType?.season) return [];

      const units: OrganizationUnit[] = [];

      khodArzyabiType.season.forEach((seasonItem, seasonIndex: number) => {
        seasonItem.organizations?.forEach((orgItem, orgIndex: number) => {
          orgItem.units?.forEach((unitItem, unitIndex: number) => {
            if (unitItem.organizationId && unitItem.organizationName) {
              units.push({
                id: `${unitIndex}${orgIndex}${seasonIndex}`,
                unitId: unitItem.organizationId,
                unitName: unitItem.organizationName,
                organizationName: orgItem.forceName || '',
                organizationKey: orgItem.forceKey || '',
                seasonName: seasonItem.season || '',
                seasonNumber: seasonIndex,
              });
            }
          });
        });
      });

      return units;
    } catch (error) {
      console.error('Error processing organization units:', error);
      return [];
    }
  }, [response?.data]);

  // Filter units based on force selection
  const filteredUnits = useMemo(() => {
    if (!forceFilter.value) return organizationUnits;
    return organizationUnits.filter(
      unit => unit.organizationKey === forceFilter.value
    );
  }, [organizationUnits, forceFilter.value]);

  const handlePaginationChange = useCallback(model => {
    setFilters(prev => ({
      ...prev,
      page: model.page + 1,
      pageSize: model.pageSize,
    }));
  }, []);

  // Handle force filter change
  const handleForceChange = useCallback(
    (_event, newValue: ForceOption | null) => {
      setForceFilter(newValue || { value: '', name: 'همه' });
    },
    []
  );

  // Render organization structure recursively
  const renderStructure = useCallback((structureData: []): JSX.Element => {
    if (!structureData || structureData.length === 0) {
      return <Typography variant="body2">هیچ داده‌ای موجود نیست</Typography>;
    }

    return (
      <ul style={{ paddingLeft: '20px', margin: 0 }}>
        {structureData.map((item: any, index: number) => (
          <li key={index}>
            <Typography variant="body1" component="span">
              {item.name}
            </Typography>
            {item.childrenChartDtoList &&
              item.childrenChartDtoList.length > 0 &&
              renderStructure(item.childrenChartDtoList)}
          </li>
        ))}
      </ul>
    );
  }, []);

  // Handle modal open/close
  const handleOpenSpecialities = useCallback((unitId: string) => {
    setSelectedUnit(unitId);
    setIsSpecialitiesModalOpen(true);
  }, []);

  const handleOpenStructure = useCallback((unitId: string) => {
    setSelectedUnit(unitId);
    setIsStructureModalOpen(true);
  }, []);

  const handleCloseModals = useCallback(() => {
    setSelectedUnit('');
    setIsSpecialitiesModalOpen(false);
    setIsStructureModalOpen(false);
  }, []);

  // Grid columns for list view
  const listColumns: GridColDef<OrganizationUnit>[] = useMemo(
    () => [
      {
        field: 'unitName',
        headerName: 'نام یگان',
        flex: 2,
        minWidth: 200,
      },
      {
        field: 'organizationName',
        headerName: 'نیرو',
        flex: 1,
        minWidth: 120,
      },
      {
        field: 'seasonNumber',
        headerName: 'فصل بازرسی',
        flex: 1,
        minWidth: 120,
        renderCell: ({ row }) => {
          const seasons = ['بهار', 'تابستان', 'پاییز', 'زمستان'];
          return seasons[row.seasonNumber] || 'نامشخص';
        },
      },
      {
        field: 'actions',
        headerName: 'عملیات',
        flex: 1,
        minWidth: 150,
        sortable: false,
        filterable: false,
        renderCell: ({ row }) => (
          <Box display="flex" gap={1}>
            <Tooltip title="لیست تخصص ها">
              <Fab
                size="small"
                color="info"
                onClick={() => handleOpenSpecialities(row.unitId)}
              >
                <List fontSize="small" />
              </Fab>
            </Tooltip>
            <Tooltip title="ساختار سازمانی">
              <Fab
                size="small"
                color="secondary"
                onClick={() => handleOpenStructure(row.unitId)}
              >
                <AccountTree fontSize="small" />
              </Fab>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [handleOpenSpecialities, handleOpenStructure]
  );

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
          <Box display="flex" alignItems="center" gap={2}>
            <Book />
            <Typography fontWeight={700} variant="h5">
              یگان های بازرسی سال {selectedYear} به روش خود ارزیابی
            </Typography>

            <Autocomplete<ForceOption>
              options={forceOptions}
              value={forceFilter}
              onChange={handleForceChange}
              getOptionLabel={option => option.name}
              renderInput={params => (
                <TextField
                  {...params}
                  label="نیروی انتخابی"
                  size="small"
                  sx={{ minWidth: 200 }}
                />
              )}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
            />
          </Box>

          <Button
            variant="outlined"
            startIcon={<ArrowBackIos />}
            onClick={() => navigate('/inspection/planning/AJA-planning')}
          >
            بازگشت
          </Button>
        </Box>
      </Paper>

      {/* Data Grid */}
      {isLoading ? (
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 1 }} />
      ) : (
        <MatnaDataGrid
          rows={filteredUnits || []}
          columns={listColumns}
          loading={isLoading}
          paginationModel={{
            page: (response?.meta?.pagination?.currentPage || 1) - 1,
            pageSize: response?.meta?.pagination?.pageSize || 10,
          }}
          rowCount={response?.meta?.pagination?.count || 0}
          onPaginationModelChange={handlePaginationChange}
        />
      )}

      {/* Specialities Modal */}
      <Dialog
        open={isSpecialitiesModalOpen}
        onClose={handleCloseModals}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle display="flex" alignItems="center" gap={1}>
          <List />
          لیست تخصص های یگان
        </DialogTitle>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.light' }}>
                <TableCell align="center">ردیف</TableCell>
                <TableCell align="center">نام تخصص</TableCell>
                <TableCell align="center">عملیات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(specialityResponse?.data as any [] )?.map((item, index: number) => (
                <TableRow key={item.id}>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell align="center">{item.orgSpecialityName}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="لیست بازبینه ها">
                      <Fab size="small" color="info">
                        <ViewAgenda fontSize="small" />
                      </Fab>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}

              {!specialityResponse?.data && (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      هیچ تخصصی یافت نشد
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Dialog>

      {/* Structure Modal */}
      <Dialog
        open={isStructureModalOpen}
        onClose={handleCloseModals}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle display="flex" alignItems="center" gap={1}>
          <AccountTree />
          ساختار سازمانی یگان
        </DialogTitle>

        <Box sx={{ p: 3, minWidth: 400 }}>
          {structureResponse?.data ? (
            // renderStructure(structureResponse.data)
            <h1>salam</h1>
          ) : (
            <Typography variant="body2" color="text.secondary">
              اطلاعات ساختار سازمانی یافت نشد
            </Typography>
          )}
        </Box>
      </Dialog>
    </Box>
  );
};

export default SelfAssessment;
