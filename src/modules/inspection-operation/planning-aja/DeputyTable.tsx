import {
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material'
import { DeputiesEnum } from '../types';
import { type Unit } from '../types';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
type APiDeputiesDataType = {
  season: string;
  organizations: organizations[];
};
type organizations = { id: string };
interface MyProps {
  dep: DeputiesEnum;
  planState: APiDeputiesDataType;
  activeStep: number;
  handleDeleteItem: (id: string) => void;
  units: Array<Unit>;
}
export default function DeputyTable({
                                      planState,
                                      handleDeleteItem,
                                      units,
                                    }: MyProps) {
  const tableRows: Array<any> = [];
  const deleteItemHandler = (id: string) => {
    handleDeleteItem(id);
  };
  const renderTable = () => {
    if (planState?.organizations) {
      let myUnits = units.filter(item =>
        planState?.organizations.map(item => item.id).includes(item.id)
      );

      myUnits?.forEach((plannedUnit: Unit, index: number) => {
        tableRows.push(
          <tr key={index}>
            <TableCell width="30%">{plannedUnit.parentName}</TableCell>
            <TableCell>{plannedUnit.name}</TableCell>
            <TableCell width="20%">
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
          <TableRow>
            <TableCell>نیرو</TableCell>
            <TableCell>یگان</TableCell>
            <TableCell>عملیات</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{tableRows}</TableBody>
      </Table>
    );
  };
  return <Grid size={{ md: 12 }}>{renderTable()}</Grid>;
};
