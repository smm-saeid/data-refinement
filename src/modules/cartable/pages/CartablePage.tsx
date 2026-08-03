import { useState } from 'react';
import { Box, Container, Paper, Typography, Tabs, Tab } from '@mui/material';
import { CartableTab, type CartableFilter } from '../types.tsx';
import CartableTable from '../components/CartableTable.tsx';
import CartableFilters from '../components/CartableFilters.tsx';
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

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

export default function CartablePage() {
  const [currentTab, setCurrentTab] = useState(0);
  const [filters, setFilters] = useState<CartableFilter>({});

  // @ts-ignore
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleFilterChange = (newFilters: CartableFilter) => {
    setFilters(newFilters);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          کارتابل
        </Typography>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <CartableFilters onFilterChange={handleFilterChange} />
      </Paper>

      <Tabs value={currentTab} onChange={handleTabChange} variant="fullWidth">
        {Object.values(CartableTab).map((tab, _tabIndex) => (
          <Tab
            key={`tab-${tab.key}`}
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: '8px',
            }}
            icon={tab.icon}
            iconPosition="start"
            label={tab.label}
          />
        ))}
      </Tabs>

      {Object.values(CartableTab).map((tab, tabIndex) => (
        <TabPanel value={currentTab} index={tabIndex} key={`table-${tab.key}`}>
          <CartableTable type={tab.key} filters={filters} />
        </TabPanel>
      ))}
    </Container>
  );
}
