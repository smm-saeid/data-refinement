// Enhanced NotificationContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { Alert, Snackbar, type AlertColor } from '@mui/material';

interface Notification {
  id: string;
  message: string;
  severity: AlertColor;
  open: boolean;
  autoHideDuration?: number;
}

interface NotificationContextType {
  showNotification: (
    message: string,
    severity?: AlertColor,
    autoHideDuration?: number
  ) => void;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = (
    message: string,
    severity: AlertColor = 'success',
    autoHideDuration: number = 6000
  ) => {
    const id = Date.now().toString();
    const newNotification: Notification = {
      id,
      message,
      severity,
      open: true,
      autoHideDuration,
    };

    setNotifications(prev => [...prev, newNotification]);
  };

  const showError = (message: string) =>
    showNotification(message, 'error', 8000);
  const showSuccess = (message: string) =>
    showNotification(message, 'success', 4000);
  const showWarning = (message: string) =>
    showNotification(message, 'warning', 6000);
  const showInfo = (message: string) => showNotification(message, 'info', 5000);

  const handleClose = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, open: false } : notification
      )
    );

    
    setTimeout(() => {
      setNotifications(prev =>
        prev.filter(notification => notification.id !== id)
      );
    }, 300);
  };

  return (
    <NotificationContext.Provider
      value={{
        showNotification,
        showError,
        showSuccess,
        showWarning,
        showInfo,
      }}
    >
      {children}
      {notifications.map(notification => (
        <Snackbar
          key={notification.id}
          open={notification.open}
          autoHideDuration={notification.autoHideDuration}
          onClose={() => handleClose(notification.id)}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        >
          <Alert
            onClose={() => handleClose(notification.id)}
            severity={notification.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </NotificationContext.Provider>
  );
}

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    );
  }
  return context;
};
