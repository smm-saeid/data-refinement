export interface PaginationModel {
  pageSize: number;
  offset: number;
  sortBy?: string;
  sortDirection?: string;
  value?: any;
  extended?: string;
}

export interface SearchModel {
  clientIp?: string;
  username?: string;
  serviceName?: string;
  status?: string;
  startTime?: string;
  endTime?: string;
  timeStamp?: string;
  timeOccurrence?: string;
  actionType?: string;
  actionSubType?: string;
  actionId?: number;
  actionFlag?: string;
  actionSensitivity?: string;
  userName?: string;
  nationalId?: string;
  firstName?: string;
  lastName?: string;
  employeeNum?: string;
  orgUniqueId?: number;
  targetUserName?: string;
  targetNationalId?: string;
  targetEmployeeNum?: string;
}

export interface LogRequest {
  paginationModel: PaginationModel;
  searchModel: SearchModel;
}

export interface LogResponse {
  totalPages: number;
  totalElements: number;
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      empty: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  first: boolean;
  size: number;
  content: LogEntry[];
  number: number;
  sort: {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
  };
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface LogEntry {
  id?: number;
  clientIp: string;
  username: string;
  serviceName: string;
  status: number;
  message: string;
  roles: string;
  time: string;
  requestUri: string;
  searchModelData?: string;
  timeStamp?: string;
  timeOccurrence?: string;
  timeRegister?: string;
  timeDuration?: string;
  timeSend?: string;
  timeFrom?: string;
  timeTo?: string;
  actionType?: string;
  actionSubType?: string;
  actionDescription?: string;
  actionId?: number;
  actionFlag?: string;
  actionSensitivity?: string;
  logNum?: number;
  nationalId?: string;
  firstName?: string;
  lastName?: string;
  employeeNum?: string;
  membership?: string;
  accessLevel?: string;
  nationality?: string;
  gender?: string;
  phoneNum?: number;
  groupName?: string;
  carNum?: number;
  pic?: string;
  comment?: string;
  url?: string;
  formName?: string;
  forceName?: string;
  forceUniqueId?: number;
  orgName?: string;
  orgUniqueId?: number;
  depName?: string;
  depUniqueId?: number;
  secName?: string;
  secUniqueId?: number;
  partName?: string;
  partUniqueId?: number;
  zoneName?: string;
  zoneId?: number;
  cityName?: string;
  cityId?: number;
  gateName?: string;
  subSystemName?: string;
  appName?: string;
  appVersion?: string;
  appId?: number;
  appVendor?: string;
  appServerIp?: string;
  appServerHostName?: string;
  appPortNum?: number;
  appDbIp?: string;
  appDbName?: string;
  clientName?: string;
  clientUniqueId?: number;
  macAddress?: string;
  hddSerial?: string;
  ip?: string;
  os?: string;
  userAgent?: string;
  deviceName?: string;
  deviceType?: string;
  deviceUniqueId?: number;
  deviceComment?: string;
  deviceStatus?: string;
  deviceBusType?: string;
  targetType?: string;
  targetSubType?: string;
  targetSpec?: string;
  targetContent?: string;
  targetComment?: string;
  targetName?: string;
  targetIp?: string;
  targetUserAgent?: string;
  targetUserName?: string;
  targetUserIp?: string;
  targetUniqueId?: number;
  targetFirstName?: string;
  targetLastName?: string;
  targetNationalId?: string;
  targetEmployeeNum?: string;
  targetMembership?: string;
  targetAccessLevel?: string;
  targetNationality?: string;
  targetGender?: string;
  targetSensitivity?: string;
  targetPhoneNum?: number;
  targetCarNum?: number;
  targetPic?: string;
  targetMacAddress?: string;
  targetHddSerial?: string;
  targetConsolName?: string;
  targetSubject?: string;
  targetGroupName?: string;
  targetId?: number;
  targetHash?: string;
  targetPath?: string;
  targetSize?: number;
  targetBusType?: string;
  targetCreateTime?: string;
  targetModificationTime?: string;
  targetVendor?: string;
  targetVersion?: string;
  targetMessure?: string;
  targetAmount?: string;
}

export interface PaginationState {
  current: number;
  pageSize: number;
  total: number;
}

export interface SearchFields {
  clientIp: string;
  username: string;
  serviceName: string;
  status: string;
  startTime?: string | null;
  endTime?: string | null;
}
