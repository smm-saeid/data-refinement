// src / layouts / DashboardLayout.tsx;
import Header from '@/components/layout/Header';
// import Sidebar from '@/components/layout/Sidebar';
import { Outlet } from 'react-router';
import { Box, Toolbar } from '@mui/material'; // ✅ Import Toolbar
import Sidebar from './Sidebar';
import Footer from './Footer';

const drawerWidth = 280;

export default function DashboardLayout() {
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        width: '100vw',
        maxWidth: '100vw',
        overflow: 'hidden',
      }}
    >
      <Header />
      {/* Sidebar fixed on right */}
      <Sidebar drawerWidth={drawerWidth} />
      {/* Main content shifted by drawer width */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          width: `calc(100vw - ${drawerWidth}px)`,
          maxWidth: `calc(100vw - ${drawerWidth}px)`,
          overflow: 'hidden',
        }}
      >
        <Toolbar />

        <Box
          sx={{
            flexGrow: 1,
            p: 2,
            overflow: 'auto',
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box',
          }}
        >
          <Outlet />
        </Box>
      </Box>
      <Footer push={drawerWidth} />
    </Box>
  );
}
