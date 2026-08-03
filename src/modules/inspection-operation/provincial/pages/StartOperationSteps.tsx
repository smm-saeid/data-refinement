// // import { Box, Button, Skeleton, Typography } from '@mui/material';
// // import StartInspectionStep1 from '../components/StartInspectionStep1';
// // import StartInspectionStep2 from '../components/StartInspectionStep2';
// // import StartInspectionStep3 from '../components/StartInspectionStep3';
// // import StartInspectionStep4 from '../components/StartInspectionStep4';
// // import StartInspectionStep5 from '../components/StartInspectionStep5';
// // import StartInspectionStep6 from '../components/StartInspectionStep6';
// // import { useParams, useLocation } from 'react-router';
// // import MatnaStepper from '@/components/MatnaStepper';
// // import { useEffect, useState, useCallback } from 'react';
// // import { useLegacyApi } from '@/hooks/useLegacyApi';
// // import { useQuery } from '@tanstack/react-query';

// // const steps = [
// //   'مشخصات استحضاریه',
// //   'تخصص‌ها استحضاریه',
// //   'صدور گردش کار',
// //   'اختصاص افراد',
// //   'اختصاص بازبینه ها',
// //   'صدور دستورالعمل',
// // ];

// // const StartOperationSteps = () => {
// //   // ==================== گرفتن پارامترها از URL ====================
// //   const { provinceId, type, provincialInspectionId } = useParams();
// //   const location = useLocation();
// //   const legacyApi = useLegacyApi();
// //   const [selectedStep, setSelectedStep] = useState(0);

// //   console.log('=== StartOperationSteps ===');
// //   console.log('provincialInspectionId (from URL):', provincialInspectionId);
// //   console.log('provinceId:', provinceId);
// //   console.log('type (from URL):', type);
// //   console.log('location.state:', location.state);

// //   const locationState = location.state || {};

// //   // ==================== ساخت داده‌های اولیه ====================
// //   const inspectionData = {
// //     provincialInspectionId: provincialInspectionId,
// //     provinceId: parseInt(provinceId),
// //     provinceName: locationState.provinceName || '',
// //     year: locationState.year || 1405,
// //     season: locationState.season || null,
// //     month: locationState.month || null,
// //     inspectionTypeKey: type || locationState.type,
// //     annualPlanInspectionId: locationState.annualPlanInspectionId,
// //     state: 'MOSHAKHASAT_ESTEHZARIYE',
// //   };

// //   console.log('inspectionData:', inspectionData);

// //   // ==================== دریافت اطلاعات از سرور ====================
// //   const {
// //     data: existingData,
// //     refetch,
// //     isLoading,
// //     isFetching,
// //   } = useQuery({
// //     queryKey: ['inspection-data', provincialInspectionId],
// //     queryFn: async () => {
// //       try {
// //         console.log(
// //           'Fetching inspection with provincialInspectionId:',
// //           provincialInspectionId
// //         );
// //         const response = await legacyApi.get(
// //           `/information/inspection-id/${provincialInspectionId}`
// //         );
// //         console.log('Fetched data:', response?.data);
// //         return response?.data;
// //       } catch (error) {
// //         console.log('No existing inspection found, using new data');
// //         return null;
// //       }
// //     },
// //     enabled:
// //       !!provincialInspectionId &&
// //       provincialInspectionId !== 'null' &&
// //       provincialInspectionId !== 'undefined',
// //   });

// //   const inspectionInformation = existingData || inspectionData;

// //   console.log('Final inspectionInformation:', {
// //     provincialInspectionId: inspectionInformation?.provincialInspectionId,
// //     state: inspectionInformation?.state,
// //   });

// //   // ==================== تعیین استپ بر اساس state ====================
// //   useEffect(() => {
// //     if (!inspectionInformation) return;

// //     const stateMap = {
// //       MOSHAKHASAT_ESTEHZARIYE: 0,
// //       TAKHASOS_ESTEHZARIYE: 1,
// //       SODOR_ESTEHZARIYE: 2,
// //       EKHTESAS_AFRAD: 3,
// //       EKHTESAS_BAZBINEH: 4,
// //       SODOR_DASTOROLAMAL: 5,
// //     };

// //     const currentState = inspectionInformation?.state;
// //     const newStep = stateMap[currentState];

// //     console.log('State mapping:', {
// //       currentState,
// //       newStep,
// //       currentStep: selectedStep,
// //     });

// //     if (newStep !== undefined && newStep !== selectedStep) {
// //       console.log(`Changing step from ${selectedStep} to ${newStep}`);
// //       setSelectedStep(newStep);
// //     }
// //   }, [inspectionInformation, selectedStep]);

// //   // ==================== توابع تغییر استپ ====================
// //   const handleStepChange = useCallback(
// //     async newStep => {
// //       console.log(`handleStepChange: moving to step ${newStep}`);
// //       await refetch();
// //       setSelectedStep(newStep);
// //     },
// //     [refetch]
// //   );

// //   const handleRefetch = useCallback(async () => {
// //     console.log('Manual refetch...');
// //     await refetch();
// //   }, [refetch]);

// //   // ==================== اعتبارسنجی ====================
// //   if (!provinceId || provinceId === 'null') {
// //     return (
// //       <Box sx={{ p: 3 }}>
// //         <Typography color="error">خطا: شناسه استان معتبر نیست</Typography>
// //         <Button variant="contained" onClick={() => window.history.back()}>
// //           بازگشت
// //         </Button>
// //       </Box>
// //     );
// //   }

// //   if (
// //     !provincialInspectionId ||
// //     provincialInspectionId === 'null' ||
// //     provincialInspectionId === 'undefined'
// //   ) {
// //     return (
// //       <Box sx={{ p: 3 }}>
// //         <Typography color="error">خطا: شناسه بازدید معتبر نیست</Typography>
// //         <Button variant="contained" onClick={() => window.history.back()}>
// //           بازگشت
// //         </Button>
// //       </Box>
// //     );
// //   }

// //   if (isLoading || isFetching) {
// //     return <Skeleton height={500} />;
// //   }

// //   // ==================== رندر ====================
// //   return (
// //     <Box sx={{ width: '100%' }}>
// //       <Box sx={{ margin: '20px' }}>
// //         <Typography fontWeight={700} variant="h5">
// //           پیکربندی بازدید استانی {inspectionInformation?.provinceName}
// //         </Typography>
// //         <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
// //           شناسه بازدید: {inspectionInformation?.provincialInspectionId} | وضعیت:{' '}
// //           {inspectionInformation?.state} | مرحله: {selectedStep + 1} | نوع:{' '}
// //           {inspectionInformation?.inspectionTypeKey}
// //         </Typography>
// //         <Button
// //           size="small"
// //           variant="outlined"
// //           onClick={handleRefetch}
// //           sx={{ mt: 1 }}
// //         >
// //           رفرش دستی
// //         </Button>
// //       </Box>

// //       <MatnaStepper steps={steps} selectedStep={selectedStep} />

// //       <Box width={'100%'}>
// //         {selectedStep === 0 && (
// //           <StartInspectionStep1
// //             inspectionInformation={inspectionInformation}
// //             refetchStep={handleRefetch}
// //             onStepChange={handleStepChange}
// //             currentStep={selectedStep}
// //           />
// //         )}
// //         {selectedStep === 1 && (
// //           <StartInspectionStep2
// //             inspectionInformation={inspectionInformation}
// //             refetchStep={handleRefetch}
// //             onStepChange={handleStepChange}
// //             currentStep={selectedStep}
// //           />
// //         )}
// //         {selectedStep === 2 && (
// //           <StartInspectionStep3
// //             inspectionInformation={inspectionInformation}
// //             refetchStep={handleRefetch}
// //             onStepChange={handleStepChange}
// //             currentStep={selectedStep}
// //           />
// //         )}
// //         {selectedStep === 3 && (
// //           <StartInspectionStep4
// //             inspectionInformation={inspectionInformation}
// //             refetchStep={handleRefetch}
// //             onStepChange={handleStepChange}
// //             currentStep={selectedStep}
// //           />
// //         )}
// //         {selectedStep === 4 && (
// //           <StartInspectionStep5
// //             inspectionInformation={inspectionInformation}
// //             refetchStep={handleRefetch}
// //             onStepChange={handleStepChange}
// //             currentStep={selectedStep}
// //           />
// //         )}
// //         {selectedStep === 5 && (
// //           <StartInspectionStep6
// //             inspectionInformation={inspectionInformation}
// //             refetchStep={handleRefetch}
// //             onStepChange={handleStepChange}
// //             currentStep={selectedStep}
// //           />
// //         )}
// //       </Box>
// //     </Box>
// //   );
// // };

// // export default StartOperationSteps;
// import { Box, Button, Skeleton, Typography } from '@mui/material';
// import StartInspectionStep1 from '../components/StartInspectionStep1';
// import StartInspectionStep2 from '../components/StartInspectionStep2';
// import StartInspectionStep3 from '../components/StartInspectionStep3';
// import StartInspectionStep4 from '../components/StartInspectionStep4';
// import StartInspectionStep5 from '../components/StartInspectionStep5';
// import StartInspectionStep6 from '../components/StartInspectionStep6';
// import { useParams, useLocation } from 'react-router';
// import MatnaStepper from '@/components/MatnaStepper';
// import { useEffect, useState, useCallback } from 'react';

// const steps = [
//   'مشخصات استحضاریه',
//   'تخصص‌ها استحضاریه',
//   'صدور گردش کار',
//   'اختصاص افراد',
//   'اختصاص بازبینه ها',
//   'صدور دستورالعمل',
// ];

// // Mock data for development
// const MOCK_INSPECTION_DATA = {
//   id: 'mock-id-123',
//   provincialInspectionId: 'mock-provincial-id-456',
//   provinceId: 1,
//   provinceName: 'تهران',
//   year: 1405,
//   season: 'first_season',
//   month: 1,
//   inspectionTypeKey: 'PROVINCIAL_PISH_BAZDID',
//   annualPlanInspectionId: 'mock-plan-id-789',
//   state: 'MOSHAKHASAT_ESTEHZARIYE',
//   informationStartDate: null,
//   informationEndDate: null,
//   issuanceInformation: null,
//   issuanceInstruction: null,
//   instructionStatus: 'pending',
//   organizationUnitName: 'معاونت بازرسی',
//   inspectionId: 'mock-inspection-id-123'
// };

// const MOCK_EXPERTS = [
//   {
//     id: 'expert-1',
//     personNumber: '123456',
//     name: 'علی',
//     family: 'رضایی',
//     degree: 'سرهنگ',
//     position: 'کارشناس ارشد',
//     organizationUnitName: 'معاونت عملیات',
//     commonBaseDataFieldId: 'field-1',
//     commonBaseDataFieldValue: 'تخصص عملیاتی',
//     assignStatus: 'accepted by inspect',
//     inspectionId: 'mock-inspection-id-123'
//   },
//   {
//     id: 'expert-2',
//     personNumber: '789012',
//     name: 'محمد',
//     family: 'کریمی',
//     degree: 'سرگرد',
//     position: 'کارشناس',
//     organizationUnitName: 'معاونت اطلاعات',
//     commonBaseDataFieldId: 'field-2',
//     commonBaseDataFieldValue: 'تخصص اطلاعاتی',
//     assignStatus: 'accepted by inspect',
//     inspectionId: 'mock-inspection-id-123'
//   }
// ];

// const MOCK_LEAD_INFO = {
//   id: 'lead-1',
//   name: 'ابوالفضل',
//   family: 'سپهری راد',
//   degree: 'سرتیپ ستاد',
//   organizationUnitName: 'معاونت بازرسی و ایمنی آجا'
// };

// const MOCK_REVIEWS = [
//   {
//     id: 'review-1',
//     reviewGroupId: 'rg-1',
//     reviewGroupName: 'بازبینه عملیاتی',
//     personSpecialityId: 'expert-1',
//     personNumber: '123456'
//   }
// ];

// const StartOperationSteps = () => {
//   const { provinceId, type, provincialInspectionId } = useParams();
//   const location = useLocation();
//   const [selectedStep, setSelectedStep] = useState(0);
//   const [useMockData, setUseMockData] = useState(true); // Set to false to use real API
//   const [mockData, setMockData] = useState(MOCK_INSPECTION_DATA);
//   const [isLoading, setIsLoading] = useState(false);

//   console.log('=== StartOperationSteps (Dev Mode) ===');
//   console.log('provincialInspectionId (from URL):', provincialInspectionId);
//   console.log('provinceId:', provinceId);
//   console.log('type (from URL):', type);
//   console.log('location.state:', location.state);

//   const locationState = location.state || {};

//   // Initial inspection data
//   const inspectionData = {
//     ...MOCK_INSPECTION_DATA,
//     provincialInspectionId: provincialInspectionId || MOCK_INSPECTION_DATA.provincialInspectionId,
//     provinceId: parseInt(provinceId) || MOCK_INSPECTION_DATA.provinceId,
//     provinceName: locationState.provinceName || MOCK_INSPECTION_DATA.provinceName,
//     year: locationState.year || 1405,
//     season: locationState.season || MOCK_INSPECTION_DATA.season,
//     month: locationState.month || MOCK_INSPECTION_DATA.month,
//     inspectionTypeKey: type || locationState.type || MOCK_INSPECTION_DATA.inspectionTypeKey,
//     annualPlanInspectionId: locationState.annualPlanInspectionId || MOCK_INSPECTION_DATA.annualPlanInspectionId,
//   };

//   const [inspectionInformation, setInspectionInformation] = useState(inspectionData);
//   const [experts, setExperts] = useState(MOCK_EXPERTS);
//   const [leadInfo, setLeadInfo] = useState(MOCK_LEAD_INFO);
//   const [reviews, setReviews] = useState(MOCK_REVIEWS);

//   // Mock fetch function
//   const fetchMockData = useCallback(async () => {
//     setIsLoading(true);
//     try {
//       // Simulate API delay
//       await new Promise(resolve => setTimeout(resolve, 500));

//       // Update with current state
//       setInspectionInformation(prev => ({
//         ...prev,
//         ...mockData
//       }));

//       return { data: mockData };
//     } catch (error) {
//       console.error('Mock fetch error:', error);
//       return null;
//     } finally {
//       setIsLoading(false);
//     }
//   }, [mockData]);

//   // Mock refetch function
//   const refetch = useCallback(async () => {
//     if (useMockData) {
//       return await fetchMockData();
//     }
//     // Real API call would go here
//     return null;
//   }, [useMockData, fetchMockData]);

//   // Update state based on current step
//   const updateInspectionState = useCallback((newState, additionalData = {}) => {
//     setMockData(prev => ({
//       ...prev,
//       state: newState,
//       ...additionalData
//     }));
//     setInspectionInformation(prev => ({
//       ...prev,
//       state: newState,
//       ...additionalData
//     }));
//   }, []);

//   // Handle step change
//   const handleStepChange = useCallback(async (newStep) => {
//     console.log(`Moving to step ${newStep}`);
//     setIsLoading(true);
//     try {
//       // Update state based on step
//       const stateMap = {
//         0: 'MOSHAKHASAT_ESTEHZARIYE',
//         1: 'TAKHASOS_ESTEHZARIYE',
//         2: 'SODOR_ESTEHZARIYE',
//         3: 'EKHTESAS_AFRAD',
//         4: 'EKHTESAS_BAZBINEH',
//         5: 'SODOR_DASTOROLAMAL'
//       };

//       const newState = stateMap[newStep];
//       if (newState) {
//         updateInspectionState(newState);
//       }

//       setSelectedStep(newStep);
//       await fetchMockData();
//     } catch (error) {
//       console.error('Error changing step:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [fetchMockData, updateInspectionState]);

//   const handleRefetch = useCallback(async () => {
//     await refetch();
//   }, [refetch]);

//   // Initialize mock data on mount
//   useEffect(() => {
//     if (useMockData) {
//       fetchMockData();
//     }
//   }, [fetchMockData, useMockData]);

//   // Update step based on state
//   useEffect(() => {
//     if (!inspectionInformation) return;

//     const stateMap = {
//       MOSHAKHASAT_ESTEHZARIYE: 0,
//       TAKHASOS_ESTEHZARIYE: 1,
//       SODOR_ESTEHZARIYE: 2,
//       EKHTESAS_AFRAD: 3,
//       EKHTESAS_BAZBINEH: 4,
//       SODOR_DASTOROLAMAL: 5,
//     };

//     const currentState = inspectionInformation?.state;
//     const newStep = stateMap[currentState];

//     if (newStep !== undefined && newStep !== selectedStep) {
//       setSelectedStep(newStep);
//     }
//   }, [inspectionInformation, selectedStep]);

//   // Validation
//   if (!provinceId || provinceId === 'null') {
//     return (
//       <Box sx={{ p: 3 }}>
//         <Typography color="error">خطا: شناسه استان معتبر نیست</Typography>
//         <Button variant="contained" onClick={() => window.history.back()}>
//           بازگشت
//         </Button>
//       </Box>
//     );
//   }

//   if (isLoading) {
//     return <Skeleton height={500} />;
//   }

//   // Create context for child components
//   const stepContext = {
//     inspectionInformation,
//     setInspectionInformation,
//     refetchStep: handleRefetch,
//     onStepChange: handleStepChange,
//     currentStep: selectedStep,
//     useMockData,
//     experts,
//     setExperts,
//     leadInfo,
//     setLeadInfo,
//     reviews,
//     setReviews,
//     updateInspectionState
//   };

//   return (
//     <Box sx={{ width: '100%' }}>
//       <Box sx={{ margin: '20px' }}>
//         <Typography fontWeight={700} variant="h5">
//           پیکربندی بازدید استانی {inspectionInformation?.provinceName}
//         </Typography>
//         <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
//           شناسه بازدید: {inspectionInformation?.provincialInspectionId} | وضعیت:{' '}
//           {inspectionInformation?.state} | مرحله: {selectedStep + 1} | نوع:{' '}
//           {inspectionInformation?.inspectionTypeKey}
//         </Typography>
//         <Box sx={{ mt: 1, display: 'flex', gap: 2 }}>
//           <Button
//             size="small"
//             variant="outlined"
//             onClick={handleRefetch}
//           >
//             رفرش دستی
//           </Button>
//           <Typography variant="caption" color="success.main">
//             🔧 حالت توسعه (Mock Data)
//           </Typography>
//         </Box>
//       </Box>

//       <MatnaStepper steps={steps} selectedStep={selectedStep} />

//       <Box width={'100%'}>
//         {selectedStep === 0 && (
//           <StartInspectionStep1 {...stepContext} />
//         )}
//         {selectedStep === 1 && (
//           <StartInspectionStep2 {...stepContext} />
//         )}
//         {selectedStep === 2 && (
//           <StartInspectionStep3 {...stepContext} />
//         )}
//         {selectedStep === 3 && (
//           <StartInspectionStep4 {...stepContext} />
//         )}
//         {selectedStep === 4 && (
//           <StartInspectionStep5 {...stepContext} />
//         )}
//         {selectedStep === 5 && (
//           <StartInspectionStep6 {...stepContext} />
//         )}
//       </Box>
//     </Box>
//   );
// };

// export default StartOperationSteps;
import { Box, Button, Skeleton, Typography, Alert } from '@mui/material';
import StartInspectionStep1 from '../components/StartInspectionStep1';
import StartInspectionStep2 from '../components/StartInspectionStep2';
import StartInspectionStep3 from '../components/StartInspectionStep3';
import StartInspectionStep4 from '../components/StartInspectionStep4';
import StartInspectionStep5 from '../components/StartInspectionStep5';
import StartInspectionStep6 from '../components/StartInspectionStep6';
import { useParams, useLocation } from 'react-router';
import MatnaStepper from '@/components/MatnaStepper';
import { useEffect, useState, useCallback } from 'react';
import { useSnackbar } from '@/hooks/useSnackbar';

const steps = [
  'مشخصات استحضاریه',
  'تخصص‌ها استحضاریه',
  'صدور گردش کار',
  'اختصاص افراد',
  'اختصاص بازبینه ها',
  'صدور دستورالعمل',
];

// Mock data for development
const MOCK_INSPECTION_DATA = {
  id: 'mock-id-123',
  provincialInspectionId: 'mock-provincial-id-456',
  provinceId: 1,
  provinceName: 'تهران',
  year: 1405,
  season: 'first_season',
  month: 1,
  inspectionTypeKey: 'PROVINCIAL_PISH_BAZDID',
  annualPlanInspectionId: 'mock-plan-id-789',
  state: 'MOSHAKHASAT_ESTEHZARIYE',
  informationStartDate: null,
  informationEndDate: null,
  issuanceInformation: null,
  issuanceInstruction: null,
  instructionStatus: 'pending',
  organizationUnitName: 'معاونت بازرسی',
  inspectionId: 'mock-inspection-id-123',
  leadInspector: null,
  selectedExperts: [],
  selectedUnits: [],
  selectedSpecialties: [],
};

// Mock available data for Step 2
const MOCK_AVAILABLE_PERSONNEL = [
  {
    id: 'p1',
    name: 'علی',
    family: 'رضایی',
    degree: 'سرهنگ',
    personNumber: '123456',
    unit: 'معاونت عملیات',
    specialty: 'عملیات',
  },
  {
    id: 'p2',
    name: 'محمد',
    family: 'کریمی',
    degree: 'سرگرد',
    personNumber: '789012',
    unit: 'معاونت اطلاعات',
    specialty: 'اطلاعات',
  },
  {
    id: 'p3',
    name: 'رضا',
    family: 'احمدی',
    degree: 'سروان',
    personNumber: '345678',
    unit: 'معاونت پشتیبانی',
    specialty: 'پشتیبانی',
  },
  {
    id: 'p4',
    name: 'احمد',
    family: 'محمدی',
    degree: 'ستوان',
    personNumber: '901234',
    unit: 'معاونت آموزش',
    specialty: 'آموزش',
  },
  {
    id: 'p5',
    name: 'حسین',
    family: 'حسینی',
    degree: 'سرهنگ دوم',
    personNumber: '567890',
    unit: 'معاونت عملیات',
    specialty: 'عملیات ویژه',
  },
];

const MOCK_AVAILABLE_UNITS = [
  { id: 'u1', name: 'معاونت عملیات' },
  { id: 'u2', name: 'معاونت اطلاعات' },
  { id: 'u3', name: 'معاونت پشتیبانی' },
  { id: 'u4', name: 'معاونت آموزش' },
  { id: 'u5', name: 'معاونت بازرسی' },
];

const MOCK_AVAILABLE_SPECIALTIES = [
  { id: 's1', name: 'عملیات' },
  { id: 's2', name: 'اطلاعات' },
  { id: 's3', name: 'پشتیبانی' },
  { id: 's4', name: 'آموزش' },
  { id: 's5', name: 'عملیات ویژه' },
  { id: 's6', name: 'بازرسی' },
];

const StartOperationSteps = () => {
  const { provinceId, type, provincialInspectionId } = useParams();
  const location = useLocation();
  const snackbar = useSnackbar();
  const [selectedStep, setSelectedStep] = useState(0);
  const [useMockData, setUseMockData] = useState(true);
  const [mockData, setMockData] = useState(MOCK_INSPECTION_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log('=== StartOperationSteps (Dev Mode) ===');

  const locationState = location.state || {};

  // Initial inspection data
  const inspectionData = {
    ...MOCK_INSPECTION_DATA,
    provincialInspectionId:
      provincialInspectionId || MOCK_INSPECTION_DATA.provincialInspectionId,
    provinceId: parseInt(provinceId) || MOCK_INSPECTION_DATA.provinceId,
    provinceName:
      locationState.provinceName || MOCK_INSPECTION_DATA.provinceName,
    year: locationState.year || 1405,
    season: locationState.season || MOCK_INSPECTION_DATA.season,
    month: locationState.month || MOCK_INSPECTION_DATA.month,
    inspectionTypeKey:
      type || locationState.type || MOCK_INSPECTION_DATA.inspectionTypeKey,
    annualPlanInspectionId:
      locationState.annualPlanInspectionId ||
      MOCK_INSPECTION_DATA.annualPlanInspectionId,
  };

  const [inspectionInformation, setInspectionInformation] =
    useState(inspectionData);
  const [experts, setExperts] = useState([]);
  const [leadInfo, setLeadInfo] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [availablePersonnel, setAvailablePersonnel] = useState(
    MOCK_AVAILABLE_PERSONNEL
  );
  const [availableUnits, setAvailableUnits] = useState(MOCK_AVAILABLE_UNITS);
  const [availableSpecialties, setAvailableSpecialties] = useState(
    MOCK_AVAILABLE_SPECIALTIES
  );

  // Mock fetch function with error handling
  const fetchMockData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      // Simulate random error (10% chance for testing)
      if (Math.random() < 0.1) {
        throw new Error('خطای شبیه‌سازی شده در دریافت داده');
      }

      return { data: mockData };
    } catch (error) {
      const errorMessage = error.message || 'خطا در دریافت اطلاعات';
      setError(errorMessage);
      snackbar(errorMessage, 'error', 5000);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [mockData, snackbar]);

  // Mock refetch function
  const refetch = useCallback(async () => {
    if (useMockData) {
      return await fetchMockData();
    }
    return null;
  }, [useMockData, fetchMockData]);

  // Update state based on current step with error handling
  const updateInspectionState = useCallback(
    (newState, additionalData = {}) => {
      try {
        setMockData(prev => ({
          ...prev,
          state: newState,
          ...additionalData,
        }));
        setInspectionInformation(prev => ({
          ...prev,
          state: newState,
          ...additionalData,
        }));
      } catch (error) {
        const errorMessage = 'خطا در بروزرسانی وضعیت';
        snackbar(errorMessage, 'error', 5000);
        console.error('Update state error:', error);
      }
    },
    [snackbar]
  );

  // Handle step change with error handling
  const handleStepChange = useCallback(
    async newStep => {
      console.log(`Moving to step ${newStep}`);
      setIsLoading(true);
      setError(null);

      try {
        const stateMap = {
          0: 'MOSHAKHASAT_ESTEHZARIYE',
          1: 'TAKHASOS_ESTEHZARIYE',
          2: 'SODOR_ESTEHZARIYE',
          3: 'EKHTESAS_AFRAD',
          4: 'EKHTESAS_BAZBINEH',
          5: 'SODOR_DASTOROLAMAL',
        };

        const newState = stateMap[newStep];
        if (newState) {
          updateInspectionState(newState);
        }

        setSelectedStep(newStep);
        await fetchMockData();

        snackbar(`وارد مرحله ${newStep + 1} شدید`, 'success', 3000);
      } catch (error) {
        const errorMessage = error.message || 'خطا در تغییر مرحله';
        setError(errorMessage);
        snackbar(errorMessage, 'error', 5000);
        console.error('Error changing step:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchMockData, updateInspectionState, snackbar]
  );

  const handleRefetch = useCallback(async () => {
    try {
      await refetch();
      snackbar('داده‌ها با موفقیت به‌روزرسانی شدند', 'success', 3000);
    } catch (error) {
      const errorMessage = error.message || 'خطا در به‌روزرسانی داده‌ها';
      snackbar(errorMessage, 'error', 5000);
    }
  }, [refetch, snackbar]);

  // Initialize mock data on mount
  useEffect(() => {
    if (useMockData) {
      fetchMockData().catch(error => {
        snackbar('خطا در بارگذاری داده‌ها', 'error', 5000);
      });
    }
  }, [fetchMockData, useMockData, snackbar]);

  // Update step based on state
  useEffect(() => {
    if (!inspectionInformation) return;

    try {
      const stateMap = {
        MOSHAKHASAT_ESTEHZARIYE: 0,
        TAKHASOS_ESTEHZARIYE: 1,
        SODOR_ESTEHZARIYE: 2,
        EKHTESAS_AFRAD: 3,
        EKHTESAS_BAZBINEH: 4,
        SODOR_DASTOROLAMAL: 5,
      };

      const currentState = inspectionInformation?.state;
      const newStep = stateMap[currentState];

      if (newStep !== undefined && newStep !== selectedStep) {
        setSelectedStep(newStep);
      }
    } catch (error) {
      console.error('Error updating step from state:', error);
    }
  }, [inspectionInformation, selectedStep]);

  // Validation with error handling
  if (!provinceId || provinceId === 'null') {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          شناسه استان معتبر نیست
        </Alert>
        <Button variant="contained" onClick={() => window.history.back()}>
          بازگشت
        </Button>
      </Box>
    );
  }

  if (isLoading) {
    return <Skeleton height={500} />;
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={handleRefetch}>
          تلاش مجدد
        </Button>
      </Box>
    );
  }

  // Create context for child components
  const stepContext = {
    inspectionInformation,
    setInspectionInformation,
    refetchStep: handleRefetch,
    onStepChange: handleStepChange,
    currentStep: selectedStep,
    useMockData,
    experts,
    setExperts,
    leadInfo,
    setLeadInfo,
    reviews,
    setReviews,
    updateInspectionState,
    availablePersonnel,
    setAvailablePersonnel,
    availableUnits,
    setAvailableUnits,
    availableSpecialties,
    setAvailableSpecialties,
    snackbar,
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ margin: '20px' }}>
        <Typography fontWeight={700} variant="h5">
          پیکربندی بازدید استانی {inspectionInformation?.provinceName}
        </Typography>
        <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
          شناسه بازدید: {inspectionInformation?.provincialInspectionId} | وضعیت:{' '}
          {inspectionInformation?.state} | مرحله: {selectedStep + 1} | نوع:{' '}
          {inspectionInformation?.inspectionTypeKey}
        </Typography>
        <Box sx={{ mt: 1, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button size="small" variant="outlined" onClick={handleRefetch}>
            رفرش دستی
          </Button>
          <Typography variant="caption" color="success.main">
            🔧 حالت توسعه (Mock Data)
          </Typography>
          {error && (
            <Typography variant="caption" color="error.main">
              ⚠️ خطا: {error}
            </Typography>
          )}
        </Box>
      </Box>

      <MatnaStepper steps={steps} selectedStep={selectedStep} />

      <Box width={'100%'}>
        {selectedStep === 0 && <StartInspectionStep1 {...stepContext} />}
        {selectedStep === 1 && <StartInspectionStep2 {...stepContext} />}
        {selectedStep === 2 && <StartInspectionStep3 {...stepContext} />}
        {selectedStep === 3 && <StartInspectionStep4 {...stepContext} />}
        {selectedStep === 4 && <StartInspectionStep5 {...stepContext} />}
        {selectedStep === 5 && <StartInspectionStep6 {...stepContext} />}
      </Box>
    </Box>
  );
};

export default StartOperationSteps;
