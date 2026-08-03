// import React, { useState } from "react";
// import {
//     Table, TableHead, TableRow, TableCell,
//     TableBody, Button, Dialog, DialogTitle,
//     DialogContent, DialogActions, TextField, Chip
// } from "@mui/material";
// import type { ResolutionResponse } from "../hooks/useResolutionResponses";
// import { useApiMutation } from "hooks/useApi";
//
// interface Props {
//     responses: ResolutionResponse[];
//     refresh: () => void;
// }
//
// export const InspectorReviewTable: React.FC<Props> = ({ responses, refresh }) => {
//
//     const [openReject, setOpenReject] = useState(false);
//     const [selectedId, setSelectedId] = useState<string | null>(null);
//     const [reason, setReason] = useState("");
//
//     const approveMutation = useApiMutation({
//         url: "/resolution-response/approve",
//         method: "POST",
//     });
//
//     const rejectMutation = useApiMutation({
//         url: "/resolution-response/reject",
//         method: "POST",
//     });
//
//     const handleApprove = async (id: string) => {
//         await approveMutation.mutateAsync({ responseId: id });
//         refresh();
//     };
//
//     const handleReject = async () => {
//         if (!selectedId) return;
//
//         await rejectMutation.mutateAsync({
//             responseId: selectedId,
//             reason,
//         });
//
//         setOpenReject(false);
//         setReason("");
//         refresh();
//     };
//
//     const getStatusLabel = (status: string) => {
//         switch (status) {
//             case "IN_PROGRESS":
//                 return { label: "در انتظار تایید", color: "warning" };
//             case "APPROVED":
//                 return { label: "تایید شده", color: "success" };
//             case "REJECTED":
//                 return { label: "رد شده", color: "error" };
//             default:
//                 return { label: status, color: "default" };
//         }
//     };
//
//     return (
//         <>
//             <Table>
//                 <TableHead>
//                     <TableRow>
//                         <TableCell>مرحله</TableCell>
//                         <TableCell>پیام کاربر</TableCell>
//                         <TableCell>درصد</TableCell>
//                         <TableCell>وضعیت</TableCell>
//                         <TableCell>عملیات</TableCell>
//                         <TableCell>علت رد</TableCell>
//                     </TableRow>
//                 </TableHead>
//
//                 <TableBody>
//                     {responses.map(r => {
//
//                         const statusInfo = getStatusLabel(r.status);
//
//                         return (
//                             <TableRow key={r.id}>
//                                 <TableCell>{r.responseNumber}</TableCell>
//                                 <TableCell>{r.response}</TableCell>
//                                 <TableCell>{r.progressPercentage}%</TableCell>
//
//                                 <TableCell>
//                                     <Chip
//                                         label={statusInfo.label}
//                                         color={statusInfo.color as any}
//                                         size="small"
//                                     />
//                                 </TableCell>
//
//                                 <TableCell>
//                                     {r.status === "IN_PROGRESS" && (
//                                         <>
//                                             <Button
//                                                 color="success"
//                                                 variant="contained"
//                                                 size="small"
//                                                 sx={{ mr: 1 }}
//                                                 onClick={() => handleApprove(r.id)}
//                                             >
//                                                 تایید
//                                             </Button>
//
//                                             <Button
//                                                 color="error"
//                                                 variant="outlined"
//                                                 size="small"
//                                                 onClick={() => {
//                                                     setSelectedId(r.id);
//                                                     setOpenReject(true);
//                                                 }}
//                                             >
//                                                 رد
//                                             </Button>
//                                         </>
//                                     )}
//                                 </TableCell>
//
//                                 <TableCell>
//                                     {r.rejectedReason ?? "-"}
//                                 </TableCell>
//
//                             </TableRow>
//                         );
//                     })}
//                 </TableBody>
//             </Table>
//
//             <Dialog open={openReject} onClose={() => setOpenReject(false)}>
//                 <DialogTitle>علت رد</DialogTitle>
//                 <DialogContent>
//                     <TextField
//                         fullWidth
//                         multiline
//                         rows={3}
//                         value={reason}
//                         onChange={(e) => setReason(e.target.value)}
//                     />
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={() => setOpenReject(false)}>انصراف</Button>
//                     <Button
//                         color="error"
//                         variant="contained"
//                         onClick={handleReject}
//                     >
//                         ثبت رد
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </>
//     );
// };
//
// import React, { useState } from "react";
// import {
//     Table, TableHead, TableRow, TableCell,
//     TableBody, Button, Dialog, DialogTitle,
//     DialogContent, DialogActions, TextField, Chip
// } from "@mui/material";
// import type { ResolutionResponse } from "../hooks/useResolutionResponses";
// import { useApiMutation } from "hooks/useApi";
// import { ConversationHistoryModal } from "./ConversationHistoryModal";
// import type {Deficiency} from "modules/inspection-operation/followup/Types.ts";
//
// // تبدیل پاسخ‌ها به فرمت Deficiency برای مودال تاریخچه
// // const convertToDeficiency = (responses: ResolutionResponse[]) => {
// //     if (responses.length === 0) return null;
// //
// //     // پیدا کردن resolutionId از اولین پاسخ
// //     const resolutionId = responses[0]?.resolutionId || "";
// //
// //     // ایجاد stages بر اساس پاسخ‌ها
// //     const stages = responses.map((r, index) => ({
// //         stageNumber: Math.ceil(r.responseNumber / 2) as 1 | 2 | 3,
// //         responseNumber: r.responseNumber,
// //         description: r.response || "",
// //         progress: r.progressPercentage || 0,
// //         status: r.status === "COMPLETED" ? "APPROVED"
// //             : r.status === "PENDING" ? "REJECTED"
// //                 : "PENDING_APPROVAL",
// //         rejectReason: r.rejectedReason || null,
// //     }));
// //
// //     // تعیین وضعیت کلی
// //     const allApproved = stages.every(s => s.status === "APPROVED");
// //     const overallStatus = allApproved ? "DONE" : "IN_PROGRESS";
// //
// //     return {
// //         id: resolutionId,
// //         text: `نقص ${resolutionId.substring(0, 8)}...`,
// //         typeReport: "DEFICIENCY",
// //         status: overallStatus,
// //         stages: stages,
// //         notificationDate: "",
// //         inspectionId: "",
// //         resolutionId: resolutionId,
// //     };
// // };
//
// // تبدیل پاسخ‌ها به فرمت Deficiency برای مودال تاریخچه
// const convertToDeficiency = (responses: ResolutionResponse[]) => {
//     if (responses.length === 0) return null;
//
//     const resolutionId = responses[0]?.resolutionId || "";
//
//     const stages = responses.map((r) => ({
//         stageNumber: Math.ceil(r.responseNumber / 2) as 1 | 2 | 3,
//         responseNumber: r.responseNumber,
//         description: r.response || "",
//         progress: r.progressPercentage || 0,
//         status: r.status === "COMPLETED" ? "APPROVED"
//             : r.status === "PENDING" ? "REJECTED"
//                 : "PENDING_APPROVAL",
//         rejectReason: r.rejectedReason || null,
//     }));
//
//     const allApproved = stages.every(s => s.status === "APPROVED");
//     const overallStatus = allApproved ? "DONE" : "IN_PROGRESS";
//
//     return {
//         id: resolutionId,
//         text: `نقص ${resolutionId.substring(0, 8)}...`,
//         typeReport: "DEFICIENCY",
//         status: overallStatus,
//         stages: stages,
//         notificationDate: Date.now(),
//         inspectionId: "",
//         resolutionId: resolutionId,
//     } as Deficiency;
// };
// interface Props {
//     responses: ResolutionResponse[];
//     refresh: () => void;
// }
//
// export const InspectorReviewTable: React.FC<Props> = ({ responses, refresh }) => {
//
//     const [openReject, setOpenReject] = useState(false);
//     const [selectedId, setSelectedId] = useState<string | null>(null);
//     const [reason, setReason] = useState("");
//
//     // State برای مودال تاریخچه گفتگو
//     const [historyModalOpen, setHistoryModalOpen] = useState(false);
//     const [selectedResponses, setSelectedResponses] = useState<ResolutionResponse[]>([]);
//
//     const approveMutation = useApiMutation({
//         url: "/resolution-response/approve",
//         method: "POST",
//     });
//
//     const rejectMutation = useApiMutation({
//         url: "/resolution-response/reject",
//         method: "POST",
//     });
//
//     const handleApprove = async (id: string) => {
//         await approveMutation.mutateAsync({ responseId: id });
//         refresh();
//     };
//
//     const handleReject = async () => {
//         if (!selectedId) return;
//
//         await rejectMutation.mutateAsync({
//             responseId: selectedId,
//             reason,
//         });
//
//         setOpenReject(false);
//         setReason("");
//         refresh();
//     };
//
//     const getStatusLabel = (status: string) => {
//         switch (status) {
//             case "IN_PROGRESS":
//                 return { label: "در انتظار تایید", color: "warning" };
//             case "COMPLETED":
//                 return { label: "تایید شده", color: "success" };
//             case "PENDING":
//                 return { label: "رد شده", color: "error" };
//             default:
//                 return { label: status, color: "default" };
//         }
//     };
//
//     // باز کردن مودال تاریخچه گفتگو
//     const handleViewHistory = (resolutionId: string) => {
//         const filteredResponses = responses.filter(r => r.resolutionId === resolutionId);
//         setSelectedResponses(filteredResponses);
//         setHistoryModalOpen(true);
//     };
//
//     return (
//         <>
//             <Table>
//                 <TableHead>
//                     <TableRow>
//                         <TableCell>مرحله</TableCell>
//                         <TableCell>پیام کاربر</TableCell>
//                         <TableCell>درصد</TableCell>
//                         <TableCell>وضعیت</TableCell>
//                         <TableCell>عملیات</TableCell>
//                         <TableCell>علت رد</TableCell>
//                         <TableCell>تاریخچه</TableCell>
//                     </TableRow>
//                 </TableHead>
//
//                 <TableBody>
//                     {responses.map(r => {
//                         const statusInfo = getStatusLabel(r.status);
//
//                         return (
//                             <TableRow key={r.id}>
//                                 <TableCell>{r.responseNumber}</TableCell>
//                                 <TableCell>{r.response}</TableCell>
//                                 <TableCell>{r.progressPercentage}%</TableCell>
//
//                                 <TableCell>
//                                     <Chip
//                                         label={statusInfo.label}
//                                         color={statusInfo.color as any}
//                                         size="small"
//                                     />
//                                 </TableCell>
//
//                                 <TableCell>
//                                     {r.status === "IN_PROGRESS" && (
//                                         <>
//                                             <Button
//                                                 color="success"
//                                                 variant="contained"
//                                                 size="small"
//                                                 sx={{ mr: 1 }}
//                                                 onClick={() => handleApprove(r.id)}
//                                             >
//                                                 تایید
//                                             </Button>
//
//                                             <Button
//                                                 color="error"
//                                                 variant="outlined"
//                                                 size="small"
//                                                 onClick={() => {
//                                                     setSelectedId(r.id);
//                                                     setOpenReject(true);
//                                                 }}
//                                             >
//                                                 رد
//                                             </Button>
//                                         </>
//                                     )}
//                                 </TableCell>
//
//                                 <TableCell>
//                                     {r.rejectedReason ?? "-"}
//                                 </TableCell>
//
//                                 <TableCell>
//                                     <Button
//                                         size="small"
//                                         variant="outlined"
//                                         color="info"
//                                         onClick={() => handleViewHistory(r.resolutionId)}
//                                     >
//                                         📋 تاریخچه
//                                     </Button>
//                                 </TableCell>
//                             </TableRow>
//                         );
//                     })}
//                 </TableBody>
//             </Table>
//
//             <Dialog open={openReject} onClose={() => setOpenReject(false)}>
//                 <DialogTitle>علت رد</DialogTitle>
//                 <DialogContent>
//                     <TextField
//                         fullWidth
//                         multiline
//                         rows={3}
//                         value={reason}
//                         onChange={(e) => setReason(e.target.value)}
//                     />
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={() => setOpenReject(false)}>انصراف</Button>
//                     <Button
//                         color="error"
//                         variant="contained"
//                         onClick={handleReject}
//                     >
//                         ثبت رد
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//
//             {/* مودال تاریخچه گفتگو */}
//             {selectedResponses.length > 0 && (
//                 <ConversationHistoryModal
//                     open={historyModalOpen}
//                     onClose={() => setHistoryModalOpen(false)}
//                     deficiency={convertToDeficiency(selectedResponses)}
//                 />
//             )}
//         </>
//     );
// };

import React, { useState } from "react";
import {
    Table, TableHead, TableRow, TableCell,
    TableBody, Button, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, Chip
} from "@mui/material";
import type { ResolutionResponse } from "../hooks/useResolutionResponses";
import { useApiMutation } from "hooks/useApi";
import { ConversationHistoryModal } from "./ConversationHistoryModal";
import type {Deficiency} from "modules/inspection-operation/followup/Types.ts";

// تبدیل پاسخ‌ها به فرمت Deficiency برای مودال تاریخچه
const convertToDeficiency = (responses: ResolutionResponse[]) => {
    if (responses.length === 0) return null;

    const resolutionId = responses[0]?.resolutionId || "";

    const stages = responses.map((r) => ({
        stageNumber: Math.ceil(r.responseNumber / 2) as 1 | 2 | 3,
        responseNumber: r.responseNumber,
        description: r.response || "",
        progress: r.progressPercentage || 0,
        status: r.status === "COMPLETED" ? "APPROVED"
            : r.status === "PENDING" ? "REJECTED"
                : "PENDING_APPROVAL",
        rejectReason: r.rejectedReason || null,
    }));

    const allApproved = stages.every(s => s.status === "APPROVED");
    const overallStatus = allApproved ? "DONE" : "IN_PROGRESS";

    return {
        id: resolutionId,
        text: `نقص ${resolutionId.substring(0, 8)}...`,
        typeReport: "DEFICIENCY",
        status: overallStatus,
        stages: stages,
        notificationDate: Date.now(),
        inspectionId: "",
        resolutionId: resolutionId,
    } as Deficiency;
};

interface Props {
    responses: ResolutionResponse[];
    refresh: () => void;
}

export const InspectorReviewTable: React.FC<Props> = ({ responses, refresh }) => {

    const [openReject, setOpenReject] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [reason, setReason] = useState("");
    const [historyModalOpen, setHistoryModalOpen] = useState(false);
    const [selectedResponses, setSelectedResponses] = useState<ResolutionResponse[]>([]);

    const approveMutation = useApiMutation({
        url: "/resolution-response/approve",
        method: "POST",
    });

    const rejectMutation = useApiMutation({
        url: "/resolution-response/reject",
        method: "POST",
    });

    const handleApprove = async (id: string) => {
        await approveMutation.mutateAsync({ responseId: id });
        refresh();
    };

    const handleReject = async () => {
        if (!selectedId) return;

        await rejectMutation.mutateAsync({
            responseId: selectedId,
            reason,
        });

        setOpenReject(false);
        setReason("");
        refresh();
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "IN_PROGRESS":
                return { label: "در انتظار تایید", color: "warning" };
            case "COMPLETED":
                return { label: "تایید شده", color: "success" };
            case "PENDING":
                return { label: "رد شده", color: "error" };
            default:
                return { label: status, color: "default" };
        }
    };

    const handleViewHistory = (resolutionId: string) => {
        const filteredResponses = responses.filter(r => r.resolutionId === resolutionId);
        setSelectedResponses(filteredResponses);
        setHistoryModalOpen(true);
    };

    return (
        <>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>مرحله</TableCell>
                        <TableCell>پیام کاربر</TableCell>
                        <TableCell>درصد</TableCell>
                        <TableCell>وضعیت</TableCell>
                        <TableCell>عملیات</TableCell>
                        <TableCell>علت رد</TableCell>
                        <TableCell>تاریخچه</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {responses.map(r => {
                        const statusInfo = getStatusLabel(r.status);

                        return (
                            <TableRow key={r.id}>
                                <TableCell>{r.responseNumber}</TableCell>
                                <TableCell>{r.response}</TableCell>
                                <TableCell>{r.progressPercentage}%</TableCell>

                                <TableCell>
                                    <Chip
                                        label={statusInfo.label}
                                        color={statusInfo.color as any}
                                        size="small"
                                    />
                                </TableCell>

                                <TableCell>
                                    {r.status === "IN_PROGRESS" && (
                                        <>
                                            <Button
                                                color="success"
                                                variant="contained"
                                                size="small"
                                                sx={{ mr: 1 }}
                                                onClick={() => handleApprove(r.id)}
                                            >
                                                تایید
                                            </Button>

                                            <Button
                                                color="error"
                                                variant="outlined"
                                                size="small"
                                                onClick={() => {
                                                    setSelectedId(r.id);
                                                    setOpenReject(true);
                                                }}
                                            >
                                                رد
                                            </Button>
                                        </>
                                    )}
                                </TableCell>

                                <TableCell>
                                    {r.rejectedReason ?? "-"}
                                </TableCell>

                                <TableCell>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color="info"
                                        onClick={() => handleViewHistory(r.resolutionId)}
                                    >
                                        📋 تاریخچه
                                    </Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>

            <Dialog open={openReject} onClose={() => setOpenReject(false)}>
                <DialogTitle>علت رد</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenReject(false)}>انصراف</Button>
                    <Button
                        color="error"
                        variant="contained"
                        onClick={handleReject}
                    >
                        ثبت رد
                    </Button>
                </DialogActions>
            </Dialog>

            {/* مودال تاریخچه گفتگو */}
            {selectedResponses.length > 0 && (
                <ConversationHistoryModal
                    open={historyModalOpen}
                    onClose={() => setHistoryModalOpen(false)}
                    deficiency={convertToDeficiency(selectedResponses)}
                />
            )}
        </>
    );
};