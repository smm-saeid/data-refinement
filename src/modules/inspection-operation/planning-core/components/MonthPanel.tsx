import { Card, CardContent, Grid } from '@mui/material';
import React from 'react';
import { SeasonData, seasonKeys } from '../../types';
import DraggableCard from './DraggableCard';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DroppableCard from './DroppableCard';
import { type APISuggestionUnit } from '../../types';
type Props = {
  organization?: string;
  data: Array<APISuggestionUnit>;
  handleMonth: (id: string, month: string) => void;
};
const MonthPanel: React.FC<Props> = ({
  organization = 'آجا',
  data,
  handleMonth,
}) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <Grid container spacing={2} p={4}>
        {SeasonData.map((monthName, monthNumber) => (
          <Grid key={monthNumber} size={{ md: 6 }} sx={{ display: 'flex' }}>
            <DroppableCard month={monthNumber} handleMonth={handleMonth}>
              <Card sx={{ flexGrow: 1 }}>
                <CardContent
                  sx={{
                    backgroundColor:
                      monthNumber === 1
                        ? 'lightgreen'
                        : monthNumber === 2
                          ? 'yellow'
                          : monthNumber === 3
                            ? 'orange'
                            : 'cyan',
                    // backgroundColor:monthNumber/3<1?'lightgreen'
                    // :monthNumber/3<2?'yellow'
                    // :monthNumber/3<3?'orange'
                    // :'cyan'
                  }}
                >
                  {monthName}
                </CardContent>
                <CardContent>
                  {data
                    .filter(
                      (row: APISuggestionUnit) =>
                        row.season === seasonKeys[monthNumber]
                    )
                    ?.map(item => (
                      <DraggableCard unitId={item.id ?? '0'} key={item.id}>
                        <span>{item.organizationName}</span>
                      </DraggableCard>
                    ))}
                </CardContent>
              </Card>
            </DroppableCard>
          </Grid>
        ))}
      </Grid>
    </DndProvider>
  );
};

export default MonthPanel;
