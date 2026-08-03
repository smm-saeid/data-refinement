import {
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

interface Props {
  handleDeleteItem: (id: string) => void;
  units: Array<{
    id: string;
    name: string;
    parentName: string;
    parentId: string;
  }>;
}
export default function UnitsTable({ handleDeleteItem, units }: Props) {
  return (
    <Grid size={{ xs: 12 }}>
      <Table sx={{ marginBlockStart: '12px', width: '100%' }}>
        <TableHead>
          <TableRow>
            <TableCell>ردیف</TableCell>
            <TableCell>نیرو</TableCell>
            <TableCell>یگان</TableCell>
            <TableCell>عملیات</TableCell>
          </TableRow>
        </TableHead>
        <TableBody style={{ maxHeight: '600px' }}>
          {units?.map((unit, index) => (
            <tr key={`unit${index}`}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{unit.name}</TableCell>
              <TableCell>{unit.parentName}</TableCell>
              <TableCell>
                <Tooltip title="حذف" arrow>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteItem(unit.id)}
                  >
                    <DeleteOutlineOutlinedIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </tr>
          ))}
        </TableBody>
      </Table>
    </Grid>
  );
}
