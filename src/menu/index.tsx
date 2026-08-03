// import CartableMenu from './CartableMenu';
// import PlaningMenu from './PlanningMenu';
// import OperationMenu from './OperationMenu';
// import EvaluationMenu from './EvaluationMenu';
// import SiyanatMenu from './SiyanatMenu';
// import SafetyMenu from './SafetyMenu';
// import OrganizationMenu from './OrganizationMenu';
// import SecurityMenu from './SecurityMenu';
// import BaseInfoMenu from './BaseInfoMenu';
// import UnitPortalMenu from '@/menu/UnitPortalMenu.tsx';
// import GuideMenu from '@/menu/GuideMenu.tsx';
import DashboardMenu from './DashboardMenu';
// import AmarRoutes from '@/modules/amar/routs';

export interface MenuItem {
  title: string;
  icon?: React.ReactNode;
  path?: string;
  children?: MenuItem[];
  slug?: string;
}

export const sidebarMenu: MenuItem[] = [
  // ...AmarRoutes,
  ...DashboardMenu,
  // ...GuideMenu,
];
