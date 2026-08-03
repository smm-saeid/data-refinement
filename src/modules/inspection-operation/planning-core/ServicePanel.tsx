import {
  Box,
  Button,
  Chip,
  Fab,
  Grid,
  Paper,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import DrawOutlinedIcon from '@mui/icons-material/DrawOutlined';
import { inspectionTypeNames } from '../types.ts';
import { ServiceTypeEnum } from '../types.ts';
import UnitSelection from './UnitSelection';
import { menu, SeasonData, seasonKeys } from '../types.ts';
import { InspectionPlanningViewTypeEnum } from '../types.ts';
import type {
  APINature,
  AnnualPlanning,
  APIPlanningGrid,
  APISuggestionUnit,
} from '../types.ts';
import { Delete } from '@mui/icons-material';
import { GridCheckCircleIcon } from '@mui/x-data-grid';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { useSnackbar } from 'hooks/useSnackbar';
import type { ApiResponseType } from '../types';
import { useLegacyApi } from 'hooks/useLegacyApi.ts';
import InspectionApis from 'modules/inspection-operation/api.ts';
import {
  PAGINATION_DEFAULT_VALUE_OLD,
  type PaginationQueryParamOld,
} from 'types/api.ts';
import paramsSerializer from '@/lib/paramsSerializer.ts';

type Props = {
  idData: string[];
  servicePanelData: string | undefined;
  type: ServiceTypeEnum | undefined;
  inspectionViewType: InspectionPlanningViewTypeEnum | undefined;
  click: (type?: InspectionPlanningViewTypeEnum) => void;
  inspectionType: number;
  natureId: string;
  natureList: APINature[];

  handleNext: (unitsData: Array<APISuggestionUnit>) => void;
  handleBack: () => void;
  activeStep: number;
};

export default function ServicePanel({
  inspectionType = 0,
  servicePanelData,
  type,
  inspectionViewType,
  natureId,
  click,
  handleNext,
  handleBack,
  activeStep,
  natureList,
  idData = ['', ''],
}) {
  const [modalFlag, setModalFlag] = useState(false);
  const [hintFlag, setHintFlag] = useState(false);
  const [annualSelectedNature, setAnnualSelectedNature] = useState(
    {} as APINature
  );
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
  const snackbar = useSnackbar();
  const legacyApi = useLegacyApi();
  const { id } = useParams();

  const { mutate } = useMutation({
    mutationFn: legacyApi.request,
  });

  const serializedFiltersSuggestion = useMemo(
    () =>
      `${InspectionApis.orgTypeInspection.annualPlanning(idData[0], idData[1], natureId)}`,
    [idData, natureId]
  );

  const {
    data: suggestion,
    status,
    refetch,
  } = useQuery<any, any, Array<any>, any>({
    queryKey: [serializedFiltersSuggestion],
    queryFn: () => legacyApi.get(serializedFiltersSuggestion),
    select: (res: ApiResponseType<Array<APISuggestionUnit>>) =>
      (res.data as Array<APISuggestionUnit>) ?? ([] as APISuggestionUnit[]),
    enabled: !!natureId && natureId !== 'new',
    placeholderData: [] as Array<APISuggestionUnit>,
  });


  const serializedFilters = useMemo(
    () => InspectionApis.annualPlanning.find(id),
    [id]
  );

  const { data: planData } = useQuery<any, any, AnnualPlanning, any>({
    queryKey: [serializedFilters],
    queryFn: () => legacyApi.get(serializedFilters),
    select: (res: APIPlanningGrid) => res?.data
  });

  const [acceptedData, setAcceptedData] = useState<Array<APISuggestionUnit>>(
    [] as APISuggestionUnit[]
  );
  const [tableRows, setTableRows] = useState<Array<any>>([] as Array<any>);
  const [stateUnits, setStateUnits] = useState<boolean>(false);
  useEffect(() => {

    setAnnualSelectedNature(natureList?.find(i => i.organizationTypeId == natureId));
  }, [natureList, natureId]);

  function conflictAccepting(unitsData: Array<APISuggestionUnit>) {
    setTableRows([]);
    setHintFlag(false);
    mutate(
      {
        entity: InspectionApis.annualPlanning.suggestionConflict,
        method: 'POST',
        data: {
          annualPlanInspectionId: idData[0],
          organizationParentId: idData[1],
          organizationTypeId: natureId,
          selectionOrgAndSeasons: [
            ...unitsData.map((item: APISuggestionUnit) => ({
              organizationId: item.organizationId,
              organizationName: item.organizationName,
              organizationReference: item.organizationReference ?? undefined,
              organizationReferenceName:
                item.organizationReferenceName ?? undefined,
              season: item.season,
            })),
          ],
        },
      } as any,
      {
        onSuccess: (res: any) => {
          if (res?.data?.length > 0) {
            setTableRows(
              res.data.map((item: any, key: number) => (
                <TableRow key={key}>
                  <TableCell>
                    <Typography>{item.organizationName}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{item.organizationReferenceName}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>
                      {
                        SeasonData[
                          seasonKeys.findIndex(season => season === item.season)
                        ]
                      }
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            );
            setHintFlag(true);
          }

          setModalFlag(showprev => !showprev);
        },
      }
    );
  }
  function unitsAccepting(unitsData: Array<APISuggestionUnit>) {
    mutate(
      {
        entity: InspectionApis.Inspection.createInspection,
        method: 'POST',
        data: {
          annualPlanInspectionId: idData[0],
          organizationParentId: idData[1],
          organizationTypeId: natureId,
          selectionOrgAndSeasons: [
            ...unitsData.map((item: APISuggestionUnit) => ({
              organizationId: item.organizationId,
              organizationName: item.organizationName,
              organizationReference: item.organizationReference ?? undefined,
              organizationReferenceName:
                item.organizationReferenceName ?? undefined,
              season: item.season,
            })),
          ],
        },
      } as any,
      {
        onSuccess: (res: any) => {
          snackbar('یگان ها ثبت شدند!', 'success', 5000);
          setAcceptedData([]);
          setModalFlag(false);
          refetch();
        },
      }
    );
  }
  return (
    <Grid container spacing={2}>
      <Grid size={{ md: 12 }}>
        <TableContainer
          component={Paper}
          sx={{
            mb: 2,
            p: 2,
            minHeight: '150px',
            width: '100%',
            backgroundColor: theme =>
              theme.palette.mode === 'dark' ? '#121212' : '#eee',
          }}
        >
          <Grid
            container
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
            pl={4}
            pr={4}
          >
            <Grid
              size={{ md: 6 }}
              display={'flex'}
              justifyContent={'space-between'}
            >
              <Box display={'flex'} justifyContent={'flex-start'}>
                <DrawOutlinedIcon />
                {!stateUnits ? (
                  <Typography
                    variant="subtitle1"
                    component="p"
                    fontWeight={'bold'}
                  >
                    طرح ریزی یگانهای {servicePanelData}: لطفا{' '}
                    {annualSelectedNature?.number} مورد انتخاب نمایید
                  </Typography>
                ) : (
                  <Typography
                    variant="subtitle1"
                    component="p"
                    fontWeight={'bold'}
                  >
                    ویرایش یگانهای {servicePanelData}: لطفا{' '}
                    {annualSelectedNature?.number} مورد انتخاب نمایید
                  </Typography>
                )}
              </Box>

              <Chip
                label={stateUnits ? 'اطلاعات ذخیره شده' : 'پیشنهادات'}
                color={stateUnits ? 'secondary' : 'info'}
              />
            </Grid>
            <Grid container size={{ md: 6 }}>
              <Grid
                size={{ md: 9 }}
                display={'flex'}
                justifyContent={'flex-end'}
              >
                {menu.map((menuitem, index) => (
                  <Fab
                    key={index}
                    sx={{ marginRight: '10px' }}
                    color={
                      inspectionViewType === menuitem.type
                        ? 'primary'
                        : 'default'
                    }
                    onClick={e => click(menuitem.type)}
                  >
                    {menuitem.title}
                  </Fab>
                ))}
              </Grid>
              <Grid container justifyContent="flex-end" size={{ md: 3 }} pt={0}>
                <Button
                  variant="contained"
                  onClick={() => conflictAccepting(acceptedData ?? [])}
                  endIcon={<GridCheckCircleIcon />}
                  color="success"
                  sx={{ mx: 2, width: '200px' }}
                >
                  ثبت تغییرات
                </Button>
              </Grid>
            </Grid>
          </Grid>
          {(type === 'AJAPLANNING' || type === 'ORGANIZATIONPLANNING') && (
            <UnitSelection
              activeStep={activeStep}
              natureId={natureId ?? ''}
              inspectionType={inspectionType}
              organization={servicePanelData}
              type={inspectionViewType}
              idData={idData}
              conflictAccepting={conflictAccepting}
              handleNext={handleNext}
              handleBack={handleBack}
              natureList={natureList}
              modalFlag={modalFlag}
              setModalFlag={setModalFlag}
              hintFlag={hintFlag}
              setHintFlag={setHintFlag}
              acceptedData={acceptedData}
              setAcceptedData={setAcceptedData}
              tableRows={tableRows}
              unitsAccepting={unitsAccepting}
              setStateUnits={setStateUnits}
              suggestion={suggestion}
              status={status}
              refetch={refetch}
              yearSelected={planData?.year.toString() ?? '1400'}
              selectionLimit={annualSelectedNature?.number}
            />
          )}
        </TableContainer>
      </Grid>
    </Grid>
  );
}
