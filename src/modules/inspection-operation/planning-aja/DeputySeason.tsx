import { Tab, Tabs } from '@mui/material';
import React from 'react';
interface MyProps {
  data: string[];
  click: (e: React.SyntheticEvent, value: number) => void;
  selected: number | undefined;
}
export default function DeputySeason({ data, selected, click }: MyProps) {
  return (
    <Tabs value={selected} onChange={click}>
      {data.map((item, index) => (
        <Tab key={item} value={index} label={item} />
      ))}
    </Tabs>
  );
}
