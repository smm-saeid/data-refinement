import { Box, Button, Grid, Typography } from '@mui/material';
import { useState } from 'react';
import { Navigate, useParams } from 'react-router';
import ReviewSummary from '../components/ReviewSummary';
import HeadReport from '../components/HeadReport';
import ReviewStats from '../components/ReviewStats';

const steps = ['گزارش بازبینه ها', 'گزارش رئیس بازرسی', 'آمار بازبینه ها'];

export default function FinalReport() {
  const [selectedStep, setSelectedStep] = useState(0);
  const { id } = useParams();

  if (!id) {
    return <Navigate to="/404" />;
  }

  const handleNext = () =>
    setSelectedStep(prev => Math.min(prev + 1, steps.length - 1));
  const handleBack = () => setSelectedStep(prev => Math.max(prev - 1, 0));

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Grid container spacing={1} justifyContent="center" mb={4}>
        {steps.map((step, index) => (
          <Grid
            size={{
              xs: 4,
              md: 2,
            }}
            key={index}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Box
              sx={{
                flex: 1,
                height: '2px',
                bgcolor: index <= selectedStep ? 'primary.main' : 'grey.300',
                visibility: index === 0 ? 'hidden' : 'visible',
              }}
            />
            <Box
              sx={{
                px: 2,
                py: 1,
                borderRadius: 2,
                bgcolor:
                  index === selectedStep
                    ? 'primary.main'
                    : index < selectedStep
                      ? 'primary.dark'
                      : 'grey.300',
                color: index <= selectedStep ? 'white' : 'grey.600',
                cursor: 'pointer',
                transition: '0.3s',
                textAlign: 'center',
                minWidth: '120px',
              }}
              onClick={() => setSelectedStep(index)}
            >
              <Typography variant="body2" fontWeight="bold">
                {step}
              </Typography>
            </Box>
            <Box
              sx={{
                flex: 1,
                height: '2px',
                bgcolor: index < selectedStep ? 'primary.main' : 'grey.300',
                visibility: index === steps.length - 1 ? 'hidden' : 'visible',
              }}
            />
          </Grid>
        ))}
      </Grid>
      <Box sx={{ minHeight: '50vh' }}>
        {selectedStep === 0 && <ReviewSummary />}
        {selectedStep === 1 && <HeadReport />}
        {selectedStep === 2 && <ReviewStats />}
      </Box>
      <Grid container justifyContent="space-between" mt={4}>
        <Grid>
          <Button
            variant="contained"
            color="inherit"
            onClick={handleBack}
            disabled={selectedStep === 0}
            sx={{ mr: 1 }}
          >
            مرحله قبل
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            disabled={selectedStep === steps.length - 1}
          >
            مرحله بعد
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
