import DisabledTextInput from "@/components/DisabledTextInput";
import MatnaPersonnelPicker from "@/components/MatnaPersonnelPicker";
import { useLegacyApi } from "@/hooks/useLegacyApi";
import { useSnackbar } from "@/hooks/useSnackbar";
import { ArrowForward, Delete } from "@mui/icons-material";
import { Box, Grid, Typography, Skeleton, Paper, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Chip, Dialog, Stack } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";


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
                    onChange={event => {
                        onQuestionChange(index, event.target.value);
                    }}
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
                    onChange={event => {
                        onFactorChange(index, Number(event.target.value));
                    }}
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
                    onChange={event => {
                        onGradeChange(index, Number(event.target.value));
                    }}
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
                    disabled={review.grade == null}
                    value={review.effectiveness}
                    inputProps={{
                        min: 0,
                        max: 5,
                        step: 1,
                    }}
                    size="small"
                    onChange={event => {
                        onEffectivenessChange(index, Number(event.target.value));
                    }}
                />
            </TableCell>
        </TableRow>
    );
});


const InspectorReview = () => {

    const navigate = useNavigate()
    const legacyApi = useLegacyApi();
    const snackbar = useSnackbar();
    const [personnelPickerIsOpen, setPersonnelPickerIsOpen] = useState(false);

    const { inspectionId, reviewGroupId } = useParams();

    const [reviews, setReviews] = useState([]);
    const { mutate } = useMutation({
        mutationFn: legacyApi.request,
    });

    const [inspected, setInspected] = useState(null);

    const { data, status, isLoading } = useQuery<any, any, any>({
        queryKey: [`review-customize/find-by-review-group-inspection-for-fill?groupId=${reviewGroupId}&inspectionId=${inspectionId}`],
        queryFn: () => legacyApi.get(`review-customize/find-by-review-group-inspection-for-fill?groupId=${reviewGroupId}&inspectionId=${inspectionId}`),
        select: (res: any) => res?.data
    } as any);

    const { data: initialInspected } = useQuery<any, any, any>({
        queryKey: [`person-speciality-review-group/find-by-inspection-review-group?reviewGroupId=${reviewGroupId}&inspectionId=${inspectionId}`],
        queryFn: () => legacyApi.get(`person-speciality-review-group/find-by-inspection-review-group?reviewGroupId=${reviewGroupId}&inspectionId=${inspectionId}`),
        select: (res: any) => res?.data
    } as any);

    useEffect(() => {
        if (data?.reviewCustomizeEditDtos != null) {
            setReviews(data?.reviewCustomizeEditDtos);
        }
    }, [data])

    useEffect(() => {
        if (initialInspected != null && initialInspected.inspectedFirstPersonNumber != null) {
            setInspected({inspectedPersonNumber: initialInspected.inspectedFirstPersonNumber, inspectedName: initialInspected.inspectedFirstName ,inspectedFamily: initialInspected.inspectedFirstFamily});
        }
    }, [initialInspected])

    const onQuestionChange = useCallback((index, value) => {
        setReviews(oldList => {
            if (index >= 0) {
                const newList = [...oldList];
                newList[index] = { ...newList[index] };
                newList[index].question = value;
                return newList;
            } else {
                return oldList;
            }
        });
    }, []);

    const onGradeChange = useCallback((index, value) => {
        const max = 100;
        setReviews(oldList => {
            if (index >= 0) {
                const newList = [...oldList];
                newList[index] = { ...newList[index] };
                newList[index].grade = Math.min(value, max);
                return newList;
            } else {
                return oldList;
            }
        });
    }, []);


    const onFactorChange = useCallback((index, value) => {
        const max = 10;
        setReviews(oldList => {
            if (index >= 0) {
                const newList = [...oldList];
                newList[index] = { ...newList[index] };
                newList[index].factor = Math.min(value, max);
                return newList;
            } else {
                return oldList;
            }
        });
    }, []);

    const onEffectivenessChange = useCallback((index, value) => {
        const max = 5;
        setReviews(oldList => {
            if (index >= 0) {
                const newList = [...oldList];
                newList[index] = { ...newList[index] };
                newList[index].effectiveness = Math.min(value, max);
                return newList;
            } else {
                return oldList;
            }
        });
    }, []);

    const saveReviews = (final: boolean) => {
        if (final) {
            if (reviews.reduce((p, c) => { return p + c.factor; }, 0) != 100) {
                snackbar("مجموع ضرایب باید دقیقا 100 باشد.", "error", 3000);
                return;
            }
            for (const review of reviews) {
                let index = 1;
                if (!review.grade || review.grade <= 0 || !review.effectiveness || review.effectiveness <= 0) {
                    snackbar(`سوال شماره ${index} کامل نشده است. لطفا پس از تکمیل آن دوباره اقدام کنید.`, "error", 3000);
                    return;
                }
                index += 1;
            }
        }
        mutate(
            {
                entity: `review-customize/fill-by-inspector`,
                method: "post",
                data: {
                    reviewCustomizeEditDtos: reviews.map(r => {
                        if (typeof r.id === "number") {
                            return { ...r, id: null };
                        }
                        else {
                            return r;
                        }
                    }
                    ), reviewGroupStatus: final ? "ADVANTAGE_DEFICIENCY" : "GRADING",
                    inspectorPersonNumber: data?.personNumber,
                    inspectedFirstPersonNumber: inspected?.inspectedPersonNumber,
                }

            } as any,
            {
                onSuccess: (res: any) => {
                    snackbar("با موفقیت ذخیره شد.", "success", 5000);
                    if (final) {
                        navigate(-1);
                    }
                },
            }
        );
    }

    return (
        <Box paddingRight={4}>
            <Box sx={{ margin: "20px" }}>
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
                                بازبینه {data?.reviewGroupName}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
            <Grid container sx={{ width: "100%" }} spacing={2}>
                {isLoading ? <Skeleton height={200} width={'100%'} /> :
                    <Grid container size={{ xs: 12 }}>
                        <Grid container size={{ xs: 12 }}>
                            <Grid size={{ xs: 12, md: 4 }} container spacing={3}>
                                <Grid size={{ xs: 12 }}>
                                    مشخصات بازرس:
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <DisabledTextInput label={'نام و نام خانوادگی'} value={data?.name + " " + data?.family} />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <DisabledTextInput label={'کد پرسنلی'} value={data?.personNumber} />
                                </Grid>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }} container spacing={3} alignContent={'start'}>
                                <Grid size={{ xs: 12 }}>
                                    مشخصات بازرسی شونده:
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <DisabledTextInput label={'نام یگان'} value={data?.organizationName} />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <Stack direction={'row'} spacing={2}>
                                        <DisabledTextInput label={'بازدید شونده'} value={inspected ? (inspected?.inspectedName + " " + inspected?.inspectedFamily) : "انتخاب نشده"} />
                                        <Button onClick={() => setPersonnelPickerIsOpen(true)} variant="contained">انتخاب</Button>
                                    </Stack>
                                </Grid>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }} container spacing={3}>
                                <Grid size={{ xs: 12 }}>
                                    مشخصات بازبینه:
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <DisabledTextInput label={'نام'} value={data?.reviewGroupName} />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <DisabledTextInput label={'حوزه'} value={data?.fieldName} />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                }
                {isLoading ? (
                    <Skeleton height={500} width={'100%'} />
                ) : status === "success" ? (
                    <Grid size={{ xs: 12 }}>
                        <Button onClick={() => {
                            setReviews(oldList => {
                                return oldList.map(value => {return {...value, grade: Math.floor((Math.random() * 25)) + 70, effectiveness: Math.floor((Math.random() * 4)) + 1}})
                            });
                        }}>Random Fill</Button>
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
                                    {reviews.map((review: any, index: any) => (
                                        <ReviewCard
                                            review={review}
                                            index={index}
                                            onQuestionChange={onQuestionChange}
                                            onEffectivenessChange={onEffectivenessChange}
                                            onGradeChange={onGradeChange}
                                            onDelete={(_) => { }}
                                            onFactorChange={onFactorChange}
                                        />
                                    ))}
                                    <TableRow>
                                    <TableCell align="center" style={{ width: "5%" }}></TableCell>
                                        <TableCell align="center" style={{ width: "50%" }}>نتایج کلی</TableCell>
                                        <TableCell align="center" style={{ width: "10%" }}>{(reviews.reduce((acc: any, curr: any) => acc + curr.factor, 0))}</TableCell>
                                        <TableCell align="center" style={{ width: "10%" }}>{(reviews.reduce((acc: any, curr: any) => acc + curr.grade, 0) / reviews?.length).toFixed(2)}</TableCell>
                                        <TableCell align="center" style={{ width: "10%" }}></TableCell>
                                        <TableCell align="center" style={{ width: "10%" }}>{(reviews.reduce((acc: any, curr: any) => acc + curr.effectiveness, 0) / reviews?.length).toFixed(2)}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>

                        </TableContainer>
                    </Grid>
                ) : null}
                <Grid size={{ xs: 12 }} container spacing={2}>
                    <Grid>
                        <Button
                            color="warning"
                            variant="contained"
                            disabled={isLoading}
                            onClick={() => {
                                saveReviews(false)
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
                            disabled={isLoading}
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
            </Grid>
            <Dialog
                fullWidth
                maxWidth={'lg'}
                open={personnelPickerIsOpen}
                onClose={() => setPersonnelPickerIsOpen(false)}
            >
                <MatnaPersonnelPicker
                    orgId={data?.organizationId}
                    onPersonnelSelect={row => {
                        setInspected({ inspectedFamily: row.lastName, inspectedName: row.firstName, inspectedPersonNumber: row.personnelCode });
                        setPersonnelPickerIsOpen(false);
                    }}
                />
            </Dialog>
        </Box >
    );
}

export default InspectorReview;