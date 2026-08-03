import type { MenuItem } from './index';
import {
  Error,
  CrisisAlert,
  FireTruck,
  TrendingUp
} from '@mui/icons-material';

const SafetyMenu: MenuItem[] = [
  {
    icon: <CrisisAlert />,
    title: 'ایمنی و رسیدگی به سوانح',
    slug: 'safety',
    children: [
      {
        icon: <Error />,
        title: 'پیشگیری از سانحه',
        slug: 'safety-prevention',
        children: [
          {
            title: 'مدیریت گزارش ها و خبرها',
            slug: 'safety-prevention-news',
            path: 'safety/prevention/news',
          },
          {
            title: 'پیگیری رفع عوامل بروز سانحه',
            slug: 'safety-prevention-causes',
            path: 'safety/prevention/causes',
          },
          {
            title: 'اصلاح فرآیندهای معیوب',
            slug: 'safety-prevention-defective-processes',
            path: 'safety/prevention/defective-processes',
          },
          {
            title: 'استقرار نظام مدیریت دانش ایمنی',
            slug: 'safety-prevention-knowledge',
            path: 'safety/prevention/knowledge',
          },
        ],
      },
      {
        icon: <FireTruck />,
        title: 'مواجهه با رخداد',
        slug: 'safety-incident',
        children: [
          {
            title: 'تعیین اطلس تجهیزاتی',
            slug: 'safety-incident-equipment-atlas',
            path: 'safety/incident/equipment-atlas',
          },
          {
            title: 'استفرار سیستم مدیریت ایمنی',
            slug: 'safety-incident-knowledge',
            path: 'safety/incident/knowledge',
          },
          {
            title: 'استقرار نظام تجزیه و تحلیل یکپارچه',
            slug: 'safety-incident-analysis',
            path: 'safety/incident/analysis',
          },
          {
            title: 'استقرار نظام تعاملات ایمنی',
            slug: 'safety-incident-interactions',
            path: 'safety/incident/interactions',
          },
          {
            title: 'استقرار نظام بهره‌وری و تضمین کیفیت',
            slug: 'safety-incident-quality-control',
            path: 'safety/incident/quality-control',
          },
          {
            title: 'استانداردسازی فرآیندهای تولید و عملیات آجا',
            slug: 'safety-incident-aja-processes',
            path: 'safety/incident/aja-processes',
          },
          {
            title: 'استقرار نظام نظارت عالی ایمنی',
            slug: 'safety-incident-supervision',
            path: 'safety/incident/supervision',
          },
        ],
      },
      {
        icon: <TrendingUp />,
        title: 'رشد و توسعه پایدار ایمنی',
        slug: 'safety-development',
        children: [
          {
            title: 'ایجاد و اجرای راهبرد های پیشگیرانه ایمنی',
            slug: 'safety-development-prevention',
            path: 'safety/development/prevention',
          },
          {
            title: 'آموزش و توانمندسازی ایمنی',
            slug: 'safety-development-education',
            path: 'safety/development/education',
          },
          {
            title: 'ارزیابی و تحلیل مداوم',
            slug: 'safety-development-evaluation',
            path: 'safety/development/evaluation',
          },
          {
            title: 'نظارت بازخورد و بهبود مقاوم',
            slug: 'safety-development-supervision',
            path: 'safety/development/supervision',
          },
          {
            title: 'فرهنگ سازی ایمنی',
            slug: 'safety-development-cultivation',
            path: 'safety/development/cultivation',
          },
        ],
      },
    ],
  },
];
export default SafetyMenu;
