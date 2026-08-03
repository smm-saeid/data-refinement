// import {
//   Box,
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
//   Grid,
//   Skeleton,
// } from '@mui/material';
// import { useEffect, useState } from 'react';
// import moment from 'moment-jalaali';
// import { dateDiff } from '@/modules/inspection-operation/scheduled/utils/utils.ts';
// import MatnaEditor from '@/components/MatnaEditor.tsx';
// import { useMutation, useQuery } from '@tanstack/react-query';
// import { useLegacyApi } from 'hooks/useLegacyApi.ts';
// import { useSnackbar } from '@/hooks/useSnackbar';

// const issuanceInformaionInitialData = `
// <p style="text-align: center">بسمه تعالی</p>
// <p style="text-align: center">
//   <img
//     class="image_resized"
//     style="aspect-ratio: 485/533; width: 7.69%"
//     src="/artesh.jpg"
//     width="485"
//     height="533"
//   />
// </p>
// <p style="text-align: center">فرماندهی کل آجا</p>
// <p>
//   از: معاونت بازرسي و ایمنی آجا (اداره عمليات بازرسی و پیگیری - دایره عملیات بازرسی) &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
//   شماره: &nbsp; &nbsp; &nbsp; /15/8310/ب/var-year
// </p>
// <p>
//   به: امير ریاست محترم ستاد و معاون هماهنگ کننده آجا &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
//   تاریخ: &nbsp; &nbsp; &nbsp; &nbsp; var-current-date
// </p>
// <p>
//   موضوع: بازرسی و ارزیابی میدانی از یگان‌های آجا مستقر در استان var-province-name &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
//   پیوست: ندارد
// </p>
// <p style="text-align: center;">&nbsp;</p>
// <p style="text-align: center">با صلوات بر حضرت محمّد(ص) و آل محمّد(ص)</p>
// <p style="text-align: center">
//   <span class="text-big"><strong>«گردشکار»</strong></span>
// </p>
// <p>سلام‌علیکم، با احترام به استحضار می‌رساند:</p>

// <p style="text-align: justify"><strong>1. سابقه:</strong></p>
// <p style="text-align: justify">
//   در اجرای اوامر امیر فرماندهی محترم کل آجا در جلسه ارائه عملکرد معاونت بازرسی و ایمنی آجا مبنی بر «برنامه‌ریزی به منظور بازدید از کل یگان‌های آجا با تمرکز بر آمادگی رزمی و توان عملیاتی (حوزه‌های اطلاعات و عملیات) و همچنین ارزیابی میزان خسارت یگان‌های آسیب‌دیده در جنگ تحمیلی 12 روزه» در نظر است از یگان‌های آجا مستقر در استان
//   <strong>var-province-name</strong>
//   در قالب یک هیئت به استعداد
//   <strong>var-number-of-inspectors</strong>
//   نفر از تاریخ
//   <strong>var-from-date</strong>
//   به مدت
//   <strong>var-duration</strong>
//   روز با تخصص‌های مندرج در جداول ذیل، بازرسی و ارزیابی میدانی به‌عمل آید.
// </p>
// <p style="text-align: justify">• تیم بازرسی از یگان‌های نپاجا و نهاجا</p>
// <p style="text-align: justify">• تیم بازرسی از یگان‌های نداجا</p>

// <p style="text-align: justify"><strong>2. اهداف بازرسی:</strong></p>
// <p style="text-align: justify">• ارزیابی آمادگی و توان رزم یگان‌ها</p>
// <p style="text-align: justify">• وضعیت معنویت و بصیرت</p>
// <p style="text-align: justify">• شرایط معیشت به ویژه مسکن</p>
// <p style="text-align: justify">• میزان خسارات وارده در حوزه نیروی انسانی و تجهیزات</p>
// <p style="text-align: justify">• پیشرفت و بازسازی و برگشت به حالت اول (قبل از جنگ 12 روزه تحمیلی)</p>
// <p style="text-align: justify">• ابتکارات و خلاقیت‌های نوین مبنی بر سناریو‌های احتمالی دشمن</p>
// <p style="text-align: justify">• پیشنهاد و نیازمندی واقعی در راستای مأموریت‌های واگذاری با توجه به واقعیت‌های میدانی</p>

// <p style="text-align: justify;"><strong>3. ترکیب هیئت بازرسی:</strong></p>
// <figure class="table">var-table</figure>

// <p style="text-align:justify;">4. <strong>var-lead-degree var-lead-name</strong> به عنوان رئیس هیئت‌ بازرسی از یگان‌های مستقر در استان <strong>var-province-name</strong> در نظر گرفته شده است.</p>

// <p style="text-align:justify;">5. به‌منظور حصول به نتایج مطلوب و کیفی در نظر است کارشناسان مندرج در جدول فوق از کارکنان شاخص، با‌تجربه و متخصص معاونت‌ها/ اداره‌ها/ سازمان‌ها و الزاماً از بازرسانی که جهت تشکیل بانک بازرسان این معاونت معرفی شده‌اند، انتخاب گردند.</p>

// <p style="text-align: justify;"><strong>«پیشنهادات»</strong></p>
// <p style="text-align:justify;">6. با عنایت به موارد معروضِ فوق استدعا دارد در صورت تصویب مقرر فرمائید:</p>
// <p style="text-align:justify;">الف) مراتب اجرای بازرسی طی دستورالعمل تکمیلی 48 ساعت قبل به نیروهای ذی‌ربط ابلاغ گردد.</p>
// <p style="text-align:justify;">ب) قرارگاه پشتیبانی ستاد آجا در خصوص دریافت بلیط هواپیما به شرح ذیل با هماهنگی این معاونت اقدام نمایند.</p>
// <p style="text-align:justify;">• تعداد <strong>var-number-of-inspectors</strong> فقره بلیط رفت هواپیما از تهران به <strong>var-province-name</strong> در بعد از ظهر مورخه <strong>var-from-date</strong></p>
// <p style="text-align:justify;">• تعداد <strong>var-number-of-inspectors</strong> فقره بلیط برگشت هواپیما از <strong>var-province-name</strong> به تهران بعدازظهر مورخه <strong>var-to-date</strong></p>
// <p style="text-align:justify;">پ) منوط به اوامر عالیست.</p>

// <p style="text-align:left;"><strong>معاون بازرسي و ایمنی آجا ـ سرتيپ ستاد ابوالفضل سپهری راد</strong></p>
// <p style="text-align:left;">&nbsp;</p>
// <p style="text-align:left;"><strong>اوامر امیر ریاست محترم ستاد و معاون هماهنگ‌کننده آجا: ........................................................................................</strong></p>
// <p style="text-align:left;">&nbsp;</p>
// <p style="text-align:left;">&nbsp;</p>
// <p style="text-align:left;"><strong>نظریه امیر جانشین محترم رئیس ستاد و معاون هماهنگ کننده آجا:</strong></p>
// <p style="text-align:left;">&nbsp;</p>
// <p style="text-align:left;">&nbsp;</p>
// <p style="text-align:left;">&nbsp;</p>
// <p style="text-align:left;"><strong>جانشین معاون بازرسی و ایمنی آجا ـ سرتیپ دوم ستاد محمد عزیزی</strong></p>
// <p style="text-align:left;">&nbsp;</p>
// <p style="text-align:left;"><strong>رئیس اداره عملیات بازرسی و پیگیری ـ سرتیپ‌دوم ستاد علی حاجی‌زاده</strong></p>
// <p style="text-align:left;">&nbsp;</p>
// <p style="text-align:left;"><strong>کارشناس ارشد عملیات بازرسی ـ سرهنگ ستاد حمید ناطقی</strong></p>
// `;

// const StartInspectionStep3 = ({ inspectionInformation, refetchStep }) => {
//   const legacyApi = useLegacyApi();
//   const snackbar = useSnackbar();
//   const [issuanceInformation, setIssuanceInformation] = useState(null);
//   const [backModalIsOpen, setBackModalIsOpen] = useState(false);
//   const [sendModalIsOpen, setSendModalIsOpen] = useState(false);

//   // Fetch lead inspector info
//   const { data: leadInitialInfo } = useQuery({
//     queryKey: ['lead-inspection', inspectionInformation?.inspectionId],
//     queryFn: () =>
//       legacyApi.get(
//         `/lead-inspection/find-by-inspection?inspectionId=${inspectionInformation?.inspectionId}`
//       ),
//     select: (res: any) => res?.data,
//     enabled: !!inspectionInformation?.inspectionId,
//   });

//   // Fetch experts/specialists
//   const { data: experts } = useQuery({
//     queryKey: ['person-speciality', inspectionInformation?.inspectionId],
//     queryFn: () =>
//       legacyApi.get(
//         `/person-speciality/find-by-inspection?pageSize=1000&currentPage=1&inspectionId=${inspectionInformation?.inspectionId}`
//       ),
//     select: (res: any) => res?.data?.rows || [],
//     enabled: !!inspectionInformation?.inspectionId,
//   });

//   // Calculate working days (excluding Fridays)
//   const findWeekDays = () => {
//     if (
//       !!inspectionInformation?.informationStartDate &&
//       !!inspectionInformation?.informationEndDate
//     ) {
//       let weekDaysCount = 0;
//       let start = new Date(
//         inspectionInformation?.informationStartDate
//       ).getDay();
//       for (
//         let i = 0;
//         i <
//         dateDiff(
//           new Date(inspectionInformation?.informationStartDate),
//           new Date(inspectionInformation?.informationEndDate)
//         );
//         i++
//       ) {
//         if ((start + i) % 7 != 5) {
//           weekDaysCount++;
//         }
//       }
//       return weekDaysCount;
//     }
//     return 0;
//   };

//   // Generate HTML table from experts data
//   const generateInspectionTable = () => {
//     if (!experts || experts.length === 0) {
//       return '<p>هیئت بازرسی تعیین نشده است</p>';
//     }

//     let tableRows = '';
//     experts.forEach((expert, index) => {
//       tableRows += `
//         <tr>
//           <td style="padding: 8px; text-align: center;">${index + 1}</td>
//           <td style="padding: 8px; text-align: center;">${expert?.position || '---'}</td>
//           <td style="padding: 8px; text-align: center;">${expert?.commonBaseDataFieldValue || '---'}</td>
//           <td style="padding: 8px; text-align: center;">${expert?.organizationUnitName || '---'}</td>
//           <td style="padding: 8px; text-align: center;">1</td>
//         </tr>
//       `;
//     });

//     return `
//       <table style="width:100%; border-collapse: collapse; margin: 10px 0; direction: rtl;" border="1">
//         <thead>
//           <tr>
//             <th style="padding: 8px; text-align: center; background-color: #f2f2f2;">ردیف</th>
//             <th style="padding: 8px; text-align: center; background-color: #f2f2f2;">سمت در هیئت بازرسی</th>
//             <th style="padding: 8px; text-align: center; background-color: #f2f2f2;">تخصص</th>
//             <th style="padding: 8px; text-align: center; background-color: #f2f2f2;">معاونت/یگان</th>
//             <th style="padding: 8px; text-align: center; background-color: #f2f2f2;">تعداد</th>
//           </tr>
//         </thead>
//         <tbody>
//           ${tableRows}
//         </tbody>
//       </table>
//     `;
//   };
//   // Replace all variables in HTML
//   const insertIntoHtml = (issuanceInformation: string) => {
//     var newhtml = issuanceInformation;

//     newhtml = newhtml.replaceAll('var-table', generateInspectionTable());
//     newhtml = newhtml.replaceAll(
//       'var-current-date',
//       moment(new Date()).format('jYYYY/jMM/jDD')
//     );
//     newhtml = newhtml.replaceAll(
//       'var-province-name',
//       inspectionInformation?.provinceName || '---'
//     );
//     newhtml = newhtml.replaceAll(
//       'var-org-name',
//       inspectionInformation?.organizationUnitName
//     );
//     newhtml = newhtml.replaceAll(
//       'var-year',
//       inspectionInformation?.informationStartDate
//         ? moment(inspectionInformation?.informationStartDate).format('jYYYY')
//         : moment().format('jYYYY')
//     );
//     newhtml = newhtml.replaceAll(
//       'var-from-date',
//       inspectionInformation?.informationStartDate
//         ? moment(inspectionInformation?.informationStartDate).format(
//             'jYYYY/jMM/jDD'
//           )
//         : '---'
//     );
//     newhtml = newhtml.replaceAll(
//       'var-to-date',
//       inspectionInformation?.informationEndDate
//         ? moment(inspectionInformation?.informationEndDate).format(
//             'jYYYY/jMM/jDD'
//           )
//         : '---'
//     );
//     newhtml = newhtml.replaceAll(
//       'var-duration',
//       findWeekDays()?.toString() || '0'
//     );

//     const numberOfInspectors = experts?.length
//       ? (experts.length + 1).toString()
//       : '1';
//     newhtml = newhtml.replaceAll(
//       'var-number-of-inspectors',
//       numberOfInspectors
//     );

//     const leadName = leadInitialInfo
//       ? `${leadInitialInfo.name || ''} ${leadInitialInfo.family || ''}`.trim()
//       : '---';
//     const leadDegree = leadInitialInfo?.degree || '---';

//     newhtml = newhtml.replaceAll('var-lead-name', leadName);
//     newhtml = newhtml.replaceAll('var-lead-degree', leadDegree);

//     return newhtml;
//   };

//   useEffect(() => {
//     if (
//       inspectionInformation != null &&
//       experts != null &&
//       leadInitialInfo != null
//     ) {
//       if (inspectionInformation.issuanceInformation != null) {
//         setIssuanceInformation(inspectionInformation.issuanceInformation);
//       } else {
//         setIssuanceInformation(insertIntoHtml(issuanceInformaionInitialData));
//       }
//     }
//   }, [inspectionInformation, experts, leadInitialInfo]);

//   // Handle back to previous step
//   const handleBack = () => {
//     legacyApi
//       .request({
//         entity: '/information',
//         method: 'put',
//         data: {
//           ...inspectionInformation,
//           issuanceInformation: null,
//           state: 'TAKHASOS_ESTEHZARIYE',
//         },
//       })
//       .then(() => {
//         return legacyApi.request({
//           entity: `/information/delete-cartable-by-id-and-type?id=${inspectionInformation.id}&type=information`,
//           method: 'delete',
//           data: null,
//         });
//       })
//       .then(() => {
//         refetchStep();
//         setBackModalIsOpen(false);
//       })
//       .catch(() => {
//         snackbar('خطا در بازگشت به مرحله قبل', 'error', 3000);
//       });
//   };

//   // Handle send for approval
//   const handleSendForApproval = () => {
//     legacyApi
//       .request({
//         entity: '/information',
//         method: 'put',
//         data: {
//           ...inspectionInformation,
//           issuanceInformation: issuanceInformation,
//         },
//       })
//       .then(() => {
//         return legacyApi.request({
//           entity: `/information/save-to-cartable?informationId=${inspectionInformation.id}&type=information`,
//           method: 'post',
//           data: null,
//         });
//       })
//       .then(() => {
//         refetchStep();
//         setSendModalIsOpen(false);
//         snackbar(
//           'گردش کار با موفقیت به کارتابل مراجع بالاتر ارسال گردید. پس از تایید دکمه <ادامه> فعال خواهد شد.',
//           'success',
//           5000
//         );
//       })
//       .catch(() => {
//         snackbar('خطا در ارسال به کارتابل', 'error', 3000);
//       });
//   };

//   // Handle continue to next step
//   const handleContinue = () => {
//     legacyApi
//       .request({
//         entity: '/information',
//         method: 'put',
//         data: {
//           ...inspectionInformation,
//           state: 'EKHTESAS_AFRAD',
//         },
//       })
//       .then(() => {
//         refetchStep();
//       })
//       .catch(error => {
//         console.error('Error updating state:', error);
//         snackbar('خطا در ادامه مرحله', 'error', 3000);
//       });
//   };

//   // Check if data is loading
//   const isLoading = !inspectionInformation || !experts || !leadInitialInfo;

//   return (
//     <Box
//       margin={'10px'}
//       sx={{
//         backgroundColor: 'white',
//         color: 'black',
//         fontFamily: 'Nazanin',
//         lineHeight: '40px',
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//       }}
//     >
//       {isLoading || !issuanceInformation ? (
//         <Skeleton height={1000} width="100%" />
//       ) : (
//         <MatnaEditor
//           onChange={(_, myeditor) => {
//             setIssuanceInformation(myeditor.getData());
//           }}
//           initialData={issuanceInformation}
//         />
//       )}

//       <Box margin={'50px'}>
//         <Grid container>
//           <Grid size={{ xs: 12 }}>
//             <Button
//               variant="contained"
//               color="error"
//               onClick={() => setBackModalIsOpen(true)}
//               sx={{ margin: '10px' }}
//             >
//               مرحله قبل
//             </Button>
//             <Button
//               variant="contained"
//               color="success"
//               onClick={() => setSendModalIsOpen(true)}
//               sx={{ margin: '10px' }}
//             >
//               ثبت و ارسال به کارتابل
//             </Button>
//             <Button
//               variant={'contained'}
//               onClick={handleContinue}
//               sx={{ margin: '10px' }}
//             >
//               ادامه
//             </Button>
//           </Grid>
//         </Grid>
//       </Box>

//       {/* Back Confirmation Dialog */}
//       <Dialog
//         maxWidth="md"
//         open={backModalIsOpen}
//         onClose={() => setBackModalIsOpen(false)}
//       >
//         <DialogTitle>هشدار</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             آیا مایل به بازگشت به مرحله قبل هستید؟ تغییرات شما در این مرحله از
//             بین خواهد رفت.
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setBackModalIsOpen(false)} color="inherit">
//             لغو
//           </Button>
//           <Button onClick={handleBack} variant="contained" color="primary">
//             تایید
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Send Confirmation Dialog */}
//       <Dialog
//         maxWidth="md"
//         open={sendModalIsOpen}
//         onClose={() => setSendModalIsOpen(false)}
//       >
//         <DialogTitle>هشدار</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             استحضاریه برای تایید به کارتابل مراجع بالاتر ارسال می شود.
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setSendModalIsOpen(false)} color="inherit">
//             لغو
//           </Button>
//           <Button
//             onClick={handleSendForApproval}
//             variant="contained"
//             color="primary"
//           >
//             تایید
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default StartInspectionStep3;
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Skeleton,
  Alert, // This was missing!
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import moment from 'moment-jalaali';
import { dateDiff } from '@/modules/inspection-operation/scheduled/utils/utils.ts';
import MatnaEditor from '@/components/MatnaEditor.tsx';
import { useSnackbar } from '@/hooks/useSnackbar';

const issuanceInformaionInitialData = `
<p style="text-align: center">بسمه تعالی</p>
<p style="text-align: center">
  <img
    class="image_resized"
    style="aspect-ratio: 485/533; width: 7.69%"
    src="/artesh.jpg"
    width="485"
    height="533"
  />
</p>
<p style="text-align: center">فرماندهی کل آجا</p>
<p>
  از: معاونت بازرسي و ایمنی آجا (اداره عمليات بازرسی و پیگیری - دایره عملیات بازرسی) &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
  شماره: &nbsp; &nbsp; &nbsp; /15/8310/ب/var-year
</p>
<p>
  به: امير ریاست محترم ستاد و معاون هماهنگ کننده آجا &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
  تاریخ: &nbsp; &nbsp; &nbsp; &nbsp; var-current-date
</p>
<p>
  موضوع: بازرسی و ارزیابی میدانی از یگان‌های آجا مستقر در استان var-province-name &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
  پیوست: ندارد
</p>
<p style="text-align: center;">&nbsp;</p>
<p style="text-align: center">با صلوات بر حضرت محمّد(ص) و آل محمّد(ص)</p>
<p style="text-align: center">
  <span class="text-big"><strong>«گردشکار»</strong></span>
</p>
<p>سلام‌علیکم، با احترام به استحضار می‌رساند:</p>

<p style="text-align: justify"><strong>1. سابقه:</strong></p>
<p style="text-align: justify">
  در اجرای اوامر امیر فرماندهی محترم کل آجا در جلسه ارائه عملکرد معاونت بازرسی و ایمنی آجا مبنی بر «برنامه‌ریزی به منظور بازدید از کل یگان‌های آجا با تمرکز بر آمادگی رزمی و توان عملیاتی (حوزه‌های اطلاعات و عملیات) و همچنین ارزیابی میزان خسارت یگان‌های آسیب‌دیده در جنگ تحمیلی 12 روزه» در نظر است از یگان‌های آجا مستقر در استان 
  <strong>var-province-name</strong>
  در قالب یک هیئت به استعداد 
  <strong>var-number-of-inspectors</strong>
  نفر از تاریخ 
  <strong>var-from-date</strong>
  به مدت 
  <strong>var-duration</strong>
  روز با تخصص‌های مندرج در جداول ذیل، بازرسی و ارزیابی میدانی به‌عمل آید.
</p>
<p style="text-align: justify">• تیم بازرسی از یگان‌های نپاجا و نهاجا</p>
<p style="text-align: justify">• تیم بازرسی از یگان‌های نداجا</p>

<p style="text-align: justify"><strong>2. اهداف بازرسی:</strong></p>
<p style="text-align: justify">• ارزیابی آمادگی و توان رزم یگان‌ها</p>
<p style="text-align: justify">• وضعیت معنویت و بصیرت</p>
<p style="text-align: justify">• شرایط معیشت به ویژه مسکن</p>
<p style="text-align: justify">• میزان خسارات وارده در حوزه نیروی انسانی و تجهیزات</p>
<p style="text-align: justify">• پیشرفت و بازسازی و برگشت به حالت اول (قبل از جنگ 12 روزه تحمیلی)</p>
<p style="text-align: justify">• ابتکارات و خلاقیت‌های نوین مبنی بر سناریو‌های احتمالی دشمن</p>
<p style="text-align: justify">• پیشنهاد و نیازمندی واقعی در راستای مأموریت‌های واگذاری با توجه به واقعیت‌های میدانی</p>

<p style="text-align: justify;"><strong>3. ترکیب هیئت بازرسی:</strong></p>
<figure class="table">var-table</figure>

<p style="text-align:justify;">4. <strong>var-lead-degree var-lead-name</strong> به عنوان رئیس هیئت‌ بازرسی از یگان‌های مستقر در استان <strong>var-province-name</strong> در نظر گرفته شده است.</p>

<p style="text-align:justify;">5. به‌منظور حصول به نتایج مطلوب و کیفی در نظر است کارشناسان مندرج در جدول فوق از کارکنان شاخص، با‌تجربه و متخصص معاونت‌ها/ اداره‌ها/ سازمان‌ها و الزاماً از بازرسانی که جهت تشکیل بانک بازرسان این معاونت معرفی شده‌اند، انتخاب گردند.</p>

<p style="text-align: justify;"><strong>«پیشنهادات»</strong></p>
<p style="text-align:justify;">6. با عنایت به موارد معروضِ فوق استدعا دارد در صورت تصویب مقرر فرمائید:</p>
<p style="text-align:justify;">الف) مراتب اجرای بازرسی طی دستورالعمل تکمیلی 48 ساعت قبل به نیروهای ذی‌ربط ابلاغ گردد.</p>
<p style="text-align:justify;">ب) قرارگاه پشتیبانی ستاد آجا در خصوص دریافت بلیط هواپیما به شرح ذیل با هماهنگی این معاونت اقدام نمایند.</p>
<p style="text-align:justify;">• تعداد <strong>var-number-of-inspectors</strong> فقره بلیط رفت هواپیما از تهران به <strong>var-province-name</strong> در بعد از ظهر مورخه <strong>var-from-date</strong></p>
<p style="text-align:justify;">• تعداد <strong>var-number-of-inspectors</strong> فقره بلیط برگشت هواپیما از <strong>var-province-name</strong> به تهران بعدازظهر مورخه <strong>var-to-date</strong></p>
<p style="text-align:justify;">پ) منوط به اوامر عالیست.</p>

<p style="text-align:left;"><strong>معاون بازرسي و ایمنی آجا ـ سرتيپ ستاد ابوالفضل سپهری راد</strong></p>
<p style="text-align:left;">&nbsp;</p>
<p style="text-align:left;"><strong>اوامر امیر ریاست محترم ستاد و معاون هماهنگ‌کننده آجا: ........................................................................................</strong></p>
<p style="text-align:left;">&nbsp;</p>
<p style="text-align:left;">&nbsp;</p>
<p style="text-align:left;"><strong>نظریه امیر جانشین محترم رئیس ستاد و معاون هماهنگ کننده آجا:</strong></p>
<p style="text-align:left;">&nbsp;</p>
<p style="text-align:left;">&nbsp;</p>
<p style="text-align:left;">&nbsp;</p>
<p style="text-align:left;"><strong>جانشین معاون بازرسی و ایمنی آجا ـ سرتیپ دوم ستاد محمد عزیزی</strong></p>
<p style="text-align:left;">&nbsp;</p>
<p style="text-align:left;"><strong>رئیس اداره عملیات بازرسی و پیگیری ـ سرتیپ‌دوم ستاد علی حاجی‌زاده</strong></p>
<p style="text-align:left;">&nbsp;</p>
<p style="text-align:left;"><strong>کارشناس ارشد عملیات بازرسی ـ سرهنگ ستاد حمید ناطقی</strong></p>
`;

const StartInspectionStep3 = ({
  inspectionInformation,
  setInspectionInformation,
  refetchStep,
  onStepChange,
  currentStep,
  useMockData = true,
  updateInspectionState,
  experts = [],
  leadInfo = {},
}) => {
  const snackbar = useSnackbar();
  const [issuanceInformation, setIssuanceInformation] = useState(null);
  const [backModalIsOpen, setBackModalIsOpen] = useState(false);
  const [sendModalIsOpen, setSendModalIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const findWeekDays = () => {
    try {
      if (
        !!inspectionInformation?.informationStartDate &&
        !!inspectionInformation?.informationEndDate
      ) {
        let weekDaysCount = 0;
        let start = new Date(
          inspectionInformation?.informationStartDate
        ).getDay();
        for (
          let i = 0;
          i <
          dateDiff(
            new Date(inspectionInformation?.informationStartDate),
            new Date(inspectionInformation?.informationEndDate)
          );
          i++
        ) {
          if ((start + i) % 7 != 5) {
            weekDaysCount++;
          }
        }
        return weekDaysCount;
      }
      return 0;
    } catch (error) {
      console.error('Error calculating week days:', error);
      return 0;
    }
  };

  const generateInspectionTable = () => {
    try {
      if (!experts || experts.length === 0) {
        return '<p>هیئت بازرسی تعیین نشده است</p>';
      }

      let tableRows = '';
      experts.forEach((expert, index) => {
        tableRows += `
          <tr>
            <td style="padding: 8px; text-align: center;">${index + 1}</td>
            <td style="padding: 8px; text-align: center;">${expert?.position || '---'}</td>
            <td style="padding: 8px; text-align: center;">${expert?.commonBaseDataFieldValue || expert?.specialty || '---'}</td>
            <td style="padding: 8px; text-align: center;">${expert?.organizationUnitName || expert?.unit || '---'}</td>
            <td style="padding: 8px; text-align: center;">1</td>
          </tr>
        `;
      });

      return `
        <table style="width:100%; border-collapse: collapse; margin: 10px 0; direction: rtl;" border="1">
          <thead>
            <tr>
              <th style="padding: 8px; text-align: center; background-color: #f2f2f2;">ردیف</th>
              <th style="padding: 8px; text-align: center; background-color: #f2f2f2;">سمت در هیئت بازرسی</th>
              <th style="padding: 8px; text-align: center; background-color: #f2f2f2;">تخصص</th>
              <th style="padding: 8px; text-align: center; background-color: #f2f2f2;">معاونت/یگان</th>
              <th style="padding: 8px; text-align: center; background-color: #f2f2f2;">تعداد</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      `;
    } catch (error) {
      console.error('Error generating table:', error);
      return '<p>خطا در تولید جدول</p>';
    }
  };

  const insertIntoHtml = (issuanceInformation: string) => {
    try {
      var newhtml = issuanceInformation;

      newhtml = newhtml.replaceAll('var-table', generateInspectionTable());
      newhtml = newhtml.replaceAll(
        'var-current-date',
        moment(new Date()).format('jYYYY/jMM/jDD')
      );
      newhtml = newhtml.replaceAll(
        'var-province-name',
        inspectionInformation?.provinceName || '---'
      );
      newhtml = newhtml.replaceAll(
        'var-org-name',
        inspectionInformation?.organizationUnitName || 'معاونت بازرسی'
      );
      newhtml = newhtml.replaceAll(
        'var-year',
        inspectionInformation?.informationStartDate
          ? moment(inspectionInformation?.informationStartDate).format('jYYYY')
          : moment().format('jYYYY')
      );
      newhtml = newhtml.replaceAll(
        'var-from-date',
        inspectionInformation?.informationStartDate
          ? moment(inspectionInformation?.informationStartDate).format(
              'jYYYY/jMM/jDD'
            )
          : '---'
      );
      newhtml = newhtml.replaceAll(
        'var-to-date',
        inspectionInformation?.informationEndDate
          ? moment(inspectionInformation?.informationEndDate).format(
              'jYYYY/jMM/jDD'
            )
          : '---'
      );
      newhtml = newhtml.replaceAll(
        'var-duration',
        findWeekDays()?.toString() || '0'
      );

      const numberOfInspectors = experts?.length
        ? (experts.length + 1).toString()
        : '1';
      newhtml = newhtml.replaceAll(
        'var-number-of-inspectors',
        numberOfInspectors
      );

      const leadName = leadInfo
        ? `${leadInfo.name || ''} ${leadInfo.family || ''}`.trim()
        : '---';
      const leadDegree = leadInfo?.degree || '---';

      newhtml = newhtml.replaceAll('var-lead-name', leadName);
      newhtml = newhtml.replaceAll('var-lead-degree', leadDegree);

      return newhtml;
    } catch (error) {
      console.error('Error inserting into HTML:', error);
      return issuanceInformation;
    }
  };

  useEffect(() => {
    try {
      if (inspectionInformation != null) {
        if (inspectionInformation.issuanceInformation != null) {
          setIssuanceInformation(inspectionInformation.issuanceInformation);
        } else {
          setIssuanceInformation(insertIntoHtml(issuanceInformaionInitialData));
        }
      }
    } catch (error) {
      const errorMessage = 'خطا در بارگذاری اطلاعات';
      setError(errorMessage);
      if (snackbar) {
        snackbar(errorMessage, 'error', 5000);
      }
      console.error('Effect error:', error);
    }
  }, [inspectionInformation, experts, leadInfo, snackbar]);

  const handleBack = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      if (useMockData) {
        const updatedData = {
          ...inspectionInformation,
          issuanceInformation: null,
          state: 'TAKHASOS_ESTEHZARIYE',
        };

        if (setInspectionInformation) {
          setInspectionInformation(updatedData);
        }
        if (updateInspectionState) {
          updateInspectionState('TAKHASOS_ESTEHZARIYE', {
            issuanceInformation: null,
          });
        }

        await refetchStep();
        setBackModalIsOpen(false);
        if (snackbar) {
          snackbar('به مرحله قبل بازگشتید', 'success', 3000);
        }
        onStepChange(1);
      } else {
        throw new Error('Real API not implemented in dev mode');
      }
    } catch (error) {
      const errorMessage = error.message || 'خطا در بازگشت به مرحله قبل';
      setError(errorMessage);
      if (snackbar) {
        snackbar(errorMessage, 'error', 3000);
      }
      console.error('Back error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendForApproval = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      if (useMockData) {
        const updatedData = {
          ...inspectionInformation,
          issuanceInformation: issuanceInformation,
        };

        if (setInspectionInformation) {
          setInspectionInformation(updatedData);
        }

        await new Promise(resolve => setTimeout(resolve, 500));
        await refetchStep();
        setSendModalIsOpen(false);
        if (snackbar) {
          snackbar(
            'گردش کار با موفقیت به کارتابل مراجع بالاتر ارسال گردید.',
            'success',
            5000
          );
        }
      } else {
        throw new Error('Real API not implemented in dev mode');
      }
    } catch (error) {
      const errorMessage = error.message || 'خطا در ارسال به کارتابل';
      setError(errorMessage);
      if (snackbar) {
        snackbar(errorMessage, 'error', 3000);
      }
      console.error('Send error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinue = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      if (useMockData) {
        const updatedData = {
          ...inspectionInformation,
          state: 'EKHTESAS_AFRAD',
        };

        if (setInspectionInformation) {
          setInspectionInformation(updatedData);
        }
        if (updateInspectionState) {
          updateInspectionState('EKHTESAS_AFRAD');
        }

        await refetchStep();
        onStepChange(3);
        if (snackbar) {
          snackbar('به مرحله بعد رفتید', 'success', 3000);
        }
      } else {
        throw new Error('Real API not implemented in dev mode');
      }
    } catch (error) {
      const errorMessage = error.message || 'خطا در ادامه مرحله';
      setError(errorMessage);
      if (snackbar) {
        snackbar(errorMessage, 'error', 3000);
      }
      console.error('Continue error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (currentStep !== 2) return null;

  return (
    <Box
      margin={'10px'}
      sx={{
        backgroundColor: 'white',
        color: 'black',
        fontFamily: 'Nazanin',
        lineHeight: '40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
      }}
    >
      {error && (
        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
          {error}
        </Alert>
      )}

      <Alert severity="info" sx={{ width: '100%', mb: 2 }}>
        <Typography variant="caption" color="success.main">
          🔧 حالت توسعه - داده‌ها به صورت محلی ذخیره می‌شوند
        </Typography>
        <Typography
          variant="caption"
          display="block"
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          تعداد بازرسان: {experts?.length || 0} | رئیس هیئت:{' '}
          {leadInfo ? `${leadInfo.name} ${leadInfo.family}` : 'انتخاب نشده'}
        </Typography>
      </Alert>

      {!issuanceInformation ? (
        <Skeleton height={1000} width="100%" />
      ) : (
        <MatnaEditor
          onChange={(_, myeditor) => {
            try {
              setIssuanceInformation(myeditor.getData());
            } catch (error) {
              console.error('Editor change error:', error);
            }
          }}
          initialData={issuanceInformation}
        />
      )}

      <Box margin={'50px'}>
        <Grid container>
          <Grid size={{ xs: 12 }}>
            <Button
              variant="contained"
              color="error"
              onClick={() => setBackModalIsOpen(true)}
              sx={{ margin: '10px' }}
              disabled={isSubmitting}
            >
              مرحله قبل
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => setSendModalIsOpen(true)}
              sx={{ margin: '10px' }}
              disabled={isSubmitting || !issuanceInformation}
            >
              ثبت و ارسال به کارتابل
            </Button>
            <Button
              variant={'contained'}
              onClick={handleContinue}
              sx={{ margin: '10px' }}
              disabled={isSubmitting}
            >
              ادامه
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Back Confirmation Dialog */}
      <Dialog
        maxWidth="md"
        open={backModalIsOpen}
        onClose={() => setBackModalIsOpen(false)}
      >
        <DialogTitle>هشدار</DialogTitle>
        <DialogContent>
          <DialogContentText>
            آیا مایل به بازگشت به مرحله قبل هستید؟ تغییرات شما در این مرحله از
            بین خواهد رفت.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBackModalIsOpen(false)} color="inherit">
            لغو
          </Button>
          <Button
            onClick={handleBack}
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            تایید
          </Button>
        </DialogActions>
      </Dialog>

      {/* Send Confirmation Dialog */}
      <Dialog
        maxWidth="md"
        open={sendModalIsOpen}
        onClose={() => setSendModalIsOpen(false)}
      >
        <DialogTitle>هشدار</DialogTitle>
        <DialogContent>
          <DialogContentText>
            استحضاریه برای تایید به کارتابل مراجع بالاتر ارسال می شود.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSendModalIsOpen(false)} color="inherit">
            لغو
          </Button>
          <Button
            onClick={handleSendForApproval}
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            تایید
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StartInspectionStep3;
