import { useApiMutation } from "hooks/useApi";
 import InspectionApis from "modules/inspection-operation/api.ts";


export interface SendResolutionResponsePayload {
    resolutionId: string;
    response: string;
    progressPercentage: number;
    responseNumber: number;  
    file?: File;
}

export const useSendResolutionResponse = () => {
    return useApiMutation<FormData, any>({
        url:InspectionApis.FollowUp.resolution,

        method: "POST",
        onMutate: (payload: SendResolutionResponsePayload) => {
            const formData = new FormData();
            formData.append("resolutionId", payload.resolutionId);
            formData.append("response", payload.response);
            formData.append("progressPercentage", payload.progressPercentage.toString());
            formData.append("responseNumber", payload.responseNumber.toString());

            if (payload.file) {
                formData.append("file", payload.file);
            }

            return formData;
        },
    });
};