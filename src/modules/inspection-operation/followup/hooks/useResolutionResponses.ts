import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import InspectionApis from "modules/inspection-operation/followup/api.ts";

export interface ResolutionResponse {
    id: string;
    response: string;
    progressPercentage: number;
    status: "IN_PROGRESS" | "PENDING" | "COMPLETED";
    responseNumber: number;
    rejectedReason: string | null;
    resolutionId: string;
    fileStorageRecordId?: string | null;
}

export const useResolutionResponses = (resolutionId: string) => {
    return useQuery({
        queryKey: ['resolution-responses', resolutionId],
        queryFn: async () => {
            const token = localStorage.getItem("token") || sessionStorage.getItem("token");
            const response = await axios.get(
                // `http://192.168.2.120:8086/api/resolution-response?resolution-id=${resolutionId}`,
                InspectionApis.resolutionResponse.resolutionResponseid(resolutionId),
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                }
            );
            return response.data;
        },
        enabled: !!resolutionId,
    });
};