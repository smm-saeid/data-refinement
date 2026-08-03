import { useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { SystemSettingsForm } from './SystemSettingsForm';
import { CommonPasswordsTable } from './CommonPasswordsTable';

export function SystemSettings() {
  const [commonPasswordsOpen, setCommonPasswordsOpen] = useState(false);

  const handleCommonPasswordsOpen = () => {
    setCommonPasswordsOpen(true);
  };

  const handleCommonPasswordsClose = () => {
    setCommonPasswordsOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: 'bold', mb: 2 }}
        >
          مدیریت تنظیمات سیستم
        </Typography>
        <Typography variant="body1" color="text.secondary">
          در این بخش می‌توانید تنظیمات امنیتی و سیاست‌های رمز عبور سیستم را
          مدیریت کنید.
        </Typography>
      </Box>

      <SystemSettingsForm onCommonPasswordsOpen={handleCommonPasswordsOpen} />

      <CommonPasswordsTable
        open={commonPasswordsOpen}
        onClose={handleCommonPasswordsClose}
      />
    </Container>
  );
}
