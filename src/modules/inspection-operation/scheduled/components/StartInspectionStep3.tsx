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
<h4 dir="rtl" style="text-align: right;">
  از: آجا (اداره عملیات بازرسی و پیگیری - عملیات بازرسی)&nbsp; &nbsp; &nbsp;
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;شماره: &nbsp; &nbsp; &nbsp; &nbsp; <span dir="ltr" style="display:inline-block; text-align:left;">var-counter</span>
</h4>
<h4>
  به: امیر ریاست محترم ستاد و معاون هماهنگ‌کننده آجا &nbsp; &nbsp; 
  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 
  تاریخ: &nbsp; &nbsp; &nbsp; &nbsp;  var-current-date
</h4>
<h4>
  موضوع: بازرسی برنامه ای از var-org-name &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 
  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 
  پیوست:
</h4>
<p style="text-align:left;">&nbsp;</p>
<p style="text-align: center">با صلوات بر محمد(ص) و آل محمد(ص)</p>
<p style="text-align: center">
  <span class="text-big"><strong>«گردشکار»</strong></span>
</p>
<p>سلام علیکم، با احترام</p>
<p style="text-align: justify"><strong>1. سابقه:</strong></p>
<p>
  برابر طرح مصوب بازرسی‌ها و نظارت‌های ستادی سال
  <strong>
    var-year
  </strong>
  و درراستای اجرای اوامر صادره در نظر است. وفق برنامه زمان‌بندی شده از تاریخ
  <strong>
    var-from-date
  </strong>
   به مدت 
  <strong>
    var-duration
  </strong>
   روز از 
  <strong>
    var-org-name
  </strong>
  توسط هیئتی به استعداد
  <strong>
    var-number-of-inspectors
  </strong>
  نفر به شرح تخصص های مندرج در جدول ذیل بازرسی برنامه ای به عمل آید.
  <strong>(سابقه)</strong>
</p>
<p style="text-align: justify"><strong>2. ترکیب هیئت بازرسی:</strong></p>
<figure class="table">var-table</figure>
<p style="text-align:justify;">3. به‌منظور سرپرستی و هدایت هیئت مذکور var-lead-degree var-lead-name در نظر گرفته‌شده است.</p>
<p style="text-align:justify;">4. به‌منظور حصول به نتایج مطلوب و کیفی در نظر است کارشناسان مندرج در جدول فوق از کارکنان
    شاخص، باتجربه و متخصص معاونت‌ها/ اداره‌ها/ سازمان‌ها و الزاماً از بازرسانی که جهت تشکیل بانک بازرسان این معاونت
    معرفی‌شده‌اند، انتخاب گردند.</p>
<p style="text-align:justify;">5. حضور اعضاء هيئت بازرسی در معاونت بازرسي و ایمنی آجا به‌منظور توجيه، تقسيم‌كار، بررسي،
    بازنگري و در صورت ضرورت اصلاح بازبينه‌هاي تهیه‌شده به مدت 1روز پیش‌بینی‌شده است.</p>
<p style="text-align:justify;">6.&nbsp;مراتب انجام بازرسی به نهاجا ابلاغ گردد.</p>
<p style="text-align:justify;">7. مراتب جهت استحضار و صدور اوامر عالی به عرض می‌رسد.</p>
<p style="text-align:justify;">&nbsp;</p>
<p><strong>&nbsp;</strong></p>
<p>&nbsp;</p>
<p><strong>اوامر امیر ریاست محترم ستاد و معاون هماهنگ‌کننده آجا : ---------------------------------------</</strong></p>
<p><strong>&nbsp;</strong></p>
<p><strong>&nbsp;</strong></p>
<p><strong>نظريه امیر جانشین محترم رئیس ستاد و معاون هماهنگ‌کننده آجا :</strong></p>
<p>&nbsp;</p>
<p>&nbsp;</p>
<p>&nbsp;</p>
<p style="text-align:left;"><strong>معاون بازرسي و ایمنی آجا ـ سرتیپ ستاد ابوالفضل سپهری راد</strong></p>
<p style="text-align:left;">&nbsp;</p>
<p style="text-align:left;"><strong>جانشین معاونت بازرسی و ایمنی آجا - سرتیپ‌دوّم ستاد علی اوجاقی</strong></p>
<p style="text-align:left;">&nbsp;</p>
<p style="text-align:left;">
    <strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ر-اداره عملیات
        بازرسی‌و پیگیری ـ سرتیپ‌دوم ستاد علی حاجی‌زاده</strong></p>
<p style="text-align:left;">&nbsp;</p>
<p style="text-align:left;"><strong>ر-دایره عملیات بازرسی ـ ناخدایکم ستاد احمد پورمولا</strong></p>
<p style="text-align:left;">&nbsp;</p>
<p style="text-align:left;">&nbsp;</p>
`;

const StartInspectionStep3 = ({ inspectionInformation, refetchStep }) => {
  const legacyApi = useLegacyApi();

  const { mutate } = useMutation({
    mutationFn: legacyApi.request,
  });

  const [issuanceInformation, setIssuanceInformation] = useState(null);
  const snackbar = useSnackbar();

  const { data: counter } = useQuery<any, any, any>({
    queryKey: [
      `/information/sequence/${inspectionInformation.inspectionId}-1`,
    ],
    queryFn: () =>
      legacyApi.post(
        `/information/sequence/${inspectionInformation.inspectionId}-1`
      ),
    select: (res: any) => {
      return res.data;
    },
    gcTime: 0,
  });

  const { data: leadInitialInfo } = useQuery<any, any, any>({
    queryKey: [
      `api1/lead-inspection/find-by-inspection/inspectionId=${inspectionInformation.inspectionId}`,
    ],
    queryFn: () =>
      legacyApi.get(
        `/lead-inspection/find-by-inspection?inspectionId=${inspectionInformation.inspectionId}`
      ),
    select: (res: any) => {
      return res.data;
    },
    gcTime: 0,
  });

  const { data: experts } = useQuery<any, any, any>({
    queryKey: [
      `/1person-speciality/find-by-inspection?pageSize=1000&currentPage=1&inspectionId=${inspectionInformation.inspectionId}`,
    ],
    queryFn: () =>
      legacyApi.get(
        `/person-speciality/find-by-inspection?pageSize=1000&currentPage=1&inspectionId=${inspectionInformation.inspectionId}`
      ),
    select: (res: any) => {
      return res?.data?.rows;
    },
    gcTime: 0,
  });

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


  const inspectionTable =
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
                  experts?.map((skill: any, index: any) => (
                    <tr>
                      <td>{index + 1}</td>
                      <td>{skill?.position}</td>
                      <td>{skill.organizationUnitName}</td>
                      <td>{skill?.commonBaseDataFieldValue}</td>
                      <td>{1}</td>
                    </tr>
                  ))
                )}
                </tbody>
            </table> `;

  const insertIntoHtml = (issuanceInformation: string) => {

    var newhtml = issuanceInformation;

    var lead = leadInitialInfo.find(expert => expert.post == 'lead');

    newhtml = newhtml.replaceAll('var-table', inspectionTable);

    newhtml = newhtml.replaceAll('var-current-date',  moment(new Date()).format('jYYYY/jMM/jDD'))

    newhtml = newhtml.replaceAll('var-org-name', inspectionInformation?.organizationUnitName);

    newhtml = newhtml.replaceAll('var-year', inspectionInformation?.informationStartDate ? moment(inspectionInformation?.informationStartDate).format('jYYYY'): '-');

    newhtml = newhtml.replaceAll('var-counter', counter ? counter?.value: '-');

    newhtml = newhtml.replaceAll('var-from-date', inspectionInformation?.informationStartDate ? moment(inspectionInformation?.informationStartDate).format('jYYYY/jMM/jDD') : '-');

    newhtml = newhtml.replaceAll('var-duration', findWeekDays().toString());

    newhtml = newhtml.replaceAll('var-number-of-inspectors', experts.length.toString());

    newhtml = newhtml.replaceAll('var-lead-name', lead?.name + " " + lead?.family);

    newhtml = newhtml.replaceAll('var-lead-degree', lead?.degree);


    return newhtml;
  };

  useEffect(() => {
    if (inspectionInformation != null && experts != null && leadInitialInfo != null && counter != null) {
      if (inspectionInformation.issuanceInformation != null) {
        setIssuanceInformation(inspectionInformation.issuanceInformation);
      } else {
        setIssuanceInformation(insertIntoHtml(issuanceInformaionInitialData));
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
      {!issuanceInformation ? (
        <Skeleton height={1000} />
      ) : (
        <MatnaEditor
          onChange={(_, myeditor) => {
            setIssuanceInformation(myeditor.getData());
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
            >
              مرحله قبل
            </Button>
            <Button
              variant="contained"
              disabled={inspectionInformation?.informationStatus == "approved"}
              color="success"
              onClick={() => setSendModalIsOpen(true)}
              sx={{ margin: '10px' }}
            >
              ثبت و ارسال به کارتابل
            </Button>
            <Button
              variant={'contained'}
              // disabled={inspectionInformation?.informationStatus != "approved"}
              onClick={() => {
                mutate(
                  {
                    entity: `/cartable/create-multi-branch/${inspectionInformation.id}`,
                    method: 'post',
                    data: experts,
                  } as any,
                  {
                    onSuccess: (_: any) => {
                    },
                    onError: () => {},
                  }
                );
                mutate(
                  {
                    entity: `/information`,
                    method: 'put',
                    data: {
                      ...inspectionInformation,
                      state: "EKHTESAS_AFRAD",
                    },
                  } as any,
                  {
                    onSuccess: (_: any) => {
                      refetchStep();
                    },
                    onError: () => {},
                  }
                );
              }}
              sx={{ margin: '10px' }}
            >
              ادامه {inspectionInformation?.informationStatus == "approved" ? "" : (inspectionInformation?.informationStatus == "cartabling" ? "(در انتظار تایید)" : "(در انتظار ارسال)")}
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
                    issuanceInformation: null,
                    state: "TAKHASOS_ESTEHZARIYE",
                  },
                } as any,
                {
                  onSuccess: (_: any) => {
                    mutate(
                      {
                        entity: `/information/delete-cartable-by-id-and-type?id=${inspectionInformation.id}&type=information`,
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
            استحضاریه برای تایید به کارتابل مراجع بالاتر ارسال می شود.
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
                    issuanceInformation: issuanceInformation,
                  },
                } as any,
                {
                  onSuccess: (_: any) => {
                    mutate(
                      {
                        entity: `/information/save-to-cartable?informationId=${inspectionInformation.id}&type=information`,
                        method: 'post',
                        data: null,
                      } as any,
                      {
                        onSuccess: (_: any) => {
                          refetchStep();
                          snackbar("گردش کار با موفقیت به کارتابل مراجع بالاتر ارسال گردید. پس از تایید دکمه <ادامه> فعال خواهد شد.", "success", 5000);
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

export default StartInspectionStep3;
