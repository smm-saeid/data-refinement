import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  Typography,
  Paper,
  IconButton,
  useTheme,
} from '@mui/material';
import { Remove as RemoveIcon, Add as AddIcon } from '@mui/icons-material';

export type AwarenessClass = {
  classDate: string;
  unitName: string;
  subject: string;
  participants: string;
  instructor: string;
};

export type InspectionItem = {
  date: string;
  unit: string;
  description: string;
  result: string;
};

export type CeremonyItem = {
  date: string;
  title: string;
  location: string;
  participants: string;
  description: string;
};

export type IncidentItem = {
  date: string;
  type: string;
  location: string;
  description: string;
  actions: string;
};

export type PublicAidItem = {
  date: string;
  type: string;
  location: string;
  description: string;
  beneficiaries: string;
};

export type ImportantEventItem = {
  date: string;
  title: string;
  description: string;
  impact: string;
};

export type NewsItem = {
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

interface EditDialogProps {
  open: boolean;
  data: NewsItem | null;
  editData: Partial<NewsItem>;
  onClose: () => void;
  onSave: () => void;
  onEditFieldChange: (field: keyof NewsItem, value: any) => void;
  onEditInspectionChange: (index: number, field: string, value: string) => void;
  onEditCeremonyChange: (index: number, field: string, value: string) => void;
  onEditIncidentChange: (index: number, field: string, value: string) => void;
  onEditAwarenessClassChange: (
    index: number,
    field: string,
    value: string
  ) => void;
  onEditPublicAidChange: (index: number, field: string, value: string) => void;
  onEditImportantEventChange: (
    index: number,
    field: string,
    value: string
  ) => void;
  formatDateToYYYYMMDD: (dateString: string) => string;
}

const textLabels = {
  inspection: 'بازدید و بازرسی',
  ceremony: 'مراسمات و جلسه',
  incident: 'رویداد و سوانح',
  publicAid: 'مردمیاری',
  importantEvent: 'حائز اهمیت',
  awarenessClass: 'کلاس آگاه سازی و پیشگیری',
};

const fieldConfigs: {
  [key: string]: { label: string; field: string; multiline?: boolean }[];
} = {
  inspection: [
    { label: 'تاریخ بازدید', field: 'date' },
    { label: 'یگان/واحد', field: 'unit' },
    { label: 'شرح بازدید', field: 'description', multiline: true },
    { label: 'نتیجه', field: 'result', multiline: true },
  ],
  ceremony: [
    { label: 'تاریخ مراسم', field: 'date' },
    { label: 'عنوان مراسم', field: 'title' },
    { label: 'محل برگزاری', field: 'location' },
    { label: 'شرکت کنندگان', field: 'participants' },
    { label: 'شرح مراسم', field: 'description', multiline: true },
  ],
  incident: [
    { label: 'تاریخ رویداد', field: 'date' },
    { label: 'نوع رویداد', field: 'type' },
    { label: 'محل رویداد', field: 'location' },
    { label: 'شرح رویداد', field: 'description', multiline: true },
    { label: 'اقدامات انجام شده', field: 'actions', multiline: true },
  ],
  publicAid: [
    { label: 'تاریخ', field: 'date' },
    { label: 'نوع کمک', field: 'type' },
    { label: 'محل', field: 'location' },
    { label: 'شرح کمک', field: 'description', multiline: true },
    { label: 'ذینفعان', field: 'beneficiaries' },
  ],
  importantEvent: [
    { label: 'تاریخ', field: 'date' },
    { label: 'عنوان رویداد', field: 'title' },
    { label: 'شرح رویداد', field: 'description', multiline: true },
    { label: 'اثرات و پیامدها', field: 'impact', multiline: true },
  ],
  awarenessClass: [
    { label: 'تاریخ کلاس', field: 'classDate' },
    { label: 'نام یگان', field: 'unitName' },
    { label: 'موضوع', field: 'subject' },
    { label: 'شرکت کنندگان', field: 'participants' },
    { label: 'مدرس', field: 'instructor' },
  ],
};

const EditDialog: React.FC<EditDialogProps> = ({
  open,
  data,
  editData,
  onClose,
  onSave,
  onEditFieldChange,
  onEditInspectionChange,
  onEditCeremonyChange,
  onEditIncidentChange,
  onEditAwarenessClassChange,
  onEditPublicAidChange,
  onEditImportantEventChange,
  // formatDateToYYYYMMDD
}) => {
  const theme = useTheme();

  const getItems = (section: string) => {
    switch (section) {
      case 'inspection':
        return editData.inspection || [];
      case 'ceremony':
        return editData.ceremony || [];
      case 'incident':
        return editData.incident || [];
      case 'awarenessClass':
        return editData.awarenessClass || [];
      case 'publicAid':
        return editData.publicAid || [];
      case 'importantEvent':
        return editData.importantEvent || [];
      default:
        return [];
    }
  };

  const getDefaultItem = (section: string) => {
    switch (section) {
      case 'inspection':
        return { date: 'بدون زمان', unit: '', description: '', result: '' };
      case 'ceremony':
        return {
          date: 'بدون زمان',
          title: '',
          location: '',
          participants: '',
          description: '',
        };
      case 'incident':
        return {
          date: 'بدون زمان',
          type: '',
          location: '',
          description: '',
          actions: '',
        };
      case 'awarenessClass':
        return {
          classDate: 'بدون زمان',
          unitName: '',
          subject: '',
          participants: '',
          instructor: '',
        };
      case 'publicAid':
        return {
          date: 'بدون زمان',
          type: '',
          location: '',
          description: '',
          beneficiaries: '',
        };
      case 'importantEvent':
        return { date: 'بدون زمان', title: '', description: '', impact: '' };
      default:
        return {};
    }
  };

  const getOnChangeHandler = (section: string) => {
    switch (section) {
      case 'inspection':
        return onEditInspectionChange;
      case 'ceremony':
        return onEditCeremonyChange;
      case 'incident':
        return onEditIncidentChange;
      case 'awarenessClass':
        return onEditAwarenessClassChange;
      case 'publicAid':
        return onEditPublicAidChange;
      case 'importantEvent':
        return onEditImportantEventChange;
      default:
        return () => {};
    }
  };

  const addItem = (section: string) => {
    const currentItems = getItems(section);
    const newItem = getDefaultItem(section);
    onEditFieldChange(section as keyof NewsItem, [...currentItems, newItem]);
  };

  const removeItem = (section: string, index: number) => {
    const currentItems = getItems(section);
    if (currentItems.length > 1) {
      const updatedItems = currentItems.filter((_, i) => i !== index);
      onEditFieldChange(section as keyof NewsItem, updatedItems);
    }
  };

  const renderSection = (title: string, sectionKey: string) => {
    const items = getItems(sectionKey);
    const onChangeHandler = getOnChangeHandler(sectionKey);
    const fields = fieldConfigs[sectionKey];

    return (
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
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
            onClick={() => addItem(sectionKey)}
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
                  onClick={() => removeItem(sectionKey, index)}
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
                    value={String(
                      item[fieldConfig.field as keyof typeof item] || ''
                    )}
                    onChange={e =>
                      onChangeHandler(index, fieldConfig.field, e.target.value)
                    }
                  />
                ))}
              </Box>
            </Box>
          </Box>
        ))}
      </Paper>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle
        sx={{
          backgroundColor: theme.palette.secondary.main,
          color: 'white',
          textAlign: 'center',
        }}
      >
        ویرایش خبر
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        {data && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
              <TextField
                label="شماره خبرنامه"
                type="number"
                value={editData.newsletterNo || ''}
                onChange={e =>
                  onEditFieldChange('newsletterNo', Number(e.target.value))
                }
                sx={{ flex: '1 1 200px', minWidth: 0 }}
              />
              <TextField
                label="تاریخ گزارش"
                sx={{ flex: '1 1 200px', minWidth: 0 }}
                value={editData.reportDate || ''}
                onChange={e => onEditFieldChange('reportDate', e.target.value)}
              />
            </Box>

            {renderSection(textLabels.inspection, 'inspection')}
            {renderSection(textLabels.ceremony, 'ceremony')}
            {renderSection(textLabels.incident, 'incident')}
            {renderSection(textLabels.publicAid, 'publicAid')}
            {renderSection(textLabels.importantEvent, 'importantEvent')}
            {renderSection(textLabels.awarenessClass, 'awarenessClass')}
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          color="inherit"
          sx={{ borderRadius: 2 }}
        >
          انصراف
        </Button>
        <Button
          onClick={onSave}
          variant="contained"
          color="secondary"
          sx={{ borderRadius: 2 }}
        >
          ذخیره تغییرات
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDialog;
