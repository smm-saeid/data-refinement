import HistoryEduIcon from '@mui/icons-material/HistoryEdu';

export interface AnnualPlanning {
  description?: string;
  id: string;
  year: number;
  number: number;
  inspectionType: AnnualPlanningInspectionType[];
  status: PLANNING_STATE;
  title: string;
}

export type APIUnit = {
  id: string;
  name: string;
  code: string;
  active: boolean;
  codePath: string;
  parentId: string;
  parentName: string;
  organizationTypeId: string;
  organizationTypeName: string;
  children: Array<any>;
};

export interface AnnualPlanningInspectionType {
  id?: string;
  key: string;
  name: string;
  number: number;
  organizations: AnnualPlanningOrganization[];
}

export type AnnualPlanningOrganization = {
  id?: string;
  organizationUnitName: string;
  key: string;
  number: number;
  organizationType?: AnnualPlanningNature[];
  units?: any[];
};

export type AnnualPlanningNature = {
  organizationTypeId: string;
  organizationTypeName: string;
  organizationTypeParentName: string;
  number: number;
};

export type APISuggestionUnit = {
  id?: string;
  organizationId: string;
  organizationName: string;
  organizationReference?: string;
  organizationReferenceName?: string;
  season: string;
  status?: boolean;
};


export type IExcelForm = {
  id: string;
  organizationName: string;
  unitName: string;
  unitNature: string;
  unitPoint: number;
  month: number;
  type: number;
  region: string;
  provinceKey: string;
  history?: Array<string>;
};

export type Plan = {
  id: number;
  YEAR: number;
  TOTAL: number;
  INSPECTIONTYPES: InspectionType;
  STATE: PLANNING_STATE;
  percent: number;
};

export type ForcePlan = {
  id: number;
  YEAR: number;
  TOTAL: number;
  INSPECTIONTYPES: InspectionForcesType;
  STATE: PLANNING_STATE;
  percent: number;
};

export type InspectionPlanningMenuType = {
  title: string;
  type: InspectionPlanningViewTypeEnum;
};

export interface GeneralSearchFiltersInterface {
    recruitmentNumber: string | number;
    dateFrom: string;
    dateTo: string;
}

export type Unit = {
  id: string;
  name: string;
  code: string;
  active: boolean;
  codePath: string;
  completeName: string;
  parentId: string;
  parentName: string;
};

export type InspectionTypeInfo = {
  ORGANIZATION: OrganizationInfoType;
  TOTAL: number;
};

export type InspectionType = {
  BARNAMEI_SYSTEMATIC: InspectionTypeInfo;
  PEYGIRI_BAZRASI: InspectionTypeInfo;
  KHOD_ARZYABI: InspectionTypeInfo;
  RASTY_AZMAIE: InspectionTypeInfo;
  GHEIRE_MOTERAGHEBEH: InspectionTypeInfo;
  NEZARAT_SETADI: InspectionTypeInfo;
  ARZYABI_MOAVEN_BAZRASI: InspectionTypeInfo;
  BAZRASI_BANA_BE_DASTOOR: InspectionTypeInfo;
};

export type OrganizationForcesInfoType<InputType = PlanningSubLeafType> = {
  [values in OrganizationForcesTypeEnum]: PlanningDataType<InputType>;
};

export type InspectionForcesTypeInfo = {
  ORGANIZATION: OrganizationForcesInfoType;
  TOTAL: number;
};

export type InspectionForcesType = {
  BARNAMEI_SYSTEMATIC: InspectionForcesTypeInfo;
  PEYGIRI_BAZRASI: InspectionForcesTypeInfo;
  KHOD_ARZYABI: InspectionForcesTypeInfo;
  RASTY_AZMAIE: InspectionForcesTypeInfo;
  GHEIRE_MOTERAGHEBEH: InspectionForcesTypeInfo;
  NEZARAT_SETADI: InspectionForcesTypeInfo;
  ARZYABI_MOAVEN_BAZRASI: InspectionForcesTypeInfo;
  BAZRASI_BANA_BE_DASTOOR: InspectionForcesTypeInfo;
};

export const organizationForceNames: {
  [values in OrganizationForcesTypeEnum]: string;
} = {
  nezaja: 'نزاجا',
  nedaja: 'نداجا',
  nehaja: 'نهاجا',
  nepaja: 'نپاجا',
  aja: 'آجا',
};

export enum PLANNING_STATE {
  PRE_PLANNING = 'PRE_PLANNING',
  WAITING_FOR_APPROVE = 'WAITING_FOR_APPROVE',
  PLANNING = 'PLANNING',
  WAITING_FOR_APPROVE_DETAILS = 'WAITING_FOR_APPROVE_DETAILS',
  IN_CARTABLE = 'IN_CARTABLE',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED',
}

export enum InspectionPlanningViewTypeEnum {
  PLANNING = 'PLANNING',
  MONTHLY_DISTRIBUTED = 'MONTHLY_DISTRIBUTED',
  REGIONAL_DISTRIBUTED = 'REGIONAL_DISTRIBUTED',
  TYPE_AND_SEASONAL = 'TYPE_AND_SEASONAL',
  AREA_AND_SEASONAL = 'AREA_AND_SEASONAL',
  PROVINCE = 'PROVINCE',
}

export enum OrganizationForcesTypeEnum {
  nezaja = 'nezaja',
  nedaja = 'nedaja',
  nehaja = 'nehaja',
  nepaja = 'nepaja',
  aja = 'aja',
}

export enum OrganizationTypeEnum {
  nezaja = 'nezaja',
  nedaja = 'nedaja',
  nehaja = 'nehaja',
  nepaja = 'nepaja',
  sayer = 'sayer',
}

export const menu: Array<InspectionPlanningMenuType> = [
  { title: 'طرح ریزی', type: InspectionPlanningViewTypeEnum.PLANNING },
  {
    title: 'پراکندگی ماهانه',
    type: InspectionPlanningViewTypeEnum.MONTHLY_DISTRIBUTED,
  },
  // {title: 'پراکندگی منطقه‌ای', type: InspectionPlanningViewTypeEnum.REGIONAL_DISTRIBUTED},
  // {title: 'نوعی فصلی', type: InspectionPlanningViewTypeEnum.TYPE_AND_SEASONAL},
  // {title: 'منطقه‌ای فصلی', type: InspectionPlanningViewTypeEnum.AREA_AND_SEASONAL},
  { title: 'استانی', type: InspectionPlanningViewTypeEnum.PROVINCE },
];

export const inspectionTypeNames = {
  BARNAMEI_SYSTEMATIC: 'بازرسی برنامه ای (سیستماتیک)',
  KHOD_ARZYABI: 'بازرسی برنامه ای به روش خودارزیابی با نظارت سلسله مراتب سازمانی',
  RASTY_AZMAIE: 'بازرسی راستی آزمایی',
  GHEIRE_MOTERAGHEBEH: 'بازرسی غیر مترقبه خاص',
  PEYGIRI_BAZRASI: 'پیگیری بازرسی',
  NEZARAT_SETADI: 'نظارت ستادی',
  PROVINCIAL_PISH_BAZDID: 'بازرسی و ارزیابی توان و آمادگی رزم(پیش بازدید)',
  PROVINCIAL_BAZDID_FARMANDEHI: 'بازدید فرماندهی از توان و آمادگی رزم(استانی)',
  PROVINCIAL_PEYGIRI: 'پیگیری مصوبات بازدیدهای استانی',
};


export const organizationTypes: {
  [values in OrganizationTypeEnum]: string;
} = {
  nezaja: 'نزاجا',
  nedaja: 'نداجا',
  nehaja: 'نهاجا',
  nepaja: 'نپاجا',
  sayer: 'ستادآجا',
};

export const SeasonData = [
  'سه ماه اول',
  'سه ماهه دوم',
  'سه ماهه سوم',
  'سه ماهه چهارم',
];

export const seasonKeys = [
  'first_season',
  'secound_season',
  'third_season',
  'fourth_season',
];

export const stateTitles = {
  PRE_PLANNING: ' طرح ریزی اولیه',
  WAITING_FOR_APPROVE: ' در انتظار تایید کلیات',

  PLANNING: 'طرح ریزی جزییات',
  WAITING_FOR_APPROVE_DETAILS: 'در انتظار تایید جزییات',
  IN_CARTABLE: 'در انتظار تایید کارتابل',
  IN_PROGRESS: 'درحال اجرا',
  FINISHED: 'پایان یافته',
  CARTABLEING: 'گردشکار',
};

export const organs = ['nezaja', 'nedaja', 'nehaja', 'nepaja', 'sayer'];

export const planningSteps = [
  'BARNAMEI_SYSTEMATIC',
  'KHOD_ARZYABI',
  'RASTY_AZMAIE',
  'GHEIRE_MOTERAGHEBEH',
  'PEYGIRI_BAZRASI',
  'NEZARAT_SETADI',
];

export type PlanningSubLeafType = { [key: string]: number };

export enum NatureInfoEnum {
  RAZMI = 'RAZMI',
  AMOZESHI = 'AMOZESHI',
  POSHTIBANI = 'POSHTIBANI',
  ZEREHI = 'ZEREHI',
  PIADE = 'PIADE',
  TOOPKHANE = 'TOOPKHANE',
  FARHANGI = 'FARHANGI',
}

export enum DeputiesEnum {
  tarbiat_amozesh = 'tarbiat_amozesh',
  amad_poshtibani = 'amad_poshtibani',
  tarh_barnameh = 'tarh_barnameh',
  sahadam = 'sahadam',
  amaliyat = 'amaliyat',
  fava = 'fava',
  mohandesi = 'mohandesi',
  atf = 'atf',
  BAZRASI = 'BAZRASI',
}

export const Deputies: {
  [values in DeputiesEnum]: string;
} = {
  tarbiat_amozesh: 'تربیت و آموزش',
  amad_poshtibani: 'آماد و پشتیبانی',
  tarh_barnameh: 'طب و بودجه',
  sahadam: 'سازمان حفظ آثار و نشر ارزشهای دفاع مقدس',
  amaliyat: 'معاونت عملیات',
  fava: 'معاونت فاوا',
  mohandesi: 'مهندسی دفاعی و پدافند غیر عامل',
  atf: 'علوم، تحقیقات و فناوری(عتف)',
  BAZRASI: 'بازرسی',
};

export type PlanningDataType<InputType = PlanningSubLeafType> = Partial<
  {
    [key in NatureInfoEnum]: InputType;
  } & {
    total: number;
  }
>;

export type OrganizationsInfo<InputType = PlanningSubLeafType> = {
  nezaja: PlanningDataType<InputType>;
  nedaja: PlanningDataType<InputType>;
  nehaja: PlanningDataType<InputType>;
  nepaja: PlanningDataType<InputType>;
  sayer: PlanningDataType<InputType>;
};

export interface ServicePanelDataInterface {
  title: string;
  tableHeader?: Array<string>;
}

export interface ServiceInterface {
  /**
   * @description نوع
   */
  type: ServiceTypeEnum;
  description: string;
  title: string;
  data: Array<string>;
  allData: Array<ServicePanelDataInterface>;
  icon: any;
}

export interface IndicatorInterface {
  id: string | number;
  title: string;
  weight: string | number;
}


export const OrganizationsInfoTitles: {
  [key in keyof OrganizationsInfo]: string;
} = {
  nezaja: 'نزاجا',
  nedaja: 'نداجا',
  nehaja: 'نهاجا',
  nepaja: 'نپاجا',
  sayer: 'یگانهای تابعه آجا',
};

export type APINature = {
  organizationTypeId: string;
  organizationTypeName: string;
  organizationTypeParentName: string;
  number: number;
};

export type ApiResponseType<ResponseType = null> = {
  data: ResponseType;
  status: number;
  message: string;
};

export type PageResponseType<ResponseType = null> = {
  rows: Array<ResponseType>;
  pageSize: number;
  count: number;
  currentPage: number;
  sortBy: string;
};

export type BaseType<EntityInterface = null> = EntityInterface & {
  // id: string | number;
  // getCreateDTO?(): Partial<EntityInterface>;
  // getPageableDTO?(): PageResponseType<EntityInterface>;
};

export interface ProvinceInterface
  extends BaseType<{
    name: string;
    key: string;
  }> {}

export interface states {
  [key: string]: string;
}

export type OrganizationInfoType<InputType = PlanningSubLeafType> = {
  [values in OrganizationTypeEnum]: PlanningDataType<InputType>;
};

export const NatureInfoName: {
  [key in NatureInfoEnum]: string;
} = {
  RAZMI: 'رزمی',
  AMOZESHI: 'آموزشی',
  POSHTIBANI: 'پشتیبانی',
  ZEREHI: 'زرهی',
  PIADE: 'پیاده',
  TOOPKHANE: 'توپخانه',
  FARHANGI: 'فرهنگی',
};

export enum InspectionScopesEnum {
  IMENI = 'IMENI',
  SIANAT = 'SIANAT',
  PISHGIRI = 'PISHGIRI',
  ARZYABI = 'ARZYABI',
}

export const Scopes: {
  [values in InspectionScopesEnum]: string;
} = {
  IMENI: 'ویژه ایمنی',
  SIANAT: 'صیانت',
  PISHGIRI: 'پیشگیری',
  ARZYABI: 'ارزیابی',
};

export enum ServiceTypeEnum {
  PAYMENT_CHECK = 'PAYMENT_CHECK',
  LOAN = 'LOAN',

  AJAPLANNING = 'AJAPLANNING',
  ORGANIZATIONPLANNING = 'ORGANIZATIONPLANNING',
}

export const servicesTypeTitles: {
  [values in ServiceTypeEnum]: string;
} = {
  [ServiceTypeEnum.PAYMENT_CHECK]: 'فیش حقوقی',
  [ServiceTypeEnum.LOAN]: 'وام و تسهیلات',

  [ServiceTypeEnum.AJAPLANNING]: 'طرح ریزی بازرسی ها',
  [ServiceTypeEnum.ORGANIZATIONPLANNING]: 'طرح ریزی بازرسی نیرو',
  // 'انتخاب یگان',
  // [ServiceTypeEnum.TimeMatching]:'تطابق زمانی',
  // [ServiceTypeEnum.FinalProgram]:'برنامه نهایی',
};

export const services = [
  {
    type: ServiceTypeEnum.AJAPLANNING,
    title: servicesTypeTitles[ServiceTypeEnum.AJAPLANNING],
    description:
      'در این بخش میتوانید با انتخاب نیروی مورد نظر بازرسی سالانه آن نیرو را طرح ریزی کنید',
    data: [''],
    allData: [
      { title: 'نزاجا', tableHeader: [] },
      { title: 'نهاجا', tableHeader: [] },
      { title: 'نداجا', tableHeader: [] },
      { title: 'نپاجا', tableHeader: [] },
      {
        title: 'ستادآجا',
        tableHeader: [
          'ردیف',
          'نام یگان',
          'نیرو',
          'منطقه جغرافیایی',
          'تاریخ آخرین بازرسی',
          'نوع آخرین بازرسی',
          'تعداد بازرسی های دوره ی 5 ساله',
          'فصل انتخابی',
          'نوع انتخاب بازرسی',
        ],
      },

      // {title:'ع . س' , tableHeader:[]},
      // {title:'حفا' , tableHeader:[]},
    ],
    icon: HistoryEduIcon,
  },

  {
    type: ServiceTypeEnum.ORGANIZATIONPLANNING,
    title: servicesTypeTitles[ServiceTypeEnum.ORGANIZATIONPLANNING],
    description: 'در این بخش میتوانید بازرسی سالانه نیروی خود را طرح ریزی کنید',
    data: [''],
    allData: [
      { title: 'نزاجا', tableHeader: [] },
      { title: 'نهاجا', tableHeader: [] },
      { title: 'نداجا', tableHeader: [] },
      { title: 'نپاجا', tableHeader: [] },
      {
        title: 'سایر',
        tableHeader: [
          'ردیف',
          'نام یگان',
          'نیرو',
          'منطقه جغرافیایی',
          'تاریخ آخرین بازرسی',
          'نوع آخرین بازرسی',
          'تعداد بازرسی های دوره ی 5 ساله',
          'فصل انتخابی',
          'نوع انتخاب بازرسی',
        ],
      },
    ],
    icon: HistoryEduIcon,
  },
];

export const RegionData = {
  north_east: 'شمال شرق',
  north: 'شمال',
  north_west: 'شمال غرب',
  east: 'شرق',
  center: 'مرکز',
  west: 'غرب',
  south_east: 'جنوب شرق',
  south: 'جنوب',
  south_west: 'جنوب غرب',
};

export type APISearchUnits = ApiResponseType<APIUnit[]>;

export type APIPlanningGrid = ApiResponseType<PageResponseType<AnnualPlanning>>;

// Final Report Year

export interface FinalReportUnit {
  organizationId: string;
  organizationName: string;
}

export interface FinalReportOrganization {
  id: string;
  forceName: string;
  forceKey: string;
  units: FinalReportUnit[];
}

export interface FinalReportSeason {
  season: string;
  organizations: FinalReportOrganization[];
}

export interface FinalReportInspectionType {
  id: string;
  name: string;
  key: string;
  season: FinalReportSeason[];
  provinces: any[];
}

export interface FinalReportData {
  id: string;
  title: string;
  year: number;
  status: string;
  inspectionType: FinalReportInspectionType[];
}

export interface FinalReportResponse {
  data: FinalReportData;
  message: string;
  status: number;
}

export interface InspectionData {
  id?: string;
  organizationUnitName: string;
  organizationUnitId: string;
  status: string;
}

export interface InformationData {
  id?: string;
  informationStartDate: string;
  informationEndDate: string;
  issuanceInformation?: string;
  issuance?: string;
  inspectionId: string;
  organizationUnitId: string;
  organizationUnitName: string;
}

export interface ExpertiseData {
  id	: string;
  name: string;
  family: string;
  personNumber: number;
  field: string;
  fieldCode:number
  organizationUnitId:number;
  organizationUnitName:string;
  organizationUnitCode:number;
  profession: string;
  organizationalJob: string;
}
export interface SkillItem {
  id: number | string;
  personInfoId: string | null;
   personNumber: string | null; 
  personnelName: string | null;
  position: string;
  requestDescription: string;
  inspectionId: string;
  orgSpecialityId: string | null;
  organizationUnitId: string | null;
  assignStatus: string;
}
export interface ReviewAssignmentItem {
  id: string | number;
  reviewGroupId: string | null;
  reviewGroupName: string;
  personSpecialityId: string | null;
  personSpecialityName?: string;
}

export type InspectionOperationResponse = {
  id: string;
  executionDate?: string;
  season?: string;
  status?: string;
  annualPlanInspectionId?: string;
  annualPlanInspectionName?: string;
  forceOrganizationUnitId?: string;
  forceOrganizationUnitName?: string;
  organizationUnitId?: string;
  organizationUnitCode?: string;
  organizationUnitName?: string;
  baseInspectionId?: string;
  baseInspectionName?: string;
  provinceName?: string;
  provinceKey?: string;
  locationName?: string;
  locationKey?: string;
  selectionOrgAndSeason?: {
    organizationId?: string;
    organizationName?: string;
    organizationReference?: string;
    organizationReferenceName?: string;
    season?: string;
    status?: boolean;
  };
  militaryKnowledgeGrade?: number;
  shootingGrade?: number;
  organizationNumber?: number;
  bossFinalReport?: string;
  staffOrgStatistics?: number;
  dutyOrgStatistics?: number;
  staffInventoryStatistics?: number;
  dutyInventoryStatistics?: number;
  bossPersonInfoId?: string;
  bossPersonInfoPersonNumber?: string;
  bossPersonInfoName?: string;
  bossPersonInfoFamily?: string;
  bossJob?: string;
  parentInspectionId?: string;
  childInspectionId?: string;
};

export type TCrudType = 'CREATE' | 'VIEW' | 'EDIT';
