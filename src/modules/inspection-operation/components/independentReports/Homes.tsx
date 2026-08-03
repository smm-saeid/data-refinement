import { Book, Check, ListAlt } from "@mui/icons-material";
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

type Props = {
  editable:boolean
};

const Homes: React.FC<Props>= ({editable}) => {
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
  const { data, status, refetch } = useQuery<any, any, any, any>({
    // queryKey: [`independent-reports-review-group${paramsSerializer(filters)}`],
    queryKey: [
      `independent-report-home-statistics/find-by-parameter?inspectionId=${id}&organizationUnitId=f07deb56-de03-4271-adc4-76e143abdd15`,
    ],
    queryFn: Auth?.getRequest_YASER,
    // select: (res: any) => res.data?.inspectionType?.find((item:any)=>item?.key==="KHOD_ARZYABI") as any,
    select: (res: any) => res.data as any,
    // enabled: !!selectedYear && selectedYear !== "new",
  });

  useEffect(() => {
    if (!!data) setMyData(data);
  }, [data]);

  const [basicObjectHome, setbasicObjectHome] = useState({
    inspectionId: "73dfb77c-833f-44bf-aa62-4ddde034994c",
    organizationUnitId: "f07deb56-de03-4271-adc4-76e143abdd15",
    organizationHomeType: "amiri",
    available: 0,
    occupation: 0,
  });
  const tableItems = useMemo(
    () => [
      {
        name: "amiri_available",
        inputType: "text",
        label: "موجود",
        size: { md: 12 },
        elementProps: {
          // multiline: true,
          // rows: 3,
          value: myData?.find((item) => item?.organizationHomeType === "amiri")?.available ?? "",
          onChange: (e: any) => {
            setMyData((previousState: any) => {
              const index = myData?.findIndex((item) => item?.organizationHomeType === "amiri");
              if (index !== -1) {
                const updated = [...previousState];
                updated[index] = {
                  ...updated[index],
                  available: e.target.value,
                };
                return updated;
              } else
                return [
                  ...previousState,
                  {
                    ...basicObjectHome,
                    organizationHomeType: "amiri",
                    available: e.target.value,
                  },
                ];
            });
          },
        },
      },
      {
        name: "amiri_occupation",
        inputType: "text",
        label: "اشغال شده",
        size: { md: 12 },
        elementProps: {
          // multiline: true,
          // rows: 3,
          value: myData?.find((item) => item?.organizationHomeType === "amiri")?.occupation ?? "",
          onChange: (e: any) => {
            setMyData((previousState: any) => {
              const index = myData?.findIndex((item) => item?.organizationHomeType === "amiri");
              if (index !== -1) {
              const updated = [...previousState];
              updated[index] = {
                ...updated[index],
                occupation: e.target.value,
              };
              return updated;
            } else
            return [
              ...previousState,
              {
                ...basicObjectHome,
                organizationHomeType: "amiri",
                occupation: 0,
              },
            ];
            });
          },
        },
      },
      {
        name: "21",
        inputType: "text",
        label: "موجود",
        size: { md: 12 },
        elementProps: {
          // multiline: true,
          // rows: 3,
          value: myData?.find((item) => item?.organizationHomeType === "afsar_arshadi")?.available ?? "",
          onChange: (e: any) => {
            setMyData((previousState: any) => {
              const index = myData?.findIndex((item) => item?.organizationHomeType === "afsar_arshadi");
              if (index !== -1) {
              const updated = [...previousState];
              updated[index] = {
                ...updated[index],
                available: e.target.value,
              };
              return updated;
            } else
            return [
              ...previousState,
              {
                ...basicObjectHome,
                organizationHomeType: "afsar_arshadi",
                available: e.target.value,
              },
            ];
            });
          },
        },
      },
      {
        name: "22",
        inputType: "text",
        label: "اشغال شده",
        size: { md: 12 },
        elementProps: {
          // multiline: true,
          // rows: 3,
          value: myData?.find((item) => item?.organizationHomeType === "afsar_arshadi")?.occupation ?? "",
          onChange: (e: any) => {
            setMyData((previousState: any) => {
              const index = myData?.findIndex((item) => item?.organizationHomeType === "afsar_arshadi");
              if (index !== -1) {
              const updated = [...previousState];
              updated[index] = {
                ...updated[index],
                occupation: e.target.value,
              };
              return updated;
            } else
            return [
              ...previousState,
              {
                ...basicObjectHome,
                organizationHomeType: "afsar_arshadi",
                occupation: e.target.value,
              },
            ];
            });
          },
        },
      },
      {
        name: "31",
        inputType: "text",
        label: "موجود",
        size: { md: 12 },
        elementProps: {
          // multiline: true,
          // rows: 3,
          value: myData?.find((item) => item?.organizationHomeType === "afsar_joz")?.available ?? "",
          onChange: (e: any) => {
            setMyData((previousState: any) => {
              const index = myData?.findIndex((item) => item?.organizationHomeType === "afsar_joz");
              if (index !== -1) {
              const updated = [...previousState];
              updated[index] = {
                ...updated[index],
                available: e.target.value,
              };
              return updated;
            } else
            return [
              ...previousState,
              {
                ...basicObjectHome,
                organizationHomeType: "afsar_joz",
                available: e.target.value,
              },
            ];
            });
          },
        },
      },
      {
        name: "32",
        inputType: "text",
        label: "اشغال شده",
        size: { md: 12 },
        elementProps: {
          // multiline: true,
          // rows: 3,
          value: myData?.find((item) => item?.organizationHomeType === "afsar_joz")?.occupation ?? "",
          onChange: (e: any) => {
            setMyData((previousState: any) => {
              const index = myData?.findIndex((item) => item?.organizationHomeType === "afsar_joz");
              if (index !== -1) {
              const updated = [...previousState];
              updated[index] = {
                ...updated[index],
                occupation: e.target.value,
              };
              return updated;
            } else
            return [
              ...previousState,
              {
                ...basicObjectHome,
                organizationHomeType: "afsar_joz",
                occupation: e.target.value,
              },
            ];
            });
          },
        },
      },
      {
        name: "41",
        inputType: "text",
        label: "موجود",
        size: { md: 12 },
        elementProps: {
          // multiline: true,
          // rows: 3,
          value: myData?.find((item) => item?.organizationHomeType === "karmandi")?.available ?? "",
          onChange: (e: any) => {
            setMyData((previousState: any) => {
              const index = myData?.findIndex((item) => item?.organizationHomeType === "karmandi");
              if (index !== -1) {
              const updated = [...previousState];
              updated[index] = {
                ...updated[index],
                available: e.target.value,
              };
              return updated;
            } else
            return [
              ...previousState,
              {
                ...basicObjectHome,
                organizationHomeType: "amiri",
                available: e.target.value,
              },
            ];
            });
          },
        },
      },
      {
        name: "42",
        inputType: "text",
        label: "اشغال شده",
        size: { md: 12 },
        elementProps: {
          // multiline: true,
          // rows: 3,
          value: myData?.find((item) => item?.organizationHomeType === "karmandi")?.occupation ?? "",
          onChange: (e: any) => {
            setMyData((previousState: any) => {
              const index = myData?.findIndex((item) => item?.organizationHomeType === "karmandi");
              if (index !== -1) {
              const updated = [...previousState];
              updated[index] = {
                ...updated[index],
                occupation: e.target.value,
              };
              return updated;
            } else
            return [
              ...previousState,
              {
                ...basicObjectHome,
                organizationHomeType: "karmandi",
                occupation: e.target.value,
              },
            ];
            });
          },
        },
      },
      {
        name: "51",
        inputType: "text",
        label: "موجود",
        size: { md: 12 },
        elementProps: {
          // multiline: true,
          // rows: 3,
          value: myData?.find((item) => item?.organizationHomeType === "darajedari")?.available ?? "",
          onChange: (e: any) => {
            setMyData((previousState: any) => {
              const index = myData?.findIndex((item) => item?.organizationHomeType === "darajedari");
              if (index !== -1) {
              const updated = [...previousState];
              updated[index] = {
                ...updated[index],
                available: e.target.value,
              };
              return updated;
            } else
            return [
              ...previousState,
              {
                ...basicObjectHome,
                organizationHomeType: "darajedari",
                available: e.target.value,
              },
            ];
            });
          },
        },
      },
      {
        name: "52",
        inputType: "text",
        label: "اشغال شده",
        size: { md: 12 },
        elementProps: {
          // multiline: true,
          // rows: 3,
          value: myData?.find((item) => item?.organizationHomeType === "darajedari")?.occupation ?? "",
          onChange: (e: any) => {
            setMyData((previousState: any) => {
              const index = myData?.findIndex((item) => item?.organizationHomeType === "darajedari");
              if (index !== -1) {
              const updated = [...previousState];
              updated[index] = {
                ...updated[index],
                occupation: e.target.value,
              };
              return updated;
            } else
            return [
              ...previousState,
              {
                ...basicObjectHome,
                organizationHomeType: "darajedari",
                occupation: e.target.value,
              },
            ];
            });
          },
        },
      },
    ],
    [myData, data]
  );
  return (
    <Grid container item md={11}>
      <Grid item container md={12} m={2} display={"flex"} justifyContent={"space-between"}>
        <Box display="flex">
          {/* <Book /> */}
          <Typography variant="body1" component={"h3"} ml={2}>
            آمار خانه ای سازمانی
          </Typography>
        </Box>
        <Box display="flex">
          <Button variant="contained" endIcon={<Check />} sx={{ minWidth: "150px", mb: 2 }} onClick={() => {}}>
            ثبت تغیرات
          </Button>
          {/* <BackButton onBack={() => navigate("/inspection/planning/AJA-planning")} /> */}
        </Box>
      </Grid>
      <Grid item container md={12} m={2} display={"flex"} justifyContent={"space-between"}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ bgcolor: "lightsalmon", borderColor: "black" }}>
              <TableRow>
                <TableCell rowSpan={2} align="center">
                  ردیف
                </TableCell>
                <TableCell rowSpan={2} align="center" sx={{ textAlign: "start" }}>
                  یگان
                </TableCell>
                <TableCell colSpan={2} align="center">
                  افسری
                </TableCell>
                <TableCell colSpan={2} align="center">
                  افسر ارشدی
                </TableCell>
                <TableCell colSpan={2} align="center">
                  افسر جزء
                </TableCell>
                <TableCell colSpan={2} align="center">
                  درجه داری
                </TableCell>
                <TableCell colSpan={2} align="center">
                  کارمندی
                </TableCell>
                {/* <TableCell align="center">نام خانوادگی</TableCell>
                        <TableCell align="center">جایگاه</TableCell> */}
              </TableRow>
              <TableRow>
                <TableCell align="center">موجود</TableCell>
                <TableCell align="center">اشغال شده</TableCell>
                <TableCell align="center">موجود</TableCell>
                <TableCell align="center">اشغال شده</TableCell>
                <TableCell align="center">موجود</TableCell>
                <TableCell align="center">اشغال شده</TableCell>
                <TableCell align="center">موجود</TableCell>
                <TableCell align="center">اشغال شده</TableCell>
                <TableCell align="center">موجود</TableCell>
                <TableCell align="center">اشغال شده</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* {data?.rows?.map((reportItem: any, reportIndex: number) => ( */}
              <TableRow>
                <TableCell align="center">1</TableCell>
                <TableCell align="center">نام یگان</TableCell>
                {tableItems.map((item) => (
                  <TableCell key={item.name}>
                    {
                      editable?(
                        <Controller
                      name={item.name as keyof IUser}
                      control={control}
                      render={({ field }) => {
                        return <RenderFormInput controllerField={field} {...item} {...field} />;
                      }}
                    />
                      ):item?.elementProps?.value
                    }
                    
                  </TableCell>
                ))}
              </TableRow>
              {/* ))} */}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default Homes;
