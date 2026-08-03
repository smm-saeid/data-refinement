import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress
} from '@mui/material';
import { useApiQuery } from 'hooks/useApi.ts';
import InspectionApis from '../../api.ts';
import { OrganizationForcesTypeEnum, organizationForceNames } from '../../types.ts';

type ProvinceUnitsDialogProps = {
  open: boolean;
  onClose: () => void;
  provinceId: number | null;
  provinceName: string;
};

// تعریف تایپ پاسخ سرور برای یگان ها
type UnitType = {
  id: string;
  name: string;
  code: string;
  // سایر فیلدها در صورت نیاز
};

// ساختار دیتای پاسخ (هر کلید نام یک نیرو است که لیستی از یگان ها دارد)
type ProvinceUnitsResponse = {
  [key in OrganizationForcesTypeEnum]?: UnitType[];
};

export default function ProvinceUnitsDialog({ open, onClose, provinceId, provinceName }: ProvinceUnitsDialogProps) {
  const [activeTab, setActiveTab] = useState(0);

  // دریافت لیست یگان ها بر اساس ID استان
  const { data: response, isLoading } = useApiQuery<{ data: ProvinceUnitsResponse }>({
    url: provinceId ? InspectionApis.commonBaseData.findOrganizationsByProvince(provinceId) : null,
    enabled: !!provinceId && open, // فقط وقتی آیدی هست و دیالوگ باز است درخواست بده
  });

  const unitsData = response?.data || {};

  // لیست کلیدهای نیروها برای ساخت تب ها (نزاجا، نداجا و ...)
  // نکته: در فایل types شما مقدار aja هم وجود دارد اما در پاسخ نمونه جیسون شما نبود.
  // ما طبق Enum پیش میرویم.
  const forcesKeys = Object.values(OrganizationForcesTypeEnum);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        لیست یگان‌های استان: {provinceName}
      </DialogTitle>

      <DialogContent dividers sx={{ minHeight: '400px' }}>
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
                {forcesKeys.map((forceKey) => (
                  <Tab
                    key={forceKey}
                    label={`${organizationForceNames[forceKey]} (${unitsData[forceKey]?.length || 0})`}
                  />
                ))}
              </Tabs>
            </Box>

            {forcesKeys.map((forceKey, index) => (
              <Box
                key={forceKey}
                role="tabpanel"
                hidden={activeTab !== index}
                sx={{ p: 2 }}
              >
                {activeTab === index && (
                  <Box>
                    {unitsData[forceKey] && unitsData[forceKey]!.length > 0 ? (
                      <List dense>
                        {unitsData[forceKey]!.map((unit: UnitType, idx: number) => (
                          <React.Fragment key={unit.id}>
                            <ListItem>
                              <ListItemText
                                primary={unit.name}
                                secondary={`کد: ${unit.code || '-'}`}
                              />
                            </ListItem>
                            {idx < unitsData[forceKey]!.length - 1 && <Divider />}
                          </React.Fragment>
                        ))}
                      </List>
                    ) : (
                      <Typography variant="body2" color="text.secondary" align="center" mt={3}>
                        یگانی برای این نیرو در این استان یافت نشد.
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            ))}
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          بستن
        </Button>
      </DialogActions>
    </Dialog>
  );
}