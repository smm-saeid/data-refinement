import {
  Autocomplete,
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  LinearProgress,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import React, { use, useEffect, useRef, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useMutation } from '@tanstack/react-query';
import ExcelForm from './components/ExcelForm';
import type { IExcelForm } from '../types.ts';
import MonthPanel from './components/MonthPanel';
import RegionPanel from './components/RegionPanel';
import SeasonRegionPanel from './components/SeasonRegionPanel';
import {
  ArrowBackIosNew,
  ArrowForwardIos,
  RefreshOutlined,
} from '@mui/icons-material';
import { InspectionPlanningViewTypeEnum } from '../types.ts';
import ProvincePanel from './components/ProvincePanel';
import type { APINature, APISuggestionUnit, APIUnit } from '../types.ts';
import { useSnackbar } from 'hooks/useSnackbar';
import { useLegacyApi } from 'hooks/useLegacyApi.ts';

type Props = {
  yearSelected: string;
  idData: string[];
  natureId: string;
  inspectionType: number;
  organization?: string;
  type: InspectionPlanningViewTypeEnum | undefined;

  unitsAccepting: (unitsData: Array<APISuggestionUnit>) => void;
  conflictAccepting: (unitsData: Array<APISuggestionUnit>) => void;
  handleNext: (unitsData: Array<APISuggestionUnit>) => void;
  handleBack: () => void;
  natureList: APINature[];
  activeStep: number;
  setModalFlag: React.Dispatch<React.SetStateAction<boolean>>;
  modalFlag: boolean;
  setHintFlag: React.Dispatch<React.SetStateAction<boolean>>;
  hintFlag: boolean;
  setStateUnits: React.Dispatch<React.SetStateAction<boolean>>;
  acceptedData: Array<APISuggestionUnit>;
  setAcceptedData: React.Dispatch<React.SetStateAction<APISuggestionUnit[]>>;
  tableRows?: any[];
  suggestion?: any[];
  status: 'error' | 'success' | 'pending';
  refetch: any;
  selectionLimit: number;
};

export default function UnitSelection({
  yearSelected,
  idData,
  organization = 'آجا',
  type,
  inspectionType = 0,
  natureId,
  handleNext,
  handleBack,
  natureList,
  activeStep,
  setModalFlag,
  modalFlag = false,
  acceptedData,
  setAcceptedData,
  tableRows,
  hintFlag,
  setHintFlag,
  setStateUnits,
  unitsAccepting,
  conflictAccepting,
  suggestion,
  status,
  refetch,
  selectionLimit,
}) {
  const snackbar = useSnackbar();

  const insTypeKeys = [
    'BARNAMEI_SYSTEMATIC',
    'PEYGIRI_BAZRASI',
    'KHOD_ARZYABI',
    'RASTY_AZMAIE',
    'GHEIRE_MOTERAGHEBEH',
    'NEZARAT_SETADI',
    'ARZYABI_MOAVEN_BAZRASI',
    'BAZRASI_BANA_BE_DASTOOR',
  ];

  const legacyApi = useLegacyApi();

  const [selectedUnit, setSelectedUnit] = useState<APISuggestionUnit>(null);
  const [changeSelectedUnitDialog, setChangeSelectedUnitDialog] = useState<boolean>(false);

  const [myData, setMyData] = useState<Array<APISuggestionUnit>>(
    [] as APISuggestionUnit[]
  );
  // const [acceptedData, setAcceptedData] = useState<Array<APISuggestionUnit>>([] as APISuggestionUnit[]);
  const checkBoxHanddler = (
    row: APISuggestionUnit,
    e: React.ChangeEvent<HTMLInputElement>,
    c: boolean
  ) => {
    if (!c)
      setAcceptedData(prev => prev.filter(unitItem => unitItem.id !== row.id));
    else setAcceptedData(prev => [...prev, row]);
  };

  const { mutate } = useMutation({
    mutationFn: legacyApi.request,
  });

  const handleMonth = (id: string, season: number | string) => {
    if (season != 'unselected') console.log('season=========>', season);
    setMyData(
      (previousState: any) =>
        // ...previousState,
        // rows: previousState?.map((item: IExcelForm) => (item.id === id ? { ...item, month } : item)) ?? [],
        previousState?.map((item: APISuggestionUnit) =>
          item.id == id ? { ...item, season } : item
        ) ?? []
    );
  };

  const addUnit = (id: string, unit: APIUnit) => {
    if (myData.some(unit => unit.id === id))
      snackbar('این یگان در لیست پیشنهادات موجود میباشد', 'error', 5000);
    else
      setMyData(prevdata => [
        ...prevdata,
        {
          id: unit.id,
          // organizationId: unit.organizationTypeId,
          organizationId: unit.id,
          organizationName: unit.name,
          season: 'third_season',
        } as APISuggestionUnit,
      ]);
  };
  const handleTypeChange = (id: string, type: number | string) => {
    if (type != 'unselected')
      setMyData(
        (previousState: any) =>
          previousState?.map((item: IExcelForm) =>
            item.id == id ? { ...item, type } : item
          ) ?? []
      );

    mutate(
      {
        entity: `/plannigManagmentData/${id}`,
        method: 'PATCH',
        data: {
          type,
        },
      } as any,
      {
        onSuccess: (res: any) => {
          console.log('on success res =>', res);
        },
      }
    );
  };

  const showChangeSelectedUnit = (selectedUnit: APISuggestionUnit) => {
    setSelectedUnit(selectedUnit)
    setChangeSelectedUnitDialog(true)
  }

  useEffect(() => {
    if (suggestion) {
      setStateUnits(suggestion[0]?.status === true ? true : false);
      setMyData(
        suggestion.map(item => ({
          ...item,
          id: item.organizationId,
        }))
      );
      setAcceptedData([]);
    }
  }, [suggestion]);

  if (status === 'pending') return <LinearProgress />;
  if (status === 'error')
    return (
      <IconButton
        color="error"
        onClick={() => {
          refetch();
        }}
      >
        <RefreshOutlined />
      </IconButton>
    );

  if (modalFlag) {
    {
      if (hintFlag)
        snackbar(
          'توجه داشته باشید که قبل از این مرحله تمامی یگان های سال مورد نظر را تایین کرده باشید',
          'warning',
          5000
        );
    }
    return (
      <Modal
        open={modalFlag}
        onClose={() => {
          setModalFlag(false);
          setHintFlag(false);
          setAcceptedData([]);
        }}
        sx={{ justifyContent: 'center', display: 'flex', alignItems: 'center' }}
        aria-labelledby="modal-city-select"
        aria-describedby="modal-city-select-description"
      >
        {hintFlag ? (
          <Paper elevation={3}>
            <Grid
              container
              width={'25cm'}
              bgcolor={'white'}
              minHeight={'40vh'}
              overflow={'auto'}
              maxHeight={'90vh'}
              justifyContent={'center'}
              p={5}
            >
              <Grid size={{ md: 12 }} display="flex" mb={3}>
                <Typography variant="h5">لیست تداخلات!</Typography>
              </Grid>
              <Card component={Grid} container>
                <CardContent sx={{ width: '100%' }}>
                  <Grid
                    size={{ md: 12 }}
                    display="flex"
                    justifyContent={'center'}
                  >
                    <Table sx={{ width: '100%' }}>
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: 'bold' }}
                            >
                              یگان مورد تداخل
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: 'bold' }}
                            >
                              ارگان گزارش کننده
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: 'bold' }}
                            >
                              فصل گزارش شده
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody sx={{ textAlign: 'center' }}>
                        {tableRows}
                      </TableBody>
                    </Table>
                  </Grid>
                </CardContent>
              </Card>
              <Grid
                size={{ md: 12 }}
                display="flex"
                justifyContent={'space-between'}
                mt={3}
              >
                <Typography mr={2}>
                  آیا با وجود تداخلات، یگان های انتخاب شده مورد تایید میباشد؟
                </Typography>
                <Button
                  color="warning"
                  variant="contained"
                  onClick={() => unitsAccepting(acceptedData)}
                >
                  تایید
                </Button>
              </Grid>
            </Grid>
          </Paper>
        ) : (
          <Card
            sx={{
              backgroundColor: '#white',
              padding: 1,
              // width:"25cm",
              overflow: 'auto',
            }}
          >
            <CardContent
              sx={{ display: 'flex', justifyContent: 'space-between' }}
            >

              <Typography mr={2}>
                تداخلی یافت نشد. آیا یگان های انتخاب شده مورد تایید میباشد؟
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="outlined"
                onClick={() => {
                  setModalFlag(false);
                  setHintFlag(false);
                  setAcceptedData([]);
                }}
              >
                لغو
              </Button>
              <Button
                variant="contained"
                onClick={() => unitsAccepting(acceptedData)}
              >
                تایید
              </Button>

            </CardActions>
          </Card>
        )}
      </Modal>
    );
  } else
    return (
      <Grid container>
        {type == InspectionPlanningViewTypeEnum.PLANNING && (
          <Grid container size={{ md: 12 }}>
            <ExcelForm
              checkBoxHanddler={checkBoxHanddler}
              addUnit={addUnit}
              idData={idData}
              natureId={natureId}
              inspectionTypeIndex={inspectionType}
              organization={organization}
              status={status}
              data={myData?.slice(0, selectionLimit)}
              handleMonth={handleMonth}
              handleTypeChange={handleTypeChange}
              refetch={refetch}
            />
          </Grid>
        )}
        {type == InspectionPlanningViewTypeEnum.MONTHLY_DISTRIBUTED && (
          <Grid container size={{ md: 12 }}>
            <MonthPanel
              handleMonth={handleMonth}
              organization={organization}
              data={myData?.filter(item => item?.status === true)}
            />
          </Grid>
        )}
        {type == InspectionPlanningViewTypeEnum.REGIONAL_DISTRIBUTED && (
          <Grid container size={{ md: 12 }}>
            <RegionPanel organization={organization} data={myData} />
          </Grid>
        )}
        {type == InspectionPlanningViewTypeEnum.AREA_AND_SEASONAL && (
          <Grid container size={{ md: 12 }}>
            <SeasonRegionPanel
              organization={organization}
              status={status}
              data={myData}
            />
          </Grid>
        )}
        {type == InspectionPlanningViewTypeEnum.PROVINCE && (
          <Grid container size={{ md: 12 }}>
            <ProvincePanel
              yearSelected={yearSelected}
              status={status}
              data={myData}
              forceId={null}
            />
          </Grid>
        )}

        <Grid
          container
          sx={{
            pt: 0,
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
          }}
          p={4}
          pb={2}
        >
          <Grid
            size={{ xs: 6, md: 6 }}
            sx={{ display: 'flex', justifyContent: 'flex-start' }}
          >
            <Button
              onClick={handleBack}
              disabled={activeStep === 0}
              startIcon={<ArrowForwardIos />}
            >
              مرحله قبل
            </Button>
          </Grid>

          {activeStep === natureList.length - 1 ? (
            <Grid
              size={{ xs: 6, md: 6 }}
              sx={{ display: 'flex', justifyContent: 'flex-end' }}
            >
              <Button
                onClick={() => handleNext(acceptedData)}
                endIcon={<ArrowBackIosNew />}
              >
                ثبت نهایی
              </Button>
            </Grid>
          ) : (
            <Grid
              size={{ xs: 6, md: 6 }}
              sx={{ display: 'flex', justifyContent: 'flex-end' }}
            >
              <Button
                onClick={() => handleNext(acceptedData)}
                endIcon={<ArrowBackIosNew />}
              >
                ثبت و مرحله بعد
              </Button>
            </Grid>
          )}
        </Grid>
      </Grid>
    );
}
