const EvaluationApis = {
  planning: {
    list: 'evaluation-plan',
    create: 'evaluation-plan',
    findByOrg: 'evaluation/find-by-org',
    appointment: {
      findByOrg: 'appointment/find-by-org',
    },
    organization: {
      findWithoutChildren: 'organizations/find-all-force-with-out-children',
    },
  },
  matching: {
    personnel: {
      // Get personnel by personnel number
      list: `http://192.180.9.111:8000/api/personnel-informations/personnel-number/`,

      // Get personnel full details by personnel ID
      getFullDetails: `http://192.180.9.111:8000/api/full-status/personnel-id/`,

      // List personnel with filters
      search: `http://192.180.9.111:8000/api/personnel-informations/personnel-info`,
    }
  }
};

export default EvaluationApis;