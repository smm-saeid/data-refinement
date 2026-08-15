const module = 'http://localhost:3001/messages';

const messageApi = {
  message: {
    // دریافت لیست پیام‌ها
    list: module,

    // دریافت یک پیام
    getById: (id: number) => `${module}/${id}`,

    // ارسال پیام
    create: module,

    // حذف پیام
    delete: (id: number) => `${module}/${id}`,
  },
};

export default messageApi;