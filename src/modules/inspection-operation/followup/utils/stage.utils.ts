

import type { Stage, StageStatus, ResolutionResponse } from "../Types";

export const createDefaultStages = (): Stage[] => [
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

export const mapResponsesToStages = (
    responses: ResolutionResponse[]
): Stage[] => {

    const stages = createDefaultStages();

    responses.forEach((resp) => {

        // stage 1
        if (resp.responseNumber === 1) {
            stages[0].description = resp.response;
            stages[0].progress = resp.progressPercentage;
            stages[0].status = "PENDING_APPROVAL";
        }

        if (resp.responseNumber === 2) {
            if (resp.status === "COMPLETED") {
                stages[0].status = "APPROVED";
            }

            if (resp.status === "PENDING") {
                stages[0].status = "REJECTED";
                stages[0].rejectReason = resp.rejectedReason;
            }
        }

        // stage 2
        if (resp.responseNumber === 3) {
            stages[1].description = resp.response;
            stages[1].progress = resp.progressPercentage;
            stages[1].status = "PENDING_APPROVAL";
        }

        if (resp.responseNumber === 4) {
            if (resp.status === "COMPLETED") {
                stages[1].status = "APPROVED";
            }

            if (resp.status === "PENDING") {
                stages[1].status = "REJECTED";
                stages[1].rejectReason = resp.rejectedReason;
            }
        }

        // stage 3
        if (resp.responseNumber === 5) {
            stages[2].description = resp.response;
            stages[2].progress = resp.progressPercentage;
            stages[2].status = "PENDING_APPROVAL";
        }

        if (resp.responseNumber === 6) {
            if (resp.status === "COMPLETED") {
                stages[2].status = "APPROVED";
            }

            if (resp.status === "PENDING") {
                stages[2].status = "REJECTED";
                stages[2].rejectReason = resp.rejectedReason;
            }
        }
    });

    return stages;
};

export const getOverallStatus = (stages: Stage[]) => {

    const allApproved = stages.every(
        s => s.status === "APPROVED"
    );

    const hasRejected = stages.some(
        s => s.status === "REJECTED"
    );

    const hasPending = stages.some(
        s => s.status === "PENDING_APPROVAL"
    );

    if (allApproved) {
        return "DONE";
    }

    if (hasRejected) {
        return "PENDING";
    }

    if (hasPending) {
        return "IN_PROGRESS";
    }

    return "IN_PROGRESS";
};

export const getRemainingProgress = (
    previousTotal: number
) => {
    return 100 - previousTotal;
};

