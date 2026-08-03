import type { MenuItem } from './index';
import {
  Description,
  Insights,
  LocalPolice
} from '@mui/icons-material';

const SiyanatMenu: MenuItem[] = [
  {
    icon: <LocalPolice />,
    title: 'صیانت و رسیدگی ها',
    slug: 'preservation',
    children: [
      {
        icon: <Description />,
        title: 'رسیدگی ها',
        slug: 'preservation-followups',
        path: '/preservation/followups',
      },
      {
        icon: <Insights />,
        title: 'تجزیه و تحلیل',
        slug: 'preservation-analysis',
        path: '/preservation/analysis',
      },
      {
        icon: <LocalPolice />,
        title: 'اقدامات صیانتی و پیشگیرانه',
        slug: 'preservation-prevention',
        path: '/preservation/prevention',
      },
    ],
  },
];
export default SiyanatMenu;
