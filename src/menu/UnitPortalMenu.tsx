import type { MenuItem } from './index';
import { MilitaryTech } from '@mui/icons-material';

const UnitPortalMenu: MenuItem[] = [
  {
    icon: <MilitaryTech />,
    title: 'پیش بازدید و بازدید فرماندهی',
    slug: 'unit-portal-visit',
    path: '/unit-portal/provincial-inspections'
  },
];

export default UnitPortalMenu;
