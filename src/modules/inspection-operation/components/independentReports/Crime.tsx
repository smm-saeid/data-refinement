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

type Props = { editable: boolean };

const Crime = ({ editable }: Props) => {
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
            فرم جرائم یگان
          </Typography>
        </Box>
        {editable ? (
          <Box display="flex">
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
            {/* <BackButton onBack={() => navigate("/inspection/planning/AJA-planning")} /> */}
          </Box>
        ) : null}
      </Grid>
      <Grid item container md={12} m={2} display={"flex"} justifyContent={"space-between"}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ bgcolor: "lightsalmon", borderColor: "black" }}>
              <TableRow>
                <TableCell rowSpan={2} align="center" sx={{ border: "solid 1px black" }}>
                  ردیف
                </TableCell>
                <TableCell
                  rowSpan={2}
                  align="center"
                  sx={{ textAlign: "start", border: "solid 1px black", width: "50%" }}
                >
                  نوع تخلف
                </TableCell>
                <TableCell colSpan={2} align="center" sx={{ textAlign: "start", border: "solid 1px black" }}>
                  کارکنان
                </TableCell>
                <TableCell rowSpan={2} align="center" sx={{ textAlign: "start", border: "solid 1px black" }}>
                  جمع کل
                </TableCell>
                {editable ? (
                  <TableCell rowSpan={2} align="center" sx={{ textAlign: "start", border: "solid 1px black" }}>
                    حذف
                  </TableCell>
                ) : null}
              </TableRow>
              <TableRow>
                <TableCell align="center" sx={{ textAlign: "start", border: "solid 1px black" }}>
                  پایور
                </TableCell>
                <TableCell align="center" sx={{ textAlign: "start", border: "solid 1px black" }}>
                  وظیفه
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* {data?.rows?.map((reportItem: any, reportIndex: number) => ( */}
              {myData?.map((item: any, index: number) => (
                <TableRow key={index}>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell>
                    {editable ? (
                      <TextField
                        value={item?.violationAndCrimeTypeName}
                        onChange={(e) => {
                          handleChange(index, "violationAndCrimeTypeName", e.target.value);
                        }}
                        fullWidth
                      />
                    ) : (
                      item?.violationAndCrimeTypeName
                    )}
                  </TableCell>
                  <TableCell>
                    {editable ? (
                      <TextField
                        value={item?.staff}
                        onChange={(e: any) => {
                          if (!isNaN(e.target.value)) handleChange(index, "staff", e.target.value);
                        }}
                        fullWidth
                      />
                    ) : (
                      item?.staff
                    )}
                  </TableCell>
                  <TableCell>
                    {editable ? (
                      <TextField
                        value={item?.duty}
                        onChange={(e: any) => {
                          if (!isNaN(e.target.value)) handleChange(index, "duty", e.target.value);
                        }}
                        fullWidth
                      />
                    ) : (
                      item?.duty
                    )}
                  </TableCell>
                  <TableCell>{Number(item?.duty) + Number(item?.staff)}</TableCell>
                  {editable ? (
                    <TableCell>
                      <Tooltip title="حذف">
                        <Fab
                          size="small"
                          color="error"
                          onClick={() =>
                            setMyData((prev) =>
                              prev?.filter(
                                (deleteTtem) => item.violationAndCrimeTypeId !== deleteTtem.violationAndCrimeTypeId
                              )
                            )
                          }
                        >
                          <Delete fontSize="small" />
                        </Fab>
                      </Tooltip>
                    </TableCell>
                  ) : null}
                </TableRow>
              ))}
              {/* ))} */}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default Crime;
