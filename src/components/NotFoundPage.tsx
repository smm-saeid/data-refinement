import { ArrowBack, Home } from "@mui/icons-material";
import { Box, Button, Container, Paper, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: { xs: 4, sm: 6 },
            borderRadius: 2,
            textAlign: 'center',
          }}
        >
          <Typography
          variant='h1'
          sx={{
            fontSize: {xs: 80, sm: 120},
            fontWeight: 700,
            lineHeight: 1,
            md: 2
          }}
          >
            404
          </Typography>
          <Typography
          variant='h5'
          component={'h2'}
          marginBottom={10}
          >
            صفحه مورد نظر یافت نشد
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent={'center'}
          >
            <Button
              variant={'contained'}
              startIcon={<Home />}
              onClick={() => navigate('/')}
              sx={{ borderRadius: 2 }}
            >
              صفحه اصلی
            </Button>
            <Button
              variant={'outlined'}
              startIcon={<ArrowBack />}
              onClick={() => navigate(-1)}
              sx={{ borderRadius: 2 }}
            >
              بازگشت
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};