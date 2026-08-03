import { useState } from 'react';
import {
  Box,
  LinearProgress,
  Paper,
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  IconButton,
  Tooltip,
  Skeleton,
  Chip,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useApiQuery } from '@/hooks/useApi';
import type { PlanningTarget, ProgramSummary } from '../types.ts';
import ActivitiesDialog from './ActivitiesDialog';
import InspectionOperationApis from '@/modules/inspection-operation/api.ts';
import jalali from '@/lib/jalali';

type Props = {
  target: PlanningTarget;
};

export default function TargetProgramsCard({ target }: Props) {
  const [selectedProgram, setSelectedProgram] = useState<ProgramSummary | null>(null);

  const { data, isLoading } = useApiQuery<ProgramSummary[]>({
    url: InspectionOperationApis.planning.programs(target.id),
    enabled: Boolean(target.id),
  });

  const programs = data?.data ?? [];

  return (
    <>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Box display="flex" justifyContent="space-between" flexWrap="wrap" gap={2} mb={2}>
          <Box>
            <Typography variant="h6">{target.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              بازه زمانی: {target.startDate ? jalali.timestampToJalali(target.startDate, 'jYYYY/jMM/jDD', 'ms') : '-'} تا{' '}
              {target.endDate ? jalali.timestampToJalali(target.endDate, 'jYYYY/jMM/jDD', 'ms') : '-'}
            </Typography>
          </Box>
          <Chip label={`برنامه‌ها: ${programs.length}`} color="primary" variant="outlined" />
        </Box>

        {isLoading ? (
          <Skeleton variant="rounded" height={120} />
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>برنامه</TableCell>
                <TableCell align="center">پیشرفت</TableCell>
                <TableCell align="center">انجام شده / کل</TableCell>
                <TableCell align="center">عملیات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {programs.map(program => {
                const progress =
                  program.totalCount === 0
                    ? 0
                    : Math.round((program.doneCount / program.totalCount) * 100);
                return (
                  <TableRow key={program.id} hover>
                    <TableCell>{program.name}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Box flexGrow={1}>
                          <LinearProgress variant="determinate" value={progress} />
                        </Box>
                        <Typography variant="caption" width={36} textAlign="left">
                          %{progress}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      {program.doneCount} / {program.totalCount}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="نمایش فعالیت‌ها">
                        <IconButton color="primary" size="small" onClick={() => setSelectedProgram(program)}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
              {!programs.length && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    برنامه‌ای ثبت نشده است.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Paper>

      <ActivitiesDialog
        open={Boolean(selectedProgram)}
        programId={selectedProgram?.id}
        programName={selectedProgram?.name}
        onClose={() => setSelectedProgram(null)}
      />
    </>
  );
}