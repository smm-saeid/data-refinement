import { Box, Button, Dialog, Skeleton, Typography } from '@mui/material';

import { useNavigate, useParams } from 'react-router';
import MatnaStepper from '@/components/MatnaStepper';
import { useEffect, useState } from 'react';
import { useLegacyApi } from '@/hooks/useLegacyApi';
import { useMutation, useQuery } from '@tanstack/react-query';
import MatnaEditor from '@/components/MatnaEditor';
import MatnaPersonnelPicker from '@/components/MatnaPersonnelPicker';
import { useSnackbar } from '@/hooks/useSnackbar';

const steps = ['مشاهده گردش کار', 'تختصاص و تایید بازرس'];

const AssignInspectorPage = () => {
  const { personSpecialityId } = useParams();
  const legacyApi = useLegacyApi();
  const [selectedStep, setSelectedStep] = useState(null);
  const [personnelSelectorIsOpen, SetPersonnelSelectorIsOpen] = useState(false);
  const [selectedInspector, setSelectedInspector] = useState(null);

  const { mutate } = useMutation({
    mutationFn: legacyApi.request,
  });

  const snackbar = useSnackbar();
  let navigate = useNavigate();

  const { data: expert } = useQuery<any, any, any>({
    queryKey: [`/person-speciality/id/${personSpecialityId}`],
    queryFn: () => legacyApi.get(`/person-speciality/id/${personSpecialityId}`),
    select: (res: any) => {
      return res?.data;
    },
  } as any);

  const { data } = useQuery<any>({
    queryKey: [`/information/inspection-id/${expert?.inspectionId}`],
    queryFn: () =>
      legacyApi.get(`/information/inspection-id/${expert?.inspectionId}`),
    select: (res: any) => {
      return res?.data;
    },
    enabled: !!expert,
  });

  useEffect(() => {
    if (data == null) {
      return;
    } else {
      setSelectedStep(0);
    }
    if (expert.personNumber != null) {
      setSelectedInspector({
        name: expert.name,
        family: expert.family,
        personNumber: expert.personNumber,
      });
    }
  }, [data]);

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ margin: '20px' }}>
        <Typography fontWeight={700} variant="h5" marginBottom={'50px'}>
          اختصاص بازرس
        </Typography>
      </Box>
      {selectedStep == null ? (
        <Skeleton height={500} />
      ) : (
        <>
          <MatnaStepper steps={steps} selectedStep={selectedStep} />
          <Box width={'100%'}>
            {selectedStep === 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <MatnaEditor
                  initialData={data.issuanceInformation}
                  onChange={null}
                />
                <Button
                  variant={'contained'}
                  onClick={() => {
                    setSelectedStep(1);
                  }}
                  sx={{ margin: '10px' }}
                >
                  ثبت و ادامه
                </Button>
              </Box>
            ) : selectedStep === 1 ? (
              <Box>
                {expert.personNumber ? (
                  <Typography>
                    بازرس پیشنهادی کارشناس عملیات: (
                    {expert.name +
                      ' ' +
                      expert.family +
                      ' - کد پرسنلی: ' +
                      expert.personNumber}
                    )
                  </Typography>
                ) : (
                  <Typography>کارشناس عملیات فرد پیشنهادی ندارد</Typography>
                )}
                <Box height={50} />
                <Typography>
                  بازرس انتخاب شده: (
                  {!!selectedInspector
                    ? selectedInspector.name +
                      ' ' +
                      selectedInspector.family +
                      ' - کد پرسنلی: ' +
                      selectedInspector.personNumber
                    : 'انتخاب کنید'}
                  )
                </Typography>
                <Box height={50} />
                <Button
                  variant={'contained'}
                  onClick={() => {
                    SetPersonnelSelectorIsOpen(true);
                  }}
                  sx={{ margin: '10px' }}
                >
                  {!selectedInspector ? 'انتخاب بازرس' : 'تغییر بازرس'}
                </Button>
                <Button
                  variant={'contained'}
                  color="success"
                  onClick={() => {
                    mutate(
                      {
                        entity: `/person-speciality`,
                        method: 'put',
                        data: {
                          ...expert,
                          personNumber: selectedInspector.personNumber,
                          assignStatus: 'accepted',
                          name: selectedInspector.name,
                          family: selectedInspector.family,
                        },
                      } as any,
                      {
                        onSuccess: (res: any) => {
                          snackbar(
                            'با موفقیت ذخیره شد. به کارتابل متقل میشوید...',
                            'success',
                            2000
                          );
                          setTimeout(() => {
                            navigate('/');
                          }, 2000);
                        },
                      }
                    );
                  }}
                  sx={{ margin: '10px' }}
                >
                  تایید و ارسال
                </Button>
              </Box>
            ) : null}
          </Box>
        </>
      )}
      <Dialog
        fullWidth
        maxWidth={'lg'}
        open={personnelSelectorIsOpen}
        onClose={() => SetPersonnelSelectorIsOpen(false)}
      >
        {expert != null ? (
          <MatnaPersonnelPicker
            orgId={expert?.organizationUnitId}
            onPersonnelSelect={row => {
              setSelectedInspector({
                name: row.firstName,
                family: row.lastName,
                personNumber: row?.personnelCode,
              });
              SetPersonnelSelectorIsOpen(false);
            }}
          />
        ) : null}
      </Dialog>
    </Box>
  );
};

export default AssignInspectorPage;
