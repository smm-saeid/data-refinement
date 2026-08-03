import type { MenuItem } from './index';
import {
  Grading,
  QueryStats,
  TrendingUp,
  ChecklistSharp,
  FindReplace,
  LocationSearching
} from '@mui/icons-material';

const evaluationMenu: MenuItem[] = [
  {
    icon: <QueryStats />,
    title: 'ارزیابی و نظر سنجی',
    slug: 'evaluation',
    children: [
      {
        title: 'ارزشیابی',
        icon: <Grading />,
        slug: 'evaluation-evaluation',
        path: '/evaluation/evaluation',
      },
      {
        title: 'رشد و تعالی',
        icon: <TrendingUp />,
        slug: 'evaluation-development',
        path: '/evaluation/development',
      },
      {
        title: 'ارزیابی',
        icon: <ChecklistSharp />,
        slug: 'evaluation-assessment',
        children: [
          {
            title: 'ارزیابی کارایی سالانه',
            slug: 'evaluation-assessment-annual',
            path: '/evaluation/assessment/annual',
          },
          {
            title: 'اعلام نظریه',
            slug: 'evaluation-assessment-result',
            path: '/evaluation/assessment/result',
          },
        ]
      },
      {
        title: 'انتصابات',
        icon: <FindReplace />,
        slug: 'evaluation-appointments',
        children: [
          {
            title: 'اعلام نظریه انتصابات',
            slug: 'evaluation-appointments-result',
            path: '/evaluation/appointments/result',
          },
          {
            title: 'جوانگرایی و میانگین سن خدمتی',
            slug: 'evaluation-youth-orientation',
            path: '/evaluation/youth-orientation',
          },
        ]
      },
      {
        icon: <LocationSearching />,
        title: 'همتایابی و جانشین‌پروری',
        path: '/evaluation/matching',
        slug: 'evaluation-matching',
      },
    ],
  },
];

export default evaluationMenu;
