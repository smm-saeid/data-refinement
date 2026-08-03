# راهنمای استفاده از Grid، Box و Paper در Material-UI v7

> **نکته مهم:** در MUI v7.3.4، سینتکس Grid تغییر کرده است و به جای `xs`, `sm`, `md` به صورت جداگانه، از prop واحد `size` استفاده می‌شود.

---

## 📦 Box

### کاربرد
`Box` یک کامپوننت wrapper همه‌کاره است که برای استایل‌دهی سریع و ایجاد layout های ساده استفاده می‌شود.

### چه زمانی استفاده کنیم؟
- ✅ برای wrapper کردن کامپوننت‌ها
- ✅ اعمال spacing (padding, margin)
- ✅ ایجاد container های ساده
- ✅ استایل‌دهی سریع با sx prop
- ✅ Flexbox یا Grid ساده

### مثال‌ها

```tsx
// Container ساده
<Box sx={{ p: 2, bgcolor: 'background.paper' }}>
  محتوای من
</Box>

// Flexbox ساده
<Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
  <Button>دکمه ۱</Button>
  <Button>دکمه ۲</Button>
</Box>

// Centered content
<Box sx={{ 
  display: 'flex', 
  justifyContent: 'center', 
  alignItems: 'center',
  minHeight: '100vh' 
}}>
  <Typography>متن وسط صفحه</Typography>
</Box>

// با padding و margin
<Box sx={{ mt: 3, mb: 2, px: 4 }}>
  محتوا
</Box>

// Layout ستونی
<Box sx={{ 
  display: 'flex', 
  flexDirection: 'column', 
  gap: 2 
}}>
  <Card>کارت ۱</Card>
  <Card>کارت ۲</Card>
  <Card>کارت ۳</Card>
</Box>
```

---

## 🎨 Paper

### کاربرد
`Paper` برای ایجاد سطوح مختلف با سایه (elevation) و پس‌زمینه استفاده می‌شود. مفهوم Material Design را پیاده‌سازی می‌کند.

### چه زمانی استفاده کنیم؟
- ✅ کارت‌ها (Cards)
- ✅ پنل‌ها و بخش‌های مجزا
- ✅ فرم‌ها
- ✅ جاهایی که نیاز به elevation (سایه) دارید
- ✅ محتوایی که باید از بقیه صفحه متمایز شود

### مثال‌ها

```tsx
// کارت ساده
<Paper elevation={3} sx={{ p: 3 }}>
  <Typography variant="h6">عنوان کارت</Typography>
  <Typography>محتوای کارت</Typography>
</Paper>

// فرم با Paper
<Paper elevation={2} sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
  <Typography variant="h5" gutterBottom>
    فرم ثبت‌نام
  </Typography>
  <TextField fullWidth label="نام" sx={{ mb: 2 }} />
  <TextField fullWidth label="ایمیل" sx={{ mb: 2 }} />
  <Button variant="contained">ثبت</Button>
</Paper>

// داشبورد با چند Paper
<Box sx={{ display: 'flex', gap: 2 }}>
  <Paper sx={{ p: 2, flex: 1 }}>
    آمار ۱
  </Paper>
  <Paper sx={{ p: 2, flex: 1 }}>
    آمار ۲
  </Paper>
  <Paper sx={{ p: 2, flex: 1 }}>
    آمار ۳
  </Paper>
</Box>

// بدون سایه (flat)
<Paper variant="outlined" sx={{ p: 2 }}>
  محتوا بدون سایه
</Paper>

// سطوح مختلف elevation
<Paper elevation={0} sx={{ p: 2, mb: 2 }}>بدون سایه</Paper>
<Paper elevation={1} sx={{ p: 2, mb: 2 }}>سایه خیلی کم</Paper>
<Paper elevation={3} sx={{ p: 2, mb: 2 }}>سایه متوسط</Paper>
<Paper elevation={8} sx={{ p: 2, mb: 2 }}>سایه زیاد</Paper>
```

---

## 📐 Grid (MUI v7 - سینتکس جدید)

### ⚠️ تغییرات مهم در v7

```tsx
// ❌ سینتکس قدیمی (v6 و قبل‌تر)
<Grid item xs={12} sm={6} md={4}>

// ✅ سینتکس جدید (v7)
<Grid size={{ xs: 12, sm: 6, md: 4 }}>
```

### کاربرد
`Grid` برای ایجاد layout های responsive و پیچیده با سیستم 12 ستونی استفاده می‌شود.

### چه زمانی استفاده کنیم؟
- ✅ Layout های responsive
- ✅ چیدمان چند ستونی
- ✅ گالری تصاویر
- ✅ لیست کارت‌ها
- ✅ فرم‌های پیچیده با چند فیلد
- ✅ جاهایی که breakpoint های مختلف نیاز دارید

### مثال‌های v7

```tsx
// Grid ساده دو ستونی
<Grid container spacing={2}>
  <Grid size={{ xs: 12, md: 6 }}>
    <Paper sx={{ p: 2 }}>ستون چپ</Paper>
  </Grid>
  <Grid size={{ xs: 12, md: 6 }}>
    <Paper sx={{ p: 2 }}>ستون راست</Paper>
  </Grid>
</Grid>

// گالری کارت‌ها (responsive)
<Grid container spacing={3}>
  {items.map((item) => (
    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={item.id}>
      <Paper sx={{ p: 2 }}>
        <Typography>{item.title}</Typography>
      </Paper>
    </Grid>
  ))}
</Grid>

// فرم با Grid
<Grid container spacing={2}>
  <Grid size={{ xs: 12, sm: 6 }}>
    <TextField fullWidth label="نام" />
  </Grid>
  <Grid size={{ xs: 12, sm: 6 }}>
    <TextField fullWidth label="نام خانوادگی" />
  </Grid>
  <Grid size={{ xs: 12 }}>
    <TextField fullWidth label="آدرس" />
  </Grid>
  <Grid size={{ xs: 12, sm: 4 }}>
    <TextField fullWidth label="شهر" />
  </Grid>
  <Grid size={{ xs: 12, sm: 4 }}>
    <TextField fullWidth label="استان" />
  </Grid>
  <Grid size={{ xs: 12, sm: 4 }}>
    <TextField fullWidth label="کد پستی" />
  </Grid>
</Grid>

// Layout پیچیده (sidebar + content)
<Grid container spacing={2}>
  <Grid size={{ xs: 12, md: 3 }}>
    <Paper sx={{ p: 2, height: '100%' }}>
      سایدبار
    </Paper>
  </Grid>
  <Grid size={{ xs: 12, md: 9 }}>
    <Paper sx={{ p: 2 }}>
      محتوای اصلی
    </Paper>
  </Grid>
</Grid>

// استفاده از size ساده (برای همه breakpoint ها یکسان)
<Grid container spacing={2}>
  <Grid size={6}>  {/* 6 ستون در همه اندازه‌ها */}
    <Paper sx={{ p: 2 }}>کارت ۱</Paper>
  </Grid>
  <Grid size={6}>
    <Paper sx={{ p: 2 }}>کارت ۲</Paper>
  </Grid>
</Grid>

// استفاده از "grow" برای فضای باقیمانده
<Grid container spacing={2}>
  <Grid size={{ xs: 12, md: 3 }}>
    <Paper sx={{ p: 2 }}>سایدبار ثابت</Paper>
  </Grid>
  <Grid size="grow">  {/* بقیه فضا را پر می‌کند */}
    <Paper sx={{ p: 2 }}>محتوای اصلی</Paper>
  </Grid>
</Grid>

// استفاده از "auto" برای اندازه خودکار
<Grid container spacing={2}>
  <Grid size="auto">
    <Button>دکمه کوچک</Button>
  </Grid>
  <Grid size="grow">
    <TextField fullWidth />
  </Grid>
  <Grid size="auto">
    <Button>ارسال</Button>
  </Grid>
</Grid>
```

---

## 🔄 مقایسه سینتکس قدیم و جدید

```tsx
// ❌ MUI v6 و قبل‌تر
<Grid container spacing={2}>
  <Grid item xs={12} sm={6} md={4} lg={3}>
    <Card />
  </Grid>
</Grid>

// ✅ MUI v7
<Grid container spacing={2}>
  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
    <Card />
  </Grid>
</Grid>

// ✅ اگر همه breakpoint ها یکسان باشند
<Grid container spacing={2}>
  <Grid size={6}>
    <Card />
  </Grid>
</Grid>
```

---

## 🎯 الگوهای رایج با سینتکس جدید

### داشبورد کامل

```tsx
<Box sx={{ p: 3 }}>
  {/* آمار بالای صفحه */}
  <Grid container spacing={3} sx={{ mb: 3 }}>
    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">۱,۲۳۴</Typography>
        <Typography color="text.secondary">کاربران</Typography>
      </Paper>
    </Grid>
    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">۵,۶۷۸</Typography>
        <Typography color="text.secondary">فروش</Typography>
      </Paper>
    </Grid>
    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">۸۹۰</Typography>
        <Typography color="text.secondary">سفارشات</Typography>
      </Paper>
    </Grid>
    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">۱۲M</Typography>
        <Typography color="text.secondary">درآمد</Typography>
      </Paper>
    </Grid>
  </Grid>

  {/* محتوای اصلی */}
  <Grid container spacing={3}>
    <Grid size={{ xs: 12, md: 8 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          نمودار فروش
        </Typography>
        {/* نمودار */}
      </Paper>
    </Grid>
    
    <Grid size={{ xs: 12, md: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          فعالیت‌های اخیر
        </Typography>
        {/* لیست */}
      </Paper>
    </Grid>
  </Grid>
</Box>
```

### صفحه محصولات

```tsx
<Box sx={{ p: 3 }}>
  <Grid container spacing={3}>
    {/* فیلترها */}
    <Grid size={{ xs: 12, md: 3 }}>
      <Paper sx={{ p: 2, position: 'sticky', top: 16 }}>
        <Typography variant="h6" gutterBottom>
          فیلترها
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="جستجو" size="small" fullWidth />
          <FormControl fullWidth size="small">
            <InputLabel>دسته‌بندی</InputLabel>
            <Select label="دسته‌بندی">
              <MenuItem value={1}>الکترونیک</MenuItem>
              <MenuItem value={2}>پوشاک</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>
    </Grid>
    
    {/* لیست محصولات */}
    <Grid size={{ xs: 12, md: 9 }}>
      <Grid container spacing={2}>
        {products.map(product => (
          <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={product.id}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Box sx={{ 
                aspectRatio: '16/9', 
                bgcolor: 'grey.200', 
                mb: 2,
                borderRadius: 1 
              }} />
              <Typography variant="h6" gutterBottom>
                {product.name}
              </Typography>
              <Typography variant="h5" color="primary">
                {product.price} تومان
              </Typography>
              <Button variant="contained" fullWidth sx={{ mt: 2 }}>
                افزودن به سبد
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Grid>
  </Grid>
</Box>
```

### فرم پیشرفته

```tsx
<Paper sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
  <Typography variant="h5" gutterBottom>
    اطلاعات کاربر
  </Typography>
  
  <Grid container spacing={3}>
    {/* اطلاعات شخصی */}
    <Grid size={{ xs: 12 }}>
      <Typography variant="h6" color="primary" gutterBottom>
        اطلاعات شخصی
      </Typography>
    </Grid>
    
    <Grid size={{ xs: 12, sm: 6 }}>
      <TextField fullWidth label="نام" required />
    </Grid>
    
    <Grid size={{ xs: 12, sm: 6 }}>
      <TextField fullWidth label="نام خانوادگی" required />
    </Grid>
    
    <Grid size={{ xs: 12, sm: 6 }}>
      <TextField fullWidth label="کد ملی" />
    </Grid>
    
    <Grid size={{ xs: 12, sm: 6 }}>
      <TextField fullWidth label="تاریخ تولد" type="date" 
        InputLabelProps={{ shrink: true }} />
    </Grid>

    {/* اطلاعات تماس */}
    <Grid size={{ xs: 12 }}>
      <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
        اطلاعات تماس
      </Typography>
    </Grid>
    
    <Grid size={{ xs: 12, sm: 6 }}>
      <TextField fullWidth label="موبایل" required />
    </Grid>
    
    <Grid size={{ xs: 12, sm: 6 }}>
      <TextField fullWidth label="ایمیل" type="email" />
    </Grid>
    
    <Grid size={{ xs: 12 }}>
      <TextField fullWidth label="آدرس" multiline rows={3} />
    </Grid>
    
    <Grid size={{ xs: 12, sm: 4 }}>
      <TextField fullWidth label="شهر" />
    </Grid>
    
    <Grid size={{ xs: 12, sm: 4 }}>
      <TextField fullWidth label="استان" />
    </Grid>
    
    <Grid size={{ xs: 12, sm: 4 }}>
      <TextField fullWidth label="کد پستی" />
    </Grid>

    {/* دکمه‌ها */}
    <Grid size={{ xs: 12 }}>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
        <Button variant="outlined">انصراف</Button>
        <Button variant="contained">ذخیره</Button>
      </Box>
    </Grid>
  </Grid>
</Paper>
```

---

## 📋 جدول تصمیم‌گیری سریع

| نیاز | استفاده کن | مثال |
|------|------------|------|
| wrapper ساده | `Box` | `<Box sx={{ p: 2 }}>` |
| استایل سریع | `Box` | `<Box sx={{ display: 'flex' }}>` |
| Flexbox ساده | `Box` | `<Box sx={{ gap: 2 }}>` |
| کارت یا پنل | `Paper` | `<Paper elevation={2}>` |
| سایه (elevation) | `Paper` | `<Paper elevation={8}>` |
| بخش متمایز | `Paper` | `<Paper variant="outlined">` |
| Layout responsive | `Grid` | `<Grid size={{ xs: 12, md: 6 }}>` |
| چند ستونی | `Grid` | `<Grid container spacing={2}>` |
| Breakpoint ها | `Grid` | `<Grid size={{ xs: 12, sm: 6, md: 4 }}>` |

---

## 💡 نکات مهم Grid v7

### Breakpoints
```tsx
// xs: 0px+     (موبایل)
// sm: 600px+   (تبلت عمودی)
// md: 900px+   (تبلت افقی)
// lg: 1200px+  (دسکتاپ)
// xl: 1536px+  (دسکتاپ بزرگ)

<Grid size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}>
  {/* 
    موبایل: تمام عرض (12/12)
    تبلت عمودی: نصف (6/12)
    تبلت افقی: یک سوم (4/12)
    دسکتاپ: یک چهارم (3/12)
    دسکتاپ بزرگ: یک ششم (2/12)
  */}
</Grid>
```

### مقادیر ویژه size

```tsx
// عدد ثابت (برای همه breakpoint ها)
<Grid size={6}>نصف عرض</Grid>

// Object برای responsive
<Grid size={{ xs: 12, md: 6 }}>Responsive</Grid>

// "grow" - فضای باقیمانده را پر می‌کند
<Grid size="grow">فضای باقیمانده</Grid>

// "auto" - به اندازه محتوا
<Grid size="auto">به اندازه محتوا</Grid>
```

### ترکیب grow و auto

```tsx
<Grid container spacing={2}>
  <Grid size="auto">
    <Avatar />
  </Grid>
  <Grid size="grow">
    <Typography>نام کاربر</Typography>
    <Typography variant="caption">توضیحات</Typography>
  </Grid>
  <Grid size="auto">
    <IconButton>
      <MoreVertIcon />
    </IconButton>
  </Grid>
</Grid>
```

---

## ✅ بهترین روش‌ها (Best Practices)

```tsx
// ❌ اشتباه - استفاده بیش از حد از Grid
<Grid container>
  <Grid size={12}>
    <Box>محتوا</Box>
  </Grid>
</Grid>

// ✅ درست - استفاده از Box برای موارد ساده
<Box sx={{ p: 2 }}>
  محتوا
</Box>

// ❌ اشتباه - Paper بدون padding
<Paper>
  <Typography>متن چسبیده به لبه</Typography>
</Paper>

// ✅ درست - Paper با padding
<Paper sx={{ p: 2 }}>
  <Typography>متن با فاصله مناسب</Typography>
</Paper>

// ❌ اشتباه - Grid برای مرکز کردن یک عنصر
<Grid container justifyContent="center">
  <Grid size="auto">
    <Button>دکمه</Button>
  </Grid>
</Grid>

// ✅ درست - Box برای مرکز کردن ساده
<Box sx={{ display: 'flex', justifyContent: 'center' }}>
  <Button>دکمه</Button>
</Box>

// ❌ اشتباه - سینتکس قدیمی
<Grid item xs={12} sm={6}>

// ✅ درست - سینتکس جدید v7
<Grid size={{ xs: 12, sm: 6 }}>
```

---

## 🚀 خلاصه و نتیجه‌گیری

### Box
- Container همه‌کاره
- استایل‌دهی سریع
- Flexbox و spacing

### Paper
- کارت و پنل
- Elevation و سایه
- جدا کردن محتوا

### Grid (v7)
- Layout responsive
- سیستم 12 ستونی
- **سینتکس جدید:** `size={{ xs: 12, md: 6 }}`

### ترکیب معمول

```tsx
<Grid container spacing={3}>      {/* Layout */}
  <Grid size={{ xs: 12, md: 6 }}>
    <Paper elevation={2}>          {/* ظاهر */}
      <Box sx={{ p: 3 }}>          {/* Spacing */}
        محتوا
      </Box>
    </Paper>
  </Grid>
</Grid>
```