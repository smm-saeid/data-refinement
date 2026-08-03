import React, { useEffect, useState } from 'react';
import type { GridColDef } from '@mui/x-data-grid';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Alert,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import { Visibility, Print, FilterAlt } from '@mui/icons-material';
import { MatnaDataGrid } from '@/components/data-grid/MatnaDataGrid';
import type { PersonnelDetails, FilterType, Personnel } from './types.ts';

export default function MatchingHamtayabi() {
  const [hrToken, setHrToken] = useState<string>('');
  const [personnelData, setPersonnelData] = useState<Personnel[]>([]);
  const [filteredPersonnelData, setFilteredPersonnelData] = useState<
    Personnel[]
  >([]);
  const [selectedPersonnel, setSelectedPersonnel] = useState<Personnel | null>(
    null
  );
  const [personnelDetails, setPersonnelDetails] =
    useState<PersonnelDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [searchError, setSearchError] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [personnelNumber, setPersonnelNumber] = useState<string>('');

  const [filters, setFilters] = useState<FilterType>({
    jobPosition: '',
    force: '',
  });

  const [jobPositionOptions, setJobPositionOptions] = useState<string[]>([]);
  const [forceOptions, setForceOptions] = useState<string[]>([]);

  useEffect(() => {
    const authenticate = async () => {
      try {
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
        const urlencoded = new URLSearchParams();
        urlencoded.append('client_id', 'hr-baseinformation-srv');
        urlencoded.append('client_secret', 'mgQTS7igHppxyGqszYPlCZzgqSsbPKa5');
        urlencoded.append('grant_type', 'password');
        urlencoded.append('username', 'shabab');
        urlencoded.append('password', '123');

        const response = await fetch(
          'http://192.180.9.111:9080/auth/realms/mtna/protocol/openid-connect/token',
          {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
          }
        );

        if (!response.ok) {
          throw new Error(`خطای HTTP! وضعیت: ${response.status}`);
        }

        const result = await response.json();

        if (result?.access_token) {
          setHrToken(result.access_token);
          setAuthError('');
        } else {
          throw new Error('توکن دسترسی در پاسخ وجود ندارد');
        }
      } catch (error) {
        console.error('خطای احراز هویت:', error);
        setAuthError(`خطا در دریافت توکن`);
      }
    };
    authenticate();
  }, []);
  const getPersonnelData = async (personnelNumber: string): Promise<any> => {
    const myHeaders = new Headers();
    if (hrToken) {
      myHeaders.append('Authorization', `Bearer ${hrToken}`);
    }
    myHeaders.append('accept', '*/*');

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
    };
    try {
      const response = await fetch(
        `http://192.180.9.111:8000/api/personnel-informations/personnel-number/${personnelNumber}`,
        requestOptions
      );

      if (!response.ok) {
        throw new Error(`خطای HTTP! وضعیت: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching personnel data:', error);
      throw error;
    }
  };

  const getPersonnelFullDetails = async (personnelId: string): Promise<any> => {
    const myHeaders = new Headers();
    if (hrToken) {
      myHeaders.append('Authorization', `Bearer ${hrToken}`);
    }
    myHeaders.append('accept', '*/*');

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
    };

    try {
      const response = await fetch(
        `http://192.180.9.111:8000/api/full-status/personnel-id/${personnelId}`,
        requestOptions
      );

      if (!response.ok) {
        throw new Error(`خطای HTTP! وضعیت: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching personnel details:', error);
      throw error;
    }
  };
  const handleViewDetails = async (personnel: Personnel) => {
    if (!hrToken) {
      console.log('توکن موجود نیست');
      return;
    }
    console.log('مشاهده جزئیات برای:', personnel);
    setIsLoadingDetails(true);
    setSelectedPersonnel(personnel);

    try {
      const details = await getPersonnelFullDetails(personnel.personnelId);
      setPersonnelDetails(details?.data || {} || personnelDetails);
      console.log('جزئیات پرسنل دریافت شد:', details);
    } catch (error) {
      console.error('خطا در دریافت جزئیات:', error);
      setPersonnelDetails(null);
    } finally {
      setIsLoadingDetails(false);
    }
  };
  const applyFilters = () => {
    let filteredData = [...personnelData];

    if (filters.jobPosition) {
      filteredData = filteredData.filter(
        person =>
          person.jobTitle?.includes(filters.jobPosition) ||
          person.organizationDegreeTitle?.includes(filters.jobPosition)
      );
    }

    if (filters.force) {
      filteredData = filteredData.filter(
        person =>
          person.militaryCrustTitle?.includes(filters.force) ||
          person.cdCommonBaseDataCategoryTitle?.includes(filters.force)
      );
    }

    setFilteredPersonnelData(filteredData);
  };
  // const clearFilters = () => {
  //   setFilters({
  //     jobPosition: '',
  //     force: '',
  //   });
  //   setFilteredPersonnelData(personnelData);
  // };

  useEffect(() => {
    if (personnelData.length > 0) {
      setFilteredPersonnelData(personnelData);

      const jobPositions = Array.from(
        new Set(
          personnelData
            .map(person => person.jobTitle || person.organizationDegreeTitle)
            .filter(Boolean)
        )
      ) as string[];

      const forces = Array.from(
        new Set(
          personnelData
            .map(
              person =>
                person.militaryCrustTitle ||
                person.cdCommonBaseDataCategoryTitle
            )
            .filter(Boolean)
        )
      ) as string[];

      setJobPositionOptions(jobPositions);
      setForceOptions(forces);
    }
  }, [personnelData]);
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const printContent = `
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <title>پرینت فرم همتایابی</title>
        <meta charset="utf-8">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
         
          body {
            font-family: 'Tahoma', 'Arial', sans-serif;
            font-size: 9px;
            line-height: 1.3;
            direction: rtl;
            margin: 0;
            padding: 10px;
            color: #000;
            background: #fff;
          }
          
          .print-container {
            width: 100%;
            margin: 0 auto;
          }
          
          .print-header {
            text-align: center;
            margin-bottom: 15px;
            padding: 10px;
            border-bottom: 2px solid #333;
          }
          
          .print-header h1 {
            font-size: 16px;
            margin-bottom: 5px;
            color: #000;
          }
          
          .print-header h2 {
            font-size: 12px;
            color: #666;
          }
          
          .personnel-info {
            background: #f8f9fa;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 8px;
            margin-bottom: 12px;
          }
          
          .info-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
          }
          
          .info-item {
            display: flex;
            align-items: center;
          }
          
          .info-item strong {
            margin-left: 5px;
            color: #333;
          }

          .filters-info {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 4px;
            padding: 6px;
            margin-bottom: 10px;
            font-size: 8px;
          }
          
          .filter-chips {
            display: flex;
            gap: 5px;
            flex-wrap: wrap;
            margin-top: 3px;
          }
          
          .filter-chip {
            background: #e9ecef;
            padding: 2px 6px;
            border-radius: 12px;
            font-size: 7px;
            border: 1px solid #dee2e6;
          }
          
          /* Table styles */
          .print-table-container {
            width: 100%;
            overflow: hidden;
            margin-top: 10px;
          }
          
          .data-table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid #000;
            font-size: 8px;
          }
          
          .data-table th {
            background: #e0e0e0;
            border: 1px solid #000;
            padding: 4px 3px;
            text-align: center;
            font-weight: bold;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          .data-table td {
            border: 1px solid #000;
            padding: 4px 3px;
            text-align: center;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          .table-row {
            page-break-inside: avoid;
          }
          
          /* Print specific styles */
          @media print {
            @page {
              margin: 0.5cm;
              size: A4 landscape;
            }
            
            body {
              margin: 0;
              padding: 0;
              font-size: 8px;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              
            }
            
            .print-container {
              width: 100%;
              margin: 0;
              padding: 0;
              font-size: 10px;

            }
            
            .data-table {
              font-size: 10px;
            }
            
            .data-table th,
            .data-table td {
              padding: 3px 2px;
            }
          }
          
          .print-footer {
            margin-top: 15px;
            padding-top: 8px;
            border-top: 1px solid #ccc;
            text-align: left;
            font-size: 8px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="print-container">
          <div class="print-header">
            <h1>فرم همتایابی و جانشین پروری</h1>
            <h2>سامانه مدیریت منابع انسانی</h2>
          </div>
          
   
          ${
      filters.jobPosition || filters.force
        ? `
            <div class="filters-info">
              <strong>فیلترهای اعمال شده:</strong>
              <div class="filter-chips" > 
                ${filters.jobPosition ? `<span class="filter-chip">جایگاه شغلی: ${filters.jobPosition}</span>` : ''}
                ${filters.force ? `<span class="filter-chip">نیرو: ${filters.force}</span>` : ''}
              </div>
            </div>
          `
        : ''
    }
          
          <div class="print-table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th style="width: auto">ردیف</th>
                  <th style="width: auto">عنوان</th>
                  <th style="width: auto">جایگاه شغلی</th>
                  <th style="width: auto">رسته شغلی</th>
                  <th style="width: auto">ش ک</th>
                  <th style="width: auto">درجه</th>
                  <th style="width: auto">نام و نشان</th>
          
                  <th style="width: auto">سن خدمتی</th>
                  <th style="width: auto">سن شناسنامه ای</th>
                  <th style="width: auto">تاریخ انتصاب</th>
                  <th style="width: auto">مدت اعتبار(حکم)</th>
                  <th style="width: auto">معرفی کننده</th>
                  <th style="width: auto">معرفی کننده</th>
                  
                  <th style="width: auto">نام و نشان معرفی کننده</th>
         
                </tr>
              </thead>
              <tbody>
                ${filteredPersonnelData
      .map(
        (person, index) => `
                  <tr class="table-row">
                    <td>${index + 1}</td>
                    <td>${person.cdCommonBaseDataPresentDegreeTitle || ''}</td>
                    <td>${person.jobTitle || ''}</td>
                    <td>${person.cdCommonBaseDataCategoryTitle || ''}</td>
                    <td>${person.personnelNumber || ''}</td>
                    <td>${person.cdCommonBaseDataPresentDegreeTitle || ''}</td>
                    <td>${person.firstName || ''} ${person.lastName || ''}</td>
                    <td>${calculateServiceAge(person.lastName)}</td>
                    <td>${calculateBirthAge(person.nationalCode)}</td>
                    <td>${person.appointmentDate || ''}</td>
                    <td>${calculateValidityDuration(person.lastName)}</td>
                    <td>${person.cdCommonBaseDataCategoryTitle || ''}${person.professionTitle ? ' - ' + person.professionTitle : ''}</td>
                    <td>${person.serviceStatusTitle || ''}</td>
                    <td>${person.personnelNumber || ''}</td>
                  </tr>
                `
      )
      .join('')}
              </tbody>
            </table>
            
            <hr style="margin-top: 5%" />
               <table class="data-table">
                  <thead>
            
                   <th style="width: auto">اولویت</th>
                  <th style="width: auto">درجه</th>
                  <th style="width: auto">نام و نشان</th>
                  <th style="width: auto">عنوان</th>
                  <th style="width: auto">جایگاه </th>
                  <th style="width: auto">ست خدمتی</th>
                  <th style="width: auto">ست شناسنامه ای</th>
                  <th style="width: auto">تحصیلات </th>
                  <th style="width: auto">دوره ای طولی </th>
                  
                   <tbody>
                ${filteredPersonnelData
      .map(
        (person) => `
                  <tr class="table-row">
                    <td>${person.cdCommonBaseDataPresentDegreeTitle || ''}</td>
                    <td>${person.cdCommonBaseDataPresentDegreeTitle || ''}</td>
                    <td>${person.jobTitle || ''}</td>
                    <td>${person.cdCommonBaseDataCategoryTitle || ''}</td>
                    <td>${person.personnelNumber || ''}</td>
                    <td>${person.cdCommonBaseDataPresentDegreeTitle || ''}</td>
                    <td>${person.firstName || ''} ${person.lastName || ''}</td>
                    <td>${calculateServiceAge(person.lastName)}</td>
                    <td>${calculateBirthAge(person.nationalCode)}</td>
                    <td>${person.appointmentDate || ''}</td>
             
           
                  </tr>
                `
      )
      .join('')}
</thead>
</table>
            
          </div>
          
<!--//           <div class="print-footer">-->
 <!--           <p>تعداد رکوردها: ${filteredPersonnelData.length} | تاریخ چاپ: ${new Date().toLocaleDateString('fa-IR')} - ساعت: ${new Date().toLocaleTimeString('fa-IR')}</p>-->
<!--//           </div>-->
        </div>
        
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              setTimeout(function() {
                window.close();
              }, 500);
            }, 250);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  // توابع کمکی برای محاسبات
  const calculateServiceAge = (employmentDate: string) => {
    if (!employmentDate) return '-';
    return '25';
  };

  const calculateBirthAge = (nationalCode: string) => {
    if (!nationalCode) return '-';
    return '45';
  };

  const calculateValidityDuration = (appointmentDate: string) => {
    if (!appointmentDate) return '-';
    return '2 سال';
  };

  // ستون‌ها
  const searchColumns: GridColDef<Personnel>[] = [
    {
      field: 'name',
      headerName: 'نام و نشان',
      flex: 2,
      valueGetter: (_, row) =>
        `${row.firstName || ''} ${row.lastName || ''}`.trim(),
    },
    {
      field: 'cdCommonBaseDataPresentDegreeTitle',
      headerName: 'درجه',
      flex: 1.5,
    },
    {
      field: 'orOrganizationUnitPresentPartialUnitName',
      headerName: 'یگان',
      flex: 2,
    },
    {
      field: 'specialty',
      headerName: 'رسته و تخصص',
      flex: 2,
      valueGetter: (_, row) =>
        `${row.cdCommonBaseDataCategoryTitle || ''}${row.professionTitle ? ' - ' + row.professionTitle : ''}`,
    },
    {
      field: 'serviceStatusTitle',
      headerName: 'وضعیت خدمتی',
      flex: 2,
    },
    {
      field: 'personnelNumber',
      headerName: 'شماره پرسنلی',
      flex: 1.5,
    },
    {
      field: 'actions',
      headerName: 'عملیات',
      flex: 2,
      renderCell: ({ row }) => (
        <Button
          variant="outlined"
          size="small"
          startIcon={<Visibility />}
          onClick={() => handleViewDetails(row)}
        >
          مشاهده جزئیات
        </Button>
      ),
    },
  ];

  const detailsColumns: GridColDef<Personnel>[] = [
    {
      field: 'row',
      headerName: 'ردیف',
      flex: 0.3,
      width: 60,
    },
    {
      field: 'title',
      headerName: 'عنوان',
      flex: 1,
      width: 80,
    },
    {
      field: 'jobPosition',
      headerName: 'جایگاه شغلی',
      flex: 1,
      width: 100,
      valueGetter: (_, row) =>
        row.jobTitle || row.organizationDegreeTitle || '',
    },
    {
      field: 'jobCategory',
      headerName: 'رسته شغلی',
      flex: 1,
      width: 80,
      valueGetter: (_, row) => row.cdCommonBaseDataCategoryTitle || '',
    },
    {
      field: 'code',
      headerName: 'ش ک',
      flex: 0.5,
      width: 60,
      valueGetter: (_, row) => row.personnelNumber || '',
    },
    {
      field: 'degree',
      headerName: 'درجه',
      flex: 0.5,
      width: 70,
      valueGetter: (_, row) => row.cdCommonBaseDataPresentDegreeTitle || '',
    },
    {
      field: 'fullName',
      headerName: 'نام و نشان',
      flex: 1.5,
      width: 120,
      valueGetter: (_, row) => `${row.firstName || ''} ${row.lastName || ''}`,
    },
    {
      field: 'serviceAge',
      headerName: 'سن خدمتی',
      flex: 0.5,
      width: 70,
      valueGetter: (_, row) => calculateServiceAge(row.lastName),
    },
    {
      field: 'birthAge',
      headerName: 'سن شناسنامه ای',
      flex: 0.5,
      width: 80,
      valueGetter: (_, row) => calculateBirthAge(row.nationalCode),
    },
    {
      field: 'appointmentDate',
      headerName: 'تاریخ انتصاب',
      flex: 1,
      width: 90,
    },
    {
      field: 'validityDuration',
      headerName: 'مدت اعتبار',
      flex: 0.5,
      width: 70,
      valueGetter: (_, row) => calculateValidityDuration(row.lastName),
    },
    {
      field: 'specialty',
      headerName: 'رسته و تخصص',
      flex: 1,
      width: 100,
      valueGetter: (_, row) =>
        `${row.cdCommonBaseDataCategoryTitle || ''}${row.professionTitle ? ' - ' + row.professionTitle : ''}`,
    },
    {
      field: 'serviceStatusTitle',
      headerName: 'وضعیت خدمتی',
      flex: 1,
      width: 90,
    },
    {
      field: 'personnelNumber',
      headerName: 'شماره پرسنلی',
      flex: 0.8,
      width: 80,
    },
  ];

  const handlePersonnelNumberSearch = async () => {
    if (!personnelNumber || personnelNumber.length < 2) {
      setSearchError('لطفاً شماره پرسنلی وارد کنید');
      return;
    }

    if (!hrToken) {
      setSearchError('لطفاً منتظر بمانید تا احراز هویت انجام شود...');
      return;
    }

    setIsLoading(true);
    setSearchError('');
    setSelectedPersonnel(null);
    setPersonnelDetails(null);
    setFilters({ jobPosition: '', force: '' });

    try {
      const result = await getPersonnelData(personnelNumber);

      if (result?.data) {
        const personnel = {
          ...result.data,
          id: result.data.personnelId || result.data.id || personnelNumber,
        };

        setPersonnelData([personnel]);
        console.log('داده‌های پرسنل دریافت شد:', personnel);
      } else {
        setPersonnelData([]);
        setSearchError('پرسنلی با این شماره یافت نشد');
      }
    } catch (error) {
      console.error('خطا در جستجوی پرسنل:', error);
      setSearchError('خطا در دریافت اطلاعات پرسنل');
      setPersonnelData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetSearch = () => {
    setPersonnelNumber('');
    setPersonnelData([]);
    setFilteredPersonnelData([]);
    setSelectedPersonnel(null);
    setPersonnelDetails(null);
    setSearchError('');
    setFilters({ jobPosition: '', force: '' });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePersonnelNumberSearch();
    }
  };

  if (authError) {
    return (
      <Box p={2}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {authError}
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{ width: '100%', maxWidth: '100vw', p: 2, boxSizing: 'border-box' }}
    >
      <Typography fontWeight={700} variant="h5" sx={{ mb: 3 }}>
        همتایابی و جانشین پروری بر اساس پرسنلی
      </Typography>

      {!hrToken && (
        <Alert severity="info" sx={{ mb: 2 }}>
          در حال دریافت مجوزهای دسترسی...
        </Alert>
      )}

      {/* بخش جستجو */}
      <Paper sx={{ p: 2, mb: 2, backgroundColor: '#eff7f9' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          جستجو با شماره پرسنلی
        </Typography>

        <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
          <TextField
            label="شماره پرسنلی"
            value={personnelNumber}
            onChange={e => setPersonnelNumber(e.target.value)}
            onKeyPress={handleKeyPress}
            size="small"
            sx={{ width: 300 }}
            placeholder="مثال: 09800"
            disabled={!hrToken || isLoading}
          />

          <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2 }}></Box>

          <Grid container spacing={2} alignItems="center">
            <Grid  size={{xs:12, md:6}}>
              <FormControl fullWidth size="small">
                <InputLabel>جایگاه شغلی</InputLabel>
                <Select
                  size="small"
                  sx={{ width: 300 }}
                  value={filters.jobPosition}
                  label="جایگاه شغلی"
                  onChange={e =>
                    setFilters({ ...filters, jobPosition: e.target.value })
                  }
                >
                  <MenuItem value="">همه</MenuItem>
                  {jobPositionOptions.map(option => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{xs:12 ,md:6}}>
              <FormControl fullWidth size="medium">
                <InputLabel>نیرو</InputLabel>
                <Select
                  size="small"
                  sx={{ width: 300 }}
                  value={filters.force}
                  label="نیرو"
                  onChange={e =>
                    setFilters({ ...filters, force: e.target.value })
                  }
                >
                  <MenuItem value="">همه</MenuItem>
                  {forceOptions.map(option => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* نمایش فیلترهای فعال */}
          {(filters.jobPosition || filters.force) && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                فیلترهای فعال:
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                {filters.jobPosition && (
                  <Chip
                    label={`جایگاه شغلی: ${filters.jobPosition}`}
                    size="small"
                    onDelete={() => setFilters({ ...filters, jobPosition: '' })}
                  />
                )}
                {filters.force && (
                  <Chip
                    label={`نیرو: ${filters.force}`}
                    size="small"
                    onDelete={() => setFilters({ ...filters, force: '' })}
                  />
                )}
              </Box>
            </Box>
          )}

          <Button
            variant="contained"
            onClick={handlePersonnelNumberSearch}
            disabled={!hrToken || isLoading || !personnelNumber}
          >
            {isLoading ? 'در حال جستجو...' : 'جستجوی پرسنل'}
          </Button>

          <Button
            variant="outlined"
            onClick={resetSearch}
            // disabled={isLoading || !hrTo/home/aja/Desktop/Inspection/inspection-frontken}
          >
            بازنشانی
          </Button>
          <Button
            variant="contained"
            onClick={applyFilters}
            startIcon={<FilterAlt />}
            size="small"
          >
            اعمال فیلتر
          </Button>

          {/*<Button*/}
          {/*  variant="outlined"*/}
          {/*  onClick={clearFilters}*/}
          {/*  size="small"*/}
          {/*>*/}
          {/*  پاک کردن*/}
          {/*</Button>*/}
        </Box>

        {searchError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {searchError}
          </Alert>
        )}
      </Paper>

      {/* بخش فیلترها */}
      {/*{personnelData.length > 0 && (*/}

      {/*)}*/}

      <MatnaDataGrid
        sx={{ height: '25vh !important' }}
        rows={personnelData}
        columns={searchColumns}
        loading={isLoading}
        paginationModel={{
          page: 0,
          pageSize: 10,
        }}
        rowCount={personnelData.length}
        onPaginationModelChange={() => {}}
      />

      {selectedPersonnel && (
        <Card sx={{ mt: 3, backgroundColor: '#c2ffc9' }}>
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Typography variant="h6">
                فرم همتایابی:{' '}
                {selectedPersonnel.cdCommonBaseDataPresentDegreeTitle}{' '}
                {selectedPersonnel.firstName} {selectedPersonnel.lastName}
              </Typography>

              <Button
                variant="contained"
                startIcon={<Print />}
                onClick={handlePrint}
                sx={{ minWidth: '120px' }}
              >
                چاپ
              </Button>
            </Box>

            {isLoadingDetails ? (
              <Typography>در حال دریافت جزئیات...</Typography>
            ) : (
              <Box sx={{ mt: 2 }}>
                <div id="printable-data-grid">
                  <MatnaDataGrid
                    sx={{
                      height: '30vh !important',
                      '& .MuiDataGrid-cell': {
                        fontSize: '12px',
                        padding: '6px',
                      },
                      '& .MuiDataGrid-columnHeader': {
                        fontSize: '12px',
                        padding: '6px',
                      },
                    }}
                    rows={filteredPersonnelData}
                    columns={detailsColumns}
                    loading={isLoading}
                    paginationModel={{
                      page: 0,
                      pageSize: 10,
                    }}
                    rowCount={filteredPersonnelData.length}
                    onPaginationModelChange={() => {}}
                  />
                </div>

                {/* اطلاعات فیلتر */}
                {(filters.jobPosition || filters.force) && (
                  <Box
                    sx={{
                      mt: 2,
                      p: 1,
                      backgroundColor: '#e3f2fd',
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body2">
                      <strong>فیلترهای اعمال شده:</strong>
                      {filters.jobPosition &&
                        ` جایگاه شغلی: ${filters.jobPosition}`}
                      {filters.force && ` نیرو: ${filters.force}`}
                      {` (تعداد: ${filteredPersonnelData.length} رکورد)`}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {!isLoading && personnelData.length === 0 && !searchError && hrToken && (
        <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: '#f5f5f5' }}>
          <Typography variant="h6" color="text.secondary">
            لطفاً شماره پرسنلی را وارد کرده و دکمه جستجو را بزنید
          </Typography>
        </Paper>
      )}
    </Box>
  );
}
