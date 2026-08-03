import { Outlet } from 'react-router';

export default function SimpleLayout() {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Outlet />
    </div>
  );
}
