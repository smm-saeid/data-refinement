import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
} from '@mui/material';
import { Visibility } from '@mui/icons-material';

interface PersonnelCardProps {
  personnel: {
    personnelId?: string;
    firstName?: string;
    lastName?: string;
    cdCommonBaseDataPresentDegreeTitle?: string;
    personnelNumber?: string;
    jobTitle?: string;
    organizationDegreeTitle?: string;
    cdCommonBaseDataCategoryTitle?: string;
    serviceStatusTitle?: string;
    orOrganizationUnitPresentPartialUnitName?: string;
    professionTitle?: string;
    nationalCode?: string;
    appointmentDate?: string;
  };
  onViewDetails: (personnel: any) => void;
}

const PersonnelCard: React.FC<PersonnelCardProps> = ({
  personnel,
  onViewDetails,
}) => {
  const fullName =
    `${personnel.firstName || ''} ${personnel.lastName || ''}`.trim();
  const specialty = `${personnel.cdCommonBaseDataCategoryTitle || ''}${
    personnel.professionTitle ? ' - ' + personnel.professionTitle : ''
  }`;

  const jobPosition =
    personnel.jobTitle || personnel.organizationDegreeTitle || 'نامشخص';

  const calculateServiceAge = () => {
    if (!personnel.lastName) return '-';
    return '25';
  };

  const calculateBirthAge = () => {
    if (!personnel.nationalCode) return '-';
    return '27';
  };

  const calculateValidityDuration = () => {
    if (!personnel.appointmentDate) return '-';
    return '2 سال';
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        border: '1px solid #e0e0e0',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          backgroundColor: '#b9f664',
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
        {/* هدر کارت */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 2.5,
          }}
        >
          <Chip
            label={personnel.cdCommonBaseDataPresentDegreeTitle || 'نامشخص'}
            color="primary"
            size="small"
            sx={{ fontWeight: 'bold' }}
          />
          <Typography
            variant="caption"
            sx={{ color: '#1a237e', fontSize: '15px' }}
          >
            شماره پرسنلی :{personnel.personnelNumber}
          </Typography>
        </Box>

        {/* نام و نشان */}
        <Typography
          variant="h6"
          sx={{ mb: 2, fontWeight: 'bold', color: '#1a237e' }}
        >
          {fullName || 'نامشخص'}
        </Typography>

        {/* اطلاعات شغلی */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 0.5, fontSize: '0.75rem' }}
          >
            جایگاه شغلی:
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            {jobPosition}
          </Typography>
        </Box>

        {/* رسته و تخصص */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 0.5, fontSize: '0.75rem' }}
          >
            رسته و تخصص:
          </Typography>
          <Typography variant="body2">{specialty || 'نامشخص'}</Typography>
        </Box>

        {/* یگان */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 0.5, fontSize: '0.75rem' }}
          >
            یگان:
          </Typography>
          <Typography variant="body2">
            {personnel.orOrganizationUnitPresentPartialUnitName || 'نامشخص'}
          </Typography>
        </Box>

        <Box
          sx={{ mb: 3, p: 1.5, backgroundColor: '#f8f9fa', borderRadius: 1 }}
        >
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                سن خدمتی:
              </Typography>
              <Typography
                variant="caption"
                sx={{ display: 'block', fontWeight: 'medium' }}
              >
                {calculateServiceAge()}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                سن شناسنامه‌ای:
              </Typography>
              <Typography
                variant="caption"
                sx={{ display: 'block', fontWeight: 'medium' }}
              >
                {calculateBirthAge()}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                مدت اعتبار:
              </Typography>
              <Typography
                variant="caption"
                sx={{ display: 'block', fontWeight: 'medium' }}
              >
                {calculateValidityDuration()}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 'auto',
          }}
        >
          <Chip
            label={personnel.serviceStatusTitle || 'نامشخص'}
            variant="outlined"
            size="small"
            color="secondary"
          />
          <Button
            variant="outlined"
            size="small"
            startIcon={<Visibility />}
            onClick={() => onViewDetails(personnel)}
            sx={{
              minWidth: 'auto',
              px: 1.5,
              py: 0.5,
              fontSize: '0.75rem',
            }}
          >
            مشاهده
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PersonnelCard;
