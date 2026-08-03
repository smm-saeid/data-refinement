import {
  Button,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Grid,
  Typography,
} from '@mui/material';
import { type GridColDef } from '@mui/x-data-grid';
import { Search } from '@mui/icons-material';
import { MatnaDataGrid } from '@/components/data-grid/MatnaDataGrid';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import FormBuilder from '@/components/form/FormBuilder.tsx';
import BackButton from '@/components/button/BackButton';
import {
  PAGINATION_DEFAULT_VALUE_OLD,
  type PaginationQueryParamOld,
} from '@/types/api';
import { useSnackbar } from '@/hooks/useSnackbar';
import moment from 'moment-jalaali';
import { useApiMutation, useApiQuery } from '@/hooks/useApi';
import EvaluationApis from '@/modules/evaluation/apis';
import type { FieldConfig, TOption } from '@/components/form/types';

type RowData = {
  id: string;
  name: string;
  isSelected: boolean;
};

type FilterData = {
  id: string;
  name: string;
  forceFilter: any;
  checkedItemcode: any;
};

type SearchType = {
  firstName: string;
  lastName: string;
  jobTitle: string;
  personnelNumber: string;
  appointmentDate: Date | string;
};

type EvaluationRoleParams = {
  firstName?: string;
  lastName?: string;
  personnelNumber?: string;
  organizationName?: string;
  degree?: string;
  jobTitle?: string;
  appointmentDate?: string;
  cdCommonBaseDataDegreeKey?: number;
  cdCommonBaseDataDegreeTitle?: string;
};

export default function EvaluationPlanningCreate() {
  const navigate = useNavigate();
  const [searchData] = useState<SearchType>({
    personnelNumber: '',
    firstName: '',
    lastName: '',
    jobTitle: '',
    appointmentDate: '',
  });
  const [searchText, setSearchText] = useState<string>('');
  const [selectedData, setSelectedData] = useState<RowData[]>([]);
  const [filterData] = useState<FilterData>({} as FilterData);
  const organizationDegree = ['17', '18', '19'];
  const [checkedItems, setCheckedItems] = useState({
    '17': false,
    '18': false,
    '19': false,
  });
  const [filters] = useState<
    PaginationQueryParamOld<EvaluationRoleParams>
  >({ ...PAGINATION_DEFAULT_VALUE_OLD });
  const { data: appoinment, isLoading } = useApiQuery<
    PaginationQueryParamOld<any>
  >({
    url: EvaluationApis.planning.appointment.findByOrg,
    params: filters + searchText,
  });

  const [myData, setmyData] = useState<RowData[]>(appoinment?.data);

  const snackbar = useSnackbar();
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
      // ✅ شبیه‌سازی fetch options
      fetchOptions: async (): Promise<TOption[]> => {
        console.log('🔄 در حال دریافت لیست دپارتمان‌ها...');
        const res = await fetch(
          'organizations/find-all-force-with-out-children'
        );
        const ForecesData = await res.json();
        console.log('✅ لیست دپارتمان‌ها دریافت شد');
        return ForecesData;
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

  const { mutate: createEvaluationMutate } = useApiMutation({
    url: `evaluation/save-all`,
    config: {}, //send data
  });

  function createEvalutaion() {
    createEvaluationMutate({
      onSuccess: () => {
        console.log('success');
        executionHandling();
        snackbar('عملیات با موفقیت انجام شد', 'success', 5000);
      },
      onError: () => {
        console.log('fail');
        snackbar('رکورد شما موجود می باشد', 'error', 5000);
      },
    });
  }

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

  const column1: GridColDef[] = useMemo(
    () => [
      {
        field: 'id',
        headerName: 'ردیف',
        flex: 1,
        display: 'flex',
        renderCell: ({ row }) => row?.id + 1,
      },
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
    {
      field: 'id',
      headerName: 'ردیف',
      flex: 1,
      display: 'flex',
      renderCell: ({ row }) => row?.id + 1,
    },
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

  function executionHandling() {
    navigate('/evaluation-role-show-list');
  }
  function settingSearchText() {
    let text = '';
    if (!!filterData?.forceFilter)
      text += '&organizationId=' + filterData?.forceFilter?.id;
    if (searchData.firstName !== '')
      text += '&firstName=' + searchData.firstName;
    if (searchData.lastName !== '') text += '&lastName=' + searchData.lastName;
    if (searchData.jobTitle !== '') text += '&jobTitle=' + searchData.jobTitle;
    if (searchData.personnelNumber !== '')
      text += '&personnelNumber=' + searchData.personnelNumber;
    if (searchData.jobTitle !== '') text += '&jobTitle=' + searchData.jobTitle;
    if (searchData.appointmentDate !== '')
      text += '&appointmentDate=' + searchData.appointmentDate;
    if (checkedItems['17'] === true) text += '&code17=' + true;
    if (checkedItems['18'] === true) text += '&code18=' + true;
    if (checkedItems['19'] === true) text += '&code19=' + true;
    setSearchText(text);
  }

  return (
    <Grid container justifyContent={'center'}>
      <Grid size={{ md: 11 }} display={'flex'} justifyContent={'space-between'}>
        <Typography fontWeight={700} variant="h5">
          طرح ریزی ارزشیابی
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

      <Grid size={{ md: 11 }}>
        <MatnaDataGrid
          rows={myData}
          columns={column1}
          rowCount={appoinment?.meta?.pagination?.count || 10}
          paginationModel={{
            page: appoinment?.meta?.pagination?.currentPage || 1,
            pageSize: appoinment?.meta?.pagination?.pageSize || 10,
          }}
          loading={isLoading}
          getRowId={row => row.personnelNumber}
          sx={{ marginBottom: '25px' }}
        />
      </Grid>
      <Grid size={{ md: 11 }}>
        <MatnaDataGrid
          rows={selectedData}
          columns={column2}
          sx={{ marginBottom: '15px' }}
          checkboxSelection={false}
        />
      </Grid>

      <Grid size={{ md: 2 }} justifyContent={'center'}>
        <Button
          onClick={() => createEvalutaion()}
          fullWidth
          variant="contained"
          color="success"
          sx={{ minWidth: '100px', mb: 2 }}
        >
          ذخیره
        </Button>
      </Grid>
    </Grid>
  );
}
