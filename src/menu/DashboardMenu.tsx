import type { MenuItem } from './index';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CasesIcon from '@mui/icons-material/Cases';
import {
  // ChatRounded,
  // Dashboard,
  // People,
  // Notifications,
  // ShoppingCart,
  // Analytics,
  // AccountCircle,
  // Cartable,
  // DashboardIcon,
  Message,
  Settings,
} from '@mui/icons-material';

const DashboardMenu: MenuItem[] = [
  {
    icon: <DashboardIcon />,
    title: 'داشبورد',
    slug: 'dashboard',
    path: 'dashboard',
    // children: [
    // {
    //   icon: <Dashboard />,
    //   title: 'داشبورد عملیات بازرسی و پیگیری',
    //   slug: 'dashboard',
    //   path: 'oracle-appex-dashboard'
    // },
    // {
    //   icon: <People />,
    //   title: 'داشبورد ارزیابی و نظرسنجی',
    //   slug: 'dashboard',
    //   path: 'oracle-appex-assessment'
    // },
    // {
    //   icon: <Notifications />,
    //   title: 'داشبورد صیانت و رسیدگی ها',
    //   slug: 'dashboard',
    //   path: 'oracle-appex-sianat'
    // },
    // {
    //   icon: <Settings />,
    //   title: 'داشبورد ایمنی و رسیدگی به سوانح',
    //   slug: 'dashboard',
    //   path: 'oracle-appex-safety'
    // },
    // {
    //   icon: <Analytics />,
    //   title: 'داشبورد طرح و برنامه و تجزیه و تحلیل',
    //   slug: 'dashboard',
    //   path: 'oracle-appex-plan'
    // },
    // {
    //   icon: <AccountCircle />,
    //   title: 'داشبورد اداری و پشتیبانی',
    //   slug: 'dashboard',
    //   path: 'oracle-appex-dashboard'
    // },
    // {
    //   icon: <AccountCircle />,
    //   title: 'داشبورد معاونت بازرسی',
    //   slug: 'dashboard',
    //   path: 'oracle-appex-dashboard'
    // }
    // ],
  },
  {
    icon: <CasesIcon />,
    title: 'کارتابل',
    slug: 'cartable',
    path: 'cartable',
  },
  {
    icon: <Message />,
    title: 'پیام',
    slug: 'message',
    path: 'message',
  },
  {
    icon: <Settings />,
    title: 'مدیریت کاربران',
    slug: 'user-management',
    path: 'user-management',
  },
];

export default DashboardMenu;
