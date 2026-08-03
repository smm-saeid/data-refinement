
import React from "react";
import {useNavigate} from "react-router";
import {
    Box,
    Paper,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,

    Skeleton,
    TextField,
    InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useApiQuery } from "hooks/useApi";


interface InspectionItem {
    id: string;
    annualPlanInspectionName: string;
    organizationUnitName: string;
    forceOrganizationUnitName: string;
    executionDate?: number;
    status?: string;
    deficienciesCount?: number;
    pendingResponses?: number;
}

export default function InspectorList() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = React.useState("");

    const { data, isLoading } = useApiQuery<any>({
        url: "/inspection/my-inspection-list",
    });

    const inspections = data?.data || [];

    const filteredInspections = inspections.filter((item: InspectionItem) =>
        item.annualPlanInspectionName?.includes(searchTerm) ||
        item.organizationUnitName?.includes(searchTerm) ||
        item.forceOrganizationUnitName?.includes(searchTerm)
    );






    const handleSelectInspection = (inspectionId: string) => {
        navigate(`/operation/planning/followup/inspector/${inspectionId}`);
    };

    const formatDate = (timestamp?: number) => {
        if (!timestamp) return "-";
        return new Date(timestamp).toLocaleDateString('fa-IR');
    };

    if (isLoading) {
        return (
            <Box sx={{ p: 3 }}>
                <Skeleton variant="rectangular" height={400} />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h5" fontWeight={700}>
                    لیست بازرسی‌ها
                </Typography>
                <TextField
                    placeholder="جستجو..."
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            <Paper elevation={2}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>عنوان بازرسی</TableCell>
                            <TableCell>واحد سازمانی</TableCell>
                            <TableCell>نیرو</TableCell>
                            <TableCell>تاریخ اجرا</TableCell>
                            {/*<TableCell>تعداد نقص‌ها</TableCell>*/}
                            {/*<TableCell>در انتظار بررسی</TableCell>*/}
                            <TableCell>عملیات</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredInspections.map((item: InspectionItem) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.annualPlanInspectionName}</TableCell>
                                <TableCell>{item.organizationUnitName}</TableCell>
                                <TableCell>{item.forceOrganizationUnitName}</TableCell>
                                <TableCell>{formatDate(item.executionDate)}</TableCell>
                                {/*<TableCell>*/}
                                {/*    <Chip label={item.deficienciesCount || 0} size="small" />*/}
                                {/*</TableCell>*/}
                                {/*<TableCell>*/}
                                {/*    {item.pendingResponses ? (*/}
                                {/*        <Chip*/}
                                {/*            label={item.pendingResponses}*/}
                                {/*            color="warning"*/}
                                {/*            size="small"*/}
                                {/*        />*/}
                                {/*    ) : (*/}
                                {/*        "-"*/}
                                {/*    )}*/}
                                {/*</TableCell>*/}
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => handleSelectInspection(item.id)}
                                    >
                                        بررسی نقص‌ها
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    );
}