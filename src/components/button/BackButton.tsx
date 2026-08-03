import { Button } from '@mui/material';
import ReplyIcon from '@mui/icons-material/Reply';

type MuiColor =
  | 'inherit'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'error'
  | 'warning'
  | 'info';

export default function BackButton({
  onBack = () => {
    window.history.back();
  },
  text = 'بازگشت',
  color = 'warning',
  minWidth = '150px',
}: {
  onBack?: () => void;
  text?: string;
  color?: MuiColor;
  minWidth?: string | number;
}) {
  return (
    <Button
      variant="outlined"
      onClick={() => onBack()}
      color={color}
      endIcon={<ReplyIcon />}
      sx={{ minWidth: { minWidth }, mb: 2 }}
    >
      {text}
    </Button>
  );
}
