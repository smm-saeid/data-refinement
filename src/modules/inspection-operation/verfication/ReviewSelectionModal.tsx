import { ListAlt } from '@mui/icons-material';
import {
  Modal,
  DialogTitle,
  TableContainer,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  Table,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useSnackbar } from 'hooks/useSnackbar';
import React from 'react';
import { useNavigate } from 'react-router';
import { useLegacyApi } from 'hooks/useLegacyApi.ts';

type Props = {
  reviewFlag: boolean;
  setReviewFlag: React.Dispatch<React.SetStateAction<boolean>>;
  personSpeciality: any;
};

const ReviewSelectionModal = ({
  reviewFlag,
  setReviewFlag,
  personSpeciality,
}: Props) => {
  const legacyApi = useLegacyApi();

  const { mutate } = useMutation({
    mutationFn: legacyApi.request,
  });
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  return (
    <Modal
      open={reviewFlag}
      onClose={() => {
        setReviewFlag(false);
      }}
      sx={{ justifyContent: 'center', display: 'flex', alignItems: 'center' }}
      aria-labelledby="modal-city-select"
      aria-describedby="modal-city-select-description"
    >
      <Dialog
        maxWidth="lg"
        open={reviewFlag}
        onClose={() => {
          setReviewFlag(false);
        }}
      >
        <DialogTitle>بازبینه ها</DialogTitle>
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ bgcolor: 'lightsalmon' }}>
              <TableRow>
                <TableCell align="center">نام</TableCell>
                <TableCell align="center">نام خانوادگی</TableCell>
                <TableCell align="center">نام بازبینه</TableCell>
                <TableCell align="center">وضعیت نمره دهی</TableCell>
                <TableCell align="center">انتخاب</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {personSpeciality?.map(
                (specialItem: any, specialIndex: number) => (
                  <TableRow key={specialIndex}>
                    <TableCell align="center">
                      {specialItem?.personSpecialityPersonInfoName}
                    </TableCell>
                    <TableCell align="center">
                      {specialItem?.personSpecialityPersonInfoFamily}
                    </TableCell>
                    <TableCell align="center">
                      {specialItem?.reviewGroupName}
                    </TableCell>
                    <TableCell align="center">
                      {specialItem?.confirmed ? (
                        <Chip label="انجام شده" color="secondary" />
                      ) : (
                        <Chip label="آماده نمره دهی" color="success" />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="نمره دهی">
                        <IconButton
                          color="info"
                          onClick={() => {
                            mutate(
                              {
                                entity: `person-speciality-review-group/find-by-person-speciality-id-for-show-grading`,
                                method: 'post',
                                data: { ...specialItem },
                              } as any,
                              {
                                onSuccess: (res: any) => {
                                  snackbar(res, 'success', 5000);
                                },
                                onError: () => {},
                              }
                            );
                            navigate(
                              `${specialItem?.reviewGroupId}/${specialItem?.personSpecialityPersonInfoId}`,
                              {
                                state: { specialItem },
                              }
                            );
                          }}
                        >
                          <ListAlt />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Dialog>
    </Modal>
  );
};

export default ReviewSelectionModal;
