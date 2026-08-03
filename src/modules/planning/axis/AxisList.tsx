// import { Box, Button, IconButton, Grid, Skeleton, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Autocomplete } from "@mui/material";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import TavanaDataGrid from "components/dataGrid/TavanaDataGrid";
// import ErrorHandler from "components/errorHandler/ErrorHandler";
// import { useMemo, useState } from "react";
// import { useNavigate } from "react-router";
// import { PAGINATION_DEFAULT_VALUE } from "shared/paginationValue";
// import { PaginationQueryParam } from "types/types";
// import { GridColDef, GridToolbar } from "@mui/x-data-grid";
// import { AddCircle, Architecture, FilterAlt, FilterAltOff, Close } from "@mui/icons-material";
// import TableActions from "components/table/TableActions";
// import AxisCrud from "./AxisCrud";
// import paramsSerializer from "services/paramsSerializer";
// import { DevelopmentProgramSummary } from "types/strategicPlanning";
//
// type Props = {};
//
// export default function AxisList() {
//   const navigate = useNavigate();
//   interface AxisQueryParams {
//     name?: string;
//     developmentPlanId?: string;
//   }
//   const [filters, setFilters] = useState<PaginationQueryParam<AxisQueryParams>>(PAGINATION_DEFAULT_VALUE);
//   const [filtersDialog, setFiltersDialog] = useState<boolean>(false);
//   const [userFilters, setUserFilters] = useState<AxisQueryParams>({ name: '', developmentPlanId: '' });
//   const {
//     data: devPlans,
//   } = useQuery<any, any, DevelopmentProgramSummary[], any>({
//     queryKey: [`v1/developmemtplan/all`],
//     queryFn: Auth?.getRequest_SAHAND,
//     select: (res: any) => res?.data || [],
//     placeholderData: [],
//   });
//   const selectedDevPlan = devPlans?.find((devPlan) => devPlan.id === userFilters.developmentPlanId) || null;
//
//   const {
//     data: documentGridData,
//     status,
//     refetch,
//   } = useQuery<any, any, any, any>({
//     queryKey: [`v1/axis/find${paramsSerializer(filters)}`],
//     queryFn: Auth?.getRequest_SAHAND,
//     select: (res: any) => res?.data?.rows as any,
//     placeholderData: [],
//   });
//
//   const { isLoading, mutate } = useMutation({
//     mutationFn: Auth?.serverCall,
//   });
//   const columns: GridColDef[] = useMemo(
//     () => [
//       { field: "name", headerName: "عنوان محور", flex: 1, display: "flex" },
//       {
//         field: "devName", headerName: "عنوان برنامه", flex: 1, display: "flex",
//         renderCell: ({ row }: { row: any }) => (
//           <Typography variant="caption"  >
//             {row?.developmentProgram?.name}
//           </Typography>
//         ),
//       },
//       {
//         field: "startDate",
//         headerName: "تاریخ شروع هدف",
//         cellClassName: () => "nirooData",
//         flex: 1,
//         renderCell: ({ row }: { row: any }) => (
//           <Box height="100%" pt={1.5} pb={1.5} alignContent="center">
//             <Typography variant="subtitle2"  >
//               {moment(new Date(row?.developmentProgram?.startDate)).format('jYYYY/jMM/jDD')}
//             </Typography>
//           </Box>
//         ),
//       },
//       {
//         field: "endDate",
//         headerName: "تاریخ پایان هدف",
//         flex: 1,
//         renderCell: ({ row }: { row: any }) => (
//           <Box height="100%" pt={1.5} pb={1.5} alignContent="center">
//             <Typography variant="subtitle2"  >
//               {moment(new Date(row?.developmentProgram?.endDate)).format('jYYYY/jMM/jDD')}
//             </Typography>
//           </Box>
//         ),
//       },
//
//       {
//         display: "flex",
//         headerName: "",
//         field: "action",
//         flex: 1,
//         headerAlign: "center",
//         align: "center",
//         renderCell: ({ row }: { row: any }) => {
//           return (
//             <TableActions
//               onEdit={
//                 () => {
//                   setSelectedId(row?.id.toString());
//                   setEditFlag(true);
//                 }
//               }
//             />
//           );
//         },
//       },
//     ],
//
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     []
//   );
//
//   const [editFlag, setEditFlag] = useState(false)
//   const [selectedId, setSelectedId] = useState("new")
//
//   return (
//     <Grid container justifyContent={"center"}>
//       <Grid container item md={12} justifyContent={"space-between"}>
//         <Grid display={"flex"} justifyContent={"flex-start"}>
//           <Architecture fontSize="large" />
//           <Typography variant="h6">محور ها</Typography>
//         </Grid>
//
//         <Grid item md={5} display={"flex"} justifyContent={"flex-end"} gap={2}>
//           <Button
//             color="info"
//             variant="contained"
//             endIcon={(userFilters.developmentPlanId || userFilters.name) ? <FilterAlt /> : <FilterAltOff />}
//             sx={{ minWidth: "100px", mb: 2 }}
//             onClick={() => setFiltersDialog(true)}
//           >
//             فیلترها
//           </Button>
//           <Button variant="contained"
//                   color="success"
//                   endIcon={<AddCircle />}
//                   onClick={() => {
//                     setSelectedId("new");
//                     setEditFlag(true);
//                   }}
//                   sx={{ mb: 2 }}>ایجاد محور جدید</Button>
//           <BackButton onBack={() => navigate("/plan-and-design/planning/management")} />
//         </Grid>
//       </Grid>
//
//
//       {status === "error" ? (
//         <ErrorHandler onRefetch={refetch} />
//       ) : status === "loading" ? (
//         <Skeleton height={300} />
//       ) : status === "success" ? (
//         <TavanaDataGrid
//           getRowHeight={() => "auto"}
//           rows={documentGridData}
//           rowCount={3}
//           columns={columns}
//           slots={{ toolbar: GridToolbar }}
//           slotProps={{
//             toolbar: {
//               csvOptions: { disableToolbarButton: true },
//             },
//           }}
//           setFilters={setFilters}
//           filters={filters}
//           loading={isLoading}
//           disableDensitySelector
//           disableColumnSelector
//           disableRowSelectionOnClick
//         />
//       ) : null}
//       <AxisCrud editFlag={editFlag} setEditFlag={setEditFlag} id={selectedId} refetchGrid={refetch} />
//       <Dialog open={filtersDialog} onClose={() => setFiltersDialog(false)} maxWidth='sm' fullWidth>
//         <DialogTitle sx={{ m: 0, p: 2 }}>
//           فیلترها
//           <IconButton
//             aria-label="close"
//             onClick={() => setFiltersDialog(false)}
//             sx={{
//               position: 'absolute',
//               right: 8,
//               top: 8,
//               color: (theme) => theme.palette.grey[500]
//             }}
//           >
//             <Close />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent dividers>
//           <Grid container spacing={2}>
//             <Grid item xs={12} md={6}>
//               <TextField
//                 fullWidth
//                 label="عنوان"
//                 type="text"
//                 value={userFilters.name}
//                 onChange={(e: any) => {
//                   setUserFilters({
//                     ...userFilters,
//                     name: e.target.value,
//                   });
//                 }}
//               />
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <Autocomplete
//                 options={devPlans as any[]}
//                 value={selectedDevPlan}
//                 renderInput={(params: any) => <TextField {...params} label="ّبرنامه توسعه" />}
//                 getOptionLabel={(option: any) => option.name}
//                 onChange={(event: any, newValue: any) => {
//                   setUserFilters({
//                     ...userFilters,
//                     developmentPlanId: newValue?.id || '',
//                   });
//                 }}
//                 isOptionEqualToValue={(option, value) => {
//                   return `${option?.id}` === `${value.id}`;
//                 }}
//               />
//             </Grid>
//           </Grid>
//         </DialogContent>
//         <DialogActions>
//           <Button
//             color="success"
//             variant="contained"
//             sx={{ minWidth: "100px" }}
//             onClick={() => {
//               setFilters({
//                 ...filters,
//                 name: userFilters.name,
//                 developmentPlanId: userFilters.developmentPlanId,
//               });
//               setFiltersDialog(false);
//             }}
//           >
//             اعمال فیلترها
//           </Button>
//         </DialogActions>
//
//       </Dialog>
//     </Grid>
//   );
// };