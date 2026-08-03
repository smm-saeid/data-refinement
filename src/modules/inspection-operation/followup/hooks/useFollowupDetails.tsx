import { useEffect, useState, useMemo, useRef } from "react";
import type { ApiResponse, Deficiency, InspectionDetail, Stage } from "../Types";
import { useApiQuery } from "hooks/useApi";
import InspectionApis from "../api.ts";
import { useSendResolutionResponse } from "./SendResolutionPayload";
import { useQueries } from "@tanstack/react-query";

export const useFollowupDetails = (inspectionId: string) => {
    const [infoData, setInfoData] = useState<InspectionDetail | null>(null);
    const [deficiencies, setDeficiencies] = useState<Deficiency[]>([]);
    const [loading, setLoading] = useState(false);
    const prevDeficienciesRef = useRef<string>("");

    const { data: infoResponse } = useApiQuery<ApiResponse<InspectionDetail>>({
        url: InspectionApis.FollowUp.infoResponse(inspectionId),
    });

    const { data: deficienciesResponse } =
        useApiQuery<ApiResponse<Deficiency[]>>({
            url: InspectionApis.FollowUp.inspectionResponse(inspectionId),
        });

    const sendStage = useSendResolutionResponse();

    useEffect(() => {
        if (infoResponse?.data) {
            // @ts-ignore
            setInfoData(infoResponse.data);
        }
    }, [infoResponse]);

    // استفاده از useMemo برای ایجاد queries فقط زمانی که deficienciesResponse تغییر کند
    useMemo(() => {
        const data = deficienciesResponse?.data;
        if (!data || !Array.isArray(data)) {
            return [];
        }
        return data.map((def: Deficiency) => def.id);
    }, [deficienciesResponse?.data]);
// استفاده از useQueries با کلیدهای پایدار
    const responseQueries = useQueries({
        queries: useMemo(() => {
            const data = deficienciesResponse?.data;
            if (!data || !Array.isArray(data)) {
                return [];
            }
            return data.map((def: Deficiency) => ({
                queryKey: ['resolution-responses', def.id],
                queryFn: async () => {
                    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
                    const response = await fetch(
                        InspectionApis.resolutionResponse.resolutionResponseid(def.id),
                        {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            }
                        }
                    );
                    const data = await response.json();
                    return data;
                },
                enabled: !!def.id && !!deficienciesResponse?.data,
                staleTime: 5 * 60 * 1000, // 5 دقیقه کش
                gcTime: 10 * 60 * 1000, // 10 دقیقه نگهداری در کش
            }));
        }, [deficienciesResponse?.data]),
    });

    // پردازش داده‌ها با استفاده از useMemo برای جلوگیری از حلقه
    const processedDeficiencies = useMemo(() => {
        const data = deficienciesResponse?.data;
        if (!data || !Array.isArray(data)) {
            return [];
        }

        // بررسی اینکه آیا همه queries بارگذاری شده‌اند
        const allQueriesLoaded = responseQueries.every(q => q.isSuccess || q.isError);
        if (!allQueriesLoaded) {
            return [];
        }

        return data.map((d: Deficiency, index: number) => {
            const responseData = responseQueries[index]?.data;
            const defResponses = responseData?.data || [];

            const stages: Stage[] = [
                {
                    stageNumber: 1,
                    responseNumber: 1,
                    description: "",
                    progress: 0,
                    status: "NOT_SENT",
                    rejectReason: null,
                },
                {
                    stageNumber: 2,
                    responseNumber: 3,
                    description: "",
                    progress: 0,
                    status: "NOT_SENT",
                    rejectReason: null,
                },
                {
                    stageNumber: 3,
                    responseNumber: 5,
                    description: "",
                    progress: 0,
                    status: "NOT_SENT",
                    rejectReason: null,
                },
            ];

            defResponses.forEach((resp: any) => {
                if (resp.responseNumber === 1) {
                    stages[0].description = resp.response;
                    stages[0].progress = resp.progressPercentage;
                    stages[0].status = "PENDING_APPROVAL";
                }
                else if (resp.responseNumber === 2) {
                    if (resp.status === "COMPLETED") {
                        stages[0].status = "APPROVED";
                    } else if (resp.status === "PENDING") {
                        stages[0].status = "REJECTED";
                        stages[0].rejectReason = resp.rejectedReason;
                    }
                }
                else if (resp.responseNumber === 3) {
                    stages[1].description = resp.response;
                    stages[1].progress = resp.progressPercentage;
                    stages[1].status = "PENDING_APPROVAL";
                }
                else if (resp.responseNumber === 4) {
                    if (resp.status === "COMPLETED") {
                        stages[1].status = "APPROVED";
                    } else if (resp.status === "PENDING") {
                        stages[1].status = "REJECTED";
                        stages[1].rejectReason = resp.rejectedReason;
                    }
                }
                else if (resp.responseNumber === 5) {
                    stages[2].description = resp.response;
                    stages[2].progress = resp.progressPercentage;
                    stages[2].status = "PENDING_APPROVAL";
                }
                else if (resp.responseNumber === 6) {
                    if (resp.status === "COMPLETED") {
                        stages[2].status = "APPROVED";
                    } else if (resp.status === "PENDING") {
                        stages[2].status = "REJECTED";
                        stages[2].rejectReason = resp.rejectedReason;
                    }
                }
            });

            const allApproved = stages.every(s => s.status === "APPROVED");
            const hasRejected = stages.some(s => s.status === "REJECTED");
            const hasPending = stages.some(s => s.status === "PENDING_APPROVAL");

            let overallStatus: "PENDING" | "IN_PROGRESS" | "DONE" = "IN_PROGRESS";
            if (allApproved) {
                overallStatus = "DONE";
            } else if (hasRejected) {
                overallStatus = "PENDING";
            } else if (hasPending) {
                overallStatus = "IN_PROGRESS";
            }

            return {
                id: d.id,
                text: d.text,
                notificationDate: d.notificationDate,
                inspectionId: d.inspectionId,
                resolutionId: d.id,
                status: overallStatus,
                typeReport: d.typeReport,
                stages,
            };
        });
    }, [deficienciesResponse?.data, responseQueries]);

    // فقط زمانی که داده‌ها تغییر کنند، state به‌روز شود
    useEffect(() => {
        if (processedDeficiencies.length > 0) {
            const currentIds = processedDeficiencies.map(d => d.id).join(',');

            // فقط در صورتی به‌روز کن که داده‌ها تغییر کرده باشند
            if (prevDeficienciesRef.current !== currentIds) {
                prevDeficienciesRef.current = currentIds;
                setDeficiencies(processedDeficiencies);
            }
        } else if (processedDeficiencies.length === 0 && deficiencies.length > 0) {
            // اگر داده‌ها خالی شدند و قبلاً داده وجود داشت
            setDeficiencies([]);
        }
    }, [processedDeficiencies]);

    // نشان‌دهنده آماده بودن داده‌ها
    const isReady = useMemo(() => {
        return !!(deficienciesResponse?.data && Array.isArray(deficienciesResponse.data));
    }, [deficienciesResponse]);

    const updateStage = async (
        deficiencyId: string,
        stageNumber: 1 | 2 | 3,
        description: string,
        progress: number
    ) => {
        const deficiency = deficiencies.find(d => d.id === deficiencyId);
        if (!deficiency) return;

        const stage = deficiency.stages.find(s => s.stageNumber === stageNumber);
        if (!stage) return;

        setLoading(true);
        try {
            await sendStage.mutateAsync({
                resolutionId: deficiency.resolutionId,
                response: description,
                progressPercentage: progress,
                responseNumber: stage.responseNumber,
                status: deficiency.status,
            });

            setDeficiencies(prev =>
                prev.map(d =>
                    d.id === deficiencyId
                        ? {
                            ...d,
                            stages: d.stages.map(s =>
                                s.stageNumber === stageNumber
                                    ? {
                                        ...s,
                                        description,
                                        progress,
                                        status: "PENDING_APPROVAL",
                                        rejectReason: null,
                                    }
                                    : s
                            ),
                            status: "IN_PROGRESS",
                        }
                        : d
                )
            );

            // به جای reload، فقط داده‌ها را مجدداً دریافت کنید
            setTimeout(() => {
                // استفاده از refetch برای به‌روزرسانی
                // refetch();
            }, 1000);

        } catch (err) {
            console.error("خطا در ارسال مرحله:", err);
        } finally {
            setLoading(false);
        }
    };

    const refresh = async () => {
        // استفاده از refetch برای به‌روزرسانی
        // await refetch();
        window.location.reload();
    };

    return {
        infoData,
        deficiencies,
        loading,
        isReady,
        handlers: {
            updateStage,
            refresh,
        },
    };
};