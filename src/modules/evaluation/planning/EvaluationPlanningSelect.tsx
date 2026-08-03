import {
  Box,
  Button,
  Checkbox,
  Grid,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { type GridColDef } from '@mui/x-data-grid';
import BackButton from '@/components/button/BackButton';
import { MatnaDataGrid } from '@/components/data-grid/MatnaDataGrid';
import { useSnackbar } from '@/hooks/useSnackbar';
import moment from 'moment-jalaali';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  PAGINATION_DEFAULT_VALUE_OLD,
  type PaginationQueryParamOld,
} from '@/types/api';
import { FormControlLabel, FormGroup } from '@mui/material';
import { Search } from '@mui/icons-material';
import { useApiMutation, useApiQuery } from '@/hooks/useApi';
import EvaluationApis from '@/modules/evaluation/apis';
import type { FieldConfig, TOption } from '@/components/form/types';
import FormBuilder from '@/components/form/FormBuilder';

type FilterData = {
  id: string;
  name: string;
  forceFilter: any;
  checkedItemcode: any;
};

type RowData = {
  id: string;
  name: string;
  isSelected: boolean;
};

const steps = ['رده تخصصی', 'مافوق', 'هم رده', 'تحت امر'];

export default function EvaluationPlanningSelect() {
  const navigate = useNavigate();
  const [searchData] = useState({
    personnelNumber: '',
    jobTitle: '',
    firstName: '',
    lastName: '',
  });

  const snackbar = useSnackbar();
  const [filters] = useState<PaginationQueryParamOld<any>>({
    ...PAGINATION_DEFAULT_VALUE_OLD,
  });
  const [searchText, setSearchText] = useState<string>('');
  const [selectedStep, setSelectedStep] = useState(0);
  const [loadSteps, setLoadSteps] = useState(false);
  const { data: appoinment, isLoading } = useApiQuery<
    PaginationQueryParamOld<any>
  >({
    url: EvaluationApis.planning.appointment.findByOrg,
    params: filters + searchText,
  });

  const [myData, setmyData] = useState<RowData[]>(appoinment?.data);
  const [selectedData, setSelectedData] = useState<RowData[]>([]);
  const [filterData] = useState<FilterData>({} as FilterData);
  const organizationDegree = ['17', '18', '19'];
  const [checkedItems, setCheckedItems] = useState({
    '17': false,
    '18': false,
    '19': false,
  });

  const baseInfoItems: FieldConfig[] = [
    {
      type: 'text',
      name: 'firstName',
      label: 'نام',
      size: { xs: 12, md: 2 },
      defaultValue: '',
    },
    {
      type: 'text',
      name: 'lastName',
      label: 'نام خانوادگی',
      size: { xs: 12, md: 2 },
      defaultValue: '',
    },
    {
      type: 'text',
      name: 'jobTitle',
      label: 'عنوان شغلی',
      size: { xs: 12, md: 2 },
      defaultValue: '',
    },
    {
      type: 'text',
      name: 'personnelNumber',
      label: 'شماره پرسنلی',
      size: { xs: 12, md: 2 },
      defaultValue: '',
    },
    {
      type: 'date',
      name: 'appointmentDate',
      label: 'تاریخ ارزشیابی',
      size: { xs: 12, md: 6 },
      defaultValue: null,
    },
    {
      type: 'autocomplete',
      name: 'departmentId',
      label: 'نیرو',
      size: { xs: 12, md: 6 },
      defaultValue: '',
      fetchOptions: async (): Promise<TOption[]> => {
        console.log('🔄 در حال دریافت لیست دپارتمان‌ها...');
        const res = await fetch(
          'organizations/find-all-force-with-out-children'
        );
        const ForecesData = await res.json();
        console.log('✅ لیست دپارتمان‌ها دریافت شد');
        return ForecesData;
      },
      validation: {
        required: 'دپارتمان الزامی است',
      },
    },
  ];

  useEffect(() => {
    if (!!appoinment?.data)
      setmyData(
        appoinment?.data?.map((item: any, index: number) => ({
          ...item,
          id: index,
          isSelected: false,
        }))
      );
  }, [appoinment]);

  useEffect(() => {
    if (!!myData)
      setSelectedData(myData?.filter((row: any) => row?.isSelected === true));
  }, [myData]);

  const [listSkills] = useState<
    Array<{
      id: number | string;
      personInfoId: null | string;
      personnelName: null | string;
      position: string;
      requestDescription: string;
      inspectionId: string;
      orgSpecialityId: null | string;
      organizationUnitId: null | string;
      assignStatus: string;
    }>
  >([]);

  const handleSave = () => {
    if (selectedStep == 3) {
      createEvaluationMutate(
        {
          entity: `evaluation/save-all`,
          method: 'post',
          data: [...selectedData],
        } as any,
        {
          onSuccess: () => {
            snackbar('عملیات با موفقیت انجام شد', 'success', 5000);
          },
          onError: () => {
            snackbar('خطا در ذخیره داده', 'error', 5000);
          },
        }
      );
    } else if (selectedStep == 2)
      createEvaluationMutate(
        {
          entity: `evaluation/save-all`,
          method: 'post',
          data: [...selectedData],
        } as any,
        {
          onSuccess: () => {
            snackbar('عملیات با موفقیت انجام شد', 'success', 5000);
          },
          onError: () => {
            snackbar('خطا در ذخیره داده', 'error', 5000);
          },
        }
      );
    else
      createEvaluationMutate(
        {
          entity: `evaluation/save-all`,
          method: 'post',
          data: [...selectedData],
        } as any,
        {
          onSuccess: () => {
            snackbar('عملیات با موفقیت انجام شد', 'success', 5000);
          },
          onError: () => {
            snackbar('خطا در ذخیره داده', 'error', 5000);
          },
        }
      );
    setSelectedStep(v => (v + 1) % steps.length);
  };

  const handleSelectedAll = (checked: boolean) => {
    const updated = myData?.map(row => ({ ...row, isSelected: checked }));
    setmyData(updated);
  };

  const handleRowSelect = (id: string, checked: boolean) => {
    const updatad = myData?.map(row =>
      row.id === id ? { ...row, isSelected: checked } : row
    );
    setmyData(updatad);
  };

  const { mutate: createEvaluationMutate } = useApiMutation({
    url: `evaluation/save-all`,
  });

  useEffect(() => {
    if (status !== 'loading') {
      if (!!appoinment) {
        if (appoinment?.data?.issuance) {
          setSelectedStep(5);
        } else if (appoinment?.data?.issuanceInformation) {
          setSelectedStep(3);
        } else if (
          appoinment?.data?.informationStartDate &&
          appoinment?.data?.informationEndDate &&
          appoinment?.data?.organizationUnitName
        ) {
          setSelectedStep(2);
        } else {
          setSelectedStep(0);
        }

        // setOrganizationUnit({
        //   name: appoinment?.data?.organizationUnitName,
        //   id: appoinment?.data?.organizationUnitId,
        // });
      } else {
        // setOrganizationUnit({
        //   name: state?.row?.organizationUnitName,
        //   id: state?.row?.organizationUnitId,
        // });
      }
      setLoadSteps(true);
    }
  }, [status]);

  useEffect(() => {
    if (!!appoinment?.data)
      setmyData(
        appoinment?.data?.map((item: any, index: number) => ({
          ...item,
          id: index,
          isSelected: false,
        }))
      );
  }, [appoinment]);

  useEffect(() => {
    if (!!myData)
      setSelectedData(myData?.filter((row: any) => row?.isSelected === true));
  }, [myData]);

  const column1: GridColDef[] = useMemo(
    () => [
      { field: 'firstName', headerName: 'نام', flex: 1, display: 'flex' },
      { field: 'lastName', headerName: 'نشان', flex: 1, display: 'flex' },
      {
        field: 'personnelNumber',
        headerName: ' شماره پرسنلی',
        flex: 1,
        display: 'flex',
      },
      {
        field: 'organizationName',
        headerName: 'یگان',
        flex: 2,
        display: 'flex',
      },
      { field: 'degree', headerName: 'درجه', flex: 1, display: 'flex' },
      { field: 'jobTitle', headerName: 'عنوان شغل', flex: 2, display: 'flex' },
      {
        field: 'appointmentDate',
        headerName: 'تاریخ انتصاب',
        flex: 1,
        display: 'flex',
        renderCell: ({ row }) => {
          return moment(row?.appointmentDate).format('jYYYY/jMM/jDD');
        },
      },
      {
        field: 'evaluationDate',
        headerName: 'تاریخ ارزشیابی',
        flex: 1,
        display: 'flex',
      },
      {
        field: 'cdCommonBaseDataDegreeKey',
        headerName: 'جایگاه سازمانی',
        flex: 1,
        display: 'flex',
        renderCell: ({ row }) =>
          row?.cdCommonBaseDataDegreeKey +
          '/' +
          row?.cdCommonBaseDataDegreeTitle,
      },
      {
        field: 'isSelected',
        headerName: 'انتخاب',
        flex: 1,
        display: 'flex',
        sortable: false,
        renderHeader: () => (
          <Grid>
            <span>انتخاب</span>
            <Checkbox
              checked={myData?.every(row => row.isSelected)}
              indeterminate={
                myData?.some(row => row.isSelected) &&
                !myData.every(row => row.isSelected)
              }
              onChange={e => handleSelectedAll(e.target.checked)}
            />
          </Grid>
        ),
        renderCell: ({ row }) => (
          <Checkbox
            checked={row.isSelected}
            onClick={e => e.stopPropagation()}
            onChange={e => handleRowSelect(row.id, e.target.checked)}
          />
        ),
      },
    ],
    [selectedData]
  );

  const column2: GridColDef[] = [
    { field: 'firstName', headerName: 'نام', flex: 1, display: 'flex' },
    { field: 'lastName', headerName: 'نشان', flex: 1, display: 'flex' },
    {
      field: 'personnelNumber',
      headerName: 'شماره پرسنلی',
      flex: 1,
      display: 'flex',
    },
    { field: 'organizationName', headerName: 'یگان', flex: 2, display: 'flex' },
    { field: 'degree', headerName: 'درجه', flex: 1, display: 'flex' },
    { field: 'status', headerName: 'وضعیت', flex: 1, display: 'flex' },
    {
      field: 'appointmentDate',
      headerName: 'تاریخ انتصاب',
      flex: 1,
      display: 'flex',
      renderCell: ({ row }) => {
        return moment(row?.appointmentDate).format('jYYYY/jMM/jDD');
      },
    },
    {
      field: 'evaluationDate',
      headerName: 'تاریخ ارزشیابی',
      flex: 1,
      display: 'flex',
    },
    {
      field: 'cdCommonBaseDataDegreeKey',
      headerName: 'جایگاه سازمانی',
      flex: 1,
      display: 'flex',
      renderCell: ({ row }) =>
        row?.cdCommonBaseDataDegreeKey + '/' + row?.cdCommonBaseDataDegreeTitle,
    },
  ];

  function settingSearchText() {
    let text = '';
    if (!!filterData?.forceFilter)
      text += '&organizationId=' + filterData?.forceFilter?.id;
    if (searchData.firstName !== '')
      text += '&firstName=' + searchData.firstName;
    if (searchData.lastName !== '') text += '&lastName=' + searchData.lastName;
    if (searchData.personnelNumber !== '')
      text += '&personnelNumber=' + searchData.personnelNumber;
    if (searchData.jobTitle !== '') text += '&jobTitle=' + searchData.jobTitle;
    if (checkedItems['17'] === true) text += '&code17=' + true;
    if (checkedItems['18'] === true) text += '&code18=' + true;
    if (checkedItems['19'] === true) text += '&code19=' + true;
    setSearchText(text);
  }

  return (
    <Grid container justifyContent={'center'} mt={5}>
      <Grid size={{ md: 11 }} display={'flex'} justifyContent={'space-between'}>
        <Typography fontWeight={700} variant="h5">
          انتخاب رده ارزشیابی
        </Typography>
        <BackButton
          text="بازگشت"
          color="primary"
          minWidth={300}
          onBack={() => navigate(-1)}
        />
      </Grid>

      <Grid container size={{ md: 11 }} spacing={1} m={2}>
        <Grid size={{ xs: 12, md: 3 }}>
          <FormBuilder
            fields={baseInfoItems}
            onSubmit={() => settingSearchText()}
          />
        </Grid>
        <Grid size={{ md: 4 }} display={'flex'} justifyContent={'flex-end'}>
          <Button
            variant="contained"
            endIcon={<Search />}
            onClick={() => {
              settingSearchText();
            }}
          >
            جستجو...
          </Button>
        </Grid>
      </Grid>

      <Grid size={{ md: 6 }} display={'flex'} justifyContent={'space-between'}>
        <FormGroup row>
          {(organizationDegree || []).map(degree => (
            <FormControlLabel
              key={degree}
              control={
                <Checkbox
                  name={degree}
                  onChange={e => {
                    const checked = e.target.checked;
                    setCheckedItems(prev => ({
                      ...prev,
                      [degree]: checked,
                    }));
                  }}
                />
              }
              label={degree}
            />
          ))}
        </FormGroup>
      </Grid>

      <Tabs
        value={selectedStep}
        onChange={(_e: React.SyntheticEvent, value: number) =>
          setSelectedStep(value)
        }
      >
        {steps.map((item, index) => (
          <Tab key={index} value={index} label={item} />
        ))}
      </Tabs>

      <Grid
        container
        size={{ md: 11 }}
        justifyContent={'center'}
        width={'100%'}
      >
        {loadSteps && status === 'success' ? (
          selectedStep === 0 ? (
            <Grid container justifyContent={'center'}>
              <Grid size={{ md: 12 }}>
                <MatnaDataGrid
                  rows={myData}
                  columns={column1}
                  rowCount={appoinment?.meta?.pagination?.count || 10}
                  loading={isLoading}
                  getRowId={row => row.personnelNumber}
                  sx={{ marginBottom: '25px' }}
                />
              </Grid>
              <Grid size={{ md: 12 }}>
                <MatnaDataGrid
                  rows={selectedData}
                  columns={column2}
                  sx={{ marginBottom: '15px' }}
                  checkboxSelection={false}
                />
              </Grid>
            </Grid>
          ) : selectedStep === 1 ? (
            <Grid container justifyContent={'center'}>
              <Grid size={{ md: 12 }}>
                <MatnaDataGrid
                  rows={myData}
                  columns={column1}
                  rowCount={appoinment?.meta?.pagination?.count || 10}
                  loading={isLoading}
                  getRowId={row => row.personnelNumber}
                  sx={{ marginBottom: '25px' }}
                />
              </Grid>
              <Grid size={{ md: 12 }}>
                <MatnaDataGrid
                  rows={selectedData}
                  columns={column2}
                  sx={{ marginBottom: '15px' }}
                  checkboxSelection={false}
                />
              </Grid>
            </Grid>
          ) : selectedStep === 2 ? (
            <Grid container justifyContent={'center'}>
              <Grid size={{ md: 12 }}>
                <MatnaDataGrid
                  rows={myData}
                  columns={column1}
                  rowCount={appoinment?.meta?.pagination?.count || 10}
                  loading={isLoading}
                  getRowId={row => row.personnelNumber}
                  sx={{ marginBottom: '25px' }}
                />
              </Grid>
              <Grid size={{ md: 12 }}>
                <MatnaDataGrid
                  rows={selectedData}
                  columns={column2}
                  sx={{ marginBottom: '15px' }}
                  checkboxSelection={false}
                />
              </Grid>
            </Grid>
          ) : selectedStep === 3 ? (
            <Grid container justifyContent={'center'}>
              <Grid size={{ md: 12 }}>
                <MatnaDataGrid
                  rows={myData}
                  columns={column1}
                  rowCount={appoinment?.meta?.pagination?.count || 10}
                  loading={isLoading}
                  getRowId={row => row.personnelNumber}
                  sx={{ marginBottom: '25px' }}
                />
              </Grid>
              <Grid size={{ md: 12 }}>
                <MatnaDataGrid
                  rows={selectedData}
                  columns={column2}
                  sx={{ marginBottom: '15px' }}
                  checkboxSelection={false}
                />
              </Grid>
            </Grid>
          ) : null
        ) : null}
      </Grid>

      <Box margin={'50px'}>
        <Grid container>
          <Grid size={{ xs: 8 }} display={'flex'}>
            {selectedStep === 0 ? null : (
              <Button
                variant="contained"
                color="error"
                onClick={() =>
                  setSelectedStep(v => Math.max(v - 1, 0) % steps.length)
                }
                sx={{ margin: '10px' }}
              >
                مرحله قبل
              </Button>
            )}

            {selectedStep >= steps.length - 1 ||
            (!listSkills.find(item => item.assignStatus != 'assigned') &&
              selectedStep == 3) ? null : (
              <Button
                color="success"
                variant="contained"
                onClick={() => {
                  handleSave();
                }}
              >
                ثبت و مرحله بعد
              </Button>
            )}
            {selectedStep != steps.length - 1 ? null : (
              <Button variant="contained" onClick={() => {}}>
                ثبت نهایی
              </Button>
            )}
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
}
