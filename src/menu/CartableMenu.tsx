import type { MenuItem } from './index';
import { AssignmentAdd, EmailOutlined } from '@mui/icons-material';

const CartableMenu: MenuItem[] = [
  {
    icon: <AssignmentAdd />,
    title: 'کارتابل',
    slug: 'cartable',
    path: '/cartable',
  },
  {
    icon: <EmailOutlined />,
    title: 'ایجاد ابلاغیه',
    slug: 'notice',
    path: '/notice',
  },
];

export default CartableMenu;
