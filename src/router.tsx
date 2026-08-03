import { createBrowserRouter, redirect } from 'react-router';
import SimpleLayout from '@/components/layout/SimpleLayout.tsx';
import ResearchRoutes from '@/modules/research/routes.tsx';
import OrganizationRoutes from '@/modules/organization-structure/routes';
import PlanningRoutes from '@/modules/planning/routes';
import SafetyRoutes from '@/modules/safety/routes';
import AuthRoutes from '@/modules/auth/routes';
import EvaluationRoutes from '@/modules/evaluation/routes.tsx';
import SecurityRoutes from './modules/security-keycloak/routes';
import InspectionRoutes from './modules/inspection-operation/routes';
import BaseInfoRoutes from './modules/base-info/routes';

import DocsRoutes from '@/docs/routes.tsx';
import Test from '@/Test.tsx';
import { authLoader } from '@/lib/authLoader.ts';
import ProcessRoutes from './modules/process/routes';

import UnitPortalRoutes from 'modules/unit-portal/routes.tsx';
import GuideRoutes from 'modules/guide/routes.tsx';
import OracleAppexDashboardRoutes from './modules/reports/routes';
import NotFoundPage from './components/NotFoundPage';
import AmarRoutes from './modules/amar/routs';
import DashboardLayout from './components/layout/DashboardLayout';
import Amar from './modules/amar/Amar';
import CartableRoutes from './modules/cartableN/routes';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <SimpleLayout />,
    children: [...AuthRoutes],
  },
  {
    path: '/',
    element: <DashboardLayout />,
    loader: authLoader,
    children: [
      {
        index: true,
        loader: () => redirect('/amar'),
      },
      // {
      //   path: 'amar',
      //   element: <Amar />,
      // },
      // ...DocsRoutes,
      // ...CartableRoutes,
      // ...OrganizationRoutes,
      // ...ResearchRoutes,
      // ...PlanningRoutes,
      // ...SafetyRoutes,
      // ...EvaluationRoutes,
      // ...BaseInfoRoutes,
      // ...SecurityRoutes,
      // ...InspectionRoutes,
      // ...ProcessRoutes,
      // ...UnitPortalRoutes,
      // ...GuideRoutes,
      // ...OracleAppexDashboardRoutes,
      ...AmarRoutes,
      ...CartableRoutes,
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
