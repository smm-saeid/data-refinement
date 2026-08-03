import { OrganizationTypeForm } from './organization-type/OrganizationTypeForm';
import { BaseInfoType } from './type/BaseInfoType';
import { BaseInfoData } from './data/BaseInfoData';


const BaseInfoRoutes = [
      {
        path: 'base-info-type',
        element: <BaseInfoType />,
      },
      {
        path: 'data/:className/:id/:title',
        element: <BaseInfoData />,
      },
      {
        path: 'base-info-organization-type',
        element: <OrganizationTypeForm />,
      },
];

export default BaseInfoRoutes;
