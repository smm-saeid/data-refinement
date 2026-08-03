// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import "ckeditor5/ckeditor5.css";
// import {
//     ClassicEditor,
//     Alignment,
//     Bold,
//     Essentials,
//     Italic,
//     Mention,
//     Paragraph,
//     Undo,
//     IndentBlock,
//     BlockQuote,
//     Indent,
//     List,
//     Heading,
//     Image,
//     ImageEditing,
//     ImageResize,
//     Font,
//     TableSelection,
//     TableToolbar,
//     Table
// } from "ckeditor5";
// import { Autocomplete, Box, Button, Grid, ListItem, TextField, Typography } from "@mui/material";
// import React, { MutableRefObject, Ref, useEffect, useMemo, useState } from "react"
// import moment from 'moment-jalaali'
//
// import "../../operation/styles/workflow.css"
// import { useMutation, useQuery } from "@tanstack/react-query";
// import { useAuth } from "hooks/useAuth";
// import { useParams } from "react-router";
// import { Delete } from "@mui/icons-material";
// import { useErrorHandler } from "hooks/useErrorHandler";
//
//
// const NotifyWorkflow = React.forwardRef((state: any, ref) => {
//
//     const Auth = useAuth()
//     const { setNotification } = useErrorHandler();
//
//     const { id } = useParams()
//     const [recipients, setRecipients] = useState<any>([]);
//     const [appSug, setAppSug] = useState<any>([]);
//
//     const { data: inspectionData, status: inspectionStatus, refetch: inspectionRefetch } = useQuery<any, any, any>({
//         queryKey: [`/inspection/id/${id}`],
//         queryFn: Auth?.getRequest_YASER,
//         select: (res: any) => res.data,
//     } as any);
//
//     const { data, status, refetch } = useQuery<any>({
//         queryKey: [`/information/inspection-id/${id}`],
//         queryFn: Auth?.getRequest_YASER,
//         select: (res: any) => {
//             return res?.data
//         },
//     } as any);
//
//     const { data: fields, status: fields_status, refetch: fields_refetch } = useQuery<any>({
//         queryKey: [`/review_field`],
//         queryFn: Auth?.getRequest_YASER,
//         select: (res: any) => {
//             return res?.data
//         },
//     } as any);
//
//     const { data: notifies, status: notifies_status, refetch: notifies_refetch } = useQuery<any>({
//         queryKey: [`/notify/find-by-inspection-id?inspectionId=${id}`],
//         queryFn: Auth?.getRequest_YASER,
//         select: (res: any) => {
//             return res?.data
//         },
//     } as any);
//
//     const { data: as_data, status: as_status, refetch: as_refetch } = useQuery<any>({
//         queryKey: [`/approved-suggestion/find-by-parameter?inspectionId=${id}`],
//         queryFn: Auth?.getRequest_YASER,
//         select: (res: any) => {
//             return res?.data
//         },
//     } as any);
//
//     useEffect(() => {
//         if (!!notifies && notifies_status == "success") {
//             setRecipients(notifies)
//         }
//     }, [notifies, notifies_status])
//
//     useEffect(() => {
//         if (!!as_data && as_status == "success") {
//             setAppSug(as_data)
//         }
//     }, [as_data, as_status])
//
//     const {
//         data: orgs,
//         status: organizationStatus,
//         refetch: refreshOrg,
//     } = useQuery<any, any, any>({
//         queryKey: [`/organizations?pageSize=1000&currentPage=1`],
//         queryFn: Auth?.getRequest_YASER,
//         select: (res: any) => {
//             return res?.data?.rows?.filter((value: any, index: any, self: any) => (
//                 index === self.findIndex((t: any) => t.name === value.name)
//             ))
//         },
//     } as any);
//
//     const workflowHtml = useMemo(
//         () => `
//             <p style="text-align:center;">بسمه تعالی</p>
//         <p style="text-align:center;"><img class="image_resized" style="aspect-ratio:485/533;width:7.69%;"
//             src="/assets/images/logo.png" width="485" height="533"></p>
//         <p style="text-align:center;">فرماندهی کل آجا</p>
//         <h3>از :آجا (معاونت بازرسي و ايمني-اداره عمليات بازرسي و پيگيري)<span class="text-tiny">&nbsp;</span> &nbsp; &nbsp; &nbsp;
//             &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
//             &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
//             &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;شماره:</h3>
//         <h3>به: امير فرماندهي محترم ..... (بازرسي و ايمني) &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
//             &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
//             &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
//             &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
//             &nbsp; &nbsp; &nbsp; &nbsp; تاریخ:</h3>
//         <h3>موضوع: نتيجه بازرسي برنامه‌اي از ${inspectionData?.organizationUnitName} &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
//             &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
//             &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
//             &nbsp; &nbsp;پیوست:</h3>
//         <p style="text-align:center;">با صلوات بر محمد(ص) و آل محمد(ص)</p>
//         <p style="text-align:center;">پیرو شماره:&nbsp;</p>
//         <p>سلام علیکم،</p>
//         <p style="text-align:justify;">
//             ١- مرتبط با مفاد پيروی فوق، با اعزام تيمي از ستادآجا در مورخه ${moment(data?.informationStartDate).format("jYYYY/jMM/jDD")} به مدت دو روز، ${inspectionData?.organizationUnitName} .مورد بازرسي قرارگرفت
//         </p>
//         <p style="text-align:justify;">
//             ٢- هنگامي كه نتيجه بازرسي مذكور به استحضار امير فرماندهي محترم كل آجا رسيد مقرّر فرمودند:
//             <br/>
//             <span style="color:rgb(31,78,121);"><strong>" بسمه تعالي</strong></span>
//             <br/>
//             <span style="color:rgb(31,78,121);"><strong>اقدام شود و به صورت نوبه‌اي رفت پيشرفت كار را کنترل كنيد "</strong></span>
//         </p>
//
//         <p style="text-align:justify;"><strong>پيشنهادهاي مصوّب:</strong></p>
//         `,
//         [inspectionData]
//     );
//
//     const workflowHtml2 = useMemo(
//         () => `
//         <p style="text-align:justify;">
//         ۳- بدين وسيله سه كار پوشه (محاسن، معايب و نواقص در قالب نرم افزار اكسل) مستخرجه بازرسي از <span style="color:rgb(31,78,121);"><strong>${inspectionData?.organizationUnitName}</strong></span> به انضمام يك كارپوشه پيشنهادات مصوّب ويك كارپوشه ليست تشويقات و تنبيهات،
//             به پيوست ارسال ميگردد. خواهشمند است دستور فرماييد، نسبت به تقويت و تعميم محاسن، رفع نارسائي های
//             مشهوده (معايب و نواقص) و نيز اعمال تشويقات و تنبيهات مصوّب اقدام و درخصوص آن دسته از نارسائي هايي كه
//             رفع آنها مستلزم انجام پيگيـري ستادي از مبـادي تخصّصي و ذيربط ستاد آجا مي‌باشد، تا حصول نتيجه پيگيري
//             و هماهنگي هاي الزم معمول و نتايج حاصله را در قسمت جداول پيگيري نرم افزار اكسل درج و به معاونت بازرسي و
//             ايمني اعلام فرمايند
//         </p>
//
//         <p style="text-align:justify;">&nbsp;</p>
//         <p style="text-align:left;"><strong>امضا رئیس ... - ...</strong></p>
//         <p style="text-align:left;">&nbsp;</p>
//         <p style="text-align:left;">&nbsp;</p>
//         <p style="text-align:justify;"><strong>پیوست ها:</strong></p>
//         <p style="text-align:justify;">&nbsp;</p>
//         <p style="text-align:justify;"><strong>گیرندگان:</strong></p>
//         <p style="text-align:justify;">&nbsp;</p>
//         `,
//         [inspectionData]
//     );
//
//     const { isLoading, mutate } = useMutation({
//         mutationFn: Auth?.serverCall,
//     });
//
//     const onSubmitHandler = () => {
//         mutate(
//             {
//                 entity: `notify`,
//                 method: "post",
//                 data: recipients?.map((item: any) => ({
//                     "id": typeof item?.id === "number" ? null : item?.id,
//                     "organizationUnitId": item?.organizationUnitId,
//                     "inspectionId": id,
//                     "reviewFieldId": item?.reviewFieldId
//                 })),
//             } as any,
//             {
//                 onSuccess: (res: any) => {
//                     if (res.code !== 200) {
//                         setNotification(200, "ثبت شد.", "success")
//                         notifies_refetch();
//                     }
//                 },
//             }
//         );
//         mutate(
//             {
//                 entity: `approved-suggestion`,
//                 method: "post",
//                 data: appSug?.map((item: any) => ({
//                     "id": typeof item?.id === "number" ? null : item?.id,
//                     "description": item?.description,
//                     "inspectionId": id,
//                     "reviewFieldId": item?.reviewFieldId
//                 })),
//             } as any,
//             {
//                 onSuccess: (res: any) => {
//                     if (res.code !== 200) {
//                         setNotification(200, "ثبت شد.", "success")
//                         as_refetch();
//                     }
//                 },
//             }
//         );
//     };
//
//     return (
//         <Box margin={"10px"}>
//             <Grid container>
//                 <Grid item xs={12} sx={{ backgroundColor: "white", color: 'black', fontFamily: "Nazanin", lineHeight: "40px" }}>
//                     <CKEditor
//                         editor={ClassicEditor}
//                         id="document"
//                         onChange={(e, myeditor) => {
//                             //   setIssuance(myeditor.getData())
//                         }}
//                         config={{
//                             table: {
//                                 contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
//                             },
//                             toolbar: {
//                                 items: [
//                                     "undo",
//                                     "redo",
//                                     "|",
//                                     "heading",
//                                     "|",
//                                     "bold",
//                                     "italic",
//                                     "|",
//                                     "bulletedList",
//                                     "numberedList",
//                                     "indent",
//                                     "outdent",
//                                     "|",
//                                     "alignment",
//                                     "ckboxImageEdit",
//                                     "|",
//                                     "fontSize",
//                                     "insertTable"
//                                 ],
//                             },
//                             plugins: [
//                                 Table, TableToolbar, Bold,
//                                 Font,
//                                 Essentials,
//                                 Alignment,
//                                 Bold,
//                                 Italic,
//                                 Paragraph,
//                                 Undo,
//                                 Indent,
//                                 List,
//                                 Heading,
//                                 Image,
//                                 ImageEditing,
//                                 ImageResize,
//                             ],
//                             licenseKey: "<YOUR_LICENSE_KEY>",
//                             // mention: {
//                             //     // Mention configuration
//                             // },
//                             initialData: workflowHtml,
//                             language: {
//                                 // The UI will be English.
//                                 ui: "en",
//
//                                 // But the content will be edited in Arabic.
//                                 content: "fa",
//                             },
//                         }}
//                     />
//                 </Grid>
//
//                 <Grid item xs={12} container marginTop={"10px"}>
//                     <Grid container item xs={12} spacing={3}>
//                         {
//                             as_status == "success" && organizationStatus == "success" ?
//                                 appSug?.map((item: any, index: number) => (
//                                     <Grid container item xs={12} spacing={2}>
//                                         <Grid item xs={6}>
//                                             <TextField multiline fullWidth label={`پیشنهاد مصوب ${index+1}`} sx={{
//                                                 ".MuiOutlinedInput-root": {
//                                                     padding: 0
//                                                 }
//                                             }} value={appSug[index]?.description} onChange={(event: any) => {
//                                                 let newArr = [...appSug]
//                                                 newArr[index].description = event?.target?.value
//                                                 setAppSug(appSug)
//                                             }}/>
//                                         </Grid>
//                                         <Grid item xs={3}>
//                                             <Autocomplete
//                                                 fullWidth
//                                                 options={fields}
//                                                 getOptionLabel={(option: any) => {
//                                                     if (typeof option !== "object") {
//                                                         let result = fields?.find((op: any) => op?.id === option);
//                                                         return result?.name || "";
//                                                     }
//                                                     return option?.name || "";
//                                                 }}
//                                                 filterOptions={(ops, state) => {
//                                                     //@ts-ignore
//                                                     let temp = ops?.filter((op: TOption) => op?.name?.includes(state?.inputValue));
//                                                     return temp;
//                                                 }}
//                                                 value={appSug[index].reviewFieldId}
//                                                 onChange={(event: any, newValue: any) => {
//                                                     let newList = [...appSug];
//                                                     newList[index].reviewFieldId = newValue ? newValue.id : newValue;
//                                                     setAppSug(newList);
//                                                 }}
//                                                 renderInput={(params) => (
//                                                     <TextField
//                                                         {...params}
//                                                         label={"حوزه"}
//                                                         sx={{
//                                                             "& .MuiOutlinedInput-root": {
//                                                                 padding: "0px!important",
//                                                             },
//                                                         }}
//                                                     />
//                                                 )}
//                                             />
//                                         </Grid>
//                                         <Grid item xs={3}>
//                                             <Button onClick={() => {
//                                                 let newList = appSug?.filter((i: any) => i?.id !== item?.id);
//                                                 setAppSug(newList);
//                                             }}>
//                                                 <Delete />
//                                             </Button>
//                                         </Grid>
//                                     </Grid>
//                                 )) : null
//                         }
//                         <Grid item xs={12} marginBottom={"10px"}>
//                             <Button
//                             variant="contained"
//                             onClick={() => {
//                                 let newList = [...appSug, {
//                                     id: new Date().getTime(),
//                                     description: null,
//                                     reviewFieldId: null
//                                 }];
//                                 setAppSug(newList);
//                             }}>افزودن پیشنهاد</Button>
//                         </Grid>
//                     </Grid>
//                 </Grid>
//
//                 <Grid item xs={12} sx={{ backgroundColor: "white", color: 'black', fontFamily: "Nazanin", lineHeight: "40px" }}>
//                     <CKEditor
//                         editor={ClassicEditor}
//                         id="document"
//                         onChange={(e, myeditor) => {
//                             //   setIssuance(myeditor.getData())
//                         }}
//                         config={{
//                             table: {
//                                 contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
//                             },
//                             toolbar: {
//                                 items: [
//                                     "undo",
//                                     "redo",
//                                     "|",
//                                     "heading",
//                                     "|",
//                                     "bold",
//                                     "italic",
//                                     "|",
//                                     "bulletedList",
//                                     "numberedList",
//                                     "indent",
//                                     "outdent",
//                                     "|",
//                                     "alignment",
//                                     "ckboxImageEdit",
//                                     "|",
//                                     "fontSize",
//                                     "insertTable"
//                                 ],
//                             },
//                             plugins: [
//                                 Table, TableToolbar, Bold,
//                                 Font,
//                                 Essentials,
//                                 Alignment,
//                                 Bold,
//                                 Italic,
//                                 Paragraph,
//                                 Undo,
//                                 Indent,
//                                 List,
//                                 Heading,
//                                 Image,
//                                 ImageEditing,
//                                 ImageResize,
//                             ],
//                             licenseKey: "<YOUR_LICENSE_KEY>",
//                             // mention: {
//                             //     // Mention configuration
//                             // },
//                             initialData: workflowHtml2,
//                             language: {
//                                 // The UI will be English.
//                                 ui: "en",
//
//                                 // But the content will be edited in Arabic.
//                                 content: "fa",
//                             },
//                         }}
//                     />
//                 </Grid>
//                 <Grid container item xs={12} spacing={2} marginTop={"20px"}>
//                     <Grid item xs={12}>
//                         <Typography variant="h6">
//                             ابلاغ دستورات و نتایج به یگان ها:
//                         </Typography>
//                     </Grid>
//                     <Grid container item xs={12}>
//
//                     </Grid>
//                 </Grid>
//             </Grid>
//             <Grid container>
//                 <Grid container item xs={12} spacing={3}>
//                     {
//                         notifies_status == "success" && organizationStatus == "success" ?
//                             recipients?.map((item: any, index: number) => (
//                                 <Grid container item xs={12} spacing={2}>
//                                     <Grid item xs={3}>
//                                         <Autocomplete
//                                             fullWidth
//                                             options={orgs}
//                                             getOptionLabel={(option: any) => {
//                                                 if (typeof option !== "object") {
//                                                     let result = orgs?.find((op: any) => op?.id === option);
//                                                     return result?.name || "";
//                                                 }
//                                                 return option?.name || "";
//                                             }}
//                                             filterOptions={(ops, state) => {
//                                                 //@ts-ignore
//                                                 let temp = ops?.filter((op: TOption) => op?.name?.includes(state?.inputValue));
//                                                 return temp;
//                                             }}
//                                             value={recipients[index]?.organizationUnitId}
//                                             onChange={(event: any, newValue: any) => {
//                                                 let newList = [...recipients];
//                                                 newList[index].organizationUnitId = newValue ? newValue.id : newValue;
//                                                 setRecipients(newList);
//                                             }}
//                                             renderInput={(params) => (
//                                                 <TextField
//                                                     {...params}
//                                                     label={"یگان"}
//                                                     sx={{
//                                                         "& .MuiOutlinedInput-root": {
//                                                             padding: "0px!important",
//                                                         },
//                                                     }}
//                                                 />
//                                             )}
//                                         />
//                                     </Grid>
//                                     <Grid item xs={3}>
//                                         <Autocomplete
//                                             fullWidth
//                                             options={fields}
//                                             getOptionLabel={(option: any) => {
//                                                 if (typeof option !== "object") {
//                                                     let result = fields?.find((op: any) => op?.id === option);
//                                                     return result?.name || "";
//                                                 }
//                                                 return option?.name || "";
//                                             }}
//                                             filterOptions={(ops, state) => {
//                                                 //@ts-ignore
//                                                 let temp = ops?.filter((op: TOption) => op?.name?.includes(state?.inputValue));
//                                                 return temp;
//                                             }}
//                                             value={recipients[index].reviewFieldId}
//                                             onChange={(event: any, newValue: any) => {
//                                                 let newList = [...recipients];
//                                                 newList[index].reviewFieldId = newValue ? newValue.id : newValue;
//                                                 setRecipients(newList);
//                                             }}
//                                             renderInput={(params) => (
//                                                 <TextField
//                                                     {...params}
//                                                     label={"حوزه"}
//                                                     sx={{
//                                                         "& .MuiOutlinedInput-root": {
//                                                             padding: "0px!important",
//                                                         },
//                                                     }}
//                                                 />
//                                             )}
//                                         />
//                                     </Grid>
//                                     <Grid item xs={3}>
//                                         <Button onClick={() => {
//                                             let newList = recipients?.filter((i: any) => i?.id !== item?.id);
//                                             setRecipients(newList);
//                                         }}>
//                                             <Delete />
//                                         </Button>
//                                     </Grid>
//                                 </Grid>
//                             )) : null
//                     }
//                     <Grid item xs={12}>
//                         <Button onClick={() => {
//                             let newList = [...recipients, {
//                                 id: new Date().getTime(),
//                                 organizationUnitId: null,
//                                 reviewFieldId: null
//                             }];
//                             setRecipients(newList);
//                         }}>افزودن</Button>
//                     </Grid>
//                 </Grid>
//                 <Grid item xs={12} margin={"20px"}>
//                     <Button variant="contained" color="success" onClick={onSubmitHandler}>
//                         ثبت
//                     </Button>
//                 </Grid>
//             </Grid>
//         </Box>
//     )
// })
//
// export default NotifyWorkflow;