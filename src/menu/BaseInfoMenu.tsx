import type { MenuItem } from './index';
import { EditNote } from '@mui/icons-material';

const BaseInfoMenu: MenuItem[] = [
  {
    icon: <EditNote />,
    title: 'اطلاعات پایه',
    slug: 'base-info',
    path: 'base-info',
    children: [
      {
        title: 'ثبت اطلاعات',
        slug: 'base-info-type',
        path: 'base-info-type',
      },
      {
        title: 'ثبت نوع یگان',
        slug: 'base-info-organization-type',        
        path: 'base-info-organization-type',
      },
    ],
  },
];

export default BaseInfoMenu;
