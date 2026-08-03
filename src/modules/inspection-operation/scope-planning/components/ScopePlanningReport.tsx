import { useApiQuery } from 'hooks/useApi.ts';
import InspectionApis from 'modules/inspection-operation/api.ts';
import {
  OrganizationOptions,
  SeasonOptions,
} from 'modules/inspection-operation/planning-aja/types.ts';
import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import { Print } from '@mui/icons-material';
import { useReactToPrint } from 'react-to-print';
import { useNavigate, useParams } from 'react-router';
import BackButton from 'components/button/BackButton.tsx';

const ScopeOptions = [
  { key: 'IMENI', label: 'ایمنی' },
  { key: 'ARZYABI', label: 'ارزیابی' },
  { key: 'SIANAT', label: 'صیانت و رسیدگی' },
  { key: 'TARH_VA_BARNAMEH', label: 'طرح و برنامه' },
];

export default function ScopePlanningReport({ year, onBack = null }) {
  const navigate = useNavigate();

  const { data: planningReport, isLoading } = useApiQuery<any>({
    url: InspectionApis.scopePlanning.finalReport(year),
    select: res => res?.data ?? {},
    enabled: !!year,
  });

  const [formattedData, setFormattedData] = useState<any>({});

  useEffect(() => {
    const temp: any = {};

    // init
    SeasonOptions.forEach(season => {
      temp[season.value] = {};
      ScopeOptions.forEach(scope => {
        temp[season.value][scope.key] = {};
        OrganizationOptions.forEach(org => {
          temp[season.value][scope.key][org.key] = '';
        });
      });
    });

    // fill
    planningReport?.organizations?.forEach(scope => {
      scope?.season?.forEach(season => {
        season?.force?.forEach(force => {
          temp[season.season][scope.key][force.forceKey] =
            force.forceOrganizations?.map(o => o.organizationName).join(', ');
        });
      });
    });

    setFormattedData(temp);
  }, [planningReport]);

  const ref = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: ref,
    pageStyle: `
      @page {
        size: A4 landscape;
        margin: 20mm;
      }
      .printable {
        direction: rtl;
        unicode-bidi: embed;
      }
    `,
  });

  const renderTable = () => (
    <div className="printable" ref={ref}>
      <Typography variant="h5" align="center" gutterBottom>
        بازرسی‌های تجمیعی حوزه ایمنی، ارزشیابی، صیانت و رسیدگی‌ها و طرح و برنامه
        سال {planningReport?.year}
      </Typography>

      <table
        style={{
          width: '100%',
          border: '1px solid #ccc',
          textAlign: 'center',
        }}
      >
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', width: '100px' }}>فصل</th>
            <th style={{ border: '1px solid #ccc', width: '100px' }}>نیرو</th>
            {ScopeOptions.map(scope => (
              <th
                key={scope.key}
                style={{ border: '1px solid #ccc', width: '200px' }}
              >
                {scope.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {SeasonOptions.map((season, seasonIndex) =>
            OrganizationOptions.map((org, orgIndex) => (
              <tr
                key={`${seasonIndex}-${orgIndex}`}
                style={{ backgroundColor: season.color }}
              >
                {orgIndex === 0 && (
                  <td
                    rowSpan={OrganizationOptions.length}
                    style={{
                      border: '1px solid #ccc',
                      backgroundColor: '#fff',
                    }}
                  >
                    {season.label}
                  </td>
                )}

                <td
                  style={{ border: '1px solid #ccc', backgroundColor: '#fff' }}
                >
                  {org.label}
                </td>

                {ScopeOptions.map(scope => (
                  <td key={scope.key} style={{ border: '1px solid #ccc' }}>
                    {formattedData?.[season.value]?.[scope.key]?.[org.key] ??
                      ''}
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
        sx={{ px: '2rem' }}
        container
        alignItems="center"
        justifyContent="space-between"
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

      {!isLoading && <Grid sx={{ p: '1rem' }}>{renderTable()}</Grid>}
    </Box>
  );
}
