import React, { useState } from 'react';
import { type ProvinceInterface } from '../../types.ts';
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import MapLoader from '../../../../components/map-loader/MapLoader.tsx';
import { useApiQuery } from '@/hooks/useApi.ts';



const CommanderReportsMap = () => {
  const [isOpenDialog, setIsOpenDialog] = React.useState(false);
  const [selectedProvince, setSelectedProvince] = React.useState<
    ProvinceInterface | undefined
  >();

  const [niroo, setNiroo] = useState({
    value: null,
    name: 'همه',
  });

  const nirooItems = [
    {
      value: null,
      name: 'همه',
    },
    {
      value: '45c4d624-919d-4313-be7c-acd32e669783',
      name: 'نزاجا',
    },
    {
      value: 'ec9f60dd-119d-4e3d-965f-6b8e2605efa6',
      name: 'نداجا',
    },
    {
      value: '0136a680-9c32-4a00-bd77-4b624f60908a',
      name: 'نهاجا',
    },
    {
      value: '9432e347-9959-468e-afa3-f11a12c24435',
      name: 'نپاجا',
    },
    {
      value: '09c4a69c-c159-43b6-9968-c5a41239a5fb',
      name: 'یگانهای تابعه آجا',
    },
  ];

  const handleClose = () => {
    setIsOpenDialog(false);
    setSelectedProvince(undefined);
  };

  const { data: locs_data } = useApiQuery<any>({
    url: 'organizations/province?currentPage=1&pageSize=1000',
  });

  return (
    <>
      <Dialog
        open={isOpenDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          یگانهای برنامه ریزی شده استان {selectedProvince?.name}
        </DialogTitle>
        <DialogContent></DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            بستن
          </Button>
        </DialogActions>
      </Dialog>
                <Stack

                  direction={'row'}
                  alignItems={'center'}

                >
        <Typography variant="h6" component={'h3'}>
          نقشه گزارشات فرماندهی
        </Typography>
        <Autocomplete
          id="niroo"
          onChange={(event, newValue) => {
            setNiroo(newValue);
          }}
          renderOption={(props, option) => (
            <li {...props} key={option.value}>
              {option.name}
            </li>
          )}
          value={niroo}
          // inputValue={niroo}
          clearOnBlur
          options={nirooItems}
          sx={{ width: 200, ml: 2 }}
          getOptionLabel={option => option.name}
          renderInput={params => (
            <TextField {...params} label="نیروی انتخابی" />
          )}
          isOptionEqualToValue={(option, value) => {
            return `${option}` === `${value}`;
          }}
        />
        </Stack>
        <div style={{ height: 20 }} />
        <div style={{width: '100%', height: '100%' }}>
          <MapLoader
            locs_data={(locs_data?.data ?? []).filter((e) => niroo.value == null || niroo.value == e.forceOrganizationUnitId)}
            allowFullscreen={true}
            allowSetNew={false}
            newCoordinate={null}
            setNewCoordinate={() => {}}
            newCoordinateHandler={undefined}
            cancelHandler={undefined}
          />
        </div>
    </>
  );
};

export default CommanderReportsMap;
