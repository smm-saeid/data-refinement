import moment from 'moment-jalaali';
import { type AnnualPlanning } from '../../types';

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
  data: any;
  AJA: Boolean;
  value: string;
};
// ${props.totalInspection}
const GardeshKar = (props: Props) => {
  if (props.AJA)
    return `<div class="MuiBox-root muirtl-hpgf8j">
        <h3>
          از: معاونت بازرسی و ایمنی آجا<span class="text-tiny">(اداره عملیات بازرسی و پیگیری-عملیات)&nbsp;</span> &nbsp;
          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; شماره:&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;${props?.value}
        </h3>
        <h3>
          به: امیر فرماندهی محترم کل آجا &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
          &nbsp; &nbsp;تاریخ:&nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;${props.year}/10/10
        </h3>
        <h3>موضوع: بازرسی‌ها، نظارت‌های ستادی و ارزیابی‌های سال${props.year ?? 1401} &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;پیوست:دارد</h3>
        <p style="text-align: center;">با صلوات بر محمد(ص) و آل محمد(ص)</p>
        <h3 style="text-align: center;">«گردش کار»</h3>
        <p>سلام علیکم، با احترام به استحضار می‌رساند:</p>
        <p style="text-align: justify;">
          <strong>1 ـ کلیات:</strong>
        </p>
        <p style="text-align: justify;">
          در راستای انجام بازرسی‌های سالیانه و حرکت به سمت اثرگذاری و اثربخشی مطلوب نتیجه بازرسی‌ها، نظارت‌های ستادی و
          ارزیابی‌ها با لحاظ نمودن شاخصه‌های، میزان عملکرد و اثربخشی به‌منظور سنجش سطح بهره‌وری و بازخورد گیری از عملکرد
          <span style="color: rgb(192, 0, 0);">فردی </span>و <span style="color: rgb(192, 0, 0);">سازمانی </span>و
          همچنین به‌منظور ایجاد وحدت رویه، ارزیابی نسبی کمی و کیفی، کاهش اعمال سلیقه بازرسان در نمره دهی و احصاء محاسن و
          نارسایی‌ها (معایب و نواقص) و رسیدن به نتیجه مطلوب در نظر است تعدادی از یگان‌های تابعه نیروها و ستاد آجا در
          حوزه مأموریت، شرح وظایف سازمانی و میزان تحقق دستورالعمل‌ها، فرامین و تدابیر ابلاغی در سال
          <span style="color: red;">${props.year ?? 1401}</span> مورد بازرسي، &nbsp;نظارت ستادی و ارزیابی برمبنای مؤلفه‌های
          <span style="color: rgb(31, 56, 100);">
            (
            <strong>
              نیروی انسانی، آماد و پش، اطلاعات و حفاظت فیزیکی، تربیت و آموزش، عملیات، فاوا، جنگ نوین، بهداشت و درمان،
              تربیت‌بدنی، امور تحقیقات و پژوهش، طرح و برنامه و سازمان،&nbsp; امور مالی و بودجه و اعتبارات، مهندسی دفاعی
              و پدافند غیرعامل، ساحادم، فرماندهی و مدیریت، امور اشراف، بررسی وضعیت زیست و اماکن رفاهی، &nbsp;نظارت و
              ارزیابی از میزان تحقق تدابیر و مصوبات ابلاغی، شناسایی علل نارسائی‌ها و تنگناهای عمده یگان‌ها در راستای
              اجرای مأموریت‌های واگذاری، ارزیابی و ارزشیابی عملکرد فرماندهان، رؤسا و مدیران عالی آجا، امور ایمنی ، حوزه
              صیانت کارکنان پایور و وظیفه، اقدامات پیشگیری از جرائم، تخلفات و نظارت بر امور سربازان "فاستبوالخیرات")
            </strong>
          </span>
          <strong>
            قرار گيرند. لذا کلیات طرح‌ریزی بازرسی­ از یگان‌های عمده آجا در سال ${props.year ?? 1401} به شرح زیر تقدیم می‌گردد :
          </strong>
        </p>
        <p style="text-align: justify;">
          <strong>2ـ&nbsp; طرح‌ریزی بازرسی­ها، نظارت‌های ستادی و ارزیابی‌های در سال ${props.year ?? 1401}:</strong>
        </p>
        <p style="text-align: justify;">
          <span style="color: rgb(31, 78, 121);">
            <strong>الف) </strong>
          </span>
          <strong>بازرسی­ها و نظارت‌های ستادی به‌صورت متمرکز با محوریت معاونت بازرسی و ایمنی آجا از </strong>
          <span style="color: rgb(192, 0, 0);">
            <strong>${props.totalInspection ?? 110} </strong>
          </span>
          <strong>یگان آجا با اعزام هیئت / تیم بازرسی به شرح زیر اجرا می‌گردد:</strong>
        </p>
        <p style="text-align: justify;">
          <span style="color: rgb(226, 239, 217);">
            <strong>×&nbsp;&nbsp;&nbsp; </strong>
          </span>
          <strong>بازرسی‌های برنامه‌ای(سیستماتیک) </strong>
          <span style="color: rgb(192, 0, 0);">
            <strong>${props.systematic ?? 0} </strong>
          </span>
          <strong>یگان.</strong>
        </p>
        <p style="text-align: justify;">
          <span style="color: rgb(226, 239, 217);">
            <strong>×&nbsp;&nbsp;&nbsp; </strong>
          </span>
          <strong>بازرسی‌های غیرمترقبه خاص </strong>
          <span style="color: rgb(192, 0, 0);">
            <strong>${props.gheireMoteraghebeh ?? 0} </strong>
          </span>
          <strong>یگان</strong>
        </p>
        <p style="text-align: justify;">
          <span style="color: rgb(226, 239, 217);">
            <strong>×&nbsp;&nbsp;&nbsp; </strong>
          </span>
          <strong>بازرسی‌های پیگیری </strong>
          <span style="color: rgb(192, 0, 0);">
            <strong>${props.peigiri ?? 0} </strong>
          </span>
          <strong>یگان</strong>
        </p>
        <p style="text-align: justify;">
          <span style="color: rgb(226, 239, 217);">
            <strong>×&nbsp;&nbsp;&nbsp; </strong>
          </span>
          <strong>نظارت ستادی </strong>
          <span style="color: rgb(192, 0, 0);">
            <strong>${props.nezaratsetadi ?? 0} </strong>
          </span>
          <strong>مورد</strong>
        </p>
        <p style="text-align: justify;">
          <span style="color: rgb(226, 239, 217);">
            <strong>×&nbsp;&nbsp;&nbsp; </strong>
          </span>
          <strong>بازرسی برنامه‌ای به روش خودارزیابی با نظارت سلسله‌مراتب سازمانی از </strong>
          <span style="color: rgb(192, 0, 0);">
            <strong>${props.khodArzyabi ?? 0} </strong>
          </span>
          <strong>یگان عمده</strong>
        </p>
        <p style="text-align: justify;">
          <span style="color: rgb(226, 239, 217);">
            <strong>×&nbsp;&nbsp;&nbsp; </strong>
          </span>
          <strong>راستی آزمایی از بازرسی برنامه‌ای به روش خودارزیابی انجام‌شده در سال ${props?.rastiAzmayiYear ?? '1400'}: </strong>
          <span style="color: rgb(192, 0, 0);">
            <strong>${props?.rastiAzmayi ?? '?عدد'} </strong>
          </span>
          <strong>یگان</strong>
        </p>
        <p style="text-align: justify;">
          <span style="color: rgb(226, 239, 217);">
            <strong>×&nbsp;&nbsp;&nbsp; </strong>
          </span>
          <strong>بازرسی و ارزیابی معاون بازرسی و ایمنی آجا از یگان‌های آجا مستقر در </strong>
          <span style="color: rgb(192, 0, 0);">
            <strong>؟ </strong>
          </span>
          <strong>استان </strong>
          <strong> &nbsp;</strong>
          <span style="color: rgb(192, 0, 0);">
            <strong>
            ${
              props.data?.inspectionType?.find(
                type => type.key === 'ARZYABI_MOAVEN_BAZRASI'
              )?.number ?? '?'
            } </strong>
          </span>
          <strong>مورد .</strong>
        </p>
        <p style="text-align: justify;">
          <span style="color: rgb(226, 239, 217);">
            <strong>×&nbsp;&nbsp;&nbsp; </strong>
          </span>
          <strong>	بازرسی‌های تجمیعی حوزه ایمنی، ارزشیابی و صیانت از کارکنان از  </strong>
          <span style="color: rgb(192, 0, 0);">
            <strong>؟ </strong>
          </span>
          <strong>استان (؟ یگان) </strong>
        </p>
        <p style="text-align: justify;">
          <span style="color: rgb(226, 239, 217);">
            <strong>×&nbsp;&nbsp;&nbsp; </strong>
          </span>
          <strong>	راهبری نظارت عالی ستادی ستاد کل ن . م از یگان‌های آجا مستقر در </strong>
          <span style="color: rgb(192, 0, 0);">
            <strong>؟ </strong>
          </span>
          <strong> استان (سیستان و بلوچستان و خراسان جنوبی) </strong>
        </p>
        <p style="text-align: justify;">
          <span style="color: rgb(31, 78, 121);">
            <strong>ب)&nbsp; </strong>
          </span>
          <strong>بازرسی برنامه‌ای به روش خودارزیابی با نظارت سلسله‌مراتب سازمانی از یگان‌های عمده </strong>
          <span style="color: rgb(31, 56, 100);">
            <strong>(نزاجا </strong>
          </span>
          <span style="color: rgb(192, 0, 0);">
            <strong>${
              props.data?.inspectionType
                ?.find(type => type.key === 'KHOD_ARZYABI')
                ?.organizations?.find(org => org.key === 'nezaja')?.number ?? 0
            }</strong>
          </span>
          <span style="color: rgb(31, 56, 100);">
            <strong>، نپاجا </strong>
          </span>
          <span style="color: rgb(192, 0, 0);">
            <strong>${
              props.data.inspectionType
                ?.find(type => type.key === 'KHOD_ARZYABI')
                ?.organizations?.find(org => org.key === 'nepaja')?.number ?? 0
            } </strong>
          </span>
          <span style="color: rgb(31, 56, 100);">
            <strong>، نهاجا </strong>
          </span>
          <span style="color: rgb(192, 0, 0);">
            <strong>${
              props.data.inspectionType
                ?.find(type => type.key === 'KHOD_ARZYABI')
                ?.organizations?.find(org => org.key === 'nehaja')?.number ?? 0
            } </strong>
          </span>
          <span style="color: rgb(31, 56, 100);">
            <strong>و نداجا </strong>
          </span>
          <span style="color: rgb(192, 0, 0);">
            <strong>${
              props.data.inspectionType
                ?.find(type => type.key === 'KHOD_ARZYABI')
                ?.organizations?.find(org => org.key === 'nedaja')?.number ?? 0
            } </strong>
          </span>
          <span style="color: rgb(31, 56, 100);">
            <strong>، ستاد آجا </strong>
          </span>
          <span style="color: rgb(192, 0, 0);">
            <strong>${
              props.data.inspectionType
                ?.find(type => type.key === 'KHOD_ARZYABI')
                ?.organizations?.find(org => org.key === 'sayer')?.number ?? 0
            } </strong>
          </span>
          <span style="color: rgb(31, 56, 100);">
            <strong>) </strong>
          </span>
          <strong>
            با محوریت بازرسی و ایمنی نیروها و هدایت معاونت بازرسی و ایمنی آجا اجرا و نتایج حاصله در قالب کتابچه نتیجه
            بازرسی و لوح فشرده گزارش‌گیری و به‌منظور اتقان عملکرد در زمینه بازرسی برنامه‌ای به روش خودارزیابی نیروها در
            سال ${props.year ?? 1401} به‌صورت تصادفی مورد راستی آزمایی واقع می‌گردد .
          </strong>
          <span style="color: rgb(192, 0, 0);">
            <strong> (پیوست الف)&nbsp;</strong>
          </span>
        </p>
        <p style="text-align: justify;">
          <span style="color: rgb(31, 78, 121);">
            <strong>پ) </strong>
          </span>
          <strong>
            هم‌زمان و&nbsp; در قالب بازرسی‌های برنامه‌ای(سیستماتیک)، بازرسی‌های حوزه ویژه ایمنی و نظارت بر امور صیانت
            کارکنان و اقدامات پیشگیری از جرائم و تخلفات، نظارت بر امور سربازان "فاستبوالخیرات")&nbsp; و ارزشیابی عملکرد
            مدیران عالی (جایگاه‌های 17 مستقل، 18 و 19) &nbsp;به‌صورت تجمیعی و متمرکز به میزبانی قرارگاه‌های منطقه‌ای و
            اراشد نظامی به‌صورت استانی انجام خواهد شد.
          </strong>
          <span style="color: rgb(192, 0, 0);">
            <strong> (پیوست ب)&nbsp;</strong>
          </span>
        </p>
        <p style="text-align: justify;">
          <span style="color: rgb(31, 78, 121);">
            <strong>ث) </strong>
          </span>
          <strong>
            بازرسی‌های بنا به دستور در قالب تیم‌های ویژه (در قالب اصلاح الگوی مصرف، حمایت از کالای ایرانی و اقتصاد
            مقاومتی، وضعیت افطاری و سحری در ماه مبارک رمضان و بازرسی از استراحتگاه­ها و زائرسراها در ایام تعطیلات نوروز
            و تابستان و ..) انجام می‌گردد.
          </strong>
        </p>
        <p style="text-align: justify;">
          <span style="color: rgb(31, 78, 121);">
            <strong>ج) </strong>
          </span>
          <strong>
            بازرسی و&nbsp; ارزیابی و حصول اطمینان از تداوم آمادگی رزمی و توان عملیاتی یگان‌های آجا در راستای ارزیابی
            نحوه اجرای بخش‌هایی از طرح‌های عملیاتی و اطمینان از کفایت طرح‌های موجود و همچنین مقایسه وضع موجود با مطلوب
            بر مبنای مأموریت، شرح و وظایف و میزان پیشرفت اهداف و برنامه‌ها، فرامین و تدابیر ابلاغی در طول سال توسط معاون
            بازرسی و ایمنی آجا&nbsp; به‌صورت (غیرمترقبه) انجام خواهد گردید.
          </strong>
        </p>
        <p style="text-align: justify;">
          <span style="color: rgb(31, 78, 121);">
            <strong>چ) </strong>
          </span>
          <strong>
            نظارت بر رزمایشات در سطح آجا با بهره‌گیری از امکانات موجود و با نگاهی فرآیندی در جایگاه یکی از عناصر
            بازخوردی سیستم رزمایشات؛ که ضمن نظارت بر امور ایمنی در کلیه مراحل اجرای رزمایش، تلاش همه‌جانبه در جهت
            پیشگیری و کاهش رویدادها، سوانح احتمالی، خسارات مالی، تلفات جانی و همچنین ارزیابی عملکرد فرماندهان در راستای
            هم‌افزایی و اصلاح فرآیندها و درنتیجه رسیدن به بالاترین سطح بهره‌وری صورت خواهد گرفت.
          </strong>
        </p>
        <p style="text-align: justify;">
          <span style="color: rgb(31, 78, 121);">
            <strong>ح) </strong>
          </span>
          <strong>
            بازرسی‌های برنامه‌ای به روش خودارزیابی با نظارت سلسله‌مراتب سازمانی که از سال 88 باهدف نهادینه نمودن فرهنگ
            خودکنترلی و کاهش هزینه‌ها (جابجايي، ترابري، تغذيه و اسكان بازرسان و به حداقل رساندن خطرات و آسيب­هاي احتمالي
            به هنگام اجراي بازرسي­ها) اجرا می‌گردید در سال 1402 با تغییر رویکرد چابک سازی و همسان‌سازی با روش نوین بر
            اساس بازبینه‌های به‌روزرسانی شده که با شاخصه‌های میزان عملکرد و اثربخشی و تعیین میزان بهره‌وری در سطح 1
            ساختار سازمانی بر مبنای مؤلفه‌های آمادگی رزمی توسط این معاونت به‌صورت متمرکز با برگزاری کارگاه آموزشی و
            آموزش روش اجرای بازرسی برنامه‌ای به روش خودارزیابی با نظارت سلسله‌مراتب فرماندهی به مدت دو روز جهت مدیران
            عملیات بازرسی و افسران رابط بازرسی و ایمنی نیروها و روسای بازرسی و ایمنی یگان‌های بازرسی شونده هدایت و برابر
            برنامه زمان‌بندی در طول سال گزارش‌گیری و در سال ${props.year ?? 1401} به‌منظور اتقان و ارزیابی عملکرد، تعدادی از یگان‌های
            خودارزیابی شده به‌صورت منتخب مورد راستی آزمایی واقع خواهد گردید و شایان‌ذکر است: بازرسی برنامه‌ای به روش
            خودارزیابی با نظارت سلسله‌مراتب فرماندهی سایر سطوح و رده‌های سازمانی توسط نیروها به‌صورت غیر تمرکزی اجرا
            خواهد شد و عملکرد نیروها در گزارشات اشراف و نظارت‌های ستادی از بازرسی و ایمنی نیرو بازخورد گیری خواهد شد.
          </strong>
        </p>
        <p style="text-align: justify;">
          <span style="color: rgb(31, 78, 121);">
            <strong>خ) </strong>
          </span>
          <strong>
            پیگیری و حرکت به سمت اثرگذاری مطلوب بازرسی­ها به‌منظور اتقان از اقدامات انجام‌شده حاصل از بررسی اسنادی
            ارسالی یگان‌ها و تعیین دلایل احتمالی عدم رفع نارسایی‌ها (شامل کمبود اعتبارات، عدم اهتمام مسئولین، عدم
            واگذاری تجهیزات، کمبود نیروی انسانی و ...) ضمن بررسی اسنادی ستادی، بازرسی‌های پیگیری به‌صورت میدانی به عمل
            خواهد آمد.
          </strong>
        </p>
        <p style="text-align: justify;">
          <span style="color: rgb(31, 78, 121);">
            <strong>د) </strong>
          </span>
          <strong>
            ارزیابی بازرسان منتخب معاونت‌ها/ اداره‌ها/ سازمان‌ها و یگان‌های تابعه و نیروها جهت بازرسی از یگان­ها پس از
            خاتمه مأموریت بازرسی در اولویت بوده و هر یک از بازرسان با بازبینه تنظیمی مورد ارزیابی انفرادی واقع و
            طبقه‌بندی و در بارگذاری در بانک بازرسان در بازرسی‌های بعدی تصمیم‌گیری و اعمال تشویقات و تنبیهات ضمن اعلام به
            نیرو/ معاونت/ اداره/ سازمان اعزام کننده در سامانه ارزشیابی معاونت ثبت و در روند ارزشیابی، انتصابات و رشد و
            تعالی تأثیر داده می‌شود.
          </strong>
        </p>
        <p style="text-align: justify;">
          <span style="color: rgb(31, 78, 121);">
            <strong>ذ) </strong>
          </span>
          <strong>
            به‌منظور عدم تداخل در اجرای برنامه‌ بازرسی‌ها و نظارت‌های ستادی نیروها با هدایت معاونت بازرسی و ایمنی آجا
            به‌صورت تمرکزی طرح‌ریزیو توسط بازرسی و ایمنی نیروها به‌صورت غیر تمرکزی اجرا خواهد شد.
          </strong>
        </p>
        <p style="text-align: justify;">
          <span style="color: rgb(31, 78, 121);">
            <strong>ر) </strong>
          </span>
          <strong>
            به‌منظور هم‌پوشانی و جلوگیری از موازی کاری و عدم تداخل، برنامه‌های نظارت تخصصی معاونت‌ها /اداره‌ها/
            سازمان‌های و ارزیابی توان و آمادگی دفاعی و رزمی معاونت عملیات آجا از یگان‌های آجا با تشکیل جلسه مورد مداقه و
            بازنگری واقع گردید.
          </strong>
          <span style="color: rgb(192, 0, 0);">
            <strong>(پیوست پ)&nbsp;</strong>
          </span>
        </p>
        <p style="text-align: center;">
          <strong>«پيشنهادها»</strong>
        </p>
        <p style="text-align: justify;">
          <strong>3 ـ با عنايت به موارد معروضه فوق استدعا دارد، در صورت تصويب مقرّر فرمايند:</strong>
        </p>
        <p style="text-align: justify;">
          <strong>
            الف ـ با توجه به استعداد هیئت‌های بازرسی وسیله ترابری مناسب (هواپیماهای مسیر نهاجا، هواپیمای کشوری، قطار،
            اتوبوس و خودروهای تاکتیکی) توسط معاونت آماد و پشتیبانی آجا پیش‌بینی و سایر پشتیبانی‌های مورد لزوم هیئت‌‌های
            بازرسی توسط قرارگاه پشتیبانی ستاد آجا با هماهنگی معاونت بازرسی و ایمنی آجا صورت پذیرد.
          </strong>
        </p>
        <p style="text-align: justify;">
          <strong>
            ب- به‌منظور تداوم فعالیت‌ها و ممانعت از بروز هرگونه وقفه احتمالی در روند اجرای بازرسی‌های سال ${props.year ?? 1401} (در مسیر
            رفت، برگشت و در محل مأموریت، نوشت‌افزار و سایر ملزومات و ...) مبلغ
          </strong>
          <span style="color: red;">
            <strong>000؟ ریال معادل ؟ میلیون تومان </strong>
          </span>
          <strong>
            اعتبار، جهت هزینه‌های اضطراری و پیش‌بینی نشده (ضروری)، توسط معاونت‌ طرح و برنامه و بودجه آجا در اختیار
            معاونت بازرسی و ایمنی آجا قرار داده شود.
          </strong>
        </p>
        <p style="text-align: justify;">
          <strong>
            پ- فرماندهی‌ها‌/ معاونت‌ها‌/ اداره‌ها‌/ سازمان‌های ستاد آجا رأساً مصوبه انجام بازدید معاونت‌های متناظر خود
            در س.ک.ن.م را از هیئت‌رئیسه محترم آجا اخذ و زمان آن را جهت جلوگیری از تداخل برنامه‌ها با معاونت بازرسی و
            ایمنی آجا هماهنگ نمایند.
          </strong>
        </p>
        <p style="text-align: justify;">
          <strong>
            ت-در صورت تصویب، دستورالعمل بازرسی و نظارت‌های ستادی بر همین اساس تنظیم و پس از توشیح حضرت‌عالی به نیروها،
            معاونت‌ها/ اداره‌ها/ سازمان‌ها و یگان‌های تابعه ستاد آجا ابلاغ گردد.
          </strong>
        </p>
        <p style="text-align: justify;">
          <strong>ث ـ منوط به اوامر عالی است.</strong>
        </p>
        <p style="text-align: justify;">&nbsp;</p>
        <p style="text-align: left;">
          <strong>
            معاون بازرسی و ایمنی آجا ـ &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp;
          </strong>
        </p>
        <p style="text-align: left;">&nbsp;</p>
        <p style="text-align: justify;">
          <strong>اوامر امیر فرماندهی محترم کل آجا:</strong>
        </p>
        <p style="text-align: justify;">&nbsp;</p>
        <p style="text-align: justify;">
          <strong>نظریه امیر جانشین محترم فرماندهی کل آجا:</strong>
        </p>
        <p style="text-align: justify;">&nbsp;</p>
        <p style="text-align:justify;"><strong>نظریه امیر ریاست محترم ستاد و معاون هماهنگ‌کننده آجا:       ---------------------------------------------</strong></p>
        <p style="text-align:justify;">&nbsp;</p>
        <p style="text-align:justify;"><strong>&nbsp;نظریه امیر جانشین محترم ریاست ستاد و معاون هماهنگ‌کننده آجا:
                &nbsp;</strong></p>
        <p style="text-align:justify;">&nbsp;</p>
        <p style="text-align:justify;">&nbsp;</p>
        <p style="text-align:left;"><strong>جانشین معاونت بازرسی و ایمنی آجا – &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                &nbsp;&nbsp;&nbsp;</strong></p>
        <p style="text-align:left;">&nbsp;</p>
        <p style="text-align:left;"><strong>رئیس اداره عملیات بازرسی و پیگیری ـ &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                &nbsp; &nbsp;&nbsp;</strong></p>
      </div>
    `;
  else
    return `
    <div class="MuiGrid-root MuiGrid-container MuiGrid-item muirtl-99k5ag-MuiGrid-root">
      <div class="MuiGrid-root MuiGrid-container MuiGrid-item MuiGrid-grid-md-12 muirtl-1onx300-MuiGrid-root"></div>
      <div class="MuiGrid-root MuiGrid-item MuiGrid-grid-md-12 muirtl-hagxv6-MuiGrid-root">
        <div class="MuiBox-root muirtl-hpgf8j">
          <h3>
             از:  <span class="text-tiny">(اداره عملیات بازرسی و پیگیری-عملیات)&nbsp;</span>
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;شماره:
          </h3>
          <h3>
            به:    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; تاریخ:
          </h3>
          <h3>
            موضوع: بازرسی‌ها، نظارت‌های ستادی و ارزیابی‌های سال ${props.year} &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;پیوست:
          </h3>
          <p style="text-align: center;">با صلوات بر محمد(ص) و آل محمد(ص)</p>
          <h3 style="text-align: center;">«گردش کار»</h3>
          <p>سلام علیکم، با احترام به استحضار می‌رساند:</p>
          <p style="text-align: justify;">
            <strong>1 ـ کلیات:</strong>
          </p>
          
          <p style="text-align: justify;">
            <strong>2ـ&nbsp; طرح‌ریزی بازرسی­ها، نظارت‌های ستادی و ارزیابی‌های در سال ${props.year}:</strong>
          </p>
          
          <p style="text-align: justify;">
            <strong>3 ـ با عنايت به موارد معروضه فوق استدعا دارد، در صورت تصويب مقرّر فرمايند:</strong>
          </p>
          <p style="text-align: left;">
            <strong>
              معاون بازرسی و ایمنی نیروـ &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            </strong>
          </p>
          
          <p style="text-align: justify;"><strong>اوامر امیر فرماندهی محترم نیرو:</strong></p>
        </div>
      </div>
    </div>
  `;
};

export default GardeshKar;
