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
  Chip,
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

const BazbinehReport = (props: Props) => {
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
  const [selectedReportItem, setselectedReportItem] = useState({} as any);
  const { data: review_data, status: review_status, refetch: review_refetch } = useQuery<any, any, any>({
    queryKey: [`/review-customize/find-all-reviews?inspectionId=${id}`],
    queryFn: Auth?.getRequest_YASER,
    select: (res: any) => res.data,
} as any);
  const { data, status, refetch } = useQuery<any, any, any, any>({
    // queryKey: [`independent-reports-review-group${paramsSerializer(filters)}`],
    queryKey: [
      `independent-report-violation-and-crime/crime/find-by-parameter?inspectionId=${id}&organizationUnitId=f07deb56-de03-4271-adc4-76e143abdd15`,
    ],
    queryFn: Auth?.getRequest_YASER,
    // select: (res: any) => res.data?.inspectionType?.find((item:any)=>item?.key==="KHOD_ARZYABI") as any,
    select: (res: any) => res.data as any,
    // enabled: !!selectedYear && selectedYear !== "new",
  });
  const {
    data: crimeList,
    status: crimeList_status,
    refetch: crimeList_refetch,
  } = useQuery<any, any, any, any>({
    // queryKey: [`independent-reports-review-group${paramsSerializer(filters)}`],
    queryKey: [`violation-and-crime-type/crime`],
    queryFn: Auth?.getRequest_YASER,
    // select: (res: any) => res.data?.inspectionType?.find((item:any)=>item?.key==="KHOD_ARZYABI") as any,
    select: (res: any) => res.data as any,
    // enabled: !!selectedYear && selectedYear !== "new",
  });

  const [basicObjectHome, setbasicObjectHome] = useState({
    // inspectionId: "73dfb77c-833f-44bf-aa62-4ddde034994c",
    // organizationUnitId: "f07deb56-de03-4271-adc4-76e143abdd15",
    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    inspectionId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    organizationUnitId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    organizationUnitName: "string",
    violationAndCrimeTypeId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    violationAndCrimeTypeName: "string",
    type: "string",
    staff: 0,
    duty: 0,
  });

  useEffect(() => {
    if (!!data) setMyData(data);
  }, [data]);
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
    else snackbar("این جرم موجود میباشد", "error");
  }

  const submitHandler = () => {
    mutate(
      {
        entity: `independent-report-violation-and-crime/crime/save-all`,
        method: "post",
        data: [...myData],
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
          <Typography variant="body1" component={"h3"} ml={2}>
            بازبینه های مورد استفاده
          </Typography>
        </Box>
        {/* <Box display="flex">
          <Autocomplete
            id="crime"
            onChange={(event: any, newValue: any) => {
              if (newValue?.id) {
                // console.log(newValue)
                handleAddRow(newValue);
              }

              setAutoCompleteValue(undefined);
            }}
            renderOption={(props: any, option: any) => (
              <li {...props} key={option.id}>
                {option.name}
              </li>
            )}
            value={autoCompleteValue}
            inputValue={autoCompleteValue}
            clearOnBlur
            options={crimeList ?? []}
            sx={{ width: 150, mr: 2 }}
            getOptionLabel={(option: any) => option.name}
            renderInput={(params: any) => <TextField {...params} label="افزودن جرائم " />}
            isOptionEqualToValue={(option, value) => {
              return `${option?.id}` === `${value.id}`;
            }}
          />
          <Button variant="contained" endIcon={<Check />} sx={{ minWidth: "150px", mb: 2 }} onClick={submitHandler}>
            ثبت تغیرات
          </Button>
        </Box> */}
      </Grid>
      <Grid item container md={11} m={2} display={"flex"} justifyContent={"space-between"}>
        {/* <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ bgcolor: "lightsalmon", borderColor: "black" }}>
              <TableRow>
                <TableCell rowSpan={2} align="center" sx={{ border: "solid 1px black" }}>
                  ردیف
                </TableCell>
                <TableCell
                  rowSpan={2}
                  align="center"
                  sx={{ textAlign: "start", border: "solid 1px black", width: "30%" }}
                >
                  شرح بازبینه
                </TableCell>
                <TableCell colSpan={3} align="center" sx={{ textAlign: "start", border: "solid 1px black" }}>
                  تعداد مورد استفاده
                </TableCell>
                <TableCell rowSpan={2} align="center" sx={{ textAlign: "start", border: "solid 1px black" }}>
                  جمع کل
                </TableCell>
                
              </TableRow>
              <TableRow>
                <TableCell align="center" sx={{ textAlign: "start", border: "solid 1px black",width:"200px" }}>
                  آجا
                </TableCell>
                <TableCell align="center" sx={{ textAlign: "start", border: "solid 1px black",width:"200px"  }}>
                  نیروی ذی ربط
                </TableCell>
                <TableCell align="center" sx={{ textAlign: "start", border: "solid 1px black",width:"200px"  }}>
                  تهیه شده
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {myData?.map((item: any, index: number) => (
                <TableRow key={index}>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell>
                    <TextField
                      value={item?.violationAndCrimeTypeName}
                      onChange={(e) => {
                        handleChange(index, "violationAndCrimeTypeName", e.target.value);
                      }}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={item?.staff}
                      onChange={(e: any) => {
                        if (!isNaN(e.target.value)) handleChange(index, "staff", e.target.value);
                      }}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={item?.staff}
                      onChange={(e: any) => {
                        if (!isNaN(e.target.value)) handleChange(index, "staff", e.target.value);
                      }}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={item?.duty}
                      onChange={(e: any) => {
                        if (!isNaN(e.target.value)) handleChange(index, "duty", e.target.value);
                      }}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>{Number(item?.duty) + Number(item?.staff)}</TableCell>
                  
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer> */}
        <TableContainer component={Paper} sx={{ minWidth: "1200px" }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center" style={{ width: "5%" }} colSpan={1}></TableCell>
                                            <TableCell align="center" style={{ width: "10%" }} sx={{ borderRight: "solid 1px rgba(224, 224, 224, 1)" }} colSpan={1}></TableCell>
                                            <TableCell align="center" style={{ width: "45%" }} sx={{ borderRight: "solid 1px rgba(224, 224, 224, 1)" }} colSpan={5}>تعداد</TableCell>
                                            <TableCell align="center" style={{ width: "10%" }} colSpan={1}></TableCell>
                                            <TableCell align="center" style={{ width: "10%" }} colSpan={1}></TableCell>
                                            <TableCell align="center" style={{ width: "10%" }} colSpan={1}></TableCell>
                                            <TableCell align="center" style={{ width: "10%" }} colSpan={1}></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell align="center">ردیف</TableCell>
                                            <TableCell align="center" sx={{ borderRight: "solid 1px rgba(224, 224, 224, 1)" }}>محور مورد بازرسی </TableCell>

                                            <TableCell align="center">تعداد بازبینه</TableCell>
                                            <TableCell align="center">فعالیت</TableCell>
                                            <TableCell align="center">حسن</TableCell>
                                            <TableCell align="center">عیب/نقص</TableCell>
                                            <TableCell align="center" sx={{ borderRight: "solid 1px rgba(224, 224, 224, 1)" }}>انجام وظیفه</TableCell>

                                            <TableCell align="center">میزان عملکرد</TableCell>
                                            <TableCell align="center">اثر بخشی</TableCell>
                                            <TableCell align="center">نمره بهره‌وری</TableCell>
                                            <TableCell align="center">طبقه بهره‌وری</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {review_data?.finalReport?.reports?.map((report: any, index: any) => (
                                            <TableRow
                                                key={index}
                                            >
                                                <TableCell align="center">
                                                    {index + 1}
                                                </TableCell>

                                                <TableCell align="center">
                                                    {report?.name}
                                                </TableCell>

                                                <TableCell align="center">
                                                    {report?.count}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {report?.activities}
                                                </TableCell>

                                                <TableCell align="center">
                                                    {report?.advantage_count}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {report?.deficiency_count}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {report?.moderate_count}
                                                </TableCell>

                                                <TableCell align="center">
                                                    {report?.total_grade.toFixed(2)}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {report?.total_effectiveness.toFixed(2)}
                                                </TableCell>

                                                <TableCell align="center">
                                                    {report?.effective_grade.toFixed(2)}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {
                                                        report?.effective_grade >= 90 ?
                                                            <Chip label="عالی" color="success" />
                                                            : report?.effective_grade >= 80 ?
                                                                <Chip label="خیلی خوب" color="success" />
                                                                : report?.effective_grade >= 75 ?
                                                                    <Chip label="خوب" color="info" />
                                                                    : report?.effective_grade >= 65 ?
                                                                        <Chip label="قابل قبول" color="warning" />
                                                                        : report?.effective_grade >= 0 ?
                                                                            <Chip label="غیر قابل قبول" color="error" />
                                                                            : <Chip label="نمره نا معتبر" />
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {/* <TableRow>
                                            <TableCell align="center" colSpan={11}>

                                            </TableCell>
                                        </TableRow> */}
                                        <TableRow>
                                            <TableCell align="center">
                                                -
                                            </TableCell>

                                            <TableCell align="center">
                                                جمع/معدل
                                            </TableCell>

                                            <TableCell align="center">
                                                {(review_data?.finalReport?.reports?.reduce((acc: any, curr: any) => acc + curr.count, 0))}
                                            </TableCell>
                                            <TableCell align="center">
                                                {(review_data?.finalReport?.reports?.reduce((acc: any, curr: any) => acc + curr.activities, 0))}
                                            </TableCell>

                                            <TableCell align="center">
                                                {(review_data?.finalReport?.reports?.reduce((acc: any, curr: any) => acc + curr.advantage_count, 0))}
                                            </TableCell>
                                            <TableCell align="center">
                                                {(review_data?.finalReport?.reports?.reduce((acc: any, curr: any) => acc + curr.deficiency_count, 0))}
                                            </TableCell>
                                            <TableCell align="center">
                                                {(review_data?.finalReport?.reports?.reduce((acc: any, curr: any) => acc + curr.moderate_count, 0))}
                                            </TableCell>

                                            <TableCell align="center">
                                                {(review_data?.finalReport?.avg_grade?.toFixed(2))}
                                            </TableCell>
                                            <TableCell align="center">
                                                {(review_data?.finalReport?.avg_productivity?.toFixed(2))}
                                            </TableCell>

                                            <TableCell align="center">
                                                {(review_data?.finalReport?.avg_effective_grade.toFixed(2))}
                                            </TableCell>
                                            <TableCell align="center">
                                                {
                                                    review_data?.finalReport?.avg_effective_grade >= 90 ?
                                                        <Chip label="عالی" color="success" />
                                                        : review_data?.finalReport?.avg_effective_grade >= 80 ?
                                                            <Chip label="خیلی خوب" color="success" />
                                                            : review_data?.finalReport?.avg_effective_grade >= 75 ?
                                                                <Chip label="خوب" color="info" />
                                                                : review_data?.finalReport?.avg_effective_grade >= 65 ?
                                                                    <Chip label="قابل قبول" color="warning" />
                                                                    : review_data?.finalReport?.avg_effective_grade >= 0 ?
                                                                        <Chip label="غیر قابل قبول" color="error" />
                                                                        : <Chip label="نمره نا معتبر" />
                                                }
                                            </TableCell>
                                        </TableRow>
                                        

                                    </TableBody>
                                </Table>
                            </TableContainer>
      </Grid>
    </Grid>
  );
};

export default BazbinehReport