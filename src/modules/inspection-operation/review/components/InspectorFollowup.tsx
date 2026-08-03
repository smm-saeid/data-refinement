import { Skeleton, Box, Grid, Typography, Button, Tabs, Tab, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Checkbox, Autocomplete } from "@mui/material";
import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, Navigate } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "hooks/useAuth";
import { useSnackbar } from "hooks/useSnackbar";
import { useLegacyApi } from "@/hooks/useLegacyApi";

const steps = [
    'محاسن',
    'معایب نواقص',
    'پیشنهادهای مصوب',
    'تشویقات و تنبیهات',
    // 'مستندات یگان',
]

const TextFieldComponent: React.FC<any> = (
    { label = "", defaultValue = "", multiline = false, type = "text", globalSetter, grade = null, max = null }:
        { label: string, defaultValue: any, multiline: boolean, type: string, globalSetter: (x: any) => any, grade: null | number, max: null | number }
) => {
    const snackbar = useSnackbar();
    const [text, setText] = useState<any>(defaultValue)

    useEffect(() => {
        if (!!grade && grade < 75 && text > 4) {
            snackbar('نمره اثربخشی سوالاتی که نمره میزان عملکرد آن کمتر از ۷۵ است الزاما بایستی کمتر از ۴ باشد.', "error", 5000);
            setText(0)
        }
    }, [grade, text])

    useEffect(() => {
        setText(defaultValue)
    }, [defaultValue])

    return (
        <TextField
            label={label}
            hiddenLabel={label === null}
            type={type}
            size="small"
            fullWidth
            value={text}
            onChange={(event: any) => {
                if (!max)
                    setText(type === 'number' ? parseFloat(event.target.value) : event.target.value)
                else
                    setText(Math.min(Math.max(type === 'number' ? parseFloat(event.target.value) : event.target.value, 0), max))
            }}
            multiline={multiline}
            onBlur={() => globalSetter(text)}
        />
    )
}

const InspectorFollowup = () => {
    const [selectedStep, setSelectedStep] = React.useState(0);
    const legacyApi = useLegacyApi();

    const {
        handleSubmit,
        formState: { errors },
        reset,
        control,
        setValue,
        getValues,
        watch,
    } = useForm<{ value: string }>();

    const { inspectionId, reviewId } = useParams()
    const Auth = useAuth()
    const { mutate } = useMutation({
        // mutationFn: Auth?.serverCall_JSON_Server,
        mutationFn: legacyApi.request,
    });
    const snackbar = useSnackbar();

    const [deficiencies_data, setDeficiencies_data] = useState<any>([]);
    const [advantages_data, setAdvantages_data] = useState<any>([]);
    const [appsug_data, setAppsug_data] = useState<any>([]);

    const [new_deficiencies_data, setNewDeficiencies_data] = useState<any>([]);
    const [new_appsug_data, setNewAppsug_data] = useState<any>([]);
    const [new_advantages_data, setNewAdvantages_data] = useState<any>([]);

    const { data: inspection, status: inspection_status, error } = useQuery<any, any, any>({
        queryKey: [`/inspection/id/${inspectionId}`],
        queryFn: () => legacyApi.get(`/inspection/id/${inspectionId}`),
        select: (res: any) => res.data,
    } as any);

    const { data, status, refetch, isLoading } = useQuery<any, any, any>({
        queryKey: [`/review-customize/find-all-reviews?inspectionId=${inspection?.parentInspectionId}`],
        queryFn: () => legacyApi.get(`/review-customize/find-all-reviews?inspectionId=${inspection?.parentInspectionId}`),
        select: (res: any) => res?.data,
        enabled: !!inspection?.parentInspectionId
    } as any);

    const { data: deficiencies, status: deficiencies_status, refetch: deficiencies_refresh } = useQuery<any, any, any>({
        queryKey: [`/deficiency-follow-up/find-by-parameter?inspectionId=${inspection?.parentInspectionId}`],
        queryFn: () => legacyApi.get(`/deficiency-follow-up/find-by-parameter?inspectionId=${inspection?.parentInspectionId}`),
        select: (res: any) => res?.data,
        enabled: !!inspection?.parentInspectionId
    } as any);

    const { data: n_deficiencies, status: n_deficiencies_status, refetch: n_deficiencies_refresh } = useQuery<any, any, any>({
        queryKey: [`/deficiency/find-by-parameter?inspectionId=${inspectionId}&reviewGroupId=${reviewId}`],
        queryFn: () => legacyApi.get(`/deficiency/find-by-parameter?inspectionId=${inspectionId}&reviewGroupId=${reviewId}`),
        select: (res: any) => res?.data,
    } as any);

    const { data: advantages, status: advantages_status, refetch: advantages_refresh } = useQuery<any, any, any>({
        queryKey: [`/advantage-follow-up/find-by-parameter?inspectionId=${inspection?.parentInspectionId}`],
        queryFn: () => legacyApi.get(`/advantage-follow-up/find-by-parameter?inspectionId=${inspection?.parentInspectionId}`),
        select: (res: any) => res?.data,
        enabled: !!inspection?.parentInspectionId
    } as any);

    const { data: n_advantages, status: n_advantages_status, refetch: n_advantages_refresh } = useQuery<any, any, any>({
        queryKey: [`/advantage/find-by-parameter?inspectionId=${inspectionId}&reviewGroupId=${reviewId}`],
        queryFn: () => legacyApi.get(`/advantage/find-by-parameter?inspectionId=${inspectionId}&reviewGroupId=${reviewId}`),
        select: (res: any) => res?.data,
    } as any);

    const { data: appsug, status: appsug_status, refetch: appsug_refresh } = useQuery<any, any, any>({
        queryKey: [`/approved-suggestion/find-by-parameter?inspectionId=${inspection?.parentInspectionId}`],
        queryFn: () => legacyApi.get(`/approved-suggestion/find-by-parameter?inspectionId=${inspection?.parentInspectionId}`),
        select: (res: any) => res?.data,
        enabled: !!inspection?.parentInspectionId
    } as any);


    const { data: appsugfu, status: appsugfu_status, refetch: appsugfu_refresh } = useQuery<any, any, any>({
        queryKey: [`/approved-suggestion-follow-up/find-by-parameter?inspectionId=${inspection?.parentInspectionId}`],
        queryFn: () => legacyApi.get(`/approved-suggestion-follow-up/find-by-parameter?inspectionId=${inspection?.parentInspectionId}`),
        select: (res: any) => res?.data,
        enabled: !!inspection?.parentInspectionId
    } as any);

    const { data: inspectionData, status: inspectionStatus, refetch: inspectionRefetch } = useQuery<any, any, any>({
        queryKey: [`/inspection/id/${inspection?.parentInspectionId}`],
        queryFn: () => legacyApi.get(`/inspection/id/${inspection?.parentInspectionId}`),
        select: (res: any) => res?.data,
        enabled: !!inspection?.parentInspectionId
    } as any);

    const { data: encouragement, status: encouragementStatus, refetch: encouragementRefetch } = useQuery<any, any, any>({
        queryKey: [`/encouragement/find-by-inspection?inspectionId=${inspection?.parentInspectionId}`],
        queryFn: () => legacyApi.get(`/encouragement/find-by-inspection?inspectionId=${inspection?.parentInspectionId}`),
        select: (res: any) => res?.data,
        enabled: !!inspection?.parentInspectionId
    } as any);

    useEffect(() => {
        if (n_deficiencies_status == "success") {
            if (!!n_deficiencies && n_deficiencies?.length > 0) {
                setNewDeficiencies_data(n_deficiencies)
            }
        }
    }, [n_deficiencies, n_deficiencies_status])

    useEffect(() => {
        if (n_advantages_status == "success") {
            if (!!n_advantages && n_advantages?.length > 0) {
                setNewAdvantages_data(n_advantages)
            }
        }
    }, [n_advantages, n_advantages_status])

    useEffect(() => {
        if (status == "success" && deficiencies_status == "success") {
            if (!!deficiencies && deficiencies?.length > 0) {
                setDeficiencies_data(deficiencies)
            }
        }
    }, [data, deficiencies, status, deficiencies_status])

    useEffect(() => {
        if (status == "success" && advantages_status == "success") {
            if (!!advantages && advantages?.length > 0) {
                setAdvantages_data(advantages)
            }
        }
    }, [data, advantages, status, advantages_status])

    useEffect(() => {
        if (status == "success" && appsug_status == "success" && appsugfu_status == "success") {
            if (!!appsugfu && appsugfu.length > 0)
                setAppsug_data(appsugfu)
        }
    }, [status, appsug_status, appsug, appsugfu_status])

    const saveAdvantages = (data: any) => {
        mutate(
            {
                entity: `advantage-follow-up/save-all`,
                method: "post",
                data: data,
            } as any,
            {
                onSuccess: (res: any) => {
                    advantages_refresh()
                    snackbar("ذخیره شد.", "success", 5000);
                },
                onError: () => {
                    snackbar("خطا در انجام عملیات", "error", 5000);
                },
            }
        );
        mutate(
            {
                entity: `/advantage`,
                method: "post",
                data: new_advantages_data.map((advantage: any) => ({
                    reviewGroupId: reviewId,
                    inspectionId: inspectionId,
                    id: typeof advantage.id == 'number' ? undefined : advantage.id,
                    reviewCustomizeId: null,
                    description: advantage.description,
                }))
            } as any,
            {
                onSuccess: (res: any) => {
                    if (res.code !== 200) {
                        n_advantages_refresh();
                        snackbar("ذخیره شد.", "success", 5000);
                    } else {

                    }
                },
            }
        );
    }

    const saveDeficiencies = (data: any) => {
        mutate(
            {
                entity: `deficiency-follow-up/save-all`,
                method: "post",
                data: data,
            } as any,
            {
                onSuccess: (res: any) => {
                    deficiencies_refresh()
                    snackbar("ذخیره شد.", "success", 5000);
                },
                onError: () => {
                    snackbar("خطا در انجام عملیات", "error", 5000);
                },
            }
        );
        mutate(
            {
                entity: `/deficiency`,
                method: "post",
                data: new_deficiencies_data.map((deficiency: any) => ({
                    reviewGroupId: reviewId,
                    inspectionId: inspectionId,
                    id: typeof deficiency.id == 'number' ? undefined : deficiency.id,
                    reviewCustomizeId: null,
                    description: deficiency.description,
                    type: deficiency.type,
                    action: deficiency.action,
                }))
            } as any,
            {
                onSuccess: (res: any) => {
                    if (res.code !== 200) {
                        n_deficiencies_refresh();
                        snackbar("ذخیره شد.", "success", 5000);
                    } else {

                    }
                },
            }
        );
    }

    const saveApprovedSugestions = (data: any) => {
        mutate(
            {
                entity: `approved-suggestion-follow-up/save-all`,
                method: "post",
                data: data,
            } as any,
            {
                onSuccess: (res: any) => {
                    appsug_refresh()
                    snackbar("ذخیره شد.", "success", 5000);
                },
                onError: () => {
                    snackbar("خطا در انجام عملیات", "error", 5000);
                },
            }
        );
    }

    return (
        isLoading ?
            (<Skeleton variant="rounded" height={300} />) :
            status === 'error' ?
                (<Navigate to={'/404'} />) :
                status === 'success' ?
                    (
                        <Box sx={{ width: "100%" }}>
                            <Grid container spacing={2}>
                                <Grid size={{xs: 12}} textAlign={'center'}>
                                    <Tabs value={selectedStep} onChange={(e, value) => setSelectedStep(value)}>
                                        {
                                            steps.map((naturItem, natureKey) => (
                                                <Tab key={natureKey} value={natureKey} label={naturItem}
                                                    // icon={ 
                                                    // selected !== naturItem.organizationTypeId ?
                                                    //     <ArrowCircleLeftOutlined sx={{fontSize:30,m:1}}/> :
                                                    //     <ArrowCircleDown sx={{fontSize:30,m:1}}/>
                                                    // } 
                                                    iconPosition='start' />
                                            ))
                                        }
                                    </Tabs>
                                </Grid>
                            </Grid>

                            <Grid size={{xs: 12}}>
                                {
                                    selectedStep == 0 ?
                                        <Grid container spacing={3}>
                                            <Grid size={{xs: 12}} display={"flex"} justifyContent={'center'} alignItems={'center'}>
                                                <Typography textAlign={'center'} variant="h6" marginBottom={"10px"}>
                                                    نکات مشهوده (محاسن)‌
                                                </Typography>
                                            </Grid>
                                            <Grid size={{xs: 12}}>
                                                <TableContainer component={Paper} sx={{ minWidth: "1200px" }}>
                                                    <Table>
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell align="center" style={{ width: "10%" }}>نام بازبینه</TableCell>
                                                                <TableCell align="center" style={{ width: "7%" }}>شناسه</TableCell>
                                                                <TableCell align="center" style={{ width: "50%" }}>شرح محاسن</TableCell>
                                                                <TableCell align="center" style={{ width: "50%" }}>ملاحظات</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {advantages_data?.map((item: any, index: any) => (
                                                                <TableRow
                                                                    key={index}
                                                                >
                                                                    {
                                                                        <TableCell align="center">
                                                                            {item?.advantageReviewGroupReviewFieldName}
                                                                        </TableCell>
                                                                    }

                                                                    <TableCell align="center">
                                                                        <Typography variant="body2" color={item?.type == "عیب" ? "error" : item?.type == "نقص" ? "#FF9800" : "#4caf50"}>
                                                                            {inspectionData?.organizationUnitCode}{item?.type == "عیب" ? "F" : item?.type == "نقص" ? "D" : "H"}{index + 1}
                                                                        </Typography>
                                                                    </TableCell>

                                                                    <TableCell align="center">
                                                                        <Typography variant="body2" color={item?.type == "عیب" ? "error" : item?.type == "نقص" ? "#FF9800" : "#4caf50"}>
                                                                            {item?.advantageDescription}
                                                                        </Typography>
                                                                    </TableCell>
                                                                    <TableCell align="center">
                                                                        <TextField hiddenLabel multiline fullWidth />
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))
                                                            }

                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </Grid>
                                            <Grid container size={{xs: 12}} spacing={2}>
                                                <Grid size={{xs: 12}}>
                                                    <Typography variant="h6">
                                                        افزودن محاسن
                                                    </Typography>
                                                </Grid>
                                                <Grid container size={{xs: 12}}>
                                                    <TableContainer component={Paper}>
                                                        <Table>
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell align="center" style={{ width: "5%" }}>ردیف</TableCell>
                                                                    <TableCell align="center" style={{ width: "43%" }}>شرح حسن</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {new_advantages_data.map((hosn: any, index: any) => (
                                                                    <TableRow
                                                                        key={index}
                                                                    >
                                                                        <TableCell align="center" >
                                                                            {index + 1}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <TextFieldComponent
                                                                                defaultValue={hosn?.description}
                                                                                globalSetter={(newValue: any) => setNewAdvantages_data((prevState: any) => {
                                                                                    let newState = [...prevState]
                                                                                    newState[index].description = newValue
                                                                                    return newState
                                                                                })}
                                                                                multiline
                                                                            />
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                        <Box margin={"20px"} display={"flex"} flexDirection={"row"} justifyContent={"center"} alignItems={"centers"}>
                                                            <Button
                                                                variant="contained"
                                                                color="warning"
                                                                onClick={() => {
                                                                    setNewAdvantages_data((list: any) => {
                                                                        return [
                                                                            ...list,
                                                                            {
                                                                                id: new Date().getTime(),
                                                                                description: "",
                                                                            }
                                                                        ]
                                                                    })
                                                                }}  >
                                                                <Typography>
                                                                    افزودن
                                                                </Typography>
                                                            </Button>
                                                        </Box>
                                                    </TableContainer>
                                                </Grid>
                                            </Grid>
                                            <Grid size={{xs: 12}} display={"flex"} justifyContent={'center'} alignItems={'center'}>
                                                <Button onClick={() => saveAdvantages(advantages_data)}>ذخیره</Button>
                                            </Grid>
                                        </Grid>
                                        :
                                        selectedStep == 1 ?
                                            <Grid container spacing={3}>
                                                <Grid size={{xs: 12}} display={"flex"} justifyContent={'center'} alignItems={'center'}>
                                                    <Typography textAlign={'center'} variant="h6" marginBottom={"10px"}>
                                                        نکات مشهوده معایب و نواقص
                                                    </Typography>
                                                </Grid>
                                                <Grid size={{xs: 12}}>
                                                    <TableContainer component={Paper} sx={{ minWidth: "1200px" }}>
                                                        <Table>
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell align="center">عنوان</TableCell>
                                                                    <TableCell align="center" style={{ width: "10%" }}>تعداد کل</TableCell>
                                                                    <TableCell align="center" style={{ width: "10%" }}>تعداد رفع شده</TableCell>
                                                                    <TableCell align="center" style={{ width: "10%" }}>درصد رفع شده بر حسب</TableCell>
                                                                    <TableCell align="center" style={{ width: "10%" }}>میانگین درصد نهایی رفع</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                <TableRow>
                                                                    <TableCell align="center">
                                                                        {
                                                                            inspectionData?.organizationUnitName
                                                                        }
                                                                    </TableCell>
                                                                    <TableCell align="center">
                                                                        {
                                                                            deficiencies_data?.length
                                                                        }
                                                                    </TableCell>

                                                                    <TableCell align="center">
                                                                        {
                                                                            deficiencies_data?.filter((item: any) => parseInt(item?.thirdActionPercentage) == 100)?.length
                                                                        }
                                                                    </TableCell>

                                                                    <TableCell align="center">
                                                                        {
                                                                            (deficiencies_data?.filter((item: any) => parseInt(item?.thirdActionPercentage) == 100)?.length / deficiencies_data?.length * 100)?.toFixed(2)
                                                                        }
                                                                    </TableCell>
                                                                    <TableCell align="center">
                                                                        {
                                                                            (deficiencies_data?.reduce((acc: any, curr: any) => acc + curr?.thirdActionPercentage, 0) / deficiencies_data?.length)?.toFixed(2)
                                                                        }
                                                                    </TableCell>

                                                                </TableRow>


                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                </Grid>
                                                <Grid size={{xs: 12}}>
                                                    <TableContainer component={Paper} sx={{ minWidth: "1200px" }}>
                                                        <Table>
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell align="center" style={{ width: "10%" }}>نام بازبینه</TableCell>
                                                                    <TableCell align="center" style={{ width: "8%" }}>عنوان</TableCell>
                                                                    <TableCell align="center" style={{ width: "7%" }}>شناسه</TableCell>
                                                                    <TableCell align="center" style={{ width: "20%" }}>شرح معایب و نواقص</TableCell>
                                                                    <TableCell align="center" style={{ width: "55%" }}>درج نتیجه اقدام</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {deficiencies_data?.map((review: any, index: any) => (
                                                                    <TableRow
                                                                        key={index}
                                                                    >
                                                                        {
                                                                            <TableCell align="center"
                                                                            // rowSpan={item?.deficiencies?.length}
                                                                            >
                                                                                {review?.deficiencyReviewGroupName}
                                                                            </TableCell>
                                                                        }

                                                                        {
                                                                            <TableCell align="center">
                                                                                {
                                                                                    review?.deficiencyType == "عیب" ?
                                                                                        <Chip label="عیب" color="error" />
                                                                                        :
                                                                                        <Chip label="نقص" color="warning" />
                                                                                }
                                                                            </TableCell>
                                                                        }

                                                                        <TableCell align="center">
                                                                            <Typography variant="body2" color={review?.deficiencyType == "عیب" ? "error" : review?.deficiencyType == "نقص" ? "#FF9800" : "#4caf50"}>
                                                                                {inspectionData?.organizationUnitCode}{review?.deficiencyType == "عیب" ? "F" : review?.deficiencyType == "نقص" ? "D" : "H"}{index + 1}
                                                                            </Typography>
                                                                        </TableCell>

                                                                        <TableCell align="center">
                                                                            <Typography variant="body2" color={review?.deficiencyType == "عیب" ? "error" : review?.deficiencyType == "نقص" ? "#FF9800" : "#4caf50"}>
                                                                                {review?.deficiencyDescription}
                                                                            </Typography>
                                                                        </TableCell>
                                                                        <TableCell align="center">
                                                                            <Grid container>
                                                                                <Grid size={{xs: 6}} container>
                                                                                    <Grid size={{xs: 12}}>
                                                                                        <TextField type="number" sx={{ width: "100px" }} label="درصد رفع نهایی"
                                                                                            disabled
                                                                                            value={review?.thirdActionPercentage}
                                                                                            onChange={(e) => {
                                                                                                let newData = [...deficiencies_data]
                                                                                                newData[index].firstActionPercentage = parseInt(e.target.value)
                                                                                                setDeficiencies_data(newData)
                                                                                            }} />
                                                                                    </Grid>
                                                                                    <Grid size={{xs: 12}}>
                                                                                        <TextField hiddenLabel multiline fullWidth label="اقدام نهایی"
                                                                                            disabled
                                                                                            value={review?.thirdAction}
                                                                                            onChange={(e) => {
                                                                                                let newData = [...deficiencies_data]
                                                                                                newData[index].firstAction = e.target.value
                                                                                                setDeficiencies_data(newData)
                                                                                            }} />
                                                                                    </Grid>
                                                                                </Grid>
                                                                                <Grid size={{xs: 6}} container>
                                                                                    <Grid size={{xs: 12}}>
                                                                                        <TextField type="number" sx={{ width: "100px" }} label="درصد پیگیری"
                                                                                            value={review?.finalPercentage}
                                                                                            onChange={(e) => {
                                                                                                let newData = [...deficiencies_data]
                                                                                                newData[index].finalPercentage = parseInt(e.target.value)
                                                                                                setDeficiencies_data(newData)
                                                                                            }} />
                                                                                    </Grid>
                                                                                    <Grid size={{xs: 12}}>
                                                                                        <TextField hiddenLabel multiline fullWidth label="پیگیری نهایی"
                                                                                            value={review?.finalPercentageInspector}
                                                                                            onChange={(e) => {
                                                                                                let newData = [...deficiencies_data]
                                                                                                newData[index].finalPercentageInspector = e.target.value
                                                                                                setDeficiencies_data(newData)
                                                                                            }} />
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </Grid>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                )
                                                                )}

                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                </Grid>
                                                <Grid container size={{xs: 12}} spacing={2}>
                                                    <Grid size={{xs: 12}}>
                                                        <Typography variant="h6">
                                                            افزودن نارسائی
                                                        </Typography>
                                                    </Grid>
                                                    <Grid container size={{xs: 12}}>
                                                        <TableContainer component={Paper}>
                                                            <Table>
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell align="center" style={{ width: "5%" }}>ردیف</TableCell>
                                                                        <TableCell align="center" style={{ width: "43%" }}>شرح نارسایی (معیاب و نواقص) مشهود</TableCell>
                                                                        <TableCell align="center" style={{ width: "15%" }}>عیب/نقص</TableCell>
                                                                        <TableCell align="center" style={{ width: "32%" }}>اقدامات مرتبط با نارسائی ها</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {new_deficiencies_data.map((hosn: any, index: any) => (
                                                                        <TableRow
                                                                            key={index}
                                                                        >
                                                                            <TableCell align="center" >
                                                                                {index + 1}
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <TextFieldComponent
                                                                                    defaultValue={hosn?.description}
                                                                                    globalSetter={(newValue: any) => setNewDeficiencies_data((prevState: any) => {
                                                                                        let newState = [...prevState]
                                                                                        newState[index].description = newValue
                                                                                        return newState
                                                                                    })}
                                                                                    multiline
                                                                                />
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <Autocomplete
                                                                                    size="small"
                                                                                    value={hosn?.type}
                                                                                    onChange={(event: any, newValue: any) => setNewDeficiencies_data((prevState: any) => {
                                                                                        let newState = [...prevState]
                                                                                        newState[index].type = newValue ? newValue : null
                                                                                        return newState
                                                                                    })}
                                                                                    options={[
                                                                                        "عیب",
                                                                                        "نقص",
                                                                                    ]}
                                                                                    getOptionLabel={(option: any) => option}
                                                                                    renderInput={(params: any) => <TextField {...params} hiddenLabel />}
                                                                                    isOptionEqualToValue={(option, value) => {
                                                                                        return `${option}` === `${value}`;
                                                                                    }}
                                                                                />
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <TextFieldComponent
                                                                                    defaultValue={hosn?.action}
                                                                                    globalSetter={(newValue: any) => setNewDeficiencies_data((prevState: any) => {
                                                                                        let newState = [...prevState]
                                                                                        newState[index].action = newValue
                                                                                        return newState
                                                                                    })}
                                                                                    multiline
                                                                                />
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                                </TableBody>
                                                            </Table>
                                                            <Box margin={"20px"} display={"flex"} flexDirection={"row"} justifyContent={"center"} alignItems={"centers"}>
                                                                <Button
                                                                    variant="contained"
                                                                    color="warning"
                                                                    onClick={() => {
                                                                        setNewDeficiencies_data((list: any) => {
                                                                            return [
                                                                                ...list,
                                                                                {
                                                                                    id: new Date().getTime(),
                                                                                    description: "",
                                                                                }
                                                                            ]
                                                                        })
                                                                    }}  >
                                                                    <Typography>
                                                                        افزودن
                                                                    </Typography>
                                                                </Button>
                                                            </Box>
                                                        </TableContainer>
                                                    </Grid>
                                                </Grid>
                                                <Grid size={{xs: 12}} display={"flex"} justifyContent={'center'} alignItems={'center'}>
                                                    <Button variant="contained" onClick={() => saveDeficiencies(deficiencies_data)}>ذخیره</Button>
                                                </Grid>
                                            </Grid>
                                            :
                                            selectedStep == 2 ?
                                                <Grid container spacing={3}>
                                                    <Grid size={{xs: 12}} display={"flex"} justifyContent={'center'} alignItems={'center'}>
                                                        <Typography textAlign={'center'} variant="h6" marginBottom={"10px"}>
                                                            پیشنهاد های مصوب
                                                        </Typography>
                                                    </Grid>
                                                    <Grid size={{xs: 12}}>
                                                        <TableContainer component={Paper} sx={{ minWidth: "1200px" }}>
                                                            <Table>
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell align="center">عنوان</TableCell>
                                                                        <TableCell align="center" style={{ width: "10%" }}>تعداد کل</TableCell>
                                                                        <TableCell align="center" style={{ width: "10%" }}>تعداد رفع شده</TableCell>
                                                                        <TableCell align="center" style={{ width: "10%" }}>درصد رفع شده بر حسب</TableCell>
                                                                        <TableCell align="center" style={{ width: "10%" }}>میانگین درصد نهایی رفع</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    <TableRow>
                                                                        <TableCell align="center">
                                                                            {
                                                                                inspectionData?.organizationUnitName
                                                                            }
                                                                        </TableCell>
                                                                        <TableCell align="center">
                                                                            {
                                                                                appsug_data?.length
                                                                            }
                                                                        </TableCell>

                                                                        <TableCell align="center">
                                                                            {
                                                                                appsug_data?.filter((item: any) => parseInt(item?.thirdActionPercentage) == 100)?.length
                                                                            }
                                                                        </TableCell>

                                                                        <TableCell align="center">
                                                                            {
                                                                                (appsug_data?.filter((item: any) => parseInt(item?.thirdActionPercentage) == 100)?.length / appsug_data?.length * 100)?.toFixed(2)
                                                                            }
                                                                        </TableCell>
                                                                        <TableCell align="center">
                                                                            {
                                                                                (appsug_data?.reduce((acc: any, curr: any) => acc + curr?.thirdActionPercentage, 0) / appsug_data?.length)?.toFixed(2)
                                                                            }
                                                                        </TableCell>

                                                                    </TableRow>


                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>
                                                    </Grid>
                                                    <Grid size={{xs: 12}}>
                                                        <TableContainer component={Paper} sx={{ minWidth: "1200px" }}>
                                                            <Table>
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell align="center" style={{ width: "10%" }}>حوزه</TableCell>
                                                                        <TableCell align="center" style={{ width: "8%" }}>پیشنهاد مصوب</TableCell>
                                                                        <TableCell align="center" style={{ width: "55%" }}>درج نتیجه اقدام</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {appsug_data?.map((review: any, index: any) => (
                                                                        <TableRow
                                                                            key={index}
                                                                        >
                                                                            {
                                                                                <TableCell align="center"
                                                                                // rowSpan={item?.deficiencies?.length}
                                                                                >
                                                                                    {review?.approvedSuggestionReviewFieldName}
                                                                                </TableCell>
                                                                            }


                                                                            <TableCell align="center">
                                                                                <Typography variant="body2" >
                                                                                    {review?.approvedSuggestionDescription}
                                                                                </Typography>
                                                                            </TableCell>
                                                                            <TableCell align="center">
                                                                                <Grid container>
                                                                                    <Grid size={{xs: 6}} container>
                                                                                        <Grid size={{xs: 12}}>
                                                                                            <TextField type="number" sx={{ width: "100px" }} label="درصد رفع نهایی"
                                                                                                disabled
                                                                                                value={review?.thirdActionPercentage}
                                                                                                onChange={(e) => {
                                                                                                    let newData = [...appsug_data]
                                                                                                    newData[index].firstActionPercentage = parseInt(e.target.value)
                                                                                                    setAppsug_data(newData)
                                                                                                }} />
                                                                                        </Grid>
                                                                                        <Grid size={{xs: 12}}>
                                                                                            <TextField hiddenLabel multiline fullWidth label="اقدام نهایی"
                                                                                                disabled
                                                                                                value={review?.thirdAction}
                                                                                                onChange={(e) => {
                                                                                                    let newData = [...appsug_data]
                                                                                                    newData[index].firstAction = e.target.value
                                                                                                    setAppsug_data(newData)
                                                                                                }} />
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                    <Grid size={{xs: 6}} container>
                                                                                        <Grid size={{xs: 12}}>
                                                                                            <TextField type="number" sx={{ width: "100px" }} label="درصد پیگیری"
                                                                                                value={review?.finalPercentage}
                                                                                                onChange={(e) => {
                                                                                                    let newData = [...appsug_data]
                                                                                                    newData[index].finalPercentage = parseInt(e.target.value)
                                                                                                    setAppsug_data(newData)
                                                                                                }} />
                                                                                        </Grid>
                                                                                        <Grid size={{xs: 12}}>
                                                                                            <TextField hiddenLabel multiline fullWidth label="پیگیری نهایی"
                                                                                                value={review?.finalPercentageInspector}
                                                                                                onChange={(e) => {
                                                                                                    let newData = [...appsug_data]
                                                                                                    newData[index].finalPercentageInspector = e.target.value
                                                                                                    setAppsug_data(newData)
                                                                                                }} />
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    )
                                                                    )}

                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>
                                                    </Grid>
                                                    <Grid size={{xs: 12}} display={"flex"} justifyContent={'center'} alignItems={'center'}>
                                                        <Button variant="contained" onClick={() => saveApprovedSugestions(appsug_data)}>ذخیره</Button>
                                                    </Grid>
                                                </Grid>
                                                :
                                                <Grid container spacing={3}>
                                                    {/* <Grid item xs={12} display={"flex"} justifyContent={'center'} alignItems={'center'}>
                                                    <Typography textAlign={'center'} variant="h6" marginBottom={"10px"}>
                                                        نکات مشهوده (محاسن، معایب، نواقص)‌
                                                    </Typography>
                                                </Grid> */}
                                                    <Grid size={{xs: 12}}>
                                                        <TableContainer component={Paper} sx={{ minWidth: "1200px" }}>
                                                            <Table>
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell align="center" style={{ width: "5%" }}>ردیف</TableCell>
                                                                        <TableCell align="center" style={{ width: "7%" }}>نوع تشویق</TableCell>
                                                                        <TableCell align="center" style={{ width: "8%" }}>درجه</TableCell>
                                                                        <TableCell align="center" style={{ width: "20%" }}>نام و نام خانوادگی</TableCell>
                                                                        <TableCell align="center" style={{ width: "20%" }}>شغل سازماني</TableCell>
                                                                        <TableCell align="center" style={{ width: "10%" }}>شماره كارگزيني</TableCell>
                                                                        <TableCell align="center" style={{ width: "20%" }}>علت تشویق</TableCell>
                                                                        <TableCell align="center" style={{ width: "10%" }}>وضعیت اعمال</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {encouragement?.map((item: any, index: any) => (
                                                                        <TableRow
                                                                            key={index}
                                                                        >
                                                                            <TableCell align="center">
                                                                                {index + 1}
                                                                            </TableCell>
                                                                            <TableCell align="center">
                                                                                {item?.encouragementPunishment ? "تنبیه" : "تشویق"}
                                                                            </TableCell>

                                                                            <TableCell align="center">
                                                                                {item?.rank}
                                                                            </TableCell>
                                                                            <TableCell align="center">
                                                                                {item?.nameFamily}
                                                                            </TableCell>
                                                                            <TableCell align="center">
                                                                                {item?.post}
                                                                            </TableCell>
                                                                            <TableCell align="center">
                                                                                {item?.personNumber}
                                                                            </TableCell>
                                                                            <TableCell align="center">
                                                                                {item?.encouragementType}
                                                                            </TableCell>
                                                                            <TableCell align="center">
                                                                                <Checkbox />
                                                                            </TableCell>

                                                                        </TableRow>
                                                                    ))
                                                                    }
                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>
                                                    </Grid>
                                                    <Grid size={{xs: 12}} display={"flex"} justifyContent={'center'} alignItems={'center'}>
                                                        <Button variant="contained" onClick={() => saveApprovedSugestions(appsug_data)}>ذخیره</Button>
                                                    </Grid>
                                                </Grid>
                                }
                            </Grid>
                        </Box>
                    ) : null
    )
}

export default InspectorFollowup;