import { Grid, Typography } from "@mui/material";

export default function PreVisitInspection(){
    
    return(
        <Grid container size={{md: 12}} display={"flex"} justifyContent={"space-between"}>
            <Grid size={{md:11}} justifyContent={"flex-end"}>
                <Typography>بازرسی و ارزیابی توان رزم پیش بازدید</Typography>
            </Grid>
        </Grid>
    )
}