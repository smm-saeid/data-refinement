
import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import {
    Box, Paper, Typography, Button, Chip, Table, TableHead,
    TableRow, TableCell, TableBody, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, Alert,
    CircularProgress, LinearProgress
} from "@mui/material";
import { useApiQuery, useApiMutation } from "hooks/useApi";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { useApproveResponse } from "./hooks/useApproveStage.tsx";
import type { ResolutionResponse } from "./hooks/useResolutionResponses";
import { InspectorStatsCards } from "modules/inspection-operation/followup/components/InspectorStatsCards.tsx";
import InspectionApis from "modules/inspection-operation/api.ts";
import type {InspectionDetail} from "modules/inspection-operation/followup/Types.ts";
import {InspectionHeader} from "modules/inspection-operation/followup/components/InspectionHeader.tsx";


interface Deficiency {
    id: string;
    text: string;
    notificationDate: number;
    inspectionId: string;
    status: "PENDING" | "IN_PROGRESS" | "DONE";
    typeReport: "FLAW" | "DEFICIENCY" | "APPROVAL" | null;
    reviewCustomizeQuestionId: string | null;
}

interface ApiResponse<T> {
    organizationUnitCode: any;
    inspectionYear: any;
    annualPlanInspectionTitle:any;
    inspectionTypeName:any;
    name: string;
    organizationUnitName:string;
    data: T;
    status: number;
    message: string;
}

const changeSatusLable = (status: string) => {
    switch (status) {
        case "PENDING": return "در حال بررسی";
        case "IN_PROGRESS": return "در انتظار بررسی";
        case "COMPLETED": return "تکمیل شده";
        case "REJECTED": return "رد شده";
        case "DONE": return "تکمیل شده";
        default: return status || "-";
    }
};

const getStatusLabel = (status: string) => {
    switch (status) {
        case "IN_PROGRESS":
            return {
                label: "در انتظار بررسی",
                color: "warning" as const,
                icon: <HourglassEmptyIcon />,
            };
        case "REJECTED":
            return {
                label: "رد شده",
                color: "error" as const,
                icon: <ErrorIcon />,
            };
        case "COMPLETED":
            return {
                label: "پاسخ بالا تأیید شده",
                color: "success" as const,
                icon: <CheckCircleIcon />,
            };
        default:
            return {
                label: status,
                color: "default" as const,
                icon: null,
            };
    }
};

export default function InspectorDetails() {
    const { inspectionId } = useParams<{ inspectionId: string }>();
    const navigate = useNavigate();

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedResponse, setSelectedResponse] = useState<ResolutionResponse | null>(null);
    const [inspectorComment, setInspectorComment] = useState("");
    const [actionType, setActionType] = useState<"APPROVED" | "REJECTED">("APPROVED");
    const [allResponses, setAllResponses] = useState<ResolutionResponse[]>([]);
    const [loadingResponses, setLoadingResponses] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [openResponsesDialog, setOpenResponsesDialog] = useState(false);
    const [selectedDeficiency, setSelectedDeficiency] = useState<Deficiency | null>(null);
    const [openStatusDialog, setOpenStatusDialog] = useState(false);
    const [deficiencyToChange, setDeficiencyToChange] = useState<Deficiency | null>(null);

    const { data: deficienciesData, isLoading: deficienciesLoading, refetch: refetchDeficiencies } =
        useApiQuery<ApiResponse<Deficiency[]>>({
            url: `/inspection/resolution/${inspectionId}`,
            enabled: !!inspectionId,
        });

    const { data: infoData} = useApiQuery<ApiResponse<InspectionDetail>>({
        url: InspectionApis.FollowUp.infoResponse(inspectionId),
    });

    const datainfo = infoData?.data;

    const deficiencies = useMemo(() => {
        const data = deficienciesData?.data;
        if (!data || !Array.isArray(data)) {
            return [];
        }
        return data;
    }, [deficienciesData]);

    const piedata = useMemo(() => {
        return deficiencies;
    }, [deficiencies]);

    const approveResponse = useApproveResponse();

    const changeDeficiencyStatusMutation = useApiMutation({
        url: `http://192.180.8.237:8585/api/resolution-response`,
        method: "POST",
        onSuccess: () => {
            refetchDeficiencies();
            fetchAllResponses();
        },
    });

    const fetchAllResponses = async () => {
        if (!deficiencies.length) return;

        setLoadingResponses(true);
        setFetchError(null);

        try {
            const token = localStorage.getItem("token") || sessionStorage.getItem("token");
            if (!token) {
                setFetchError("توکن یافت نشد. لطفاً دوباره وارد شوید.");
                return;
            }

            const promises = deficiencies.map(async (def: Deficiency) => {
                try {
                    const response = await fetch(
                        `http://192.180.8.237:8585/api/resolution-response?resolution-id=${def.id}`,
                        {
                            method: "GET",
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                            },
                        }
                    );

                    if (!response.ok) return [];
                    const data = await response.json();
                    return data.data || [];
                } catch (error) {
                    console.error(`Error fetching responses for deficiency ${def.id}:`, error);
                    return [];
                }
            });

            const results = await Promise.all(promises);
            const flatResponses = results.flat();
            const validResponses = flatResponses.filter(
                (r: ResolutionResponse) => r.responseNumber >= 1 && r.responseNumber <= 6
            );

            setAllResponses(validResponses);
        } catch (error) {
            setFetchError("خطا در دریافت پاسخ‌ها");
        } finally {
            setLoadingResponses(false);
        }
    };

    useEffect(() => {
        if (deficiencies.length > 0) {
            fetchAllResponses();
        }
    }, [deficiencies]);

    const handleOpenApprove = (response: ResolutionResponse) => {
        setSelectedResponse(response);
        setActionType("APPROVED");
        setInspectorComment("");
        setOpenDialog(true);
    };

    const handleOpenReject = (response: ResolutionResponse) => {
        setSelectedResponse(response);
        setActionType("REJECTED");
        setInspectorComment("");
        setOpenDialog(true);
    };

    const handleSubmit = async () => {
        if (!selectedResponse) return;

        try {
            if (actionType === "APPROVED") {
                await approveResponse.mutateAsync({
                    id: selectedResponse.id,
                    resolutionId: selectedResponse.resolutionId,
                    response: inspectorComment,
                    responseNumber: selectedResponse.responseNumber + 1,
                    status: "COMPLETED",
                    progressPercentage: selectedResponse.progressPercentage,
                });
            } else {
                await approveResponse.mutateAsync({
                    id: selectedResponse.id,
                    resolutionId: selectedResponse.resolutionId,
                    responseNumber: selectedResponse.responseNumber + 1,
                    status: "REJECTED",
                    rejectedReason: inspectorComment,
                });
            }

            setOpenDialog(false);
            setSelectedResponse(null);
            setInspectorComment("");

            await fetchAllResponses();
            await refetchDeficiencies();

        } catch (error) {
            alert("خطا در ارسال درخواست. لطفاً دوباره تلاش کنید.");
        }
    };

    const handleOpenChangeStatus = (deficiency: Deficiency) => {
        setDeficiencyToChange(deficiency);
        setOpenStatusDialog(true);
    };

    const handleChangeStatus = async () => {
        if (!deficiencyToChange) return;

        const deficiencyResponses = getDeficiencyResponses(deficiencyToChange.id);
        const lastResponse = deficiencyResponses[deficiencyResponses.length - 1];

        if (!lastResponse) {
            alert("هیچ پاسخی برای این نقص یافت نشد");
            return;
        }

        try {
            await changeDeficiencyStatusMutation.mutateAsync({
                id: lastResponse.id,
                resolutionId: lastResponse.resolutionId,
                responseNumber: 6,
                status: "COMPLETED",
                progressPercentage: 100,
                response: " توسط بازرس تکمیل شد",
            });

            setOpenStatusDialog(false);
            setDeficiencyToChange(null);

            alert("وضعیت نقص با موفقیت به تکمیل شده تغییر یافت");

            await fetchAllResponses();
            await refetchDeficiencies();

        } catch (error) {
            console.error("خطا در تغییر وضعیت:", error);
            alert("خطا در تغییر وضعیت نقص. لطفاً دوباره تلاش کنید.");
        }
    };

    const getDeficiencyResponses = (deficiencyId: string) => {
        return allResponses
            .filter((r) => r.resolutionId === deficiencyId)
            .sort((a, b) => a.responseNumber - b.responseNumber);
    };

    const getLastProgressPercentage = (deficiencyId: string) => {
        const defResponses = getDeficiencyResponses(deficiencyId);
        if (defResponses.length === 0) return 0;
        const lastResponse = defResponses[defResponses.length - 1];
        return lastResponse.progressPercentage || 0;
    };

    const getCompletionStatus = (deficiencyId: string) => {
        const lastProgress = getLastProgressPercentage(deficiencyId);
        if (lastProgress >= 100) {
            return {
                label: "✓ تکمیل شده",
                color: "success" as const,
                isComplete: true
            };
        }
        return {
            label: `${lastProgress}%`,
            color: "primary" as const,
            isComplete: false
        };
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString("fa-IR");
    };

    const canChangeStatus = (deficiency: Deficiency) => {
        return deficiency.status !== "DONE";
    };

    const getTypeStyle = (typeReport: string) => {
        switch (typeReport) {
            case "DEFICIENCY":
                return {
                    label: "عیب",
                    bgcolor: "#ffebee",
                    color: "#c62828"
                };
            case "FLAW":
                return {
                    label: "نقص",
                    bgcolor: "#fff3e0",
                    color: "#ef6c00"
                };
            case "APPROVAL":
                return {
                    label: "مصوبه",
                    bgcolor: "#e8f5e9",
                    color: "#2e7d32"
                };
            default:
                return {
                    label: "",
                    bgcolor: "transparent",
                    color: "inherit"
                };
        }
    };

    if (deficienciesLoading || loadingResponses) {
        return (
            <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (fetchError) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">{fetchError}</Alert>
            </Box>
        );
    }

    if (!deficiencies || deficiencies.length === 0) {
        return (
            <Box sx={{ p: 3 }}>
                <Button
                    variant="outlined"
                    sx={{ mb: 3 }}
                    onClick={() => navigate("/operation/planning/followup/inspectorreviewtable")}
                >
                    بازگشت
                </Button>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                    بررسی پاسخ‌ها
                </Typography>
                <hr />
                <Alert severity="info" sx={{ mt: 2 }}>
هیچ نتیجه ای یافت نشد یا اتصال شبکه خود را چک کنید
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Button
                variant="outlined"
                sx={{ mb: 3 }}
                onClick={() => navigate("/operation/planning/followup/inspectorreviewtable")}
            >
                بازگشت
            </Button>


            <InspectionHeader infoData={datainfo} title={"جزیئات یگان"} />


            <Typography variant="h5" fontWeight={700} gutterBottom>
                بررسی پاسخ‌ها
            </Typography>
            <hr />
            <InspectorStatsCards deficiencies={piedata} />
            <Paper elevation={2}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>نقص</TableCell>
                            <TableCell>نوع</TableCell>
                            <TableCell>تاریخ ثبت نقص</TableCell>
                            <TableCell>وضعیت</TableCell>
                            <TableCell>تعداد پاسخ‌ها</TableCell>
                            <TableCell>آخرین درصد پیشرفت</TableCell>
                            <TableCell>عملیات</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {deficiencies.map((deficiency: Deficiency) => {
                            const deficiencyResponses = getDeficiencyResponses(deficiency.id);
                            const userResponsesCount = deficiencyResponses.filter(r => r.responseNumber % 2 === 1).length;
                            const lastProgress = getLastProgressPercentage(deficiency.id);
                            const completionStatus = getCompletionStatus(deficiency.id);
                            const canChange = canChangeStatus(deficiency);
                            const isDone = deficiency.status === "DONE";

                            return (
                                <TableRow key={deficiency.id} sx={{ bgcolor: isDone ? "#e8f5e9" : "transparent" }}>
                                    <TableCell>
                                        <Typography fontWeight="bold">{deficiency.text}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={getTypeStyle(deficiency.typeReport || "").label}
                                            size="small"
                                            variant="outlined"
                                            sx={{
                                                bgcolor: getTypeStyle(deficiency.typeReport || "").bgcolor,
                                                color: getTypeStyle(deficiency.typeReport || "").color,
                                                fontWeight: "bold"
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>{formatDate(deficiency.notificationDate)}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={changeSatusLable(deficiency.status)}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>{userResponsesCount} از 3</TableCell>
                                    <TableCell>
                                        <Box sx={{ minWidth: 120 }}>
                                            {completionStatus.isComplete ? (
                                                <Chip
                                                    label={completionStatus.label}
                                                    color={completionStatus.color}
                                                    size="small"
                                                    icon={<CheckCircleIcon />}
                                                    sx={{ fontWeight: "bold" }}
                                                />
                                            ) : (
                                                <Box>
                                                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {lastProgress}%
                                                        </Typography>
                                                    </Box>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={Math.min(lastProgress, 100)}
                                                        sx={{
                                                            height: 8,
                                                            borderRadius: 4,
                                                            bgcolor: "#e0e0e0",
                                                            '& .MuiLinearProgress-bar': {
                                                                bgcolor: lastProgress >= 100 ? "#4caf50" : "#2196f3",
                                                            }
                                                        }}
                                                    />
                                                </Box>
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={() => {
                                                    setSelectedDeficiency(deficiency);
                                                    setOpenResponsesDialog(true);
                                                }}
                                            >
                                                مشاهده پاسخ‌ها
                                            </Button>

                                            {canChange && !isDone && (
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    color="primary"
                                                    startIcon={<DoneAllIcon />}
                                                    onClick={() => handleOpenChangeStatus(deficiency)}
                                                    disabled={lastProgress === 100}
                                                >
                                                    تغییر وضعیت به تکمیل شده
                                                </Button>
                                            )}

                                            {isDone && (
                                                <Chip
                                                    label="✓ تکمیل شده"
                                                    color="success"
                                                    size="small"
                                                    icon={<CheckCircleIcon />}
                                                    sx={{ fontWeight: "bold" }}
                                                />
                                            )}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Paper>

            <Dialog open={openResponsesDialog} onClose={() => setOpenResponsesDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>پاسخ‌های نقص</DialogTitle>
                <DialogContent dividers>
                    {selectedDeficiency && getDeficiencyResponses(selectedDeficiency.id).map((response: ResolutionResponse, _index, array) => {
                        const statusInfo = getStatusLabel(response.status);
                        const isInspectorResponse = [1, 3, 5].includes(response.responseNumber);
                        const isUserResponse = [2, 4, 6].includes(response.responseNumber);

                        const hasNextResponse = array.some(r => r.responseNumber > response.responseNumber);
                        const isLastPending = !hasNextResponse && response.status === "IN_PROGRESS";

                        return (
                            <Paper key={response.id} elevation={1} sx={{ p: 3, mb: 2, borderRadius: 2, border: 1, borderColor: "divider" }}>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Chip
                                        label={isInspectorResponse ? "کاربر" : isUserResponse ? "بازرس" : `پاسخ ${response.responseNumber}`}
                                        color={isInspectorResponse ? "primary" : "secondary"}
                                        size="small"
                                    />
                                    {response.status === "COMPLETED" && (
                                        <Chip label={statusInfo.label} color={statusInfo.color} size="small" />
                                    )}
                                </Box>

                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    <strong>متن پاسخ:</strong> {response.response}
                                </Typography>

                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    درصد پیشرفت: {response.progressPercentage}%
                                </Typography>

                                {response.status === "PENDING" && response.rejectedReason && (
                                    <Alert severity="error" sx={{ mt: 2 }}>
                                        دلیل رد: {response.rejectedReason}
                                    </Alert>
                                )}

                                {isLastPending && isInspectorResponse && (
                                    <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            color="success"
                                            onClick={() => handleOpenApprove(response)}
                                            disabled={approveResponse.isPending}
                                        >
                                            تأیید
                                        </Button>
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            color="error"
                                            onClick={() => handleOpenReject(response)}
                                            disabled={approveResponse.isPending}
                                        >
                                            رد
                                        </Button>
                                    </Box>
                                )}

                                {hasNextResponse && response.status === "IN_PROGRESS" && (
                                    <Alert severity="info" sx={{ mt: 2 }}>
                                        پاسخ شما توسط {array.some(r => r.responseNumber > response.responseNumber && [2, 4, 6].includes(r.responseNumber)) ? "بازرس" : "کاربر"} ارسال شده است
                                    </Alert>
                                )}
                            </Paper>
                        );
                    })}

                    {selectedDeficiency && getDeficiencyResponses(selectedDeficiency.id).length === 0 && (
                        <Alert severity="warning">پاسخی ثبت نشده است</Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenResponsesDialog(false)}>بستن</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {actionType === "APPROVED" ? "تأیید پاسخ" : "رد پاسخ"}
                </DialogTitle>
                <DialogContent>
                    {selectedResponse && (
                        <>
                            <Alert severity="info" sx={{ mb: 3 }}>
                                <Typography><strong>متن پاسخ:</strong> {selectedResponse.response}</Typography>
                                <Typography mt={1}><strong>درصد پیشرفت:</strong> {selectedResponse.progressPercentage}%</Typography>
                            </Alert>

                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label={actionType === "APPROVED" ? "نظر بازرس (اختیاری)" : "دلیل رد"}
                                value={inspectorComment}
                                onChange={(e) => setInspectorComment(e.target.value)}
                                required={actionType === "REJECTED"}
                                placeholder={actionType === "REJECTED" ? "لطفاً دلیل رد را وارد کنید" : "نظر خود را وارد کنید..."}
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>انصراف</Button>
                    <Button
                        variant="contained"
                        color={actionType === "APPROVED" ? "success" : "error"}
                        onClick={handleSubmit}
                        disabled={approveResponse.isPending || (actionType === "REJECTED" && !inspectorComment)}
                    >
                        {approveResponse.isPending ? <CircularProgress size={24} /> : (actionType === "APPROVED" ? "تأیید" : "رد")}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openStatusDialog} onClose={() => setOpenStatusDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>تغییر وضعیت نقص</DialogTitle>
                <DialogContent>
                    <Alert severity="warning" sx={{ mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            آیا از تغییر وضعیت این نقص اطمینان دارید؟
                        </Typography>
                        <Typography>
                            <strong>نقص:</strong> {deficiencyToChange?.text}
                        </Typography>
                        <Typography>
                            <strong>وضعیت فعلی:</strong> {deficiencyToChange?.status === "DONE" ? "تکمیل شده" : deficiencyToChange?.status === "IN_PROGRESS" ? "در حال انجام" : "در انتظار"}
                        </Typography>
                        <Typography sx={{ mt: 2 }}>
                            <strong>وضعیت جدید:</strong> تکمیل شده
                        </Typography>
                    </Alert>
                    <Alert severity="info">
                        با تغییر وضعیت به "تکمیل شده"، این نقص در لیست نقص‌های تکمیل شده قرار می‌گیرد.
                    </Alert>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenStatusDialog(false)}>انصراف</Button>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleChangeStatus}
                        disabled={changeDeficiencyStatusMutation.isPending}
                        startIcon={<DoneAllIcon />}
                    >
                        {changeDeficiencyStatusMutation.isPending ? <CircularProgress size={24} /> : "تغییر وضعیت به تکمیل شده"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}