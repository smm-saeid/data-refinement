import type { MenuItem } from './index';
import {
  Architecture,
  Draw,
  ManageSearch,
  Insights,
  School,
} from '@mui/icons-material';

const PlaningMenu: MenuItem[] = [
  {
    icon: <Architecture />,
    title: 'طرح و برنامه و تجزیه و تحلیل',
    slug: 'planning',
    children: [
      {
        title: 'طرح ریزی',
        icon: <Draw />,
        slug: 'planning-planning',
        children: [
          {
            title: 'اهداف و برنامه ها',
            slug: 'planning-planning-goals',
            path: '/planning/planning/goals',
          },
          {
            title: 'برنامه ریزی و تامین منابع',
            slug: 'planning-planning-programming',
            path: '/planning/planning/programming',
          },
          {
            title: 'طرح ریزی بازرسی ها',
            slug: 'planning-planning-inspections',
            path: '/planning/planning/inspections',
          },
          {
            title: 'برنامه ریزی دوره‌ های آموزشی و حین خدمت',
            slug: 'planning-planning-courses',
            path: '/planning/planning/courses',
          },
        ],
      },
      {
        title: 'نظارت و کنترل برنامه',
        icon: <ManageSearch />,
        slug: 'planning-control',
        children: [
          {
            title: 'گزارش پیشرفت اهداف و برنامه ها',
            slug: 'planning-control-goals',
            path: '/planning/control/goals',
          },
          {
            title: 'راهبری جلسات متشکله',
            slug: 'planning-control-meetings',
            path: '/planning/control/meetings',
          },
          {
            title: 'فناور محور نمودن بازرسی و ایمنی',
            slug: 'planning-control-technology',
            path: '/planning/control/technology',
          },
        ],
      },
      {
        title: 'تجزیه و تحلیل',
        icon: <Insights />,
        slug: 'planning-analysis',
        children: [
          {
            title: 'تجزیه و تحلیل',
            slug: 'planning-analysis-analysis',
            path: '/planning/analysis/analysis',
          },
          {
            title: 'ارزیابی اشراف',
            slug: 'planning-analysis-comprehension',
            path: '/planning/analysis/comprehension',
          },
          {
            title: 'فرایند اعلام نظریه تخصصی',
            slug: 'planning-analysis-specialized-result',
            path: '/planning/analysis/specialized-result',
          },
          {
            title: 'نظارت ستادی بازرسی و ایمنی ستادکل',
            slug: 'planning-control-technology',
            path: '/planning/control/technology',
          },
        ],
      },
      {
        title: 'آموزش',
        icon: <School />,
        slug: 'planning-research',
        children: [
          {
            title: 'اجرای دوره های آموزشی',
            slug: 'planning-research-courses',
            path: '/planning/research/courses',
          },
          {
            title: 'آیین نامه',
            slug: 'planning-research-regulation',
            path: '/planning/research/regulation',
          },
          {
            title: 'بازبینی فرایندها',
            slug: 'planning-research-process-review',
            path: '/planning/research/process-review',
          },
          {
            title: 'پروژه های تحقیقاتی',
            slug: 'planning-research-projects',
            path: '/planning/research/projects',
          },
          {
            title: 'تفکر و اندیشه ورزی',
            slug: 'planning-research-reasoning',
            path: '/planning/research/reasoning',
          },
          {
            title: 'تشکیل کمیته عالی آموزش',
            slug: 'planning-research-edu-council',
            path: '/planning/research/edu-council',
          },
          {
            title: 'مدیریت نخبگان',
            slug: 'planning-research-elites',
            path: '/planning/research/elites',
          },
          {
            title: 'نظام مسائل',
            slug: 'planning-research-issues',
            path: '/planning/research/issues',
          },
        ],
      },

    ],
  },
];

export default PlaningMenu;
