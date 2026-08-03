import moment from 'moment-jalaali';
import ReactDOMServer from 'react-dom/server';

export const generateHeadReportHtml = (
  inspectionData: any,
  reviewsData: any,
  experts: any[],
  encouragement: any[],
  infoData: any
) => {
  if (!reviewsData || !inspectionData) return '';

  const { finalReviewReports, finalReport } = reviewsData;

  const AreasList = () => (
    <ul>
      {finalReport?.reports?.map((item: any, idx: number) => (
        <li key={idx}>
          <p style={{ textAlign: 'justify' }}>{item?.name}</p>
        </li>
      ))}
    </ul>
  );

  const ExpertsTableRows = () => (
    <>
      {experts?.map((item: any, index: number) => (
        <tr key={index}>
          <td style={{ textAlign: 'center' }}><strong>{index + 1}</strong></td>
          <td style={{ textAlign: 'center' }}>{item?.degree}</td>
          <td style={{ textAlign: 'center' }}>{item?.name} {item?.family}</td>
          <td style={{ textAlign: 'center' }}>{item?.organizationUnitName}</td>
          <td style={{ textAlign: 'center' }}>{item?.position}</td>
        </tr>
      ))}
    </>
  );

  const FindingsList = () => (
    <>
      {finalReviewReports?.map((item: any, idx: number) => {
        const dto = item?.personSpecialityReviewGroupDto;
        const groupName = dto?.reviewGroupName || '---';

        return (
          <div key={idx}>
            <p>
              <span style={{ color: '#0070c0' }}>
                <i><strong>{groupName}</strong></i>
              </span>
            </p>

            {item?.advantages?.length > 0 && <p>الف – محاسن:</p>}
            {item?.advantages?.map((a: any, i: number) => (
              <p key={`adv-${i}`}>{i + 1}. {a?.description}</p>
            ))}

            {item?.deficiencies?.filter((x: any) => x.type === 'نقص').length > 0 && <p>ب – نواقص:</p>}
            {item?.deficiencies?.filter((x: any) => x.type === 'نقص').map((a: any, i: number) => (
              <p key={`def-d-${i}`}>{i + 1}. {a?.description}</p>
            ))}

            {item?.deficiencies?.filter((x: any) => x.type === 'عیب').length > 0 && <p>پ – معایب:</p>}
            {item?.deficiencies?.filter((x: any) => x.type === 'عیب').map((a: any, i: number) => (
              <p key={`def-f-${i}`}>{i + 1}. {a?.description}</p>
            ))}
          </div>
        );
      })}
    </>
  );

  return `
    <p style="text-align:center;">
        <img class="image_resized" style="width:10%;" src="/assets/images/besme.png">
    </p>
    <p style="text-align:center;">
        <span style="color:#c00000; font-weight:bold;">گزارش نتیجه بازرسی برنامه‌ای از ${inspectionData?.organizationUnitName}&nbsp;</span>
    </p>

    <p style="text-align:justify;">
        <span class="text-big" style="color:#002060;"><strong>1. </strong></span>
        <span class="text-big"><strong>کليات:</strong></span>
    </p>
    
    <p style="text-align:justify;">
        در اجرای اوامر صادره، هیئت بازرسی از تاریخ <span style="color:#ff0000;">${moment(infoData?.informationStartDate).format('jYYYY/jMM/jDD')}</span> 
        از یگان <span style="color:#0070c0;"><strong>${inspectionData?.organizationUnitName}</strong></span> بازرسی به عمل آورد.
    </p>
    
    <p>الف- قسمت‌ها و زمینه‌های مورد بازرسی:</p>
    ${ReactDOMServer.renderToString(<AreasList />)}

    <p>ب- ترکیب هیئت بازرسی:</p>
    <figure class="table">
        <table>
            <thead>
                <tr>
                    <th>رديف</th>
                    <th>درجه</th>
                    <th>نام و نشان</th>
                    <th>قسمت/يگان</th>
                    <th>مسئولیت</th>
                </tr>
            </thead>
            <tbody>
                ${ReactDOMServer.renderToString(<ExpertsTableRows />)}
            </tbody>
        </table>
    </figure>

    <p style="text-align:justify;">
        <span class="text-big" style="color:#002060;"><strong>2. </strong></span>
        <span class="text-big"><strong>نکات مهم مشهود در بازرسی:</strong></span>
    </p>
    ${ReactDOMServer.renderToString(<FindingsList />)}

    <p style="text-align:justify;">
        <span class="text-big" style="color:#002060;"><strong>3. </strong></span>
        <span class="text-big"><strong>نتیجه نهایی:</strong></span>
    </p>
    <p>نمره نهایی بهره‌وری: <strong>${finalReport?.finalGradeAfterEffect?.toFixed(2)}</strong></p>
  `;
};