const InspectionApis = {
    FollowUp:{
        infoResponse:(id:string)=>`/inspection/info/${id}`,
        inspectionResponse:(id:string)=>`/inspection/resolution/${id}`,
        saveStage:(deficiencyId:string, stageNumber:number) =>
            `/inspection/followup-stage/${deficiencyId}/stage/${stageNumber}`,
    }
    ,
    resolutionResponse:{

        resolutionResponse :`http://192.180.8.237:8585/api/resolution-response`,
        resolutionResponseid :(id:string)=>`http://192.180.8.237:8585/api/resolution-response?resolution-id=${id}`,


    }

};

export default InspectionApis;