import { PlanningGrid } from './planning-aja/PlanningGrid';
import Service from '@/modules/inspection-operation/planning-core/Service.tsx';
import StartOperationList from '@/modules/inspection-operation/start/StartOperationList.tsx';
import ExecutingVerficationListDocuments from './verfication/ExecutingVerficationListDocuments';
import CommandBasedInspection from './planning-aja/CommandBasedInspection';
import StartKhodarzyabiList from '@/modules/inspection-operation/self-assessmant/pages/StartKhodarzyabiList.tsx';
import ForcePlan from '@/modules/inspection-operation/planning-aja/ForcePlan.tsx';
import MapDocument from '@/modules/inspection-operation/planning-core/components/MapDocument.tsx';
import ScopeDocsAPI from '@/modules/inspection-operation/planning-core/components/ScopeDocsAPI.tsx';
import OperationPlanningDashboard from 'modules/inspection-operation/planning/OperationPlanningDashboard.tsx';
import PlanningNaturesCrud from 'modules/inspection-operation/planning-aja/PlanningNaturesCrud.tsx';
import StartInspectionStepsPage from '@/modules/inspection-operation/scheduled/pages/StartInspectionStepsPage.tsx';
import ScheduledInspectionListPage from '@/modules/inspection-operation/scheduled/pages/ScheduledInspectionListPage.tsx';
import PreVisitInspection from './planning-aja/PreVisitInspection';
import VisitInspection from './planning-aja/VisitInspection';
import PrePlanningPage from 'modules/inspection-operation/planning-aja/PrePlanningPage.tsx';
import InspectorReviewsListPage from './review/pages/InspectorReviewsListPage';
import InspectorReview from './review/components/InspectorReview';
import InspectorTables from './review/components/InspectorTables';
import ListPage from './deputy-planning/ListPage.tsx';
import ScopePlanningGrid from './planning-aja/ScopePlanningGrid';
import CrudPage from './deputy-planning/CrudPage.tsx';
import ScopePlanningCrud from './planning-aja/ScopePlanningCrud';
import BazdidPage from './provincial/pages/BazdidPage.tsx';
import PlanningReport from 'modules/inspection-operation/planning-core/PlanningReport.tsx';
import ScopePlanningReportPage from 'modules/inspection-operation/scope-planning/ScopePlanningReportPage.tsx';
import DeputyPlanningReportPage from 'modules/inspection-operation/deputy-planning/DeputyPlanningReportPage.tsx';
import VerificationInspectionListPage from 'modules/inspection-operation/verfication/pages/VerificationInspectionListPage.tsx';
import StartVerificationStepsPage from 'modules/inspection-operation/verfication/pages/StartVerificationStepsPage.tsx';
import StartAssessmentSteps from '@/modules/inspection-operation/self-assessmant/pages/StartAssessmentSteps.tsx';
import SelfAssessmentListPage from '@/modules/inspection-operation/self-assessmant/pages/SelfAssessmentListPage.tsx';
import Pointsteps from 'modules/inspection-operation/verfication/Pointsteps.tsx';
import ReviewInspectionVerification from 'modules/inspection-operation/verfication/ReviewInspectionVerification.tsx';
import UnexpectedInspectionListPage from 'modules/inspection-operation/unexpected/pages/UnexpectedInspectionListPage.tsx';
import StartUnexpectedStepsPage from 'modules/inspection-operation/unexpected/pages/StartUnexpectedStepsPage.tsx';
import ReviewReport from './review/components/ReviewReport.tsx';
import AssignInspectorPage from './scheduled/pages/AssignInspectorPage.tsx';
import InspectionsList from 'modules/inspection-operation/head-inspector/pages/InspectionsList.tsx';
import ShootingScoresForm from 'modules/inspection-operation/head-inspector/pages/ShootingScoresForm.tsx';
import UnitStatsForm from 'modules/inspection-operation/head-inspector/pages/UnitStatsForm.tsx';
import MilitaryKnowledgeScoresForm from './head-inspector/pages/MilitaryKnowledgeScoresForm.tsx';
import ProvincialInspectionStepsPage from './provincial/pages/StartOperationSteps.tsx';
import FinalReport from 'modules/inspection-operation/head-inspector/pages/FinalReport.tsx';
import Conflicts from 'modules/inspection-operation/planning-core/pages/Conflicts.tsx';
import Followup from "modules/inspection-operation/followup/FollowUp.tsx";
import FollowupDetails from "modules/inspection-operation/followup/FollowupDetails.tsx";
import InspectorList from "@/docs/legacy-api/InspectionList.tsx";
import InspectorDetails from "modules/inspection-operation/followup/InspectorDetails.tsx";
import CommanderReportsMap from './provincial/pages/CommanderReportsMap.tsx';

const InspectionRoutes = [
  {
    path: 'operation',
    children: [
      {
        path: 'planning',
        children: [
          {
            path: 'dashboard',
            element: <OperationPlanningDashboard />,
          },
          {
            path: 'previsit',
            element: <PreVisitInspection />,
          },
          {
            path: 'visit',
            element: <VisitInspection />,
          },
          {
            path: 'deputy',
            children: [
              {
                index: true,
                element: <ListPage />,
              },
              {
                path: 'new',
                element: <CrudPage />,
              },
              {
                path: 'report/:year',
                element: <DeputyPlanningReportPage />,
              },
              {
                path: ':id/:deputy',
                element: <CrudPage />,
              },
            ],
          },
          {
            path: 'scope',
            children: [
              {
                index: true,
                element: <ScopePlanningGrid />,
              },
              {
                path: 'report/:year',
                element: <ScopePlanningReportPage />,
              },
              {
                path: 'new',
                element: <ScopePlanningCrud />,
              },
              {
                path: ':id/:deputy',
                element: <ScopePlanningCrud />,
              },
            ],
          },


          {
            path: 'followup',
            children: [
              {
                path: 'Followup',
                element: <Followup />,
              },
              {
                path: 'FollowupDetails/:id',
                element: <FollowupDetails />,
              },
              {
                path: 'InspectorReviewTable',
                element: <InspectorList />,
              },
              {
                path: 'inspector/:inspectionId',
                element: <InspectorDetails />,
              },


            ],
          },


          {
            path: 'aja',
            children: [
              {
                index: true,
                element: <PlanningGrid />,
              },
              {
                path: 'new',
                element: <PrePlanningPage />,
              },
              {
                path: ':id/pre-planning',
                element: <PrePlanningPage />,
              },
              {
                path: ':id/WAITING_FOR_APPROVE',
                element: <PlanningNaturesCrud />,
              },
              {
                path: ':id/PLANNING',
                element: <Service />,
              },
              {
                path: 'force-plan/:id',
                element: <ForcePlan />,
              },
              {
                path: 'unit-report/:id',
                element: <PlanningReport annualPlanningId={undefined} />,

              },
              {
                path: 'addCommandBaseInspection/:id',
                element: <CommandBasedInspection />,
              },
              {
                path: 'map/:selectedYear',
                element: <MapDocument />,
              },
              {
                index: true,
                path: 'scopes-api/:selectedYear',
                element: <ScopeDocsAPI />,
              },
            ],
          },
          {
            path: 'conflicts/:year',
            element: <Conflicts />,
          },
        ],
      },
      {
        path: 'self-assessment',
        children: [
          {
            index: true,
            element: <SelfAssessmentListPage />,
          },
          {
            path: 'start-configuration/:id',
            element: <StartAssessmentSteps />,
          },
          {
            path: 'self-assessment-executing-steps',
            element: <StartKhodarzyabiList />,
          },
          {
            path: 'inspectors/:id',
            element: <Pointsteps />,
          },
          {
            path: 'documents/:id',
            element: <ExecutingVerficationListDocuments />,
          },
          {
            path: 'inspectors/:id/:reviewId/:inspectorId',
            element: <ReviewInspectionVerification />,
          },
        ],
      },
      {
        path: 'inspections',
        element: <StartOperationList />,
      },
      {
        path: 'verification',
        children: [
          {
            element: <VerificationInspectionListPage />,
            index: true,
          },
          {
            path: 'start-configuration/:inspectionId',
            element: <StartVerificationStepsPage />,
            index: true,
          },
          {
            path: 'under-execution',
            children: [
              {
                path: 'reports/:id',
                element: <ExecutingVerficationListDocuments />,
              },
              {
                path: 'inspectors/:id',
                element: <Pointsteps />,
              },
              {
                path: 'inspectors/:id/:reviewId/:inspectorId',
                element: <ReviewInspectionVerification />,
              },
              {
                path: 'documents/:id',
                element: <ExecutingVerficationListDocuments />,
              },
            ],
          },
        ],
      },
      {
        path: 'unexpected-inspection',
        children: [
          {
            index: true,
            element: <UnexpectedInspectionListPage />,
          },
          {
            path: 'start-configuration/:inspectionId',
            element: <StartUnexpectedStepsPage />,
          },
        ],
      },
      {
        path: 'scheduled-inspection',
        children: [
          {
            index: true,
            element: <ScheduledInspectionListPage />,
          },
          {
            path: 'start-configuration/:inspectionId',
            element: <StartInspectionStepsPage />,
          },
          {
            path: 'assign-inspector/:personSpecialityId',
            element: <AssignInspectorPage />,
          },
        ],
      },
      {
        path: 'commander/visit',
        children: [
          {
            path: 'evaluation',
            element: <BazdidPage type={'PROVINCIAL_PISH_BAZDID'} />,
          },
          {
            path: 'province',
            element: <BazdidPage type={'PROVINCIAL_BAZDID_FARMANDEHI'} />,
          },
          {
            path: 'steps/:provinceId/:orgId/:type/:annualPlanInspectionId',
            element: <ProvincialInspectionStepsPage />,
          },
          {
            path: 'reports',
            element: <CommanderReportsMap/>,
          },
        ],
      },

      {
        path: 'commander/visit',
        children: [
          {
            // پیش بازدید
            path: 'evaluation',
            element: <BazdidPage type={'PROVINCIAL_PISH_BAZDID'} />,
          },
          {
            // بازدید فرماندهی
            path: 'province',
            element: <BazdidPage type={'PROVINCIAL_BAZDID_FARMANDEHI'} />,
          },
          {
            // بازدید سرزده
            path: 'unexpected',
            element: <BazdidPage type={'PROVINCIAL_BAZDID_UNEXPECTED'} />,
          },
          // ==================== مسیر استپ‌ها با type ====================
          {
            // type از URL گرفته می‌شود
            path: 'steps/:provinceId/:type/:provincialInspectionId',
            element: <ProvincialInspectionStepsPage />,
          },
        ],
      },
      // ================================================================
      {
        path: 'inspector-reviews',
        children: [
          {
            index: true,
            element: <InspectorReviewsListPage />,
          },
          {
            path: 'fill-review/:inspectionId/:reviewGroupId',
            element: <InspectorReview />,
          },
          {
            path: 'tables/:inspectionId/:reviewGroupId',
            element: <InspectorTables />,
          },
          {
            path: 'report/:inspectionId/:reviewGroupId',
            element: <ReviewReport />,
          },
        ],
      },
      {
        path: 'head-inspector',
        children: [
          {
            path: 'inspections',
            element: <InspectionsList />,
          },
          {
            path: 'inspections/:id/shooting-scores',
            element: <ShootingScoresForm />,
          },
          {
            path: 'inspections/:id/unit-stats',
            element: <UnitStatsForm />,
          },
          {
            path: 'inspections/:id/military-knowledge-scores',
            element: <MilitaryKnowledgeScoresForm />,
          },
          {
            path: 'inspections/:id/final-report',
            element: <FinalReport />,
          },
        ],
      },
    ],
  },
];

export default InspectionRoutes;
