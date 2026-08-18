// ==================================================
// Company
// ==================================================

export type UserCompany = {
  name?: string;
  department?: string;
  title?: string;

  address?: {
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
};

// ==================================================
// User
// ==================================================

export type User = {
  id: number;

  firstName: string;
  lastName: string;
  username: string;

  // اطلاعات کاربر
  password?: string;
  personnelCode?: string;

  // زمان فعالیت
  startDate?: string;
  endDate?: string;

  // اطلاعات کاری
  workShift?: string;
  organization?: string;

  age?: number;
  gender?: string;
  phone?: string;
  email?: string;

  birthDate?: string;
  image?: string;

  company?: UserCompany;

  // Frontend
  fullName?: string;
  department?: string;
  isLocked?: boolean;
};

// ==================================================
// User Form
// ==================================================

export type UserForm = {
  firstName: string;
  lastName: string;

  username: string;

  password: string;
  confirmPassword: string;

  personnelCode: string;

  // زمان فعالیت
  startDate: string;
  endDate: string;

  // اطلاعات کاری
  workShift: string;
  organization: string;
};

// ==================================================
// Users API Response
// ==================================================

export type UsersResponse = {
  users: User[];
  total: number;
  skip: number;
  limit: number;
};