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
// import { useEffect, useMemo, useState } from 'react';
// import moment from 'moment-jalaali';
// import ReactDOMServer from 'react-dom/server';
// import { dateDiff } from '@/modules/inspection-operation/scheduled/utils/utils.ts';
// import MatnaEditor from '@/components/MatnaEditor.tsx';
// import { useMutation, useQuery } from '@tanstack/react-query';
// import { useLegacyApi } from 'hooks/useLegacyApi.ts';
// import { useSnackbar } from '@/hooks/useSnackbar';
// import { useNavigate } from 'react-router';
// // {/* <img style="width: 100px; height: auto;"  src="data:image/png;base64,data" alt="" /> */}

// const issuanceInstructionInitialData = `
// <p style="text-align:center;">بسمه تعالی</p>
// <p style="text-align:center;"><img class="image_resized" style="aspect-ratio:485/533;width:7.69%;" src="/artesh.jpg"
//         width="485" height="533"></p>
// <p style="text-align:center;">فرماندهی کل آجا</p>
// <h4>از: آجا (اداره عملیات بازرسی و پیگیری - عملیات بازرسی)<span class="text-tiny">&nbsp;</span> &nbsp; &nbsp; &nbsp;
//     &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
//     &nbsp;شماره: &nbsp;8310/ب/var-year</h4>
// <h4>به: امیر فرماندهی محترم کل آجا &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
//     &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
//     &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; تاریخ: var-current-date</h4>
// <h4>موضوع: دستور العمل بازرسی برنامه ای از var-org-name &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
//     &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;پیوست:</h4>
// <p>&nbsp;</p>
// <p style="text-align:center;">با صلوات بر محمد(ص) و آل محمد(ص)</p>
// <p style="text-align:center;">پیرو شماره:&nbsp;</p>
// <p>سلام علیکم،</p>
// <p style="text-align:justify;"><strong>1 ـ منظور:</strong></p>
// <p style="text-align:justify;">در این ماده منظور از اجرای بازرسی نوشته می شود.</p>
// <p style="text-align:justify;"><strong>2ـ&nbsp; اهداف:</strong></p>
// <p><span style="color:rgb(31,78,121);"><strong>الف) دستیابی به اطالعاتی در خصوص آخرین وضعیت یگان در زمینه تواناییها،
//             محدودیتها و نیازمندیهای یگان یا سازمان بازرسی شونده.</strong></span><br><span
//         style="color:rgb(31,78,121);"><strong>ب) ارزیابی نحوه عملکرد و بهرهوری، پیشرفت کار یگانها و کارکنان مربوطه در
//             سطوح مختلف.</strong></span><br><span style="color:rgb(31,78,121);"><strong>پ) ترغیب و هدایت فرماندهان،
//             مدیران، مسئولینو کارکنان به تفکر بیشتر در جهت افزایش کیفیت و کمیت فعالیتها از طریق استفاده بهتر از منابع
//             انسانی، مالی (اعتبارات)، تجهیزات و دانش علمی و فنی پیشرفته.</strong></span><br><span
//         style="color:rgb(31,78,121);"><strong>ت) ارزیابی و سنجش میزان کارایی مسئولین و کارکنان شایسته و کاردان در سطوح
//             مختلف بهمنظور تشویق و برخورد الزم با کارکنان بیتفاوت و کمکار در جهت اصالح آنها.</strong></span><br><span
//         style="color:rgb(31,78,121);"><strong>ث) حصول اطمینان از تداوم آمادگی تجهیزات و
//             کارکنان.</strong></span><br><span style="color:rgb(31,78,121);"><strong>ج) ایجاد انگیزه برای حرکت و پویایی
//             در کارکنان بهمنظور حفظ آمادگی در اجرای مأموریت و ارتقای آن.</strong></span><br><span
//         style="color:rgb(31,78,121);"><strong>چ) ارزیابی میزان تالشهای سلسلهمراتب و مسئولین ذیربط یگانها در جهت کشف و
//             رفع معایب و نواقص مشهوده در بازدیدها و بازرسیهای قبلی.</strong></span><br><span
//         style="color:rgb(31,78,121);"><strong>ح) پی بردن به تنگناهای یگان و ارائه پیشنهادهای منطقی و راهکار مناسب در جهت
//             رفع مشکالت و معضالت مشهوده به منظور ارتقاء سط</strong></span></p>
// <p style="text-align:justify;"><strong>3 ـ اجرا:</strong></p>
// <p style="text-align:justify;"><strong>الف - ترکیب هیئت بازرسی:</strong></p>
// <figure class="table">var-table</figure>
// <p style="text-align:justify;"><strong>ب - مدت بازرسی:&nbsp;</strong></p>
// <p style="text-align:justify;">بازرسی به مدت var-duration روز از تاریخ var-from-date انجام خواهد شد.</p>
// <p><strong>پ - زمانبندی اجرای بازرسی:</strong></p>
// <p><strong>- تاریخ شروع: var-from-date &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;-تاریخ
//         پایان: var-end-date &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; -به مدت روز کاری: var-duration</strong></p>
// <p><strong>ت - نحوه اجرا و حدود بازرسی:</strong></p>
// <p>نحوه اجرا و حدود بازرسی که بر مبنای هدف های بازرسی تهیه شده</p>
// <p><strong>ث - برنامه کار هیئت/گروه/تیم بازرسی:</strong></p>
// <p>&nbsp;</p>
// <p><strong>ج -وظایف یگان های همکار با سازمان بازرسی کننده:</strong></p>
// <p>&nbsp;</p>
// <p><strong>چ -وظایف رئیس هیئت/گروه/تیم بازرسی:</strong></p>
// <p>&nbsp;</p>
// <p><strong>ح -وظایف یگان/سازمان مورد بازرسی:</strong></p>
// <p>&nbsp;</p>
// <p style="text-align:justify;"><strong>خ - گزارش ها و مدارک بازرسی:</strong></p>
// <p style="text-align:justify;">(۱) گزارش رئیس و هر یک از اعضای هیئت/گروه/تیم بازرسی</p>
// <p style="text-align:justify;">(۲) بازبینه های تکمیل شده</p>
// <p style="text-align:justify;">(۳) جدول طبقه بندی یگان/سازمان مورد بازرسی</p>
// <p style="text-align:justify;">(۴) آمار نیرو انسانی</p>
// <p style="text-align:justify;">(۵) آمار جرائم و تخلفات</p>
// <p style="text-align:justify;">(۶) آمار وسایل عمده</p>
// <p style="text-align:justify;">(۷) نظریه رئیس هئیت/گروه/تیم بازررسی</p>
// <p style="text-align:justify;">(۸) سایر مدارک مأخوذه از یگان/سازمان مورد بازرسی</p>
// <p style="text-align:justify;"><strong>د - دستورهای هماهنگی:</strong></p>
// <p style="text-align:justify;">&nbsp;</p>
// <p style="text-align:justify;"><strong>۴ ـ دستورهای اداری و آماد و پشتیبانی:</strong></p>
// <p style="text-align:justify;">&nbsp;</p>
// <p style="text-align:justify;"><strong>۵ ـ نحوه ارتباط با سازمان بازرسی کننده:</strong></p>
// <p style="text-align:justify;">&nbsp;</p>
// <p><strong>امضا رئیس</strong></p>
// <p style="text-align:left;">&nbsp;</p>
// <p style="text-align:left;">&nbsp;</p>
// <p style="text-align:justify;"><strong>پیوست ها:</strong></p>
// <p style="text-align:justify;">&nbsp;</p>
// <p style="text-align:justify;"><strong>گیرندگان:</strong></p>
// <p style="text-align:justify;">&nbsp;</p>
// `;

// const StartInspectionStep6 = ({ inspectionInformation, refetchStep }) => {
//   const legacyApi = useLegacyApi();

//   const { mutate } = useMutation({
//     mutationFn: legacyApi.request,
//   });

//   const [issuanceInstruction, setIssuanceInstruction] = useState(null);
//   const snackbar = useSnackbar();
//   const navigate = useNavigate();

//   const { data: experts } = useQuery<any, any, any>({
//     queryKey: [
//       `/person-speciality/find-by-inspection?pageSize=1000&currentPage=1&inspectionId=${inspectionInformation.inspectionId}`,
//     ],
//     queryFn: () =>
//       legacyApi.get(
//         `/person-speciality/find-by-inspection?pageSize=1000&currentPage=1&inspectionId=${inspectionInformation.inspectionId}`
//       ),
//     select: (res: any) => {
//       return res?.data?.rows;
//     },
//   } as any);

//   const { data: leadInitialInfo } = useQuery<any, any, any>({
//     queryKey: [
//       `/lead-inspection/find-by-inspection/inspectionId=${inspectionInformation.inspectionId}`,
//     ],
//     queryFn: () =>
//       legacyApi.get(
//         `/lead-inspection/find-by-inspection?inspectionId=${inspectionInformation.inspectionId}`
//       ),
//     select: (res: any) => {
//       return res.data;
//     }
//   } as any);

//   const findWeekDays = () => {
//     if (
//       !!inspectionInformation?.informationStartDate &&
//       !!inspectionInformation?.informationEndDate
//     ) {
//       let weekDaysCount = 0;
//       let start = (new Date(inspectionInformation?.informationStartDate)).getDay();
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
//     return null;
//   };

//   const [backModalIsOpen, setBackModalIsOpen] = useState(false);
//   const [sendModalIsOpen, setSendModalIsOpen] = useState(false);

//   const inspectionTable =
//       `<table style={margin: "10px", align: "center"}>

//             <thead>
//                 <tr>
//                 <th>ردیف</th>
//                 <th>درجه</th>
//                 <th>یگان</th>
//                 <th>نام و نام خانوادگی</th>
//                 <th>مسئولیت در بازرسی</th>
//                 </tr>
//             </thead>
//             <table>
//                 <tbody>
//                 <tr>
//                 <th>1</th>
//                   <th>${leadInitialInfo?.degree}</th>
//                   <th>${leadInitialInfo?.organizationUnitName}</th>
//                   <th>${leadInitialInfo?.name} ${leadInitialInfo?.family}</th>
//                   <th>رئیس هیئت بازرسی</th>
//                 </tr>
//                 ${ReactDOMServer.renderToString(
//                   experts?.map((expert: any, index: any) => (
//                     <tr>
//                       <td>{index + 2}</td>
//                       <td>{expert?.degree}</td>
//                       <td>{expert?.organizationUnitName}</td>
//                       <td>{expert?.name + " " + expert?.family}</td>
//                       <td>{expert?.position}</td>
//                     </tr>
//                   ))
//                 )}
//                 </tbody>
//             </table> `

//   const insertIntoHtml = (issuanceInstruction: string) => {

//     var newhtml = issuanceInstruction;

//     newhtml = newhtml.replaceAll('var-table', inspectionTable);

//     newhtml = newhtml.replaceAll('var-current-date',  moment(new Date()).format('jYYYY/jMM/jDD'))

//     newhtml = newhtml.replaceAll('var-org-name', inspectionInformation?.organizationUnitName);

//     newhtml = newhtml.replaceAll('var-year', inspectionInformation?.informationStartDate ? moment(inspectionInformation?.informationStartDate).format('jYYYY'): '-');

//     newhtml = newhtml.replaceAll('var-from-date', inspectionInformation?.informationStartDate ? moment(inspectionInformation?.informationStartDate).format('jYYYY/jMM/jDD') : '-');

//     newhtml = newhtml.replaceAll('var-end-date', inspectionInformation?.informationEndDate ? moment(inspectionInformation?.informationEndDate).format('jYYYY/jMM/jDD') : '-');

//     newhtml = newhtml.replaceAll('var-duration', findWeekDays().toString());

//     newhtml = newhtml.replaceAll('var-number-of-inspectors', experts.length.toString());

//     newhtml = newhtml.replaceAll('var-lead-name', leadInitialInfo.name + " " + leadInitialInfo.family);

//     return newhtml;
//   };

//   useEffect(() => {
//     if (inspectionInformation != null && experts != null && leadInitialInfo != null) {
//       if (inspectionInformation.issuanceInstruction != null) {
//         setIssuanceInstruction(inspectionInformation.issuanceInstruction);
//       } else {
//         setIssuanceInstruction(insertIntoHtml(issuanceInstructionInitialData));
//       }
//     }
//   }, [inspectionInformation, experts, leadInitialInfo]);

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
//       {!issuanceInstruction ? (
//         <Skeleton height={1000} />
//       ) : (
//         <MatnaEditor
//           onChange={(_, myeditor) => {
//             setIssuanceInstruction(myeditor.getData());
//           }}
//           initialData={issuanceInstruction}
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
//               disabled={inspectionInformation?.instructionStatus == "approved"}
//               color="success"
//               onClick={() => setSendModalIsOpen(true)}
//               sx={{ margin: '10px' }}
//             >
//               ثبت و ارسال به کارتابل
//             </Button>
//             <Button
//               variant={'contained'}
//               // disabled={inspectionInformation?.instructionStatus != "approved"}
//               onClick={() => {
//                 mutate(
//                   {
//                     entity: `information/end?inspectionId=${inspectionInformation.inspectionId}`,
//                     method: "post",
//                   },
//                   {
//                     onSuccess: () => {
//                       console.log("fsdfsdfsdf")
//                       navigate('/operation/scheduled-inspection')
//                     }
//                   }
//                 )
//               }}
//               sx={{ margin: '10px' }}
//             >
//               ثبت نهایی {inspectionInformation?.instructionStatus == "approved" ? "" : (inspectionInformation?.instructionStatus == "cartabling" ? "(در انتظار تایید)" : "(در انتظار ارسال)")}
//             </Button>
//           </Grid>
//         </Grid>
//       </Box>

//       <Dialog
//         maxWidth="md"
//         open={backModalIsOpen}
//         onClose={() => {
//           setBackModalIsOpen(false);
//         }}
//       >
//         <DialogTitle>هشدار</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             آیا مایل به بازگشت به مرحله قبل هستید؟ تغییرات شما در این مرحله از
//             بین خواهد رفت.
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button
//             onClick={() => {
//               setBackModalIsOpen(false);
//             }}
//             color="inherit"
//           >
//             لغو
//           </Button>
//           <Button
//             onClick={() => {
//               mutate(
//                 {
//                   entity: `/information`,
//                   method: 'put',
//                   data: {
//                     ...inspectionInformation,
//                     issuanceInstruction: null,
//                     state: "EKHTESAS_BAZBINEH",
//                   },
//                 } as any,
//                 {
//                   onSuccess: (_: any) => {
//                     mutate(
//                       {
//                         entity: `/information/delete-cartable-by-id-and-type?id=${inspectionInformation.id}&type=instruction`,
//                         method: 'delete',
//                         data: null,
//                       } as any,
//                       {
//                         onSuccess: (_: any) => {
//                           refetchStep();
//                         },
//                         onError: () => {},
//                       }
//                     );
//                   },
//                   onError: () => {},
//                 }
//               );
//             }}
//             variant="contained"
//             color="primary"
//           >
//             تایید
//           </Button>
//         </DialogActions>
//       </Dialog>
//       <Dialog
//         maxWidth="md"
//         open={sendModalIsOpen}
//         onClose={() => {
//           setSendModalIsOpen(false);
//         }}
//       >
//         <DialogTitle>هشدار</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             دستورالعمل برای تایید به کارتابل مراجع بالاتر ارسال می شود.
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button
//             onClick={() => {
//               setSendModalIsOpen(false);
//             }}
//             color="inherit"
//           >
//             لغو
//           </Button>
//           <Button
//             onClick={() => {
//               mutate(
//                 {
//                   entity: `/information`,
//                   method: 'put',
//                   data: {
//                     ...inspectionInformation,
//                     issuanceInstruction: issuanceInstruction,
//                   },
//                 } as any,
//                 {
//                   onSuccess: (_: any) => {
//                     mutate(
//                       {
//                         entity: `/information/save-to-cartable?informationId=${inspectionInformation.id}&type=instruction`,
//                         method: 'post',
//                         data: null,
//                       } as any,
//                       {
//                         onSuccess: (_: any) => {
//                           refetchStep();
//                           snackbar("دستورالعمل با موفقیت به کارتابل مراجع بالاتر ارسال گردید. پس از تایید دکمه <ادامه> فعال خواهد شد.", "success", 5000);
//                         },
//                         onError: () => {},
//                       }
//                     );
//                   },
//                   onError: () => {},
//                 }
//               );
//               setSendModalIsOpen(false);
//             }}
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

// export default StartInspectionStep6;

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
  Alert,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Stack,
  Tabs,
  Tab,
  Card,
  CardContent,
  Tooltip,
} from '@mui/material';
import { useEffect, useState } from 'react';
import moment from 'moment-jalaali';
import { dateDiff } from '@/modules/inspection-operation/scheduled/utils/utils.ts';
import MatnaEditor from '@/components/MatnaEditor.tsx';
import { useSnackbar } from '@/hooks/useSnackbar';
import { useNavigate } from 'react-router';
import {
  Download,
  PictureAsPdf,
  FileDownload,
  TableChart,
  Print,
  FilterList,
  SortByAlpha,
  GridView,
  ListAlt,
  Person,
  Business,
} from '@mui/icons-material';

const issuanceInstructionInitialData = `
<p style="text-align:center;">بسمه تعالی</p>
<p style="text-align:center;"><img class="image_resized" style="aspect-ratio:485/533;width:7.69%;" src="/artesh.jpg"
        width="485" height="533"></p>
<p style="text-align:center;">فرماندهی کل آجا</p>
<h4>از: آجا (اداره عملیات بازرسی و پیگیری - عملیات بازرسی)<span class="text-tiny">&nbsp;</span> &nbsp; &nbsp; &nbsp;
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
    &nbsp;شماره: &nbsp;8310/ب/var-year</h4>
<h4>به: امیر فرماندهی محترم کل آجا &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; تاریخ: var-current-date</h4>
<h4>موضوع: دستور العمل بازرسی برنامه ای از var-org-name &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;پیوست:</h4>
<p>&nbsp;</p>
<p style="text-align:center;">با صلوات بر محمد(ص) و آل محمد(ص)</p>
<p style="text-align:center;">پیرو شماره:&nbsp;</p>
<p>سلام علیکم،</p>
<p style="text-align:justify;"><strong>1 ـ منظور:</strong></p>
<p style="text-align:justify;">در این ماده منظور از اجرای بازرسی نوشته می شود.</p>
<p style="text-align:justify;"><strong>2ـ&nbsp; اهداف:</strong></p>
<p><span style="color:rgb(31,78,121);"><strong>الف) دستیابی به اطالعاتی در خصوص آخرین وضعیت یگان در زمینه تواناییها،
            محدودیتها و نیازمندیهای یگان یا سازمان بازرسی شونده.</strong></span><br><span
        style="color:rgb(31,78,121);"><strong>ب) ارزیابی نحوه عملکرد و بهرهوری، پیشرفت کار یگانها و کارکنان مربوطه در
            سطوح مختلف.</strong></span><br><span style="color:rgb(31,78,121);"><strong>پ) ترغیب و هدایت فرماندهان،
            مدیران، مسئولینو کارکنان به تفکر بیشتر در جهت افزایش کیفیت و کمیت فعالیتها از طریق استفاده بهتر از منابع
            انسانی، مالی (اعتبارات)، تجهیزات و دانش علمی و فنی پیشرفته.</strong></span><br><span
        style="color:rgb(31,78,121);"><strong>ت) ارزیابی و سنجش میزان کارایی مسئولین و کارکنان شایسته و کاردان در سطوح
            مختلف بهمنظور تشویق و برخورد الزم با کارکنان بیتفاوت و کمکار در جهت اصالح آنها.</strong></span><br><span
        style="color:rgb(31,78,121);"><strong>ث) حصول اطمینان از تداوم آمادگی تجهیزات و
            کارکنان.</strong></span><br><span style="color:rgb(31,78,121);"><strong>ج) ایجاد انگیزه برای حرکت و پویایی
            در کارکنان بهمنظور حفظ آمادگی در اجرای مأموریت و ارتقای آن.</strong></span><br><span
        style="color:rgb(31,78,121);"><strong>چ) ارزیابی میزان تالشهای سلسلهمراتب و مسئولین ذیربط یگانها در جهت کشف و
            رفع معایب و نواقص مشهوده در بازدیدها و بازرسیهای قبلی.</strong></span><br><span
        style="color:rgb(31,78,121);"><strong>ح) پی بردن به تنگناهای یگان و ارائه پیشنهادهای منطقی و راهکار مناسب در جهت
            رفع مشکالت و معضالت مشهوده به منظور ارتقاء سط</strong></span></p>
<p style="text-align:justify;"><strong>3 ـ اجرا:</strong></p>
<p style="text-align:justify;"><strong>الف - ترکیب هیئت بازرسی:</strong></p>
<figure class="table">var-table</figure>
<p style="text-align:justify;"><strong>ب - مدت بازرسی:&nbsp;</strong></p>
<p style="text-align:justify;">بازرسی به مدت var-duration روز از تاریخ var-from-date انجام خواهد شد.</p>
<p><strong>پ - زمانبندی اجرای بازرسی:</strong></p>
<p><strong>- تاریخ شروع: var-from-date &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;-تاریخ
        پایان: var-end-date &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; -به مدت روز کاری: var-duration</strong></p>
<p><strong>ت - نحوه اجرا و حدود بازرسی:</strong></p>
<p>نحوه اجرا و حدود بازرسی که بر مبنای هدف های بازرسی تهیه شده</p>
<p><strong>ث - برنامه کار هیئت/گروه/تیم بازرسی:</strong></p>
<p>&nbsp;</p>
<p><strong>ج -وظایف یگان های همکار با سازمان بازرسی کننده:</strong></p>
<p>&nbsp;</p>
<p><strong>چ -وظایف رئیس هیئت/گروه/تیم بازرسی:</strong></p>
<p>&nbsp;</p>
<p><strong>ح -وظایف یگان/سازمان مورد بازرسی:</strong></p>
<p>&nbsp;</p>
<p style="text-align:justify;"><strong>خ - گزارش ها و مدارک بازرسی:</strong></p>
<p style="text-align:justify;">(۱) گزارش رئیس و هر یک از اعضای هیئت/گروه/تیم بازرسی</p>
<p style="text-align:justify;">(۲) بازبینه های تکمیل شده</p>
<p style="text-align:justify;">(۳) جدول طبقه بندی یگان/سازمان مورد بازرسی</p>
<p style="text-align:justify;">(۴) آمار نیرو انسانی</p>
<p style="text-align:justify;">(۵) آمار جرائم و تخلفات</p>
<p style="text-align:justify;">(۶) آمار وسایل عمده</p>
<p style="text-align:justify;">(۷) نظریه رئیس هئیت/گروه/تیم بازررسی</p>
<p style="text-align:justify;">(۸) سایر مدارک مأخوذه از یگان/سازمان مورد بازرسی</p>
<p style="text-align:justify;"><strong>د - دستورهای هماهنگی:</strong></p>
<p style="text-align:justify;">&nbsp;</p>
<p style="text-align:justify;"><strong>۴ ـ دستورهای اداری و آماد و پشتیبانی:</strong></p>
<p style="text-align:justify;">&nbsp;</p>
<p style="text-align:justify;"><strong>۵ ـ نحوه ارتباط با سازمان بازرسی کننده:</strong></p>
<p style="text-align:justify;">&nbsp;</p>
<p><strong>امضا رئیس</strong></p>
<p style="text-align:left;">&nbsp;</p>
<p style="text-align:left;">&nbsp;</p>
<p style="text-align:justify;"><strong>پیوست ها:</strong></p>
<p style="text-align:justify;">&nbsp;</p>
<p style="text-align:justify;"><strong>گیرندگان:</strong></p>
<p style="text-align:justify;">&nbsp;</p>
`;

// Mock review templates for display
const MOCK_REVIEW_TEMPLATES = [
  { id: 'rt1', name: 'بازبینه عملیاتی', icon: '⚔️' },
  { id: 'rt2', name: 'بازبینه اطلاعاتی', icon: '📡' },
  { id: 'rt3', name: 'بازبینه پشتیبانی', icon: '📦' },
  { id: 'rt4', name: 'بازبینه آموزشی', icon: '📚' },
  { id: 'rt5', name: 'بازبینه بهداشتی', icon: '🏥' },
];

// Download Report Component
const DownloadReportsDialog = ({
  open,
  onClose,
  reviews,
  experts,
  provinceName,
  inspectionInformation,
  snackbar,
}) => {
  const [viewType, setViewType] = useState('byExpert');

  // Group reviews by expert
  const getReviewsByExpert = () => {
    const grouped = {};
    reviews.forEach(review => {
      const expert = experts.find(e => e.id === review.expertId);
      const key = expert ? `${expert.name} ${expert.family}` : 'نامشخص';
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push({ ...review, expert });
    });
    return grouped;
  };

  // Group reviews by unit
  const getReviewsByUnit = () => {
    const grouped = {};
    reviews.forEach(review => {
      const key = review.unitName || 'نامشخص';
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(review);
    });
    return grouped;
  };

  // شبیه‌سازی دانلود
  const handleDownload = format => {
    if (snackbar) {
      if (format === 'pdf') {
        snackbar(
          '📄 گزارش PDF با موفقیت دانلود شد (شبیه‌سازی)',
          'success',
          3000
        );
      } else {
        snackbar(
          '📊 گزارش Excel با موفقیت دانلود شد (شبیه‌سازی)',
          'success',
          3000
        );
      }
    }
    onClose();
  };

  const groupedData =
    viewType === 'byExpert' ? getReviewsByExpert() : getReviewsByUnit();
  const totalReviews = reviews.length;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FileDownload color="primary" />
            <Typography variant="h6">دانلود گزارش بازبینه‌ها</Typography>
            <Chip
              label={`${totalReviews} بازبینه`}
              color="primary"
              size="small"
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PictureAsPdf />}
              onClick={() => handleDownload('pdf')}
              size="small"
            >
              PDF
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={<TableChart />}
              onClick={() => handleDownload('excel')}
              size="small"
            >
              Excel
            </Button>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Tabs
            value={viewType}
            onChange={(e, val) => setViewType(val)}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab
              value="byExpert"
              label="بر اساس بازرس"
              icon={<Person />}
              iconPosition="start"
            />
            <Tab
              value="byUnit"
              label="بر اساس یگان"
              icon={<Business />}
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Preview */}
        <Box sx={{ maxHeight: 500, overflow: 'auto' }}>
          {Object.entries(groupedData).length === 0 ? (
            <Alert severity="info">هیچ بازبینه‌ای برای نمایش وجود ندارد</Alert>
          ) : (
            Object.entries(groupedData).map(([key, items]) => (
              <Paper key={key} sx={{ mb: 2, p: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  {viewType === 'byExpert' ? `👤 ${key}` : `🏢 ${key}`}
                  <Chip
                    label={`${items.length} بازبینه`}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                </Typography>
                <Divider sx={{ mb: 1 }} />
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>#</TableCell>
                        {viewType === 'byExpert' ? (
                          <TableCell>یگان</TableCell>
                        ) : (
                          <TableCell>بازرس</TableCell>
                        )}
                        <TableCell>الگو</TableCell>
                        <TableCell>وضعیت</TableCell>
                        <TableCell>محاسن</TableCell>
                        <TableCell>معایب</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {items.map((item, idx) => {
                        const expert = experts.find(
                          e => e.id === item.expertId
                        );
                        return (
                          <TableRow key={idx}>
                            <TableCell>{idx + 1}</TableCell>
                            {viewType === 'byExpert' ? (
                              <TableCell>{item.unitName || '---'}</TableCell>
                            ) : (
                              <TableCell>
                                {expert
                                  ? `${expert.name} ${expert.family}`
                                  : '---'}
                              </TableCell>
                            )}
                            <TableCell>
                              {MOCK_REVIEW_TEMPLATES.find(
                                t => t.id === item.templateId
                              )?.name || '---'}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={
                                  item.status === 'completed'
                                    ? 'تکمیل شده'
                                    : 'پیش‌نویس'
                                }
                                size="small"
                                color={
                                  item.status === 'completed'
                                    ? 'success'
                                    : 'warning'
                                }
                              />
                            </TableCell>
                            <TableCell sx={{ maxWidth: 100 }}>
                              <Typography variant="body2" noWrap>
                                {item.strengths || '---'}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ maxWidth: 100 }}>
                              <Typography variant="body2" noWrap>
                                {item.weaknesses || '---'}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            ))
          )}
        </Box>

        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="caption">
            💡 در حالت توسعه، دانلود به صورت شبیه‌سازی انجام می‌شود.  
                 
            <code
              style={{
                display: 'block',
                marginTop: 4,
                background: '#f5f5f5',
                padding: 4,
                borderRadius: 4,
              }}
            >
         
            </code>
          </Typography>
        </Alert>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>بستن</Button>
      </DialogActions>
    </Dialog>
  );
};

// Main Component
const StartInspectionStep6 = ({
  inspectionInformation,
  setInspectionInformation,
  refetchStep,
  onStepChange,
  currentStep,
  useMockData = true,
  updateInspectionState,
  experts = [],
  leadInfo = {},
  reviews = [],
  snackbar,
}) => {
  const [issuanceInstruction, setIssuanceInstruction] = useState(null);
  const [backModalIsOpen, setBackModalIsOpen] = useState(false);
  const [sendModalIsOpen, setSendModalIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const navigate = useNavigate();

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

      if (leadInfo) {
        tableRows += `
          <tr>
            <td>1</td>
            <td>${leadInfo?.degree || '---'}</td>
            <td>${leadInfo?.organizationUnitName || '---'}</td>
            <td>${leadInfo?.name || ''} ${leadInfo?.family || ''}</td>
            <td>رئیس هیئت بازرسی</td>
          </tr>
        `;
      }

      const otherExperts = experts.filter(e => !e.isLead);
      otherExperts.forEach((expert: any, index: any) => {
        tableRows += `
          <tr>
            <td>${index + 2}</td>
            <td>${expert?.degree || '---'}</td>
            <td>${expert?.organizationUnitName || expert?.unit || '---'}</td>
            <td>${expert?.name || ''} ${expert?.family || ''}</td>
            <td>${expert?.position || '---'}</td>
          </tr>
        `;
      });

      return `
        <table style="width:100%; border-collapse: collapse; margin: 10px 0; direction: rtl;" border="1">
          <thead>
            <tr>
              <th style="padding: 8px; text-align: center; background-color: #f2f2f2;">ردیف</th>
              <th style="padding: 8px; text-align: center; background-color: #f2f2f2;">درجه</th>
              <th style="padding: 8px; text-align: center; background-color: #f2f2f2;">یگان</th>
              <th style="padding: 8px; text-align: center; background-color: #f2f2f2;">نام و نام خانوادگی</th>
              <th style="padding: 8px; text-align: center; background-color: #f2f2f2;">مسئولیت در بازرسی</th>
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

  const insertIntoHtml = (issuanceInstruction: string) => {
    try {
      var newhtml = issuanceInstruction;

      newhtml = newhtml.replaceAll('var-table', generateInspectionTable());
      newhtml = newhtml.replaceAll(
        'var-current-date',
        moment(new Date()).format('jYYYY/jMM/jDD')
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
        'var-end-date',
        inspectionInformation?.informationEndDate
          ? moment(inspectionInformation?.informationEndDate).format(
              'jYYYY/jMM/jDD'
            )
          : '---'
      );
      newhtml = newhtml.replaceAll('var-duration', findWeekDays().toString());
      newhtml = newhtml.replaceAll(
        'var-number-of-inspectors',
        (experts.length + 1).toString()
      );
      newhtml = newhtml.replaceAll(
        'var-lead-name',
        leadInfo ? (leadInfo.name || '') + ' ' + (leadInfo.family || '') : '---'
      );

      return newhtml;
    } catch (error) {
      console.error('Error inserting into HTML:', error);
      return issuanceInstruction;
    }
  };

  useEffect(() => {
    try {
      if (inspectionInformation != null) {
        if (inspectionInformation.issuanceInstruction != null) {
          setIssuanceInstruction(inspectionInformation.issuanceInstruction);
        } else {
          setIssuanceInstruction(
            insertIntoHtml(issuanceInstructionInitialData)
          );
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
          issuanceInstruction: null,
          state: 'EKHTESAS_BAZBINEH',
        };

        if (setInspectionInformation) {
          setInspectionInformation(updatedData);
        }
        if (updateInspectionState) {
          updateInspectionState('EKHTESAS_BAZBINEH', {
            issuanceInstruction: null,
          });
        }

        await refetchStep();
        setBackModalIsOpen(false);
        onStepChange(4);
        if (snackbar) {
          snackbar('به مرحله قبل بازگشتید', 'success', 3000);
        }
      } else {
        throw new Error('Real API not implemented in dev mode');
      }
    } catch (error) {
      const errorMessage = error.message || 'خطا در بازگشت';
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
          issuanceInstruction: issuanceInstruction,
          instructionStatus: 'cartabling',
        };

        if (setInspectionInformation) {
          setInspectionInformation(updatedData);
        }

        await new Promise(resolve => setTimeout(resolve, 500));
        await refetchStep();
        setSendModalIsOpen(false);
        if (snackbar) {
          snackbar(
            'دستورالعمل با موفقیت به کارتابل مراجع بالاتر ارسال گردید',
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

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      if (useMockData) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (snackbar) {
          snackbar('بازدید با موفقیت ثبت نهایی شد', 'success', 5000);
        }
        navigate('/operation/scheduled-inspection');
      } else {
        throw new Error('Real API not implemented in dev mode');
      }
    } catch (error) {
      const errorMessage = error.message || 'خطا در ثبت نهایی';
      setError(errorMessage);
      if (snackbar) {
        snackbar(errorMessage, 'error', 3000);
      }
      console.error('Final submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (currentStep !== 5) return null;

  const isApproved = inspectionInformation?.instructionStatus === 'approved';
  const isCartabling =
    inspectionInformation?.instructionStatus === 'cartabling';
  const hasReviews = reviews && reviews.length > 0;

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
          وضعیت:{' '}
          {isApproved
            ? '✅ تایید شده'
            : isCartabling
              ? '⏳ در انتظار تایید'
              : '📝 پیش‌نویس'}
          {' | '}
          تعداد بازبینه‌ها: {reviews?.length || 0}
          {' | '}
          تعداد بازرسان: {experts?.length || 0}
        </Typography>
      </Alert>

      {!issuanceInstruction ? (
        <Skeleton height={1000} width="100%" />
      ) : (
        <MatnaEditor
          onChange={(_, myeditor) => {
            try {
              setIssuanceInstruction(myeditor.getData());
            } catch (error) {
              console.error('Editor change error:', error);
            }
          }}
          initialData={issuanceInstruction}
        />
      )}

      <Box margin={'50px'}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Stack
              direction="row"
              spacing={2}
              flexWrap="wrap"
              justifyContent="center"
            >
              <Button
                variant="contained"
                color="error"
                onClick={() => setBackModalIsOpen(true)}
                disabled={isSubmitting}
              >
                مرحله قبل
              </Button>

              <Button
                variant="contained"
                color="success"
                onClick={() => setSendModalIsOpen(true)}
                disabled={
                  isSubmitting ||
                  isApproved ||
                  isCartabling ||
                  !issuanceInstruction
                }
              >
                ثبت و ارسال به کارتابل
              </Button>

              <Button
                variant="contained"
                color="primary"
                startIcon={<FileDownload />}
                onClick={() => setDownloadDialogOpen(true)}
                disabled={!hasReviews}
              >
                دانلود گزارش بازبینه‌ها
              </Button>

              <Button
                variant={'contained'}
                onClick={handleFinalSubmit}
                disabled={isSubmitting || (!isApproved && !isCartabling)}
                color="info"
              >
                {isSubmitting ? 'در حال ثبت...' : 'ثبت نهایی'}
                {!isApproved && isCartabling && ' (در انتظار تایید)'}
                {!isApproved && !isCartabling && ' (در انتظار ارسال)'}
              </Button>
            </Stack>

            {!hasReviews && (
              <Typography
                variant="caption"
                color="warning.main"
                sx={{ display: 'block', mt: 2, textAlign: 'center' }}
              >
                ⚠️ برای دانلود گزارش، ابتدا در مرحله قبل بازبینه‌ها را ایجاد
                کنید
              </Typography>
            )}
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
            دستورالعمل برای تایید به کارتابل مراجع بالاتر ارسال می شود.
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

      {/* Download Reports Dialog */}
      <DownloadReportsDialog
        open={downloadDialogOpen}
        onClose={() => setDownloadDialogOpen(false)}
        reviews={reviews}
        experts={experts}
        provinceName={inspectionInformation?.provinceName}
        inspectionInformation={inspectionInformation}
        snackbar={snackbar}
      />
    </Box>
  );
};

export default StartInspectionStep6;
