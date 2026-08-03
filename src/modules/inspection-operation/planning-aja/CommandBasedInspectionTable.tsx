import {
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  Tooltip,
} from '@mui/material';
import React from 'react';
import { DeputiesEnum } from '../types';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { type IExcelForm } from '../types';
type MyProps = {
  dep: DeputiesEnum;
  planState: Array<IExcelForm>;
  activeStep: number;
  handleDeleteItem: (index: string, season: number) => void;
  handleDescriptionChange?: (
    newValue: string,
    deputy: DeputiesEnum,
    season: number,
    item: number
  ) => void;
};
const CommandBasedInspectionTable: React.FC<MyProps> = ({
  planState,
  activeStep,
  handleDeleteItem,
}) => {
  console.log(planState?.length);
  const tableRows: Array<any> = [];
  const deleteItemHandler = (index: string) => {
    handleDeleteItem(index, activeStep);
  };
  const renderTable = (planState: Array<IExcelForm>) => {
    console.log('rendering');
    let commandBasedInspections = (planState ?? []).filter(item =>
      [activeStep * 3, activeStep * 3 + 1, activeStep * 3 + 2].includes(
        item.month
      )
    );
    if (commandBasedInspections) {
      commandBasedInspections.forEach((plannedUnit: IExcelForm) => {
        tableRows.push(
          <tr key={plannedUnit.id}>
            <TableCell width="35%">{plannedUnit.organizationName}</TableCell>
            <TableCell width="55%">{plannedUnit.unitName}</TableCell>

            <TableCell>
              <Tooltip title="حذف" arrow>
                <IconButton
                  color="error"
                  onClick={() => deleteItemHandler(plannedUnit.id)}
                >
                  <DeleteOutlineOutlinedIcon />
                </IconButton>
              </Tooltip>
            </TableCell>
          </tr>
        );
      });
    }

    return (
      <Table sx={{ marginBlockStart: '12px', width: '100%' }}>
        <TableHead>
          <tr>
            <th>نیرو</th>
            <th>یگان</th>
            <th>عملیات</th>
          </tr>
        </TableHead>
        <TableBody>{tableRows}</TableBody>
      </Table>
    );
  };
  return <Grid size={{ md: 12 }}>{renderTable(planState)}</Grid>;
};

export default CommandBasedInspectionTable;
