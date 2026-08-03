import BackButton from '@/components/button/BackButton';
import { Box, Grid, Tab, Tabs, Typography, Badge } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export default function PlanningTabs() {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(0);
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };
  const [tabCounts, setTabCounts] = useState({
    current: 0,
    completed: 0,
    failed: 0,
    all: 0,
  });

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`workflow-tabpanel-${index}`}
        aria-labelledby={`workflow-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
      </div>
    );
  }

  return (
    <Grid container justifyContent={'center'}>
      <Grid
        container
        size={{ xs: 11 }}
        display={'flex'}
        justifyContent={'space-between'}
      >
        <Typography fontWeight={700} variant="h5">
          طرح ریزی بازرسی ها
        </Typography>

        <BackButton
          text="بازگشت"
          minWidth={150}
          color="warning"
          onBack={() => navigate(-1)}
        />
      </Grid>

      <Grid container size={{ md: 11 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Tab
            iconPosition="start"
            label={
              <Badge badgeContent={tabCounts.current} color="primary">
                <Box sx={{ ml: 2 }}>برنامه ای </Box>
              </Badge>
            }
          />
          <Tab
            iconPosition="start"
            label={
              <Badge badgeContent={tabCounts.completed} color="success">
                <Box sx={{ ml: 2 }}>پیگیری</Box>
              </Badge>
            }
          />
          <Tab
            iconPosition="start"
            label={
              <Badge badgeContent={tabCounts.failed} color="error">
                <Box sx={{ ml: 2 }}>برنامه ای خودارزیابی</Box>
              </Badge>
            }
          />
          <Tab
            iconPosition="start"
            label={
              <Badge badgeContent={tabCounts.all} color="default">
                <Box sx={{ ml: 2 }}>راستی آزمایی</Box>
              </Badge>
            }
          />
        </Tabs>

        <TabPanel value={currentTab} index={0}></TabPanel>
        <TabPanel value={currentTab} index={1}></TabPanel>
        <TabPanel value={currentTab} index={2}></TabPanel>
        <TabPanel value={currentTab} index={3}></TabPanel>
      </Grid>
    </Grid>
  );
}
