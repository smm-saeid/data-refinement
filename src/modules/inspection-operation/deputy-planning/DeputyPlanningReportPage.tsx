import { useParams } from 'react-router';
import DeputyPlanningReport from 'modules/inspection-operation/deputy-planning/components/DeputyPlanningReport.tsx';

export default function DeputyPlanningReportPage() {
  const { year } = useParams();

  return <>
    <DeputyPlanningReport year={year} />
  </>
}
