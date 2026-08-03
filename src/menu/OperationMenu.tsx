import type { MenuItem } from './index';
import {
  AccountBox,
  HistoryEdu,
  TravelExplore,
  Troubleshoot,
  MilitaryTech,
  Assignment,
  ListAlt,
} from '@mui/icons-material';

const OperationMenu: MenuItem[] = [
  {
    icon: <Troubleshoot />,
    title: 'عملیات بازرسی و پیگیری',
    slug: 'operation',
    children: [
      {
        icon: <HistoryEdu />,
        title: 'طرح‌ریزی بازرسی‌ها و بازدیدها',
        slug: 'operation-planning',
        children: [
          {
            title: 'طرح‌ریزی بازرسی',
            slug: 'operation-planning-aja',
            path: '/operation/planning/aja',
          },
          {
            title: 'طرح‌ریزی تخصصی معاونت‌ها',
            slug: 'operation-planning-deputy',
            path: '/operation/planning/deputy',
          },
          {
            title: 'طرح‌ریزی تجمیعی حوزه‌های بازرسی',
            slug: 'operation-planning-scope',
            path: '/operation/planning/scope',
          },
        ],
      },
      {
        icon: <TravelExplore />,
        title: 'عملیات بازرسی (اجرا)',
        slug: 'operation-execution',
        children: [
          {
            title: 'لیست بازبینه های بازرس',
            slug: 'operation-inspector-reviews',
            path: '/operation/inspector-reviews',
          },
          {
            title: 'بازرسی برنامه ای [سیستماتیک (میدانی)]',
            slug: 'operation-execution-scheduled-inspection',
            path: '/operation/scheduled-inspection',
          },
          {
            title:
              'بازرسی برنامه ای به روش خودارزیابی با نظارت سلسله مراتب سازمانی',
            slug: 'operation-execution-self-assessment',
            path: '/operation/self-assessment',
          },
          {
            title: 'بازرسی راستی آزمایی',
            slug: 'operation-verification',
            path: '/operation/verification',
          },
          {
            title: 'بازرسی غیرمترقبه خاص',
            slug: 'operation-execution-special-unexpected-visits',
            path: '/operation/unexpected-inspection',
          },
          {
            title: 'نظارت ستادی',
            slug: 'operation-execution-supervision',
            path: '/operation/execution/supervision',
          },
        ],
      },
      {
        icon: <AccountBox />,
        title: 'پیگیری مصوبات',
        slug: 'operation-followup',
        children: [
          {
            title: 'یگان',
            slug: 'operation-planning-followup-followup',
            path: '/operation/planning/followup/followup',
          },
          {
            title: 'بازرسی پیگیری (میدانی)',
            slug: 'operation-followup-results',
            path: '/operation/followup/results',
          },
          {
            title: 'بازرس ',
            slug: 'operation-planning-followup-inspectorreviewtable',
            path: '/operation/planning/followup/inspectorreviewtable',
          },
        ],
      },
      {
        icon: <MilitaryTech />,
        title: 'بازدیدهای فرماندهی کل',
        slug: 'operation-commander-visit',
        children: [
          // {
          //   title: 'بازرسی و ارزیابی توان آمادگی رزم (پیش بازدید)',
          //   slug: 'operation-commander-visit-evaluation',
          //   path: '/operation/commander/visit/evaluation',
          // },
          {
            title: 'بازدید فرماندهی از توان و آمادگی رزم (استانی)',
            slug: 'operation-commander-visit-province',
            path: '/operation/commander/visit/province',
          },
          {
            title: 'گزاشات فرماندهی',
            slug: 'operation-commander-visit-province',
            path: '/operation/commander/visit/reports',
          },
        ],
      },
      {
        icon: <Assignment />,
        title: 'گزارشات',
        slug: 'reports',
        children: [
          {
            title: 'داشبورد عملیات بازرسی',
            slug: 'reports-operation',
            path: 'operation/planning/dashboard',
          },
        ],
      },
      {
        icon: <ListAlt />,
        title: 'بازرسی‌های جاری',
        slug: 'head-inspector-inspections',
        path: 'operation/head-inspector/inspections',
      },
    ],
  },
];

export default OperationMenu;
