import { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import { Box, Container, Paper, Typography, Alert } from '@mui/material';
import iconImg from '@/assets/aja-logo.png';
import bgImg from '@/assets/damavand.jpg';
import type { FieldConfig } from '@/components/form/types.ts';
import Captcha from '@/modules/auth/login/Captcha.tsx';
import FormBuilder from '@/components/form/FormBuilder.tsx';
import { useAuth } from 'hooks/useAuth.ts';

const LOGIN_URL = `${import.meta.env.VITE_KEYCLOAK_SERVICE}/login`;

interface LoginResponse {
  message: string;
  responseList: Array<{
    user: Array<{
      userId: string;
      firstName: string;
      lastName: string;
      username: string;
      userEnabled: boolean;
      roles: Array<{
        roleRealm: string;
        roleDescription: string;
        roleName: string;
        menus: any[];
      }>;
    }>;
    expires_in: number;
    token: string;
  }> | null;
}

function getMenus(userData: any): string[] {
  const allComps: string[] = [];

  function traverseMenus(menus: any[]) {
    for (const menu of menus) {
      if (menu.comp && !allComps.includes(menu.comp)) {
        allComps.push(menu.comp);
      }
      if (Array.isArray(menu.submenus) && menu.submenus.length > 0) {
        traverseMenus(menu.submenus);
      }
    }
  }

  if (!userData || !Array.isArray(userData.roles)) {
    return [];
  }

  for (const role of userData.roles) {
    if (Array.isArray(role.menus)) {
      traverseMenus(role.menus);
    }
  }

  return allComps;
}

export default function Login() {
  const navigate = useNavigate();

  const auth = useAuth();

  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fields: FieldConfig[] = [
    {
      type: 'text',
      name: 'username',
      label: 'نام کاربری',
      size: { xs: 12 },
      defaultValue: '',
      placeholder: 'نام کاربری خود را وارد کنید',
      validation: {
        required: 'نام کاربری الزامی است',
      },
    },
    {
      type: 'password',
      name: 'password',
      label: 'رمز عبور',
      size: { xs: 12 },
      defaultValue: '',
      placeholder: 'رمز عبور خود را وارد کنید',
      validation: {
        required: 'رمز عبور الزامی است',
      },
    },
    {
      type: 'slot',
      name: 'captcha-display',
      size: { xs: 12 },
      render: Captcha,
    },
    {
      type: 'text',
      name: 'captcha',
      label: 'کد امنیتی',
      size: { xs: 12 },
      defaultValue: '',
      placeholder: 'کد را وارد کنید',
      validation: {
        required: 'کد امنیتی الزامی است',
        minLength: {
          value: 4,
          message: 'کد امنیتی باید 4 کاراکتر باشد',
        },
      },
    },
    {
      type: 'checkbox',
      name: 'rememberMe',
      label: 'مرا به خاطر بسپار',
      size: { xs: 12 },
      defaultValue: false,
    },
  ];

  const handleSubmit = async (data: any) => {
    try {
      setLoginLoading(true);
      setError(null);

      const requestBody = {
        searchModel: {
          username: data.username,
          password: data.password,
          captcha: data.captcha,
        },
      };

      const response = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const result: LoginResponse = await response.json();

      if (!response.ok || !result.responseList) {
        throw new Error(result.message || 'خطا در ورود به سیستم');
      }

      const loginData = result.responseList[0];
      const userData = loginData.user[0];
      const tokenInfo = JSON.parse(loginData.token);

      localStorage.setItem('token', tokenInfo.access_token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('expires_in', loginData.expires_in.toString());
      localStorage.setItem('loginTime', new Date().getTime().toString());

      const menus = getMenus(userData);
      localStorage.setItem('menus', JSON.stringify(menus));

      if (data.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('rememberedUsername', data.username);
      } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('rememberedUsername');
      }

      auth.reloadToken();

      navigate('/');
    } catch (err: any) {
      console.error('❌ خطا در ورود:', err);

      let errorMessage = 'خطا در ورود به سیستم';

      if (err.message.includes('کپچا')) {
        errorMessage = 'کد امنیتی اشتباه یا منقضی شده است';
      } else if (err.message.includes('Invalid username or password')) {
        errorMessage = 'نام کاربری یا رمز عبور اشتباه است';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <Container maxWidth={false} disableGutters>
      <Box
        sx={{
          height: '100vh',
          width: '100%',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundImage: `url(${bgImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 1,
          },
        }}
      >
        <Paper
          elevation={20}
          sx={{
            position: 'relative',
            zIndex: 2,
            width: { xs: '90%', sm: '450px', md: '500px' },
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'rgba(255,255,255,0.98)',
              p: 4,
            }}
          >
            <Box
              component="img"
              src={iconImg}
              alt="لوگوی ورود"
              sx={{
                width: '80px',
                height: 'auto',
                mb: 2,
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
              }}
            />

            <Typography
              component="h1"
              variant="h4"
              sx={{
                textAlign: 'center',
                fontWeight: 700,
                mb: 1,
                color: 'primary.main',
                textShadow: '0 1px 2px rgba(0,0,0,0.05)',
              }}
            >
              سامانه جامع بازرسی و ایمنی آجا (امین)
            </Typography>
            <Typography
              component="h2"
              variant="h6"
              sx={{
                mb: 3,
                color: 'text.secondary',
                fontWeight: 500,
              }}
            >
              ورود کاربر
            </Typography>

            {error && (
              <Alert
                severity="error"
                sx={{
                  width: '100%',
                  mb: 3,
                  boxShadow: '0 2px 8px rgba(211, 47, 47, 0.2)',
                }}
              >
                {error}
              </Alert>
            )}

            <Box sx={{ width: '100%' }}>
              <FormBuilder
                fields={fields}
                onSubmit={handleSubmit}
                submitButtonText={loginLoading ? 'در حال ورود...' : 'ورود'}
                showResetButton={false}
                loading={loginLoading}
              />
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
