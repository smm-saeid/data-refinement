import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MessageViewer from './MessageViewer';
import FormsReport from './FormsReport';
import FinalSubmission from './FinalSubmission';

interface FormData {
  id: string;
  unit: string;
  title: string;
  description: string;
}

const MainLetterFirst = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [forms, setForms] = useState<FormData[]>([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  const handleMessagesLoaded = (loadedMessages: any[]): void => {
    setMessages(loadedMessages);
  };

  const handleFormsUpdate = (updatedForms: FormData[]): void => {
    setForms(updatedForms);
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <Box
        sx={{
          mb: 17,
          position: 'fixed',
          top: { xs: '56px', sm: '64px' },
          zIndex: 9999,
          left: { xs: 0, md: 280 },
          right: 0,
          width: { xs: '100%', md: 'calc(100% - 280px)' },
          bgcolor: 'background.paper',
          boxShadow: 1,
          px: { xs: 1, sm: 2 },
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            px: { xs: 0, sm: 2 },
            py: { xs: 1, sm: 0 },
          }}
        >
          <MessageViewer onMessagesLoaded={handleMessagesLoaded} />
        </Container>
      </Box>

      <Container
        maxWidth="lg"
        sx={{
          py: 4,
          pt: {
            xs: 28,
            sm: 32,
            md: 36,
          },
          px: { xs: 1, sm: 2, md: 3 },
        }}
      >
        <Box
          sx={{
            mt: 17,
            mb: 4,
            transition: 'all 0.3s ease-in-out',
          }}
        >
          <FormsReport messages={messages} onFormsUpdate={handleFormsUpdate} />
        </Box>

        <Box
          sx={{
            transition: 'all 0.3s ease-in-out',
          }}
        >
          <FinalSubmission forms={forms} onFormsUpdate={handleFormsUpdate} />
        </Box>

        {forms.length === 0 && (
          <Paper
            elevation={2}
            sx={{
              p: { xs: 3, md: 4 },
              textAlign: 'center',
              mt: 4,
              bgcolor: 'grey.50',
            }}
          >
            <Typography
              variant={isMobile ? 'h6' : 'h5'}
              color="text.secondary"
              gutterBottom
            >
              📝 سامانه گزارش‌دهی
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: '400px', mx: 'auto' }}
            >
              برای شروع، لطفاً از بخش "فرم‌های گزارش‌دهی" اولین فرم خود را ایجاد
              کنید.
            </Typography>
          </Paper>
        )}
      </Container>

      {isMobile && <Box sx={{ height: '20px' }} />}
    </Box>
  );
};

export default MainLetterFirst;
