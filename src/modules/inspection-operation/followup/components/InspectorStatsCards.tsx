import { useMemo } from "react";
import { Box, Paper, Typography, Stack } from "@mui/material";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';

interface Deficiency {
    id: string;
    text: string;
    notificationDate: number;
    inspectionId: string;
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
    typeReport: "FLAW" | "DEFICIENCY" | "APPROVAL" | null;
    reviewCustomizeQuestionId: string | null;
}

interface InspectorStatsCardsProps {
    deficiencies: Deficiency[];
}

const COLORS = {
    completed: '#4caf50',
    inProgress: '#ff9800',
    pending: '#091dff',
    primary: '#1976d2',
    purple: '#9c27b0',
};

const StatCard = function({
                              title,
                              count,
                              color,
                              icon
                          }: {
    title: string;
    count: number;
    color: string;
    icon: React.ReactNode;
}) {
    return (
        <Paper
            elevation={2}
            sx={{
                p: 2.5,
                flex: 1,
                minWidth: 120,
                textAlign: "center",
                borderBottom: `4px solid ${color}`,
                borderRadius: 2,
                transition: "transform 0.2s",
                '&:hover': {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                }
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 1 }}>
                <Box sx={{ color: color, fontSize: 24 }}>{icon}</Box>
                <Typography variant="h4" fontWeight="bold" color={color}>
                    {count}
                </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
                {title}
            </Typography>
        </Paper>
    );
};

const CustomPieTooltip = function({ active, payload }: any) {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <Paper sx={{ p: 1.5, bgcolor: 'white', boxShadow: 3 }}>
                <Typography variant="body2" fontWeight="bold">
                    {data.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    تعداد: {data.value}
                </Typography>
            </Paper>
        );
    }
    return null;
};
export function InspectorStatsCards({ deficiencies }: InspectorStatsCardsProps) {


    const stats = useMemo(function() {
        const total = deficiencies.length;
        const inProgress = deficiencies.filter(function(d) { return d.status === "IN_PROGRESS"; }).length;
        const completed = deficiencies.filter(function(d) { return d.status === "COMPLETED"; }).length;
        const pending = deficiencies.filter(function(d) { return d.status === "PENDING"; }).length;


        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

        return {
            total,
            inProgress,
            completed,
            pending,
            completionRate,
        };
    }, [deficiencies]);

    const pieData = useMemo(function() {
        const data = [
            { name: 'تکمیل شده', value: stats.completed, color: COLORS.completed },
            { name: 'در حال انجام', value: stats.inProgress, color: COLORS.inProgress },
            { name: 'در انتظار', value: stats.pending, color: COLORS.pending },
        ];
        return data.filter(function(item) { return item.value > 0; });
    }, [stats]);

    const barData = useMemo(function() {
        return [
            { name: 'تکمیل شده', تعداد: stats.completed },
            { name: 'در حال انجام', تعداد: stats.inProgress },
            { name: 'در انتظار', تعداد: stats.pending },
        ].filter(function(item) { return item.تعداد > 0; });
    }, [stats]);

    return (
        <Box sx={{ mt: 6 }}>
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{ mb: 3 }}
            >
                <StatCard
                    title="تعداد کل نقص‌ها"
                    count={stats.total}
                    color={COLORS.primary}
                    icon="📋"
                />
                <StatCard
                    title="تکمیل شده"
                    count={stats.completed}
                    color={COLORS.completed}
                    icon="✅"
                />
                <StatCard
                    title="در حال انجام"
                    count={stats.inProgress}
                    color={COLORS.inProgress}
                    icon="⏳"
                />
                <StatCard
                    title="در انتظار"
                    count={stats.pending}
                    color={COLORS.pending}
                    icon=""
                />
            </Stack>

            <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={3}
            >
                <Paper
                    elevation={2}
                    sx={{
                        p: 2,
                        flex: 1,
                        borderRadius: 2,
                        minHeight: 300,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        توزیع وضعیت‌ها
                    </Typography>
                    <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={function({ name, percent }) {
                                    return `${name}: ${(percent * 100).toFixed(0)}%`;
                                }}
                                outerRadius={80}
                                innerRadius={50}
                                dataKey="value"
                                paddingAngle={2}
                            >
                                {pieData.map(function(entry, index) {
                                    return <Cell key={`cell-${index}`} fill={entry.color} />;
                                })}
                            </Pie>
                            <Tooltip content={<CustomPieTooltip />} />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                formatter={function(value) {
                                    return <span style={{ fontSize: '12px' }}>{value}</span>;
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </Paper>

                <Paper
                    elevation={2}
                    sx={{
                        p: 2,
                        flex: 1,
                        borderRadius: 2,
                        minHeight: 300,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        تعداد وضعیت‌ها
                    </Typography>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart
                            data={barData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'white',
                                    borderRadius: 8,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                                }}
                            />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                            />
                            <Bar
                                dataKey="تعداد"
                                fill={COLORS.primary}
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </Paper>
            </Stack>

            <Paper
                elevation={1}
                sx={{
                    p: 2,
                    mt: 2,
                    borderRadius: 2,
                    bgcolor: '#f5f5f5'
                }}
            >
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body2" fontWeight="bold">
                        پیشرفت کلی
                    </Typography>
                    <Typography variant="body2" color="success" fontWeight="bold">
                        {stats.completionRate}%
                    </Typography>
                </Box>
                <Box sx={{ height: 8, bgcolor: "#e0e0e0", borderRadius: 4, overflow: "hidden" }}>
                    <Box
                        sx={{
                            width: `${stats.completionRate}%`,
                            height: "100%",
                            bgcolor: stats.completionRate === 100 ? COLORS.completed :
                                stats.completionRate > 50 ? COLORS.primary :
                                    COLORS.inProgress,
                            borderRadius: 4,
                            transition: "width 0.5s ease-in-out",
                        }}
                    />
                </Box>
                <Box display="flex" justifyContent="space-between" mt={0.5}>
                    <Typography variant="caption" color="text.secondary">
                        {stats.completed} مورد تکمیل شده از {stats.total} مورد
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {stats.pending} مورد در انتظار
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
}