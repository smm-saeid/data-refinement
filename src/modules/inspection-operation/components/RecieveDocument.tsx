import { Book, Check, Delete, ListAlt } from "@mui/icons-material";
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
  TextField,
  Autocomplete,
  Fab,
  Tooltip,
  Tab,
  Tabs,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import BackButton from "components/buttons/BackButton";
import RenderFormInput from "components/render/formInputs/RenderFormInput";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import paramsSerializer from "services/paramsSerializer";
import { PAGINATION_DEFAULT_VALUE } from "shared/paginationValue";
import { IUser } from "types/user";

type Props = {};

const RecieveDocument = (props: Props) => {
  const Auth = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const snackbar = useSnackbar();
  const { isLoading, mutate } = useMutation({
    mutationFn: Auth?.serverCall_YASER,
  });
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const [autoCompleteValue, setAutoCompleteValue] = useState<any>(undefined);
  const [filters, setFilters] = useState(PAGINATION_DEFAULT_VALUE);
  const [myData, setMyData] = useState([] as any[]);
  const [reportId, setReportId] = useState(null);
  const [selectedReportType, setselectedReportType] = useState(0);
  const reportType = ["آجا", "یگان"];
  const [selectedReportItem, setselectedReportItem] = useState({} as any);
  const { data, status, refetch } = useQuery<any, any, any, any>({
    // queryKey: [`independent-reports-review-group${paramsSerializer(filters)}`],
    queryKey: [
      `review-document-receipt/find-by-parameter?inspectionId=${id}&organizationUnitId=f07deb56-de03-4271-adc4-76e143abdd15`,
    ],
    queryFn: Auth?.getRequest_YASER,
    // select: (res: any) => res.data?.inspectionType?.find((item:any)=>item?.key==="KHOD_ARZYABI") as any,
    select: (res: any) => res.data as any,
    // enabled: !!selectedYear && selectedYear !== "new",
  });
  const {
    data: questionList,
    status: questionList_status,
    refetch: questionList_refetch,
  } = useQuery<any, any, any, any>({
    // queryKey: [`independent-reports-review-group${paramsSerializer(filters)}`],
    // queryKey: [`review-document-receipt/find-by-parameter?inspectionId=73dfb77c-833f-44bf-aa62-4ddde034994c&organizationUnitId=f07deb56-de03-4271-adc4-76e143abdd15`],
    queryKey: [`/review-document-receipt-type`],
    queryFn: Auth?.getRequest_YASER,
    // select: (res: any) => res.data?.inspectionType?.find((item:any)=>item?.key==="KHOD_ARZYABI") as any,
    select: (res: any) => res.data as any,
    enabled: !!data&&data.length===0
  });

  const [basicObjectHome, setbasicObjectHome] = useState({
    // inspectionId: "73dfb77c-833f-44bf-aa62-4ddde034994c",
    // organizationUnitId: "f07deb56-de03-4271-adc4-76e143abdd15",
    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    inspectionId: id??"3fa85f64-5717-4562-b3fc-2c963f66afa6",
    organizationUnitId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    organizationUnitName: "string",
    violationAndCrimeTypeId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    violationAndCrimeTypeName: "string",
    type: "string",
    staff: 0,
    duty: 0,
  });

  useEffect(() => {
    if (!!data&&data?.length!==0) setMyData(data);
    else if (!!questionList) setMyData(questionList);
  }, [data,questionList]);
  useEffect(() => {
    console.log("myData=>>>", myData);
  }, [myData]);

  function handleChange(indx: number, title: string, value: any) {
    setMyData((prev) => {
      const newData = [...myData];
      newData[indx][title] = value;
      return newData;
    });
  }
  function handleAddRow(newvalue: any) {
    if (!myData?.some((item) => item?.violationAndCrimeTypeId === newvalue?.id))
      setMyData((prev) => {
        const newData = [
          ...myData,
          {
            inspectionId: myData[0]["inspectionId"],
            organizationUnitId: myData[0]["organizationUnitId"],
            organizationUnitName: myData[0]["organizationUnitName"],
            violationAndCrimeTypeId: newvalue?.id,
            violationAndCrimeTypeName: newvalue?.name ?? "",
            type: "jorm",
            duty: 0,
            staff: 0,
          },
        ];
        return newData;
      });
    else snackbar("این تخلف موجود میباشد", "error");
  }

  const submitHandler = () => {
    mutate(
      {
        entity: `review-document-receipt/save-all`,
        method: "post",
        // data: [...myData]
        data: myData.map((dataItem, dataIndex) => ({
          // ...dataItem,
          id:dataItem?.id,
          selfGrade: dataItem?.selfGrade ?? 0,
          selfConsideration: dataItem?.selfConsideration ?? "",
          ajaGrade: dataItem?.ajaGrade ?? 0,
          ajaConsideration: dataItem?.ajaConsideration ?? "",
          inspectionId: id,
          organizationUnitId: data[0]?.organizationUnitId??"f07deb56-de03-4271-adc4-76e143abdd15",
          reviewDocumentReceiptTypeId: dataItem?.reviewDocumentReceiptTypeId??dataItem?.id,
          // reviewDocumentReceiptTypeDescription: dataItem?.description,
          // reviewDocumentReceiptTypeValue: dataItem?.value,
        })),
      } as any,
      {
        onSuccess: (res: any) => {
          snackbar("عملیات با موفقیت انجام شد", "success");
        },
        onError: () => {
          snackbar("خطا در انجام عملیات", "error");
        },
      }
    );
  };
  return (
    <Grid container item md={11}>
      <Grid item container md={12} m={2} display={"flex"} justifyContent={"space-between"}>
        <Box display="flex">
          {/* <Book /> */}
          <Typography variant="h6" component={"h3"} ml={2}>
            بازبینه تحویلگیری مدارک و صورتجلسه یگان
          </Typography>
        </Box>
        <Box display="flex">
          <Tabs
            value={selectedReportType}
            onChange={(e: React.SyntheticEvent, value: number) => setselectedReportType(value)}
          >
            {reportType.map((item, index) => (
              <Tab key={index} value={index} label={item} />
            ))}
          </Tabs>
          <Button variant="contained" endIcon={<Check />} sx={{ minWidth: "150px", mb: 2 }} onClick={submitHandler}>
            ثبت تغیرات
          </Button>
          {/* <BackButton onBack={() => navigate("/inspection/planning/AJA-planning")} /> */}
        </Box>
      </Grid>
      {
        !!data&&data?.length!==0?(
          <Grid item container md={12} m={2} display={"flex"} justifyContent={"space-between"}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ bgcolor: "lightsalmon", borderColor: "black" }}>
              <TableRow>
                <TableCell align="center" sx={{ border: "solid 1px black" }}>
                  ردیف
                </TableCell>
                <TableCell align="center" sx={{ textAlign: "start", border: "solid 1px black", width: "50%" }}>
                  شرح
                </TableCell>
                <TableCell align="center" sx={{ textAlign: "start", border: "solid 1px black", width: "10%" }}>
                  ارزش
                </TableCell>
                <TableCell align="center" sx={{ textAlign: "start", border: "solid 1px black", width: "10%" }}>
                  نمره های دریافتی
                </TableCell>
                <TableCell align="center" sx={{ textAlign: "start", border: "solid 1px black" }}>
                  ملاحظات
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* {data?.rows?.map((reportItem: any, reportIndex: number) => ( */}
              {myData?.map((item: any, index: number) => (
                <TableRow key={index}>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell>{item?.reviewDocumentReceiptTypeDescription}</TableCell>
                  <TableCell>{item?.reviewDocumentReceiptTypeValue}</TableCell>
                  <TableCell>
                    <TextField
                      value={(selectedReportType === 0 ? item?.ajaGrade : item?.selfGrade) ?? 0}
                      onChange={(e: any) => {
                        if (!isNaN(e.target.value))
                          handleChange(index, selectedReportType === 0 ? "ajaGrade" : "selfGrade", e.target.value);
                      }}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={selectedReportType === 0 ? item?.ajaConsideration : item?.selConsideration}
                      onChange={(e) => {
                        handleChange(
                          index,
                          selectedReportType === 0 ? "ajaConsideration" : "selfConsideration",
                          e.target.value
                        );
                      }}
                      fullWidth
                    />
                  </TableCell>
                </TableRow>
              ))}
              {/* ))} */}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
        ):(
          <Grid item container md={12} m={2} display={"flex"} justifyContent={"space-between"}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ bgcolor: "lightsalmon", borderColor: "black" }}>
              <TableRow>
                <TableCell align="center" sx={{ border: "solid 1px black" }}>
                  ردیف
                </TableCell>
                <TableCell align="center" sx={{ textAlign: "start", border: "solid 1px black", width: "50%" }}>
                  شرح
                </TableCell>
                <TableCell align="center" sx={{ textAlign: "start", border: "solid 1px black", width: "10%" }}>
                  ارزش
                </TableCell>
                <TableCell align="center" sx={{ textAlign: "start", border: "solid 1px black", width: "10%" }}>
                  نمره های دریافتی
                </TableCell>
                <TableCell align="center" sx={{ textAlign: "start", border: "solid 1px black" }}>
                  ملاحظات
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* {data?.rows?.map((reportItem: any, reportIndex: number) => ( */}
              {myData?.map((item: any, index: number) => (
                <TableRow key={index}>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell>{item?.description}</TableCell>
                  <TableCell>{item?.value}</TableCell>
                  <TableCell>
                    <TextField
                      value={(selectedReportType === 0 ? item?.ajaGrade : item?.selfGrade) ?? 0}
                      onChange={(e: any) => {
                        if (!isNaN(e.target.value))
                          handleChange(index, selectedReportType === 0 ? "ajaGrade" : "selfGrade", e.target.value);
                      }}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={selectedReportType === 0 ? item?.ajaConsideration : item?.selConsideration}
                      onChange={(e) => {
                        handleChange(
                          index,
                          selectedReportType === 0 ? "ajaConsideration" : "selfConsideration",
                          e.target.value
                        );
                      }}
                      fullWidth
                    />
                  </TableCell>
                </TableRow>
              ))}
              {/* ))} */}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
        )
      }
      
    </Grid>
  );
};

export default RecieveDocument;
