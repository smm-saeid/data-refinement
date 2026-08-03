
const InspectionApis = {
  annualPlanning: {
    list: 'annual-planning',
    acceptPrePlanning: (id: number | string) =>
        `annual-planning/accept-pre-planning/${id}`,
    editPrePlanning: (id: number | string) =>
        `annual-planning/edit-pre-planning/${id}`,
    annualAcceptPlanning: (id: number | string) =>
        `annual-planning/accept-planning/${id}`,
    saveNumber: `annual-plan-inspection/save-number`,
    finalReport: (year: number | string) =>
        `/annual-planning/final-report/year/${year}`,
    editStatus: (id: number | string) =>
        `annual-planning/edit-status?annualPlanningId=${id}&state=WAITING_FOR_APPROVE_DETAILS`,
    editStatusPlanning: (id: number | string) =>
        `annual-planning/edit-status?annualPlanningId=${id}&state=PLANNING`,
    suggestionConflict: 'inspection/suggestion-conflict',
    saveCartable: (id: number | string) =>
        `/annual-planning/save-to-cartable/${id}`,
    find: (annualPlanningId: number | string) =>
      `annual-planning/find-current-org/${annualPlanningId}`,
    saveProvincial: 'provincial-inspection-plan',
    conflicts: (year: number | string) => `inspection/conflicts?year=${year}`,
  },
  operation: {
    systematic: {
      list: 'inspection',
    }
  },
  Inspection: {
    createInspection: `inspection`,
    deleteSave: `inspection/delete-saved-org`,
    suggestionDetails: 'inspection/suggestion-detail-organization',
  },
  cities: {
    citiesWithoutId: 'cities',
    list: (id: number | string) => `cities/${id}`,
  },
  typeInspection: {
    list: '/org-type-inspection/save-organization-type',
  },
  fileStorage: {
    list: (id: number | string) => `file-storages/upload-file/${id}`,
  },




  orgTypeInspection: {
    suggestionOrganization: 'org-type-inspection/suggestion_organization',
    annualPlanning: (
        idData0: string,
        idData1: string,
        inspectionNatureIndex: number | string
    ) =>
        `org-type-inspection/suggestion_organization?annualPlanInspectionId=${idData0}&organizationParentId=${idData1}&organizationTypeId=${inspectionNatureIndex}`,
  },


  organizations: {
    list: 'oraganization',
    organizationTypes: (idData1: string, tabsFilterNatureId: string) =>
        `organizations/organization-type-and-parent-id?parentId=${idData1}&organizationTypeId=${tabsFilterNatureId}`,
    currentOrg: 'organizations/current-org-login',
    senderList: (year: number | string) => `organizations/senders-list/year/${year}`
  },
  planningManagement: {
    planningManagementId: (id: number | string) =>
        `/plannigManagmentData/${id}`,
  },
  ProvinceByForce: {
    list: (year: string | number, forceID: number | string) =>
        `inspection/province-by-force-and-year?year=${year}${forceID ? '&forceId=' + forceID : ''}`,
  },
  CommandBaseInspection:{
    base: 'commandBasedInspectionBase',
    list: 'commandBasedInspectionList'
  },
  FollowUp:{
    list:'/inspection/my-inspection-list',
    resolution:'/resolution-response',
    get: '/inspection/find-started-follow-inspection',
    infoResponse:(id:any)=>`/inspection/info/${id}`,
    uploadFile:(recordId:any)=>`/file-storages/upload-file/${recordId}`,
    inspectionResponse :(id:any)=>`/inspection/resolution/${id}`,
    save: (id: number | string) => `/inspection/follow-inspection-start/` + id,

    invaildiQuery:(resolutionId:string)=>`resolution-response?resolution-id=${resolutionId}`,


  },
  FollowUpSteps:{
    getInfo: (id: number | string) => `/information/inspection-id/${id}`,
    getExperts: (id: number | string) => `/person-speciality/find-by-inspection?inspectionId=${id}`,
    getReviewAssignments: (id: number | string) => `/person-speciality/find-by-inspection?inspectionId=${id}`,
    save: (id: number | string) => `/person-speciality-review-group?inspectionId=${id}`,
    saveSkills: (id: number | string) => `/person-speciality?inspectionId=${id}`,
    saveReviewAssignment: `/information`,
  },
  Information:{
    getPrograms: (id: number | string) => `/information/inspection-id/${id}`,
  },
  ExpertiseAssignment:{
    updateStatus: `/person-speciality`,
  },
  Expertise:{
    getOrganizations: `/organizations?pageSize=1000&currentPage=1`,
    getSpecialities: `/org-speciality?pageSize=100&currentPage=1`,
    getPersonnel: `/person-info`,
    deleteSkill: (id: number | string) => `/person-speciality/${id}`,
  },
  FinalReportFollowup:{
    list: (id: number | string) => `/inspection/id/${id}`,
  },
  FollowupReport:{
    inspectionResponselist: (id: number | string) => `/inspection/id/${id}`,
    parentInspectionResponselist: (parentId: number | string) => `/inspection/id/${parentId}`,
    informationResponselist: (id: number | string) => `/information/inspection-id/${id}`,
    parentInformationResponselist: (parentId: number | string) => `/information/inspection-id/${parentId}`,
    reviewsResponselist: (id: number | string) => `/review-customize/find-all-reviews?inspectionId=${id}`,
    parentReviewsResponselist:
        (parentId: number | string) => `/review-customize/find-all-reviews?inspectionId=${parentId}`,
    parentDeficienciesResponselist:
        (parentId: number | string) => `/deficiency-follow-up/find-by-parameter?inspectionId=${parentId}`,
    parentAppsugResponselist:
        (parentId: number | string) => `/approved-suggestion-follow-up/find-by-parameter?inspectionId=${parentId}`,
    encouragementResponselist:
        (id: number | string) => `/encouragement/find-by-inspection?inspectionId=${id}`,
    parentEncouragementResponselist:
        (parentId: number | string) => `/encouragement/find-by-inspection?inspectionId=${parentId}`,
    expertsResponselist:
        (id: number | string) => `/person-speciality/find-by-inspection?pageSize=1000&currentPage=1&inspectionId=${id}`,
    parentExpertsResponselist:
        (parentId: number | string) => `/person-speciality/find-by-inspection?pageSize=1000&currentPage=1&inspectionId=${parentId}`,
    percentagesResponselist:
        (parentId: number | string) => `/deficiency-follow-up/follow-up-summery?inspectionId=${parentId}`,
  },
  FollowupWorkflow:{
    inspectionResponselist: (id: number | string) => `/inspection/id/${id}`,
    parentInspectionResponselist: (parentId: number | string) => `/inspection/id/${parentId}`,
    informationResponselist: (id: number | string) => `/information/inspection-id/${id}`,
    parentInformationResponselist: (parentId: number | string) => `/information/inspection-id/${parentId}`,
    reviewsResponselist: (id: number | string) => `/review-customize/find-all-reviews?inspectionId=${id}`,
    parentReviewsResponselist:
        (parentId: number | string) => `/review-customize/find-all-reviews?inspectionId=${parentId}`,
    parentDeficienciesResponselist:
        (parentId: number | string) => `/deficiency-follow-up/find-by-parameter?inspectionId=${parentId}`,
    parentAppsugResponselist:
        (parentId: number | string) => `/approved-suggestion-follow-up/find-by-parameter?inspectionId=${parentId}`,
    encouragementResponselist:
        (id: number | string) => `/encouragement/find-by-inspection?inspectionId=${id}`,
    parentEncouragementResponselist:
        (parentId: number | string) => `/encouragement/find-by-inspection?inspectionId=${parentId}`,
    expertsResponselist:
        (id: number | string) => `/person-speciality/find-by-inspection?pageSize=1000&currentPage=1&inspectionId=${id}`,
    parentExpertsResponselist:
        (parentId: number | string) => `/person-speciality/find-by-inspection?pageSize=1000&currentPage=1&inspectionId=${parentId}`,
    percentagesResponselist:
        (parentId: number | string) => `/deficiency-follow-up/follow-up-summery?inspectionId=${parentId}`,
  },
  headInspector: {
    myInspections: 'inspection/lead-inspection',
    militaryKnowledge: 'military-knowledge',
    inspectionReviews: (inspectionId: string) => `review-customize/find-all-reviews?inspectionId=${inspectionId}`,
  },
};

export default InspectionApis;