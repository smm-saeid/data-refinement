import '@/modules/inspection-operation/planning-aja/styles/print.css';
import type { AnnualPlanningOrganization } from '@/modules/inspection-operation/types.ts';

type Props = {
  totalInspection: number;
  systematic: number;
  gheireMoteraghebeh: number;
  peigiri: number;
  nezaratsetadi: number;
  khodArzyabi: number;
  rastiAzmayiYear: number;
  rastiAzmayi: number;
  moavenBazrasi: number;
  year: number;
  tableData: any;
  recieverForces: any;
  AJA: boolean;
  value: string;
};
// ${props.totalInspection}
export function DastoorolAmal(props: Props) {
  const types = [
    'BARNAMEI_SYSTEMATIC',
    'PEYGIRI_BAZRASI',
    'KHOD_ARZYABI',
    'RASTY_AZMAIE',
    'GHEIRE_MOTERAGHEBEH',
    'NEZARAT_SETADI',
    'ARZYABI_MOAVEN_BAZRASI',
    'BAZRASI_BANA_BE_DASTOOR',

    'SAYER',
  ];
  const data = {
    BARNAMEI_SYSTEMATIC: props.tableData?.inspectionType?.find(
      item => item.key === types[0]
    ),
    PEYGIRI_BAZRASI: props.tableData?.inspectionType?.find(
      item => item.key === types[1]
    ),
    KHOD_ARZYABI: props.tableData?.inspectionType?.find(
      item => item.key === types[2]
    ),
    RASTY_AZMAIE: props.tableData?.inspectionType?.find(
      item => item.key === types[3]
    ),
    GHEIRE_MOTERAGHEBEH: props.tableData?.inspectionType?.find(
      item => item.key === types[4]
    ),
    NEZARAT_SETADI: props.tableData?.inspectionType?.find(
      item => item.key === types[5]
    ),
    ARZYABI_MOAVEN_BAZRASI: props.tableData?.inspectionType?.find(
      item => item.key === types[6]
    ),
    BAZRASI_BANA_BE_DASTOOR: props.tableData?.inspectionType?.find(
      item => item.key === types[7]
    ),
  };
  const forces = Array.isArray(props.recieverForces)
    ? props.recieverForces
    : [];

  return `
        <div class="MuiBox-root muirtl-hpgf8j">
            <p>از: آجا (<strong>معاونت بازرسی و ایمنی ـ اداره عملیات بازرسی و
                    پیگیری)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp; &nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;</strong>شماره: &nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp; &nbsp;${props?.value}</p>
            <p>به:‌ گيرندگان
                زیر&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp; &nbsp; &nbsp;&nbsp; تاريخ:&nbsp;&nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp; &nbsp;${props.year}/10/10</p>
            <p>موضوع: ‌‌دستورالعمل <strong>بازرسی‌ها، نظارت‌های ستادی و ارزیابی‌های سال
                    ${props.year}</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; پيوست: &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;دارد</p>
            <p style="text-align:center;">&nbsp;</p>
            <p style="text-align: center">با صلوات بر حضرت محمد(ص) و آل محمد(ص)</p>
            <p style="text-align: justify"><strong>سلام‌علیکم</strong></p>
            <p style="text-align: justify">&nbsp;</p>
            <p style="text-align: justify">
                <strong>1-&nbsp;</strong><span style="color: black"><strong>کلیات:</strong></span>
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(33, 88, 104)"><strong>الف-</strong></span> در راستای شرح وظایف سازمانی، مأموریت و تدابیر
                ابلاغی؛ معاونت بازرسی و ایمنی آجا با در نظر گرفتن برنامه سالیانه نیروها و یگان‌های تابعه ستاد آجا، باهدف نظارت دقیق
                و کامل، انعکاس صحیح نتایج عملکرد و در صورت لزوم
                <span style="color: rgb(152, 72, 6)"><strong>پیشنهاد اصلاح عملکرد</strong></span> با شعار
                <span style="color: rgb(192, 0, 0)"
                ><strong>دقت در بررسی، انصاف در رسیدگی و داوری و دقت در امانت‌داری</strong> </span
                >اقدام به اصلاح روش‌ها، روال‌ها و فرآیندها با<span style="color: rgb(152, 72, 6)"
                ><strong> تجمیع و متمرکز سازی حداکثری بازرسی‌ها در سطح آجا</strong></span
                >، هماهنگ با سایر معاونت‌های ستاد آجا <span style="color: rgb(152, 72, 6)"><strong>برنامه‌ریزی</strong></span> نموده
                است.
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(33, 88, 104)"><strong>ب-</strong></span> در راستای ایجاد وحدت رویه با لحاظ شاخص‌های
                <span style="color: rgb(152, 72, 6)"><strong>میزان عملکرد و اثربخشی عملکرد</strong></span
                ><span style="color: rgb(192, 0, 0)"><strong> </strong></span>جهت سنجش
                <span style="color: rgb(152, 72, 6)"><strong>سطح بهره‌وری</strong></span
                >، با نمره‌دهی از طریق بازبینه‌ها و احصاء محاسن و نارسایی‌ها (معایب و نواقص)، زمینه علمی‌تر شدن بازرسی‌ها فراهم
                گردیده است.
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(33, 88, 104)"><strong>پ-</strong></span> در سال ${props.year ?? '14--'} تعدادی از یگان‌های آجا مورد بازرسی،
                نظارت و ارزیابی قرار می‌گیرند و طرح‌ریزی بازرسی‌های یگان‌های عمده آجا با ارزیابی مؤلفه‌های آمادگی رزمی در حوزه‌های:
                <span style="color: rgb(36, 64, 97)"
                ><strong
                    >نیروی انسانی، آماد و پش، اطلاعات و حفاظت فیزیکی، تربیت و آموزش، عملیات، فاوا، جنگ‌های نو پدید، بهداشت و درمان،
                    تربیت‌بدنی، امور تحقیقات و پژوهش، طرح و برنامه و سازمان،&nbsp; امور مالی و بودجه و اعتبارات، مهندسی دفاعی و
                    پدافند غیرعامل، حفظ آثار و ارزش‌های دفاع مقدس، فرماندهی و مدیریت، امور اشراف، بررسی وضعیت زیست و اماکن
                    رفاهی،&nbsp; نظارت و ارزیابی از میزان تحقق تدابیر و مصوبات ابلاغی، شناسایی علل نارسائی‌ها و تنگناهای عمده
                    یگان‌ها در راستای اجرای مأموریت‌های واگذاری، ارزیابی و ارزشیابی عملکرد فرماندهان، رؤسا و مدیران عالی آجا، حوزه
                    حفاظتی، امنیتی و ایمنی، حوزه صیانت کارکنان پایور و وظیفه، اقدامات پیشگیری از جرائم، تخلفات و نظارت بر امور
                    سربازان
                </strong></span
                >صورت خواهد گرفت.
            </p>
            <p style="text-align: justify">
                <strong>1.</strong><span style="color: black"><strong>منظور:</strong></span>
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(33, 88, 104)"><strong>الف-</strong></span> سنجش ميزان بهره‌وری یگان‌ها با مشخص نمودن وضع
                موجود و مقايسه آن با سطح مطلوب و تعیین نقاط قوت و ضعف و انحراف احتمالی در اجرای اهداف، برنامه‌ها و روش‌های
                استاندارد.
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(33, 88, 104)"><strong>ب-</strong></span> ارزيابي عملکرد فرماندهان، رؤسا، مديران و شناسایی
                كاركنان قابل رشد
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(33, 88, 104)"><strong>پ-</strong></span> ارتقاء سطح بهره‌وری، اثربخشی اقدامات و پویایی فردی
                و سازمانی
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(33, 88, 104)"><strong>ت-</strong></span> ارزیابی میزان تلاش یگان‌ها در راستای ارتقاء توان
                رزم
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(33, 88, 104)"><strong>ث-</strong></span> ارائه راه­کار و پیشنهادهای مؤثر، کارآمد و میان­بُر
                در جهت رفع نارسایی‌ها
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(33, 88, 104)"><strong>ج-</strong></span> حصول اطمینان از اجرای تدابیر، مصوبات و رفع
                نارسایی‌ها (معایب و نواقص) از طریق بررسی اسنادی و اتقان عملکرد یگان‌ها در بازرسی‌های میدانی جهت حرکت به سمت اثرگذاری
                مطلوب بازرسی­ها
            </p>
            <p style="text-align: justify">
                <strong>2.</strong><span style="color: black"><strong>اهداف:</strong></span>
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(33, 88, 104)"><strong>الف-</strong></span
                ><span style="color: red"><strong> </strong></span>وحدت رویه و هماهنگی در راهبری و هدایت عملیات بازرسی در سطح بازرسی
                و ایمنی نیروها و یگان‌های تابعه ستاد آجا در فرآیند انجام انواع بازرسی‌ها، نظارت‌ها و ارزیابی‌ها
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(33, 88, 104)"><strong>ب- </strong></span>جهت‌دهی برنامه و فعالیت‌های بازرسی و ایمنی بر مبنای
                سیاست کلی بازرسی &nbsp;و ایمنی و منطبق بر شرح وظایف سازمانی
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(33, 88, 104)"><strong>پ-</strong></span
                ><span style="color: red"><strong> </strong></span>ارزیابی اقدامات یگان‌ها در راستای تدابیر، اهداف و برنامه­های
                راهبردی فرماندهی کل آجا
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(33, 88, 104)"><strong>ت-</strong></span
                ><span style="color: red"><strong> </strong></span>انطباق عملکرد فردی و یگانی با شرح وظایف سازمانی
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(33, 88, 104)"><strong>ث- </strong></span>بازرسی و&nbsp; ارزیابی و حصول اطمینان از تداوم
                آمادگی رزمی و توان عملیاتی یگان‌های آجا در راستای ارزیابی نحوه اجرای بخش‌هایی از طرح‌های عملیاتی بر مبنای مأموریت،
                شرح وظایف و میزان پیشرفت اهداف و برنامه‌ها، دستورالعمل‌ها، بخشنامه‌ها، فرامین و تدابیر ابلاغی
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(33, 88, 104)"><strong>ج- </strong></span>نظارت بر اجراي صحيح شرح وظايف، مأموريت­ها، ‌مقررات،
                دستورالعمل‌ها، بخشنامه‌ها، فرامین و تدابیر ابلاغی و حصول اطمینان از تحقق آن
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(33, 88, 104)"><strong>چ- </strong></span>ارتقاء بهره‌وری و افزایش انگیزه بیشتر فرماندهان و
                کارکنان یگان‌ها براي حرکت تحول‌زا و پويا به‌منظور حفظ و ارتقاء آمادگي رزمي و توان عملیاتی
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(33, 88, 104)"><strong>ح- </strong></span>ارزیابی اقدامات یگان در راستای انجام جهاد علمی،
                تحقیق و پژوهش (صنعتی و غیرصنعتی) در راستای بهینه‌سازی و ارتقاء سلاح، تجهیزات، سامانه‌ها و روش‌ها به‌منظور نیل به
                خودکفائی
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(33, 88, 104)"><strong>خ-</strong></span> ارزیابی میزان اهتمام فرماندهان و رده‌های ستادی جهت
                رفع نارسایی‌ها (معایب و نواقص) مشهودِ و تحقق مصوبات نتایج بازرسی‌های انجام شده و ریشه‌یابی علل احتمالی عدم‌ رفع
                نارسایی‌ها (معایب و نواقص) و چاره‌جویی در راستای مرتفع سازی آن‌ها با تعیین مهلت زمانی مشخص و پرهیز از تکرار این قبیل
                مشکلات در سطح یگان‌ها
            </p>
            <p style="text-align: justify">
                <strong>3. </strong><span style="color: black"><strong>اجرا:</strong></span>
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(152, 72, 6)"><strong>الف- </strong></span><strong>تدبیر:</strong>
            </p>
            <p style="text-align: justify">
                1) یکی از وظایف مهم بازرسی‌ها نظارت بر اجرای دستوراتی است که از هر مصدری به هر معاونتی صادر می‌گردد. در مورد آنچه
                خودش اعلام می‌کند به طریق اولی باید نظارت شود.
            </p>
            <p style="text-align: justify">
                2) اجرای بازرسی‌ها با نگاه اصلاحی و با هدف رفع نارسایی‌ها(معایب و نواقص) در محل اجرا خواهد گردید.
            </p>
            <p style="text-align: justify">
                <strong>- آن دسته از نارسایی‌ها (معایب و نواقص) که قابلیت رفع در محل را دارد مرتفع و در گزارش منظور گردد.</strong>
            </p>
            <p style="text-align: justify">
                <strong
                >- آن دسته از نارسایی‌ها (معایب و نواقص) که نیاز به بازه زمانی جهت مرتفع شدن دارد، در قالب توافقات مدت‌دار منظور و
                در چرخه پیگیری قرار گیرد.</strong
                >
            </p>
            <p style="text-align: justify">
                3) تلاش فرماندهان و مسئولین آجا در به حداقل رساندن کوتاهی‌ها در یگان‌های تحت امر به‌عنوان یک ارزش مورد تأکید
                فرماندهی معظم کل قوا(مدظله‌العالی) توسط مبادی ذی‌ربط آجا مورد تبیین قرار گیرد و به‌عنوان یکی از شاخص‌های فرماندهی
                مطلوب لحاظ گردد.
            </p>
            <p style="text-align: justify">
                4) برخورد جدی با حوادث و سوانح مهم در یگان‌های آجا که کوتاهی‌ها در بروز آن نقش تعیین‌کننده‌ای داشته‌اند به‌صورت
                مستمر در دستور کار مبادی ذی‌ربط آجا قرار داشته باشد و در کلیه حوزه‌های نظارتی و بازرسی برخورد جدی و بدون اغماض
                انضباطی و قانونی با کوتاهی‌ها و قصورهای احتمالی انجام گردد.
            </p>
            <p style="text-align: justify">
                5) با توجه به انتقال دبیری نظارت عالی ستادی و ارزیابی استان‌ها به بازرسی و ایمنی ستاد کل ن.م از سال 1404، راهبری
                نظارت عالی ستادی در آجا با محوریت معاونت بازرسی و ایمنی آجا و مشارکت معاونت‌ها، سازمان‌ها و اداره‌های ستاد آجا صورت
                می‌پذیرد.
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(152, 72, 6)"><strong>ب ـ</strong></span
                ><span style="color: rgb(33, 88, 104)"><strong> </strong></span
                ><strong>یگان‌های منتخب جهت اجرای بازرسی‌‌ها، نظارت‌ها و ارزیابی‌ها:</strong>
            </p>
            <p style="text-align: justify">
                1) بازرسی­ها، نظارت‌ها و ارزیابی‌ها به‌صورت <strong>متمرکز</strong> با محوریت معاونت بازرسی و ایمنی آجا از
                <span style="color: rgb(192, 0, 0)"><strong>${props?.totalInspection ?? '--'} </strong></span>یگان آجا با اعزام هیئت/ تیم بازرسی برابر
                <span style="color: rgb(192, 0, 0)"><strong>(پیوست الف) </strong></span>به شرح زیر اجرا می­گردد:
            </p>
            <p style="text-align: justify">
                <strong>-</strong>بازرسی‌های برنامه‌ای(سیستماتیک) از
                <span style="color: rgb(192, 0, 0)"><strong>${data?.BARNAMEI_SYSTEMATIC?.number ?? '--'}</strong></span> یگان
            </p>
            <p style="text-align: justify">
                <strong>-</strong>بازرسی‌های غیرمترقبه از <span style="color: rgb(192, 0, 0)"><strong>${data?.GHEIRE_MOTERAGHEBEH?.number ?? '--'}</strong></span> یگان
            </p>
            <p style="text-align: justify">
                <strong>-</strong>بازرسی‌های پیگیری از <span style="color: rgb(192, 0, 0)"><strong>${data?.PEYGIRI_BAZRASI?.number ?? '--'}</strong></span> یگان
            </p>
            <p style="text-align: justify">
                <strong>-</strong>نظارت‌ ستادی از <span style="color: rgb(192, 0, 0)"><strong>${data?.NEZARAT_SETADI?.number ?? '--'}</strong></span> یگان
            </p>
            <p style="text-align: justify">
                <strong>-</strong>بازرسی و ارزیابی معاون بازرسی و ایمنی آجا از یگان‌های آجا مستقر در
                <span style="color: rgb(192, 0, 0)"><strong>?</strong></span> استان
            </p>
            <p style="text-align: justify">
                <strong>-</strong>بازرسی برنامه‌ای به روش خودارزیابی با نظارت سلسله‌مراتب سازمانی از
                <span style="color: rgb(192, 0, 0)"><strong>${data?.KHOD_ARZYABI?.number ?? '--'}</strong></span> یگان‌های عمده
                <span style="color: rgb(36, 64, 97)"><strong>(نزاجا </strong></span
                ><span style="color: rgb(192, 0, 0)"><strong>${data?.KHOD_ARZYABI?.organizations?.find((org: AnnualPlanningOrganization) => org.key === 'nezaja')?.number ?? '--'}</strong></span
                ><span style="color: rgb(36, 64, 97)"><strong> ، نپاجا </strong></span
                ><span style="color: rgb(192, 0, 0)"><strong>${data?.KHOD_ARZYABI?.organizations?.find((org: AnnualPlanningOrganization) => org.key === 'nepaja')?.number ?? '--'}</strong></span
                ><span style="color: rgb(36, 64, 97)"><strong>، نهاجا </strong></span
                ><span style="color: rgb(192, 0, 0)"><strong>${data?.KHOD_ARZYABI?.organizations?.find((org: AnnualPlanningOrganization) => org.key === 'nehaja')?.number ?? '--'}</strong></span
                ><span style="color: rgb(36, 64, 97)"><strong> ، نداجا </strong></span
                ><span style="color: rgb(192, 0, 0)"><strong>${data?.KHOD_ARZYABI?.organizations?.find((org: AnnualPlanningOrganization) => org.key === 'nedaja')?.number ?? '--'}</strong></span
                ><span style="color: rgb(36, 64, 97)"><strong> و ستاد آجا </strong></span
                ><span style="color: rgb(192, 0, 0)"><strong>${data?.KHOD_ARZYABI?.organizations?.find((org: AnnualPlanningOrganization) => org.key === 'sayer')?.number ?? '--'}</strong></span
                ><span style="color: rgb(36, 64, 97)"><strong>)</strong></span
                ><strong> </strong>توسط بازرسی و ایمنی نیروها و هدایت ستادی معاونت بازرسی و ایمنی آجا اجرا و نتایج حاصله در قالب
                کتابچه نتیجه بازرسی و لوح فشرده گزارش‌گیری می‌گردد.
            </p>
            <p style="text-align: justify">
                <strong>-</strong>به‌منظور اتقان عملکرد در زمینه بازرسی برنامه‌ای به روش خودارزیابی نیروها به‌صورت تصادفی تعداد
                <span style="color: rgb(192, 0, 0)"><strong>6</strong></span> یگان (سال 1403) مورد بازرسی راستی‌آزمایی قرار
                می‌گیرند.
            </p>
            <p style="text-align: justify">
                <strong>-</strong>بازرسی‌های تجمیعی حوزه ایمنی، ارزشیابی و صیانت از کارکنان از
                <span style="color: rgb(192, 0, 0)"><strong>?</strong></span> استان (<span style="color: rgb(192, 0, 0)"
                ><strong>40</strong></span
                >
                یگان)
            </p>
            <p style="text-align: justify">
                2) نظارت عالی ستادی ستاد کل نیروهای مسلح از <span style="color: rgb(192, 0, 0)"><strong>?</strong></span>استان
                سیستان و بلوچستان و خراسان جنوبی با راهبری ستادی معاونت بازرسی و ایمنی آجا و مشارکت معاونت‌های ستاد آجا اجرا
                می‌گردد.
            </p>
            <p style="text-align: justify">
                3) هم‌زمان در قالب بازرسی‌های برنامه‌ای (سیستماتیک) و غیرمترقبه، نظارت بر حوزه‌های ایمنی و صیانت کارکنان عندالزوم
                انجام خواهد شد.
            </p>
            <p style="text-align: justify">
                4) بازرسی‌های و ارزیابی‌های حوزه ایمنی، ارزشیابی و صیانت کارکنان به صورت تجمیعی
                <span style="color: rgb(0, 32, 96)"
                >(ارزشیابی عملکرد مدیران آجا، ویژه ایمنی، حوزه صیانت کارکنان پایور و وظیفه، اقدامات پیشگیری از جرائم و تخلفات و
                نظارت بر امور سربازان) </span
                >انجام خواهد شد.
            </p>
            <p style="text-align: justify">
                5)&nbsp; بازرسی‌های بنا به دستور در قالب تیم‌های ویژه (اصلاح الگوی مصرف، حمایت از کالای ایرانی و اقتصاد مقاومتی،
                نظارت بر دستورالعمل مبارزه با قاچاق کالا، بازرسی از اردوگاه‌های تابستانی دانشگاه‌های افسری آجا، وضعیت افطاری و سحری
                در ماه مبارک رمضان و بازرسی از استراحتگاه­ها و زائرسراها در ایام تعطیلات نوروز و تابستان و...) انجام می‌گردد.
            </p>
            <p style="text-align: justify">
                6) بازرسی و ارزیابی و حصول اطمینان از تداوم آمادگی رزمی و توان عملیاتی یگان‌های آجا در راستای ارزیابی نحوه اجرای
                طرح‌های عملیاتی و همچنین اطمینان از کفایت طرح‌های موجود با مقایسه وضع موجود و مطلوب بر مبنای مأموریت، شرح وظایف و
                میزان پیشرفت اهداف و برنامه‌ها و تدابیر ابلاغی در طول سال توسط معاون بازرسی و ایمنی آجا به‌صورت (غیرمترقبه) انجام
                خواهد گردید.
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(152, 72, 6)"><strong>پ ـ</strong></span> &nbsp;<strong>شروع و خاتمه بازرسي:</strong>
            </p>
            <p style="text-align: justify">
                1)&nbsp; پس از ابلاغ دستورالعمل تکمیلی به نيروها و یگان‌های تابعه ستاد آجا، توسط معاونت­ بازرسی و ایمنی آجا،
                بازرسي‌ها، نظارت‌ها و ارزیابی‌ها از يگان­هاي منتخب آجا برابر برنامه زمان‌بندی از ابتدای سال 1404 با در نظر گرفتن
                ملاحظات مؤثر در اجرا صورت خواهد پذیرفت.
            </p>
            <p style="text-align: justify">2) بازرسی‌های غیرمترقبه 24 قبل از اجرا به رده بازرسی‌شونده ابلاغ می‌گردد.</p>
            <p style="text-align: justify">3) بازرسی‌های غیرمرقبه خاص بدون اطلاع قبلی و کاملاً سرزده ابلاغ می‌گردد.</p>
            <p style="text-align: justify">
                <span style="color: rgb(152, 72, 6)"><strong>ت ـ</strong></span
                ><strong> تركيب هيئت/تیم بازرسي‌ها، نظارت‌ها و ارزیابی‌ها:</strong>
            </p>
            <p style="text-align: justify">
                1) ترکيب هيئت/ تیم بازرسي‌ها، نظارت‌ها و ارزیابی‌ها، با انتخاب بازرسان از افسران شاخص، باتجربه و متخصص و صاحب‌نظر
                ترجیحاً ‌از بین مدیران و افسران ارشد با درجه سرهنگی و کارمندان هم‌تراز (جایگاه 18 یا 17) در حوزه تخصصی معاونت‌ها/
                سازمان‌ها/ اداره‌ها و یگان‌های تابعه ستاد آجا و عندالزوم نیروها با بهره‌گیری از بانک اطلاعات بازرسان غیرسازمانی در
                اختیار معاونت بازرسی و ایمنی آجا قرار خواهد گرفت.
            </p>
            <p style="text-align: justify">
                2) ارزیابی بازرسان منتخب معاونت‌ها/ سازمان‌ها/ اداره‌ها و یگان‌های تابعه و نیروها پس از خاتمه مأموریت بازرسی در
                اولویت بوده و هر یک از بازرسان با بازبینه تنظیمی مورد ارزیابی انفرادی (انضباط، میزان دانش تخصصی، رفتار و منش نظامی،
                نحوه تنظیم گزارش و شایستگی‌های کلی در انجام بازرسی) واقع و بر مبنای (<span style="color: rgb(33, 88, 104)"
                ><strong>ممتاز، عالی، خوب، متوسط، ضعیف </strong></span
                >و ذکر نظریه توصیفی) &nbsp;با نظر رئیس هیئت/ تیم طبقه‌بندی می‌گردند و تشویقات و تنبیهات، نتایج مربوطه به نیروها/
                معاونت‌ها/ سازمان‌ها/ اداره‌ها اعلام و همچنین در سامانه ارزشیابی معاونت بازرسی و ایمنی آجا ثبت و در روند انتصابات و
                رشد و تعالی کارکنان مؤثر خواهد بود.
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(152, 72, 6)"><strong>ث ـ</strong></span
                ><strong> نحوه اجرا و حدود بازرسي‌ها:</strong>
            </p>
            <p style="text-align: justify">
                1) فرآیند اجرای بازرسی برنامه‌ای (نحوه تنظیم بازبینه‌ها و روش نمره‌دهی و گزارش‌نویسی) منطبق بر شیوه‌نامه عملیات
                بازرسی <span style="color: rgb(192, 0, 0)"><strong>(پیوست ب)</strong></span> صورت می‌پذیرد.
            </p>
            <p style="text-align: justify">
                2) كليه قسمت‌ها و يگان­ها توسط هیئت‌ها/ تيم­هاي بازرسي‌ برابر بازبينه‌ها که بر مبنای ساختار سازمانی، مأموریت، شرح
                وظایف و روش جاري يگان تنظیم شده، با در نظر گرفتن سایر مؤلفه­ها به شرح ذیل مورد بازرسي قرار می‌گیرند:
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(33, 88, 104)"><strong>(الف) </strong></span>نمرات دريافتي كاركنان و يگان­ها بر اساس
                بازبينه­هاي تنظيمي با شاخصه‌های عملکرد و اثربخشی برای تعیین سطح بهره‌وری
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(33, 88, 104)"><strong>(ب)</strong></span> نمرات دريافتي در تيراندازي با سلاح‌های انفرادي و
                اجتماعي
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(33, 88, 104)"><strong>(پ)</strong></span> نمرات دریافتی آزمون دانش نظامی کارکنان پایور منتخب
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(33, 88, 104)"><strong>(ت) </strong></span>وضعيت آمادگي يگان­ها در اجراي طرح­هاي مختلف از
                جمله آماده‌باش‌ها، بليات، پدافند غیرعامل و ...
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(33, 88, 104)"><strong>(ث)</strong></span> ارزیابی فرآیند اقدامات رده‌های ستادی در زمینه
                بهبود روش‌ها و اصلاح عملکرد
            </p>
            <p style="text-align: justify">3) حدود بازرسي‌ها علاوه بر بازبینه‌های تنظيمي در قالب گزارشات مستقل:</p>
            <p style="text-align: justify">
                <span style="color: rgb(33, 88, 104)"><strong>(الف)</strong></span> بررسی اقدامات انجام‌شده یگان در خصوص فرمان
                نورانی مقام معظّم رهبری و فرمانده کل قوا (مدظله‌العالی) مبنی بر جهاد تبیین (انقلاب شکوهمند اسلامی و برکات نظام مقدس
                جمهوری اسلامی ایران)
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(33, 88, 104)"><strong>(ب) </strong></span>نظارت بر میزان اهتمام فرماندهان به جوان‌گرایی و
                همتا پروری و رشد و تعالی کارکنان
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(33, 88, 104)"><strong>(پ) </strong></span>بررسی و ارائه اقدامات انجام‌شده یگان در راستای
                پیشرفت اهداف عملیاتی بر اساس برنامه­های پیش‌بینی‌شده و مصوب
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(33, 88, 104)"><strong>(ت) </strong></span>ارزیابی فعالیت‌های يگان جهت افزايش سطح انضباط و
                انجام اقدامات پیشگیرانه در راستای کاهش جرائم و تخلفات
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(33, 88, 104)"><strong>(ث)</strong></span> بررسي و ارزیابی فعالیت‌های يگان در راستای پیگیری
                روند پیشرفت تقویت حوزه ایمنی و اقدامات پيشگيرانه جهت كاهش سوانح و حوادث، رویدادها (زميني، هوايي، دريايي، سامانه‌های
                پدافندی) و خسارات ناشي از آن و توسعه فرهنگ ایمنی
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(33, 88, 104)"><strong>(ج) </strong></span>بررسي فعالیت يگان در جهت پيشرفت آموزش و به‌کارگیری
                شيوه­هاي نوین و صحيح در راستاي كيفي نمودن آموزش‌ها
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(33, 88, 104)"><strong>(چ) </strong></span>بررسي فعالیت يگان در امور نگهداري و تعمیر و كاهش
                آمار اقلام و تجهيزات تعميراتي
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(33, 88, 104)"><strong>(ح)</strong></span> بررسي ميزان فعالیت یگان جهت حفظ و نگهداري اراضي و
                ‌املاك و همچنین رفع کهنه‌زدایی از اماکن و تأسیسات
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(33, 88, 104)"><strong>(خ)</strong></span> ارزیابی وضعيت امور مالي و ميـزان فعالیت یگان در
                زمينه كسب درآمدها و چگونگي هزينه­ها در جهـت رفـع مشـكلات، بدون خدشه‌دار شدن مأموريت یگان وفق دستورالعمل­های ابلاغی و
                رعایت انضباط مالی
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(33, 88, 104)"><strong>(د) </strong></span>ارزیابی وضعیت یگان ازنظر امور پادگانی (زیست، خدمات
                رفاهی و ...) و اقدامات در زمینه خوش‌بین‌سازی محیط خدمتی و صیانت کارکنان وظیفه و پایور
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(33, 88, 104)"><strong>(ذ) </strong></span>بررسي وضعيت يگان از نظر ميزان افزايش انگيزه­هاي
                خدمتي كاركنان و روند اجرای طرح حکمت
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(33, 88, 104)"><strong>(ر)</strong></span> ارزیابی اقدامات انجام‌شده در جهت ترویج و تقویت
                فرهنگ جهاد، مقاومت، ایثار و شهادت نسبت به بزرگداشت و تکریم خانواده شهدا، جانبازان و پیشکسوتان دفاع مقدس
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(33, 88, 104)"><strong>(ز)</strong></span> بررسی روند اقدامات یگان در راستای جلوگیری از
                فراموشی و تحریف وقایع دفاع مقدس و تهیه کارنامه دفاع مقدس یگان و نحوه تعامل و هم‌افزایی با سازمان حفظ آثار و ارزش‌های
                دفاع مقدس
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(33, 88, 104)"><strong>(ژ)</strong></span> ارزیابی اقدامات یگان در راستای پرهیز از اقدامات و
                تظاهرات اشرافی‌گرانه، رعایت سادگی و زیبایی، صرفه‌جویی در پذیرایی جلسات و همایش‌ها، عدم استفاده از تجهیزات و لوازم
                گران‌قیمت یا زینتی غیرمتعارف در دفاتر کار و اماکن نظامی، عدم برگزاری همایش‌های غیرضروری و مأموریت‌های غیر لازم
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(33, 88, 104)"><strong>(س) </strong></span>ارزیابی اقدامات یگان در راستای عدم استفاده از
                اعتبارات خوراک و اقلام برنامه غذایی در موارد غیر مرتبط نظیر اهداء بسته به کارکنان و خانواده‌ها، سربازان و مراسم
                مختلف
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(33, 88, 104)"><strong>(ش) </strong></span>بررسی اقدامات یگان‌ها در راستای اجرای دستورالعمل
                اقدامات مشترک ن.م در تشدید مقابله با قاچاق کالا
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(33, 88, 104)"><strong>(ص) </strong></span>بررسی اقدامات یگان در زمینه نتایج ابلاغی
                بازرسی‌های اجرا شده از وضعیت امنیتی، ایمنی و حفاظت فیزیکی پایگاه‌های هوایی و همچنین دیگر مراکز مهم دفاعی آجا
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(33, 88, 104)"><strong>(ض)</strong></span> میزان بهره‌گیری از نخبگان در راستای دستیابی به
                سامانه‌های فناورانه هوشمند
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(33, 88, 104)"><strong>(ط)</strong></span> ارزیابی عملکرد تعاونی‌های مسکن و وضعیت منازل
                سازمانی یگان‌های تابعه آجا
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(152, 72, 6)"><strong>ج-</strong></span
                ><strong> وظایف نيروها:</strong>
            </p>
            <p style="text-align: justify"><strong>1)&nbsp; نزاجا:</strong></p>
            <p style="text-align: justify">
                <span style="color: rgb(33, 88, 104)"><strong>الف)</strong></span> طرح بازرسي‌هاي سال 1404 نيرو را با لحاظ این
                دستورالعمل تدوين و یک نسخه به معاونت بازرسی و ایمنی آجا ارسال نمايند.
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(33, 88, 104)"><strong>ب)</strong></span> پس از دریافت دستورالعمل‌های اجرایی، مراتب را به
                یگان‌های تابعه ابلاغ و هنگام مراجعه هیئت/ تیم بازرسی به محل استقرار یگان‌های بازرسی‌شونده، همکاری لازم را به شرح
                مفاد ابلاغی معمول نماييد.
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(33, 88, 104)"><strong>پ)</strong></span> راهبری نظارت عالی ستادی در آجا با محوریت معاونت
                بازرسی و ایمنی آجا صورت می‌پذیرد، معاونت‌ها/ سازمان‌ها و اداره‌های ستاد نیرو پس از دریافت دستورالعمل تکمیلی نظارت
                عالی ستادی(یگان‌های آجا مستقر دراستان های سیستان و بلوچستان و خراسان جنوبی) همکاری و هم‌افزایی لازم را با معاونت های
                تخصصی هموند ستاد آجا و معاونت بازرسی و ایمنی آجا داشته باشند.
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(33, 88, 104)"><strong>ت)</strong></span> بازرسی‌ها و نظارت‌های ستادی به روش خودارزیابی با
                نظارت سلسله‌مراتب سازمانی برابر <span style="color: rgb(192, 0, 0)"><strong>(پیوست پ)</strong> </span>و به شرح زیر
                اجرا شود:
            </p>
            <p style="text-align: justify">
                (1)&nbsp; اجرای بازرسی خودارزیابی از یگان‌های منتخب برابر برنامه زمان‌بندی مندرج در
                <span style="color: rgb(192, 0, 0)"><strong>ضمیمه 1 پیوست پ</strong> </span>انجام می‌گردد.
            </p>
            <p style="text-align: justify">
                (2) توجیه رؤسای بازرسی یگان­های بازرسی­شونده، مدیران عملیات بازرسی و پیگیری نیروها و کارشناسان (رابطین) با تشکیل
                کارگاه­های آموزشی در معاونت بازرسی و ایمنی آجا برای ایجاد هماهنگی و انسجام مطلوب‌تر اجرای بازرسی­ها تشکیل خواهد شد.
                دریافت و اسکان رؤسای بازرسی یگان‌های بازرسی‌شونده بر عهده نیروها می‌باشد.
            </p>
            <p style="text-align: justify">
                (3) هم‌زمان به‌صورت وبینار فرماندهان یگان‌های منتخب بازرسی شونده (رئیس هیئت بازرسی برنامه‌ای به روش خودارزیابی) حضور
                مجازی خواهند داشت.
            </p>
            <p style="text-align: justify">
                (4) نتایج نهایی بازرسی‌های خودارزیابی با نظارت سلسله‌مراتب سازمانی برابر برنامه زمان‌بندی اعلام‌شده توسط بازرسی و
                ایمنی نیرو گزارش‌گیری و یک نسخه کتابچه&nbsp; به انضمام مستندات بازرسی با نامه رسمی در موعد مقرر به بازرسی و ایمنی
                آجا ارسال تا پس از مراحل ارزیابی نتیجه به استحضار هیئت‌رئیسه محترم آجا برسد.
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(33, 88, 104)"><strong>ث)</strong></span> به‌منظور اتقان و حصول اطمینان از صحت بازرسی
                برنامه‌ای به روش خودارزیابی با نظارت سلسله مراتب فرماندهی از بین یگان‌های بازرسی‌شونده هر نیرو به صورت انتخاب تصادفی
                توسط هیئتی با محوریت معاونت بازرسی و ایمنی آجا در سال ${props.year} بازرسی راستی‌آزمایی به عمل می‌آید.
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(33, 88, 104)"><strong>ج)</strong></span> نیروها و یگان‌های تابعه ستاد آجا آمادگی لازم جهت
                بازرسی و ارزیابی تداوم آمادگی رزمی به‌صورت غیرمترقبه توسط معاون بازرسی و ایمنی آجا را در طول سال داشته باشند.
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(33, 88, 104)"><strong>چ)</strong></span> نیروها نتایج مصوبات سفرهای استانی فرماندهی معظم کل
                قوا(مدظله‌العالی) را مستندسازی و اسناد مصوبات را نسل به نسل بین فرماندهان تبادل نمایند تا فرماندهان و مسئولین از
                اشرافیت لازم در این حوزه برخوردار باشند.
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(33, 88, 104)"><strong>ح)</strong></span> بازرسی و ایمنی نیروها با توجه به جایگاه رئیس هیئت/
                تیم اعزامی از ستاد کل ن.م/ آجا نسبت به اعزام نماینده متناظر به منظور هماهنگی، هم‌افزایی و ارائه عملکرد نیرو در حوزه
                تخصصی اقدام نمایند.
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(33, 88, 104)"><strong>خ)</strong></span> نتایج بازرسی‌ها(معایب، نواقص، مصوبات و تدابیر
                ابلاغی)، پس از سیر مراحل ستادی و اعلام نتایج به صورت اسنادی در کمیته‌های پیگیری مورد بررسی و ریشه‌یابی قرار می‌گیرد
                و میزان اهتمام فرماندهان، مسئولین و کارکنان نسبت به رفع نارسائی‌ها در بازرسی‌های پیگیری میدانی مورد اتقان واقع
                می‌گردد. <span style="color: rgb(192, 0, 0)"><strong>(پیوست ت- شیوه‌نامه بازرسی پیگیری)</strong></span>
            </p>
            <p style="text-align: justify"><strong>2)&nbsp; نپاجا:</strong></p>
            <p style="text-align: justify">-&nbsp; برابر وظایف نزاجا اقدام نمایید.</p>
            <p style="text-align: justify"><strong>3)&nbsp; نهاجا:</strong></p>
            <p style="text-align: justify">-&nbsp; برابر وظایف نزاجا اقدام نمایید.</p>
            <p style="text-align: justify"><strong>4)&nbsp; نداجا:</strong></p>
            <p style="text-align: justify">-&nbsp; برابر وظایف نزاجا اقدام نمایید.</p>
            <p style="text-align: justify">
                <span style="color: rgb(152, 72, 6)"><strong>چ-</strong></span
                ><strong> وظایف معاونت‌ها/ سازمان‌ها و اداره‌های ستاد آجا:</strong>
            </p>
            <p style="text-align: justify">
                <strong>1)&nbsp; </strong>برنامه­زمان‌بندی نظارت‌های تخصصی سال 1404 دریافتی از معاونت‌ها/ سازمان‌ها و اداره‌های
                تابعه ستاد آجا&nbsp;<br /><span style="color: rgb(192, 0, 0)"><strong>(پیوست ث)</strong></span> با برنامه‌های بازرسی
                پیش‌بینی‌شده معاونت بازرسی و ایمنی آجا و نظارت عالی ستادی ستاد کل نیروهای مسلح ج.ا.ا
                <span style="color: rgb(192, 0, 0)"><strong>(پیوست الف)</strong></span> از نظر
                <strong>زمان اجرا تداخل</strong> نداشته باشد.
            </p>
            <p style="text-align: justify">
                <strong>2) </strong>نتایج حاصل از انجام نظارت‌های تخصصی - ستادی معاونت‌ها/ سازمان‌ها/ اداره‌ها و ارزیابی آمادگی رزمی
                معاونت عملیات آجا شامل: زمان اجرا، تلخیصی از نارسایی‌ها و تجزیه‌وتحلیل کلی را در قالب فرم اکسل
                <span style="color: rgb(192, 0, 0)"><strong>(پیوست ج)</strong> </span>به‌منظور ارزیابی عملکرد و بهره‌برداری در
                تجزیه‌وتحلیل سالیانه در بازه زمانی 6 ماهه (شهریور و اسفند) به معاونت بازرسی و ایمنی آجا ارسال نمایند.
            </p>
            <p style="text-align: justify">
                <strong>3) </strong>وفق مفاد دستورالعمل بازرسی­ها آمادگی همکاری و مشارکت در اجرای بازرسی­های برنامه­ای، غیرمترقبه،
                پیگیری، راستی‌آزمایی، بنابه‌دستور، نظارت‌های ستادی و بازرسی و ارزیابی­های آمادگی رزمی (غیرمترقبه) را داشته باشند.
            </p>
            <p style="text-align: justify">
                <strong>4) </strong>معاونت‌ها/ سازمان‌ها و اداره‌های ستاد آجا رأساً مصوبه انجام نظارت تخصصی / ستادی معاونت متناظر
                خود در س.ک.ن.م را از هیئت‌رئیسه محترم آجا اخذ و زمان آن را جهت جلوگیری از تداخل برنامه‌ها با معاونت بازرسی و ایمنی
                آجا هماهنگ نمایند.
            </p>
            <p style="text-align: justify">
                <strong>5) </strong>با توجه به انتقال دبیری نظارت عالی ستادی و ارزیابی میدانی ستاد کل ن.م ازدبیرخانه اشراف کلی
                فرماندهی معظم کل قوا(مدظله العالی) به بازرسی و ایمنی ستاد کل نیروهای مسلح ج.ا.ا در سال 1404، راهبری نظارت عالی ستادی
                در آجا با محوریت معاونت بازرسی و ایمنی آجا صورت می‌پذیرد، معاونت‌ها/ سازمان‌ها و اداره‌های ستاد آجا پس از دریافت
                دستورالعمل تکمیلی نظارت عالی ستادی همکاری و هم‌افزایی لازم را با معاونت بازرسی و ایمنی آجا داشته باشند.
            </p>
            <p style="text-align: justify">
                <strong>6) </strong>مصوبات و تدابیر ابلاغی مرتبط با رفع نارسایی‌های مشهودِ در بازرسی از یگان‌های بازرسی شونده که
                توسط معاونت بازرسی و ایمنی آجا به شیوه در حال انجام (در بستر نرم‌افزار اکسل) و یا در بستر سامانه جامع نظارت و بازرسی
                (پس از استقرار) ابلاغ می‌گردد را با انجام اقدامات و
                <span style="color: rgb(152, 72, 6)"><strong>هدایت ستادی</strong> </span>مناسب و همکاری معاونت متناظر نیرو،
                تجزیه‌وتحلیل، تلفیق و در سامانه بارگذاری و به معاونت بازرسی و ایمنی آجا ارسال نمایند و از صحت اقدامات و فعالیت‌های
                انجام شده با بررسی کارشناسی اطمینان حاصل نمایند.
            </p>
            <p style="text-align: justify">
                <strong>7)</strong><span style="color: rgb(33, 88, 104)"><strong> </strong></span>به‌منظور بررسی میزان رفع
                نارسایی‌ها و اجرایی شدن مصوبات و تدابیر ابلاغی مرتبط با نتایج بازرسی‌های انجام‌شده و شناسایی موانع، علل و عوامل
                احتمالی عدم تحقق فرامین، تدابیر و مصوبات ابلاغی و ارائه راه‌کار ستادی، در
                <span style="color: rgb(152, 72, 6)"><strong>كميته‌های پيگيري</strong> </span>(6 ماهه) و
                <span style="color: rgb(152, 72, 6)"><strong>كميته عالي پيگيري</strong> </span>(سالیانه) شرکت نماید.
            </p>
            <p style="text-align: justify">
                <strong>8) </strong>نتایج نظارت‌های تخصصی ارسالی به معاونت بازرسی و ایمنی آجا را در جلسات و کارگروه‌ها بررسی و
                به‌عنوان یک شاخص مهم مبنای انطباق و ارزیابی عملکرد رده‌های تخصصی نیروها و یگان‌های تابعه آجا قرار گیرد.
            </p>
            <p style="text-align: justify"><strong>9) معاونت طرح برنامه‌وبودجه آجا:</strong></p>
            <p style="text-align: justify">
                <span style="color: rgb(33, 88, 104)"><strong>(الف)</strong></span> علاوه بر اقدام برابر بند چ ماده 4 فوق (وظایف
                معاونت‌ها/ سازمان‌ها و اداره‌های ستاد آجا) در خصوص در اختیار گذاشتن، مأموریت، شرح وظایف و ساختار سازماني یگان­های
                موردنیاز معاونت بازرسی و ایمنی آجا اقدام نمایند.
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(33, 88, 104)"><strong>(ب)</strong></span> به‌منظور تداوم فعالیت‌ها و ممانعت از بروز هرگونه
                وقفه احتمالی در روند اجرای بازرسی‌های سال 1404، اعتبار لازم جهت هزینه‌های اضطراری و پیش‌بینی‌نشده (ضروری)، توسط
                معاونت‌ طرح و برنامه‌وبودجه آجا در اختیار معاونت بازرسی و ایمنی آجا قرار داده شود.
            </p>
            <p style="text-align: justify"><strong>10) معاونت آمادوپشتیبانی آجا:</strong></p>
            <p style="text-align: justify">
                - علاوه بر اقدام برابر بند چ ماده 4 فوق (وظایف معاونت‌ها / اداره‌ها و ...) با توجه به استعداد هیئت/ تیم‌های بازرسی
                وسیله ترابری مناسب (هواپیمای کشوری، هواپیماهای مسیر نهاجا، قطار، اتوبوس و خودرو مناسب) تدارک و کلیّه پشتیبانی‌های
                مورد لزوم آمادی هیئت/ تیم‌های بازرسی توسط قرارگاه پش ستاد آجا با هماهنگی معاونت بازرسی و ایمنی آجا صورت پذیرد.
            </p>
            <p style="text-align: justify"><strong>11) معاونت بازرسی و ایمنی آجا:</strong></p>
            <p style="text-align: justify">
                <span style="color: rgb(33, 88, 104)"><strong>(الف)</strong></span> بازرسی‌های برنامه‌ای (سیستماتیک)، غیرمترقبه،
                پیگیری، بازرسی برنامه‌ای به روش خودارزیابی با نظارت سلسله‌مراتب سازمانی، راستی آزمایی و نظارت‌های ستادی و سایر
                بازرسی‌های برنامه‌ریزی‌شده را برابر <span style="color: rgb(192, 0, 0)"><strong>(پیوست­ الف) </strong></span>هدایت،
                راهبری و اجرا نماید.
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(33, 88, 104)"><strong>ب)&nbsp; </strong></span>با تعامل با بازرسی و ایمنی ستاد کل نیروهای
                مسلح ج.ا.ا و مشارکت معاونت‌ها/ سازمان‌ها و اداره‌های ستاد آجا، نظارت عالی ستادی از یگان‌های آجا مستقر در استان‌های
                سیستان و بلوچستان و خراسان جنوبی را راهبری نماید.
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(33, 88, 104)"><strong>(پ)</strong></span> نظارت لازم بر حُسن انجام نظارت‌های تخصصی
                معاونت‌ها، اداره‌ها و سازمان‌های آجا صورت گرفته و نتایج حاصله در ارزیابی و تجزیه‌وتحلیل سالیانه منظور و ارائه گردد.
            </p>
            <p style="text-align: justify"><strong>12) ذیحساب و دارایی آجا:</strong></p>
            <p style="text-align: justify">
                - علاوه بر اقدام بند چ ماده 4 فوق (وظایف معاونت‌ها/ سازمان‌ها و اداره‌های ستاد آجا) اسناد هزینه کرد اعتبارات اضطراری
                و پیش‌بینی‌نشده مرتبط با فعالیت‌های حوزه نظارت/ بازرسی‌های معاونت بازرسی و ایمنی آجا برابر روش جاری از طریق قرارگاه
                پشتیبانی ستاد آجا اقدام گردد.
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(152, 72, 6)"><strong>ح-</strong></span
                ><strong> وظایف یگان‌های تابعه ستاد آجا:</strong>
            </p>
            <p style="text-align: justify">-&nbsp; برابر وظایف نزاجا اقدام نمایند.</p>
            <p style="text-align: justify">
                <span style="color: rgb(152, 72, 6)"><strong>خ-</strong></span
                ><strong> قرارگاه پشتیبانی ستاد آجا:</strong>
            </p>
            <p style="text-align: justify">1) برابر وظایف نزاجا اقدام نمایند.</p>
            <p style="text-align: justify">
                2) به‌منظور برگزاری جلسات توجیه و هماهنگی و تشکیل کارگاه‌های آموزشی و گزارش‌گیری، پشتیبانی لازم در زمینه دریافت،
                اسکان، پذیرایی (وعده غذایی – میان وعده‌) و ترابری بازرسان با هماهنگی معاونت بازرسی و ایمنی آجا اقدام نمایند.
            </p>
            <p style="text-align: justify">
                3) مرتبط با اسناد هزینه کرد اعتبارات اضطراری و پیش‌بینی‌نشده‌ی فعالیت‌های حوزه نظارت/ بازرسی‌ اقدام لازم به
                عمل‌آورید.
            </p>
            <p style="text-align: justify">
                4) با توجه به استعداد هیئت­/ تیم‌های بازرسی نسبت به پیش‌بینی وسیله ترابری مناسب (هواپیمای کشوری، هواپیماهای مسیر
                نهاجا، قطار، اتوبوس و خودرو مناسب) با رعایت اصول تأمینی اقدام گردد.
            </p>
            <p style="text-align: justify">
                <span style="color: rgb(152, 72, 6)"><strong>د-</strong></span
                ><strong> دستورات هماهنگی:</strong>
            </p>
            <p style="text-align: justify">
                <span style="color: black"><strong>1) </strong></span>بازرسي‌ها و نظارت‌های ستادی در نهایت دقّت و رعايت عدل و انصاف
                صورت گيرد.
            </p>
            <p style="text-align: justify">
                <span style="color: black"><strong>2) </strong></span>حداکثر زمان جهت اطلاع قبلی یگان‌ها از حضور هیئت/تیم بازرسی
                اعزامی ستاد آجا، به‌منظور اجرای بازرسی‌های پیش‌بینی‌شده (برنامه‌ای، پیگیری، راستی‌آزمایی و نظارت‌های ستادی) دو هفته
                قبل از شروع بازرسی می­باشد.
            </p>
            <p style="text-align: justify">
                <span style="color: black"><strong>3) </strong></span>انجام بازرسی­ها و نظارت­های ستادی، نبایستی به فرآیند و امور
                جاری و عملیاتی یگان، لطمه‌ای وارد نماید.
            </p>
            <p style="text-align: justify">
                <span style="color: black"><strong>4) </strong></span>نتایج ارسالی از بازرسی خودارزیابی بایستی با حفظ امانت‌داری،
                صداقت و ... تنظیم، جمع‌بندی و ارائه گردد.
            </p>
            <p style="text-align: justify">
                <span style="color: black"><strong>5) </strong></span>ترابری و تأمین ­هیئت/ تیم‌های بازرسی در محدوده یگان
                بازرسی‌شونده بر عهده ارشد آجا در منطقه و یگان بازرسی‌شونده می‌باشد.
            </p>
            <p style="text-align: justify">
                <span style="color: black"><strong>6) </strong></span>یگان‌های بازرسی‌شونده هماهنگی لازم نسبت به دریافت، اسکان و
                پذیرایی بازرسان اعزامی در حد متعارف و امکانات یگان داشته باشند.
            </p>
            <p style="text-align: justify">
                <span style="color: black"><strong>7) </strong></span>پرداخت فوق­العاده مأموریت بازرسان اعزامی از نیروها توسط یگان
                اعزام کننده و بازرسان اعزامی از معاونت‌ها/ سازمان‌ها و اداره‌های آجا توسط ستاد آجا بر مبنای گزارش خاتمه مأموریت
                معاونت بازرسی و ایمنی آجا اقدام گردد.
            </p>
            <p style="text-align: justify">
                <span style="color: black"><strong>8) </strong></span>نظارت بر حُسن اجراي مفاد دستورالعمل، به عهده بازرسي و ايمني
                رده‌هاي سازماني مي‌باشد<strong>.</strong>
            </p>
            <p style="text-align: justify">
                <span style="color: black"><strong>9) </strong></span>وصول دستورالعمل مذکور به معاونت بازرسی و ایمنی آجا (اداره
                عملیات بازرسی و پیگیری) اعلام نمایند.
            </p>
            <p style="text-align: justify">
                <span style="color: black"><strong>10) </strong></span>جهت رفع هرگونه ابهام در زمینه‌های مختلف مرتبط با این
                دستورالعمل و یا سایر هماهنگی‌های لازم، با شماره تلفن‌های قید شده در جدول زیر ارتباط برقرار نمایید:
            </p>
            <p style="text-align: justify">&nbsp;</p>
            <figure class="table">
                <table>
                <thead>
                    <tr>
                    <th><span style="color: black">ردیف</span></th>
                    <th><span style="color: black">سمت</span></th>
                    <th><span style="color: black">شماره تماس</span></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td>
                        <strong
                        >1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;</strong
                        >
                    </td>
                    <td><strong>اداره عملیات بازرسی و پیگیری</strong></td>
                    <td><strong>81955441</strong></td>
                    </tr>
                    <tr>
                    <td>
                        <strong
                        >2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;</strong
                        >
                    </td>
                    <td><strong>دایره عملیات</strong></td>
                    <td><strong>81955022</strong></td>
                    </tr>
                    <tr>
                    <td>
                        <strong
                        >3&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;</strong
                        >
                    </td>
                    <td><strong>دایره پیگیری</strong></td>
                    <td><strong>81953733</strong></td>
                    </tr>
                </tbody>
                </table>
            </figure>
            <p style="text-align:center;">&nbsp;</p>
            <p>فرمانده کل آجا ـ سرلشکر ستاد امیر حاتمی</p>
            <p>&nbsp;</p>
            <p>جانشین فرمانده کل آجا ـ سرتیپ ستاد محمدحسین دادرس</p>
            <p>&nbsp;</p>
            <p>رئیس ستاد و معاون هماهنگ‌کننده آجا ـ دریادار ستاد حبیب‌الله سیاری -------------------------------------</p>
            <p>&nbsp;</p>
            <p>امیر جانشین محترم ریاست ستاد و هماهنگ‌کننده آجا - سرتیپ ستاد قادر رحیم زاده</p>
            <p>&nbsp;</p>
            <p>معاون بازرسی و ایمنی آجا ـ سرتیپ ستاد ابوالفضل سپهری راد</p>
            <p>&nbsp;</p>
            <p><strong>جانشین معاون بازرسی و ایمنی آجا– سرتیپ دوم ستاد محمد عزیزی</strong></p>
            <p>&nbsp;</p>
            <p><strong>رئیس اداره عملیات بازرسی و پیگیری ـ سرتیپ دوم ستاد علی حاجی‌زاده</strong></p>
            <h2>&nbsp;</h2>
            <h2>رونوشت:</h2>
            <p style="text-align: justify">
                &nbsp;&nbsp;&nbsp; - سردار ریاست محترم بازرسی و ایمنی ستاد کل نیروهای مسلح ج.ا.ا (عملیات بازرسی و پیگیری) به پیوست 1
                نسخه دستورالعمل جهت استحضار و اقدام مقتضی.
            </p>
            <p style="text-align: justify">&nbsp;</p>
            <h2>گیرندگان:</h2>
            ${forces.map(
              (force, index) =>
                `<p style="text-align: justify" >
                ${index + 1}. امیر فرماندهی محترم ${force.name ?? ""} (بازرسی و ایمنی ـ عملیات بازرسی و پیگیری) به پیوست یک نسخه دستورالعمل مربوطه جهت آگاهی
                و اقدام لازم به شرح متن.
            </p>`
            ).join("")}
            <p style="text-align: justify">
                . ریاست محترم سازمان عقیدتی سیاسی آجا (دفتر) به شرح گیرنده ردیف یکم جهت آگاهی و اقدام لازم به شرح متن.
            </p>
            <p style="text-align: justify">
                . امیر ریاست محترم سازمان حفاظت اطلاعات آجا (دفتر) به شرح گیرنده ردیف یکم جهت آگاهی و اقدام لازم به شرح متن.
            </p>
            <p style="text-align: justify">
                . <strong>گیرندگان یکم ستاد آجا</strong> به پیوست یک نسخه دستورالعمل مربوطه جهت آگاهی و اقدام لازم به شرح متن.
            </p>
        </div>
`;
}
