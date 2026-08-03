
import UnitAdd from './units/UnitAdd.tsx';
import UnitsList from './units/UnitsList.tsx';
import UnitsTree from './units/UnitsTree';

const OrganizationRoutes = [
  {
    path: 'organization',
    element: <UnitsList />,
  },
  {
    path: 'unit-add',
    element: <UnitAdd />,
  },
  {
    path: 'units-tree',
    element: <UnitsTree />,
  },
  {
    path: 'organization-crud',
    element: <UnitsList />,
  },
];

export default OrganizationRoutes;
