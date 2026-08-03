import { useParams } from 'react-router';
import ScopePlanningReport from 'modules/inspection-operation/scope-planning/components/ScopePlanningReport.tsx';

export default function ScopePlanningReportPage() {
  const { year } = useParams();

  return <>
    <ScopePlanningReport year={year} />
  </>
}
