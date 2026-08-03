import { Box, Typography } from '@mui/material';

export default function Footer({ push }) {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: '0',
        left: 0,
        right: '0',
        marginLeft: `${push}px`,
        bgcolor: '#a6e1f3',
        // bgcolor: '#afee75',
        textAlign: 'center',
        padding: '10px',
      }}
    >
      <Typography>ارتش جمهوری اسلامی ایران - اداره فناوری اطلاعات</Typography>
    </Box>
  );
}
