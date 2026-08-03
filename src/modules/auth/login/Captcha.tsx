import {
  Box,
  CircularProgress,
  FormLabel,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { useEffect, useState } from 'react';

const CAPTCHA_URL = `${import.meta.env.VITE_KEYCLOAK_SERVICE}/captcha`;

function Captcha() {
  const [captchaImage, setCaptchaImage] = useState<string>('');
  const [captchaLoading, setCaptchaLoading] = useState(false);

  const fetchCaptcha = async () => {
    try {
      setCaptchaLoading(true);

      const response = await fetch(CAPTCHA_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('خطا در دریافت کپچا');
      }

      const data = await response.json();

      const base64Image = data?.data?.[0]?.imageData;

      const imageData = base64Image.startsWith('data:image')
        ? base64Image
        : `data:image/png;base64,${base64Image}`;

      setCaptchaImage(imageData);
    } catch (err: any) {
      console.error('❌ خطا در دریافت کپچا:', err);
    } finally {
      setCaptchaLoading(false);
    }
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);

  return (
  <Box sx={{ mb: 2 }}>
    <FormLabel sx={{ color: 'text.primary' }}>
      کد امنیتی
    </FormLabel>
    <Stack direction="row" spacing={1} alignItems="center">
      {/* Captcha Image */}
      <Box
        sx={{
          position: 'relative',
          height: 50,
          flex: 1,
          border: '1px solid #ccc',
          borderRadius: 1,
          overflow: 'hidden',
          bgcolor: '#f5f5f5',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {captchaLoading ? (
          <CircularProgress size={24} />
        ) : captchaImage ? (
          <img
            src={captchaImage}
            alt="کپچا"
            style={{
              height: '100%',
              width: '100%',
              objectFit: 'contain',
            }}
          />
        ) : (
          <Typography variant="caption" color="text.secondary">
            خطا در بارگذاری
          </Typography>
        )}
      </Box>

      {/* Refresh Button */}
      <IconButton
        onClick={fetchCaptcha}
        disabled={captchaLoading}
        color="primary"
      >
        <Refresh />
      </IconButton>
    </Stack>
  </Box>
  );
}

export default Captcha;