import { Controller, useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useLegacyApi } from 'hooks/useLegacyApi.ts';
import { useSnackbar } from 'hooks/useSnackbar.ts';
import CartableApis from 'modules/cartable/apis.ts';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import BackButton from 'components/button/BackButton.tsx';
import React from 'react';
import { useNavigate } from 'react-router';

export default function CreateNoticePage() {
  const legacyApi = useLegacyApi();
  const snackbar = useSnackbar();
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      notificationText: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: legacyApi.request,
  });

  const onSubmit = data => {
    const params = {
      title: data.title,
      notificationText: data.notificationText,
      entityName: null,
      documentId: null,
      previousCartableId: null,
    };
    mutate(
      {
        entity: CartableApis.createNotice,
        method: 'post',
        data: params,
      } as any,
      {
        onSuccess: () => {
          snackbar('عملیات با موفقیت انجام شد', 'success', 5000);
          navigate('/');
        },
        onError: () => snackbar('خطا در انجام عملیات', 'error', 5000),
      }
    );
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid container size={{ xs: 12 }} justifyContent="space-between">
          <Typography
            variant="h6"
            gutterBottom
            sx={{ mt: 2, fontWeight: 'bold' }}
          >
            ایجاد ابلاغیه
          </Typography>
          <BackButton />
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <Controller
            name="title"
            control={control}
            rules={{ required: 'عنوان ابلاغیه اجباری است.' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="عنوان ابلاغیه"
                fullWidth
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            )}
          />
        </Grid>
        <br />
        <Grid size={{ xs: 12, lg: 6 }}>
          <Controller
            name="notificationText"
            control={control}
            rules={{ required: 'متن ابلاغیه اجباری است.' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="متن ابلاغیه"
                fullWidth
                multiline
                rows={4}
                error={!!errors.notificationText}
                helperText={errors.notificationText?.message}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Button type="submit" variant="contained">
            ثبت و ارسال به کارتابل
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
