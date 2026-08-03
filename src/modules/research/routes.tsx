import { EliteList } from '@/modules/research/elite/EliteList.tsx';

const ResearchRoutes = [
  {
    path: 'research',
    children: [
      {
        path: 'elites',
        element: <EliteList />,
      }
    ]
  }
]

export default ResearchRoutes;