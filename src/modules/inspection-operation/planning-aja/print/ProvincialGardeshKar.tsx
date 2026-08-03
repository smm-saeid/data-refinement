import { useMemo } from "react";
import ReactDOMServer from 'react-dom/server';
import { Months, SeasonLabels } from "../types";

const ProvincialGardeshKar = (year, provincesInspection, value) => {
    const table =
        `
              <table>
                  <tr>
                  <th>ردیف</th>
                  <th>استان</th>
                  <th>ملاحظات</th>
                  <th>ماه</th>
                  </tr>
                  ${ReactDOMServer.renderToString(
                    provincesInspection?.map((p: any, index: any) => (
                      <tr key={index}>
                        <td align="center">{index + 1}</td>
                        <td align="center">{p.provinceName || '-'}</td>
                        <td align="center">{SeasonLabels[p.season] || p.season || '-'}</td>
                        <td align="center">{Months.find(i => i.key === p.month)?.label || '-'}</td>
                      </tr>
                    ))
                  )}
      
              </table> `;

    return `
<div class="MuiBox-root muirtl-hpgf8j">
<p style="text-align:center;">بسمه تعالی</p>
<p style="text-align:center;"><img class="image_resized" style="aspect-ratio:485/533;width:7.69%;"
        src="/artesh.jpg" width="485" height="533"></p>
<p style="text-align:center;">فرماندهی کل آجا</p>
<p>از: معاونت بازرسي و ایمنی آجا (اداره عمليات بازرسی و پیگیری - دایره عملیات بازرسی) &nbsp; &nbsp; &nbsp; شماره:
    ${value}</p>
<p>&nbsp;به: امير فرماندهی محترم آجا &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; تاريخ:
    ${year}/10/10</p>
<p>موضوع: طرح پیشنهادی زمان‌بندی و فرآیند اجرای بازدیدهای، بازرسی‌ها &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; پیوست: دارد</p>
<p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; و ارزیابی‌های آمادگی و توان رزمی ف محترم
    کل آجا در سال ${year}</p>
<p style="text-align:center;">&nbsp;</p>
<p style="text-align:center;"><strong>با صلوات برحضرت محمّد(ص) و آل محمّد(ص)</strong></p>
<p style="text-align:center;">«گردشکار»</p>
<p>&nbsp;سلام‌علیکم، با احترام به استحضار مي‌رساند:</p>
<p>&nbsp;الف) طرح موضوع همراه سابقه:&nbsp;</p>
<p>
  بررسی تدابیر متخذه حضرت‌عالی در سیر مراحل تصویب دستورالعمل تکمیلی بازدید‌ها،
  بازرسی‌ها، نظارت‌ها و ارزیابی‌های سال ${year} نشان می‌دهد که تهیه و تدوین یک
  دستورالعمل جامع و تخصصی و بررسی و امکان‌سنجی برای ملاقات با کارکنان و
  خانواده‌های آنان و همچنین افراد نخبه و مسئولین استانی در حوزه اجرای فرایند
  بازدید‌های استانی به عنوان یک سند بالادستی از اهمیت و حساسیت ویژه‌ای در نزد
  شما برخوردار است. (سابقه)
</p>
<p>ب) بررسی و تجزیه و تحلیل:&nbsp;</p>
<p>
  1. این معاونت در نظر دارد ضمن اجرای اوامر صادره و بهره‌گیری از تجربیات سفرهای
  استانی که تاکنون اجرا شده است نسبت به تهیه یک دستورالعمل جامع و کامل اقدام
  نماید. با عنایت به زمان‌بر بودن اجرای به نحو احسن این مهم و جهت‌دار نمودن
  اقدامات جاری، معاونت بازرسی و ایمنی آجا برنامه مدنظر جهت اجرای بازدید‌های
  استانی تا تصویب دستورالعمل تکمیلی بازدید‌ها، بازرسی‌ها، نظارت‌ها و ارزیابی‌های
  سال ${year} را به شرح ذیل ارائه می‌نماید.&nbsp;
</p>
<p>
  2. تاکنون بازرسی و ارزیابی میدانی (پیش‌بازدید) این معاونت به شرح ذیل اجرا شده
  است.
</p>
<p>&nbsp;</p>
<p>
  3. برنامه پیشنهادی معاونت بازرسی و ایمنی آجا جهت اجرای بازدید از استان‌هایی که
  بازرسی و ارزیابی‌های میدانی آن‌ها (پیش‌بازدید) اجرایی شده است، به شرح ذیل
  ارائه می‌گردد.
</p>
<p>
  4. معاونت‌ها بازرسی و ایمنی آجا جهت اجرای اوامر صادره، اجرای بازرسی و
  ارزیابی‌های میدانی آتی (پیش‌بازدید) از استان‌های مد نظر را با اولویت های ذیل
  در دستور کار خود قرار داده است.
</p>
<p>&nbsp;</p>

${table}

<p>پ) نتیجه‌گیری:&nbsp;</p>
<p>
  با توجه به تجربیات به دست آمده از اجرای بازدیدهای استانی حضرت‌عالی، جلسات
  جمع‌بندی نتایج بازرسی‌ها در حضور امیر ریاست محترم ستاد و معاون هماهنگ‌کننده
  آجا و همچنین بازرسی‌ها و ارزیابی‌های میدانی(پیش‌بازدید) این معاونت، مشخص نمودن
  اولویت بندی بازدیدهای استانی نقش به‌سزایی در برنامه‌ریزی و اثربخش نمودن اجرای
  این فرایند ایفاء می‌نماید.
</p>
<p style="text-align: center">&nbsp;" پیشنهادها "</p>
<p>
  &nbsp;با عنايت به موارد معروضِ فوق استدعا دارد، در صورت تصويب مقرّر فرمايند:
</p>
<p>
  1. اولویت‌بندی مد نظر بازدید‌های استانی حضرتعالی از بین استان‌هایی که بازرسی و
  ارزیابی میدانی(پیش‌بازدید) آن‌ها اجرا شده است با توجه به راه‌کارهای ارائه شده،
  مشخص گردد.&nbsp;
</p>
<p>
  2. با توجه به برنامه‌های آتی حضرت‌عالی، اولویت بندی استان‌های ارائه شده جهت
  اجرای بازرسی و ارزیابی میدانی(پیش‌بازدید) با محوریت این معاونت تعیین
  گردد.&nbsp;
</p>
<p>3. هرگونه اقدام منوط به اوامر عالیست.&nbsp;</p>
<p>&nbsp;</p>
<p>&nbsp;</p>
<p>&nbsp;</p>
<p style="text-align: left">
  معاون بازرسی و ایمنی آجا ـ سرتیپ ستاد ابوالفضل سپهری‌راد &nbsp; &nbsp; &nbsp;
  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
  &nbsp; &nbsp; &nbsp; &nbsp;
</p>
<p>&nbsp;</p>
<p>&nbsp;</p>
<p>&nbsp;اوامر امير فرماندهی محترم کل ارتش جمهوری اسلامی ایران:</p>
<p>&nbsp;</p>
<p>&nbsp;</p>
<p>&nbsp;</p>
<p>&nbsp;</p>
<p>&nbsp;نظريه امیر جانشين محترم فرماندهی کل آجا:</p>
<p style="text-align: justify">&nbsp;</p>
<p style="text-align: justify">&nbsp;</p>
<p style="text-align: justify">&nbsp;</p>
<p style="text-align: justify">&nbsp;</p>
<p style="text-align: justify">&nbsp;</p>
</div>
`;
}

export default ProvincialGardeshKar;