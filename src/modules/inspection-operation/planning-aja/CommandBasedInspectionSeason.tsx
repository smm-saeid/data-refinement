import { Tab, Tabs } from "@mui/material";
import React from "react";
interface MyProps {
  data: string[];
  click: (e: React.SyntheticEvent, value: number) => void;
  selected: number | undefined;
}
const CommandBasedInspectionSeason: React.FC<MyProps> = ({data,selected,click}) => {
  // const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  return (
    <Tabs value={selected} onChange={click}>
      {data.map((item, index) => (
        <Tab key={item} value={index} label={item} />
      ))}
    </Tabs>
  );
};

export default CommandBasedInspectionSeason;
