import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import { ChevronLeft, ChevronRight, CheckCircle } from '@mui/icons-material';
import researchApis from '../apis';

interface Message {
  id: string;
  messageNumber: string;
  messageText: string;
  unitName: string;
  priority: 'high' | 'medium' | 'low';
  isRead?: boolean;
}

interface MessageViewerProps {
  onMessagesLoaded: (messages: Message[]) => void;
}

const MessageViewer = ({ onMessagesLoaded }: MessageViewerProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [usingDefaultData, setUsingDefaultData] = useState<boolean>(false);
  const [markingRead, setMarkingRead] = useState<boolean>(false);

  const DEFAULT_MESSAGES: Message[] = [
    {
      id: '1',
      messageNumber: 'MSG-001',
      messageText:
        'گزارش مالی سه‌ماهه اول سال نشان‌دهنده رشد ۱۵ درصدی درآمدها نسبت به دوره مشابه سال گذشته است.',
      unitName: 'واحد مالی',
      priority: 'high',
      isRead: false,
    },
    {
      id: '2',
      messageNumber: 'MSG-002',
      messageText:
        ' برگزاری جلسه فوری مدیریت در تاریخ ۱۴۰۳/۰۷/۲۰ راس ساعت ۱۰:۰۰ در سالن کنفرانس اصبرگزاری جلسه فوری مدیریت در تاریخ ۱۴۰۳/۰۷/۲۰ راس ساعت ۱۰:۰۰ در سالن کنفرانس اصبرگزاری جلسه فوری مدیریت در تاریخ ۱۴۰۳/۰۷/۲۰ راس ساعت ۱۰:۰۰ در سالن کنفرانس اصبرگزاری جلسه فوری مدیریت در تاریخ ۱۴۰۳/۰۷/۲۰ راس ساعت ۱۰:۰۰ در سالن کنفرانس اصبرگزاری جلسه فوری مدیریت در تاریخ ۱۴۰۳/۰۷/۲۰ راس ساعت ۱۰:۰۰ در سالن کنفرانس اصبرگزاری جلسه فوری مدیریت در تاریخ ۱۴۰۳/۰۷/۲۰ راس ساعت ۱۰:۰۰ در سالن کنفرانس اصبرگزاری جلسه فوری مدیریت در تاریخ ۱۴۰۳/۰۷/۲۰ راس ساعت ۱۰:۰۰ در سالن کنفرانس اصبرگزاری جلسه فوری مدیریت در تاریخ ۱۴۰۳/۰۷/۲۰ راس ساعت ۱۰:۰۰ در سالن کنفرانس اصبرگزاری جلسه فوری مدیریت در تاریخ ۱۴۰۳/۰۷/۲۰ راس ساعت ۱۰:۰۰ در سالن کنفرانس اصبرگزاری جلسه فوری مدیریت در تاریخ ۱۴۰۳/۰۷/۲۰ راس ساعت ۱۰:۰۰ در سالن کنفرانس اصبرگزاری جلسه فوری مدیریت در تاریخ ۱۴۰۳/۰۷/۲۰ راس ساعت ۱۰:۰۰ در سالن کنفرانس اصلی',
      unitName: 'دفتر مدیریت',
      priority: 'high',
      isRead: false,
    },
    {
      id: '3',
      messageNumber: 'MSG-003',
      messageText:
        'بروزرسانی سامانه اتوماسیون اداری در تاریخ ۱۴۰۳/۰۷/۲۲ از ساعت ۲۰:۰۰ به مدت ۲ ساعت',
      unitName: 'واحد فناوری اطلاعات',
      priority: 'medium',
      isRead: false,
    },
  ];

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch('/api/' + researchApis.messages.list, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'getMessages' }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.messages && data.messages.length > 0) {
          const messagesWithReadStatus = data.messages.map((msg: Message) => ({
            ...msg,
            isRead: msg.isRead || false,
          }));
          setMessages(messagesWithReadStatus);
          setUsingDefaultData(false);
          onMessagesLoaded(messagesWithReadStatus);
        } else {
          setMessages(DEFAULT_MESSAGES);
          setUsingDefaultData(true);
          onMessagesLoaded(DEFAULT_MESSAGES);
        }
      } else {
        throw new Error('Failed to fetch messages');
      }
    } catch (err) {
      console.warn('API failed, using default data:', err);
      setMessages(DEFAULT_MESSAGES);
      setUsingDefaultData(true);
      setError('');
      onMessagesLoaded(DEFAULT_MESSAGES);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: string): Promise<void> => {
    try {
      setMarkingRead(true);
      const apiUrl = researchApis.messages.markAsRead.replace(
        '{id}',
        messageId
      );
      const response = await fetch('/api/' + apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'markAsRead' }),
      });

      if (response.ok) {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === messageId ? { ...msg, isRead: true } : msg
          )
        );
      } else {
        throw new Error('Failed to mark as read');
      }
    } catch (err) {
      console.error('Error marking message as read:', err);
      setMessages(prev =>
        prev.map(msg => (msg.id === messageId ? { ...msg, isRead: true } : msg))
      );
    } finally {
      setMarkingRead(false);
    }
  };

  const nextMessage = (): void => {
    setCurrentIndex(prev => (prev < messages.length - 1 ? prev + 1 : 0));
  };

  const prevMessage = (): void => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : messages.length - 1));
  };

  const getPriorityColor = (
    priority: string
  ): 'error' | 'warning' | 'success' | 'default' => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getPriorityText = (priority: string): string => {
    switch (priority) {
      case 'high':
        return 'فوری';
      case 'medium':
        return 'مهم';
      case 'low':
        return 'عادی';
      default:
        return priority;
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={300}
      >
        <CircularProgress />
        <Typography variant="body2" sx={{ mr: 2 }}>
          در حال دریافت پیام‌ها...
        </Typography>
      </Box>
    );
  }

  const currentMessage = messages[currentIndex];

  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 2, sm: 3 },
        mb: 1,
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
        alignItems: 'stretch',
        maxHeight: { xs: 'auto', sm: '45vh' },
        bgcolor: 'lightsteelblue',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
          flexWrap="wrap"
          gap={1}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
          >
            پیام‌ها و اطلاعیه‌های یگان های تابع
          </Typography>
          {usingDefaultData && (
            <Chip
              label="داده‌های پیش‌فرض"
              color="warning"
              size="small"
              variant="outlined"
            />
          )}
        </Box>

        {error && (
          <Alert severity="warning" sx={{ mb: 1 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {messages.length === 0 ? (
          <Box textAlign="center" py={2}>
            <Typography color="text.secondary">
              هیچ پیامی برای نمایش وجود ندارد.
            </Typography>
            <Button variant="outlined" onClick={fetchMessages} sx={{ mt: 1 }}>
              تلاش مجدد
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={1}
              gap={1}
            >
              <IconButton
                onClick={prevMessage}
                size="large"
                sx={{ order: { xs: 3, sm: 1 } }}
              >
                <ChevronRight />
              </IconButton>

              <Box
                textAlign="center"
                flex={1}
                px={1}
                sx={{ order: { xs: 1, sm: 2 } }}
              >
                <Typography variant="caption" color="text.secondary">
                  {currentIndex + 1} از {messages.length}
                </Typography>
              </Box>

              <IconButton
                onClick={nextMessage}
                size="large"
                sx={{ order: { xs: 2, sm: 3 } }}
              >
                <ChevronLeft />
              </IconButton>
            </Box>

            <Paper
              elevation={2}
              sx={{
                p: { xs: 2, sm: 3 },
                border: 2,
                borderColor: 'primary.main',
                borderRadius: 2,
                minHeight: 70,
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
              }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="start"
                mb={1}
                flexWrap="wrap"
                gap={1}
              >
                <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
                  <Chip
                    label={currentMessage?.messageNumber}
                    size="small"
                    color="primary"
                  />
                  <Chip
                    label={getPriorityText(currentMessage?.priority)}
                    size="small"
                    color={getPriorityColor(currentMessage?.priority)}
                    variant="outlined"
                  />
                  {currentMessage?.isRead && (
                    <Chip
                      icon={<CheckCircle />}
                      label="خوانده شده"
                      size="small"
                      color="success"
                      variant="outlined"
                    />
                  )}
                </Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontStyle: 'italic' }}
                >
                  یگان: {currentMessage?.unitName}
                </Typography>
              </Box>

              <Box
                sx={{
                  overflowY: 'auto',
                  maxHeight: { xs: '100px', sm: '120px' },
                  flex: 1,
                  mb: 2,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    lineHeight: 2,
                    textAlign: 'right',
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                  }}
                >
                  {currentMessage?.messageText}
                </Typography>
              </Box>

              {!currentMessage?.isRead && (
                <Box display="flex" justifyContent="center" mt="auto">
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<CheckCircle />}
                    onClick={() => markAsRead(currentMessage.id)}
                    disabled={markingRead}
                    size="small"
                    sx={{ minWidth: '120px' }}
                  >
                    {markingRead ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      'خواندم'
                    )}
                  </Button>
                </Box>
              )}
            </Paper>

            <Box display="flex" justifyContent="center" mt={2} flexWrap="wrap">
              {messages.map((message, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor:
                      index === currentIndex
                        ? 'primary.main'
                        : message.isRead
                          ? 'success.main'
                          : 'grey.400',
                    mx: 0.5,
                    cursor: 'pointer',
                    mb: 0.5,
                  }}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default MessageViewer;
