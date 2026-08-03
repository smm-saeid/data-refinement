import moment from 'moment-jalaali';
import { dateDiff } from '../../scheduled/utils/utils';
import { useEffect, useState } from 'react';
import { useLegacyApi } from '@/hooks/useLegacyApi';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSnackbar } from '@/hooks/useSnackbar';
import ReactDOMServer from 'react-dom/server';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Skeleton } from '@mui/material';
import MatnaEditor from '@/components/MatnaEditor';

export default function SelfAssessmentConfigurationStep4({inspectionInformation, refetchStep}) {
  const jalaliDate = moment(inspectionInformation?.informationStartDate).format('jYYYY/jMM/jDD');
      const text = `
<p style="text-align: center">بسمه تعالی</p>
<p style="text-align: center">
  <img
    class="image_resized"
    style="aspect-ratio: 485/533; width: 7.69%"
    src="/src/assets/aja-logo.png"
    width="485"
    height="533"
  />
</p>
<p style="text-align: center">فرماندهی کل آجا</p>
<h3>
  از: آجا (اداره عملیات بازرسی و پیگیری - عملیات بازرسی)<span class="text-tiny"
    >&nbsp;</span
  >
  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
  &nbsp;شماره:
</h3>
<h3>
  به: امیر فرماندهی محترم کل آجا &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
  &nbsp; تاریخ: ${jalaliDate}
</h3>
<h3>
  موضوع: بازرسی خودارزیابی از    ${inspectionInformation?.organizationUnitName}<span id="org-name"></span> &nbsp; &nbsp; &nbsp;
  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
  پیوست:
</h3>
<p style="text-align: center">با صلوات بر محمد(ص) و آل محمد(ص)</p>
<p style="text-align: center">
  <span class="text-big"><strong>«گردشکار»</strong></span>
</p>
<p>سلام علیکم، با احترام</p>
<p style="text-align: justify"><strong>1. سابقه:</strong></p>
<p>
  برابر طرح مصوب بازرسی‌ها و نظارت‌های ستادی سال
  <strong>
    <span id="year"></span>
  </strong>
  و درراستای اجرای اوامر صادره در نظر است. وفق برنامه زمان‌بندی شده از تاریخ
  <strong>
    <span id="from-date"></span>
  </strong>
  به مدت روز کاری از
  <strong>
    <span id="duraion"></span>
  </strong>
  توسط هیئتی به استعداد
  <strong>
    <span id="number-of-inspectors"></span>
  </strong>
  نفر به شرح تخصص های مندرج در جدول بازرسی برنامه ای به عمل می آید.
  <strong>(سابقه)</strong>
</p>
<p style="text-align: justify"><strong>2. ترکیب هیئت بازرسی:</strong></p>
<figure class="table"></figure>
<p style="text-align: justify">
  <strong>3.</strong> به منظور سرپرستی و هدایت مذکور،<strong>--</strong>(رئیس
  اداره عملیات بازرسی و پیگیری) معاونت بازرسی و ایمنی آجا در نظر گرفته شده است.
</p>
<p style="text-align:justify;">4.&nbsp; مراتب انجام بازرسی به یگان <strong>${inspectionInformation?.organizationUnitName}</strong> ابلاغ گردد.</p>
<p style="text-align:justify;">5. مراتب جهت استحضار و صدور اوامر عالی به عرض می‌رسد.</p>
<p style="text-align:justify;">&nbsp;</p>
<p><strong>معاون بازرسي و ایمنی آجا ـ سرتیپ ستاد ابوالفضل سپهری راد</strong></p>
<p><strong>&nbsp;</strong></p>
<p>&nbsp;</p>
<p><strong>اوامر امیر ریاست محترم ستاد و معاون هماهنگ‌کننده آجا :</strong></p>
<p><strong>&nbsp;</strong></p>
<p><strong>&nbsp;</strong></p>
<p><strong>نظريه امیر جانشین محترم رئیس ستاد و معاون هماهنگ‌کننده آجا :</strong></p>
<p>&nbsp;</p>
<p>&nbsp;</p>
<p style="text-align:left;"><strong>جانشین معاونت بازرسی و ایمنی آجا – سرتیپ‌دوّم ستاد علی عزیزی</strong></p>
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
    const legacyApi = useLegacyApi();
    const { mutate } = useMutation({
      mutationFn: legacyApi.request,
    });
    const [issuanceInformation, setIssuanceInformation] = useState(null);
    const snackbar = useSnackbar();
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

    const findWeekDays = () => {
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
      return null;
    };

    const [backModalIsOpen, setBackModalIsOpen] = useState(false);
    const [sendModalIsOpen, setSendModalIsOpen] = useState(false);

    const inspectionTable = `<table style={margin: "10px", align: "center"}>
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
                      <td>{index + 2}</td>
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

      newhtml = newhtml.replaceAll('var-table', inspectionTable);

      newhtml = newhtml.replaceAll(
        'var-current-date',
        moment(new Date()).format('jYYYY/jMM/jDD')
      );

      newhtml = newhtml.replaceAll(
        'var-org-name',
        inspectionInformation?.organizationUnitName
      );

      newhtml = newhtml.replaceAll(
        'var-year',
        inspectionInformation?.informationStartDate
          ? moment(inspectionInformation?.informationStartDate).format('jYYYY')
          : '-'
      );

      newhtml = newhtml.replaceAll(
        'var-from-date',
        inspectionInformation?.informationStartDate
          ? moment(inspectionInformation?.informationStartDate).format(
              'jYYYY/jMM/jDD'
            )
          : '-'
      );

      newhtml = newhtml.replaceAll('var-duration', findWeekDays().toString());

      newhtml = newhtml.replaceAll(
        'var-number-of-inspectors',
        experts.length.toString()
      );

      newhtml = newhtml.replaceAll(
        'var-lead-name',
        leadInitialInfo.name + ' ' + leadInitialInfo.family
      );

      setIssuanceInformation(newhtml);
      return newhtml;
    };

    useEffect(() => {
      if (
        inspectionInformation != null &&
        experts != null &&
        leadInitialInfo != null
      ) {
        if (inspectionInformation.issuanceInformation != null) {
          setIssuanceInformation(inspectionInformation.issuanceInformation);
        } else {
          setIssuanceInformation(insertIntoHtml(text));
        }
      }
    }, [inspectionInformation, experts, leadInitialInfo]);

    return (
      <Box
        margin={'10px'}
        sx={{
          backgroundColor: 'white',
          color: 'black',
          fontFamily: 'Nazanin',
          lineHeight: '40px',
        }}
      >
        {!issuanceInformation ? (
          <Skeleton height={1000} />
        ) : (
          <Grid container display={"flex"} justifyContent={"center"} alignContent={"center"}>
          <MatnaEditor
            onChange={(_, myeditor) => {
              setIssuanceInformation(myeditor.getData());
            }}
            initialData={issuanceInformation}
          />
          </Grid>
        )}
        <Box margin={'50px'}>
          <Grid container display={"flex"} justifyContent={"center"} alignItems={"center"}>
            <Grid size={{ xs: 8 }}>
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
                disabled={
                  inspectionInformation?.informationStatus == 'approved'
                }
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
                      entity: `/information`,
                      method: 'put',
                      data: {
                        ...inspectionInformation,
                        state: 'EKHTESAS_AFRAD',
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
                ادامه{' '}
                {inspectionInformation?.informationStatus == 'approved'
                  ? ''
                  : inspectionInformation?.informationStatus == 'cartabling'
                    ? '(در انتظار تایید)'
                    : '(در انتظار ارسال)'}
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
                      state: 'TAKHASOS_ESTEHZARIYE',
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
                            snackbar(
                              'استحضاریه با موفقیت به کارتابل مراجع بالاتر ارسال گردید. پس از تایید دکمه <ادامه> فعال خواهد شد.',
                              'success',
                              5000
                            );
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
  }
