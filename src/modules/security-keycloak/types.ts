export interface RoleQueryParams {
  name?: string;
  description?: string;
}

export interface CreateRoleRequest {
  name: string;
  description?: string;
  attributes?: Record<string, string[]>;
  composite?: boolean;
  composites?: {
    realm?: string[];
    client?: Record<string, string[]>;
  };
}

export interface RoleListResponse {
  data: Role[];
  meta?: {
    pagination?: {
      currentPage: number;
      pageSize: number;
      count: number;
      totalPages: number;
    };
  };
  message?: string;
  status: number;
}

/**
 * Request body for updating a role
 */
export interface UpdateRoleRequest {
  name?: string;
  description?: string;
  attributes?: Record<string, string[]>;
}

/**
 * Extended pagination with role-specific filters
 */
export interface RolePaginationQueryParam {
  page?: number;
  pageSize?: number;
  name?: string;
  description?: string;
}

export interface UserWithRoles {
  id: any;
  user: User;
  roles: Role[];
}

export interface UserQueryParams {
  searchTerm?: string;
  name?: string;
}

export interface AssignRoleRequest {
  roleName: string;
  userId: string;
}

export interface RemoveRoleRequest {
  roleName: string;
  userId: string;
}
export interface Menu {
  id: string;
  name: string;
  englishTitle: string;
  icon: string;
  link: string;
  style: string;
  className: string;
  comp: string;
  parentId?: string;
  parentName?: string;
  sensitive: boolean;
  disabled?: boolean;
}

export interface CreateMenuRequest {
  name: string;
  englishTitle: string;
  icon: string;
  link: string;
  style: string;
  className: string;
  comp: string;
  parentId?: string;
  sensitive: boolean;
  disabled?: boolean;
}

export interface UpdateMenuRequest extends CreateMenuRequest {
  id: string;
}

export interface MenuQueryParams {
  name?: string;
  englishTitle?: string;
}

export interface Menu {
  id: string;
  name: string;
  englishTitle: string;
  persianTitle: string;
  parentId?: string;
  children?: Menu[];
}

export interface MenuRoleMapping {
  id: string;
  menuName: string;
  roleName: string;
  persianTitle: string;
  englishTitle: string;
  canRead: boolean;
  canWrite: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

export interface AssignMenuRequest {
  menuName: string;
  roleName: string;
  canRead: boolean;
  canWrite: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

export interface PermissionSet {
  canRead: boolean;
  canWrite: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

export interface SystemSetting {
  key: string;
  value: string | boolean | number;
}

export interface CommonPassword {
  id: string;
  password: string;
}

export interface PasswordPolicy {
  uppercase_password_policy: boolean;
  number_password_policy: boolean;
  symbol_password_policy: boolean;
  prevent_common_password_policy: boolean;
  min_password_length: number;
  prevent_previous_password: number;
  password_expiration: number;
  max_login_attempt: number;
  lock_user_duration: number;
  token_expiration: number;
}

export interface SettingField {
  label: string;
  name: keyof PasswordPolicy;
  type: 'select' | 'switch' | 'input';
  defaultValue?: any;
  options?: () => Array<{ value: string; text: string }>;
  responsiveProperty?: {
    xs: number;
    sm: number;
    lg: number;
  };
  btnText?: string;
  btnType?: string;
  handleOnClick?: () => void;
}
export interface PasswordPolicy {
  forceExpiredPasswordChange: number;
  hashIterations: number;
  passwordHistory: number;
  regexPattern: string | null;
  notUsername: boolean;
  minLength: number;
  notEmail: boolean;
  specialChars: number;
  upperCase: number;
  lowerCase: number;
  digits: number;
  maxAuthAge: number;
  hashAlgorithm: string | null;
  maxLength: number;
  passwordBlacklist: string | null;
  accessTokenLifespan: number;
}

export interface PasswordPolicyRequest {
  paginationModel: {};
  searchModel: PasswordPolicy;
}
export interface LoginActivity {
  detailsJson: string;
  time: string;
  type: 'LOGIN' | 'LOGOUT' | 'LOGIN_ERROR' | 'LOGOUT_ERROR';
  ipAddress: string;
}

export interface LoginActivityDetails {
  username?: string;
}

export interface LoginReportQueryParams {
  username?: string;
  ipAddress?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
}

export interface LoginReportFilters {
  ipAddress: string;
  username: string;
  activityType: string;
  startDate: any;
  endDate: any;
}
export interface SecurityEvent {
  userId: string;
  details: ReactNode;
  detailsJson: string;
  time: string;
  type: SecurityEventType;
  ipAddress: string;
}

export type SecurityEventType =
  | 'LOGIN'
  | 'LOGOUT'
  | 'LOGIN_ERROR'
  | 'LOGOUT_ERROR'
  | 'CLIENT_LOGIN'
  | 'PERMISSION_TOKEN'
  | 'RESET_PASSWORD_ERROR'
  | 'CODE_TO_TOKEN_ERROR'
  | string;

export interface SecurityEventDetails {
  username?: string;
}

// types.ts - UPDATED
export interface SecurityEventsFilters {
  ipAddress: string;
  username: string;
  activityType: string;
  startDate: string | null; // MatnaDatePicker returns string in Gregorian format
  endDate: string | null; // MatnaDatePicker returns string in Gregorian format
}

export interface SecurityEventsQueryParams {
  paginationModel: {
    page: number;
    offset: number;
    pageSize: number;
  };
  searchModel?: {
    username?: string;
    ipAddress?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
  };
}
export interface LogEntry {
  id: string;
  clientIp: string;
  username: string;
  serviceName: string;
  requestUri: string;
  roles: string;
  message: string;
  time: string;
  status: number;
}

export interface LogQueryParams {
  clientIp?: string;
  username?: string;
  serviceName?: string;
  status?: string;
}

export interface LogFilters {
  clientIp: string;
  username: string;
  serviceName: string;
  status: string;
}
export interface LockedUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  ipAddress: string;
  lockDate: string;
  lockType: 'PERMANENT' | 'TEMPORARY';
  lockStatus: string;
}

export interface LockUserQueryParams {
  username?: string;
}

export interface UnlockUserRequest {
  username: string;
}
export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email?: string;
  enabled: boolean;
  attributes?: {
    unit_code: any;
    personnel_code: any;
    nationalityCode?: string[];
    degreeCode?: string[];
    unitCode?: string[];
    personnelCode?: string[];
  };
}

export interface Role {
  id: string;
  name: string;
  description?: string;
}

export interface UserWithRoles {
  user: User;
  roles: Role[];
}

export interface CreateUserRequest {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  nationalityCode: string;
  degreeCode: string;
  unitCode: string;
  personnelCode: string;
  enabled: boolean;
  credentials: {
    type: string;
    value: string;
    temporary: boolean;
  }[];
}

export interface UpdateUserRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  nationalityCode: string;
  degreeCode: string;
  unitCode: string;
  personnelCode: string;
  enabled: boolean;
}

export interface UserQueryParams {
  searchTerm?: string;
}
export interface ActiveSession {
  id: string;
  username: string;
  time: string;
  type: string;
  details: {
    username: string;
  };
}

export interface SessionQueryParams {
  offset?: number;
  limit?: number;
}

export interface TerminateSessionRequest {
  sessionId: string;
  username: string;
}
export interface BruteForceConfig {
  bruteForceProtected: boolean;
  failureFactor: number;
  maxTemporaryLockouts: number;
  bruteForceStrategy: string | null;
  waitIncrementSeconds: number;
  maxFailureWaitSeconds: number;
  maxDeltaTimeSeconds: number;
  quickLoginCheckMilliSeconds: number;
  minimumQuickLoginWaitSeconds: number;
}

export interface BruteForceConfigRequest {
  paginationModel: {};
  searchModel: BruteForceConfig;
}
export interface Term {
  onEdit: () => void;
  isDeleting: boolean;
  id: string;
  title: string;
  content: string;
  version: string;
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  createdBy?: string;
  createdDate?: string;
  modifyBy?: string;
  modifyDate?: string;
  deleted?: boolean;
}

export interface TermsResponse {
  responseList: Term[];
  // Add other response fields as needed
}

export interface TermsQueryParams {
  title?: string;
  status?: string;
}

export interface CreateTermRequest {
  title: string;
  content: string;
  version: string;
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
}

export interface UpdateTermRequest extends CreateTermRequest {
  id: string;
}

export interface DeleteTermRequest {
  id: string;
}
export interface PasswordPolicy {
  minLength: number;
  specialChars: number;
  upperCase: number;
  lowerCase: number;
  digits: number;
}

export interface PasswordValidation {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  specialChars: boolean;
  digits: boolean;
}

export interface PasswordInputs {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ChangePasswordRequest {
  paginationModel: Record<string, any>;
  searchModel: PasswordInputs;
}

// Or if it's a simpler structure:
// export interface ChangePasswordRequest {
//   currentPassword: string;
//   newPassword: string;
//   confirmNewPassword: string;
// } };
// }

export interface UserWithRoles {
  user: User;
  // roles: string[];
}

export interface UsersResponse {
  totalCount: number;
  responseList: Array<{
    data: Array<{
      users: UserWithRoles[];
    }>;
  }>;
  totalPages: number;
}

// In your types file (../../types.ts)
export interface ResetPasswordRequest {
  paginationModel: {
    offset: number;
    pageSize: number;
  };
  searchModel: {
    username: string;
    newPassword: string;
  };
}

export interface UserTableData {
  id: string;
  key: string;
  firstName: string;
  lastName: string;
  username: string;
  nationalityCode: string;
}

export interface UsersQueryParams {
  searchTerm?: string;
  currentPage?: number;
  page?: number;
  pageSize?: number;
}

export interface UserTableData {
  id: string;
  key: string;
  firstName: string;
  lastName: string;
  username: string;
  nationalityCode: string;
}

// new types
export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  personnelCode?: string;
  unitCode?: string;
  attributes?: {
    unit_code: any;
    personnel_code: any;
    personnelCode?: string[];
    unitCode?: string[];
  };
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  attributes?: Record<string, string[]>;
  composite?: boolean;
  clientRole?: boolean;
  containerId?: string;
}

export interface UserWithRoles {
  user: User;
  roles: Role[];
}

// Define the remove role mutation variables type
export interface RemoveRoleVariables {
  paginationModel: Record<string, any>;
  searchModel: {
    roleName: string;
    userId: string;
  };
}

export interface UserRoleTableProps {
  users: UserWithRoles[];
  loading: boolean;
  availableRoles: Role[];
  onEdit: (user: UserWithRoles) => void;
  onSuccess: () => void;
  selectedUser?: UserWithRoles; // Add this
  selectedRole?: Role; // Add this
  paginationModel?: { page: number; pageSize: number };
  onPaginationChange?: (model: { page: number; pageSize: number }) => void;
  rowCount?: number;
}
export interface ActionButtonsProps {
  userWithRoles: UserWithRoles;
  selectedRole: string;
  onRoleSelect: (userId: string, roleName: string) => void;
  onRemoveRole: (userId: string, roleName: string) => void;
  onEdit: (user: UserWithRoles) => void;
  removingUser: string | null;
}

// Query parameter types
export interface RoleListQueryParams {
  paginationModel: {
    pageSize: number;
  };
  searchModel: Record<string, any>;
}

export interface UsersByRoleQueryParams {
  paginationModel: {
    offset: number;
    pageSize: number;
  };
  searchModel: {
    name?: string;
  };
}

export interface UserRoleManagementProps {
  // Add any props if needed
}
// types/passwordPolicy.ts
export interface PasswordPolicy {
  forceExpiredPasswordChange: number;
  hashIterations: number;
  passwordHistory: number;
  regexPattern: string | null;
  notUsername: boolean;
  minLength: number;
  notEmail: boolean;
  specialChars: number;
  upperCase: number;
  lowerCase: number;
  digits: number;
  maxAuthAge: number;
  hashAlgorithm: string | null;
  maxLength: number;
  passwordBlacklist: string | null;
  accessTokenLifespan: number;
}

export interface PasswordPolicyResponse {
  responseList: PasswordPolicy[];
}

export interface PasswordPolicyRequest {
  paginationModel: Record<string, any>;
  searchModel: PasswordPolicy;
}
