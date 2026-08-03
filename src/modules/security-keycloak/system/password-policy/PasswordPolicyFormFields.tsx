
import {
  Divider,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { PolicyNumberInput } from './PolicyNumberInput';
import { PolicyTextInput } from './PolicyTextInput';
import { useFormContext } from 'react-hook-form';
import { useEffect } from 'react';

// کامپوننت Grid سفارشی برای جلوگیری از خطا
const GridContainer = ({
  children,
  spacing = 2,
}: {
  children: React.ReactNode;
  spacing?: number;
}) => (
  <div
    style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: spacing * 8,
      width: '100%',
    }}
  >
    {children}
  </div>
);

const GridItem = ({
  children,
  xs = 12,
  sm = 6,
  md = 4,
}: {
  children: React.ReactNode;
  xs?: number;
  sm?: number;
  md?: number;
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const getWidth = () => {
    if (isMobile) return `${(xs / 12) * 100}%`;
    if (isTablet) return `${(sm / 12) * 100}%`;
    return `${(md / 12) * 100}%`;
  };

  return (
    <div
      style={{
        width: `calc(${getWidth()} - ${isMobile ? 16 : 24}px)`,
        minWidth: '250px',
        flexGrow: 1,
      }}
    >
      {children}
    </div>
  );
};

export function PasswordPolicyFormFields() {
  const { watch } = useFormContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const subscription = watch(value => {
      console.log('Form values:', value);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: isMobile ? 1 : 2,
      }}
    >
      {/* بخش ویژگی‌های اصلی */}
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          mt: 2,
          fontWeight: 'bold',
          fontSize: isMobile ? '1.1rem' : '1.25rem',
          color: theme.palette.primary.main,
        }}
      >
        ویژگی‌های اصلی رمز عبور
      </Typography>

      <GridContainer spacing={isMobile ? 2 : 3}>
        <GridItem xs={12} sm={6} md={4}>
          <PolicyNumberInput
            name="minLength"
            label="حداقل طول رمز عبور"
            required
            min={0}
            max={128}
            size={isMobile ? 'medium' : 'large'}
          />
        </GridItem>

        <GridItem xs={12} sm={6} md={4}>
          <PolicyNumberInput
            name="maxLength"
            label="حداکثر طول رمز عبور"
            required
            min={0}
            max={128}
            size={isMobile ? 'medium' : 'large'}
          />
        </GridItem>

        <GridItem xs={12} sm={6} md={4}>
          <PolicyNumberInput
            name="specialChars"
            label="تعداد کاراکترهای خاص"
            min={0}
            max={10}
            size={isMobile ? 'medium' : 'large'}
          />
        </GridItem>

        <GridItem xs={12} sm={6} md={4}>
          <PolicyNumberInput
            name="upperCase"
            label="تعداد حروف بزرگ"
            min={0}
            max={10}
            size={isMobile ? 'medium' : 'large'}
          />
        </GridItem>

        <GridItem xs={12} sm={6} md={4}>
          <PolicyNumberInput
            name="lowerCase"
            label="تعداد حروف کوچک"
            min={0}
            max={10}
            size={isMobile ? 'medium' : 'large'}
          />
        </GridItem>

        <GridItem xs={12} sm={6} md={4}>
          <PolicyNumberInput
            name="digits"
            label="تعداد اعداد"
            min={0}
            max={10}
            size={isMobile ? 'medium' : 'large'}
          />
        </GridItem>
      </GridContainer>

      <Divider sx={{ my: isMobile ? 2 : 3 }} />

      {/* بخش تنظیمات پیشرفته */}
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          fontSize: isMobile ? '1.1rem' : '1.25rem',
          color: theme.palette.primary.main,
        }}
      >
        تنظیمات پیشرفته
      </Typography>

      <GridContainer spacing={isMobile ? 2 : 3}>
        <GridItem xs={12} sm={6} md={4}>
          <PolicyNumberInput
            name="passwordHistory"
            label="تعداد دفعات استفاده از تاریخچه رمز عبور"
            min={0}
            max={10}
            size={isMobile ? 'medium' : 'large'}
          />
        </GridItem>

        <GridItem xs={12} sm={6} md={4}>
          <PolicyTextInput
            name="regexPattern"
            label="الگوی Regex برای رمز عبور (دلخواه)"
            placeholder="الگوی دلخواه وارد کنید"
            size={isMobile ? 'medium' : 'large'}
          />
        </GridItem>

        <GridItem xs={12} sm={6} md={4}>
          <PolicyTextInput
            name="hashAlgorithm"
            label="الگوریتم هش (دلخواه)"
            placeholder="الگوریتم هش وارد کنید"
            size={isMobile ? 'medium' : 'large'}
          />
        </GridItem>

        <GridItem xs={12} sm={6} md={4}>
          <PolicyNumberInput
            name="forceExpiredPasswordChange"
            label="الزام به تغییر رمز عبور منقضی"
            min={0}
            size={isMobile ? 'medium' : 'large'}
          />
        </GridItem>

        <GridItem xs={12} sm={6} md={4}>
          <PolicyNumberInput
            name="accessTokenLifespan"
            label="حداکثر زمان احراز هویت (ثانیه)"
            min={900}
            max={1800}
            required
            size={isMobile ? 'medium' : 'large'}
          />
        </GridItem>

        <GridItem xs={12} sm={6} md={4}>
          <PolicyNumberInput
            name="accessCodeLifespan"
            label="طول عمر کد دسترسی (ثانیه)"
            min={60}
            max={3600}
            size={isMobile ? 'medium' : 'large'}
          />
        </GridItem>
      </GridContainer>

      <Divider sx={{ my: isMobile ? 2 : 3 }} />

      {/* بخش تنظیمات سیستم */}
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          fontSize: isMobile ? '1.1rem' : '1.25rem',
          color: theme.palette.primary.main,
        }}
      >
        تنظیمات سیستم
      </Typography>

      <GridContainer spacing={isMobile ? 2 : 3}>
        <GridItem xs={12} sm={6} md={4}>
          <PolicyNumberInput
            name="ssoIdleTimeout"
            label="زمان عدم فعالیت SSO (ثانیه)"
            min={60}
            max={86400}
            size={isMobile ? 'medium' : 'large'}
          />
        </GridItem>

        <GridItem xs={12} sm={6} md={4}>
          <PolicyNumberInput
            name="loginLifespan"
            label="طول عمر لاگین (ثانیه)"
            min={60}
            max={86400}
            size={isMobile ? 'medium' : 'large'}
          />
        </GridItem>
      </GridContainer>
    </Box>
  );
}
