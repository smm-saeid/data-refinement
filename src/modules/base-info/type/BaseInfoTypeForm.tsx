import React from 'react';
import {
  Grid,
  TextField,
  Button,
  Autocomplete,
  Typography,
  Box,
} from '@mui/material';

type BaseInfoTypeForm = {
  title: string;
  className: string;
  description: string;
  check: boolean;
  options: { id: number; title: string }[];
  selectedCommonBaseType: { id: number; title: string } | null;
  setTitle: (v: string) => void;
  setClassName: (v: string) => void;
  setDescription: (v: string) => void;
  setCheck: (v: boolean) => void;
  onSubmit: () => void;
  onReset?: () => void;
  setSelectedCommonBaseType: (
    val: { id: number; title: string } | null
  ) => void;
};

export function BaseInfoTypeForm({
  title,
  className,
  description,
  check,
  selectedCommonBaseType,
  options,
  setTitle,
  setClassName,
  setDescription,
  setCheck,
  onSubmit,
  setSelectedCommonBaseType,
}: BaseInfoTypeForm) {
  return (
    <Box mb={4}>
      <Grid container spacing={2} alignItems="center" flexWrap="wrap">
        <Grid size={{ xs: 12 }}>
          <Typography fontWeight={700} variant="h5">
            فرم اطلاعات پایه
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <TextField
            label="عنوان"
            value={title}
            onChange={e => setTitle(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <TextField
            label="نام کلاس"
            value={className}
            onChange={e => setClassName(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <Autocomplete
            options={['فعال', 'غیرفعال']}
            value={check ? 'فعال' : 'غیرفعال'}
            onChange={(_, newValue) => setCheck(newValue === 'فعال')}
            renderInput={params => (
              <TextField {...params} label="وضعیت" fullWidth />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
            getOptionLabel={opt => opt.title}
            value={selectedCommonBaseType}
            onChange={(_event, newValue) => {
              if (newValue) {
                setSelectedCommonBaseType(newValue);
              } else {
                setSelectedCommonBaseType(null);
              }
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={params => (
              <TextField {...params} label=" والد " fullWidth />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 1 }} textAlign="right">
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
