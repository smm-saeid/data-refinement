
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
  personInfoPersonNumber?: string;
  personInfoName?: string;
  personInfoFamily?: string;
  orgSpecialityName?: string;
}

export interface PersonnelItem {
  id: string;
  name: string;
  family: string;
  personNumber: string;
  field?: string;
  fieldCode?: string;
}

export interface OrganizationUnit {
  id: string;
  name: string;
}

export interface SpecialityOption {
  value: string;
  title: string;
}

export interface ExpertiseParams {

  org: string;
}

export interface ExpertiseProps {
  listSkills: SkillItem[];
  setListSkills: (skills: SkillItem[]) => void;
  organizationUnit: OrganizationUnit;
  allSpecialities: SpecialityOption[];

}

