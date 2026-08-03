import { Box, Skeleton, Typography } from '@mui/material';
import StartInspectionStep1 from '@/modules/inspection-operation/scheduled/components/StartInspectionStep1.tsx';
import StartInspectionStep2 from '@/modules/inspection-operation/scheduled/components/StartInspectionStep2.tsx';
import StartInspectionStep3 from '@/modules/inspection-operation/scheduled/components/StartInspectionStep3.tsx';
import StartInspectionStep4 from '@/modules/inspection-operation/scheduled/components/StartInspectionStep4.tsx';
import StartInspectionStep5 from '@/modules/inspection-operation/scheduled/components/StartInspectionStep5.tsx';
import StartInspectionStep6 from '@/modules/inspection-operation/scheduled/components/StartInspectionStep6.tsx';
import { useNavigate, useParams } from 'react-router';
import MatnaStepper from '@/components/MatnaStepper';
import { useEffect, useState } from 'react';
import { useLegacyApi } from '@/hooks/useLegacyApi';
import { useQuery } from '@tanstack/react-query';

const steps = [
  'مشخصات استحضاریه',
  'تخصص‌ها استحضاریه',
  'صدور گردش کار',
  'اختصاص افراد',
  'اختصاص بازبینه ها',
  'صدور دستورالعمل',
];

const StartOperationSteps = () => {
  const { inspectionId: id } = useParams();
  const legacyApi = useLegacyApi();
  const [selectedStep, setSelectedStep] = useState(null);

  const { data, refetch } = useQuery<any>({
    queryKey: [`/information/inspection-id/${id}`],
    queryFn: () => legacyApi.get(`/information/inspection-id/${id}`),
    select: (res: any) => {
      return res?.data;
    },
  } as any);

  useEffect(() => {
    if (data == null) {
      return;
    }
    if (data?.state == null || data?.state == "MOSHAKHASAT_ESTEHZARIYE") {
      setSelectedStep(0);
    }
    else if (data?.state == "TAKHASOS_ESTEHZARIYE") {
      setSelectedStep(1);
    }
    else if (data?.state == "SODOR_ESTEHZARIYE") {
      setSelectedStep(2);
    }
    else if (data?.state == "EKHTESAS_AFRAD") {
      setSelectedStep(3);
    }
    else if (data?.state == "EKHTESAS_BAZBINEH") {
      setSelectedStep(4);
    }
    else if (data?.state == "SODOR_DASTOROLAMAL") {
      setSelectedStep(5);
    }
  }, [data])




  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ margin: '20px' }}>
        <Typography fontWeight={700} variant="h5" marginBottom={'50px'}>
          پیکربندی بازرسی برنامه ای {data?.organizationUnitName} (سال {data?.year})
        </Typography>
      </Box>
      {
        selectedStep == null ? <Skeleton height={500} /> :
          <>
            <MatnaStepper steps={steps} selectedStep={selectedStep} />
            <Box width={'100%'}>
              {selectedStep === 0 ? (
                <StartInspectionStep1
                  inspectionInformation={data}
                  refetchStep={refetch}
                />
              ) : selectedStep === 1 ? (
                <StartInspectionStep2
                inspectionInformation={data}
                refetchStep={refetch}
                />
              ) : selectedStep === 2 ? (
                <StartInspectionStep3
                inspectionInformation={data}
                refetchStep={refetch}
                />
              ) : selectedStep === 3 ? (
                <StartInspectionStep4
                inspectionInformation={data}
                refetchStep={refetch}
                />
              ) : selectedStep === 4 ? (
                <StartInspectionStep5
                inspectionInformation={data}
                refetchStep={refetch}
                />
              ) : selectedStep === 5 ? (
                <StartInspectionStep6
                inspectionInformation={data}
                refetchStep={refetch}
                />
              ) : null}
            </Box>
          </>
      }
    </Box>
  );
};

export default StartOperationSteps;
