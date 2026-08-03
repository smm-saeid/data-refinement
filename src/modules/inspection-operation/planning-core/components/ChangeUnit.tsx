import {
  Autocomplete,
  Button,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import '@/modules/inspection-operation/planning-aja/styles/excel-form.css';
import type {
  APISearchUnits,
  APIUnit,
} from '../../types.ts';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useLegacyApi } from 'hooks/useLegacyApi.ts';
import InspectionApis from 'modules/inspection-operation/api.ts';
import { useSnackbar } from '@/hooks/useSnackbar.ts';

type Props = {
  annualInspectionId: string,
  unitForceId: string,
  unitNatureId: string,
  oldUnitId: string,
  onUnitChange: () => void,
};

export default function ChangeUnit({ annualInspectionId, unitForceId, unitNatureId, oldUnitId, onUnitChange }) {
  const snackbar = useSnackbar();
  const legacyApi = useLegacyApi();
  const serializedFiltersOrganization = useMemo(
    () =>
      `${InspectionApis.organizations.organizationTypes(unitForceId, unitNatureId)}`,
    [unitForceId, unitNatureId]
  );

  const {
    data: searchData,
  } = useQuery<any, any, APIUnit[], any>({
    queryKey: [serializedFiltersOrganization],
    queryFn: () => legacyApi.get(serializedFiltersOrganization),
    enabled: !!unitNatureId,
    select: (res: APISearchUnits) => res?.data as APIUnit[],
  });

  const { mutate: changeUnitMutate } = useMutation({
    mutationFn: legacyApi.request,
  });

  const [filteredData, setfilteredData] = useState<APIUnit>();

  const replaceUnit = () => {
    if( !filteredData?.id ) {
      snackbar('لطفا یگان را انتخاب کنید.', 'error', 5000)
      return;
    }

    changeUnitMutate(
      {
        entity: InspectionApis.Inspection.replaceUnit,
        method: 'PUT',
        data: {
          annualPlanInspectionId: annualInspectionId,
          currentOrgUnitId: oldUnitId,
          newOrgUnitId: filteredData?.id,
        },
      } as any,
      {
        onSuccess: (_res: any) => {
          snackbar('یگان انتخابی تغییر یافت.', 'success', 5000);
          onUnitChange()
        },
      }
    );
  }

  return (
    <Grid
      container
      sx={{ p: 1, mt: 4, mb: 2, width: '100%' }}
      border="2px solid #023e8a"
      borderRadius="10px"
    >
      <Grid size={{ md: 12 }} display="flex" alignItems="center">
        <Typography p={1}>جستجو یگان</Typography>
        {/* <GridSearchIcon /> */}
        <Autocomplete
          id="unitName"
          onChange={(_event, newValue: string | null) => {
            const filter = searchData?.find(item => item.name === newValue);
            setfilteredData(filter);
          }}
          options={searchData?.map(item => item.name) ?? ['1']}
          sx={{ width: 400 }}
          renderInput={params => <TextField {...params} label="نام یگان" />}
        />
      </Grid>
      <Grid
        container
        size={{ md: 12 }}
        alignItems="center"
        justifyContent="space-between"
        mt="5px"
        ml={1}
      >
        <Grid size={{ md: 3 }}>
          <Typography>
            نوع نیروی یگان : {filteredData?.parentName ?? null}
          </Typography>
        </Grid>
        <Grid size={{ md: 3 }}>
          <Typography>
            نوع ماهیت یگان : {filteredData?.organizationTypeName ?? null}
          </Typography>
        </Grid>

        <Grid size={{ md: 1 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => replaceUnit()}
          >
            تغییر یگان
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}
