const module = 'organizations';

const organizationApis = {
  organization: {
    list: `${module}/find-by-parent`,
    tree: `${module}/root-organization`,
    save: `${module}`,
    put: `${module}`,
    delete: `${module}`,
    organization: `${module}`,
    name: `${module}/name`,
  },
};
export default organizationApis;
