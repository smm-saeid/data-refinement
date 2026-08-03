// import Test from '@/Test.tsx';

import SafetyAja from './send-news/Aja/SafetyAja';
import SafetyNahaja from './send-news/Nahaja/SafetyNahaja';
import SafetyNezaja from './send-news/Nezaja/SafetyNezaja';
import SafetyNedaja from './send-news/Nedaja/SafetyNedaja';
import SafetyPedaja from './send-news/Pedaja/SafetyPedaja';
import MainLetterFirst from './news-gathering/MainLetterFirst';

const SafetyRoutes = [
  {
    path: 'news-gathering',
    element: <MainLetterFirst />,
  },
  {
    path: 'news-aja',
    element: <SafetyAja />,
  },
  {
    path: 'news-nahaja',
    element: <SafetyNahaja />,
  },
  {
    path: 'news-nezaja',
    element: <SafetyNezaja />,
  },
  {
    path: 'news-nedaja',
    element: <SafetyNedaja />,
  },
  {
    path: 'news-pedaja',
    element: <SafetyPedaja />,
  },
];

export default SafetyRoutes;
