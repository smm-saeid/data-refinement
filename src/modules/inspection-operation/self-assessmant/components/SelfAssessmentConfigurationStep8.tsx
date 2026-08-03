import { useLegacyApi } from '@/hooks/useLegacyApi';
import { useSnackbar } from '@/hooks/useSnackbar';
import { useMutation, useQuery } from '@tanstack/react-query';
import moment from 'moment-jalaali';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import ReactDOMServer from 'react-dom/server';
import { dateDiff } from '../../scheduled/utils/utils';
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
import MatnaEditor from '@/components/MatnaEditor';

export default function SelfAssessmentConfigurationStep8({ inspectionInformation, refetchStep }) {
  const jalaliStartDate = moment(inspectionInformation?.informationStartDate).format(
    'jYYYY/jMM/jDD'
  );
  const jalaliEndDate = moment(inspectionInformation?.informationEndDate).format('jYYYY/jMM/jDD')
  const jalaliYear = moment(inspectionInformation?.informationStartDate).format(
    'jYYYY'
  );
  const text = `<p style="text-align:center;">بسمه تعالی</p>
        <p style="text-align:center;"><img class="image_resized" style="aspect-ratio:485/533;width:7.69%;"
            src="/artesh.jpg" width="100%" height="100%"></p>
        <p style="text-align:center;">فرماندهی کل آجا</p>
        <h3 style="text-align: right">از: آجا (اداره عملیات بازرسی و پیگیری - عملیات بازرسی)<span>&nbsp;</span> </h3>
            <h4 style="margin-left: 10%"> :شماره</h4>
        <h3 style="text-align: right">به: امیر فرماندهی محترم کل آجا</h3>
           <h4 style="margin-left: 10%"> تاریخ: ${jalaliStartDate}</h4>

        <h3 style="text-align: right"> موضوع: بازرسی‌ها، نظارت‌های ستادی و ارزیابی‌های سال ${jalaliYear} </h3>
          <h4 style="margin-left: 10%">:پیوست</h4>
        <p style="text-align:right;">با صلوات بر محمد(ص) و آل محمد(ص)</p>
        <p style="text-align:right;"><span class="text-big"><strong>پیرو شماره:</strong>&nbsp;</span></p>
        <p style="text-align:right;">سلام علیکم،</p>
        <p style="text-align: right"><strong>1 ـ منظور:</strong></p>
        <p style="text-align: right;">در این ماده منظور از اجرای بازرسی ${inspectionInformation?.organizationUnitName} نوشته می شود.</p>
        <p style="text-align: right;"><strong>2ـ&nbsp; اهداف:</strong></p>
        <p style="text-align: right;">در این ماده هدف های بازرسی درج می شود.</p>
        <p style="text-align: right;"><span style="color:rgb(31,78,121);"><strong>الف)</strong></span></p>
        <p style="text-align: right;"><span style="color:rgb(31,78,121);"><strong>ب)&nbsp;</strong>&nbsp;</span></p>
        <p style="text-align: right;"><strong>3 ـ اجرا:</strong></p>
        <p style="text-align: right;"><strong>الف - تدبیر:</strong></p>
        <p style="text-align: right;">تدبیر سامانه فرماندهی درج می شود.</p>
        <p style="text-align: right;"><strong>ب - ترکیب هیئت/گروه/تیم بازرسی:&nbsp;</strong></p>
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
        <p><strong>- تاریخ شروع: ${jalaliStartDate} &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; -تاریخ پایان:${jalaliEndDate} &nbsp;
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
        <p style="text-align:right;"><strong>خ - گزارش ها و مدارک بازرسی:</strong></p>
        <p style="text-align:right;">(۱) گزارش رئیس و هر یک از اعضای هیئت/گروه/تیم بازرسی</p>
        <p style="text-align:right;">(۲) بازبینه های تکمیل شده</p>
        <p style="text-align:right;">(۳) جدول طبقه بندی یگان/سازمان مورد بازرسی</p>
        <p style="text-align:right;">(۴) آمار نیرو انسانی</p>
        <p style="text-align:right;">(۵) آمار جرائم و تخلفات</p>
        <p style="text-align:right;">(۶) آمار وسایل عمده</p>
        <p style="text-align:right;">(۷) نظریه رئیس هئیت/گروه/تیم بازررسی</p>
        <p style="text-align:right;">(۸) سایر مدارک مأخوذه از یگان/سازمان مورد بازرسی</p>
        <p style="text-align:right;"><strong>د - دستورهای هماهنگی:</strong></p>
        <p style="text-align:right;">&nbsp;</p>
        <p style="text-align:right;"><strong>۴ ـ دستورهای اداری و آماد و پشتیبانی:</strong></p>
        <p style="text-align:right;">&nbsp;</p>
        <p style="text-align:right;"><strong>۵ ـ نحوه ارتباط با سازمان بازرسی کننده:</strong></p>
        <p style="text-align:right;">&nbsp;</p>
        <p style="text-align:right;"><strong>امضا رئیس ... - ...</strong></p>
        <p style="text-align:right;">&nbsp;</p>
        <p style="text-align:right;">&nbsp;</p>
            <p style="text-align: end"> :پیوست ها</p>
        <p style="text-align:right;">&nbsp;</p>
            <p style="text-align: end"> : گیرندگان</p>

  `;
  const legacyApi = useLegacyApi();
  const { mutate } = useMutation({
    mutationFn: legacyApi.request,
  });
  const [issuanceInstruction, setIssuanceInstruction] = useState(null);
  const snackbar = useSnackbar();
  const navigate = useNavigate();

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
    },
  } as any);

  const findWeekDays = () => {
    if (
      !!inspectionInformation?.informationStartDate &&
      !!inspectionInformation?.informationEndDate
    ) {
      let weekDaysCount = 0;
      let start = inspectionInformation?.informationStartDate.getDay();
      for (
        let i = 0;
        i <
        dateDiff(
          inspectionInformation?.informationStartDate,
          inspectionInformation?.informationEndDate
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
                  <th>----</th>
                  <th>${leadInitialInfo?.organizationUnitName}</th>
                  <th>${leadInitialInfo?.name} ${leadInitialInfo?.family}</th>
                  <th>رئیس هیئت بازرسی</th>
                </tr>
                ${ReactDOMServer.renderToString(
                  experts?.map((skill: any, index: any) => (
                    <tr>
                      <td>{index + 2}</td>
                      <td> ---- </td>
                      <td>{skill?.organizationUnitName}</td>
                      <td>{skill?.name + ' ' + skill?.family}</td>
                      <td>{skill?.position}</td>
                    </tr>
                  ))
                )}
                </tbody>
            </table> `;

  const insertIntoHtml = (issuanceInstruction: string) => {
    let doc = new DOMParser().parseFromString(issuanceInstruction, 'text/html');
    let insTable = doc.getElementsByClassName('table');
    if (insTable.length > 0) {
      insTable[0].innerHTML = inspectionTable;
    } else {
      let newDoc = doc.createElement('div');
      newDoc.innerHTML = inspectionTable;
    }

    let orgName = doc.getElementById('org-name');
    if (orgName != null) {
      orgName.innerHTML = inspectionInformation?.organizationUnitName;
    }

    let yearName = doc.getElementById('year');
    if (yearName != null) {
      yearName.innerHTML = inspectionInformation?.informationStartDate
        ? moment(inspectionInformation?.informationStartDate).format('jYYYY')
        : '-';
    }

    let fromDate = doc.getElementById('from-date');
    if (fromDate != null) {
      fromDate.innerHTML = inspectionInformation?.informationStartDate
        ? moment(inspectionInformation?.informationStartDate).format(
            'jYYYY/jMM/jDD'
          )
        : '-';
    }

    let duration = doc.getElementById('duration');
    if (duration != null) {
      duration.innerHTML = findWeekDays().toString();
    }

    let numberOfInspectors = doc.getElementById('number-of-inspectors');
    if (numberOfInspectors != null) {
      numberOfInspectors.innerHTML = experts.length.toString();
    }

    setIssuanceInstruction(doc.documentElement.innerHTML);
    return doc.documentElement.innerHTML;
  };

  useEffect(() => {
    if (
      inspectionInformation != null &&
      experts != null &&
      leadInitialInfo != null
    ) {
      if (inspectionInformation.issuanceInstruction != null) {
        setIssuanceInstruction(inspectionInformation.issuanceInstruction);
      } else {
        setIssuanceInstruction(insertIntoHtml(text));
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
      {!issuanceInstruction ? (
        <Skeleton height={1000} />
      ) : (
        <Grid
          container
          display={'flex'}
          justifyContent={'center'}
          alignContent={'center'}
        >
          <MatnaEditor
            onChange={(_, myeditor) => {
              setIssuanceInstruction(myeditor.getData());
            }}
            initialData={issuanceInstruction}
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
              disabled={inspectionInformation?.instructionStatus == 'approved'}
              color="success"
              onClick={() => setSendModalIsOpen(true)}
              sx={{ margin: '10px' }}
            >
              ثبت و ارسال به کارتابل
            </Button>
            <Button
              variant={'contained'}
              onClick={() => {
                mutate(
                  {
                    entity: `information/end?inspectionId=${inspectionInformation.inspectionId}`,
                    method: 'post',
                  },
                  {
                    onSuccess: () => {
                      navigate('/operation/self-assessment');
                    },
                  }
                );
              }}
              sx={{ margin: '10px' }}
            >
              ثبت نهایی{' '}
              {inspectionInformation?.instructionStatus == 'approved'
                ? ''
                : inspectionInformation?.instructionStatus == 'cartabling'
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
                    issuanceInstruction: null,
                    state: 'EKHTESAS_BAZBINEH',
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
                          snackbar(
                            'دستورالعمل با موفقیت به کارتابل مراجع بالاتر ارسال گردید. پس از تایید دکمه <ادامه> فعال خواهد شد.',
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
