// src/modules/inspection-operation/planning-aja/components/PlanningLayout.tsx

import React from 'react';
import { Box, Grid, Tab, Tabs, Typography, Paper, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface PlanningLayoutProps {
  tabs: string[];
  activeStep: number;
  onStepChange: (newValue: number) => void;
  children: React.ReactNode;
  footer: React.ReactNode; // دکمه‌های پایین صفحه
}

export const PlanningLayout: React.FC<PlanningLayoutProps> = ({
                                                                tabs,
                                                                activeStep,
                                                                onStepChange,
                                                                children,
                                                                footer
                                                              }) => {
  const theme = useTheme();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    onStepChange(newValue);
  };

  return (
    <Paper
      elevation={2}
      sx={{
        width: '100%',
        mt: 2,
        p: 2,
        borderRadius: 2,
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* بخش اصلی: تب‌ها و محتوا */}
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>

        {/* ستون تب‌های عمودی */}
        <Grid size={{xs: 12, md: 3, lg: 2}}>
          <Box
            sx={{
              bgcolor: 'background.paper',
              borderLeft: `1px solid ${theme.palette.divider}`, // خط جداکننده سمت چپ (چون RTL هستیم)
              height: '100%',
            }}
          >
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={activeStep}
              onChange={handleChange}
              aria-label="Planning steps"
              sx={{
                '& .MuiTab-root': {
                  minHeight: 60,
                  border: '1px solid #f0f0f0'
                }
              }}
            >
              {tabs.map((label, index) => (
                <Tab
                  key={index}
                  label={label}
                  id={`vertical-tab-${index}`}
                  disabled={false} // یا بسته به لاجیک بیزنس می‌توانید دیسیبل کنید
                />
              ))}
            </Tabs>
          </Box>
        </Grid>

        {/* ستون محتوای فرم */}
        <Grid  size={{xs: 12, md: 9, lg: 10}}>
          <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>

            {/* محتوای اصلی تب */}
            <Box sx={{ flexGrow: 1 }}>
              {children}
            </Box>

            {/* فوتر (دکمه‌ها) */}
            <Box sx={{ mt: 4, pt: 2, borderTop: '1px dashed lightgrey' }}>
              {footer}
            </Box>

          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};