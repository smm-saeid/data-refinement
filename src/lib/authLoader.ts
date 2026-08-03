import { redirect } from 'react-router';

/**
 * ✅ بررسی وجود token در localStorage
 * اگر token وجود نداشت، به صفحه لاگین هدایت می‌شود
 */
export const authLoader = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    console.log('🔒 No token found, redirecting to /login');
    return redirect('/login');
  }

  return null;
};