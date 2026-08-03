import React from 'react';
import { type ProvinceInterface } from '../../types.ts';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import type { APISuggestionUnit } from '../../types.ts';
import MapLoader from '../../../../components/map-loader/MapLoader.tsx';
import { useApiQuery } from '@/hooks/useApi.ts';
import InspectionApis from '../../api.ts';

type Props = {
  data?: Array<APISuggestionUnit>;
  status?: string;

  yearSelected: string;
  forceId: any;
};

const ProvincePanel: React.FC<Props> = ({ data, yearSelected, forceId }) => {

  const [isOpenDialog, setIsOpenDialog] = React.useState(false);
  const [selectedProvince, setSelectedProvince] = React.useState<
    ProvinceInterface | undefined
  >();

  const handleClose = () => {
    setIsOpenDialog(false);
    setSelectedProvince(undefined);
  };


  const { data: locs_data } = useApiQuery<any>({
    url: InspectionApis.ProvinceByForce.list(yearSelected,forceId)
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
        <DialogContent>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            بستن
          </Button>
        </DialogActions>
      </Dialog>
      <Box width={'100%'} padding={'10px'}>
        <div style={{ width: '100%', height: '100%' }}>
          <MapLoader
            locs_data={locs_data?.data}
            allowFullscreen={true}
            allowSetNew={false}
            newCoordinate={null}
            setNewCoordinate={() => {}}
            newCoordinateHandler={undefined}
            cancelHandler={undefined}
          />
        </div>
      </Box>
    </>
  );
};

export default ProvincePanel;
