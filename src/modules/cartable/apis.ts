const CartableApis = {
  list: '/cartable/find-cartable-by-tab',
  stepNavigation: (cartableId: string) => `/cartable/step-navigation/${cartableId}`,
  getUsersByRole: (roleName: string) => `/keycloak-service?roleName=${roleName}`,
  changeStep: '/cartable/change-step-custom-cartable',
  finalApprove: '/cartable/accept-custom-cartable',
  history: '/cartable-history/workflow',
  attachments: (id: string ) => `file-storages/find-all-file-by-record-id/${id}`,
  downloadFile: (id: string) => `file-storages/download-file-by-file-id/${id}`,
  removeAttachment: (id: string) => `file-storages/${id}`,
  countByStatus: `cartable/count-by-status`,
  notices: `cartable/notification`,
  noticeReceiverUnits: `organizations/senders-list`,
  sendNotice: 'cartable/notification/send-to-org-units',
  approveNotice: (cartableId) => `cartable/notification/mark-as-approved/${cartableId}`,
  createNotice: 'cartable/notification',
};

export default CartableApis;