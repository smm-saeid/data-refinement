import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import InspectionApis from "../api.ts";

export interface ApproveResponsePayload {
    resolutionId: string;
    responseNumber: number;
    status: "COMPLETED" | "REJECTED";
    rejectedReason?: string;
    response?:string;
    progressPercentage?: number;
    id: string;

}

export const useApproveResponse = () => {
    return useMutation({
        mutationFn: async (data: ApproveResponsePayload) => {
            const token = localStorage.getItem("token") || sessionStorage.getItem("token");
            const res = await axios.post(InspectionApis.resolutionResponse.resolutionResponse,
                data,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                }
            );
            return res.data;
        },
    });
};