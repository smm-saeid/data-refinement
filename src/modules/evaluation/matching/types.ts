export type Personnel = {
  id: string;
  personnelId: string;
  personnelNumber: string;
  firstName: string;
  lastName: string;
  nationalCode: string;
  cdCommonBaseDataPresentDegreeTitle?: string;
  orOrganizationUnitPresentPartialUnitName?: string;
  cdCommonBaseDataCategoryTitle?: string;
  professionTitle?: string;
  serviceStatusTitle?: string;
  cdCommonBaseDataLastEducationalDegreeTitle?: string;
  employmentDate?: string;
  retirementDate?: string;
  militaryCrustTitle?: string;
  appointmentDate?: string;
  organizationDegreeTitle?: string;
  jobTitle?: string;
};

export type PersonnelDetails = {
  appointments?: unknown[];
  personalInfo?: unknown;
};

export type FilterType = {
  jobPosition: string;
  force: string;
};

export type ServiceCategories = {
  value: string;
  id: string;
};