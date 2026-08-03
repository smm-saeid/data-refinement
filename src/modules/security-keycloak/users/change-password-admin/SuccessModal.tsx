import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
}

export function SuccessModal({ open, onClose }: SuccessModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <CheckCircle color="success" />
          <Typography variant="h6">موفقیت</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography>رمز عبور با موفقیت تغییر یافت.</Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button variant="contained" onClick={onClose} fullWidth>
          تایید
        </Button>
      </DialogActions>
    </Dialog>
  );
}
