import {
  AddBox,
  AdUnits,
  Calculate,
  Share,
  Streetview,
} from '@mui/icons-material';
import type { MenuItem } from './index';

const OrganizationMenu: MenuItem[] = [
  {
    icon: <Share />,
    title: 'ساختار سازمانی',
    path: 'organization-structure',
    slug: 'organization-structure',
    children: [
      {
        icon: <AdUnits />,
        title: '  یگان ها',
        path: 'units',
        slug: 'organization-structure-units',
        children: [
          {
            icon: <Streetview />,
            title: '  نمایش درختی ',
            path: 'units-tree',
            slug: 'organization-structure-units-tree',
          },
          {
            icon: <Calculate />,
            title: '   عملیات های  سازمانی',
            path: 'organization-crud',
            slug: 'organization-structure-organization-crud',
          },
          {
            icon: <AddBox />,
            title: ' افزودن یگان ',
            path: 'unit-add',
            slug: 'organization-structure-unit-add',
          },
        ],
      },
    ],
  },
];

export default OrganizationMenu;
