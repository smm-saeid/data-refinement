import { SecurityEvents } from './log/events/SecurityEvents';
import LogHefa from './log/hefazat/LogHefa';
import { RoleManagement } from './roles/role-crud/RoleManagement';
import { RoleMenuManagement } from './roles/role-to-menu/RoleMenuManagement';
import { UserRoleManagement } from './roles/role-to-user/UserRoleManagement';
import { StandaloneRoleUserManagement } from './roles/role-user-manage/StandaloneRoleUserManagement';
import { MenuManagement } from './system/menu/MenuManagement';
import { PasswordPolicy } from './system/password-policy/PasswordPolicy';
import { BruteForceSettings } from './system/password-setting/BruteForceSettings';
import { TermsList } from './system/policy-terms/TermsList';
import { SystemSettings } from './system/system/SystemSettings';
import { SessionManagementEnhanced } from './users/activity-session/SessionManagementEnhanced';
import { ChangePassword } from './users/change-password-admin/ChangePassword';
import { LockManagementEnhanced } from './users/lock-users/LockManagementEnhanced';
import { UserManagement } from './users/manage-users/UserManagement';
import { ResetPassword } from './users/reset-password/ResetPassword';

const SecurityRoutes = [
  //roles
  {
    path: 'security-role-crud',
    element: <RoleManagement />,
  },
  {
    path: 'security-role-to-user',
    element: <UserRoleManagement />,
  },
  // role search
  {
    path: 'security-role-user-manage',

    element: <StandaloneRoleUserManagement />,
  },
  {
    path: 'security-role-to-menu',
    element: <RoleMenuManagement />,
  },

  // menu
  {
    path: 'security-menu-crud',
    element: <MenuManagement />,
  },

  // system
  {
    path: 'security-system-system',
    element: <SystemSettings />,
  },

  //password-policy

  {
    path: 'security-system-pasword-policy',
    element: <PasswordPolicy />,
  },

  //manage-users
  {
    path: 'security-users-manage',
    element: <UserManagement />,
  },

  //lock-users
  {
    path: 'security-users-lock',
    element: <LockManagementEnhanced />,
  },

  //activity-session
  {
    path: 'security-users-session',
    element: <SessionManagementEnhanced />,
  },

  //password setting

  {
    path: 'security-system-password-setting',
    element: <BruteForceSettings />,
  },
  // policy terms
  {
    path: 'security-system-terms',

    element: <TermsList />,
  },

  // reset-password
  {
    path: 'security-users-reset-password',

    element: <ResetPassword />,
  },

  // change
  {
    path: 'security-users-change-password',

    element: <ChangePassword />,
  },

  // events logs
  {
    path: 'security-logs-events',

    element: <SecurityEvents />,
  },

  // hefa logs
  {
    path: 'security-logs-hefazat',

    element: <LogHefa />,
  },
];

export default SecurityRoutes;
