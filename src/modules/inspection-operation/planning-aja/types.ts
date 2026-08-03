export const Season = {
  Spring: 'first_season',
  Summer: 'secound_season',
  Autumn: 'third_season',
  Winter: 'fourth_season',
} as const;

export const SeasonColor = {
  'first_season': '#92e481da',
  'secound_season': '#f3ed9aff',
  'third_season': '#ffd09aff',
  'fourth_season': 'skyblue'
};

export const FORCE_COLORS: Record<string, string> = {
  '45c4d624-919d-4313-be7c-acd32e669783': '#6b4f1d', // نزاجا
  'ec9f60dd-119d-4e3d-965f-6b8e2605efa6': 'black', // نداجا 
  '0136a680-9c32-4a00-bd77-4b624f60908a': '#0a0ef0ff', // نهاجا 
  '9432e347-9959-468e-afa3-f11a12c24435': '#760485ff', // نپاجا 
  '09c4a69c-c159-43b6-9968-c5a41239a5fb': '#686666ff', // یگانهای تابعه آجا
};


export type SeasonType = (typeof Season)[keyof typeof Season];

export const SeasonLabels: Record<SeasonType, string> = {
  [Season.Spring]: 'سه ماهه اول (بهار)',
  [Season.Summer]: 'سه ماهه دوم (تابستان)',
  [Season.Autumn]: 'سه ماهه سوم (پاییز)',
  [Season.Winter]: 'سه ماهه چهارم (زمستان)',
};

export const SeasonOptions = Object.values(Season).map(value => ({
  value: value,
  color: SeasonColor[value],
  label: SeasonLabels[value],
}));

export const Organization = {
  Nezaja: 'nezaja',
  Nedaja: 'nedaja',
  Nehaja: 'nehaja',
  Nepaja: 'nepaja',
  Sayer: 'sayer',
} as const;

export type OrganizationType = (typeof Organization)[keyof typeof Organization];

export const OrganizationLabels: Record<OrganizationType, string> = {
  [Organization.Nezaja]: 'نزاجا',
  [Organization.Nedaja]: 'نداجا',
  [Organization.Nehaja]: 'نهاجا',
  [Organization.Nepaja]: 'نپاجا',
  [Organization.Sayer]: 'ستاد آجا و یگان‌های تابعه',
};

export const OrganizationOptions = Object.values(Organization).map(key => ({
  key: key,
  label: OrganizationLabels[key],
}));

export const InspectionType = {
  Systematic: 'BARNAMEI_SYSTEMATIC',
  SelfEvaluation: 'KHOD_ARZYABI',
  Verification: 'RASTY_AZMAIE',
  Unexpected: 'GHEIRE_MOTERAGHEBEH',
  FollowUp: 'PEYGIRI_BAZRASI',
  StaffSupervision: 'NEZARAT_SETADI',

  ProvincialPreVisit: 'PROVINCIAL_PISH_BAZDID',
  ProvincialCommandVisit: 'PROVINCIAL_BAZDID_FARMANDEHI',
  ProvincialFollowUp: 'PROVINCIAL_PEYGIRI',
} as const;

export const ProvincialInspectionTypes = [
  'PROVINCIAL_PISH_BAZDID',
  'PROVINCIAL_BAZDID_FARMANDEHI',
  'PROVINCIAL_PEYGIRI',
];

export type InspectionTypeKey =
  (typeof InspectionType)[keyof typeof InspectionType];

export const InspectionTypeLabels: Record<InspectionTypeKey, string> = {
  [InspectionType.Systematic]: 'بازرسی برنامه‌ای (سیستماتیک)',
  [InspectionType.SelfEvaluation]: 'بازرسی برنامه‌ای به روش خودارزیابی',
  [InspectionType.Verification]: 'بازرسی راستی‌آزمایی',
  [InspectionType.Unexpected]: 'بازرسی غیرمترقبه خاص',
  [InspectionType.FollowUp]: 'پیگیری بازرسی',
  [InspectionType.StaffSupervision]: 'نظارت ستادی',

  [InspectionType.ProvincialPreVisit]:
    'بازرسی و ارزیابی توان و آمادگی رزم(پیش بازدید)',
  [InspectionType.ProvincialCommandVisit]:
    'بازدید فرماندهی از توان و آمادگی رزم(استانی)',
  [InspectionType.ProvincialFollowUp]: 'پیگیری مصوبات بازدیدهای استانی',
};

export const InspectionTypeOptions = Object.values(InspectionType).map(key => ({
  key: key,
  label: InspectionTypeLabels[key],
}));

export const PlanningStepsOrder: InspectionTypeKey[] = [
  InspectionType.Systematic,
  InspectionType.SelfEvaluation,
  InspectionType.Verification,
  InspectionType.Unexpected,
  InspectionType.FollowUp,
  InspectionType.StaffSupervision,
  InspectionType.ProvincialPreVisit,
  InspectionType.ProvincialCommandVisit,
  InspectionType.ProvincialFollowUp,
];

export const ProvincialStepKeys: InspectionTypeKey[] = [
  InspectionType.ProvincialPreVisit,
  InspectionType.ProvincialCommandVisit,
  InspectionType.ProvincialFollowUp,
];

export const PlanningState = {
  PrePlanning: 'PRE_PLANNING',
  WaitingForApprove: 'WAITING_FOR_APPROVE',
  Planning: 'PLANNING',
  WaitingForApproveDetails: 'WAITING_FOR_APPROVE_DETAILS',
  InProgress: 'IN_PROGRESS',
  Finished: 'FINISHED',
} as const;

export type PlanningStateType =
  (typeof PlanningState)[keyof typeof PlanningState];

export type ProvincialDataPayload = {
  provinceId: number;
  season: SeasonType | string | null;
}[];

export type ProvincialInspectionRef = {
  validateAndGetData: () => ProvincialDataPayload | null;
};

export type MonthType = {
  key: number;
  season: SeasonType | string | null;
  label: string;
}

export const Months = [
  { key: 1, season: 'first_season', label: 'فروردین' },
  { key: 2, season: 'first_season', label: 'اردیبهشت' },
  { key: 3, season: 'first_season', label: 'خرداد' },
  { key: 4, season: 'secound_season', label: 'تیر' },
  { key: 5, season: 'secound_season', label: 'مرداد' },
  { key: 6, season: 'secound_season', label: 'شهریور' },
  { key: 7, season: 'third_season', label: 'مهر' },
  { key: 8, season: 'third_season', label: 'آبان' },
  { key: 9, season: 'third_season', label: 'آذر' },
  { key: 10, season: 'fourth_season', label: 'دی' },
  { key: 11, season: 'fourth_season', label: 'بهمن' },
  { key: 12, season: 'fourth_season', label: 'اسفند' },
];
