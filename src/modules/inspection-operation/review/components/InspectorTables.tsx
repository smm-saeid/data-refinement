import DisabledTextInput from "@/components/DisabledTextInput";
import MatnaPersonnelPicker from "@/components/MatnaPersonnelPicker";
import { useLegacyApi } from "@/hooks/useLegacyApi";
import { useSnackbar } from "@/hooks/useSnackbar";
import { ArrowForward, Delete } from "@mui/icons-material";
import { Box, Grid, Typography, Skeleton, Paper, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Chip, Dialog, Modal, Autocomplete } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";


const TextFieldComponent: React.FC<any> = (
    { label = "", defaultValue = "", multiline = false, type = "text", globalSetter }:
        { label: string, defaultValue: any, multiline: boolean, type: string, globalSetter: (x: any) => any }
) => {
    const [text, setText] = useState<any>(defaultValue)

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
                setText(type === 'number' ? parseFloat(event.target.value) : event.target.value)
            }}
            multiline={multiline}
            onBlur={() => globalSetter(text)}
        />
    )
}

const InspectorTables = () => {

    const navigate = useNavigate()

    const { reviewGroupId, inspectionId } = useParams();
    const legacyApi = useLegacyApi();
    const snackbar = useSnackbar();

    const [advantages, setAdvantages] = useState<any>([])
    const [deficiencies, setDeficiencies] = useState<any>([])
    const [encouragementsList, setEncouragementsList] = useState<any>([])
    const [punishmentList, setPunishmentList] = useState<any>([])
    const [analysis, setAnalysis] = useState({});
    const [personnelPickerIsOpenEnc, setPersonnelPickerIsOpenEnc] = useState(false);
    const [personnelPickerIsOpenPun, setPersonnelPickerIsOpenPun] = useState(false);


    const { mutate } = useMutation({
        mutationFn: legacyApi.request,
    });

    const [selectedRow, setSelectedRow] = useState<any>()

    const { data: reviewData, isLoading: reviewDataIsLoading } = useQuery<any, any, any>({
        queryKey: [`review-customize/find-by-review-group-inspection-for-fill?groupId=${reviewGroupId}&inspectionId=${inspectionId}`],
        queryFn: () => legacyApi.get(`review-customize/find-by-review-group-inspection-for-fill?groupId=${reviewGroupId}&inspectionId=${inspectionId}`),
        select: (res: any) => res?.data
    } as any);

    const { data, isLoading: dataIsLoading } = useQuery<any, any, any>({
        queryKey: [`review-customize/find-by-parameter-category?reviewGroupId=${reviewGroupId}&inspectionId=${inspectionId}`],
        queryFn: () => legacyApi.get(`review-customize/find-by-parameter-category?reviewGroupId=${reviewGroupId}&inspectionId=${inspectionId}`),
        select: (res: any) => res?.data,
    } as any);

    const { data: advantageData, isLoading: advantageIsLoading } = useQuery<any, any, any>({
        queryKey: [`/advantage/find-by-parameter?inspectionId=${inspectionId}&reviewGroupId=${reviewGroupId}`],
        queryFn: () => legacyApi.get(`/advantage/find-by-parameter?inspectionId=${inspectionId}&reviewGroupId=${reviewGroupId}`),
        select: (res: any) => res?.data,
    } as any);

    const { data: deficiencyData, isLoading: deficiencyIsLoading } = useQuery<any, any, any>({
        queryKey: [`/deficiency/find-by-parameter?inspectionId=${inspectionId}&reviewGroupId=${reviewGroupId}`],
        queryFn: () => legacyApi.get(`/deficiency/find-by-parameter?inspectionId=${inspectionId}&reviewGroupId=${reviewGroupId}`),
        select: (res: any) => res?.data,
    } as any);

    const { data: encouragementData, isLoading: encouragementIsLoading, refetch: refetchEncourage } = useQuery<any, any, any>({
        queryKey: [`/encouragement/find-by-parameter?inspectionId=${inspectionId}`],
        queryFn: () => legacyApi.get(`/encouragement/find-by-parameter?inspectionId=${inspectionId}`),
        select: (res: any) => res?.data,
    } as any);

    const { data: analysisinitialData, isLoading: analysisIsLoading } = useQuery<any, any, any>({
        queryKey: [`/analysis/find-by-inspection-review-group?inspectionId=${inspectionId}&reviewGroupId=${reviewGroupId}`],
        queryFn: () => legacyApi.get(`/analysis/find-by-inspection-review-group?inspectionId=${inspectionId}&reviewGroupId=${reviewGroupId}`),
        select: (res: any) => res?.data,
    } as any);

    const { data: initialInspected } = useQuery<any, any, any>({
        queryKey: [`person-speciality-review-group/find-by-inspection-review-group?reviewGroupId=${reviewGroupId}&inspectionId=${inspectionId}`],
        queryFn: () => legacyApi.get(`person-speciality-review-group/find-by-inspection-review-group?reviewGroupId=${reviewGroupId}&inspectionId=${inspectionId}`),
        select: (res: any) => res?.data
    } as any);

    useEffect(() => {
        setAnalysis(analysisinitialData ?? {});
    }, [analysisinitialData])

    useEffect(() => {
        if (!!encouragementData && encouragementData.length) {
            setEncouragementsList(encouragementData.filter((item: any) => item.encouragementPunishment == true))
            setPunishmentList(encouragementData.filter((item: any) => item.encouragementPunishment == false))
        }
    }, [encouragementData])

    useEffect(() => {

        if (!!data && !!advantageData && !!deficiencyData) {
            if (!!advantageData && advantageData.length)
                setAdvantages(advantageData)
            else
                if (!!data)
                    setAdvantages(data?.h)

            if (!!deficiencyData && deficiencyData.length)
                setDeficiencies(deficiencyData)
            else
                if (!!data)
                    setDeficiencies(data?.d)
        }
    }, [data, advantageData, deficiencyData])

    const saveReviews = (isfinal = false) => {
        mutate(
            {
                entity: `/advantage`,
                method: "post",
                data: advantages.map((advantage: any) => ({
                    reviewGroupId: reviewGroupId,
                    inspectionId: inspectionId,
                    id: !!advantageData && advantageData.length ? advantage.id : undefined,
                    reviewCustomizeId: !!advantageData && advantageData.length ? advantage.reviewCustomizeId : advantage.id,
                    description: advantage.description,
                }))
            } as any,
            {
                onSuccess: (res: any) => {
                    snackbar("با موفقیت ذخیره شد.", "success", 5000);
                },
            }
        );
        mutate(
            {
                entity: `/deficiency`,
                method: "post",
                data: deficiencies.map((deficiency: any) => ({
                    reviewGroupId: reviewGroupId,
                    inspectionId: inspectionId,
                    id: !!deficiencyData && deficiencyData.length ? deficiency.id : undefined,
                    reviewCustomizeId: !!deficiencyData && deficiencyData.length ? deficiency.reviewCustomizeId : deficiency.id,
                    description: deficiency.description,
                    type: deficiency.type,
                    action: deficiency.action,
                }))
            } as any,
            {
                onSuccess: (res: any) => {
                    if (res.code !== 200) {
                        snackbar("با موفقیت ذخیره شد.", "success", 5000);
                    } else {

                    }
                },
            }
        );
        mutate(
            {
                entity: `/encouragement`,
                method: "post",
                data: [...encouragementsList, ...punishmentList].map((enc: any) => ({
                    ...enc,
                    reviewGroupId: reviewGroupId,
                    inspectionId: inspectionId,
                    id: typeof enc.id == 'number' ? null : enc.id,
                }))
            } as any,
            {
                onSuccess: (res: any) => {
                    if (res.code !== 200) {
                        snackbar("با موفقیت ذخیره شد.", "success", 5000);
                    } else {

                    }
                },
            }
        );
        mutate(
            {
                entity: `/analysis`,
                method: "post",
                data: { ...analysis,
                    reviewGroupNewId: reviewGroupId,
                    inspectionId: inspectionId,
                }
            } as any,
            {
                onSuccess: (res: any) => {
                    snackbar("با موفقیت ذخیره شد.", "success", 5000);
                },
            }
        );
        if (isfinal) {
            mutate(
                {
                    entity: `/person-speciality-review-group/change-status`,
                    method: "post",
                    data: { 
                        inspectionId: inspectionId,
                        reviewGroupId: reviewGroupId,
                        status: "DONE"
                    }
                } as any,
                {
                    onSuccess: (_: any) => {
                        navigate("/operation/inspector-reviews");
                    },
                }
            );
        }
    }

    const deleteEnPun = (id: any) => {
        if (typeof id === "number") {
            setPunishmentList((list: any) => list.filter((item: any, idx: any) => item.id != id))
            setEncouragementsList((list: any) => list.filter((item: any, idx: any) => item.id != id))
            snackbar("با موفقیت حذف شد.", "success", 5000);
        } else {
            mutate(
                {
                    entity: `/encouragement/${id}`,
                    method: "delete",
                } as any,
                {
                    onSuccess: (res: any) => {
                        if (res.data !== 200) {
                            refetchEncourage();
                        }
                    },
                }
            );
        }
    }

    return (
        <Grid container spacing={2} marginRight={2}>
            <Grid size={{ xs: 12 }}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 4 }}>
                        <Button onClick={() => navigate(-1)} variant="contained">
                            <ArrowForward />
                            بازگشت
                        </Button>
                    </Grid>
                    <Grid size={{ xs: 4 }} textAlign={'center'}>
                        <Paper sx={{ padding: "5px" }} elevation={3}>
                            <Typography fontWeight={500} variant="h6">
                                بازبینه {reviewData?.reviewGroupName}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>
            {reviewDataIsLoading ? <Skeleton height={200} width={'100%'} /> :
                <Grid container size={{ xs: 12 }} spacing={2}>
                    <Grid size={{ xs: 12, md: 4 }} container spacing={3}>
                        <Grid size={{ xs: 12 }}>
                            مشخصات بازرس:
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <DisabledTextInput label={'نام و نام خانوادگی'} value={reviewData?.name + " " + reviewData?.family} />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <DisabledTextInput label={'کد پرسنلی'} value={reviewData?.personNumber} />
                        </Grid>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }} container spacing={3} alignContent={'start'}>
                        <Grid size={{ xs: 12 }}>
                            مشخصات بازرسی شونده:
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <DisabledTextInput label={'نام یگان'} value={reviewData?.organizationName} />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <DisabledTextInput label={'بازدید شونده'} value={initialInspected?.inspectedFirstPersonNumber ? (initialInspected?.inspectedFirstName + " " + initialInspected?.inspectedFirstFamily) : "انتخاب نشده"} />
                        </Grid>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }} container spacing={3}>
                        <Grid size={{ xs: 12 }}>
                            مشخصات بازبینه:
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <DisabledTextInput label={'نام'} value={reviewData?.reviewGroupName} />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <DisabledTextInput label={'حوزه'} value={reviewData?.fieldName} />
                        </Grid>
                    </Grid>
                </Grid>
            }
            <Grid container sx={{ width: "100%" }} spacing={2}>
                <Grid container size={{ xs: 12 }} spacing={2}>
                    <Grid size={{ xs: 12 }}>
                        <Typography variant="h6">
                            اقدامات و فعالیت ها (محاسن)
                        </Typography>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center" style={{ width: "5%" }}>ردیف</TableCell>
                                        <TableCell align="center" style={{ width: "80%" }}>شرح حسن</TableCell>
                                        <TableCell align="center" style={{ width: "10%" }}>پرسش مربوطه</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        (advantageIsLoading || dataIsLoading) ?
                                            [...Array(3).keys()].map(i => {
                                                return <TableRow key={i}>
                                                    <TableCell>
                                                        <Skeleton />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Skeleton />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Skeleton />
                                                    </TableCell>
                                                </TableRow>
                                            }) :
                                            advantages?.map((hosn: any, index: any) => (
                                                <TableRow
                                                    key={index}
                                                >
                                                    <TableCell align="center" >
                                                        {index + 1}
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextFieldComponent
                                                            defaultValue={hosn?.description}
                                                            globalSetter={(newValue: any) => setAdvantages((prevState: any) => {
                                                                let newState = [...prevState]
                                                                newState[index].description = newValue
                                                                return newState
                                                            })}
                                                            multiline
                                                        />
                                                    </TableCell>
                                                    <TableCell align="center" >
                                                        <Button size="small" onClick={() => { setSelectedRow(hosn); }}>
                                                            مشاهده
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container sx={{ width: "100%" }} spacing={2}>
                <Grid container size={{ xs: 12 }} spacing={2}>
                    <Grid size={{ xs: 12 }}>
                        <Typography variant="h6">
                            نارسائی ها (معایب و نواقص) در حین بازرسی
                        </Typography>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center" style={{ width: "5%" }}>ردیف</TableCell>
                                        <TableCell align="center" style={{ width: "43%" }}>شرح نارسایی (معیاب و نواقص) مشهود</TableCell>
                                        <TableCell align="center" style={{ width: "15%" }}>عیب/نقص</TableCell>
                                        <TableCell align="center" style={{ width: "32%" }}>اقدامات مرتبط با نارسائی ها</TableCell>
                                        <TableCell align="center" style={{ width: "5%" }}>پرسش مربوطه</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        (deficiencyIsLoading || dataIsLoading) ?
                                            [...Array(3).keys()].map(i => {
                                                return <TableRow key={i}>
                                                    <TableCell>
                                                        <Skeleton />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Skeleton />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Skeleton />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Skeleton />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Skeleton />
                                                    </TableCell>
                                                </TableRow>
                                            }) :
                                            deficiencies?.map((hosn: any, index: any) => (
                                                <TableRow
                                                    key={index}
                                                >
                                                    <TableCell align="center" >
                                                        {index + 1}
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextFieldComponent
                                                            defaultValue={hosn?.description}
                                                            globalSetter={(newValue: any) => setDeficiencies((prevState: any) => {
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
                                                            onChange={(event: any, newValue: any) => setDeficiencies((prevState: any) => {
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
                                                            globalSetter={(newValue: any) => setDeficiencies((prevState: any) => {
                                                                let newState = [...prevState]
                                                                newState[index].action = newValue
                                                                return newState
                                                            })}
                                                            multiline
                                                        />
                                                    </TableCell>
                                                    <TableCell align="center" >
                                                        <Button size="small" onClick={() => { setSelectedRow(hosn) }}>
                                                            مشاهده
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </Grid>
            <Grid size={{ xs: 12 }} />
            <Grid container size={{ xs: 12 }} spacing={2}>
                <Grid size={{ xs: 12 }}>
                    <Typography variant="h6">
                        تشویقات کارکنان
                    </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center"></TableCell>
                                    <TableCell align="center">ردیف</TableCell>
                                    <TableCell align="center">درجه</TableCell>
                                    <TableCell align="center">نام و نام خانوادگی</TableCell>
                                    <TableCell align="center">شماره کارگزینی</TableCell>
                                    <TableCell align="center">شغل سازمانی</TableCell>
                                    <TableCell align="center">علت</TableCell>
                                    <TableCell align="center">نوع تشویق</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    encouragementIsLoading ?
                                        [...Array(3).keys()].map(i => {
                                            return <TableRow key={i}>
                                                <TableCell>
                                                    <Skeleton />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton />
                                                </TableCell>
                                            </TableRow>
                                        }) :
                                        encouragementsList.map((enc: any, index: any) => (
                                            <TableRow
                                                key={index}
                                            >
                                                <TableCell>
                                                    <IconButton
                                                        color="error"
                                                        onClick={() => {
                                                            deleteEnPun(enc.id)
                                                        }}>
                                                        <Delete />
                                                    </IconButton>
                                                </TableCell>
                                                <TableCell align="center">
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell>
                                                    {enc?.rank}
                                                </TableCell>
                                                <TableCell>
                                                    {enc?.nameFamily}
                                                </TableCell>
                                                <TableCell>
                                                    {enc?.personNumber}
                                                </TableCell>
                                                <TableCell>
                                                    {enc?.post}
                                                </TableCell>
                                                <TableCell>
                                                    <TextFieldComponent
                                                        defaultValue={enc?.encouragementCause}
                                                        globalSetter={(newValue: any) => setEncouragementsList((prevState: any) => {
                                                            let newState = [...prevState]
                                                            newState[index].encouragementCause = newValue
                                                            return newState
                                                        })}
                                                        multiline
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <TextFieldComponent
                                                        defaultValue={enc?.encouragementType}
                                                        globalSetter={(newValue: any) => setEncouragementsList((prevState: any) => {
                                                            let newState = [...prevState]
                                                            newState[index].encouragementType = newValue
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
                                onClick={() => {
                                   setPersonnelPickerIsOpenEnc(true);
                                }}  >
                                <Typography>
                                    افزودن
                                </Typography>
                            </Button>
                        </Box>
                    </TableContainer>
                </Grid>
            </Grid>
            <Grid container size={{ xs: 12 }} spacing={2}>
                <Grid size={{ xs: 12 }}>
                    <Typography variant="h6">
                        تنبیه کارکنان
                    </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center"></TableCell>
                                    <TableCell align="center">ردیف</TableCell>
                                    <TableCell align="center">درجه</TableCell>
                                    <TableCell align="center">نام و نام خانوادگی</TableCell>
                                    <TableCell align="center">شماره کارگزینی</TableCell>
                                    <TableCell align="center">شغل سازمانی</TableCell>
                                    <TableCell align="center">علت</TableCell>
                                    <TableCell align="center">نوع تنبیه</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    encouragementIsLoading ?
                                        [...Array(3).keys()].map(i => {
                                            return <TableRow key={i}>
                                                <TableCell>
                                                    <Skeleton />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton />
                                                </TableCell>
                                            </TableRow>
                                        }) :
                                        punishmentList.map((pun: any, index: any) => (
                                            <TableRow
                                                key={index}
                                            >
                                                <TableCell>
                                                    <IconButton
                                                        color="error"
                                                        onClick={() => {
                                                            deleteEnPun(pun.id)
                                                        }}>
                                                        <Delete />
                                                    </IconButton>
                                                </TableCell>
                                                <TableCell align="center">
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell>
                                                    {pun?.rank}
                                                </TableCell>
                                                <TableCell>
                                                    {pun?.nameFamily}
                                                </TableCell>
                                                <TableCell>
                                                    {pun?.personNumber}
                                                </TableCell>
                                                <TableCell>
                                                    {pun?.post}
                                                </TableCell>
                                                <TableCell>
                                                    <TextFieldComponent
                                                        defaultValue={pun?.encouragementCause}
                                                        globalSetter={(newValue: any) => setPunishmentList((prevState: any) => {
                                                            let newState = [...prevState]
                                                            newState[index].encouragementCause = newValue
                                                            return newState
                                                        })}
                                                        multiline
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <TextFieldComponent
                                                        defaultValue={pun?.encouragementType}
                                                        globalSetter={(newValue: any) => setPunishmentList((prevState: any) => {
                                                            let newState = [...prevState]
                                                            newState[index].encouragementType = newValue
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
                                onClick={() => {
                                   setPersonnelPickerIsOpenPun(true);
                                }}  >
                                <Typography>
                                    افزودن
                                </Typography>
                            </Button>
                        </Box>
                    </TableContainer>
                </Grid>
            </Grid>

            <Grid size={{ xs: 12 }} />
            <Typography variant="h6">
                تجزیه و تحلیل
            </Typography>


            <TextField
                multiline
                value={analysis['parsing']}
                fullWidth
                onChange={(e) => {
                    setAnalysis(oldData => {
                        return { ...oldData, 'parsing': e.target.value }
                    })
                }}
            />
            <Typography variant="h6">
                نتیجه
            </Typography>
            <TextField
                multiline
                value={analysis['result']}
                fullWidth
                onChange={(e) => {
                    setAnalysis(oldData => {
                        return { ...oldData, 'result': e.target.value }
                    })
                }}
            />
            <Typography variant="h6">
                پیشنهاد
            </Typography>
            <TextField
                multiline
                value={analysis['suggerstion']}
                fullWidth
                onChange={(e) => {
                    setAnalysis(oldData => {
                        return { ...oldData, 'suggerstion': e.target.value }
                    })
                }}
            />
            <Grid size={{ xs: 12 }} container spacing={2}>
                <Grid>
                    <Button
                        color="warning"
                        variant="contained"
                        onClick={() => {
                            saveReviews()
                        }}>
                        <Typography>
                            ذخیره
                        </Typography>
                    </Button>
                </Grid>
                <Grid>
                    <Button
                        color="success"
                        variant="contained"
                        onClick={() => {
                            saveReviews(true)
                        }}>
                        <Typography>
                            ثبت نهایی
                        </Typography>
                    </Button>
                </Grid>
                <Grid size={{ xs: 12 }}></Grid>
            </Grid>
            <Grid size={{ xs: 12 }} />
            <Modal open={!!selectedRow} onClose={() => setSelectedRow(null)}>
                <Fragment>
                    <Dialog fullWidth maxWidth="lg" open={!!selectedRow} onClose={() => setSelectedRow(null)}>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ width: "70%" }}>پرسش</TableCell>
                                        <TableCell style={{ width: "10%" }}>ضریب</TableCell>
                                        <TableCell style={{ width: "10%" }}>میزان عملکرد</TableCell>
                                        <TableCell style={{ width: "10%" }}>اثر بخشی</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>{selectedRow?.question}</TableCell>
                                        <TableCell>{selectedRow?.factor}</TableCell>
                                        <TableCell>{selectedRow?.grade}</TableCell>
                                        <TableCell>{selectedRow?.effectiveness}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Dialog>
                </Fragment>
            </Modal>
            <Dialog
                fullWidth
                maxWidth={'lg'}
                open={personnelPickerIsOpenEnc || personnelPickerIsOpenPun}
                onClose={() => {setPersonnelPickerIsOpenEnc(false); setPersonnelPickerIsOpenPun(false);}}
            >
                <MatnaPersonnelPicker
                    orgId={reviewData?.organizationId}
                    onPersonnelSelect={row => {
                        if (personnelPickerIsOpenEnc) {
                                    setEncouragementsList((list: any) => {
                                        return [
                                            ...list,
                                            {
                                                id: new Date().getTime(),
                                                encouragementPunishment: true,
                                                rank: row.degree,
                                                post: row.jobTitle,
                                                personNumber: row.personnelCode,
                                                nameFamily: row.firstName + " " + row.lastName
                                            }
                                        ]
                                    })
                        } else if (personnelPickerIsOpenPun) {
                                    setPunishmentList((list: any) => {
                                        return [
                                            ...list,
                                            {
                                                id: new Date().getTime(),
                                                encouragementPunishment: false,
                                                rank: row.degree,
                                                post: row.jobTitle,
                                                personNumber: row.personnelCode,
                                                nameFamily: row.firstName + " " + row.lastName
                                            }
                                        ]
                                    })
                        }
                        setPersonnelPickerIsOpenEnc(false);
                        setPersonnelPickerIsOpenPun(false);
                    }}
                />
            </Dialog>
        </Grid>
    );
}

export default InspectorTables;