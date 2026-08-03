import { Book, ListAlt } from '@mui/icons-material';
import {
  Grid,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  Modal,
  CircularProgress,
  Tab,
  Tabs,
} from '@mui/material';
import BackButton from '@/components/button/BackButton';
import React, { useState } from 'react';
import Homes from './components/Homes';
import PublicPlace from './components/PublicPlace';
import Crime from './components/Crime';
import Violation from './components/Violation';
import ShootingReport from "./components/ShootingReport";
import { useApiQuery } from '@/hooks/useApi';
import InspectionApis from '../api';

export default function ExecutingVerficationListDocuments() {
  const [reportId, setReportId] = useState(null);
  const [selectedReportItem, setselectedReportItem] = useState({} as any);
  const [selectedReportType, setselectedReportType] = useState(0);
  const reportType = [
    'خانه های سازمانی',
    'مهمانسراها و...',
    'جرایم',
    'تخلفات',
    'تیر اندازی',
  ];

  const { data: titleData } = useApiQuery<any>({
    url: InspectionApis.verfication.independentReportsTitle(reportId),
    enabled: !!reportId,    
  });

  const { data: descriptionData } = useApiQuery<any>({
    url: InspectionApis.verfication.independentReportsReview(
      titleData?.data?.id
    ),
    enabled: !!titleData,
  });

  return (
    <Grid container justifyContent={'center'}>
      <Grid
        size={{ md: 11 }}
        container
        m={2}
        display={'flex'}
        justifyContent={'space-between'}
      >
        <Box display="flex" mb={1}>
          <Book />
          <Typography variant="h6" component={'h3'}>
            گزارشات آماری
          </Typography>
        </Box>
        <Box display="flex">
          <Tabs
            value={selectedReportType}
            onChange={(e: React.SyntheticEvent, value: number) =>
              setselectedReportType(value)
            }
          >
            {reportType.map((item, index) => (
              <Tab wrapped key={index} value={index} label={item} />
            ))}
          </Tabs>

          <BackButton />
        </Box>
      </Grid>
      {selectedReportType === 0 ? (
        <Homes editable={true} />
      ) : selectedReportType === 1 ? (
        <PublicPlace editable={true} />
      ) : selectedReportType === 2 ? (
        <Crime editable={true} />
      ) : selectedReportType === 3 ? (
        <Violation editable={true} />
      ) : <ShootingReport/>}

      <Modal
        open={!!reportId}
        onClose={() => {
          setReportId(null);
        }}
        sx={{ justifyContent: 'center', display: 'flex', alignItems: 'center' }}
        aria-labelledby="modal-city-select"
        aria-describedby="modal-city-select-description"
      >
        <Dialog
          maxWidth="lg"
          open={!!reportId}
          onClose={() => {
            setReportId(null);
          }}
        >
          <DialogTitle display={'flex'}>
            <ListAlt fontSize="large" />
            {selectedReportItem?.title}
          </DialogTitle>
          <Paper
            sx={{
              display: 'flex',
              justifyContent: 'center',
              height: '15vh',
              alignItems: 'center',
            }}
          >
            <CircularProgress />
          </Paper>
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ bgcolor: 'lightsalmon' }}>
                <TableRow>
                  <TableCell align="center">
                    {titleData?.data?.questionTitle}
                  </TableCell>
                  <TableCell align="center">
                    {titleData?.data?.answerTitle}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {descriptionData?.data?.map(
                  (descriptionItem: any, descriptionIndex: number) => (
                    <TableRow key={descriptionIndex}>
                      <TableCell align="center">
                        {descriptionItem?.questionTitleDescription}
                      </TableCell>
                      <TableCell align="center">
                        {descriptionItem?.answerTitleDescription}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Dialog>
      </Modal>
    </Grid>
  );
}
