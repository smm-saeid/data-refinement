import { Typography, Stack, Box, IconButton, Tooltip } from '@mui/material';
import { Download } from '@mui/icons-material';

export default function NotebookGuide() {
  const pdfUrl = '/guide.pdf';

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'guide.pdf';
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <>
      <Typography variant="h4">دفترچه راهنما</Typography>
      <Stack spacing={2} p={8}>
        <Typography
          variant="body1"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          میتوانید از دفترچه زیر برای کاربری آسان سامانه استفاده کنید.
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center' }} pt={2} pb={2}>
          <Tooltip title="دانلود">
            <IconButton
              size="small"
              color="info"
              onClick={handleDownload}
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: 'warning.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'warning.dark',
                },
              }}
            >
              <Download fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Box
          sx={{
            border: '1px solid #ddd',
            borderRadius: 2,
            overflow: 'hidden',
            height: '80vh',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <iframe
            src={pdfUrl}
            title="Notebook Guide PDF"
            width="100%"
            height="100%"
            style={{ border: 'none' }}
          />
        </Box>
      </Stack>
    </>
  );
}
