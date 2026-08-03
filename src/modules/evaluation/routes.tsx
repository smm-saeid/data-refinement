import EvaluationPlanningConfirm from './planning/EvaluationPlanningConfirm.tsx';
import EvaluationPlanningCreate from './planning/EvaluationPlanningCreate';
import EvaluationPlanningList from './planning/EvaluationPlanningList';
import EvaluationPlanningSelect from './planning/EvaluationPlanningSelect';
import MatchingHamtayabi from './matching/MatchingHamtayabi.tsx';

const EvaluationRoutes = [
  {
    path: 'evaluation',
    children: [
      {
        path: 'planning',
        children: [
          {
            index: true,
            element: <EvaluationPlanningList />,
          },
          {
            path: 'create',
            element: <EvaluationPlanningCreate />,
          },
          {
            path: 'confirm',
            element: <EvaluationPlanningConfirm />,
          },
          {
            path: 'select',
            element: <EvaluationPlanningSelect />,
          },
        ],
      },
      {
        path: 'matching',
        children: [
          {
            index: true,
            element: <MatchingHamtayabi />,
          },
        ],
      },
    ],
  },
];

export default EvaluationRoutes;
