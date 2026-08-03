import { Card, CardContent, Grid } from '@mui/material';
import React from 'react';

import {
  RegionData,
} from '../../types.ts';
import type { APISuggestionUnit } from '../../types.ts';
type Props = {
  organization?: string;
  data: Array<APISuggestionUnit>;
};
const RegionPanel: React.FC<Props> = () => {
  return (
    <Grid container spacing={2} p={4}>
      {Object.keys(RegionData).map((_regionCode, regionId) => (
        <Grid key={regionId} size={{ md: 4 }} sx={{ display: 'flex' }}>
          <Card sx={{ flexGrow: 1 }}>
            <CardContent
              sx={{
                backgroundColor: '#93e1ff',
              }}
            >
              {Object.values(RegionData)[regionId]}
            </CardContent>
            <CardContent>
              {
                // data.filter((row: APISuggestionUnit) => row.region===Object.keys(RegionData)[regionId]
                // ).map((item)=>(
                //   <div key={item.id}>{item.organizationUnitName} ({SeasonData[seasonKeys.findIndex((season)=>season===item.month)]})</div>
                // ))
              }
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default RegionPanel;
