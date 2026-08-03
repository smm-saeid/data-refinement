import { Card, CardContent, Grid, Typography, Chip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';




export const InspectionHeader = ({ infoData ,title}) => {


     const inspection_status = {
        "not executed": "اجرا نشده",
        "under execution": "در حین اجرا",
        "executed": "اجرا شده",
        "in progress": "در حال انجام",
        "pending": "در انتظار",
        "completed": "تکمیل شده",
        "cancelled": "لغو شده",
        "draft": "پیش‌نویس",
    }

    return (
        <Card sx={{ mb: 3 ,backgroundColor:"#1f74f6",color: 'white',fontSize: 18 ,fontWeight:"bolder"}}>
            <CardContent>
                <Typography variant="h6" color="primary" sx={{ mb: 3, display: 'flex', gap: 1 ,color: 'white' }}>
                    <InfoIcon />
                    {title}
                </Typography>

                <Grid container spacing={3}>
                    <Grid size={{xs:12 , md:3}}>
                        <Typography >نوع بازرسی :{infoData?.inspectionTypeName || '---'}</Typography>
                    </Grid>

                    <Grid size={{xs:12 , md:3}}>

                        <Typography>
                              یگان : {infoData?.organizationUnitName}
                        </Typography>
                    </Grid>

                    <Grid size={{xs:12 , md:3}}>

                        <Typography>
                         تاریخ اجرا :    {infoData?.inspectionYear}                        </Typography>
                    </Grid>

                    <Grid size={{xs:12 , md:3}}>

                       وضیعت : <Chip
                            label={inspection_status[infoData?.status]}
                            color="success"
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};
