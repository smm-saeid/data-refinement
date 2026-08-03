import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Paper,
  Chip,
  useTheme,
} from '@mui/material';

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

interface ViewDialogProps {
  open: boolean;
  data: NewsItem | null;
  onClose: () => void;
  formatDateForDisplay: (dateString: string) => string;
}

const textLabels = {
  inspection: 'بازدید و بازرسی',
  ceremony: 'مراسمات و جلسه',
  incident: 'رویداد و سوانح',
  publicAid: 'مردمیاری',
  importantEvent: 'حائز اهمیت',
  awarenessClass: 'کلاس آگاه سازی و پیشگیری',
};

const fieldLabels: { [key: string]: { [key: string]: string } } = {
  inspection: {
    date: 'تاریخ بازدید',
    unit: 'یگان/واحد',
    description: 'شرح بازدید',
    result: 'نتیجه',
  },
  ceremony: {
    date: 'تاریخ مراسم',
    title: 'عنوان مراسم',
    location: 'محل برگزاری',
    participants: 'شرکت کنندگان',
    description: 'شرح مراسم',
  },
  incident: {
    date: 'تاریخ رویداد',
    type: 'نوع رویداد',
    location: 'محل رویداد',
    description: 'شرح رویداد',
    actions: 'اقدامات انجام شده',
  },
  publicAid: {
    date: 'تاریخ',
    type: 'نوع کمک',
    location: 'محل',
    description: 'شرح کمک',
    beneficiaries: 'ذینفعان',
  },
  importantEvent: {
    date: 'تاریخ',
    title: 'عنوان رویداد',
    description: 'شرح رویداد',
    impact: 'اثرات و پیامدها',
  },
  awarenessClass: {
    classDate: 'تاریخ کلاس',
    unitName: 'نام یگان',
    subject: 'موضوع',
    participants: 'شرکت کنندگان',
    instructor: 'مدرس',
  },
};

const ViewDialog = ({
  open,
  data,
  onClose,
  formatDateForDisplay,
}: ViewDialogProps) => {
  const theme = useTheme();

  const renderSection = (title: string, items: any[], sectionKey: string) => {
    if (!items || items.length === 0) {
      return (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="primary" gutterBottom>
            {title}:
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="body1" color="textSecondary">
              ---
            </Typography>
          </Paper>
        </Box>
      );
    }

    return (
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" color="primary" gutterBottom>
          {title}:
        </Typography>
        {items.map((item, index) => (
          <Paper
            key={index}
            variant="outlined"
            sx={{ p: 2, mb: 1, borderRadius: 2 }}
          >
            <Typography variant="subtitle2" gutterBottom>
              {title} {index + 1}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {Object.entries(fieldLabels[sectionKey]).map(([field, label]) => (
                <Box
                  key={field}
                  sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}
                >
                  <Typography variant="body2" sx={{ flex: '1 1 200px' }}>
                    <strong>{label}:</strong>{' '}
                    {field === 'date' || field === 'classDate'
                      ? formatDateForDisplay(item[field])
                      : item[field] || '---'}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        ))}
      </Box>
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
          backgroundColor: theme.palette.primary.main,
          color: 'white',
          textAlign: 'center',
        }}
      >
        مشاهده جزئیات خبر
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        {data && (
          <Box sx={{ mt: 2 }}>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}
            >
              <Chip
                label={`شماره خبرنامه: ${data.newsletterNo}`}
                color="primary"
                variant="outlined"
              />
              <Chip
                label={`تاریخ گزارش: ${formatDateForDisplay(data.reportDate)}`}
                color="secondary"
                variant="outlined"
              />
            </Box>

            {renderSection(
              textLabels.inspection,
              data.inspection,
              'inspection'
            )}
            {renderSection(textLabels.ceremony, data.ceremony, 'ceremony')}
            {renderSection(textLabels.incident, data.incident, 'incident')}
            {renderSection(textLabels.publicAid, data.publicAid, 'publicAid')}
            {renderSection(
              textLabels.importantEvent,
              data.importantEvent,
              'importantEvent'
            )}
            {renderSection(
              textLabels.awarenessClass,
              data.awarenessClass,
              'awarenessClass'
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
          بستن
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewDialog;
