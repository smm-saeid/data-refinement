// import { useState } from 'react';
// import {
//   Button,
//   Dialog,
//   Grid,
//   Modal,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TextField,
//   Typography,
//   Box,
// } from "@mui/material";
//
// import { useApiMutation } from '@/hooks/useApi';
//
// interface SkillItem {
//   id: number | string;
//   orgSpecialityName: string;
//   organizationUnitName: string;
//   assignStatus: string;
//   personInfoName?: string;
//   personInfoFamily?: string;
//   personInfoPersonNumber?: string;
//   accepted?: boolean;
// }
//
// interface ExpertiseAssignmentProps {
//   listSkills: SkillItem[];
//   refresh_skill_list: () => void;
// }
//
// const ExpertiseAssignment = ({ listSkills, refresh_skill_list }: ExpertiseAssignmentProps) => {
//   const [openInspectorModal, setOpenInspectorModal] = useState(false);
//   const [openRejectModal, setOpenRejectModal] = useState(false);
//   const [selectedInspector, setSelectedInspector] = useState<SkillItem | null>(null);
//   const [rejectDescription, setRejectDescription] = useState('');
//
//   // API Mutation for updating inspector status
//   const { mutate: updateInspectorStatus, isPending: isUpdating } = useApiMutation({
//     url: 'person-speciality',
//
//   });
//
//   const handleOpenInspectorModal = (inspector: SkillItem) => {
//     setSelectedInspector(inspector);
//     setOpenInspectorModal(true);
//   };
//
//   const handleCloseInspectorModal = () => {
//     setOpenInspectorModal(false);
//     setSelectedInspector(null);
//   };
//
//   const handleOpenRejectModal = (inspector: SkillItem) => {
//     setSelectedInspector(inspector);
//     setOpenRejectModal(true);
//   };
//
//   const handleCloseRejectModal = () => {
//     setOpenRejectModal(false);
//     setSelectedInspector(null);
//     setRejectDescription('');
//   };
//
//   const getStatusText = (status: string) => {
//     const statusMap: { [key: string]: string } = {
//       'pending': 'در انتظار تایید معاونت',
//       'assigned': 'تخصیص یافته',
//       'rejected': 'رد شده',
//       'accepted': 'تایید شده'
//     };
//     return statusMap[status] || status;
//   };
//
//   const updateStatus = (assignStatus: string, inspectorData: SkillItem) => {
//     updateInspectorStatus(
//       {
//         data: {
//           ...inspectorData,
//           assignStatus: assignStatus
//         },
//       },
//       {
//         onSuccess: () => {
//           refresh_skill_list();
//         },
//       }
//     );
//   };
//
//   const rejectInspector = () => {
//     if (!selectedInspector) return;
//
//     updateInspectorStatus(
//       {
//         data: {
//           ...selectedInspector,
//           assignStatus: "rejected",
//           requestDescription: rejectDescription
//         },
//       },
//       {
//         onSuccess: () => {
//           handleCloseRejectModal();
//           refresh_skill_list();
//         },
//       }
//     );
//   };
//
//   if (!listSkills || listSkills.length === 0) {
//     return null;
//   }
//
//   return (
//     <Box sx={{ width: '100%' }}>
//       {/* Skills Table */}
//       <TableContainer component={Paper}>
//         <Table sx={{ minWidth: 650 }}>
//           <TableHead sx={{ bgcolor: 'primary.light' }}>
//             <TableRow>
//               <TableCell>نام تخصص</TableCell>
//               <TableCell>یگان</TableCell>
//               <TableCell>نام بازرس</TableCell>
//               <TableCell align="center">عملیات</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {listSkills.map((skill, index) => (
//               <TableRow key={skill.id || index}>
//                 <TableCell>
//                   <Typography variant="body2">
//                     {skill.orgSpecialityName || '---'}
//                   </Typography>
//                 </TableCell>
//                 <TableCell>
//                   <Typography variant="body2">
//                     {skill.organizationUnitName || '---'}
//                   </Typography>
//                 </TableCell>
//                 <TableCell>
//                   {skill.assignStatus === 'assigned' ? (
//                     <Button
//                       variant="text"
//                       onClick={() => handleOpenInspectorModal(skill)}
//                       sx={{ textTransform: 'none' }}
//                     >
//                       <Typography variant="body2">
//                         {`${skill.personInfoName || ''} ${skill.personInfoFamily || ''} ${skill.personInfoPersonNumber ? `(${skill.personInfoPersonNumber})` : ''}`}
//                       </Typography>
//                     </Button>
//                   ) : (
//                     <Typography variant="body2" color="text.secondary">
//                       {getStatusText(skill.assignStatus)}
//                     </Typography>
//                   )}
//                 </TableCell>
//                 <TableCell align="center">
//                   {skill.assignStatus === 'assigned' ? (
//                     <Grid container spacing={1} justifyContent="center">
//                       <Grid>
//                         <Button
//                           variant="contained"
//                           color="error"
//                           size="small"
//                           onClick={() => handleOpenRejectModal(skill)}
//                           disabled={isUpdating}
//                         >
//                           عدم تایید
//                         </Button>
//                       </Grid>
//                       <Grid>
//                         <Button
//                           variant="contained"
//                           color="success"
//                           size="small"
//                           onClick={() => updateStatus('accepted', skill)}
//                           disabled={isUpdating}
//                         >
//                           تایید بازرس
//                         </Button>
//                       </Grid>
//                     </Grid>
//                   ) : skill.accepted ? (
//                     <Typography variant="body2" color="success.main">
//                       تایید شده
//                     </Typography>
//                   ) : null}
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//
//       {/* Inspector Details Modal */}
//       <Modal open={openInspectorModal} onClose={handleCloseInspectorModal}>
//         <Dialog maxWidth="md" open={openInspectorModal} onClose={handleCloseInspectorModal}>
//           <Box p={3}>
//             <Typography variant="h6" gutterBottom>
//               اطلاعات بازرس
//             </Typography>
//             <Paper sx={{ p: 2, mt: 2 }}>
//               <Grid container spacing={2}>
//                 <Grid size={{xs:12 ,md:6 ,lg:4}} >
//                   <TextField
//                     label="نام و نام خانوادگی"
//                     value={`${selectedInspector?.personInfoName || ''} ${selectedInspector?.personInfoFamily || ''}`}
//                     fullWidth
//                     size="small"
//                     InputProps={{ readOnly: true }}
//                   />
//                 </Grid>
//                 <Grid size={{xs:12 ,md:6 ,lg:4}} >
//                   <TextField
//                     label="شماره پرسنلی"
//                     value={selectedInspector?.personInfoPersonNumber || '---'}
//                     fullWidth
//                     size="small"
//                     InputProps={{ readOnly: true }}
//                   />
//                 </Grid>
//                 <Grid size={{xs:12 ,md:6 ,lg:4}} >
//                   <TextField
//                     label="شماره تماس"
//                     value="81955107"
//                     fullWidth
//                     size="small"
//                     InputProps={{ readOnly: true }}
//                   />
//                 </Grid>
//                 <Grid size={{xs:12 ,md:6 ,lg:4}} >
//                   <TextField
//                     label="شغل سازمانی"
//                     value="مدیر بانک اطلاعاتی"
//                     fullWidth
//                     size="small"
//                     InputProps={{ readOnly: true }}
//                   />
//                 </Grid>
//                 <Grid size={{xs:12 ,md:6 ,lg:4}} >
//                   <TextField
//                     label="سطح دسترسی"
//                     value="سری"
//                     fullWidth
//                     size="small"
//                     InputProps={{ readOnly: true }}
//                   />
//                 </Grid>
//                 <Grid size={{xs:12 ,md:6 ,lg:4}} >
//                   <TextField
//                     label="مدرک تحصیلی"
//                     value="کارشناسی ارشد"
//                     fullWidth
//                     size="small"
//                     InputProps={{ readOnly: true }}
//                   />
//                 </Grid>
//                 <Grid size={{xs:12 ,md:6 ,lg:4}} >
//                   <TextField
//                     label="دوره طی شده نظامی"
//                     value="دوره عالی رسته ای"
//                     fullWidth
//                     size="small"
//                     InputProps={{ readOnly: true }}
//                   />
//                 </Grid>
//                 <Grid size={{xs:12 ,md:6 ,lg:4}} >
//                   <TextField
//                     label="وضعیت پزشکی"
//                     value="طبقه سوم سلامتی"
//                     fullWidth
//                     size="small"
//                     InputProps={{ readOnly: true }}
//                   />
//                 </Grid>
//                 <Grid size={{xs:12 ,md:6 ,lg:4}} >
//                   <TextField
//                     label="نمره ارزشیابی"
//                     value="94"
//                     fullWidth
//                     size="small"
//                     InputProps={{ readOnly: true }}
//                   />
//                 </Grid>
//               </Grid>
//             </Paper>
//             <Box display="flex" justifyContent="flex-end" mt={2}>
//               <Button variant="contained" onClick={handleCloseInspectorModal}>
//                 بستن
//               </Button>
//             </Box>
//           </Box>
//         </Dialog>
//       </Modal>
//
//       {/* Reject Inspector Modal */}
//       <Modal open={openRejectModal} onClose={handleCloseRejectModal}>
//         <Dialog maxWidth="md" open={openRejectModal} onClose={handleCloseRejectModal}>
//           <Box p={3}>
//             <Typography variant="h6" gutterBottom>
//               علت عدم تایید بازرس
//             </Typography>
//             <Typography variant="body2" color="text.secondary" gutterBottom>
//               علت عدم تایید بازرس را در کادر زیر بیان کنید و با ارسال آن معاونت مورد نظر را در جریان قرار دهید.
//             </Typography>
//
//             <TextField
//               label="توضیحات"
//               value={rejectDescription}
//               onChange={(e) => setRejectDescription(e.target.value)}
//               fullWidth
//               multiline
//               rows={4}
//               sx={{ mt: 2 }}
//             />
//
//             <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
//               <Button
//                 variant="outlined"
//                 color="error"
//                 onClick={handleCloseRejectModal}
//                 disabled={isUpdating}
//               >
//                 بازگشت
//               </Button>
//               <Button
//                 variant="contained"
//                 color="success"
//                 onClick={rejectInspector}
//                 disabled={isUpdating || !rejectDescription.trim()}
//               >
//                 {isUpdating ? 'در حال ارسال...' : 'ارسال'}
//               </Button>
//             </Box>
//           </Box>
//         </Dialog>
//       </Modal>
//     </Box>
//   );
// };
//
// export default ExpertiseAssignment;
import { useMemo, useState } from "react";
import {
  Button,
  Dialog,
  Grid,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { useApiMutation } from '@/hooks/useApi';
// import { useSnackbar } from '@/hooks/useSnackbar';

interface SkillItem {
  id: number | string;
  orgSpecialityName: string;
  organizationUnitName: string;
  assignStatus: string;
  personInfoName?: string;
  personInfoFamily?: string;
  personInfoPersonNumber?: string;
  accepted?: boolean;
  requestDescription?: string;
}

interface ExpertiseAssignmentProps {
  listSkills: SkillItem[];
  refresh_skill_list: () => void;
}

const ExpertiseAssignment = ({ listSkills, refresh_skill_list }: ExpertiseAssignmentProps) => {
  const [openInspectorModal, setOpenInspectorModal] = useState(false);
  const [openRejectModal, setOpenRejectModal] = useState(false);
  const [selectedInspector, setSelectedInspector] = useState<SkillItem | null>(null);
  const [rejectDescription, setRejectDescription] = useState('');

  // const snackbar = useSnackbar();

  // API Mutation for updating inspector status
  const { mutate: updateInspectorStatus, isPending: isUpdating } = useApiMutation({
    url: 'person-speciality',

  });

  // Memoized status texts
  const statusTexts = useMemo(() => ({
    "pending": 'در انتظار تایید معاونت',
    "assigned": 'تخصیص یافته',
    "rejected": "رد شده",
    "accepted": "تایید شده"
  }), []);

  // Memoized function to get status text
  const getStatusText = useMemo(() => (status: string) => {
    return statusTexts[status as keyof typeof statusTexts] || status;
  }, [statusTexts]);

  // Memoized inspector data for modal
  const inspectorDetails = useMemo(() => [
    { label: "نام و نام خانوادگی", value: "" },
    { label: "شماره پرسنلی", value: "1234567" },
    { label: "شماره تماس", value: "81955107" },
    { label: "شغل سازمانی", value: "مدیر بانک اطلاعاتی" },
    { label: "سطح دسترسی", value: "سری" },
    { label: "مدرک تحصیلی", value: "کارشناسی ارشد" },
    { label: "دوره طی شده نظامی", value: "دوره عالی رسته ای" },
    { label: "وضعیت پزشکی", value: "طبقه سوم سلامتی" },
    { label: "نمره ارزشیابی", value: "94" },
  ], []);

  const handleOpenInspectorModal = (inspector: SkillItem) => {
    setSelectedInspector(inspector);
    setOpenInspectorModal(true);
  };

  const handleCloseInspectorModal = () => {
    setOpenInspectorModal(false);
    setSelectedInspector(null);
  };

  const handleOpenRejectModal = (inspector: SkillItem) => {
    setSelectedInspector(inspector);
    setOpenRejectModal(true);
  };

  const handleCloseRejectModal = () => {
    setOpenRejectModal(false);
    setSelectedInspector(null);
    setRejectDescription('');
  };

  const updateStatus = (assignStatus: string, inspectorData: SkillItem) => {
    updateInspectorStatus(
      {
        data: {
          ...inspectorData,
          assignStatus: assignStatus
        },
      },
      {
        onSuccess: () => {
          // snackbar('وضعیت تغییر یافت', 'success');
          refresh_skill_list();
        },
        onError: () => {
          // snackbar('خطا در تغییر وضعیت', 'error');
        },
      }
    );
  };

  const rejectInspector = () => {
    if (!selectedInspector) return;

    updateInspectorStatus(
      {
        data: {
          ...selectedInspector,
          assignStatus: "rejected",
          requestDescription: rejectDescription
        },
      },
      {
        onSuccess: () => {
          // snackbar('بازرس با موفقیت رد شد', 'success');
          handleCloseRejectModal();
          refresh_skill_list();
        },
        onError: () => {
          // snackbar('خطا در رد بازرس', 'error');
        },
      }
    );
  };

  // Memoized table rows
  const tableRows = useMemo(() =>
      listSkills.map((skill_data, index) => (
        <TableRow key={skill_data.id || index}>
          <TableCell>
            <Typography variant="body2">
              {skill_data.orgSpecialityName}
            </Typography>
          </TableCell>
          <TableCell>
            <Typography variant="body2">
              {skill_data.organizationUnitName}
            </Typography>
          </TableCell>
          <TableCell>
            {skill_data.assignStatus === 'assigned' ? (
              <Typography variant="body2">
                <Button
                  onClick={() => handleOpenInspectorModal(skill_data)}
                  sx={{ textTransform: 'none' }}
                >
                  {`${skill_data.personInfoName || ''} ${skill_data.personInfoFamily || ''} ${skill_data.personInfoPersonNumber ? `(${skill_data.personInfoPersonNumber})` : ''}`}
                </Button>
              </Typography>
            ) : (
              <Typography variant="body2">
                {getStatusText(skill_data.assignStatus)}
              </Typography>
            )}
          </TableCell>
          <TableCell>
            {skill_data.assignStatus === 'assigned' ? (
              <Grid container spacing={2} justifyContent="center" alignItems="center">
                <Grid>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleOpenRejectModal(skill_data)}
                    disabled={isUpdating}
                  >
                    <Typography variant="body2">
                      عدم تایید
                    </Typography>
                  </Button>
                </Grid>
                <Grid >
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => updateStatus('accepted', skill_data)}
                    disabled={isUpdating}
                  >
                    <Typography variant="body2">
                      تایید بازرس
                    </Typography>
                  </Button>
                </Grid>
              </Grid>
            ) : skill_data.accepted ? (
              <Typography variant="body2" color="success.main">
                تایید شده
              </Typography>
            ) : null}
          </TableCell>
        </TableRow>
      )),
    [listSkills, isUpdating, getStatusText]);

  if (!listSkills || listSkills.length === 0) {
    return null;
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Skills Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: 'primary.light' }}>
            <TableRow>
              <TableCell>نام تخصص</TableCell>
              <TableCell>یگان</TableCell>
              <TableCell>نام بازرس</TableCell>
              <TableCell align="center">عملیات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableRows}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Inspector Details Modal */}
      <Modal open={openInspectorModal} onClose={handleCloseInspectorModal}>
        <Dialog maxWidth="md" open={openInspectorModal} onClose={handleCloseInspectorModal}>
          <Box p={3}>
            <Typography variant="h6" gutterBottom>
              اطلاعات بازرس
            </Typography>
            <Paper sx={{ p: 2, mt: 2 }}>
              <Grid container spacing={2}>
                {inspectorDetails.map((detail, index) => (
                  <Grid size={{xs:12 ,md:6 ,lg:4}} key={index}>

                    <TextField
                      label={detail.label}
                      value={detail.value}
                      fullWidth
                      size="small"
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Paper>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button variant="contained" onClick={handleCloseInspectorModal}>
                بستن
              </Button>
            </Box>
          </Box>
        </Dialog>
      </Modal>

      {/* Reject Inspector Modal */}
      <Modal open={openRejectModal} onClose={handleCloseRejectModal}>
        <Dialog maxWidth="md" open={openRejectModal} onClose={handleCloseRejectModal}>
          <Box p={3}>
            <Typography variant="h6" gutterBottom>
              علت عدم تایید بازرس
            </Typography>
            <Typography variant="body2" gutterBottom>
              علت عدم تایید بازرس را در کادر زیر بیان کنید و با ارسال آن معاونت مورد نظر را در جریان قرار دهید.
            </Typography>

            <TextField
              value={rejectDescription}
              onChange={(e) => setRejectDescription(e.target.value)}
              fullWidth
              multiline
              rows={4}
              sx={{ mt: 2 }}
              placeholder="علت عدم تایید را وارد کنید..."
            />

            <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
              <Button
                variant="outlined"
                color="error"
                onClick={handleCloseRejectModal}
                disabled={isUpdating}
              >
                بازگشت
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={rejectInspector}
                disabled={isUpdating || !rejectDescription.trim()}
              >
                {isUpdating ? 'در حال ارسال...' : 'ارسال'}
              </Button>
            </Box>
          </Box>
        </Dialog>
      </Modal>
    </Box>
  );
};

export default ExpertiseAssignment;