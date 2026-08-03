import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Box, Skeleton, Typography, Grid } from '@mui/material';
import { useApiQuery } from '@/hooks/useApi';
import InspectionApis from '../../api.ts';
import MatnaStepper from '@/components/MatnaStepper.tsx';
import SelfAssessmentConfigurationStep1 from '../components/SelfAssessmentConfigurationStep1.tsx';

import BackButton from '@/components/button/BackButton.tsx';
import SelfAssessmentConfigurationStep2 from '../components/SelfAssessmentConfigurationStep2.tsx';
import SelfAssessmentConfigurationStep3 from '../components/SelfAssessmentConfigurationStep3.tsx';
import SelfAssessmentConfigurationStep4 from '../components/SelfAssessmentConfigurationStep4.tsx';
import SelfAssessmentConfigurationStep5 from '../components/SelfAssessmentConfigurationStep5.tsx';
import SelfAssessmentConfigurationStep6 from '../components/SelfAssessmentConfigurationStep6.tsx';
import SelfAssessmentConfigurationStep7 from '../components/SelfAssessmentConfigurationStep7.tsx';
import SelfAssessmentConfigurationStep8 from '../components/SelfAssessmentConfigurationStep8.tsx';
const steps = [
  'مشخصات استحضاریه',
  'اهداف',
  'تخصص استحضاریه',
  'صدور استحضاریه',
  'اختصاص افراد',
  'مسئولین یگان',
  'اختصاص بازبینه ها',
  'صدور دستورالعمل',
];
export default function StartAssessmentSteps() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedStep, setSelectedStep] = useState(null);
  const { data: data, refetch } = useApiQuery({
    url: InspectionApis.verfication.information(id),
    select: (res: any) => {
      return res?.data;
    },
  });

  useEffect(() => {
    if (data == null) {
      return;
    }
    if (data?.state == null || data?.state == 'MOSHAKHASAT_ESTEHZARIYE') {
      setSelectedStep(0);
    } else if (data?.state == 'AHDAF') {
      setSelectedStep(1);
    } else if (data?.state == 'TAKHASOS_ESTEHZARIYE') {
      setSelectedStep(2);
    } else if (data?.state == 'SODOR_ESTEHZARIYE') {
      setSelectedStep(3);
    } else if (data?.state == 'EKHTESAS_AFRAD') {
      setSelectedStep(4);
    } else if (data?.state == 'MASOLIN_YEGAN') {
      setSelectedStep(5);
    } else if (data?.state == 'EKHTESAS_BAZBINEH') {
      setSelectedStep(6);
    } else if (data?.state == 'SODOR_DASTOROLAMAL') {
      setSelectedStep(7);
    }
  }, [data]);

  return (
    <Grid
      container
      display={'flex'}
      justifyContent={'space-between'}
      margin={2}
    >
      <Grid size={{ md: 9 }}>
        <Typography fontWeight={700} variant="h5" marginBottom={'50px'}>
          پیکر بندی خودارزیابی {data?.organizationUnitName}
        </Typography>
      </Grid>
      <Grid size={{ md: 2 }}>
        <BackButton
          color="warning"
          minWidth={'150px'}
          text="بازگشت"
          onBack={() => navigate(`/operation/self-assessment`)}
        />
      </Grid>

      {selectedStep == null ? (
        <Skeleton height={500} />
      ) : (
        <Grid container width={'100%'}>
          <Grid
            size={{ md: 11 }}
            display={'flex'}
            justifyContent={'center'}
            width={'100%'}
          >
            <MatnaStepper steps={steps} selectedStep={selectedStep} />
          </Grid>
          <Box width={'100%'}>
            {selectedStep === 0 ? (
              <SelfAssessmentConfigurationStep1
                inspectionInformation={data}
                refetchStep={refetch}
              />
            ) : selectedStep === 1 ? (
              <SelfAssessmentConfigurationStep2
                inspectionInformation={data}
                refetchStep={refetch}
              />
            ) : selectedStep === 2 ? (
              <SelfAssessmentConfigurationStep3
                inspectionInformation={data}
                refetchStep={refetch}
              />
            ) : selectedStep === 3 ? (
              <SelfAssessmentConfigurationStep4
                inspectionInformation={data}
                refetchStep={refetch}
              />
            ) : selectedStep === 4 ? (
              <SelfAssessmentConfigurationStep5
                inspectionInformation={data}
                refetchStep={refetch}
              />
            ) : selectedStep === 5 ? (
              <SelfAssessmentConfigurationStep6
                inspectionInformation={data}
                refetchStep={refetch}
              />
            ) : selectedStep === 6 ? (
              <SelfAssessmentConfigurationStep7
                inspectionInformation={data}
                refetchStep={refetch}
              />
            ) : selectedStep === 7 ? (
              <SelfAssessmentConfigurationStep8
                inspectionInformation={data}
                refetchStep={refetch}
              />
            ) : null}
          </Box>
        </Grid>
      )}
    </Grid>
  );
}
