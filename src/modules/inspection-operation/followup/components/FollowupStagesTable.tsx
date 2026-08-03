import React, { useState } from "react";
import {
    Table, TableHead, TableRow, TableCell, TableBody, Button,
    Typography, Chip, Box
} from "@mui/material";
import type { Deficiency, Stage } from "../Types.ts";
import { StageResponseModal } from "./StageResponseModel.tsx";
import { ConversationHistoryModal } from "./ConversationHistoryModal.tsx";

interface Props {
    deficiencies: Deficiency[];
    updateStage: (
        deficiencyId: string,
        stageNumber: 1 | 2 | 3,
        description: string,
        progress: number
    ) => void;
    loading?: boolean;
}

export const FollowupStagesTable: React.FC<Props> = ({
                                                         deficiencies,
                                                         updateStage,
                                                         loading = false,
                                                     }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedDeficiency, setSelectedDeficiency] = useState<Deficiency | null>(null);
    const [selectedStage, setSelectedStage] = useState<Stage | null>(null);

    const [historyModalOpen, setHistoryModalOpen] = useState(false);
    const [historyDeficiency, setHistoryDeficiency] = useState<Deficiency | null>(null);

    const getPreviousTotal = (deficiency: Deficiency, currentStageNumber: number): number => {
        return deficiency.stages
            .filter(s => s.stageNumber < currentStageNumber)
            .reduce((acc, s) => acc + s.progress, 0);
    };

    const getButtonStatus = (stage: Stage, index: number, stages: Stage[]) => {
        const isFirst = index === 0;
        const prevStage = index > 0 ? stages[index - 1] : null;
        const prevStageApproved = prevStage?.status === "APPROVED";
        const currentStatus = stage.status;

        let canSend = false;
        let buttonText = `مرحله ${stage.stageNumber}`;
        let buttonColor: "primary" | "success" | "warning" | "error" | "secondary" | "inherit" = "primary";

        if (currentStatus === "APPROVED") {
            buttonText = `✅ مرحله ${stage.stageNumber}`;
            buttonColor = "success";
            canSend = false;
        }
        else if (currentStatus === "PENDING_APPROVAL") {
            buttonText = `⏳ مرحله ${stage.stageNumber}`;
            buttonColor = "warning";
            canSend = false;
        }
        else if (currentStatus === "REJECTED") {
            buttonText = `✗ مرحله ${stage.stageNumber} (تلاش مجدد)`;
            buttonColor = "error";
            canSend = true;
        }
        else if (currentStatus === "NOT_SENT") {
            if (isFirst) {
                buttonText = `مرحله ${stage.stageNumber}`;
                buttonColor = "primary";
                canSend = true;
            } else {
                if (prevStageApproved) {
                    buttonText = `مرحله ${stage.stageNumber}`;
                    buttonColor = "primary";
                    canSend = true;
                } else {
                    buttonText = `مرحله ${stage.stageNumber} (منتظر تأیید)`;
                    buttonColor = "secondary";
                    canSend = false;
                }
            }
        }

        return { canSend, buttonText, buttonColor, disabled: !canSend };
    };

    const handleOpenModal = (deficiency: Deficiency, stage: Stage) => {
        setSelectedDeficiency(deficiency);
        setSelectedStage(stage);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedDeficiency(null);
        setSelectedStage(null);
    };

    const handleSubmit = async (description: string, progress: number) => {
        if (!selectedDeficiency || !selectedStage) return;

        await updateStage(
            selectedDeficiency.id,
            selectedStage.stageNumber,
            description,
            progress
        );

        handleCloseModal();
    };

    const handleViewHistory = (deficiency: Deficiency) => {
        setHistoryDeficiency(deficiency);
        setHistoryModalOpen(true);
    };

    const getOverallStatus = (deficiency: Deficiency) => {
        const stages = deficiency.stages;
        const allApproved = stages.every(s => s.status === "APPROVED");
        const hasPending = stages.some(s => s.status === "PENDING_APPROVAL");
        const hasRejected = stages.some(s => s.status === "REJECTED");

        if (allApproved) {
            return { label: "تکمیل شده", color: "success" as const };
        } else if (hasPending) {
            return { label: "در انتظار تأیید", color: "warning" as const };
        } else if (hasRejected) {
            return { label: "نیاز به اصلاح", color: "error" as const };
        } else {
            return { label: "در حال انجام", color: "info" as const };
        }
    };

    if (loading) {
        return (
            <Box sx={{ p: 4, textAlign: "center" }}>
                <Typography>در حال بارگذاری...</Typography>
            </Box>
        );
    }

    if (deficiencies.length === 0) {
        return (
            <Box sx={{ p: 4, textAlign: "center" }}>
                <Typography color="text.secondary">
                    هیچ نقصی یافت نشد
                </Typography>
            </Box>
        );
    }


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

    const getButtonTextByType = (typeReport: string | null, stageNumber: number, defaultText: string) => {
        const typeMap: Record<string, Record<number, string>> = {
            DEFICIENCY: {
                1: "شروع عیب",
                2: "مرحله دوم عیب",
                3: "مرحله آخر عیب"
            },
            FLAW: {
                1: "شروع نقص",
                2: "مرحله دوم نقص",
                3: "مرحله آخر نقص"
            },
            APPROVAL: {
                1: "شروع مصوبه",
                2: "مرحله دوم مصوبه",
                3: "مرحله آخر مصوبه"
            }
        };

        const typeText = typeMap[typeReport as keyof typeof typeMap];
        if (typeText && typeText[stageNumber]) {
            return typeText[stageNumber];
        }
        return defaultText;
    };

    return (
        <>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>عنوان </TableCell>
                        <TableCell>نوع</TableCell>
                        <TableCell>مراحل</TableCell>
                        <TableCell>جمع درصد</TableCell>
                        <TableCell>وضعیت کلی</TableCell>
                        <TableCell>عملیات</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {deficiencies.map((deficiency) => {
                        const totalProgress = Math.min(deficiency.stages.reduce((acc, s) => acc + s.progress, 0), 100);
                        const overallStatus = getOverallStatus(deficiency);

                        return (
                            <TableRow key={deficiency.id}>
                                <TableCell>{deficiency.text}</TableCell>

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


                                <TableCell>
                                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                        {deficiency.stages.map((stage, index) => {
                                            const { canSend, buttonText, buttonColor, disabled } =
                                                getButtonStatus(stage, index, deficiency.stages);

                                            // دریافت متن دکمه بر اساس نوع و مرحله
                                            const customButtonText = getButtonTextByType(
                                                deficiency.typeReport,
                                                stage.stageNumber,
                                                buttonText
                                            );

                                            return (
                                                <Button
                                                    key={stage.stageNumber}
                                                    size="small"
                                                    variant="contained"
                                                    color={buttonColor}
                                                    disabled={disabled}
                                                    onClick={() => {
                                                        if (canSend) {
                                                            handleOpenModal(deficiency, stage);
                                                        }
                                                    }}
                                                    sx={{ minWidth: "120px" }}
                                                >
                                                    {customButtonText}
                                                </Button>
                                            );
                                        })}
                                    </Box>
                                </TableCell>

                                <TableCell>
                                    <Typography fontWeight="bold">
                                        {totalProgress}%
                                    </Typography>
                                </TableCell>

                                <TableCell>
                                    <Chip
                                        label={totalProgress === 100 ?  overallStatus.label = "تکمیل شده" : overallStatus.label}
                                        color={ totalProgress=== 100 ? overallStatus.color ="success" : overallStatus.color}
                                        size="small"
                                    />


                                </TableCell>

                                <TableCell>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color="info"
                                        onClick={() => handleViewHistory(deficiency)}
                                    >
                                        📋 تاریخچه گفتگو
                                    </Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>

            {selectedDeficiency && selectedStage && (
                <StageResponseModal
                    open={modalOpen}
                    onClose={handleCloseModal}
                    onSubmit={handleSubmit}
                    stageNumber={selectedStage.stageNumber}
                    previousTotal={getPreviousTotal(selectedDeficiency, selectedStage.stageNumber)}
                    initialDescription={selectedStage.description}
                    initialProgress={selectedStage.progress}
                    isRejected={selectedStage.status === "REJECTED"}
                />
            )}

            <ConversationHistoryModal
                open={historyModalOpen}
                onClose={() => setHistoryModalOpen(false)}
                deficiency={historyDeficiency}
            />
        </>
    );
};