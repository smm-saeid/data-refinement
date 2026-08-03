import FormBuilderTest from '@/docs/form-builder/FormBuilderTest.tsx';
import InspectionList from '@/docs/legacy-api/InspectionList.tsx';

const DocsRoutes = [
  {
    path: 'docs',
    children: [
      {
        path: 'form-builder',
        element: <FormBuilderTest />
      },
      {
        path: 'legacy-api/inspections',
        element: <InspectionList />
      }
    ]
  }
]

export default DocsRoutes;