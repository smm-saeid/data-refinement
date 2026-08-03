import { createTheme } from '@mui/material/styles';
import createCache from '@emotion/cache';
import stylisRTLPlugin from 'stylis-plugin-rtl';

// ✅ Create MUI Theme with RTL direction
export const theme = createTheme({
  direction: 'rtl', // RTL mode
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#9c27b0',
    },
  },
  typography: {
    fontFamily: 'Vazirmatn, Roboto, Arial, sans-serif',
  },
});

// ✅ Create Emotion cache for RTL
export const rtlCache = createCache({
  key: 'muirtl', // unique cache key for Material UI RTL
  stylisPlugins: [stylisRTLPlugin],
});