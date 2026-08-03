import {
    Box, Divider,
    Paper, Typography,
} from "@mui/material";
import Chart from "react-apexcharts";
import {type ApexOptions} from "apexcharts";
import GoalsProgramsTable from "@/modules/planning/control/GoalsProgramsTable";
import SteppButton from "@/components/button/SteppButton";
import { useState } from "react";


const GoalsProgressCharts = () => {

    const [steps, setSteps] = useState<Array<string>>([
        "پیشرفت کلی حوزه ها/ادارت",
        "پیشرفت به تفکیک نیرو",
        "جزییات برنامه ها",
    ]);

    const [activeStep, setActiveStep] = useState(0);

    const units = [
        {
            id: 1,
            name: 'ستاد آجا',
        },
        {
            id: 2,
            name: 'نزاجا',
        },
        {
            id: 3,
            name: 'نهاجا',
        },
        {
            id: 4,
            name: 'نپاجا',
        },
        {
            id: 5,
            name: 'نداجا',
        },
        {
            id: 6,
            name: 'یگان های تابعه آجا',
        },
    ]

    const departments = [
        {
            id: 1,
            name: 'طرح و برنامه',
        },
        {
            id: 2,
            name: 'ایمنی و سوانح',
        },
        {
            id: 3,
            name: 'عملیات بازرسی',
        },
        {
            id: 4,
            name: 'ارزشیابی',
        },
        {
            id: 5,
            name: 'صیانت و پیگیری',
        },
    ]

    const goalsProgress = [
        {
            unitId: 1,
            departmentId: 1,
            progress: Math.floor(Math.random() * 101),
        },
        {
            unitId: 1,
            departmentId: 2,
            progress: Math.floor(Math.random() * 101),
        },
        {
            unitId: 1,
            departmentId: 3,
            progress: Math.floor(Math.random() * 101),
        },
        {
            unitId: 1,
            departmentId: 4,
            progress: Math.floor(Math.random() * 101),
        },
        {
            unitId: 1,
            departmentId: 5,
            progress: Math.floor(Math.random() * 101),
        },
        {
            unitId: 2,
            departmentId: 1,
            progress: Math.floor(Math.random() * 101),
        },
        {
            unitId: 2,
            departmentId: 2,
            progress: Math.floor(Math.random() * 101),
        },
        {
            unitId: 2,
            departmentId: 3,
            progress: Math.floor(Math.random() * 101),
        },
        {
            unitId: 2,
            departmentId: 4,
            progress: Math.floor(Math.random() * 101),
        },
        {
            unitId: 2,
            departmentId: 5,
            progress: Math.floor(Math.random() * 101),
        },
    ]

    const series1 = [
        {
            name: 'ستاد آجا',
            data: [32, 22, 20, 65, 70]
        },
        {
            name: 'نزاجا',
            data: [32, 5, 22, 65, 70]
        },
        {
            name: 'نهاجا',
            data: [50, 75, 90, 65, 70]
        },
        {
            name: 'نپاجا',
            data: [10, 22, 3, 80, 10]
        },
        {
            name: 'نداجا',
            data: [35, 22, 54, 40, 20]
        },
        {
            name: 'یگان های تابعه آجا',
            data: [88, 40, 54, 20, 30]
        },
    ]

    const series2 = [
        {
            name: 'پیشرفت حوزه/اداره',
            data: [32, 65, 20, 45, 70]
        },
    ]

    const options1: ApexOptions = {
        chart: {
            type: 'bar',
            height: 350
        },
        colors: ['#02910a', '#e19907', '#0b52ba', '#c407e1', '#28dcdc', '#5c5652'],
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                borderRadius: 4,
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent'],
        },
        xaxis: {
            categories: ['طرح و برنامه', 'ارزشیابی', 'عملیات بازرسی', 'ایمنی و سوانج', 'صیانت و پیگیری']
        },
        yaxis: {
            title: {
                text: 'درصد پیشرفت هدف'
            },
            max: 100
        },
        fill: {
            opacity: 1,
        },
        tooltip: {
            y: {
                formatter: function (value: any) {
                    return value + ' درصد'
                },
            }
        }
    }

    const options2: ApexOptions = {
        chart: {
            type: 'bar',
            height: 350
        },
        colors: ['#02910a', '#e19907', '#0b52ba', '#c407e1', '#28dcdc'],
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                borderRadius: 4,
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent'],
        },
        xaxis: {
            categories: ['طرح و برنامه', 'ارزشیابی', 'عملیات بازرسی', 'ایمنی و سوانج', 'صیانت و پیگیری']
        },
        yaxis: {
            title: {
                text: 'درصد پیشرفت هدف'
            },
            max: 100
        },
        fill: {
            opacity: 1,
        },
        tooltip: {
            y: {
                formatter: function (value: any) {
                    return value + ' درصد'
                },
            }
        }
    }

    const handleStep = (step: number) => {
        setActiveStep(step);
    };

    return (
        <Box
            sx={{
                height: '100%',
                bgcolor: 'grey.100',
                padding: 3,
                margin: '-16px',
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    padding: 2,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <Typography variant="h6" component="div">
                    کنترل پیشرفت اهداف
                </Typography>

                <Divider />

                <Box sx={{width: "100%"}}>
                    {steps.map((label, index) => {
                        return (
                            <SteppButton handleStep={handleStep} key={label} activeStep={activeStep} index={index} label={label} type={"text"} sx={null}/>
                        );
                    })}

                    <Box sx={{mt: '2rem', pr: 3}}>

                        {activeStep === 0 && (<Chart options={options2} series={series2} type="bar" height={350} width="100%"/>)}
                        {activeStep === 1 && (<Chart options={options1} series={series1} type="bar" height={350} width="100%"/>)}
                        {activeStep === 2 && (<GoalsProgramsTable></GoalsProgramsTable>)}

                    </Box>
                </Box>

            </Paper>

        </Box>

    );
};

export default GoalsProgressCharts;

