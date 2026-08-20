import { type MouseEvent, useEffect, useRef, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Badge,
} from '@mui/material';
import ajaLogo from '@/assets/aja-logo.png';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { Logout } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { useLegacyApi } from 'hooks/useLegacyApi.ts';
import { useQuery } from '@tanstack/react-query';
import CartableApis from 'modules/cartable/apis.ts';

export default function Header() {
  const navigate = useNavigate();
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const legacyApi = useLegacyApi();
  const profileOpen = Boolean(profileAnchorEl);

  const [notifOpen, setNotifOpen] = useState(false);

  // Handlers
  const handleProfileClick = (event: MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setProfileAnchorEl(null);
  };

  const notificationElement = useRef(null);
  const [pendingCartableItemsCount, setPendingCartableItemsCount] =
    useState(null);
  const [notification, setNotification] = useState<string>(
    'شما هیچ پیامی ندارید.'
  );

  const { data: cartableItems } = useQuery({
    queryKey: ['cartableItemsCount'],
    queryFn: () => legacyApi.get(CartableApis.countByStatus),
    refetchInterval: 60000,
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    if (cartableItems) {
      const inProgressItem = cartableItems.find(
        i => i.tab === 'PENDING' || i.tab === 'IN_PROGRESS'
      );
      if (inProgressItem) {
        if (
          pendingCartableItemsCount === null ||
          inProgressItem?.count < pendingCartableItemsCount
        ) {
          setPendingCartableItemsCount(inProgressItem?.count);
          setNotification(
            `${inProgressItem?.count} گردشکار در کارتابل شما قرار گرفته است. لطفا از قسمت کارتابل بررسی کنید.`
          );
        }

        if (
          inProgressItem?.count > pendingCartableItemsCount &&
          pendingCartableItemsCount !== null
        ) {
          setPendingCartableItemsCount(inProgressItem?.count);
          setNotification(
            'یک گردشکار جدید در کارتابل شما قرار گرفته است. لطفا از قسمت کارتابل بررسی کنید.'
          );
          setNotifOpen(true);
        }
      }
    }
  }, [cartableItems]);

  // const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: '1rem',
            py: { xs: 5, sm: 0.5 },
          }}
        >
          {/* Logo + Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <img
              src={ajaLogo}
              alt="لوگو سامانه بازرسی"
              width="55px"
              height="55px"
            />
            <Typography variant="h6" sx={{ px: '1rem' }}>
              سامانه بار گذاری اطلاعات داده آمائی
            </Typography>
          </Box>

          {/* Icons */}
          <Box sx={{ display: 'flex', gap: { xs: 1, sm: 1 } }}>
            {/* <Box display={'flex'} flexDirection={'column'}>
              <Typography
                sx={{ color: 'white', fontWeight: 400 }}
                alignContent={'center'}
              >
                {loggedInUser.firstName + ' ' + loggedInUser.lastName}
              </Typography>
              <Typography
                display={'flex'}
                justifyContent={'center'}
                fontSize={'13px'}
                color="#e5e5e5"
              >
                {loggedInUser.roles && Array.isArray(loggedInUser.roles)
                  ? loggedInUser.roles.filter(i => i.roleName != 'end_user')[0]
                      ?.roleDescription
                  : '---'}
              </Typography>
            </Box> */}

            <IconButton
              ref={notificationElement}
              onClick={() => setNotifOpen(true)}
              sx={{ color: 'white' }}
            >
              <Badge badgeContent={pendingCartableItemsCount} color="error">
                <NotificationsActiveIcon />
              </Badge>
            </IconButton>

            <IconButton onClick={handleProfileClick} sx={{ color: 'white' }}>
              <PersonOutlineIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationElement.current}
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          '& .MuiPaper-root': {
            minWidth: 350,
            mt: 1,
            direction: 'lrt',
          },
        }}
      >
        <MenuItem sx={{ py: 1.5 }}>{notification}</MenuItem>
      </Menu>

      {/* Profile Menu */}
      <Menu
        anchorEl={profileAnchorEl}
        open={profileOpen}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          '& .MuiPaper-root': {
            mt: 1,
            direction: 'lrt',
            py: 1,
            minWidth: 180,
          },
        }}
      >
        <MenuItem onClick={handleMenuClose}>پروفایل</MenuItem>

        <MenuItem
          onClick={() => navigate('/login')}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: 2,
          }}
        >
          <Typography sx={{ color: 'error.main', fontWeight: 400 }}>
            خروج
          </Typography>
          <Logout sx={{ width: 25, height: 25 }} />
        </MenuItem>
      </Menu>
    </>
  );
}
