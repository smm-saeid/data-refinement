import React from 'react';
import {
  Grid,
  TextField,
  Button,
  Autocomplete,
  Typography,
  Box,
} from '@mui/material';
import BackButton from '@/components/button/BackButton';
import { useNavigate } from 'react-router';

type BaseInfoDataFormProps = {
  keyValue: string;
  value: string;
  orderNo: number | null;
  check: boolean;
  description: string;
  idNum?: number;
  title?: string;
  options: { id: number; value: string }[];
  selectedValue: { id: number; value: string } | null;
  setKey: (v: string) => void;
  setValue: (v: string) => void;
  setOrderNo: (v: number | null) => void;
  setCheck: (v: boolean) => void;
  setDescription: (v: string) => void;
    setSelectedValue: (
    val: { id: number; value: string } | null
  ) => void;
  onSubmit: () => void;
};

export function BaseInfoDataForm({
  keyValue,
  value,
  orderNo,
  check,
  description,

  idNum,
  title,
  options,
  selectedValue,
  setKey,
  setValue,
  setOrderNo,
  setCheck,
  setDescription,

    setSelectedValue,
  onSubmit,
}: BaseInfoDataFormProps) {
  const navigate = useNavigate();
  return (
    <Box mb={4}>
      <Grid container spacing={2} alignItems="center" flexWrap="wrap">
        <Grid size={{ xs: 12, md: 11 }}>
          <Typography fontWeight={700} variant="h5">
            فرم اطلاعات پایه 
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 1 }}>
          <BackButton
            onBack={() => navigate(-1)}
            text="بازگشت"
            color="warning"
            minWidth={120}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 1.5 }}>
          <TextField
            label="کلید"
            value={keyValue}
            onChange={e => setKey(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 1.5 }}>
          <TextField
            label="مقدار"
            value={value}
            onChange={e => setValue(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 1.5 }}>
          <TextField
            label="شماره دستور"
            type="number"
            value={orderNo ?? ''}
            onChange={e => {
              const val = e.target.value;
              setOrderNo(val === '' ? null : Number(val));
            }}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 1.5 }}>
          <Autocomplete
            options={['فعال', 'غیرفعال']}
            value={check ? 'فعال' : 'غیرفعال'}
            onChange={(_, newValue) => setCheck(newValue === 'فعال')}
            renderInput={params => (
              <TextField {...params} label="وضعیت" fullWidth />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
          <TextField
            label="توضیحات"
            value={description}
            onChange={e => setDescription(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <Autocomplete
            options={options}
            getOptionLabel={opt => opt.value}
            value={selectedValue}
            onChange={(_event, newValue) => {
              if (newValue) {
                setSelectedValue(newValue);
              } else {
                setSelectedValue(null);
              }
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={params => (
              <TextField {...params} label=" والد " fullWidth />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 1.5 }} textAlign="right">
          <Button
            variant="contained"
            color="success"
            fullWidth
            onClick={onSubmit}
            sx={{ minWidth: 100 }}
          >
            ذخیره
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
