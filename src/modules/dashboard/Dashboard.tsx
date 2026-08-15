import { Box, Stack, Typography } from '@mui/material';
import DashboardInfo from './dashboardInfo';
import jalali from '@/lib/jalali';

function Dashboard() {
  const count = 5;
  const date = new Date();
  const time = jalali.format(date);
  const hour = date.getHours();
  const minute = date.getMinutes();
  const today = date.toLocaleDateString('fa-IR', {
    weekday: 'long',
  });

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          marginX: '150px',
          marginTop: '80px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: '20px',
            bgcolor: '#f8f6f6',
            padding: '5px',
          }}
        >
          <Typography>
            کاربر: <span>پویان صمدی</span>
          </Typography>
          <Typography>خوش آمدید</Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            gap: '20px',
            bgcolor: '#f8f6f6',
            padding: '5px',
          }}
        >
          <Typography>
            روز: <span>{today}</span>
          </Typography>
          <Typography>
            تاریخ: <span>{time}</span>
          </Typography>
          <Typography>
            ساعت: <span>{`${hour}:${minute}`}</span>
          </Typography>
        </Box>
      </Box>
      <Stack
        sx={{
          rowGap: '15px',
          width: '400px',
          marginX: 'auto',
          marginTop: '100px',
        }}
      >
        <DashboardInfo count={count} value="تعداد فایل های ایجاد شده" to="" />
        <DashboardInfo count={count} value="تعداد فایل های ارجاع شده" to="" />
        <DashboardInfo count={count} value="تعداد فایل های برگشت خورده" to="" />
        <DashboardInfo
          count={count}
          value="تعداد فایل های به اتمام رسیده"
          to=""
        />
      </Stack>
    </Box>
  );
}

export default Dashboard;
