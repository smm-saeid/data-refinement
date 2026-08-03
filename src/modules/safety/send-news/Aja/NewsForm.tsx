import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Paper,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import axios from 'axios';
import researchApis from '../../apis';

type AwarenessClass = {
  classDate: string;
  unitName: string;
  subject: string;
  participants: string;
  instructor: string;
};

type InspectionItem = {
  date: string;
  unit: string;
  description: string;
  result: string;
};

type CeremonyItem = {
  date: string;
  title: string;
  location: string;
  participants: string;
  description: string;
};

type IncidentItem = {
  date: string;
  type: string;
  location: string;
  description: string;
  actions: string;
};

type PublicAidItem = {
  date: string;
  type: string;
  location: string;
  description: string;
  beneficiaries: string;
};

type ImportantEventItem = {
  date: string;
  title: string;
  description: string;
  impact: string;
};

type NewsItem = {
  id: string;
  newsletterNo: number;
  reportDate: string;
  inspection: InspectionItem[];
  ceremony: CeremonyItem[];
  incident: IncidentItem[];
  awarenessClass: AwarenessClass[];
  publicAid: PublicAidItem[];
  importantEvent: ImportantEventItem[];
  archived: boolean;
};

const textLabels = {
  inspection: 'بازدید و بازرسی',
  ceremony: 'مراسمات و جلسه',
  incident: 'رویداد و سوانح',
  publicAid: 'مردمیاری',
  importantEvent: 'حائز اهمیت',
};

interface NewsFormProps {
  onAddNewsItem: (item: NewsItem) => void;
}

type FieldConfig = {
  label: string;
  field: string;
  multiline?: boolean;
};

const NewsForm = ({ onAddNewsItem }: NewsFormProps) => {
  const theme = useTheme();

  const [newsletterNo, setNewsletterNo] = useState<number | ''>('');
  const [reportDate, setReportDate] = useState('بدون زمان');

  const [inspections, setInspections] = useState<InspectionItem[]>([
    { date: 'بدون زمان', unit: '', description: '', result: '' },
  ]);
  const [ceremonies, setCeremonies] = useState<CeremonyItem[]>([
    {
      date: 'بدون زمان',
      title: '',
      location: '',
      participants: '',
      description: '',
    },
  ]);
  const [incidents, setIncidents] = useState<IncidentItem[]>([
    { date: 'بدون زمان', type: '', location: '', description: '', actions: '' },
  ]);
  const [awarenessClasses, setAwarenessClasses] = useState<AwarenessClass[]>([
    {
      classDate: 'بدون زمان',
      unitName: '',
      subject: '',
      participants: '',
      instructor: '',
    },
  ]);
  const [publicAids, setPublicAids] = useState<PublicAidItem[]>([
    {
      date: 'بدون زمان',
      type: '',
      location: '',
      description: '',
      beneficiaries: '',
    },
  ]);
  const [importantEvents, setImportantEvents] = useState<ImportantEventItem[]>([
    { date: 'بدون زمان', title: '', description: '', impact: '' },
  ]);

  const addItem = <T,>(
    setter: React.Dispatch<React.SetStateAction<T[]>>,
    defaultItem: T
  ): void => {
    setter(prev => [...prev, defaultItem]);
  };

  const removeItem = <T,>(
    setter: React.Dispatch<React.SetStateAction<T[]>>,
    index: number
  ): void => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

  const addInspection = (): void =>
    addItem(setInspections, {
      date: 'بدون زمان',
      unit: '',
      description: '',
      result: '',
    });
  const removeInspection = (index: number): void =>
    removeItem(setInspections, index);
  const handleInspectionChange = (
    index: number,
    field: string,
    value: string
  ): void => {
    const updatedItems = [...inspections];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    setInspections(updatedItems);
  };

  const addCeremony = (): void =>
    addItem(setCeremonies, {
      date: 'بدون زمان',
      title: '',
      location: '',
      participants: '',
      description: '',
    });
  const removeCeremony = (index: number): void =>
    removeItem(setCeremonies, index);
  const handleCeremonyChange = (
    index: number,
    field: string,
    value: string
  ): void => {
    const updatedItems = [...ceremonies];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    setCeremonies(updatedItems);
  };

  const addIncident = (): void =>
    addItem(setIncidents, {
      date: 'بدون زمان',
      type: '',
      location: '',
      description: '',
      actions: '',
    });
  const removeIncident = (index: number): void =>
    removeItem(setIncidents, index);
  const handleIncidentChange = (
    index: number,
    field: string,
    value: string
  ): void => {
    const updatedItems = [...incidents];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    setIncidents(updatedItems);
  };

  const addPublicAid = (): void =>
    addItem(setPublicAids, {
      date: 'بدون زمان',
      type: '',
      location: '',
      description: '',
      beneficiaries: '',
    });
  const removePublicAid = (index: number): void =>
    removeItem(setPublicAids, index);
  const handlePublicAidChange = (
    index: number,
    field: string,
    value: string
  ): void => {
    const updatedItems = [...publicAids];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    setPublicAids(updatedItems);
  };

  const addImportantEvent = (): void =>
    addItem(setImportantEvents, {
      date: 'بدون زمان',
      title: '',
      description: '',
      impact: '',
    });
  const removeImportantEvent = (index: number): void =>
    removeItem(setImportantEvents, index);
  const handleImportantEventChange = (
    index: number,
    field: string,
    value: string
  ): void => {
    const updatedItems = [...importantEvents];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    setImportantEvents(updatedItems);
  };

  const addAwarenessClass = (): void => {
    setAwarenessClasses(prev => [
      ...prev,
      {
        classDate: 'بدون زمان',
        unitName: '',
        subject: '',
        participants: '',
        instructor: '',
      },
    ]);
  };

  const removeAwarenessClass = (index: number): void => {
    if (awarenessClasses.length > 1) {
      setAwarenessClasses(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleAwarenessClassChange = (
    index: number,
    field: string,
    value: string
  ): void => {
    const updatedClasses = [...awarenessClasses];
    updatedClasses[index] = {
      ...updatedClasses[index],
      [field]: value,
    };
    setAwarenessClasses(updatedClasses);
  };

  const formatDateToYYYYMMDD = (dateString: string): string => {
    if (!dateString || dateString === 'بدون زمان') {
      return new Date().toISOString().split('T')[0];
    }

    try {
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
      }

      if (dateString.includes('T')) {
        return dateString.split('T')[0];
      }

      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }

      return new Date().toISOString().split('T')[0];
    } catch (error) {
      console.error('Error formatting date:', error);
      return new Date().toISOString().split('T')[0];
    }
  };

  const handleSubmit = async (): Promise<void> => {
    const submitData = {
      newsletterNo: newsletterNo === '' ? 0 : Number(newsletterNo),
      reportDate: formatDateToYYYYMMDD(reportDate),
      inspection: inspections.map(item => ({
        ...item,
        date: formatDateToYYYYMMDD(item.date),
      })),
      ceremony: ceremonies.map(item => ({
        ...item,
        date: formatDateToYYYYMMDD(item.date),
      })),
      incident: incidents.map(item => ({
        ...item,
        date: formatDateToYYYYMMDD(item.date),
      })),
      awarenessClass: awarenessClasses.map(cls => ({
        ...cls,
        classDate: formatDateToYYYYMMDD(cls.classDate),
      })),
      publicAid: publicAids.map(item => ({
        ...item,
        date: formatDateToYYYYMMDD(item.date),
      })),
      importantEvent: importantEvents.map(item => ({
        ...item,
        date: formatDateToYYYYMMDD(item.date),
      })),
    };

    console.log('Submitting data:', submitData);

    try {
      const response = await axios.post(
        researchApis.NewsLetter.aja.save,
        submitData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        const newItem = response.data;
        onAddNewsItem(newItem);

        setNewsletterNo('');
        setReportDate('بدون زمان');
        setInspections([
          { date: 'بدون زمان', unit: '', description: '', result: '' },
        ]);
        setCeremonies([
          {
            date: 'بدون زمان',
            title: '',
            location: '',
            participants: '',
            description: '',
          },
        ]);
        setIncidents([
          {
            date: 'بدون زمان',
            type: '',
            location: '',
            description: '',
            actions: '',
          },
        ]);
        setAwarenessClasses([
          {
            classDate: 'بدون زمان',
            unitName: '',
            subject: '',
            participants: '',
            instructor: '',
          },
        ]);
        setPublicAids([
          {
            date: 'بدون زمان',
            type: '',
            location: '',
            description: '',
            beneficiaries: '',
          },
        ]);
        setImportantEvents([
          { date: 'بدون زمان', title: '', description: '', impact: '' },
        ]);

        alert('خبر با موفقیت ثبت شد');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('خطا در ثبت خبر');
    }
  };

  const getFieldValue = (item: any, field: string): string => {
    return item[field] || '';
  };

  const renderComplexSection = (
    title: string,
    items: any[],
    onAdd: () => void,
    onRemove: (index: number) => void,
    onChange: (index: number, field: string, value: string) => void,
    fields: FieldConfig[]
  ) => (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant="h6" color="primary">
          {title}
        </Typography>
        <Button
          startIcon={<AddIcon />}
          onClick={onAdd}
          variant="outlined"
          size="small"
        >
          افزودن
        </Button>
      </Box>

      {items.map((item, index) => (
        <Box
          key={index}
          sx={{
            mb: 2,
            p: 2,
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: 1,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="subtitle1">
              {title} {index + 1}
            </Typography>
            {items.length > 1 && (
              <IconButton
                color="error"
                onClick={() => onRemove(index)}
                size="small"
              >
                <RemoveIcon />
              </IconButton>
            )}
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {fields.map(fieldConfig => (
                <TextField
                  key={fieldConfig.field}
                  label={fieldConfig.label}
                  multiline={fieldConfig.multiline}
                  minRows={fieldConfig.multiline ? 2 : 1}
                  sx={{ flex: '1 1 200px', minWidth: 0 }}
                  fullWidth
                  value={getFieldValue(item, fieldConfig.field)}
                  onChange={e =>
                    onChange(index, fieldConfig.field, e.target.value)
                  }
                />
              ))}
            </Box>
          </Box>
        </Box>
      ))}
    </Paper>
  );

  return (
    <Card
      elevation={3}
      sx={{
        mb: 3,
        background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
      }}
    >
      <CardContent>
        <Typography
          variant="h5"
          mb={2}
          align="center"
          color="primary"
          fontWeight="bold"
        >
          فرم ثبت خبر ستاد مشترک ارتش جمهوری اسلامی ایران
        </Typography>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap',
            mb: 2,
            alignItems: 'center',
          }}
        >
          <TextField
            type="number"
            label="شماره خبرنامه"
            value={newsletterNo}
            onChange={e =>
              setNewsletterNo(e.target.value ? Number(e.target.value) : '')
            }
            sx={{ minWidth: 150 }}
          />

          <TextField
            label="تاریخ گزارش"
            value={reportDate}
            onChange={e => setReportDate(e.target.value)}
            sx={{ minWidth: 150 }}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{ px: 4 }}
          >
            ثبت خبر
          </Button>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {renderComplexSection(
            textLabels.inspection,
            inspections,
            addInspection,
            removeInspection,
            handleInspectionChange,
            [
              { label: 'تاریخ بازدید', field: 'date' },
              { label: 'یگان/واحد', field: 'unit' },
              { label: 'شرح بازدید', field: 'description', multiline: true },
              { label: 'نتیجه', field: 'result', multiline: true },
            ]
          )}

          {renderComplexSection(
            textLabels.ceremony,
            ceremonies,
            addCeremony,
            removeCeremony,
            handleCeremonyChange,
            [
              { label: 'تاریخ مراسم', field: 'date' },
              { label: 'عنوان مراسم', field: 'title' },
              { label: 'محل برگزاری', field: 'location' },
              { label: 'شرکت کنندگان', field: 'participants' },
              { label: 'شرح مراسم', field: 'description', multiline: true },
            ]
          )}

          {renderComplexSection(
            textLabels.incident,
            incidents,
            addIncident,
            removeIncident,
            handleIncidentChange,
            [
              { label: 'تاریخ رویداد', field: 'date' },
              { label: 'نوع رویداد', field: 'type' },
              { label: 'محل رویداد', field: 'location' },
              { label: 'شرح رویداد', field: 'description', multiline: true },
              { label: 'اقدامات انجام شده', field: 'actions', multiline: true },
            ]
          )}

          {renderComplexSection(
            textLabels.publicAid,
            publicAids,
            addPublicAid,
            removePublicAid,
            handlePublicAidChange,
            [
              { label: 'تاریخ', field: 'date' },
              { label: 'نوع کمک', field: 'type' },
              { label: 'محل', field: 'location' },
              { label: 'شرح کمک', field: 'description', multiline: true },
              { label: 'ذینفعان', field: 'beneficiaries' },
            ]
          )}

          {renderComplexSection(
            textLabels.importantEvent,
            importantEvents,
            addImportantEvent,
            removeImportantEvent,
            handleImportantEventChange,
            [
              { label: 'تاریخ', field: 'date' },
              { label: 'عنوان رویداد', field: 'title' },
              { label: 'شرح رویداد', field: 'description', multiline: true },
              { label: 'اثرات و پیامدها', field: 'impact', multiline: true },
            ]
          )}

          {renderComplexSection(
            'کلاس آگاه سازی و پیشگیری',
            awarenessClasses,
            addAwarenessClass,
            removeAwarenessClass,
            handleAwarenessClassChange,
            [
              { label: 'تاریخ کلاس', field: 'classDate' },
              { label: 'نام یگان', field: 'unitName' },
              { label: 'موضوع', field: 'subject' },
              { label: 'شرکت کنندگان', field: 'participants' },
              { label: 'مدرس', field: 'instructor' },
            ]
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default NewsForm;
