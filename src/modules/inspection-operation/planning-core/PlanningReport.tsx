import { useApiQuery } from 'hooks/useApi.ts';
import type { FinalReportData } from 'modules/inspection-operation/types.ts';
import InspectionApis from 'modules/inspection-operation/api.ts';
import {
  OrganizationOptions,
  InspectionTypeOptions,
  SeasonOptions,
  ProvincialInspectionTypes,
} from 'modules/inspection-operation/planning-aja/types.ts';
import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import { Print } from '@mui/icons-material';
import { useReactToPrint } from 'react-to-print';
import { useNavigate, useParams } from 'react-router';
import BackButton from 'components/button/BackButton.tsx';

export default function PlanningReport({annualPlanningId, onBack = null}) {
  const { id } = useParams();

  const { data: planningData } = useApiQuery<
    FinalReportData,
    any,
    any,
    FinalReportData
  >({
    url: InspectionApis.annualPlanning.find(id ?? annualPlanningId),
    select: (response): FinalReportData =>
      response?.data ?? ({} as FinalReportData),
    enabled: !!id || !!annualPlanningId,
  });

  const { data: planningReport, isLoading } = useApiQuery<
    FinalReportData,
    any,
    any,
    FinalReportData
  >({
    url: InspectionApis.annualPlanning.finalReport(planningData?.year),
    select: (response): FinalReportData =>
      response?.data ?? ({} as FinalReportData),
    enabled: !!planningData?.year,
  });

  const [formattedData, setFormattedData] = useState({});

  useEffect(() => {
    const temp = {};

    SeasonOptions.forEach((season, seasonIndex) => {
      temp[season.value] = {};
      InspectionTypeOptions.forEach((inspectionType, inspectionTypeIndex) => {
        temp[season.value][inspectionType.key] = {};
        OrganizationOptions.forEach((unit, unitIndex) => {
          temp[season.value][inspectionType.key][unit.key] = '';
          temp[season.value][inspectionType.key].provinces = '';
        });
      });
    });

    planningReport?.inspectionType?.forEach(inspectionTypeData => {
      inspectionTypeData?.season?.forEach(season => {
        season?.organizations?.forEach(orgData => {
          if (temp[season.season][inspectionTypeData.key])
            temp[season.season][inspectionTypeData.key][orgData.forceKey] =
              orgData.units?.map(i => i.organizationName).join(', ');
        });
      });

      inspectionTypeData?.provinces?.forEach(province => {
        temp[province.season][inspectionTypeData.key].provinces +=
          `${province.provinceName}, `;
      });
    });

    setFormattedData(temp);
  }, [planningReport]);

  const ref = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: ref,

    pageStyle: `
    @page{
      size: A4 landscape;
      margin 20mm;
      
    }

  .printable {
    direction: rtl;
    unicode-bidi: embed;
  }
    `,
  });

  const renderTable = () => {
    return (
      <div className="printable" ref={ref}>
        <Typography variant="h5" align="center" gutterBottom>
        برنامه بازرسی‌ها، نظارت و ارزیابی‌‌های پیش‌بینی‌شده سال {planningReport?.year} معاونت بازرسی و ایمنی آجا
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
              <th style={{ border: '1px solid #ccc' }}>فصل</th>
              <th style={{ border: '1px solid #ccc' }}>نیرو</th>
              {InspectionTypeOptions.map(inspectionType => (
                <th
                  style={{ border: '1px solid #ccc' }}
                  key={`th${inspectionType.key}`}
                >
                  {inspectionType.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SeasonOptions.map((season, seasonIndex) =>
              OrganizationOptions.map((unit, unitIndex) => (
                <tr key={`tr${seasonIndex}-${unitIndex}`} style={{backgroundColor: `${season.color}`}}>
                  {unitIndex === 0 && (
                    <td
                      style={{ border: '1px solid #ccc' }}
                      rowSpan={OrganizationOptions.length}
                    >
                      {season.label}
                    </td>
                  )}
                  <td style={{ border: '1px solid #ccc' }}>{unit.label}</td>
                  {InspectionTypeOptions.map(inspectionType => {
                    if (
                      !ProvincialInspectionTypes.includes(inspectionType.key)
                    ) {
                      if (
                        formattedData &&
                        formattedData[season.value] &&
                        formattedData[season.value][inspectionType.key][
                          unit.key
                        ]
                      )
                        return (
                          <td style={{ border: '1px solid #ccc' }}>
                            {
                              formattedData[season.value][inspectionType.key][
                                unit.key
                              ]
                            }
                          </td>
                        );
                      else {
                        return <td style={{ border: '1px solid #ccc' }}></td>;
                      }
                    } else {
                      if (
                        formattedData &&
                        formattedData[season.value] &&
                        formattedData[season.value][inspectionType.key]
                          .provinces &&
                        unitIndex === 0
                      ) {
                        return (
                          <td rowSpan={5} style={{ border: '1px solid #ccc' }}>
                            {
                              formattedData[season.value][inspectionType.key]
                                .provinces
                            }
                          </td>
                        );
                      } else if (unitIndex === 0) {
                        return (
                          <td
                            rowSpan={5}
                            style={{ border: '1px solid #ccc' }}
                          ></td>
                        );
                      }
                    }
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <Box sx={{ overflowX: 'auto', width: '100%' }}>
      <Grid
        sx={{ paddingX: '2rem' }}
        container
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <Button
          sx={{ width: 150, height: 47, marginRight: 2 }}
          variant="contained"
          color="success"
          onClick={handlePrint}
        >
          <Print /> &nbsp; چاپ
        </Button>
        {!!onBack ? <BackButton onBack={onBack} /> :
        <BackButton/>}
      </Grid>

      {isLoading && (
        <Typography variant="h6" component={'h6'}>
          در حال دریافت اطلاعات...
        </Typography>
      )}

      {!isLoading && <Grid sx={{ padding: '1rem' }}>{renderTable()}</Grid>}
    </Box>
  );
}
