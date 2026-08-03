import { useParams } from "react-router";
import { useFollowupDetails } from "./hooks/useFollowupDetails";
import { FollowupStagesTable } from "./components/FollowupStagesTable";
import { Box, Typography, Paper, Button } from "@mui/material";
import {InspectionHeader} from "modules/inspection-operation/followup/components/InspectionHeader.tsx";

export default function FollowupDetails() {
    const { id } = useParams<{ id: string }>();

    const { infoData, deficiencies, loading, handlers } = useFollowupDetails(id!);

    if (!id) {
        return (
            <Box sx={{ p: 4, textAlign: "center" }}>
                <Typography color="error">شناسه معتبر یافت نشد</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            {/*{infoData && (*/}
            {/*    <Paper sx={{ p: 3, mb: 3 }}>*/}
            {/*        <Typography variant="h5" gutterBottom>*/}
            {/*            {infoData.name || "جزئیات بازرسی"}*/}
            {/*        </Typography>*/}
            {/*        <Box sx={{ display: "flex",justifyContent:"space-around", flexWrap: "wrap" ,backgroundColor:"#1976d2" ,p:2 ,color:"#ffffff"}}>*/}
            {/*            {infoData?.inspectionYear && (*/}
            {/*                <Typography variant="body2">*/}
            {/*                    تاریخ اجرا: {infoData?.inspectionYear}*/}
            {/*                </Typography>*/}
            {/*            )}*/}
            {/*            {infoData?.forceOrganizationUnitName && (*/}
            {/*                <Typography variant="body2">*/}
            {/*                      کد یگان  : {infoData?.forceOrganizationUnitName}*/}
            {/*                </Typography>*/}
            {/*            )}*/}
            {/*            {infoData?.annualPlanInspectionName && (*/}

            {/*                <Typography variant="body2">*/}
            {/*                       نوع بازرسی  : {infoData?.annualPlanInspectionName}*/}
            {/*                </Typography>*/}
            {/*            )}*/}
            {/*            {infoData.organizationUnitName && (*/}
            {/*                <Typography variant="body2">*/}
            {/*                     یگان : {infoData.organizationUnitName}*/}
            {/*                </Typography>*/}
            {/*            )}*/}
            {/*        </Box>*/}
            {/*    </Paper>*/}
            {/*)}*/}




            <InspectionHeader infoData={infoData} title={"اطلاعات یگان مبدا"}/>
            <Paper sx={{ p: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="h6">
                        نتایج بازدید
                    </Typography>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={handlers.refresh}
                    >
                        بروزرسانی
                    </Button>
                </Box>

                <FollowupStagesTable deficiencies={deficiencies} updateStage={handlers.updateStage} loading={loading} />
            </Paper>
        </Box>
    );
}