export type DepartmentCode = 'PLANNING' | 'OPERATION' | 'PRESERVATION' | 'EVALUATION' | 'SAFETY';

export type PlanningTarget = {
  id: string;
  name: string;
  description?: string | null;
  startDate?: number | null;
  endDate?: number | null;
};

export type ProgramSummary = {
  id: string;
  name: string;
  doneCount: number;
  totalCount: number;
};

export type ActivityStatus = 'PLANNING' | 'IN_PROGRESS' | 'DONE';

export type ActivityItem = {
  id: string;
  name: string;
  status: ActivityStatus;
  description?: string | null;
  entityId?: string | null;
  entityName?: string | null;
};