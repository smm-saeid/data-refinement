import { Book, ListAlt } from "@mui/icons-material";
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
  Button,
  Dialog,
  DialogTitle,
  List,
  Modal,
  CircularProgress,
  Tab,
  Tabs,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import BackButton from "components/buttons/BackButton";
import RenderFormInput from "components/render/formInputs/RenderFormInput";
import { useAuth } from "hooks/useAuth";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import paramsSerializer from "services/paramsSerializer";
import { PAGINATION_DEFAULT_VALUE } from "shared/paginationValue";
import { IUser } from "types/user";
import PublicPlace from "./independentReports/PublicPlace";
import Homes from "./independentReports/Homes";
import Crime from "./independentReports/Crime";
import Violation from "./independentReports/Violation";

type Props = {};

const IndependentReports = (props: Props) => {
  const Auth = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const [filters, setFilters] = useState(PAGINATION_DEFAULT_VALUE);
  const [myData, setMyData] = useState([] as any[]);
  const [reportId, setReportId] = useState(null);
  const [selectedReportItem, setselectedReportItem] = useState({} as any);
  const [selectedReportType, setselectedReportType] = useState(0);
  const reportType=["خانه های سازمانی","مهمانسراها و...","جرایم","تخلفات"]

  const {
    data: titleData,
    status: titleStatus,
    refetch: titleRefetch,
  } = useQuery<any, any, any, any>({
    // queryKey: [`independent-reports-review-description/find-by-parameter?independentReportsReviewTitleId=${reportId}&inspectionId=${id}`],
    queryKey: [`independent-reports-review-title/find-by-parameter?independentReportsReviewGroupId=${reportId}`],
    queryFn: Auth?.getRequest_YASER,
    // select: (res: any) => res.data?.inspectionType?.find((item:any)=>item?.key==="KHOD_ARZYABI") as any,
    select: (res: any) => res.data as any,
    enabled: !!reportId,
  });
  const {
    data: reportData,
    status: reportStatus,
    refetch: reportRefetch,
    isLoading,
  } = useQuery<any, any, any, any>({
    // queryKey: [`independent-reports-review-description/find-by-parameter?independentReportsReviewTitleId=${reportId}&inspectionId=${id}`],
    queryKey: [
      `independent-reports-review-description/find-by-parameter?independentReportsReviewTitleId=${titleData?.id}&inspectionId=3b955e90-61cf-4e59-bf46-dfddd1584164`,
    ],
    queryFn: Auth?.getRequest_YASER,
    // select: (res: any) => res.data?.inspectionType?.find((item:any)=>item?.key==="KHOD_ARZYABI") as any,
    select: (res: any) => res.data as any,
    enabled: !!titleData,
  });

  // useEffect(() => {
  //   if(!!data)
  //   setMyData(data)
  // }, [data])

  // const tableItems = useMemo(
  //   () => [
  //     {
  //       name: "amiri_available",
  //       inputType: "text",
  //       label: "موجود",
  //       size: { md: 12 },
  //       elementProps: {
  //         // multiline: true,
  //         // rows: 3,
  //         value: myData?.find((item) => item?.organizationHomeType === "amiri")?.available ?? "",
  //         onChange: (e: any) => {
  //           setMyData((previousState: any) => {
  //             const index = myData?.findIndex((item) => item?.organizationHomeType === "amiri");
  //             // if(index!==-1)
  //             // {
  //             const updated = [...previousState];
  //             updated[index] = {
  //               ...updated[index],
  //               available: e.target.value,
  //             };
  //             return updated;
  //             // }else([...previousState,])
  //           });
  //         },
  //       },
  //     },
  //     {
  //       name: "amiri_occupation",
  //       inputType: "text",
  //       label: "اشغال شده",
  //       size: { md: 12 },
  //       elementProps: {
  //         // multiline: true,
  //         // rows: 3,
  //         value: myData?.find((item) => item?.organizationHomeType === "amiri")?.occupation ?? "",
  //         onChange: (e: any) => {
  //           setMyData((previousState: any) => {
  //             const index = myData?.findIndex((item) => item?.organizationHomeType === "amiri");
  //             // if(index!==-1)
  //             // {
  //             const updated = [...previousState];
  //             updated[index] = {
  //               ...updated[index],
  //               occupation: e.target.value,
  //             };
  //             return updated;
  //             // }else([...previousState,])
  //           });
  //         },
  //       },
  //     },
  //     {
  //       name: "21",
  //       inputType: "text",
  //       label: "موجود",
  //       size: { md: 12 },
  //       elementProps: {
  //         // multiline: true,
  //         // rows: 3,
  //         value: myData?.find((item) => item?.organizationHomeType === "afsar_arshadi")?.available ?? "",
  //         onChange: (e: any) => {
  //           setMyData((previousState: any) => {
  //             const index = myData?.findIndex((item) => item?.organizationHomeType === "afsar_arshadi");
  //             const updated = [...previousState];
  //             updated[index] = {
  //               ...updated[index],
  //               available: e.target.value,
  //             };
  //             return updated;
  //           });
  //         },
  //       },
  //     },
  //     {
  //       name: "22",
  //       inputType: "text",
  //       label: "اشغال شده",
  //       size: { md: 12 },
  //       elementProps: {
  //         // multiline: true,
  //         // rows: 3,
  //         value: myData?.find((item) => item?.organizationHomeType === "afsar_arshadi")?.occupation ?? "",
  //         onChange: (e: any) => {
  //           setMyData((previousState: any) => {
  //             const index = myData?.findIndex((item) => item?.organizationHomeType === "afsar_arshadi");
  //             const updated = [...previousState];
  //             updated[index] = {
  //               ...updated[index],
  //               occupation: e.target.value,
  //             };
  //             return updated;
  //           });
  //         },
  //       },
  //     },
  //     {
  //       name: "31",
  //       inputType: "text",
  //       label: "موجود",
  //       size: { md: 12 },
  //       elementProps: {
  //         // multiline: true,
  //         // rows: 3,
  //         value: myData?.find((item) => item?.organizationHomeType === "afsar_joz")?.available ?? "",
  //         onChange: (e: any) => {
  //           setMyData((previousState: any) => {
  //             const index = myData?.findIndex((item) => item?.organizationHomeType === "afsar_joz");
  //             const updated = [...previousState];
  //             updated[index] = {
  //               ...updated[index],
  //               available: e.target.value,
  //             };
  //             return updated;
  //           });
  //         },
  //       },
  //     },
  //     {
  //       name: "32",
  //       inputType: "text",
  //       label: "اشغال شده",
  //       size: { md: 12 },
  //       elementProps: {
  //         // multiline: true,
  //         // rows: 3,
  //         value: myData?.find((item) => item?.organizationHomeType === "afsar_joz")?.occupation ?? "",
  //         onChange: (e: any) => {
  //           setMyData((previousState: any) => {
  //             const index = myData?.findIndex((item) => item?.organizationHomeType === "afsar_joz");
  //             const updated = [...previousState];
  //             updated[index] = {
  //               ...updated[index],
  //               occupation: e.target.value,
  //             };
  //             return updated;
  //           });
  //         },
  //       },
  //     },
  //     {
  //       name: "41",
  //       inputType: "text",
  //       label: "موجود",
  //       size: { md: 12 },
  //       elementProps: {
  //         // multiline: true,
  //         // rows: 3,
  //         value: myData?.find((item) => item?.organizationHomeType === "karmandi")?.available ?? "",
  //         onChange: (e: any) => {
  //           setMyData((previousState: any) => {
  //             const index = myData?.findIndex((item) => item?.organizationHomeType === "karmandi");
  //             const updated = [...previousState];
  //             updated[index] = {
  //               ...updated[index],
  //               occupation: e.target.value,
  //             };
  //             return updated;
  //           });
  //         },
  //       },
  //     },
  //     {
  //       name: "42",
  //       inputType: "text",
  //       label: "اشغال شده",
  //       size: { md: 12 },
  //       elementProps: {
  //         // multiline: true,
  //         // rows: 3,
  //         value: myData?.find((item) => item?.organizationHomeType === "karmandi")?.occupation ?? "",
  //         onChange: (e: any) => {
  //           setMyData((previousState: any) => {
  //             const index = myData?.findIndex((item) => item?.organizationHomeType === "karmandi");
  //             const updated = [...previousState];
  //             updated[index] = {
  //               ...updated[index],
  //               occupation: e.target.value,
  //             };
  //             return updated;
  //           });
  //         },
  //       },
  //     },
  //     {
  //       name: "51",
  //       inputType: "text",
  //       label: "موجود",
  //       size: { md: 12 },
  //       elementProps: {
  //         // multiline: true,
  //         // rows: 3,
  //         value: myData?.find((item) => item?.organizationHomeType === "darajedari")?.available ?? "",
  //         onChange: (e: any) => {
  //           setMyData((previousState: any) => {
  //             const index = myData?.findIndex((item) => item?.organizationHomeType === "darajedari");
  //             const updated = [...previousState];
  //             updated[index] = {
  //               ...updated[index],
  //               occupation: e.target.value,
  //             };
  //             return updated;
  //           });
  //         },
  //       },
  //     },
  //     {
  //       name: "52",
  //       inputType: "text",
  //       label: "اشغال شده",
  //       size: { md: 12 },
  //       elementProps: {
  //         // multiline: true,
  //         // rows: 3,
  //         value: myData?.find((item) => item?.organizationHomeType === "darajedari")?.occupation ?? "",
  //         onChange: (e: any) => {
  //           setMyData((previousState: any) => {
  //             const index = myData?.findIndex((item) => item?.organizationHomeType === "darajedari");
  //             const updated = [...previousState];
  //             updated[index] = {
  //               ...updated[index],
  //               occupation: e.target.value,
  //             };
  //             return updated;
  //           });
  //         },
  //       },
  //     },
  //   ],
  //   [myData,data]
  // );
  return (
    <Grid container justifyContent={"center"}>
      <Grid item container md={11} m={2} display={"flex"} justifyContent={"space-between"}>
        <Box display="flex" mb={1}>
          <Book />
          <Typography variant="h6" component={"h3"}>
            گزارشات مستقل
          </Typography>
        </Box>
        <Box display="flex">
          <Tabs value={selectedReportType} onChange={(e: React.SyntheticEvent, value: number)=>setselectedReportType(value)}>
            {reportType.map((item, index) => (
              <Tab key={index} value={index} label={item} />
            ))}
          </Tabs>
          {/* <Button variant="contained" endIcon={<Book  color="info"/>} sx={{ minWidth: "150px", mb: 2 }} onClick={() => navigate("/inspection/planning/AJA-planning")}></Button> */}
          {/* <BackButton onBack={() => navigate("/inspection/planning/AJA-planning")} /> */}
        </Box>
      </Grid>
      {
        selectedReportType===0?<Homes editable={false}/>
        :selectedReportType===1?<PublicPlace editable={false}/> 
        :selectedReportType===2?<Crime editable={false}/> 
        :<Violation editable={false}/>
      }
      
      <Modal
        open={!!reportId}
        onClose={() => {
          setReportId(null);
        }}
        sx={{ justifyContent: "center", display: "flex", alignItems: "center" }}
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
          <DialogTitle display={"flex"}>
            <ListAlt fontSize="large" />
            {selectedReportItem?.title}
          </DialogTitle>
          {isLoading ? (
            <Paper sx={{ display: "flex", justifyContent: "center", height: "15vh", alignItems: "center" }}>
              <CircularProgress />
            </Paper>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ bgcolor: "lightsalmon" }}>
                  <TableRow>
                    <TableCell align="center">{titleData?.questionTitle}</TableCell>
                    <TableCell align="center">{titleData?.answerTitle}</TableCell>
                    {/* <TableCell align="center">نام خانوادگی</TableCell>
                        <TableCell align="center">جایگاه</TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportData?.map((descriptionItem: any, descriptionIndex: number) => (
                    <TableRow key={descriptionIndex}>
                      <TableCell align="center">{descriptionItem?.questionTitleDescription}</TableCell>
                      <TableCell align="center">{descriptionItem?.answerTitleDescription}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Dialog>
      </Modal>
    </Grid>
  );
};

export default IndependentReports;
