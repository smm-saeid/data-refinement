import { CKEditor } from '@ckeditor/ckeditor5-react';
import 'ckeditor5/ckeditor5.css';
import {
  ClassicEditor,
  Alignment,
  Bold,
  Essentials,
  Italic,
  Paragraph,
  Undo,
  Indent,
  List,
  Heading,
  Image,
  ImageEditing,
  ImageResize,
  Font,
  TableToolbar,
  Table,
} from 'ckeditor5';
import { Box } from '@mui/material';
import React, {
  useMemo
} from 'react';


const Instruction = React.forwardRef(
  (
    {
      issuance,
      setIssuance,
    }: any
  ) => {

    const workflowHtml = useMemo(
      () =>
        issuance ??
        `
            <p style="text-align:center;">بسمه تعالی</p>
        <p style="text-align:center;"><img class="image_resized" style="aspect-ratio:485/533;width:7.69%;"
            src="/assets/images/logo.png" width="485" height="533"></p>
        <p style="text-align:center;">فرماندهی کل آجا</p>
        <h3>از: آجا (اداره عملیات بازرسی و پیگیری - عملیات بازرسی)<span class="text-tiny">&nbsp;</span> &nbsp; &nbsp; &nbsp;
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;شماره:</h3>
        <h3>به: امیر فرماندهی محترم کل آجا &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp; &nbsp; &nbsp; &nbsp; تاریخ:</h3>
        <h3>موضوع: بازرسی‌ها، نظارت‌های ستادی و ارزیابی‌های سال1403 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp; &nbsp;پیوست:</h3>
        <p style="text-align:center;">با صلوات بر محمد(ص) و آل محمد(ص)</p>
        <p style="text-align:center;"><span class="text-big"><strong>پیرو شماره:</strong>&nbsp;</span></p>
        <p>سلام علیکم،</p>
        <p style="text-align:justify;"><strong>1 ـ منظور:</strong></p>
        <p style="text-align:justify;">در این ماده منظور از اجرای بازرسی نوشته می شود.</p>
        <p style="text-align:justify;"><strong>2ـ&nbsp; اهداف:</strong></p>
        <p style="text-align:justify;">در این ماده هدف های بازرسی درج می شود.</p>
        <p style="text-align:justify;"><span style="color:rgb(31,78,121);"><strong>الف)</strong></span></p>
        <p style="text-align:justify;"><span style="color:rgb(31,78,121);"><strong>ب)&nbsp;</strong>&nbsp;</span></p>
        <p style="text-align:justify;"><strong>3 ـ اجرا:</strong></p>
        <p style="text-align:justify;"><strong>الف - تدبیر:</strong></p>
        <p style="text-align:justify;">تدبیر سامانه فرماندهی درج می شود.</p>
        <p style="text-align:justify;"><strong>ب - ترکیب هیئت/گروه/تیم بازرسی:&nbsp;</strong></p>
        <figure class="table">
            <table>
            <thead>
                <tr>
                <th>ردیف</th>
                <th>درجه</th>
                <th>نام و نام خانوادگی</th>
                <th>مسئولیت در بازرسی</th>
                <th>میزان دسترسی</th>
                </tr>
            </thead>
            </table>
        </figure>
        <p>&nbsp;</p>
        <p><strong>پ - زمانبندی اجرای بازرسی:</strong></p>
        <p><strong>- تاریخ شروع: &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; -تاریخ پایان: &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; -به مدت روز کاری:</strong></p>
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
        <p style="text-align:left;"><strong>امضا رئیس ... - ...</strong></p>
        <p style="text-align:left;">&nbsp;</p>
        <p style="text-align:left;">&nbsp;</p>
        <p style="text-align:justify;"><strong>پیوست ها:</strong></p>
        <p style="text-align:justify;">&nbsp;</p>
        <p style="text-align:justify;"><strong>گیرندگان:</strong></p>
        <p style="text-align:justify;">&nbsp;</p>
        `,
      [issuance]
    );

    return (
      <Box
        margin={'10px'}
        padding={'5%'}
        sx={{
          backgroundColor: 'white',
          color: 'black',
          fontFamily: 'Nazanin',
          lineHeight: '40px',
        }}
      >
        <CKEditor
          editor={ClassicEditor}
          id="document"
          onChange={(e, myeditor) => {
            setIssuance(myeditor.getData());
          }}
          config={{
            table: {
              contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
            },
            toolbar: {
              items: [
                'undo',
                'redo',
                '|',
                'heading',
                '|',
                'bold',
                'italic',
                '|',
                'bulletedList',
                'numberedList',
                'indent',
                'outdent',
                '|',
                'alignment',
                'ckboxImageEdit',
                '|',
                'fontSize',
                'insertTable',
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
            licenseKey: '<YOUR_LICENSE_KEY>',
            // mention: {
            //     // Mention configuration
            // },
            initialData: workflowHtml,
            language: {
              // The UI will be English.
              ui: 'en',

              // But the content will be edited in Arabic.
              content: 'fa',
            },
          }}
        />
      </Box>
    );
  }
);

export default Instruction;
