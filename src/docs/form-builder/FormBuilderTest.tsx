import { useEffect, useState, useMemo } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import type { FieldConfig } from '@/components/form/types.ts';
import FormBuilder from '@/components/form/FormBuilder.tsx';

const MOCK_USERS = [
  {
    id: 1,
    firstName: 'علی',
    lastName: 'احمدی',
    email: 'ali@example.com',
    birthDate: '1991-08-06',
    hireDate: '2024-01-15',
    departmentId: 2,
    roleIds: [1, 3],
    mainRoleId: 1,
    isActive: true,
  },
  {
    id: 2,
    firstName: 'مریم',
    lastName: 'رضایی',
    email: 'maryam@example.com',
    birthDate: '1995-03-20',
    hireDate: '2024-05-10',
    departmentId: 1,
    roleIds: [2],
    mainRoleId: 2,
    isActive: true,
  },
];

const MOCK_DEPARTMENTS = [
  { value: 1, label: 'فناوری اطلاعات' },
  { value: 2, label: 'منابع انسانی' },
  { value: 3, label: 'مالی' },
  { value: 4, label: 'بازاریابی' },
];

const MOCK_ROLES = [
  { value: 1, label: 'مدیر' },
  { value: 2, label: 'کارمند' },
  { value: 3, label: 'توسعه‌دهنده' },
  { value: 4, label: 'طراح' },
];

export default function EditUser() {
  const id = 1;

  const [formValues, setFormValues] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        console.log('🔄 در حال دریافت اطلاعات کاربر...');

        await new Promise(resolve => setTimeout(resolve, 1500));

        const user = MOCK_USERS.find(u => u.id === Number(id));
        if (!user) throw new Error('کاربر پیدا نشد');

        console.log('✅ اطلاعات کاربر دریافت شد:', user);

        setFormValues({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          birthDate: user.birthDate,
          hireDate: user.hireDate,
          departmentId: user.departmentId,
          roleIds: user.roleIds,
          mainRoleId: user.mainRoleId,
          isActive: user.isActive,
        });

        setLoading(false);
      } catch (err: any) {
        console.error('❌ خطا در دریافت اطلاعات:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const fields: FieldConfig[] = useMemo<FieldConfig[]>(
    () => [
      { type: 'titleDivider', name: 'personal-info', label: 'اطلاعات شخصی' },
      {
        type: 'text',
        name: 'firstName',
        label: 'نام',
        size: { xs: 12, md: 6 },
        placeholder: 'نام خود را وارد کنید',
        validation: { required: 'نام الزامی است' },
      },
      {
        type: 'text',
        name: 'lastName',
        label: 'نام خانوادگی',
        size: { xs: 12, md: 6 },
        placeholder: 'نام خانوادگی خود را وارد کنید',
        validation: { required: 'نام خانوادگی الزامی است' },
      },
      {
        type: 'text',
        name: 'email',
        label: 'ایمیل',
        size: { xs: 12, md: 6 },
        placeholder: 'example@email.com',
        validation: { required: 'ایمیل الزامی است' },
      },
      {
        type: 'date',
        name: 'birthDate',
        label: 'تاریخ تولد',
        size: { xs: 12, md: 6 },
        validation: { required: 'تاریخ تولد الزامی است' },
      },
      { type: 'titleDivider', name: 'work-info', label: 'اطلاعات شغلی' },
      {
        type: 'date',
        name: 'hireDate',
        label: 'تاریخ استخدام',
        size: { xs: 12, md: 6 },
      },
      {
        type: 'autocomplete',
        name: 'departmentId',
        label: 'دپارتمان',
        size: { xs: 12, md: 6 },
        fetchOptions: async () => {
          console.log('🔄 در حال دریافت لیست دپارتمان‌ها...');
          await new Promise(resolve => setTimeout(resolve, 800));
          console.log('✅ لیست دپارتمان‌ها دریافت شد');
          return MOCK_DEPARTMENTS;
        },
        validation: { required: 'دپارتمان الزامی است' },
      },
      {
        type: 'autocomplete',
        name: 'roleIds',
        label: 'نقش‌ها',
        size: { xs: 12 },
        multiple: true,
        fetchOptions: async () => {
          await new Promise(resolve => setTimeout(resolve, 600));
          return MOCK_ROLES;
        },
        onChange: v => console.log('RoleIds changed:', v),
      },
      {
        type: 'autocomplete',
        name: 'mainRoleId',
        label: 'نقش اصلی',
        size: { xs: 12 },
        options: MOCK_ROLES,
        onChange: v => console.log('MainRoleId changed:', v),
      },
      { type: 'checkbox', name: 'isActive', label: 'فعال', size: { xs: 12 } },
    ],
    [MOCK_DEPARTMENTS, MOCK_ROLES]
  );

  const handleSubmit = async (data: any) => {
    try {
      setSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('📋 اطلاعات نهایی:', {
        ...data,
        id: Number(id),
        updatedAt: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error('❌ خطا در بروزرسانی:', err);
      alert('❌ خطا در بروزرسانی کاربر');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
          gap: 2,
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="body1" color="text.secondary">
          در حال بارگذاری اطلاعات کاربر...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Typography variant="body2" color="text.secondary">
          لطفاً دوباره تلاش کنید یا با پشتیبانی تماس بگیرید.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 1 }}>
        ویرایش کاربر
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        شناسه کاربر: {id}
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>توجه:</strong> تاریخ‌ها به صورت جلالی نمایش داده می‌شوند اما
          به صورت میلادی ذخیره می‌شوند.
        </Typography>
      </Alert>

      <FormBuilder
        fields={fields}
        value={formValues}
        onChange={setFormValues}
        onSubmit={handleSubmit}
        submitButtonText="بروزرسانی کاربر"
        resetButtonText="بازگشت به حالت اولیه"
        showResetButton={true}
        loading={submitting}
      />

      <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
          مقادیر فعلی فرم:
        </Typography>
        <pre style={{ fontSize: '12px', overflow: 'auto' }}>
          {JSON.stringify(formValues, null, 2)}
        </pre>
      </Box>
    </Box>
  );
}