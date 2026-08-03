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
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import moment from 'moment-jalaali';
import ReactDOMServer from 'react-dom/server';
import { dateDiff } from '@/modules/inspection-operation/scheduled/utils/utils.ts';
import MatnaEditor from '@/components/MatnaEditor.tsx';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useLegacyApi } from 'hooks/useLegacyApi.ts';
import { useSnackbar } from '@/hooks/useSnackbar';
import { useNavigate } from 'react-router';

const issuanceInstructionInitialData = `
<p style="text-align:center;">بسمه تعالی</p>
<p style="text-align:center;"><img class="image_resized" style="aspect-ratio:485/533;width:7.69%;" src="/artesh.jpg"
        width="485" height="533"></p>
<p style="text-align:center;">فرماندهی کل آجا</p>
<h4>از: آجا (اداره عملیات بازرسی و پیگیری - عملیات بازرسی)<span class="text-tiny">&nbsp;</span> &nbsp; &nbsp; &nbsp;
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
    &nbsp;شماره: &nbsp;var-counter</h4>
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

const StartInspectionStep6 = ({ inspectionInformation, refetchStep }) => {
  const legacyApi = useLegacyApi();

  const { mutate } = useMutation({
    mutationFn: legacyApi.request,
  });

  const [issuanceInstruction, setIssuanceInstruction] = useState(null);
  const snackbar = useSnackbar();
  const navigate = useNavigate();

  const { data: counter } = useQuery<any, any, any>({
    queryKey: [
      `/information/sequence/${inspectionInformation.inspectionId}-2`,
    ],
    queryFn: () =>
      legacyApi.post(
        `/information/sequence/${inspectionInformation.inspectionId}-2`
      ),
    select: (res: any) => {
      return res.data;
    },
    gcTime: 0,
  });

  const { data: experts } = useQuery<any, any, any>({
    queryKey: [
      `/person-speciality/find-by-inspection?pageSize=1000&currentPage=1&inspectionId=${inspectionInformation.inspectionId}`,
    ],
    queryFn: () =>
      legacyApi.get(
        `/person-speciality/find-by-inspection?pageSize=1000&currentPage=1&inspectionId=${inspectionInformation.inspectionId}`
      ),
    select: (res: any) => {
      return res?.data?.rows;
    },
  } as any);

  const { data: leadInitialInfo } = useQuery<any, any, any>({
    queryKey: [
      `/lead-inspection/find-by-inspection/inspectionId=${inspectionInformation.inspectionId}`,
    ],
    queryFn: () =>
      legacyApi.get(
        `/lead-inspection/find-by-inspection?inspectionId=${inspectionInformation.inspectionId}`
      ),
    select: (res: any) => {
      return res.data;
    }
  } as any);

  const findWeekDays = () => {
    if (
      !!inspectionInformation?.informationStartDate &&
      !!inspectionInformation?.informationEndDate
    ) {
      let weekDaysCount = 0;
      let start = (new Date(inspectionInformation?.informationStartDate)).getDay();
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
    return null;
  };

  const [backModalIsOpen, setBackModalIsOpen] = useState(false);
  const [sendModalIsOpen, setSendModalIsOpen] = useState(false);

  const lead = leadInitialInfo?.find(expert => expert.post == 'lead');
  const deputy = leadInitialInfo?.find(expert => expert.post == 'deputy');

  const inspectionTable =
      `<table style={margin: "10px", align: "center"}>
       
            <thead>
                <tr>
                <th>ردیف</th>
                <th>درجه</th>
                <th>یگان</th>
                <th>نام و نام خانوادگی</th>
                <th>مسئولیت در بازرسی</th>
                </tr>
            </thead>
            <table>
                <tbody>
                <tr>
                <th>1</th>
                  <th>${lead?.degree}</th>
                  <th>${lead?.organizationUnitName}</th>
                  <th>${lead?.name} ${lead?.family}</th>
                  <th>رئیس هیئت بازرسی</th>
                </tr>
                ${deputy ? 
                `<th>2</th>
                  <th>${deputy?.degree}</th>
                  <th>${deputy?.organizationUnitName}</th>
                  <th>${deputy?.name} ${deputy?.family}</th>
                  <th>افسر هماهنگ کننده</th>
                </tr>` : null
                }
                ${ReactDOMServer.renderToString(
                  experts?.map((expert: any, index: any) => (
                    <tr>
                      <td>{deputy ? index + 3 : index + 2}</td>
                      <td>{expert?.degree}</td>
                      <td>{expert?.organizationUnitName}</td>
                      <td>{expert?.name + " " + expert?.family}</td>
                      <td>{expert?.position}</td>
                    </tr>
                  ))
                )}
                </tbody>
            </table> `

  const insertIntoHtml = (issuanceInstruction: string) => {

    var newhtml = issuanceInstruction;
   
    newhtml = newhtml.replaceAll('var-table', inspectionTable);

    newhtml = newhtml.replaceAll('var-current-date',  moment(new Date()).format('jYYYY/jMM/jDD'))

    newhtml = newhtml.replaceAll('var-org-name', inspectionInformation?.organizationUnitName);

    newhtml = newhtml.replaceAll('var-year', inspectionInformation?.informationStartDate ? moment(inspectionInformation?.informationStartDate).format('jYYYY'): '-');

    newhtml = newhtml.replaceAll('var-counter', counter ? counter?.value: '-');

    newhtml = newhtml.replaceAll('var-from-date', inspectionInformation?.informationStartDate ? moment(inspectionInformation?.informationStartDate).format('jYYYY/jMM/jDD') : '-');

    newhtml = newhtml.replaceAll('var-end-date', inspectionInformation?.informationEndDate ? moment(inspectionInformation?.informationEndDate).format('jYYYY/jMM/jDD') : '-');

    newhtml = newhtml.replaceAll('var-duration', findWeekDays().toString());

    newhtml = newhtml.replaceAll('var-number-of-inspectors', experts.length.toString());

    newhtml = newhtml.replaceAll('var-lead-name', leadInitialInfo.name + " " + leadInitialInfo.family);

    return newhtml;
  };

  useEffect(() => {
    if (inspectionInformation != null && experts != null && leadInitialInfo != null && counter != null) {
      if (inspectionInformation.issuanceInstruction != null) {
        setIssuanceInstruction(inspectionInformation.issuanceInstruction);
      } else {
        setIssuanceInstruction(insertIntoHtml(issuanceInstructionInitialData));
      }
    }
  }, [inspectionInformation, experts, leadInitialInfo, counter]);

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

      }}
    >
      {!issuanceInstruction ? (
        <Skeleton height={1000} />
      ) : (
        <MatnaEditor
          onChange={(_, myeditor) => {
            setIssuanceInstruction(myeditor.getData());
          }}
          initialData={issuanceInstruction}
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
            >
              مرحله قبل
            </Button>
            <Button
              variant="contained"
              disabled={inspectionInformation?.instructionStatus == "approved"}
              color="success"
              onClick={() => setSendModalIsOpen(true)}
              sx={{ margin: '10px' }}
            >
              ثبت و ارسال به کارتابل
            </Button>
            <Button
              variant={'contained'}
              // disabled={inspectionInformation?.instructionStatus != "approved"}
              onClick={() => {
                mutate(
                  {
                    entity: `information/end?inspectionId=${inspectionInformation.inspectionId}`,
                    method: "post",
                  },
                  {
                    onSuccess: () => {
                      console.log("fsdfsdfsdf")
                      navigate('/operation/scheduled-inspection')
                    }
                  }
                )
              }}
              sx={{ margin: '10px' }}
            >
              ثبت نهایی {inspectionInformation?.instructionStatus == "approved" ? "" : (inspectionInformation?.instructionStatus == "cartabling" ? "(در انتظار تایید)" : "(در انتظار ارسال)")}
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Dialog
        maxWidth="md"
        open={backModalIsOpen}
        onClose={() => {
          setBackModalIsOpen(false);
        }}
      >
        <DialogTitle>هشدار</DialogTitle>
        <DialogContent>
          <DialogContentText>
            آیا مایل به بازگشت به مرحله قبل هستید؟ تغییرات شما در این مرحله از
            بین خواهد رفت.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setBackModalIsOpen(false);
            }}
            color="inherit"
          >
            لغو
          </Button>
          <Button
            onClick={() => {
              mutate(
                {
                  entity: `/information`,
                  method: 'put',
                  data: {
                    ...inspectionInformation,
                    issuanceInstruction: null,
                    state: "EKHTESAS_BAZBINEH",
                  },
                } as any,
                {
                  onSuccess: (_: any) => {
                    mutate(
                      {
                        entity: `/information/delete-cartable-by-id-and-type?id=${inspectionInformation.id}&type=instruction`,
                        method: 'delete',
                        data: null,
                      } as any,
                      {
                        onSuccess: (_: any) => {
                          refetchStep();
                        },
                        onError: () => {},
                      }
                    );
                  },
                  onError: () => {},
                }
              );
            }}
            variant="contained"
            color="primary"
          >
            تایید
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        maxWidth="md"
        open={sendModalIsOpen}
        onClose={() => {
          setSendModalIsOpen(false);
        }}
      >
        <DialogTitle>هشدار</DialogTitle>
        <DialogContent>
          <DialogContentText>
            دستورالعمل برای تایید به کارتابل مراجع بالاتر ارسال می شود.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setSendModalIsOpen(false);
            }}
            color="inherit"
          >
            لغو
          </Button>
          <Button
            onClick={() => {
              mutate(
                {
                  entity: `/information`,
                  method: 'put',
                  data: {
                    ...inspectionInformation,
                    issuanceInstruction: issuanceInstruction,
                  },
                } as any,
                {
                  onSuccess: (_: any) => {
                    mutate(
                      {
                        entity: `/information/save-to-cartable?informationId=${inspectionInformation.id}&type=instruction`,
                        method: 'post',
                        data: null,
                      } as any,
                      {
                        onSuccess: (_: any) => {
                          refetchStep();
                          snackbar("دستورالعمل با موفقیت به کارتابل مراجع بالاتر ارسال گردید. پس از تایید دکمه <ادامه> فعال خواهد شد.", "success", 5000);
                        },
                        onError: () => {},
                      }
                    );
                  },
                  onError: () => {},
                }
              );
              setSendModalIsOpen(false);
            }}
            variant="contained"
            color="primary"
          >
            تایید
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StartInspectionStep6;
