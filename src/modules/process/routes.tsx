import FlowRuleGraphPage from "./FlowGraphPage";
import ProcessTable from "./ProcessTable";


const ProcessRoutes = [
  {
    path: 'processtable',
    element: <ProcessTable />
  },
  {
    path: '/flow-graph/:id',
    element: < FlowRuleGraphPage />
  }
]

export default ProcessRoutes;