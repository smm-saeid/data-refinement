import { Button, Chip, Grid, IconButton, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useLocation, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "hooks/useAuth";
import { Delete, FileUploader, ImageInsert, ImageUpload } from "ckeditor5";
import ErrorHandler from "components/errorHandler/ErrorHandler";
import "ckeditor5/ckeditor5.css";
import {
    ClassicEditor,
    Alignment,
    Bold,
    Essentials,
    Italic,
    Mention,
    Paragraph,
    Undo,
    IndentBlock,
    BlockQuote,
    Indent,
    List,
    Heading,
    Image,
    ImageEditing,
    ImageResize,
    Font,
    TableSelection,
    TableToolbar,
    Table as CKTable
} from "ckeditor5";
import "../../operation/styles/workflow.css"
import { Box } from "@mui/material";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { useEffect, useMemo } from "react";
import moment from "moment-jalaali";
import ReactDOMServer from "react-dom/server";
import { BarChart } from '@mui/x-charts/BarChart';
import { ResponsiveContainer } from 'recharts';
import { blueberryTwilightPalette, cheerfulFiestaPalette, mangoFusionPalette, PieChart } from "@mui/x-charts";

const HeadReport = () => {
    const { id } = useParams()
    const { state } = useLocation()
    const Auth = useAuth()

    const { data: inspectionData, status: inspectionStatus, refetch: inspectionRefetch } = useQuery<any, any, any>({
        queryKey: [`/inspection/id/${id}`],
        queryFn: Auth?.getRequest_YASER,
        select: (res: any) => res.data,
    } as any);

    const { data, status, refetch } = useQuery<any>({
        queryKey: [`/information/inspection-id/${id}`],
        queryFn: Auth?.getRequest_YASER,
        select: (res: any) => {
            return res?.data
        },
    } as any);

    const { data: review_data, status: review_status, refetch: review_refetch } = useQuery<any, any, any>({
        queryKey: [`/review-customize/find-all-reviews?inspectionId=${id}`],
        queryFn: Auth?.getRequest_YASER,
        select: (res: any) => res.data,
    } as any);

    const { data: reviews, status: reviewStatus, refetch: reviewRefetch } = useQuery<any, any, any>({
        queryKey: [`/review-customize/find-all-reviews?inspectionId=${id}`],
        queryFn: Auth?.getRequest_YASER,
        select: (res: any) => res.data,
    } as any);

    const { data: encouragement, status: encouragementStatus, refetch: encouragementRefetch } = useQuery<any, any, any>({
        queryKey: [`/encouragement/find-by-inspection?inspectionId=${id}`],
        queryFn: Auth?.getRequest_YASER,
        select: (res: any) => res?.data,
    } as any);

    const {
        data: experts,
        status: expertsStatus,
        refetch: refreshExperts,
    } = useQuery<any, any, any>({
        queryKey: [`/person-speciality/find-by-inspection?pageSize=1000&currentPage=1&inspectionId=${id}`],
        queryFn: Auth?.getRequest_YASER,
        select: (res: any) => {
            return res?.data?.rows;
        },
    } as any);

    const html_text = useMemo(
        () => `
        <p style="text-align:center;">
            <img class="image_resized" style="width:8.71%;" src="/assets/images/besme.png" width="485">
        </p>
        <p style="text-align:center;">
            <span style="color:#c00000;">گزارش نتیجه بازرسی برنامه‌ای از ${inspectionData?.organizationUnitName}&nbsp;</span>
        </p>
        <p style="text-align:justify;">
            <span class="text-big" style="color:#002060;"><strong>1. </strong></span>
            <span class="text-big"><strong>کليات:</strong></span>
        </p>
        
        <p style="text-align:justify;">در اجرای اوامر صادره توسط هیئتی از ستاد آجا به سرپرستی <span style="color:#ff0000;">سرتیپ دوّم ستاد علی اوجاقی </span>به همراه <span style="color:#ff0000;">${experts?.length} نفر از بازرسان منتخب</span>  معاونت‌ها، سازمان‌ها و ادارات ستاد آجا، از تاریخ <span style="color:#ff0000;">${moment(data?.informationStartDate).format("jYYYY/jMM/jDD")}</span> به مدت <span style="color:#ff0000;">${"---"}</span>، <span style="color:#0070c0;"><strong>${inspectionData?.organizationUnitName}</strong></span> مورد بازرسی برنامه‌ای واقع گردید.</p>
        
        <p style="text-align:justify;">&nbsp;</p><p style="text-align:justify;">الف- قسمت‌ها و زمینه‌های مورد بازرسی:</p>
        <ul>
            ${ReactDOMServer.renderToString(
            <>
                {
                    reviews?.finalReport?.reports?.map((item: any) => (
                        <li>
                            <p style={{ textAlign: "justify" }}><span className="text-small">{item?.name}</span></p>
                        </li>
                    ))
                }
            </>
        )
            }
        </ul>
    <p>ب- ترکیب هیئت بازرسی:</p>
    <figure class="table">
        <table>
            <thead>
                <tr>
                    <th><p style="text-align:center;"><strong>رديف</strong></p></th>
                    <th><p style="text-align:center;"><strong>درجه</strong></p></th>
                    <th><p style="text-align:center;"><strong>نام و نشان</strong></p></th>
                    <th><p style="text-align:center;"><strong>قسمت/يگان</strong></p></th>
                    <th><p style="text-align:center;"><strong>مسئولیت در بازرسي</strong></p></th>
                </tr>
            </thead>
            <tbody>
                ${ReactDOMServer.renderToString(
                <>
                    {
                        experts?.map((item: any, index: any) => (
                            <tr>
                                <td><p style={{ textAlign: "center" }}><strong>{index + 1}</strong></p></td>
                                <td><p style={{ textAlign: "center" }}><span className="text-small">{item?.orgSpecialityName}</span></p></td>
                                <td><p style={{ textAlign: "center" }}><span className="text-small">{item?.personInfoName + " " + item?.personInfoFamily}</span></p></td>
                                <td><p style={{ textAlign: "center" }}><span className="text-small">{item?.organizationUnitName}</span></p></td>
                                <td><p style={{ textAlign: "center" }}><span className="text-small">{item?.position}</span></p></td>
                            </tr>
                        ))
                    }
                </>
            )
            }
            </tbody>
        </table>
    </figure>

    <p style="text-align:justify;">پ- تاریخ شروع و خاتمه بازرسی:</p><p style="text-align:justify;">از مورخه ${moment(data?.informationStartDate).format("jYYYY/jMM/jDD")} به مدت ${" "} روز</p>
    
    <p style="text-align:justify;">ت- مشخصات فرمانده ${inspectionData?.organizationUnitName}:</p><figure class="table"><table><tbody><tr><td><p style="text-align:center;"><span style="color:#000000;">درجه</span></p></td><td><p style="text-align:center;"><span style="color:#000000;">نام و نشان</span></p></td><td><p style="text-align:center;"><span style="color:#000000;">شماره کارگزینی</span></p></td><td><p style="text-align:center;"><span style="color:#000000;">شغل سازمانی</span></p></td><td><p style="text-align:center;"><span style="color:#000000;">تاریخ انتصاب</span></p></td></tr><tr><td><p style="text-align:center;">${" "}</p></td><td><p style="text-align:center;">${" "}</p></td><td><p style="text-align:center;">${" "}</p></td><td><p style="text-align:center;">فرمانده ${inspectionData?.organizationUnitName}</p></td><td><p style="text-align:center;">${" "}</p></td></tr></tbody></table></figure><p></p>
    <figure class="table"><table><tbody><tr><td colspan="3"><p style="text-align:center;"><strong>پایور</strong></p></td><td colspan="3"><p style="text-align:center;"><strong>وظیفه</strong></p></td></tr><tr><td><p style="text-align:center;"><strong>سازمانی</strong></p></td><td><p style="text-align:center;"><strong>موجودی</strong></p></td><td><p style="text-align:center;"><strong>درصد موجودی</strong></p></td><td><p style="text-align:center;"><strong>سازمانی</strong></p></td><td><p style="text-align:center;"><strong>موجودی</strong></p></td><td><p style="text-align:center;"><strong>درصد موجودی</strong></p></td></tr><tr><td><p style="text-align:center;"><strong>1061</strong></p></td><td><p style="text-align:center;"><strong>796</strong></p></td><td><p style="text-align:center;"><strong>%75</strong></p></td><td><p style="text-align:center;"><strong>981</strong></p></td><td><p style="text-align:center;"><strong>490</strong></p></td><td><p style="text-align:center;"><strong>49.9%</strong></p></td></tr></tbody></table></figure>

    <p style="text-align:justify;"><span class="text-big" style="color:#002060;"><strong>2. </strong></span><span class="text-big"><strong>نکات مهم مشهود در بازرسی:</strong></span></p>
    ${ReactDOMServer.renderToString(
                <>
                    {
                        reviews?.finalReviewReports?.map((item: any) => (
                            <>
                                <p>
                                    <span style={{ color: "#0070c0" }}>
                                        <i><strong>{item?.inspected?.reviewGroupName}</strong></i>
                                    </span>
                                    <i><strong>:</strong></i>
                                </p>
                                <p>الف – محاسن:</p>
                                {
                                    item?.advantages?.map((a: any, index: number) => (
                                        <p>{index + 1}. {a?.description}</p>
                                    ))
                                }
                                <p>ب – معایب:</p>
                                {
                                    item?.deficiencies?.filter((x: any) => x.type == "نقص")?.map((a: any, index: number) => (
                                        <p>{index + 1}. {a?.description}</p>
                                    ))
                                }
                                <p>پ – نواقص:</p>
                                {
                                    item?.deficiencies?.filter((x: any) => x.type == "عیب")?.map((a: any, index: number) => (
                                        <p>{index + 1}. {a?.description}</p>
                                    ))
                                }
                            </>
                        ))
                    }
                </>
            )
            }
        <p style="text-align:justify;">
            <span class="text-big" style="color:#002060;">
            <strong>3. </strong>
            </span><span class="text-big"><strong>تجزیه‌وتحلیل:</strong></span>
            <p>
                <span style="color:#0070c0;">
                <i><strong>تجزیه و تحلیل نهایی از ${inspectionData?.organizationUnitName}</strong></i>
                </span>
                <i><strong>:</strong></i>
            </p>
        </p>
        <p style="text-align:justify;">
            <span class="text-big" style="color:#002060;">
                <strong>4. </strong>
            </span>
            <span class="text-big">
                <strong>نتیجه:</strong>
            </span>
        </p>
        <p style="color:#0070c0;">الف) ارزیابی کیفی</p>
        <p style="color:#0070c0;">ب) ارزیابی کمی بر مبنای بازبینه های تنظیمی</p>

        <p style="text-align:justify;"><span class="text-big" style="color:#002060;"><strong>5.</strong></span><span class="text-big"><strong> تشویقات و تنبیهات:</strong></span></p>
        <p style="text-align:justify;"><span style="color:#538135;">الف</span>- تشویقات:</p>
        <figure class="table">
        <table>
        <thead>
            <tr>
                <th>
                <p style="text-align:center;">رديف</p>
                </th>
                <th>
                <p style="text-align:center;">درجه</p>
                </th>
                <th>
                <p style="text-align:center;">نام ـ نشان</p>
                </th>
                <th>
                <p style="text-align:center;">شغل سازماني</p>
                </th>
                <th>
                <p style="text-align:center;">شماره كارگزيني</p>
                </th>
                <th>
                <p style="text-align:center;">علت تشویق</p>
                </th>
                <th>
                <p style="text-align:center;">نوع تشویق</p>
                </th>
            </tr>
        </thead>
        <tbody>
            ${ReactDOMServer.renderToString(
                <>
                    {
                        encouragement?.filter((i: any) => i.encouragementPunishment == true)?.map((item: any, index: any) => (
                            <tr>
                                <td>
                                    <p style={{ textAlign: "center" }}><strong>{index + 1}</strong></p>
                                </td>
                                <td>
                                    <p style={{ textAlign: "center" }}><strong>{item?.rank}</strong></p>
                                </td>
                                <td>
                                    <p style={{ textAlign: "center" }}><strong>{item?.nameFamily}</strong></p>
                                </td>
                                <td>
                                    <p style={{ textAlign: "center" }}><strong>{item?.post}</strong></p>
                                </td>
                                <td>
                                    <p style={{ textAlign: "center" }}><strong>{item?.personNumber}</strong></p>
                                </td>
                                <td>
                                    <p style={{ textAlign: "center" }}><strong>{item?.encouragementCause}</strong></p>
                                </td>
                                <td>
                                    <p style={{ textAlign: "center" }}><strong>{item?.encouragementType}</strong></p>
                                </td>
                            </tr>
                        ))
                    }
                </>
            )
            }
        </tbody>
        </table></figure>

        <p style="text-align:justify;"><span style="color:#538135;">ب</span>- تنبیهات:</p>
        <figure class="table">
        <table>
        <thead>
            <tr>
                <th>
                <p style="text-align:center;">رديف</p>
                </th>
                <th>
                <p style="text-align:center;">درجه</p>
                </th>
                <th>
                <p style="text-align:center;">نام ـ نشان</p>
                </th>
                <th>
                <p style="text-align:center;">شغل سازماني</p>
                </th>
                <th>
                <p style="text-align:center;">شماره كارگزيني</p>
                </th>
                <th>
                <p style="text-align:center;">علت تنبیه</p>
                </th>
                <th>
                <p style="text-align:center;">نوع تنبیه</p>
                </th>
            </tr>
        </thead>
        <tbody>
        ${ReactDOMServer.renderToString(
                <>
                    {
                        encouragement?.filter((i: any) => i.encouragementPunishment == false)?.map((item: any, index: any) => (
                            <tr>
                                <td>
                                    <p style={{ textAlign: "center" }}><strong>{index + 1}</strong></p>
                                </td>
                                <td>
                                    <p style={{ textAlign: "center" }}><strong>{item?.rank}</strong></p>
                                </td>
                                <td>
                                    <p style={{ textAlign: "center" }}><strong>{item?.nameFamily}</strong></p>
                                </td>
                                <td>
                                    <p style={{ textAlign: "center" }}><strong>{item?.post}</strong></p>
                                </td>
                                <td>
                                    <p style={{ textAlign: "center" }}><strong>{item?.personNumber}</strong></p>
                                </td>
                                <td>
                                    <p style={{ textAlign: "center" }}><strong>{item?.encouragementCause}</strong></p>
                                </td>
                                <td>
                                    <p style={{ textAlign: "center" }}><strong>{item?.encouragementType}</strong></p>
                                </td>
                            </tr>
                        ))
                    }
                </>
            )
            }
        </tbody>
        </table>
        </figure>
        <p>
            <br>
            <span class="text-big" style="color:#002060;">
            <strong>6.</strong>
            </span>
            <span class="text-big"><strong> پیشنهادها:</strong></span>
            <br>
            نتیجه بازرسی به‌منظور تعمیم و توسعه محاسن، رفع نارسایی‌ها (معایب و نواقص) به نهاجا و مبادی تخصصی آجا ابلاغ و نتایج پیگیری گردد.
        </p>
        <ol>
        <li>
            <p style="text-align:justify;">معاونت طرح و برنامه‌وبودجه نهاجا با هماهنگی معاونت طرح و برنامه‌وبودجه آجا در خصوص تصویب سازمان دانشگاه بر اساس بازطراحی طرح جامع (دانشگاه) پیگیری لازم را صورت دهد.</p>
        </li>
        <li>
            <p style="text-align:justify;">معاونت آماد و پش نهاجا نسبت به نظارت تخصصی از وضعیت دارایی اقلام هشت‌گانه <strong>(</strong>خصوصاً اقلام جنگ‌افزار و مهمّات<strong>) </strong>اقدام نماید<strong>.</strong></p>
        </li>
        <li>
            <p style="text-align:justify;">معاونت مهندسی و پدافند غ ع نهاجا<strong>:</strong></p>
        </li>
        </ol>
            <ul>
                <li>
                    <p style="text-align:justify;">نسبت به راه‌اندازی سالن تیراندازی در دانشگاه اقدام نماید<strong>.</strong></p>
                </li>
                <li>
                    <p style="text-align:justify;">نسبت به بازسازی خوابگاه‌های دانشجویی <strong>(</strong>سال سوم<strong>) </strong>و بهینه‌سازی سیستم تهویه خوابگاه‌ها <strong>(</strong>گرمایش و سرمایش<strong>) </strong>اقدام نماید<strong>.</strong></p>
                </li>
            </ul>
            <p style="text-align:justify;">&nbsp;</p><p style="text-align:left;">رئیس هیئت بازرسی -</p><p style="text-align:left;">&nbsp;</p>
        `,
        [encouragement, inspectionData, data, reviews, encouragementStatus, experts, expertsStatus]
    );

    return (
        <Box sx={{ margin: "20px" }}>
            <Grid container spacing={2}>
                {inspectionStatus === "loading" ? (
                    <Skeleton height={300} />
                ) : inspectionStatus === "error" ? (
                    <ErrorHandler onRefetch={inspectionRefetch} />
                ) : inspectionStatus === "success" && encouragementStatus == "success" && expertsStatus == "success" ? (
                    <>
                        <Grid item xs={12} margin={"10px"} sx={{ backgroundColor: "white", color: 'black', fontFamily: "Nazanin", lineHeight: "40px" }}>
                            <CKEditor
                                editor={ClassicEditor}
                                id="document"
                                onChange={(e, myeditor) => {
                                    console.log(myeditor.getData())
                                }}
                                config={{
                                    table: {
                                        contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
                                    },
                                    toolbar: {
                                        items: [
                                            "undo",
                                            "redo",
                                            "|",
                                            "heading",
                                            "|",
                                            "bold",
                                            "italic",
                                            "|",
                                            "bulletedList",
                                            "numberedList",
                                            "indent",
                                            "outdent",
                                            "|",
                                            "alignment",
                                            "ckboxImageEdit",
                                            "|",
                                            "fontSize",
                                            "insertTable",
                                            "|",
                                            "imageUpload",
                                            "imageInsert"
                                        ],
                                    },
                                    plugins: [
                                        CKTable, TableToolbar, Bold,
                                        Font,
                                        Essentials,
                                        Alignment,
                                        Bold,
                                        Italic,
                                        Paragraph,
                                        Undo,
                                        Indent,
                                        List,
                                        Heading,
                                        Image,
                                        ImageEditing,
                                        ImageResize,
                                        ImageUpload,
                                        ImageInsert
                                    ],
                                    licenseKey: "<YOUR_LICENSE_KEY>",
                                    // mention: {
                                    //     // Mention configuration
                                    // },
                                    initialData: html_text,
                                    language: {
                                        // The UI will be English.
                                        ui: "en",

                                        // But the content will be edited in Arabic.
                                        content: "fa",
                                    },
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}></Grid>
                        <Grid item xs={12}>
                            <TableContainer component={Paper} sx={{ minWidth: "1200px" }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center" style={{ width: "5%" }} colSpan={1}></TableCell>
                                            <TableCell align="center" style={{ width: "10%" }} sx={{ borderRight: "solid 1px rgba(224, 224, 224, 1)" }} colSpan={1}></TableCell>
                                            <TableCell align="center" style={{ width: "45%" }} sx={{ borderRight: "solid 1px rgba(224, 224, 224, 1)" }} colSpan={5}>تعداد</TableCell>
                                            <TableCell align="center" style={{ width: "10%" }} colSpan={1}></TableCell>
                                            <TableCell align="center" style={{ width: "10%" }} colSpan={1}></TableCell>
                                            <TableCell align="center" style={{ width: "10%" }} colSpan={1}></TableCell>
                                            <TableCell align="center" style={{ width: "10%" }} colSpan={1}></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell align="center">ردیف</TableCell>
                                            <TableCell align="center" sx={{ borderRight: "solid 1px rgba(224, 224, 224, 1)" }}>محور مورد بازرسی </TableCell>

                                            <TableCell align="center">تعداد بازبینه</TableCell>
                                            <TableCell align="center">فعالیت</TableCell>
                                            <TableCell align="center">حسن</TableCell>
                                            <TableCell align="center">عیب/نقص</TableCell>
                                            <TableCell align="center" sx={{ borderRight: "solid 1px rgba(224, 224, 224, 1)" }}>انجام وظیفه</TableCell>

                                            <TableCell align="center">میزان عملکرد</TableCell>
                                            <TableCell align="center">اثر بخشی</TableCell>
                                            <TableCell align="center">نمره بهره‌وری</TableCell>
                                            <TableCell align="center">طبقه بهره‌وری</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {review_data?.finalReport?.reports?.map((report: any, index: any) => (
                                            <TableRow
                                                key={index}
                                            >
                                                <TableCell align="center">
                                                    {index + 1}
                                                </TableCell>

                                                <TableCell align="center">
                                                    {report?.name}
                                                </TableCell>

                                                <TableCell align="center">
                                                    {report?.count}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {report?.activities}
                                                </TableCell>

                                                <TableCell align="center">
                                                    {report?.advantage_count}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {report?.deficiency_count}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {report?.moderate_count}
                                                </TableCell>

                                                <TableCell align="center">
                                                    {report?.total_grade.toFixed(2)}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {report?.total_effectiveness.toFixed(2)}
                                                </TableCell>

                                                <TableCell align="center">
                                                    {report?.effective_grade.toFixed(2)}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {
                                                        report?.effective_grade >= 90 ?
                                                            <Chip label="عالی" color="success" />
                                                            : report?.effective_grade >= 80 ?
                                                                <Chip label="خیلی خوب" color="success" />
                                                                : report?.effective_grade >= 75 ?
                                                                    <Chip label="خوب" color="info" />
                                                                    : report?.effective_grade >= 65 ?
                                                                        <Chip label="قابل قبول" color="warning" />
                                                                        : report?.effective_grade >= 0 ?
                                                                            <Chip label="غیر قابل قبول" color="error" />
                                                                            : <Chip label="نمره نا معتبر" />
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow>
                                            <TableCell align="center" colSpan={11}>

                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell align="center">
                                                -
                                            </TableCell>

                                            <TableCell align="center">
                                                جمع/معدل
                                            </TableCell>

                                            <TableCell align="center">
                                                {(review_data?.finalReport?.reports?.reduce((acc: any, curr: any) => acc + curr.count, 0))}
                                            </TableCell>
                                            <TableCell align="center">
                                                {(review_data?.finalReport?.reports?.reduce((acc: any, curr: any) => acc + curr.activities, 0))}
                                            </TableCell>

                                            <TableCell align="center">
                                                {(review_data?.finalReport?.reports?.reduce((acc: any, curr: any) => acc + curr.advantage_count, 0))}
                                            </TableCell>
                                            <TableCell align="center">
                                                {(review_data?.finalReport?.reports?.reduce((acc: any, curr: any) => acc + curr.deficiency_count, 0))}
                                            </TableCell>
                                            <TableCell align="center">
                                                {(review_data?.finalReport?.reports?.reduce((acc: any, curr: any) => acc + curr.moderate_count, 0))}
                                            </TableCell>

                                            <TableCell align="center">
                                                {(review_data?.finalReport?.avg_grade?.toFixed(2))}
                                            </TableCell>
                                            <TableCell align="center">
                                                {(review_data?.finalReport?.avg_productivity?.toFixed(2))}
                                            </TableCell>

                                            <TableCell align="center">
                                                {(review_data?.finalReport?.avg_effective_grade.toFixed(2))}
                                            </TableCell>
                                            <TableCell align="center">
                                                {
                                                    review_data?.finalReport?.avg_effective_grade >= 90 ?
                                                        <Chip label="عالی" color="success" />
                                                        : review_data?.finalReport?.avg_effective_grade >= 80 ?
                                                            <Chip label="خیلی خوب" color="success" />
                                                            : review_data?.finalReport?.avg_effective_grade >= 75 ?
                                                                <Chip label="خوب" color="info" />
                                                                : review_data?.finalReport?.avg_effective_grade >= 65 ?
                                                                    <Chip label="قابل قبول" color="warning" />
                                                                    : review_data?.finalReport?.avg_effective_grade >= 0 ?
                                                                        <Chip label="غیر قابل قبول" color="error" />
                                                                        : <Chip label="نمره نا معتبر" />
                                                }
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell align="center" colSpan={4} sx={{ borderRight: "solid 1px rgba(224, 224, 224, 1)" }}></TableCell>
                                            <TableCell align="center" colSpan={3} sx={{ borderRight: "solid 1px rgba(224, 224, 224, 1)" }}>
                                                درصد
                                            </TableCell>
                                            <TableCell align="center" colSpan={4}></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell align="center" colSpan={4}></TableCell>
                                            <TableCell align="center" colSpan={1}>
                                                {(review_data?.finalReport?.reports?.reduce((acc: any, curr: any) => acc + curr.advantage_count, 0) / (data?.finalReport?.reports?.reduce((acc: any, curr: any) => acc + curr.deficiency_count + curr.moderate_count + curr.advantage_count, 0)) * 100).toFixed(2)}
                                            </TableCell>
                                            <TableCell align="center" colSpan={1}>
                                                {(review_data?.finalReport?.reports?.reduce((acc: any, curr: any) => acc + curr.deficiency_count, 0) / (data?.finalReport?.reports?.reduce((acc: any, curr: any) => acc + curr.deficiency_count + curr.moderate_count + curr.advantage_count, 0)) * 100).toFixed(2)}
                                            </TableCell>
                                            <TableCell align="center" colSpan={1}>
                                                {(review_data?.finalReport?.reports?.reduce((acc: any, curr: any) => acc + curr.moderate_count, 0) / (data?.finalReport?.reports?.reduce((acc: any, curr: any) => acc + curr.deficiency_count + curr.moderate_count + curr.advantage_count, 0)) * 100).toFixed(2)}
                                            </TableCell>
                                            <TableCell align="center" colSpan={4}></TableCell>
                                        </TableRow>

                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                        <Grid item xs={12}>
                            <TableContainer component={Paper} sx={{ minWidth: "1200px" }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center" colSpan={2}>آمار موجودی بر سازمانی</TableCell>

                                            <TableCell align="center">نمره تیر اندازی</TableCell>
                                            <TableCell align="center" sx={{ borderRight: "solid 1px rgba(224, 224, 224, 1)" }}>نمره دانش نظامی</TableCell>

                                            <TableCell align="center">تاثیر آمار بر بهره‌وری</TableCell>
                                            <TableCell align="center">تاثیر تیر اندازی بر بهره‌وری</TableCell>
                                            <TableCell align="center" sx={{ borderRight: "solid 1px rgba(224, 224, 224, 1)" }}>تاثیر دانش نظامی بر بهره‌وری</TableCell>

                                            <TableCell align="center" colSpan={3}>نمره نهایی بهره‌وری</TableCell>
                                            <TableCell align="center">طبقه نهایی بهره‌وری</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="center" colSpan={2}>
                                                {review_data?.finalReport?.stats?.toFixed(2)}
                                            </TableCell>

                                            <TableCell align="center">
                                                {review_data?.finalReport?.shootingGrade?.toFixed(2)}
                                            </TableCell>
                                            <TableCell align="center">
                                                {review_data?.finalReport?.militaryKnowledgeGrade?.toFixed(2)}
                                            </TableCell>

                                            <TableCell align="center">
                                                {review_data?.finalReport?.effectiveStats?.toFixed(2)}
                                            </TableCell>
                                            <TableCell align="center">
                                                {review_data?.finalReport?.effectiveShooting?.toFixed(2)}
                                            </TableCell>
                                            <TableCell align="center">
                                                {review_data?.finalReport?.effectiveMilitaryKnowledge?.toFixed(2)}
                                            </TableCell>

                                            <TableCell align="center" colSpan={3}>
                                                {review_data?.finalReport?.finalGradeAfterEffect?.toFixed(2)}
                                            </TableCell>

                                            <TableCell align="center">
                                                {
                                                    review_data?.finalReport?.finalGradeAfterEffect >= 90 ?
                                                        <Chip label="عالی" color="success" />
                                                        : review_data?.finalReport?.finalGradeAfterEffect >= 80 ?
                                                            <Chip label="خیلی خوب" color="success" />
                                                            : review_data?.finalReport?.finalGradeAfterEffect >= 75 ?
                                                                <Chip label="خوب" color="info" />
                                                                : review_data?.finalReport?.finalGradeAfterEffect >= 65 ?
                                                                    <Chip label="قابل قبول" color="warning" />
                                                                    : review_data?.finalReport?.finalGradeAfterEffect >= 0 ?
                                                                        <Chip label="غیر قابل قبول" color="error" />
                                                                        : <Chip label="نمره نا معتبر" />
                                                }
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell align="center" colSpan={11}>

                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell align="center" colSpan={11}>
                                                تحلیل
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell align="center" colSpan={11}>
                                                {
                                                    review_data?.finalReport?.finalGradeAfterEffect >= 90 ?
                                                        <Chip label="تشویق فرمانده / مسئول در دستور آجا و اهداء لوح تقدیر" color="success" />
                                                        : review_data?.finalReport?.finalGradeAfterEffect >= 80 ?
                                                            <Chip label="تشویق فرمانده / مسئول در دستور یک رده بالاتر" color="success" />
                                                            : review_data?.finalReport?.finalGradeAfterEffect >= 75 ?
                                                                <Chip label="تشویق فرمانده / مسئول در دستور یگان عمده" color="info" />
                                                                : review_data?.finalReport?.finalGradeAfterEffect >= 65 ?
                                                                    <Grid container spacing={1}>
                                                                        <Grid item xs={12}>
                                                                            <Chip label="- راهنمایی و توصیه لازم مبنی بر اصلاح فرآیند هملکردی فرمانده و مسئولین یگان" color="warning" />
                                                                        </Grid>
                                                                        <Grid item xs={12}>
                                                                            <Chip label="- تذکر به فرمانده / مسئول و کارکنان قصور کننده مطابق با آئین نامه انضباطی" color="error" />
                                                                        </Grid>
                                                                    </Grid>
                                                                    : review_data?.finalReport?.finalGradeAfterEffect >= 0 ?
                                                                        <Grid container spacing={1}>
                                                                            <Grid item xs={12}>
                                                                                <Chip label="- تذکر به فرمانده / مسئول و کارکنان قصور کننده مطابق با آئین نامه انضباطی" color="error" />
                                                                            </Grid>
                                                                            <Grid item xs={12}>
                                                                                <Chip label="- ستاد تخصصی یک رده بالاتر در جهت رفع نارسائی ها اهتمام بیشتری صورت دهد" color="error" />
                                                                            </Grid>
                                                                        </Grid>
                                                                        : <Chip label="نمره نا معتبر" />
                                                }
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid xs={12}>
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart
                                        dataset={review_data.finalReport?.reports}
                                        xAxis={[{
                                            scaleType: "band",
                                            dataKey: "name"

                                        }]}
                                        series={[
                                            {
                                                data: review_data?.finalReport?.reports?.map((item: any) => (
                                                    item?.total_grade
                                                ))
                                            }

                                        ]}
                                    />
                                </ResponsiveContainer>
                            </Grid>
                            <Grid xs={12}>
                                <ResponsiveContainer width="100%" height={400}>
                                    <PieChart
                                        series={[{
                                            data: [
                                                { id: 0, value: review_data?.finalReviewReports?.reduce((acc: any, curr: any) => acc + curr?.advantageNumber, 0), label: "محاسن" },
                                                { id: 1, value: review_data?.finalReviewReports?.reduce((acc: any, curr: any) => acc + curr?.deficiencyNumber, 0), label: "معایب" },
                                                { id: 2, value: review_data?.finalReviewReports?.reduce((acc: any, curr: any) => acc + curr?.moderateNumber, 0), label: "انجام وظیفه" },
                                            ]
                                        }]}
                                    />
                                </ResponsiveContainer>
                            </Grid>
                        </Grid>
                    </>
                ) : null}
            </Grid>
        </Box>
    );
}

export default HeadReport;