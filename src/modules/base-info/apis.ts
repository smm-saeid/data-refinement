export const BaseInfoApis = {
  OrganizationForm: {
    saveForm: {
      list: `organization-variety`,
      create: `organization-variety`, 
      delete: (id: string) => `organization-variety/${id}`, 
    },

    units: {
      completeName: (name: string) =>
        `organizations/complete-name/${name}`,
    },

    forces: {
      search: (className: string) =>
        `common-base-data/find-all/class-name/${encodeURIComponent(className)}`,
    },

    essences: {
      childrenByParentId: (id: number) =>
        `common-base-data/find-children-by-parent-id/${id}`,
    },

    unitTypes: {
      childrenByParentId: (id: number) =>
        `common-base-data/find-children-by-parent-id/${id}`,
    },
  },

  baseInfoData: {
    list: (className: string) =>
      `common-base-data/find-all/class-name/${className}`, // GET all
    get:(id: string) =>
      `common-base-data/find-parent-data-by-type/${id}`, // GET 
    save: `common-base-data`, // POST
    update:  `common-base-data`, // PUT
    delete: (id: string) => `common-base-data/${id}`, // DELETE
  },

  baseInfoType: {
    list: `common-base-types`, // GET
    save: `common-base-types`, // POST
    update:  `common-base-types`, // PUT
    delete: (id: string) => `common-base-types/${id}`, // DELETE}
  },

};
