export interface ReviewItem {
  id: string;
  question: string;
  factor: number;
  grade: number;
  effectiveness: number;
}

export interface ReviewGroup {
  id: string | null;
  personSpecialityReviewGroupDto: {
    reviewGroupName: string;
    inspectorName: string;
    inspectorFamily: string;
    inspectorDegree: string;
    inspectedFirstName: string;
    inspectedFirstFamily: string;
    inspectedFirstDegree: string;
  };
  reviews: ReviewItem[];
  avgGrade: number;
  avgEffectiveness: number;
  advantages: { description: string; type: string }[];
  deficiencies: { description: string; type: string }[];
  advantageNumber: number;
  deficiencyNumber: number;
  moderateNumber: number;
}

export interface FinalReportSummary {
  reports: {
    name: string;
    count: number;
    activities: number;
    total_grade: number;
    total_effectiveness: number;
    effective_grade: number;
    advantage_count: number;
    deficiency_count: number;
    moderate_count: number;
  }[];
  avg_grade: number;
  avg_productivity: number;
  avg_effective_grade: number;
  finalGradeAfterEffect: number;
  stats: number;
  shootingGrade: number;
  militaryKnowledgeGrade: number;
  effectiveStats: number;
  effectiveShooting: number;
  effectiveMilitaryKnowledge: number;
}

export interface InspectionReviewResponse {
  finalReviewReports: ReviewGroup[];
  finalReport: FinalReportSummary;
}
