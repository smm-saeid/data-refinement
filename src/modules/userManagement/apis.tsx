const module = 'https://dummyjson.com/users';

const usermanagementApi = {
  user: {
    // دریافت لیست کاربران
    list: `${module}`,

    // جستجوی کاربران
    search: (query: string) =>
      `${module}/search?q=${encodeURIComponent(query)}`,

    // دریافت یک کاربر
    getById: (id: number) =>
      `${module}/${id}`,

    // ایجاد کاربر
    create: `${module}/add`,

    // ویرایش کاربر
    update: (id: number) =>
      `${module}/${id}`,

    // حذف کاربر
    delete: (id: number) =>
      `${module}/${id}`,
  },
};

export default usermanagementApi;