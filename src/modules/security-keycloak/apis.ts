const module = 'keycloak';

const keycloakApis = {
  role: {
    list: `${module}/role/getRoles`,
    assign: `${module}/user/assignRole`,
    create: `${module}/role/createRole`,
    update: `${module}/role/updateRole`,
    delete: `${module}/role/deleteRole`,
  },
  user: {
    getByRole: `${module}/user/getUsersByRoleName`,
    search: `${module}/user/getUsersAndRolesWithSearch`,
    assignRole: `${module}/user/createRole/roles`,
    removeRole: `${module}/user/deleteRole/roles`,
    create: 'keycloak/user/createUser',
    update: 'keycloak/user/updateUser',
    delete: 'keycloak/user/deleteUser',
    resetPassword: 'keycloak/user/resetPassword',
  },
  menu: {
    list: `menus/getAllMenus`,
    create: `menus/create`,
    update: `menus/update`,
    delete: `menus/deleteMenuById`,
  },
  menuRoleMapping: {
    byRole: 'menuRoleMappings/byRole',
    assign: 'menuRoleMappings/assignRole',
    delete: 'menuRoleMappings/deleteRoleMappingById',
  },
  settings: {
    list: 'v1/l4/configs',
    update: 'v1/l4/configs/update',
  },
  commonPasswords: {
    list: 'common-passwords',
    create: 'common-passwords',
    update: 'common-passwords',
    delete: 'common-passwords',
  },
  passwordPolicy: {
    get: 'password-policy/display',
    display: `/password-policy/display`,
    update: `/password-policy/update`,
  },
  loginReport: {
    list: 'keycloak/admin/login/report',
    token: 'keycloak/realms/keycloak-security/protocol/openid-connect/token',
  },
  securityEvents: {
    list: `${module}/user/event`
  },
  log: {
    list: 'log/findAllLog',
  },
  lockManagement: {
    search: 'lock-management/search',
    unlock: 'lock-management/unlock',
    delete: 'lock-management/delete',
  },
  session: {
    list: 'keycloak/user/session',
    terminate: 'keycloak/user/terminateSession',
  },
  bruteForce: {
    get: 'brute-force/display',
    update: 'brute-force/update',
  },
  terms: {
    list: `terms-conditions/get-all`,
    create: `terms-conditions/create`,
    update: `terms-conditions/update`,
    delete: `terms-conditions/delete`,
  },
  password: {
    policy: `password-policy/display`,
    change: `${module}/resetPassword/changePassword`,
    resetByNationalCode: `${module}/resetPassword/byNationalCode`,
  },
};

export default keycloakApis;
