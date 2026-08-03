import { useApiQuery } from 'hooks/useApi.ts';
import { useNavigate, useParams } from 'react-router';
import InspectionApis from 'modules/inspection-operation/api.ts';
import { Box, Button, Grid, Typography } from '@mui/material';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Print } from '@mui/icons-material';
import BackButton from 'components/button/BackButton.tsx';
import {
  InspectionTypeLabels,
  SeasonOptions,
} from 'modules/inspection-operation/planning-aja/types.ts';

export default function Conflicts() {
  const { year } = useParams();

  const { data, isLoading } = useApiQuery({
    url: InspectionApis.annualPlanning.conflicts(year),
    enabled: !!year,
  });

  const navigate = useNavigate();

  const ref = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: ref,
    pageStyle: `
      @page { size: A4 landscape; margin: 20mm; }
      .printable { direction: rtl; unicode-bidi: embed; }
    `,
  });

  const getConflictText = (conflicts) => {
    return conflicts.map((conflict) => `${getLabelOfInspectionType(conflict.inspectionTypeKey)} (${conflict.organizationDeputyName})`).join(', ');
  }

  const getLabelOfInspectionType = inspectionKey => {
    if (InspectionTypeLabels[inspectionKey]) {
      return InspectionTypeLabels[inspectionKey];
    } else if (inspectionKey == 'supervision') {
      return 'بازرسی تخصصی معاونت ها';
    } else if (inspectionKey == 'scope') {
      return 'بازرسی تجمیعی حوزه های بازرسی';
    }
    return 'بازرسی نامشخص';
  };

  const renderTable = () => (
    <div className="printable" ref={ref}>
      <Typography variant="h5" align="center" gutterBottom>
        لیست تداخلات طرح ریزی بازرسی ها - سال {year}
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
            <th style={{ border: '3px solid #000' }}>شماره</th>
            <th style={{ border: '3px solid #000' }}>یگان</th>
            <th style={{ border: '3px solid #000' }}>نیرو</th>
            {SeasonOptions.map(season => (
              <th key={season.value} style={{ border: '3px solid #000' }}>
                {season.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.data?.map((item, itemIndex) => (
            <tr key={`row-${itemIndex}`}>
              <td style={{ border: '1px solid #000' }}>{itemIndex + 1}</td>
              <td style={{ border: '1px solid #000' }}>
                {item.organizationUnitName}
              </td>
              <td style={{ border: '1px solid #000' }}>
                {item.forceUnitName}
              </td>
              {SeasonOptions.map(season => (
                <td
                  key={`row-${itemIndex}-${season.value}`}
                  style={{ border: '1px solid #000' }}
                >
                  {getConflictText(item['seasonAndInspection'][season.value])}
                </td>
              ))}
            </tr>
          ))}
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

        <BackButton onBack={() => navigate(-1)} />
      </Grid>

      {isLoading && (
        <Typography sx={{ p: 2 }}>در حال دریافت اطلاعات...</Typography>
      )}

      {!isLoading && <Box sx={{ p: '1rem' }}>{renderTable()}</Box>}
    </Box>
  );
}
