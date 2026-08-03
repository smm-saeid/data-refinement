const module = 'planning';

const researchApis = {
  developmentPlan: {
    // List all elites
    list: `${module}/development-plans`,
    save: `${module}/development-plans`,
    update : `${module}/development-plans/{id}`,
  },
  axis: {

  }
};

export default researchApis;
