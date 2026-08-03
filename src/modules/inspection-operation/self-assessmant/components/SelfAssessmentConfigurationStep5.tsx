import {
  Box,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';


import { useLegacyApi } from '@/hooks/useLegacyApi.ts';
import { useMutation, useQuery } from '@tanstack/react-query';

const SelfAssessmentConfigurationStep5 = ({ inspectionInformation, refetchStep }: any) => {

  const legacyApi = useLegacyApi();

  const { data: experts } = useQuery<any, any, any>({
    queryKey: [
      `/person-speciality/find-by-inspection?pageSize=1000&currentPage=1&inspectionId=${inspectionInformation.inspectionId}`,
    ],
    queryFn: () =>
      legacyApi.get(
        `/person-speciality/find-by-inspection?pageSize=1000&currentPage=1&inspectionId=${inspectionInformation.inspectionId}`
      ),
    select: (res: any) => {
      return res?.data?.rows;
    },
  } as any);

  const { mutate } = useMutation({
    mutationFn: legacyApi.request,
  });

  function AssignStatusFunction(assignStatus: any) {
    switch (assignStatus) {
      case 'pending':
        return 'در انتظار یگان';
      case 'accepted':
        return 'تایید شده توسط یگان';
      case 'rejected':
        return 'توسط یگان رد شده';
      case 'rejection by inspect':
        return 'توسط بازرسی رد شده';
      case 'accepted by inspect':
        return 'تایید نهایی شده';
      default:
        return 'وضعیت نامشخص'
    }
  }

  const isNextButtonDisable = experts?.find((e) => e.assignStatus != "accepted by inspect" || e.personNumber == null || e.personNumber == "")

  return (
    <>
      {(experts != null && experts.length > 0) ? (
        <TableContainer component={Paper}>
          <Table
            aria-label="simple table"
            sx={{
              minWidth: 650,
              '& td': {
                padding: '10px !important',
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>نام تخصص</TableCell>
                <TableCell>یگان</TableCell>
                <TableCell>درجه</TableCell>
                <TableCell>نام بازرس</TableCell>
                <TableCell>وضعیت</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {experts.map((skill_data: any, index: any) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{skill_data?.commonBaseDataFieldValue}</TableCell>
                    <TableCell>{skill_data?.organizationUnitName}</TableCell>
                    <TableCell>{skill_data?.degree}</TableCell>
                    <TableCell>{(skill_data?.name ?? "" ) + " " + (skill_data?.family ?? "" )}</TableCell>
                    <TableCell>
                      {skill_data?.assignStatus == 'assigned' ? (
                        <Typography variant="body2">
                          <Button onClick={() => {}}>
                            {(skill_data?.personInfoName ?? '') +
                              ' ' +
                              (skill_data?.personInfoFamily ?? '') +
                              ` (${skill_data?.personInfoPersonNumber})`}
                          </Button>
                        </Typography>
                      ) : (
                        <Typography variant="body2">
                          {skill_data?.personNumber ? AssignStatusFunction(skill_data?.assignStatus) : "در انتظار اختصاص بازرس"}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {skill_data?.assignStatus == 'assigned' ? (
                        <Grid
                          container
                          spacing={2}
                          display={'flex'}
                          justifyContent={'center'}
                          alignItems={'center'}
                        >
                          <Grid>
                            <Button
                              variant="contained"
                              color={'error'}
                              onClick={() => {
                              }}
                            >
                              <Typography variant="body2">عدم تایید</Typography>
                            </Button>
                          </Grid>
                          <Grid>
                            <Button
                              variant="contained"
                              color={'success'}
                              onClick={() => {

                              }}
                            >
                              <Typography variant="body2">
                                تایید بازرس
                              </Typography>
                            </Button>
                          </Grid>
                        </Grid>
                      ) : !!skill_data.accepted ? (
                        <Typography variant="body2" color={'green'}>
                          تایید شده
                        </Typography>
                      ) : null}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : null}
      <Box margin={'50px'}>
        <Grid container>
          <Grid size={{ xs: 8 }}>
            <Button
              variant="contained"
              color="error"
              // disabled
              onClick={() => {
                mutate(
                  {
                    entity: `/information`,
                    method: 'put',
                    data: {
                      ...inspectionInformation,
                      state: "SODOR_ESTEHZARIYE",
                    },
                  } as any,
                  {
                    onSuccess: (_: any) => {
                      refetchStep();
                    },
                    onError: () => {},
                  }
                );
              }}
              sx={{ margin: '10px' }}
            >
              مرحله قبل
            </Button>

            <Button
              variant={'contained'}
              // disabled={isNextButtonDisable}
              onClick={() => {
                mutate(
                  {
                    entity: `/information`,
                    method: 'put',
                    data: {
                      ...inspectionInformation,
                      state: "MASOLIN_YEGAN",
                    },
                  } as any,
                  {
                    onSuccess: (_: any) => {
                      refetchStep();
                    },
                    onError: () => {},
                  }
                );
              }}
              sx={{ margin: '10px' }}
            >
              ثبت و ادامه {"(در انتظار تایید بازرسان)"}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default SelfAssessmentConfigurationStep5;
