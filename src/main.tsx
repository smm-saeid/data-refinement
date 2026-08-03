import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { router } from './router';
// import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CacheProvider } from '@emotion/react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { rtlCache, theme } from '@/theme.ts';
import { SnackbarProvider } from './components/snackbar/SnackbarContent';
import { AuthProvider } from '@/context/AuthProvider.tsx';
import 'ckeditor5/ckeditor5.css';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <CacheProvider value={rtlCache}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SnackbarProvider>
            <AuthProvider>
              <RouterProvider router={router} />
            </AuthProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </CacheProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
