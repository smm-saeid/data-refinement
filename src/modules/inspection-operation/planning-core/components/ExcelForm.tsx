import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import React, { useMemo, useState } from 'react';

import { MatnaDataGrid } from '@/components/data-grid/MatnaDataGrid.tsx';
import { SeasonData, seasonKeys } from '../../types.ts';
import {
  GridCellModes,
  type GridCellModesModel,
  type GridCellParams,
  type GridColDef,
  GridToolbar,
  useGridApiRef,
} from '@mui/x-data-grid';
import '@/modules/inspection-operation/planning-aja/styles/excel-form.css';
import ChangeUnit from './ChangeUnit.tsx';
import type { APISuggestionUnit, APIUnit } from '../../types.ts';
import { AutoStories, SyncAlt } from '@mui/icons-material';
import { useApiMutation } from '@/hooks/useApi.ts';
import InspectionApis from '@/modules/inspection-operation/api.ts';
import { SeasonLabels } from 'modules/inspection-operation/planning-aja/types.ts';
type Props = {
  idData: string[];
  data: Array<APISuggestionUnit>;
  checkBoxHanddler: (
    row: APISuggestionUnit,
    e: React.ChangeEvent<HTMLInputElement>,
    c: boolean
  ) => void;
  addUnit: (id: string, unit: APIUnit) => void;
  handleMonth: (id: string, month: number | string) => void;
  handleTypeChange: (id: string, type: number | string) => void;
  status: string;
  organization: string;
  inspectionTypeIndex: string | number;
  natureId: string | undefined;
  refetch: () => void;
};

const ExcelForm: React.FC<Props> = ({
  checkBoxHanddler,
  data,
  handleMonth,
  status = 'success',
  natureId,
  handleTypeChange,
  idData,
  refetch,
}) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [historyData, setHistoryData] = React.useState<any>();
  const apiRef = useGridApiRef();
  const [historyFlag, setHistoryFlag] = useState(false);
  const [changeUnitDialog, setChangeUnitDialog] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<APISuggestionUnit>(null);

  const { mutate: createMutateSuggestionDetail } = useApiMutation({
    url: InspectionApis.Inspection.suggestionDetails,
    method: 'POST',
  });

  function historyOfUnit(unitId: string | undefined) {
    if (unitId !== undefined) {
      createMutateSuggestionDetail(
        {
          annualPlanInspectionId: idData[0],
          organizationParentId: idData[1],
          organizationTypeId: natureId,
          organizationId: unitId,
          selectionOrgAndSeasons: [],
        },
        {
          onSuccess: (res: any) => {
            console.log('DETAIL res =>', res);
            setHistoryData(res.data);
            setHistoryFlag(true);
          },
        }
      );
    }
  }
  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'unitName',
        headerName: 'نام یگان',
        flex: 4,
        renderCell: ({ row }: { row: APISuggestionUnit }) => {
          return (
            <Box
              display="flex"
              alignContent="center"
              sx={{ height: '100%' }}
              alignItems="center"
            >
              <Typography>{row.organizationName}</Typography>
            </Box>
          );
        },
      },
      {
        headerAlign: 'center',
        field: 'month',
        headerName: 'فصل بازرسی',
        flex: 2,
        align: 'center',
        renderCell: ({ row }) => {
          if (selectedIds.includes(row.id)) {
            return <Box>{SeasonLabels[row.season]}</Box>;
          } else {
            return (
              <Select
                fullWidth
                value={row.season}
                onChange={event =>
                  handleMonth(row.id, event.target.value as string)
                }
                sx={{ height: '100%' }}
              >
                {SeasonData.map((seasonItem, seasonIndex) => (
                  <MenuItem
                    value={seasonKeys[seasonIndex]}
                    key={seasonKeys[seasonIndex]}
                  >
                    {seasonItem}
                  </MenuItem>
                ))}
              </Select>
            );
          }
        },
        type: 'singleSelect',
        cellClassName: 'apiEditable',
        valueOptions: SeasonData.map((seasonItem, seasonIndex) => ({
          value: seasonKeys[seasonIndex],
          label: seasonItem,
        })),
      },
      {
        headerAlign: 'center',
        field: 'action',
        headerName: 'عملیات',
        flex: 2,
        align: 'center',
        renderCell: ({ row }: { row: APISuggestionUnit }) => {
          return (
            <Box>
              <Checkbox
                name={row.organizationName}
                inputProps={{ 'aria-label': 'controlled' }}
                onChange={(e, c) => {
                  if (e.target.checked) {
                    if (!selectedIds.includes(row.id))
                      setSelectedIds(prev => [...prev, row.id]);
                  } else {
                    if (selectedIds.includes(row.id))
                      setSelectedIds(prev => prev.filter(i => i !== row.id));
                  }
                  checkBoxHanddler(row, e, c);
                }}
              />
              <Tooltip title="مشاهده سابقه یگان">
                <Button
                  onClick={() => {
                    historyOfUnit(row?.id ?? '0');
                  }}
                >
                  <AutoStories fontSize="small" />
                </Button>
              </Tooltip>
              {row?.status && (
                <Tooltip title="تغییر یگان انتخاب شده">
                  <Button
                    onClick={() => {
                      setSelectedUnit(row);
                      setChangeUnitDialog(true);
                    }}
                  >
                    <SyncAlt fontSize="small" />
                  </Button>
                </Tooltip>
              )}
            </Box>
          );
        },
      },
    ],
    [handleTypeChange, apiRef, handleMonth, data]
  );

  return (
    <Box sx={{ p: 4, pb: 1, borderRadius: 1, width: '100%' }}>
      {
        // status === "error" ? (<ErrorHandler onRefetch={refetch}/>) :
        status === 'loading' ? (
          <Skeleton height={300} />
        ) : (
          // status === "success" ?
          <MatnaDataGrid
            rows={data}
            columns={columns}
            rowCount={data?.length ?? 0}
            loading={false}
            apiRef={apiRef}
            hideFooter
            disableDensitySelector
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                csvOptions: { disableToolbarButton: true },
              },
            }}
            sx={{
              borderColor: '#023e8a',
              borderWidth: '2px',
              fontSize: 'smaller',
              width: '100%',
            }}
          />
        )
      }
      <Dialog
        open={historyFlag}
        onClose={() => {setHistoryFlag(false);
        }}
        sx={{ justifyContent: 'center', display: 'flex', alignItems: 'center' }}
        aria-labelledby="modal-city-select"
        aria-describedby="modal-city-select-description"
      >
        <>
          <DialogTitle>سابقه یگان</DialogTitle>
          <DialogContent>
            {!historyData ? (
              <DialogContentText>
                تاریخچه ای برای این یگان ثبت نشده!
              </DialogContentText>
            ) : (
              <Grid
                container
                width={'70vw'}
                maxWidth={'15cm'}
                bgcolor={'white'}
                overflow={'auto'}
                maxHeight={'90vh'}
                justifyContent={'center'}
              >
                <Grid container>
                  <Grid size={{ xs: 12, md: 12 }}>
                    <TableContainer component={Paper}>
                      <Typography sx={{ p: 2 }} variant="h6">
                        سابقه یگان{' ' + historyData?.organizationName}
                      </Typography>
                      <Table>
                        <TableHead>
                          <TableRow sx={{ bgcolor: 'lightsalmon' }}>
                            <TableCell>
                              <Typography fontWeight={'bold'}>یگان</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography fontWeight={'bold'}>سال</Typography>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {historyData?.suggestionDetailsInspectionForOrganizations?.map(
                            (item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item?.title}</TableCell>
                                <TableCell>{item?.year}</TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setHistoryFlag(false)}>بستن</Button>
          </DialogActions>
        </>
      </Dialog>
      <Dialog
        open={changeUnitDialog}
        onClose={() => {
          setChangeUnitDialog(false);
        }}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>تغییر یگان</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <ChangeUnit
            annualInspectionId={idData[0]}
            unitForceId={idData[1]}
            oldUnitId={selectedUnit?.id}
            unitNatureId={natureId}
            onUnitChange={() => {
              refetch();
              setChangeUnitDialog(false);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setChangeUnitDialog(false);
            }}
            color="inherit"
          >
            بستن
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExcelForm;
