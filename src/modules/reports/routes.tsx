import OracleAppexDashboard from "./oracleAppexDashboard";
import PlanDashboard from "./PlanDashboard";
import AssessmentDashboard from "./AssessmentDashboard"
import SianatDashboard from "./SianatDashboard"
import SafetyDashboard from "./SafetyDashboard"
import DeputyDashboard from "./DeputyDashboard";

const OracleAppexDashboardRoutes = [
  {
    path: 'oracle-appex-dashboard',
    element: <OracleAppexDashboard />
  },
  {
    path: 'oracle-appex-plan',
    element: <PlanDashboard />
  },
  {
    path: 'oracle-appex-assessment',
    element: <AssessmentDashboard />
  },
  {
    path: 'oracle-appex-sianat',
    element: <SianatDashboard />
  }, 
  {
    path: 'oracle-appex-safety',
    element: <SafetyDashboard />
  },
  {
    path: 'oracle-appex-deputy',
    element: <DeputyDashboard />
  }             
]

export default OracleAppexDashboardRoutes;