import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Chip,
    Box,
    Paper,
    Alert,
    Divider,
    Avatar,
    Stack
} from "@mui/material";
import type { Deficiency, Stage } from "../Types.ts";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import PersonIcon from "@mui/icons-material/Person";
import EngineeringIcon from "@mui/icons-material/Engineering";

interface ConversationHistoryModalProps {
    open: boolean;
    onClose: () => void;
    deficiency: Deficiency | null;
}
const getStatusIcon = (status: string) => {
    switch (status) {
        case "APPROVED": return <CheckCircleIcon fontSize="small" />;
        case "REJECTED": return <ErrorIcon fontSize="small" />;
        case "PENDING_APPROVAL": return <HourglassEmptyIcon fontSize="small" />;
        default: return null;
    }
};

const changetopersian = (typeReport: string) => {
    switch (typeReport) {
        case "DEFICIENCY": return "عیب";
        case "FLAW": return "نقص";
        case "APPROVAL": return "مصوبه";
        default: return "";
    }
};

const ConversationMessage: React.FC<{
    stage: Stage;
}> = ({ stage }) => {

    const isUser = stage.responseNumber % 2 === 1;
    const isInspector = !isUser;

    const senderInfo = {
        name: isUser ? "کاربر" : "بازرس",
        avatar: isUser ? <PersonIcon /> : <EngineeringIcon />,
        color: isUser ? "primary" : "secondary",
        direction: isUser ? "right" : "left" as const
    };

    const getMessageStatus = () => {
        if (isInspector) {
            if (stage.status === "APPROVED") {
                return { text: "تأیید شده", color: "success" as const };
            } else if (stage.status === "REJECTED") {
                return { text: "رد شده", color: "error" as const };
            } else if (stage.status === "PENDING_APPROVAL") {
                return { text: "در انتظار تأیید", color: "warning" as const };
            }
        } else {
            if (stage.status === "APPROVED") {
                return { text: "تأیید شده توسط بازرس", color: "success" as const };
            } else if (stage.status === "REJECTED") {
                return { text: "رد شده توسط بازرس", color: "error" as const };
            } else if (stage.status === "PENDING_APPROVAL") {
                return { text: "در انتظار بررسی بازرس", color: "warning" as const };
            }
        }
        return { text: "ارسال نشده", color: "default" as const };
    };

    const messageStatus = getMessageStatus();

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: senderInfo.direction === "right" ? "row-reverse" : "row",
                mb: 2.5,
                gap: 1.5
            }}
        >
            <Avatar sx={{ bgcolor: senderInfo.color === "primary" ? "#1976d2" : "#9c27b0" }}>
                {senderInfo.avatar}
            </Avatar>

            <Paper
                elevation={1}
                sx={{
                    maxWidth: "70%",
                    minWidth: "200px",
                    p: 2,
                    bgcolor: isInspector && stage.status === "PENDING_APPROVAL"
                        ? "#fff3e0"
                        : isInspector && stage.status === "APPROVED"
                            ? "#e8f5e9"
                            : isInspector && stage.status === "REJECTED"
                                ? "#ffebee"
                                : isUser && stage.status === "PENDING_APPROVAL"
                                    ? "#e3f2fd"
                                    : "#f5f5f5",
                    borderRadius: senderInfo.direction === "right"
                        ? "16px 4px 16px 16px"
                        : "4px 16px 16px 16px",
                    position: "relative",
                    border: isInspector && stage.status === "PENDING_APPROVAL"
                        ? "1px dashed #ff9800"
                        : "none"
                }}
            >
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="subtitle2" fontWeight="bold" color={`${senderInfo.color}.main`}>
                        {senderInfo.name}
                    </Typography>
                    <Chip
                        label={messageStatus.text}
                        color={messageStatus.color}
                        size="small"
                        icon={getStatusIcon(stage.status) as any}
                        sx={{ height: 24, fontSize: "0.7rem" }}
                    />
                </Box>

                <Typography variant="body2" sx={{ mb: 1.5, wordBreak: "break-word", lineHeight: 1.6 }}>
                    {stage.description || "متن پیام ثبت نشده"}
                </Typography>

                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" color="text.secondary">
                        درصد پیشرفت: {stage.progress}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        مرحله {stage.stageNumber}
                    </Typography>
                </Box>

                {stage.rejectReason && (
                    <Alert severity="error" sx={{ mt: 2, p: 1 }} icon={<ErrorIcon fontSize="small" />}>
                        <Typography variant="caption" fontWeight="bold">
                            دلیل رد: {stage.rejectReason}
                        </Typography>
                    </Alert>
                )}

                {isInspector && stage.status === "PENDING_APPROVAL" && (
                    <Box
                        sx={{
                            position: "absolute",
                            top: -8,
                            right: 8,
                            bgcolor: "#ff9800",
                            color: "white",
                            borderRadius: 1,
                            px: 1,
                            py: 0.5,
                            fontSize: "0.6rem"
                        }}
                    >
                        در انتظار تأیید
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export const ConversationHistoryModal: React.FC<ConversationHistoryModalProps> = ({
                                                                                      open,
                                                                                      onClose,
                                                                                      deficiency
                                                                                  }) => {
    if (!deficiency) return null;

    const totalProgress = Math.min(deficiency.stages.reduce((acc, s) => acc + s.progress, 0), 100);
    const completedStages = deficiency.stages.filter(s => s.status === "APPROVED").length;
    const pendingStages = deficiency.stages.filter(s => s.status === "PENDING_APPROVAL").length;
    const rejectedStages = deficiency.stages.filter(s => s.status === "REJECTED").length;
    const notSentStages = deficiency.stages.filter(s => s.status === "NOT_SENT").length;



    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
                    <Typography variant="h6" component="span">
                        📋 تاریخچه گفتگو: {deficiency.text}
                    </Typography>
                    <Chip
                        label={deficiency.status === "DONE" ? "✅ تکمیل شده" : "🔄 در حال انجام"}
                        color={deficiency.status === "DONE" ? "success" : "info"}
                        size="small"
                    />
                </Box>
            </DialogTitle>

            <DialogContent dividers>
                {/* اطلاعات پایه */}
                <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: "#f5f5f5", borderRadius: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                        نوع گزارش
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        {changetopersian(deficiency.typeReport || "")}
                    </Typography>

                    <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>
                        توضیحات نقص
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {deficiency.text}
                    </Typography>
                </Paper>

                {/* کارت‌های آماری */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        آمار کلی
                    </Typography>
                    <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                        <Paper sx={{ p: 1.5, flex: 1, textAlign: "center", bgcolor: "#e8f5e9" }}>
                            <Typography variant="h6" color="success.main">{completedStages}</Typography>
                            <Typography variant="caption">مرحله تأیید شده</Typography>
                        </Paper>
                        <Paper sx={{ p: 1.5, flex: 1, textAlign: "center", bgcolor: "#fff3e0" }}>
                            <Typography variant="h6" color="warning.main">{pendingStages}</Typography>
                            <Typography variant="caption">در انتظار تأیید</Typography>
                        </Paper>
                        <Paper sx={{ p: 1.5, flex: 1, textAlign: "center", bgcolor: "#ffebee" }}>
                            <Typography variant="h6" color="error.main">{rejectedStages}</Typography>
                            <Typography variant="caption">رد شده</Typography>
                        </Paper>
                        <Paper sx={{ p: 1.5, flex: 1, textAlign: "center", bgcolor: "#f5f5f5" }}>
                            <Typography variant="h6">{notSentStages}</Typography>
                            <Typography variant="caption">ارسال نشده</Typography>
                        </Paper>
                    </Stack>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="subtitle2">پیشرفت کلی</Typography>
                        <Typography variant="subtitle2" color="primary">
                            {totalProgress}%
                        </Typography>
                    </Box>
                    <Box sx={{ height: 8, bgcolor: "#e0e0e0", borderRadius: 4, overflow: "hidden" }}>
                        <Box
                            sx={{
                                width: `${totalProgress}%`,
                                height: "100%",
                                bgcolor: totalProgress === 100 ? "#4caf50" : "#2196f3",
                                borderRadius: 4
                            }}
                        />
                    </Box>
                </Box>

                <Divider sx={{ my: 2 }}>
                    <Chip label="تاریخچه پیام‌ها" size="small" />
                </Divider>
                <Box sx={{ maxHeight: 500, overflowY: "auto", p: 1 }}>
                    {deficiency.stages
                        .filter(stage => stage.status !== "NOT_SENT")
                        .map((stage) => (
                            <ConversationMessage
                                key={stage.stageNumber}
                                stage={stage}
                            />
                        ))}

                    {deficiency.stages.every(s => s.status === "NOT_SENT") && (
                        <Alert severity="info" sx={{ mt: 2 }}>
                            هنوز هیچ پیامی ارسال نشده است
                        </Alert>
                    )}
                </Box>


                {/* وضعیت نهایی */}
                {deficiency.status === "DONE" && (
                    <Alert severity="success" sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                            ✅ این نقص تکمیل شده است
                        </Typography>
                        <Typography variant="caption">
                            تمام مراحل تأیید شده و فرآیند با موفقیت به پایان رسیده است
                        </Typography>
                    </Alert>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} variant="contained" color="primary">
                    بستن
                </Button>
            </DialogActions>
        </Dialog>
    );
};