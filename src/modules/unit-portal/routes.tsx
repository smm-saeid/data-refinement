import ProvincialInspections from '@/modules/unit-portal/pages/ProvincialInspections.tsx';

const UnitPortalRoutes = [
  {
    path: 'unit-portal',
    children: [
      {
        path: 'provincial-inspections',
        children: [
          {
            index: true,
            element: <ProvincialInspections />,
          },
        ],
      },
    ],
  },
];

export default UnitPortalRoutes;
