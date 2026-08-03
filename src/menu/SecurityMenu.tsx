import {
  AdminPanelSettings,
  AppBlocking,
  AssistWalker,
  Camera,
  Chair,
  EmojiEvents,
  EventAvailable,
  Face,
  Face2,
  Face3,
  HorizontalRule,
  LockOpen,
  Login,
  ManageAccounts,
  ManageSearch,
  MenuBook,
  MenuOpen,
  Password,
  Person,
  PhotoCamera,
  PrivateConnectivity,
  RepeatOn,
  Security,
  Settings,
  SettingsTwoTone,
  Style,
  VerifiedUserSharp,
  WifiPassword,
} from '@mui/icons-material';
import type { MenuItem } from './index';

const SecurityMenu: MenuItem[] = [
  {
    icon: <Security />,
    title: 'امنیت',
    slug: 'security',
    path: 'security',
    children: [
      {
        icon: <VerifiedUserSharp />,
        title: '  مدیریت نقش ها',
        slug: 'security-role',
        path: 'roles',
        children: [
          {
            icon: <Style />,
            title: ' ایجاد نقش',
            slug: 'security-role-crud',
            path: 'security-role-crud',
          },
          {
            icon: <PrivateConnectivity />,
            slug: 'security-role-user-connect',
            title: ' اتصال نقش به کاربر ',
            path: 'security-role-to-user',
          },
          {
            icon: <ManageSearch />,
            slug: 'security-role-user-management',
            title: ' مدیریت نقش  کاربر ',
            path: 'security-role-user-manage',
          },
          {
            icon: <MenuBook />,
            slug: 'security-role-menu-connect',
            title: ' اتصال منو به نقش  ',
            path: 'security-role-to-menu',
          },
        ],
      },
      {
        icon: <Camera />,
        title: ' مدیریت لاگ ها',
        path: 'logs',
        children: [
          // {
          //   icon: <Login />,
          //   title: ' نظارت ورود و خروج ',
          //   path: 'security-logs-login',
          // },
          {
            icon: <EventAvailable />,
            title: ' نظارت وقایع امنیتی ',
            path: 'security-logs-events',
          },
          {
            icon: <Face />,
            title: ' لاگ های حفاظت  ',
            path: 'security-logs-hefazat',
          },
        ],
      },
      {
        icon: <Person />,
        title: ' مدیریت کاربران ',
        path: 'users',
        children: [
          {
            icon: <Password />,
            title: ' تغییر رمز ',
            path: 'security-users-change-password',
          },
          {
            icon: <RepeatOn />,
            title: '  رمز مجدد  ',
            path: 'security-users-reset-password',
          },
          {
            icon: <LockOpen />,
            title: 'کاربران لاک شده  ',
            path: 'security-users-lock',
          },
          // {
          //   icon: <Chair />,
          //   title: ' نشست فعال  ',
          //   path: 'security-users-session',
          // },
          // {
          //   icon: <ManageAccounts />,
          //   title: ' ایجاد کاربران  ',
          //   path: 'security-users-manage',
          // },
        ],
      },
      {
        icon: <Settings />,
        title: ' مدیریت سیستم ',
        slug: 'security-system',
        path: 'system',
        children: [
          // {
          //   icon: <SettingsTwoTone />,
          //   title: ' تنظیمات سامانه  ',
          //   path: 'security-system-system',
          // },
          {
            icon: <WifiPassword />,
            title: '   تنظیمات رمز عبور   ',
            path: 'security-system-pasword-policy',
          },
          {
            icon: <MenuOpen />,
            title: ' مدیریت منو  ',
            slug: 'security-system-menu',
            path: 'security-menu-crud',
          },
          {
            icon: <AssistWalker />,
            title: 'تنظیمات ورود به سامانه ',
            path: 'security-system-password-setting',
          },
          {
            icon: <HorizontalRule />,
            title: ' قوانین سامانه  ',
            path: 'security-system-terms',
          },
        ],
      },
    ],
  },
];

export default SecurityMenu;
