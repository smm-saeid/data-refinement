import { Box, Grid, Typography } from "@mui/material";
import React, { MutableRefObject, Ref, useEffect, useMemo, useState } from "react";
import moment from "moment-jalaali";
import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic"
// import ClassicEditor from '@ckeditor/ckeditor5-editor-classic'
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
  Table,
} from "ckeditor5";
import "../../operation/styles/workflow.css";
import { organizations, skills } from "../../operation/consts";
import ReactDOMServer from "react-dom/server";
import { useAuth } from "hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";

const FinalWorkflow = React.forwardRef(
  ({ issuanceInformation, setIssuanceInformation, organizationName, listSkills, dayNumber, duration }: any, ref) => {
    const Auth = useAuth();
    const { id } = useParams();

    const {
      data: inspectionData,
      status: inspectionStatus,
      refetch: inspectionRefetch,
    } = useQuery<any, any, any>({
      queryKey: [`/inspection/id/${id}`],
      queryFn: Auth?.getRequest_YASER,
      select: (res: any) => res.data,
    } as any);

    const { data, status, refetch } = useQuery<any>({
      queryKey: [`/information/inspection-id/${id}`],
      queryFn: Auth?.getRequest_YASER,
      select: (res: any) => {
        return res?.data;
      },
    } as any);

    const {
      data: reviews,
      status: reviewStatus,
      refetch: reviewRefetch,
    } = useQuery<any, any, any>({
      queryKey: [`/review-customize/find-all-reviews?inspectionId=${id}`],
      queryFn: Auth?.getRequest_YASER,
      select: (res: any) => res.data,
    } as any);

    const {
      data: encouragement,
      status: encouragementStatus,
      refetch: encouragementRefetch,
    } = useQuery<any, any, any>({
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

    const {
      data: shooting,
      status: shooting_status,
      refetch: shooting_refetch,
    } = useQuery<any, any, any>({
      queryKey: [`/shooting/?pageSize=1000&currentPage=1&inspectionId=${id}`],
      queryFn: Auth?.getRequest_YASER,
      select: (res: any) => res?.data?.rows,
    } as any);

    const {
      data: military,
      status: military_status,
      refetch: military_refetch,
    } = useQuery<any, any, any>({
      queryKey: [`/military-knowledge/?pageSize=1000&currentPage=1&inspectionId=${id}`],
      queryFn: Auth?.getRequest_YASER,
      select: (res: any) => res?.data?.rows,
    } as any);

    function datediff(first: any, second: any) {
      return Math.round((second.getTime() - first.getTime()) / (1000 * 60 * 60 * 24));
    }

    const findWeekDays = () => {
      if (!!duration?.from && !!duration?.to) {
        let weekDaysCount = 0;
        let start = duration?.from.getDay();
        for (let i = 0; i < datediff(duration?.from, duration?.to); i++) {
          if ((start + i) % 7 != 5) {
            weekDaysCount++;
          }
        }
        return weekDaysCount;
      }
      return null;
    };

    const inspectionTable = useMemo(
      () =>
        `<table style={margin: "10px", align: "center"}>
                <thead>
                    <tr>
                        <th>ردیف</th>
                        <th>سمت در هیئت بازرسی</th>
                        <th>یگان/معاونت/سازمان/اداره</th>
                        <th>تخصص</th>
                        <th>تعداد</th>
                        
                    </tr>
                </thead>
                <tbody >
                ${ReactDOMServer.renderToString(
                  listSkills?.map((skill: any, index: any) => (
                    <tr>
                      <td>{index + 1}</td>
                      <td>{skill?.position}</td>
                      <td>{skill.organizationUnitName}</td>
                      <td>{skill?.orgSpecialityName}</td>
                      <td>{1}</td>
                    </tr>
                  ))
                )}
                </tbody>
            </table> `,
      [listSkills]
    );

    const insertIntoHtml = (issuanceInformation: string) => {
      let doc = new DOMParser().parseFromString(issuanceInformation, "text/html");

      let insTable = doc.getElementsByClassName("table");
      if (insTable.length > 0) {
        insTable[0].innerHTML = inspectionTable;
      } else {
        let newDoc = doc.createElement("div");
        newDoc.innerHTML = inspectionTable;
      }

      let orgName = doc.getElementById("org-name");
      if (orgName != null) {
        orgName.innerHTML = organizationName;
      }

      let yearName = doc.getElementById("year-name");
      if (yearName != null) {
        yearName.innerHTML = duration?.from ? moment(duration?.from).format("jYYYY") : "-";
      }
      setIssuanceInformation(doc.documentElement.innerHTML);
      return doc.documentElement.innerHTML;
    };

    const html_text = useMemo(
      () => `
        <p style="text-align:center;">بسمه تعالی</p>
        <p style="text-align:center;"><img class="image_resized" style="aspect-ratio:485/533;width:7.69%;"
            src="/assets/images/logo.png" width="485" height="533"></p>
        <p style="text-align:center;">فرماندهی کل آجا</p>
        <h3>از :آجا (معاونت بازرسي و ايمني-اداره عمليات بازرسي و پيگيري)<span class="text-tiny">&nbsp;</span> &nbsp; &nbsp; &nbsp;
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;شماره:</h3>
        <h3>به: امير فرماندهي محترم ..... (بازرسي و ايمني) &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp; &nbsp; &nbsp; &nbsp; تاریخ:</h3>
        <h3>موضوع: نتيجه بازرسي برنامه‌اي از ${
          inspectionData?.organizationUnitName
        } &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp; &nbsp;پیوست:</h3>
        <p style="text-align:center;">با صلوات بر حضرت محمد(ص) و آل محمد(ص)</p>
        <p style="text-align:center;">
            <strong>«گردشکار»</strong>
        </p>
        <p>سلام علیکم، با احترام به استحضار می رساند: </p>
        
        <p style="text-align:justify;"><strong>1. سابقه:</strong></p>
        <p>برابر طرح مصوب بازرسی‌ها و نظارت‌های ستادی سال <strong>
        <span id="year">${
          inspectionData?.informationStartDate ? moment(inspectionData?.informationStartDate).format("jYYYY") : "-"
        }</span>
        </strong> و در راستای اجرای اوامر صادره هیئتی به استعداد ${experts?.length} نفر به سرپرستی ... به مدت ... روز ${
        inspectionData?.organizationUnitName
      } مورد بازرسی و ارزیابی قرداد که نتیجه به شرح ذیل جهت مزید استحضار می گردد (سابقه).</p>
        
    <p style="text-align:justify;"><strong>2. نکات مشهوده:</strong></p>
    <p>فرآیند عملیات بازرسی مرتبط با ${
      inspectionData?.organizationUnitName
    } به شرح کتابچه یوست و ضمایم مربوطه می باشد.</p>
    <p>ضمایم:</p>

    <ul>
        <li>
            <p style="text-align:justify;">گزارش رئیس هیئت (ضمیمه ۱)</p>
        </li>
        <li>
            <p style="text-align:justify;">بازبینه و گزارش بازرسان (ضمیمه ۲)</p>
        </li>
        <li>
            <p style="text-align:justify;">نمرات تیراندازی (ضمیمه ۳)</p>
        </li>
        <li>
            <p style="text-align:justify;">نمرات دانش نظامی (ضمیمه ۴)</p>
        </li>
        <li>
            <p style="text-align:justify;">ارزیابی عملکرد بازرسان (ضمیمه ۵)</p>
        </li>
    </ul>

    <p style="text-align:justify;">
        <span style="color:#002060;">
        <strong>- تاریخ بازرسی و ارزیابی: </strong>
        </span>
        <span>
            ${!!data?.informationStartDate ? moment(data?.informationStartDate).format("jYYYY/jMM/jDD") : "--"}
        </span>
    </p>

        
    <p style="text-align:justify;">
        <span style="color:#002060;">
        <strong>- مشخصات فرمانده ${inspectionData?.organizationUnitName}:</strong>
        </span>
    </p>
    <figure class="table">
    <table><tbody><tr><td><p style="text-align:center;"><span style="color:#000000;">درجه</span></p></td><td><p style="text-align:center;"><span style="color:#000000;">نام و نشان</span></p></td><td><p style="text-align:center;"><span style="color:#000000;">شماره کارگزینی</span></p></td><td><p style="text-align:center;"><span style="color:#000000;">شغل سازمانی</span></p></td><td><p style="text-align:center;"><span style="color:#000000;">تاریخ انتصاب</span></p></td></tr><tr><td><p style="text-align:center;">${" "}</p></td><td><p style="text-align:center;">${" "}</p></td><td><p style="text-align:center;">${" "}</p></td><td><p style="text-align:center;">فرمانده ${
        inspectionData?.organizationUnitName
      }</p></td><td></td></tr></tbody></table></figure>
    
    <p style="text-align:justify;">
        <span style="color:#002060;">
        <strong>- آمار:</strong>
        </span>
    </p>

    <figure class="table">
        <table>
        <tbody>
            <tr>
                <td colspan="3">
                    <p style="text-align:center;"><strong>پایور</strong></p>
                </td>
                <td colspan="3">
                    <p style="text-align:center;"><strong>وظیفه</strong></p>
                </td>
            </tr>
            <tr>
                <td>
                    <p style="text-align:center;"><strong>سازمانی</strong></p>
                </td>
                <td>
                    <p style="text-align:center;"><strong>موجودی</strong></p>
                </td>
                <td>
                    <p style="text-align:center;"><strong>درصد موجودی</strong></p>
                </td>
                <td>
                    <p style="text-align:center;"><strong>سازمانی</strong></p>
                </td>
                <td>
                    <p style="text-align:center;"><strong>موجودی</strong></p>
                </td>
                <td>
                    <p style="text-align:center;"><strong>درصد موجودی</strong></p>
                </td>
            </tr>
            <tr>
                <td>
                    <p style="text-align:center;"><strong>${inspectionData?.staffOrgStatistics}</strong></p>
                </td>
                <td>
                    <p style="text-align:center;"><strong>${inspectionData?.staffInventoryStatistics}</strong></p>
                </td>
                <td>
                    <p style="text-align:center;"><strong>${(
                      (inspectionData?.staffInventoryStatistics / inspectionData?.staffOrgStatistics) *
                      100
                    ).toFixed(2)}%</strong></p>
                </td>
                <td>
                    <p style="text-align:center;"><strong>${inspectionData?.dutyOrgStatistics}</strong></p>
                </td>
                <td>
                    <p style="text-align:center;"><strong>${inspectionData?.dutyInventoryStatistics}</strong></p>
                </td>
                <td>
                    <p style="text-align:center;"><strong>${(
                      (inspectionData?.dutyInventoryStatistics / inspectionData?.dutyOrgStatistics) *
                      100
                    ).toFixed(2)}%</strong></p>
                </td>
            </tr>
        </tbody>
        </table>
    </figure>
    
    <p style="text-align:justify;"><strong>1)- اقدامات و فعالیت ها (محاسن):</strong></p>
    <figure class="table">
        <table>
        <thead>
            <tr>
                <th>
                <p style="text-align:center;">رديف</p>
                </th>
                <th>
                <p style="text-align:center;">شرح حسن</p>
                </th>
            </tr>
        </thead>
        <tbody>
            ${ReactDOMServer.renderToString(
              <>
                {reviews?.finalReviewReports?.map((item: any, idx: any) => {
                  return item?.advantages?.map((itemm: any, idxx: any) => (
                    <tr>
                      <td>
                        <p style={{ textAlign: "center" }}>
                          <strong>{idxx + 1}</strong>
                        </p>
                      </td>
                      <td>
                        <p style={{ textAlign: "center" }}>{itemm?.description}</p>
                      </td>
                    </tr>
                  ));
                })}
              </>
            )}
        </tbody>
    </table></figure>
    
    <p style="text-align:justify;"><strong>2)- نارسائی ها (معایب و نواقص):</strong></p>
    <figure class="table">
        <table>
        <thead>
            <tr>
                <th>
                <p style="text-align:center;">رديف</p>
                </th>
                <th>
                <p style="text-align:center;">شرح نارسائی</p>
                </th>
            </tr>
        </thead>
        <tbody>
            ${ReactDOMServer.renderToString(
              <>
                {reviews?.finalReviewReports?.map((item: any, idx: any) => {
                  return item?.deficiencies?.map((itemm: any, idxx: any) => (
                    <tr>
                      <td>
                        <p style={{ textAlign: "center" }}>
                          <strong>{idxx + 1}</strong>
                        </p>
                      </td>
                      <td>
                        <p style={{ textAlign: "center" }}>{itemm?.description}</p>
                      </td>
                    </tr>
                  ));
                })}
              </>
            )}
        </tbody>
    </table></figure>

        <p style="text-align:justify;">
            <span class="text-big" style="color:#002060;">
            <strong>۴. </strong>
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
                <strong>۵. </strong>
            </span>
            <span class="text-big">
                <strong>نتیجه:</strong>
            </span>
        </p>

        <p style="color:#0070c0;">الف) ارزیابی کیفی</p>
        <p style="color:#0070c0;">مستند به اطلاعات جمع آوری شده و مشاهدات عینی و با توجه به محدودیت ها و مشکلات موجود عملکرد فرماندهان مسئولین و کارکنان ${
          inspectionData?.organizationUnitName
        } از نظر بهره وری در سطح ${inspectionData?.organizationUnitName} ارزیابی می گردد.</p>
        <p style="color:#0070c0;">ب) ارزیابی کمی بر مبنای بازبینه های تنظیمی</p>

        <p>با هدف فرهنگ یادگیری و توسعه سازمان یادگیرنده تعداد ${10} مورد نارسائی (عیب و نقص) در محل با آموزش و ایجاد تعامل و ارائه تذکرات لازم رفع گردیده و تعداد ${60} مورد نارسائی (عیب و نقص) توافق گردید. در بازه زمانی مشخص رفع گردد و در پیگیری اسنادی و میدانی آتی در صورت عدم اهتمام در زمینه رفع نارسائی هامسئولین قصور کننده تنبیه گردند.</p>

        <p style="color:#0070c0;">پ) تیراندازی</p>
        <p>تیر اندازی با تعداد ${
          shooting?.length
        } نفر از کارکنان مرکز به عمل آمد که نتیجه آن به شرح جدول ذیل است (ضمیمه ۳)</p>
        <figure class="table">
            <table>
                <tbody>
                    <tr>
                        <td><p style="text-align:center;"><strong>نوع سلاح</strong></p></td>
                        <td><p style="text-align:center;"><strong>معدل (مبنا ۱۰۰ نمره)</strong></p></td>
                    </tr>
                    <tr>
                        <td><p style="text-align:center;"><strong>اسلحه ژ-۳</strong></p></td>
                        <td><p style="text-align:center;"><strong>${(
                          shooting?.reduce((acc: any, curr: any) => acc + curr.grade, 0) / military?.length
                        ).toFixed(2)}</strong></p></td>
                    </tr>
                </tbody>
            </table>
        </figure>


        <p style="color:#0070c0;">پ) دانش نظامی</p>
        <p>آزمون دانش نظامی از تعداد ${
          military?.length
        } از کارکنان(مقطع دوره عالی مقدماتی و افسران ب و درجه داران) به عمل آمد که نتیجه آن به شرح جدول ذیل است.</p>
        <figure class="table">
            <table>
                <tbody>
                    <tr>
                        <td><p style="text-align:center;"><strong>مقطع</strong></p></td>
                        <td><p style="text-align:center;"><strong>معدل (مبنا ۱۰۰ نمره)</strong></p></td>
                    </tr>
                    <tr>
                        <td><p style="text-align:center;"><strong>معدل دانش نظامی</strong></p></td>
                        <td><p style="text-align:center;"><strong>${(
                          military?.reduce((acc: any, curr: any) => acc + curr.grade, 0) / military?.length
                        ).toFixed(2)}</strong></p></td>
                    </tr>
                </tbody>
            </table>
        </figure>

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
                {encouragement
                  ?.filter((i: any) => i.encouragementPunishment == true)
                  ?.map((item: any, index: any) => (
                    <tr>
                      <td>
                        <p style={{ textAlign: "center" }}>
                          <strong>{index + 1}</strong>
                        </p>
                      </td>
                      <td>
                        <p style={{ textAlign: "center" }}>
                          <strong>{item?.rank}</strong>
                        </p>
                      </td>
                      <td>
                        <p style={{ textAlign: "center" }}>
                          <strong>{item?.nameFamily}</strong>
                        </p>
                      </td>
                      <td>
                        <p style={{ textAlign: "center" }}>
                          <strong>{item?.post}</strong>
                        </p>
                      </td>
                      <td>
                        <p style={{ textAlign: "center" }}>
                          <strong>{item?.personNumber}</strong>
                        </p>
                      </td>
                      <td>
                        <p style={{ textAlign: "center" }}>
                          <strong>{item?.encouragementCause}</strong>
                        </p>
                      </td>
                      <td>
                        <p style={{ textAlign: "center" }}>
                          <strong>{item?.encouragementType}</strong>
                        </p>
                      </td>
                    </tr>
                  ))}
              </>
            )}
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
            {encouragement
              ?.filter((i: any) => i.encouragementPunishment == false)
              ?.map((item: any, index: any) => (
                <tr>
                  <td>
                    <p style={{ textAlign: "center" }}>
                      <strong>{index + 1}</strong>
                    </p>
                  </td>
                  <td>
                    <p style={{ textAlign: "center" }}>
                      <strong>{item?.rank}</strong>
                    </p>
                  </td>
                  <td>
                    <p style={{ textAlign: "center" }}>
                      <strong>{item?.nameFamily}</strong>
                    </p>
                  </td>
                  <td>
                    <p style={{ textAlign: "center" }}>
                      <strong>{item?.post}</strong>
                    </p>
                  </td>
                  <td>
                    <p style={{ textAlign: "center" }}>
                      <strong>{item?.personNumber}</strong>
                    </p>
                  </td>
                  <td>
                    <p style={{ textAlign: "center" }}>
                      <strong>{item?.encouragementCause}</strong>
                    </p>
                  </td>
                  <td>
                    <p style={{ textAlign: "center" }}>
                      <strong>{item?.encouragementType}</strong>
                    </p>
                  </td>
                </tr>
              ))}
          </>
        )}
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
            <p style="text-align:justify;">&nbsp;</p><p style="text-align:left;">معاون بازرسی و ایمنی آجا -</p><p style="text-align:left;">&nbsp;</p>
        
        
        <p style="text-align:justify;"><span style="color:#002060;"></span><span class="text-big"><strong>ضمیمه ۳</strong></span></p>
        <figure class="table">
        <table>
        <thead>
            <tr>
                <th>
                <p style="text-align:center;">رديف</p>
                </th>
                <th>
                <p style="text-align:center;">شماره پرسنلی</p>
                </th>
                <th>
                <p style="text-align:center;">نام و نام خانوادگی</p>
                </th>
                <th>
                <p style="text-align:center;">یگان</p>
                </th>
                <th>
                <p style="text-align:center;">نمره</p>
                </th>
            </tr>
        </thead>
        <tbody>
            ${ReactDOMServer.renderToString(
              <>
                {shooting?.map((item: any, index: any) => (
                  <tr>
                    <td>
                      <p style={{ textAlign: "center" }}>
                        <strong>{index + 1}</strong>
                      </p>
                    </td>
                    <td>
                      <p style={{ textAlign: "center" }}>
                        <strong>{item?.personInfoPersonNumber}</strong>
                      </p>
                    </td>
                    <td>
                      <p style={{ textAlign: "center" }}>
                        <strong>{item?.personInfoName + " " + item?.personInfoFamily}</strong>
                      </p>
                    </td>
                    <td>
                      <p style={{ textAlign: "center" }}>
                        <strong>{item?.organizationUnitName}</strong>
                      </p>
                    </td>
                    <td>
                      <p style={{ textAlign: "center" }}>
                        <strong>{item?.grade}</strong>
                      </p>
                    </td>
                  </tr>
                ))}
              </>
            )}
        </tbody>
        </table></figure>

        <p style="text-align:justify;"><span style="color:#002060;"></span><span class="text-big"><strong>ضمیمه ۴</strong></span></p>
        <figure class="table">
        <table>
        <thead>
            <tr>
                <th>
                <p style="text-align:center;">رديف</p>
                </th>
                <th>
                <p style="text-align:center;">شماره پرسنلی</p>
                </th>
                <th>
                <p style="text-align:center;">نام و نام خانوادگی</p>
                </th>
                <th>
                <p style="text-align:center;">یگان</p>
                </th>
                <th>
                <p style="text-align:center;">نمره</p>
                </th>
            </tr>
        </thead>
        <tbody>
            ${ReactDOMServer.renderToString(
              <>
                {military?.map((item: any, index: any) => (
                  <tr>
                    <td>
                      <p style={{ textAlign: "center" }}>
                        <strong>{index + 1}</strong>
                      </p>
                    </td>
                    <td>
                      <p style={{ textAlign: "center" }}>
                        <strong>{item?.personInfoPersonNumber}</strong>
                      </p>
                    </td>
                    <td>
                      <p style={{ textAlign: "center" }}>
                        <strong>{item?.personInfoName + " " + item?.personInfoFamily}</strong>
                      </p>
                    </td>
                    <td>
                      <p style={{ textAlign: "center" }}>
                        <strong>{item?.organizationUnitName}</strong>
                      </p>
                    </td>
                    <td>
                      <p style={{ textAlign: "center" }}>
                        <strong>{item?.grade}</strong>
                      </p>
                    </td>
                  </tr>
                ))}
              </>
            )}
        </tbody>
        </table></figure>

        
            `,
      [encouragement, inspectionData, data, reviews, encouragementStatus, experts, expertsStatus]
    );

    return (
      <Box margin={"10px"} sx={{ backgroundColor: "white", color: "black", fontFamily: "Nazanin", lineHeight: "40px" }}>
        <CKEditor
          editor={ClassicEditor}
          id="document"
          onChange={(e, myeditor) => {
            // setIssuanceInformation(myeditor.getData())
          }}
          config={{
            table: {
              contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
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
              ],
            },
            plugins: [
              Table,
              TableToolbar,
              Bold,
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
        {/* <Box ref={ref}>
                <Box textAlign={"end"}>
                    <Typography variant="h6">
                    خیلی محرمانه
                    </Typography>
                </Box>
                <Box>
                    <Grid container>
                        <Grid xs={4} item paddingLeft={"5%"}>
                            <Typography variant="h6">
                                بسمه تعالی
                            </Typography>
                        </Grid>
                        <Grid xs={4} item sx={{display: "flex", flexDirection:'column', justifyContent: "center", alignItems: "center"}}>
                            <Box
                                component="img"
                                sx={{ height: "80px", width: "auto" }}
                                src={`${process.env.PUBLIC_URL}/assets/images/logo.png`}
                            />
                            <Typography variant="h6" margin={'10px'}>
                                فرماندهی کل آجا
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
                <Box>
                    <Grid container>
                        <Grid xs={9} item >
                            <Grid container>
                                <Grid xs={12} item flexDirection={'row'}>
                                    <Typography variant="h5" fontWeight={'bold'}>
                                        از: 
                                        معاونت بازرسی و ایمنی آجا
                                        {" "}
                                        {"(اداره عملیات بازرسی و پیگیری - عملیات بازرسی)"}
                                    </Typography>
                                </Grid>
                                <Grid xs={12} item>
                                    <Typography variant="h5" fontWeight={'bold'}>
                                        به: 
                                        امیر ریاست محترم ستاد و معاون هماهنگ کننده آجا
                                    </Typography>
                                </Grid>
                                <Grid xs={12} item>
                                    <Typography variant="h5" fontWeight={'bold'}>
                                        موضوع: 
                                        بازرسی برنامه ای از
                                        {" "}
                                        {organizationName}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid xs={3} item>
                            <Grid container>
                                <Grid xs={4} item>
                                    <Typography variant="h5" fontWeight={'bold'}>
                                        شماره:
                                    </Typography>
                                </Grid>
                                <Grid xs={8} item>
                                    <Typography variant="h5">
                                        ۱۴۰۳/ب/۸۳۱۰/۱/
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid xs={4} item>
                                    <Typography variant="h5" fontWeight={'bold'}>
                                        تاریخ:
                                    </Typography>
                                </Grid>
                                <Grid xs={8} item>
                                    <Typography variant="h5">
                                        ۱۴۰۳/۰۲/
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Typography variant="h5" fontWeight={'bold'}>
                                    پیوست:
                                </Typography>
                                <Typography variant="h5">
                                    دارد
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
                <Box textAlign={'center'} marginTop={'1%'} marginBottom={'2%'}>
                    <Typography variant="h6">
                        با صلوات بر حضرت محمّد(ص) و آل محمّد(ص)
                    </Typography>
                </Box>
                <Box textAlign={'center'} marginTop={'2%'} marginBottom={'2%'}>
                    <Typography variant="h5" fontWeight={"800"}>
                        «گردشکار»
                    </Typography>
                </Box>
                <Box textAlign={'start'} marginTop={'3%'} marginBottom={'3%'}>
                    <Typography variant="h5">
                        سلام علیکم، با احترام
                    </Typography>
                </Box>
                <Box textAlign={'start'} marginTop={'2%'} marginBottom={'2%'}>
                    <Typography variant="h5" fontWeight={"800"} marginBottom={'1%'}>
                        ۱. سابقه:
                    </Typography>
                    <Box>
                        <Typography variant="h5" paddingLeft={"2%"} fontWeight={'300'}>
                            برابر طرح مصوب بازرسی‌ها و نظارت‌های ستادی سال 
                            {" "}
                            <span style={{fontWeight: "800"}}>{duration?.from ? moment(duration?.from).format('jYYYY') : "-"}</span> 
                            {" "}
                            و درراستای اجرای اوامر صادره در نظر است. وفق برنامه زمان‌بندی شده از تاریخ 
                            {" "}
                            <span style={{fontWeight: "800"}}>{duration?.from ? moment(duration?.from).format('jYYYY/jMM/jDD') : "-"}</span> 
                            {" "}
                            به مدت 
                            {" "}
                            <span style={{fontWeight: "800"}}>{dayNumber}</span>
                            {" "}
                            روز کاری از 
                            {" "}
                            <span style={{fontWeight: "800"}}>{organizationName}</span> 
                            {" "}
                            توسط هیئتی به استعداد 
                            {" "}
                            <span style={{fontWeight: "800"}}>{listSkills.reduce((a:any,b:any)=>{return(a+(b?.number ? b.number : 0))}, 0) + 1}</span> 
                            {" "}
                            نفر به شرح تخصص های مندرج در جدول بازرسی برنامه ای به عمل می آید.
                            {" "}
                            <span style={{fontWeight: "800"}}>{"(سابقه)"}</span> 
                        </Typography>
                    </Box>
                </Box>
                <Box textAlign={'start'} marginTop={'1%'} marginBottom={'1%'}>
                    <Typography variant="h5" fontWeight={"800"} marginBottom={'1%'}>
                        ۲. ترکیب هیئت بازرسی:
                    </Typography>
                    <div className="squad-formation">
                        <table>
                        <tr>
                            <th>
                                <Typography variant="h5" fontWeight={"800"}>ردیف</Typography>
                            </th>
                            <th>
                                <Typography variant="h5" fontWeight={"800"}>سمت در هیئت بازرسی</Typography>
                            </th>
                            <th>
                                <Typography variant="h5" fontWeight={"800"}>معاونت/یگان</Typography>
                            </th>
                            <th>
                                <Typography variant="h5" fontWeight={"800"}>تخصص</Typography>
                            </th>
                            <th>
                                <Typography variant="h5" fontWeight={"800"}>تعداد</Typography>
                            </th>
                        </tr>
                        {
                            listSkills.map((skill:any, index:number)=>{
                                return (
                                    <tr>
                                        <td>
                                            <Typography variant="h5" fontWeight={"300"}>{index+1}</Typography>
                                        </td>
                                        <td>
                                            <Typography variant="h5" fontWeight={"300"}>{skill?.position}</Typography>
                                        </td>
                                        <td>
                                            <Typography variant="h5" fontWeight={"300"}>{typeof skill.organization === 'number' ? organizations[skill.organization].name : skill.organization}</Typography>
                                        </td>
                                        <td>
                                            <Typography variant="h5" fontWeight={"300"}>{typeof skill.name === 'number' ? skills[skill.name].name : skill.name}</Typography>
                                        </td>
                                        <td>
                                            <Typography variant="h5" fontWeight={"300"}>{skill.number}</Typography>
                                        </td>
                                    </tr>
                                )}
                            )
                        }
                        </table> 
                    </div>
                </Box>
                <Box textAlign={'start'} marginTop={'2%'} marginBottom={'2%'}>
                    <Typography variant="h5" marginBottom={'1%'}>
                        <span style={{fontWeight: "800"}}>{"۳."}</span>
                        {" "}
                        به منظور سرپرستی و هدایت مذکور،
                        <span style={{fontWeight: "800", textDecoration: "underline"}}>{"--"}</span>
                        <span>{"(رئیس اداره عملیات بازرسی و پیگیری)"}</span>
                        {" "}
                        معاونت بازرسی و ایمنی آجا در نظر گرفته شده است.
                    </Typography>
                </Box>
                <Box textAlign={"end"}>
                    <Typography variant="h6">
                    خیلی محرمانه
                    </Typography>
                </Box>
            </Box> */}
      </Box>
    );
  }
);

export default FinalWorkflow;
