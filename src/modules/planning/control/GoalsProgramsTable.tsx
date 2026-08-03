import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Fab,
  Grid,
  IconButton,
  Modal,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
  GridToolbar,
} from '@mui/x-data-grid';
import Chart from 'react-apexcharts';
import { type ApexOptions } from 'apexcharts';
import {
  Architecture,
  AttachMoney,
  Checklist,
  Close,
} from '@mui/icons-material';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from '@/hooks/useSnackbar';

type Entry = {
  id: number;
  title: string;
  status: string;
  date: string;
};

const tempForceOptions = [
  'بازرسی و ایمنی آجا',
  'نزاجا',
  'نداجا',
  'نهاجا',
  'نپاجا',
  'قرارگاه مشترک پدافند هوایی خاتم النبیاء',
  'یگان های تابعه آجا',
];
const tempSectionOptions = [
  'ارزشیابی',
  'طرح و برنامه',
  'ایمنی',
  'صیانت',
  'عملیات بازرسی',
];
const tempStatusOptions = ['وضعیت 1', 'وضعیت 2', 'وضعیت 3'];

const GoalsProgramsTable = () => {
  const snackbar = useSnackbar();
  const [openModal, setOpenModal] = useState(false);
  const [creditModal, setCreditModal] = useState(false);
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [date, setDate] = useState<any>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [nextId, setNextId] = useState(1);
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);

  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
  } = useForm();

  const baseInfoItems = [
    {
      name: 'name',
      type: 'text',
      label: 'عنوان',
      size: { md: 3 },
    },
  ];

  const targets = [
    {
      id: 1,
      domain: 'ارزشیابی',
      unit: 'ستاد آجا',
      target: 'استقرار و نهادینه‌سازی نظام شایسته‌سالار فرماندهان',
    },
    {
      id: 2,
      domain: 'طرح و برنامه',
      unit: 'ستاد آجا',
      target: 'استقرار و نهادینه‌سازی نظام شایسته‌سالار فرماندهان',
    },
    {
      id: 3,
      domain: 'ایمنی',
      unit: 'ستاد آجا',
      target: 'استقرار و نهادینه‌سازی نظام شایسته‌سالار فرماندهان',
    },
    {
      id: 4,
      domain: 'ارزشیابی',
      unit: 'ستاد آجا',
      target: 'استقرار و نهادینه‌سازی نظام شایسته‌سالار فرماندهان',
    },
  ];

  const domains = [
    {
      id: 1,
      name: 'ارزشیابی',
      targets: [
        {
          id: 11,
          name: 'استقرار و نهادینه‌سازی نظام شایسته‌سالار فرماندهان',
        },
      ],
    },
    {
      id: 2,
      name: 'طرح و برنامه',
      targets: [
        {
          id: 21,
          name: 'ارتقای نظام‌مندی، کارآمدی و تعالی بازرسی و ایمنی ن.م',
        },
      ],
    },
    {
      id: 3,
      name: 'ایمنی',
      targets: [
        {
          id: 31,
          name: 'توسعه فرهنگ ایمنی، پیشگیری از سوانح و حوادث خطرساز',
        },
      ],
    },
    {
      id: 4,
      name: 'صیانت',
      targets: [
        {
          id: 41,
          name: 'اعتلای اقدامات صیانتی، رسیدگی دقیق، به‌هنگام، منصفانه و عادلانه به گزارش‌ها',
        },
      ],
    },
    {
      id: 5,
      name: 'عملیات بازرسی',
      targets: [
        {
          id: 51,
          name: 'ارتقای هدفمندی، کارآمدی و اثربخشی عملیات بازرسی‌ها',
        },
      ],
    },
  ];

  const programs = [
    {
      id: 1,
      name: 'اجرای بازرسی‌های غیر مترقبه خاص',
      unit: 'مورد',
      count: 12,
    },
    {
      id: 2,
      name: 'اجرای بازرسی‌ و ارزیابی توان و آمادگی رزمی',
      unit: 'استان',
      count: 4,
    },
    {
      id: 3,
      name: 'تهیه و تنظیم گزارشات اشراف و برنامه های راهبردی معاونت بازرسی و ایمنی آجا',
      unit: 'مورد',
      count: 10,
    },
    {
      id: 4,
      name: 'برگزاری دوره های توانمندسازی، دانش افزایی معاونت بازرسی و ایمنی آجا و تجلیل از استادان مدعو و فراگیران',
      unit: 'جلسه',
      count: 8,
    },
    {
      id: 5,
      name: 'پیگیری رفع مشکلات منازل سازمانی',
      unit: 'مورد',
      count: 50,
    },
    {
      id: 6,
      name: 'ارزیابی، رتبه بندی و تقدیر از فرماندهان و مسئولین ساعی، با انگیزه و فعال در حوزه پیشگیری',
      unit: 'نفر',
      count: 50,
    },
  ];

  const options2: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
    },
    colors: ['#02910a', '#e19907', '#0b52ba', '#c407e1', '#28dcdc'],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 2,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: programs.map(item => item.name),
      labels: {
        style: { colors: '#222', fontSize: '15px', fontWeight: '500' },
      },
    },
    yaxis: {
      title: {
        text: 'درصد پیشرفت هدف',
      },
      max: 100,
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (value: any) {
          return value + ' درصد';
        },
      },
    },
  };

  const series2 = [
    {
      name: 'پیشرفت اهداف',
      data: programs.map(item => item.count),
    },
  ];

  function handleOpen() {
    setOpenModal(true);
  }

  function handleClose() {
    setOpenModal(false);
  }

  function handleCreditModalOpen() {
    setCreditModal(true);
  }

  function handleCreditModalClose() {
    setCreditModal(false);
  }

  const handleAddEntry = () => {
    if (title && status && date) {
      const newEntry: Entry = {
        id: nextId,
        title,
        status,
        date: date.format('JYYYY-JMM-JDD'),
      };

      setEntries([...entries, newEntry]);
      setNextId(nextId + 1);
      setTitle('');
      setStatus(null);
      setDate(null);
    } else {
      snackbar('لطفا فرم را تکمیل فرمائید.', 'error', 5000);
    }
  };

  const filterDomains = selectedTitle
    ? domains.filter(domain => domain.name === selectedTitle)
    : domains;

  const column: GridColDef[] = [
    { field: 'title', headerName: 'عنوان', flex: 1, display: 'flex' },
    { field: 'status', headerName: 'وضعیت', flex: 1, display: 'flex' },
    { field: 'date', headerName: 'تاریخ', flex: 1, display: 'flex' },
  ];

  const columns: GridColDef[] = useMemo(
    () => [
      { field: 'name', headerName: 'عنوان برنامه', flex: 2 },
      {
        field: 'action',
        headerName: 'فعالیت',
        flex: 1,
        renderCell: (parama: GridRenderCellParams) => {
          return (
            <Grid display={'flex'}>
              <Tooltip title="شروع فعالیت">
                <Fab size="small" color="success" onClick={handleOpen}>
                  <Checklist />
                </Fab>
              </Tooltip>
            </Grid>
          );
        },
      },
      {
        field: 'action1',
        headerName: 'دریافت اعتبار',
        flex: 1,
        renderCell: (parama: GridRenderCellParams) => {
          return (
            <Grid display={'flex'}>
              <Tooltip title="شروع فعالیت">
                <Fab size="small" color="info" onClick={handleCreditModalOpen}>
                  <AttachMoney />
                </Fab>
              </Tooltip>
            </Grid>
          );
        },
      },
    ],

    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <>
      <Grid display={'flex'} justifyContent={'space-between'} mb={2}>
        <Grid size={{ md: 5 }}>
          <Typography variant="h6" gutterBottom>
            <Architecture fontSize="large" />
            جدول پیشرف برنامه ها
          </Typography>
        </Grid>

        <Grid size={{ md: 4 }}>
          <Autocomplete
            disablePortal
            options={tempForceOptions}
            onChange={(_, newValue) => setStatus(newValue)}
            renderInput={params => <TextField {...params} label="نیرو/یگان" />}
            sx={{ width: 200 }}
          />
        </Grid>
        <Grid size={{ md: 4 }}>
          <Autocomplete
            disablePortal
            options={tempSectionOptions}
            value={selectedTitle}
            onChange={(_, newValue) => setSelectedTitle(newValue)}
            renderInput={params => <TextField {...params} label="حوزه" />}
            sx={{ width: 200 }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {filterDomains.map((domain, domainIndex) => (
          <Grid
            container
            justifyContent={'center'}
            key={domain.id}
            size={{ xs: 12 }}
            mt={2}
          >
            <Grid size={{ md: 5.5 }} border={1} key={'domain' + domainIndex}>
              <Paper
                elevation={3}
                sx={{
                  padding: 2,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Typography variant="h6" mb={3} sx={{ borderBottom: 1 }}>
                  {domain.name + ' - نپاجا'}
                </Typography>

                {domain.targets.map((target, targetIndex) => (
                  <>
                    <Typography
                      fontWeight={500}
                      mb={3}
                      sx={{ borderBottom: 1 }}
                    >
                      عنوان هدف : {target.name}
                    </Typography>
                    <DataGrid
                      getRowHeight={() => 'auto'}
                      rows={programs}
                      columns={columns}
                      slots={{ toolbar: GridToolbar }}
                      slotProps={{
                        toolbar: {
                          csvOptions: { disableToolbarButton: true },
                        },
                      }}
                      disableColumnFilter
                      hideFooterPagination={true}
                      disableDensitySelector
                      disableColumnSelector
                      disableRowSelectionOnClick
                    />
                  </>
                ))}
              </Paper>
            </Grid>
            <Grid size={{ md: 5 }} border={1}>
              <Chart
                options={options2}
                series={series2}
                type="bar"
                height={350}
                width="100%"
              />
            </Grid>
          </Grid>
        ))}
      </Grid>

      <Modal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
        sx={{ justifyContent: 'center', display: 'flex', alignItems: 'center' }}
        aria-labelledby="modal-city-select"
        aria-describedby="modal-city-select-description"
      >
        <Grid container display={'flex'}>
          <Dialog
            maxWidth="lg"
            open={openModal}
            onClose={() => {
              setOpenModal(false);
            }}
          >
            <IconButton
              onClick={handleClose}
              sx={{
                position: 'absolute',
                top: 8,
                left: 8,
                color: theme => theme.palette.grey[600],
              }}
            >
              <Close />
            </IconButton>
            <DialogTitle m={2}>فعالیت ها</DialogTitle>

            <DialogContent sx={{ width: '1000px' }}>
              <Grid
                container
                display={'flex'}
                justifyContent={'space-between'}
                my={2}
              >
                {baseInfoItems.map(item => (
                  <Grid size={{ md: 3 }} key={item.name}>
                    <Controller
                      name={item.name}
                      control={control}
                      render={({ field }) => (
                        <RenderFormInput
                          controllerField={field}
                          errors={errors}
                          {...item}
                          {...field}
                          onChange={(e: any) => setTitle(e.target.value)}
                          value={title}
                        />
                      )}
                    />
                  </Grid>
                ))}

                <Grid size={{ md: 3 }}>
                  <Autocomplete
                    disablePortal
                    options={tempStatusOptions}
                    onChange={(_, newValue) => setStatus(newValue)}
                    renderInput={params => (
                      <TextField {...params} label="وضعیت" />
                    )}
                  />
                </Grid>

                <Grid size={{ md: 3 }}>
                  <DatePicker
                    label="تاریخ"
                    value={date}
                    onChange={newValue => setDate(newValue)}
                  />
                </Grid>

                <Grid size={{ md: 2 }} my={1}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleAddEntry}
                  >
                    ثبت فعالیت
                  </Button>
                </Grid>
              </Grid>

              <Grid container display={'flex'} justifyContent={'center'} my={1}>
                <DataGrid
                  rows={entries}
                  columns={column}
                  disableColumnFilter
                  hideFooterPagination={true}
                />
              </Grid>
            </DialogContent>
          </Dialog>
        </Grid>
      </Modal>

      <Modal
        open={creditModal}
        onClose={() => {
          setCreditModal(false);
        }}
        sx={{ justifyContent: 'center', display: 'flex', alignItems: 'center' }}
        aria-labelledby="modal-city-select"
        aria-describedby="modal-city-select-description"
      >
        <Grid container display={'flex'}>
          <Dialog
            maxWidth="lg"
            open={creditModal}
            onClose={() => {
              setCreditModal(false);
            }}
          >
            <IconButton
              onClick={handleCreditModalClose}
              sx={{
                position: 'absolute',
                top: 8,
                left: 8,
                color: theme => theme.palette.grey[600],
              }}
            >
              <Close />
            </IconButton>
            <DialogTitle m={2}>فعالیت ها</DialogTitle>

            <DialogContent sx={{ width: '1000px' }}>
              <Grid container display={'flex'} justifyContent={'flex-start'}>
                <Typography
                  fontWeight={300}
                  variant="h5"
                  sx={{ borderBottom: 1 }}
                >
                  سر فصل اعتبارات
                </Typography>
              </Grid>
              <Grid
                container
                display={'flex'}
                justifyContent={'space-between'}
                my={2}
              >
                <TextField label="تجهیز(آجا)" variant="outlined" />
                <TextField label="تجهیز(صنعت)" variant="outlined" />
                <TextField label="عمرانی" variant="outlined" />
                <TextField label="اداره" variant="outlined" />
              </Grid>

              <Grid container display={'flex'} justifyContent={'flex-start'}>
                <Typography
                  fontWeight={300}
                  variant="h5"
                  my={1}
                  sx={{ borderBottom: 1 }}
                >
                  بازه زمانی
                </Typography>
              </Grid>
              <Grid
                container
                display={'flex'}
                justifyContent={'space-between'}
                my={2}
              >
                <Grid size={{ md: 3 }}>
                  <DatePicker
                    label="از تاریخ"
                    value={date}
                    onChange={newValue => setDate(newValue)}
                  />
                </Grid>
                <Grid size={{ md: 3 }}>
                  <DatePicker
                    label="تا تاریخ"
                    value={date}
                    onChange={newValue => setDate(newValue)}
                  />
                </Grid>
              </Grid>

              <Grid container display={'flex'} justifyContent={'center'} my={1}>
                <Button variant="contained" color="success">
                  ثبت
                </Button>
              </Grid>
            </DialogContent>
          </Dialog>
        </Grid>
      </Modal>
    </>
  );
};

export default GoalsProgramsTable;
