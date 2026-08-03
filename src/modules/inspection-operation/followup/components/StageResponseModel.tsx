
import React, { useEffect, useState } from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Slider,
    Typography,
    Box,
    Alert,
} from "@mui/material";

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (
        description: string,
        progress: number
    ) => void;

    stageNumber: 1 | 2 | 3;
    previousTotal: number;

    initialDescription?: string;
    initialProgress?: number;

    isRejected?: boolean;
    loading?: boolean;
}

export const StageResponseModal: React.FC<Props> = ({
    open,
    onClose,
    onSubmit,
    stageNumber,
    previousTotal,
    initialDescription = "",
    initialProgress = 0,
    isRejected = false,
    loading = false,
}) => {

    const [description, setDescription] =
        useState(initialDescription);

    const [progress, setProgress] =
        useState(initialProgress);

    const [error, setError] =
        useState<string | null>(null);

    const remaining = 100 - previousTotal;

    useEffect(() => {

        if (!open) return;

        setDescription(initialDescription);

        if (stageNumber === 3) {
            setProgress(remaining);
        } else {
            setProgress(initialProgress);
        }

        setError(null);

    }, [
        open,
        stageNumber,
        initialDescription,
        initialProgress,
        remaining
    ]);

    const handleSubmit = () => {

        if (!description.trim()) {
            setError("توضیح الزامی است");
            return;
        }

        if (progress <= 0) {
            setError("درصد نامعتبر است");
            return;
        }

        if (progress > remaining) {
            setError(
                `حداکثر مقدار مجاز ${remaining}٪ است`
            );

            return;
        }

        if (
            previousTotal + progress > 100
        ) {
            setError(
                "مجموع درصدها نمی‌تواند بیشتر از 100 باشد"
            );

            return;
        }

        onSubmit(description, progress);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >

            <DialogTitle>
                مرحله {stageNumber}
            </DialogTitle>

            <DialogContent>

                {isRejected && (
                    <Alert
                        severity="warning"
                        sx={{ mb: 2 }}
                    >
                        این مرحله رد شده و نیاز به اصلاح دارد
                    </Alert>
                )}

                {error && (
                    <Alert
                        severity="error"
                        sx={{ mb: 2 }}
                    >
                        {error}
                    </Alert>
                )}

                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="توضیحات"

                    value={description}

                    onChange={(e) =>
                        setDescription(e.target.value)
                    }

                    disabled={loading}
                />

                <Box sx={{ mt: 4 }}>

                    <Typography gutterBottom>
                        درصد این مرحله: {progress}٪
                    </Typography>

                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        باقی‌مانده مجاز: {remaining}٪
                    </Typography>

                    <Slider
                        value={progress}
                        min={0}
                        max={remaining}
                        step={1}

                        disabled={
                            loading ||
                            stageNumber === 3
                        }

                        onChange={(_, value) =>
                            setProgress(value as number)
                        }

                        valueLabelDisplay="auto"
                    />
                </Box>

                <Box sx={{ mt: 2 }}>

                    <Typography variant="body2">
                        مجموع قبلی: {previousTotal}٪
                    </Typography>

                    <Typography variant="body2">
                        مجموع جدید:
                        {previousTotal + progress}٪
                    </Typography>

                </Box>

            </DialogContent>

            <DialogActions>

                <Button
                    onClick={onClose}
                    disabled={loading}
                >
                    انصراف
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    ثبت
                </Button>

            </DialogActions>

        </Dialog>
    );
};
