import { useEffect, useRef, useState } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import { Print } from '@mui/icons-material';
import { useReactToPrint } from 'react-to-print';
import { useNavigate } from 'react-router';
import BackButton from 'components/button/BackButton.tsx';
import { useApiQuery } from 'hooks/useApi.ts';
import InspectionApis from 'modules/inspection-operation/api.ts';

const SeasonOptions = [
  { value: 'first_season', label: 'فصل اول', color: '#92e481da' },
  { value: 'secound_season', label: 'فصل دوم', color: '#f3ed9aff' },
  { value: 'third_season', label: 'فصل سوم', color: '#ffd09aff' },
  { value: 'fourth_season', label: 'فصل چهارم', color: 'skyblue' },
];

const ForceOptions = [
  { key: 'nehaja', label: 'نهاجا' },
  { key: 'nepaja', label: 'نپاجا' },
  { key: 'sayer', label: 'ستادآجا' },
  { key: 'nedaja', label: 'نداجا' },
  { key: 'nezaja', label: 'نزاجا' },
];

export default function DeputyPlanningReport({ year, onBack = null }) {
  const navigate = useNavigate();

  const { data: report, isLoading } = useApiQuery<any>({
    url: InspectionApis.ExpertSuperVision.finalReport(year),
    select: res => res?.data ?? {},
    enabled: !!year,
  });

  const [formattedData, setFormattedData] = useState<any>({});

  useEffect(() => {
    if (!report?.organizations) return;

    const temp: any = {};

    report?.organizations.forEach(org => {
      temp[org.key] = {};
      org.season.forEach(season => {
        temp[org.key][season.season] = {};
        season.force.forEach(force => {
          temp[org.key][season.season][force.forceKey] =
            force.forceOrganizations
              ?.map((o: any) => o.organizationName)
              .join(', ') ?? '';
        });
      });
    });

    setFormattedData(temp);
  }, [report]);

  const ref = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: ref,
    pageStyle: `
      @page { size: A4 landscape; margin: 20mm; }
      .printable { direction: rtl; unicode-bidi: embed; }
    `,
  });

  const renderTable = () => (
    <div className="printable" ref={ref}>
      <Typography variant="h5" align="center" gutterBottom>
        طرح‌ریزی بازرسی و نظارت تخصصی - ستادی معاونت‌ها، سازمان‌ها و اداره‌های
        ستاد آجا - سال {report?.year}
      </Typography>

      <table
        style={{
          width: '100%',
          border: '3px solid #000',
          borderCollapse: 'collapse',
          textAlign: 'center',
        }}
      >
        <thead>
          <tr>
            <th style={{ border: '3px solid #000' }}>معاونت</th>
            <th style={{ border: '3px solid #000' }}>نیرو</th>
            {SeasonOptions.map(season => (
              <th key={season.value} style={{ border: '3px solid #000' }}>
                {season.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {report?.organizations?.map((org, orgIndex) =>
            ForceOptions.map((force, forceIndex) => (
              <tr key={`record-${orgIndex}-${forceIndex}`}>
                {forceIndex === 0 && (
                  <td style={{border: '3px solid #000'}} rowSpan={5}>{org.organizationName}</td>
                )}
                <td style={{border: '1px solid #ccc', borderBottom: forceIndex === 4 ? '3px solid #000' : '1px solid #ccc'}}>{force.label}</td>
                {SeasonOptions.map(season => (
                  <td
                    key={`record-${orgIndex}-${forceIndex}-${season.value}`}
                    style={{
                      border: '1px solid #ccc',
                      borderBottom: forceIndex === 4 ? '3px solid #000' : '1px solid #ccc',
                      backgroundColor: `${season.color}`,
                    }}
                  >
                    {formattedData?.[org.key]?.[season.value]?.[force.key] ??
                      '-'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <Box sx={{ overflowX: 'auto', width: '100%' }}>
      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: '2rem', mb: 2 }}
      >
        <Button
          sx={{ width: 150, height: 47 }}
          variant="contained"
          color="success"
          onClick={handlePrint}
        >
          <Print /> &nbsp; چاپ
        </Button>

        <BackButton onBack={onBack ? onBack : () => navigate(-1)} />
      </Grid>

      {isLoading && (
        <Typography sx={{ p: 2 }}>در حال دریافت اطلاعات...</Typography>
      )}

      {!isLoading && <Box sx={{ p: '1rem' }}>{renderTable()}</Box>}
    </Box>
  );
}
