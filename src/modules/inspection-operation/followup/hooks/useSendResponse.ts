import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import InspectionApis from "modules/inspection-operation/followup/api.ts";

export interface SendResponsePayload {
    response: string;
    progressPercentage: number;
    status: "IN_PROGRESS";
    resolutionId: string;
    responseNumber: number;
    reviewCustomizeQuestionId: string;
    fileStorageRecordId?: string;
}

export const useSendResponse = () => {
    return useMutation({
        mutationFn: async (data: SendResponsePayload) => {
            const res = await axios.post(
                // "/api/resolution-response",
                InspectionApis.resolutionResponse.resolutionResponse,
                data
            );
            return res.data;
        },
    });
};