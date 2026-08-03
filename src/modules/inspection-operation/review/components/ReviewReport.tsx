import DisabledTextInput from "@/components/DisabledTextInput";
import { useLegacyApi } from "@/hooks/useLegacyApi";
import { useSnackbar } from "@/hooks/useSnackbar";
import { ArrowForward, Delete } from "@mui/icons-material";
import { Box, Grid, Typography, Skeleton, Paper, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Chip, Dialog, Modal, Autocomplete } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { Fragment, useEffect, useState } from "react";
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
            disabled
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

const ReviewCard = React.memo(function ReviewCard({
    review,
    index,
    onQuestionChange,
    onEffectivenessChange,
    onGradeChange,
    onFactorChange,
    onDelete,
}: any) {

    const snackbar = useSnackbar();

    useEffect(() => {
        if (!!review.grade && review.grade < 75 && review.effectiveness >= 4) {
            snackbar('نمره اثربخشی سوالاتی که نمره میزان عملکرد آن کمتر از ۷۵ است الزاما بایستی کمتر از ۴ باشد.', "error", 3000);
            onEffectivenessChange(index, 3);
        }
    }, [review.grade, review.effectiveness])

    return (
        <TableRow
            key={index}
        >

            <TableCell align="center">
                {index + 1}
            </TableCell>

            <TableCell align="center">
                <TextField
                    label={'متن سوال'}
                    fullWidth
                    required
                    multiline
                    rows={3}
                    size="medium"
                    value={review.question}
                    disabled
                />
            </TableCell>
            <TableCell align="center">
                <TextField
                    type="number"
                    fullWidth
                    required
                    value={review.factor}
                    inputProps={{
                        min: 1,
                        max: 10,
                        step: 0.5,
                    }}
                    size="small"
                    disabled
                />
            </TableCell>
            <TableCell align="center">
                <TextField
                    type="number"
                    fullWidth
                    required
                    value={review.grade}
                    inputProps={{
                        min: 0,
                        max: 100,
                        step: 10,
                    }}
                    size="small"
                    disabled
                />
            </TableCell>

            <TableCell align="center">
                {
                    review.grade > 90 ?
                        <Chip label="حسن" color="success" />
                        : review.grade > 75 ?
                            <Chip label="انجام وظیفه" color="info" />
                            : review.grade > 0 ?
                                <Chip label="عیب/نقص" color="error" />
                                : <Chip label="نمره نا معتبر" />
                }
            </TableCell>
            <TableCell align="center">
                <TextField
                    type="number"
                    fullWidth
                    required
                    disabled
                    value={review.effectiveness}
                    inputProps={{
                        min: 0,
                        max: 5,
                        step: 1,
                    }}
                    size="small"
                />
            </TableCell>
        </TableRow>
    );
});

const ReviewReport = () => {

    const navigate = useNavigate()

    const { reviewGroupId, inspectionId } = useParams();
    const legacyApi = useLegacyApi();
    const snackbar = useSnackbar();

    const [advantages, setAdvantages] = useState<any>([])
    const [deficiencies, setDeficiencies] = useState<any>([])
    const [encouragementsList, setEncouragementsList] = useState<any>([])
    const [punishmentList, setPunishmentList] = useState<any>([])
    const [analysis, setAnalysis] = useState({});

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

    const { data: encouragementData, isLoading: encouragementIsLoading } = useQuery<any, any, any>({
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
                data: {
                    ...analysis,
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
                                گزارش بازبینه {reviewData?.reviewGroupName}
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
                            <DisabledTextInput label={'نام'} value={reviewData?.organizationName} />
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
            {reviewDataIsLoading ?
                <Skeleton height={500} width={'100%'} /> :

                <Grid size={{ xs: 12 }}>
                    <Grid size={{ xs: 12 }} margin={2}>
                        <Typography variant="h6">
                            پرسشنامه
                        </Typography>
                    </Grid>
                    <TableContainer component={Paper} sx={{ minWidth: "1200px" }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center" style={{ width: "5%" }}>ردیف</TableCell>
                                    <TableCell align="center" style={{ width: "50%" }}>پرسش</TableCell>
                                    <TableCell align="center" style={{ width: "10%" }}>ضریب</TableCell>
                                    <TableCell align="center" style={{ width: "10%" }}>میزان عملکرد</TableCell>
                                    <TableCell align="center" style={{ width: "10%" }}>نتیجه</TableCell>
                                    <TableCell align="center" style={{ width: "10%" }}>اثر بخشی</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {reviewData.reviewCustomizeEditDtos.map((review: any, index: any) => (
                                    <ReviewCard
                                        review={review}
                                        index={index}
                                        onQuestionChange={null}
                                        onEffectivenessChange={null}
                                        onGradeChange={null}
                                        onDelete={(_) => { }}
                                        onFactorChange={null}
                                    />
                                ))}
                                <TableRow>
                                    <TableCell align="center" colSpan={3}>
                                        نتایج کلی
                                    </TableCell>
                                    <TableCell align="center">
                                        {(reviewData.reviewCustomizeEditDtos.reduce((acc: any, curr: any) => acc + curr.factor, 0))}
                                    </TableCell>
                                    <TableCell align="center">
                                        {(reviewData.reviewCustomizeEditDtos.reduce((acc: any, curr: any) => acc + curr.grade, 0) / reviewData?.reviewCustomizeEditDtos.length).toFixed(2)}
                                    </TableCell>
                                    <TableCell align="center">
                                    </TableCell>
                                    <TableCell align="center">
                                        {(reviewData.reviewCustomizeEditDtos.reduce((acc: any, curr: any) => acc + curr.effectiveness, 0) / reviewData?.reviewCustomizeEditDtos.length).toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
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
                                                            disabled
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
                                                </TableCell>
                                                <TableCell align="center">
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell>
                                                    <TextFieldComponent
                                                        defaultValue={enc?.rank}
                                                        globalSetter={(newValue: any) => setEncouragementsList((prevState: any) => {
                                                            let newState = [...prevState]
                                                            newState[index].rank = newValue
                                                            return newState
                                                        })}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <TextFieldComponent
                                                        defaultValue={enc?.nameFamily}
                                                        globalSetter={(newValue: any) => setEncouragementsList((prevState: any) => {
                                                            let newState = [...prevState]
                                                            newState[index].nameFamily = newValue
                                                            return newState
                                                        })}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <TextFieldComponent
                                                        defaultValue={enc?.personNumber}
                                                        globalSetter={(newValue: any) => setEncouragementsList((prevState: any) => {
                                                            let newState = [...prevState]
                                                            newState[index].personNumber = newValue
                                                            return newState
                                                        })}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <TextFieldComponent
                                                        defaultValue={enc?.post}
                                                        globalSetter={(newValue: any) => setEncouragementsList((prevState: any) => {
                                                            let newState = [...prevState]
                                                            newState[index].post = newValue
                                                            return newState
                                                        })}
                                                    />
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
                                                </TableCell>
                                                <TableCell align="center">
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell>
                                                    <TextFieldComponent
                                                        defaultValue={pun?.rank}
                                                        globalSetter={(newValue: any) => setPunishmentList((prevState: any) => {
                                                            let newState = [...prevState]
                                                            newState[index].rank = newValue
                                                            return newState
                                                        })}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <TextFieldComponent
                                                        defaultValue={pun?.nameFamily}
                                                        globalSetter={(newValue: any) => setPunishmentList((prevState: any) => {
                                                            let newState = [...prevState]
                                                            newState[index].nameFamily = newValue
                                                            return newState
                                                        })}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <TextFieldComponent
                                                        defaultValue={pun?.personNumber}
                                                        globalSetter={(newValue: any) => setPunishmentList((prevState: any) => {
                                                            let newState = [...prevState]
                                                            newState[index].personNumber = newValue
                                                            return newState
                                                        })}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <TextFieldComponent
                                                        defaultValue={pun?.post}
                                                        globalSetter={(newValue: any) => setPunishmentList((prevState: any) => {
                                                            let newState = [...prevState]
                                                            newState[index].post = newValue
                                                            return newState
                                                        })}
                                                    />
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
                    </TableContainer>
                </Grid>
            </Grid>

            <Grid size={{ xs: 12 }} />
            <Typography variant="h6">
                تجزیه و تحلیل
            </Typography>


            <TextField
                multiline
                disabled
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
                disabled
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
                disabled
                value={analysis['suggerstion']}
                fullWidth
                onChange={(e) => {
                    setAnalysis(oldData => {
                        return { ...oldData, 'suggerstion': e.target.value }
                    })
                }}
            />
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
        </Grid>
    );
}

export default ReviewReport;