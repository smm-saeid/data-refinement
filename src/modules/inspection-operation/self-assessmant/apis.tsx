const module = 'inspection';

const SelfassessmentApis = {
  selfassessment: {
    list: 'inspection/self-assessment',
    finish: `inspection/finished`,
    notexecution: `${module}/not-execution`,

    information: {
      get: (id: string) => `information/inspection-id/${id}`,
      create: 'information',
      update: 'information',
    },
    inspection: {
      get: (id: string) => `inspection/id/${id}`,
      update: 'inspection',
    },
    personSpeciality: {
      list: 'person-speciality/find-by-inspection',
      create: 'person-speciality',
    },

    personReview: {
      list: 'person-speciality-review-group/find-by-inspection-id',
      create: 'person-speciality-review-group',
    },

    expertiseApis:{

      personInfo: {
        list: 'person-info',
      },
      orgSpeciality: {
        list: 'org-speciality',
      },
      specialityByOrganization: {
        get: 'self-review/speciality-by-organization',
      },
      personSpeciality: {
        delete: (id: string) => `person-speciality/${id}`,
      },
    }
  },
};

export default SelfassessmentApis;



