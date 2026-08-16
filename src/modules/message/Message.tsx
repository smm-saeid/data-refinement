import { useEffect, useState } from 'react';

import {
  Box,
  Button,
  TextField,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';


import OnMessage from './OnMessage';
import messageApi from './apis';

import type { Message as MessageType } from './types';

const Message = () => {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  // لیست پیام‌ها
  const [messages, setMessages] = useState<MessageType[]>([]);

  // وضعیت دریافت اطلاعات
  const [isLoading, setIsLoading] = useState(false);

  // خطا
  const [error, setError] = useState('');

  // دریافت پیام‌ها
  useEffect(() => {
    const getMessages = async () => {
      try {
        setIsLoading(true);
        setError('');

        const response = await fetch(messageApi.message.list);

        if (!response.ok) {
          throw new Error('خطا در دریافت پیام‌ها');
        }

        const data: MessageType[] = await response.json();

        setMessages(data);
      } catch (error) {
        console.error(error);
        setError('دریافت پیام‌ها با خطا مواجه شد');
      } finally {
        setIsLoading(false);
      }
    };

    getMessages();
  }, []);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // جستجوی پیام‌ها
  const filteredMessages = messages.filter((message) =>
    message.title
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <Box sx={{ p: 2 }}>

      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mb: 2,
        }}
      >
        {/* Search */}
        <TextField
          sx={{width:"60%"}}
          size="small"
          placeholder="جستجوی پیام..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: <SearchIcon sx={{ mr: 1 }} />,
            },
          }}
        />

        {/* Create Message */}
        <Button
          variant="contained"
          startIcon={<SendIcon />}
          sx={{ whiteSpace: 'nowrap',  ml: 'auto',backgroundColor:"green" }}
          onClick={handleOpenModal}
        >
          ایجاد پیام جدید
        </Button>
      </Box>
<hr/>
      {/* Messages */}
      <Paper
        sx={{
          width: '100%',
          overflow: 'hidden',
        }}
      >

        {/* Header */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography fontWeight="bold" 
              sx={{textAlign:"center"}}
            >
              پیام ارسال شده
            </Typography>
          </Box>

          <Box
            sx={{
              p: 2,
              borderLeft: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography fontWeight="bold"
            sx={{textAlign:"center"}}
            >
              پیام دریافتی
            </Typography>
          </Box>
        </Box>

        {/* Loading */}
        {isLoading && (
          <Box sx={{ p: 3 }}>
            در حال دریافت پیام‌ها...
          </Box>
        )}

        {/* Error */}
        {!isLoading && error && (
          <Box sx={{ p: 3 }}>
            <Typography color="error">
              {error}
            </Typography>
          </Box>
        )}

        {/* Empty */}
        {!isLoading &&
          !error &&
          filteredMessages.length === 0 && (
            <Box sx={{ p: 3 }}>
              <Typography>
                پیامی یافت نشد
              </Typography>
            </Box>
          )}

        {/* Messages */}
        {!isLoading &&
          !error &&
          filteredMessages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              {/* Sent */}
              <Box sx={{ p: 2 }}>
                <Typography
                  fontWeight="bold"
                  sx={{ mb: 1 }}
                >
                  {message.title}
                </Typography>

                <Typography>
                  {message.text}
                </Typography>
              </Box>

              {/* Received */}
              <Box
                sx={{
                  p: 2,
                  borderLeft: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography>
                  {message.receiver}
                </Typography>
              </Box>
            </Box>
          ))}
      </Paper>

      {/* Send Message Modal */}
      <Dialog
  open={showModal}
  onClose={handleCloseModal}
  fullWidth
  maxWidth="lg"
 slotProps={{
    paper: {
      sx: {
        width: '90%',
        maxWidth: '1100px',
        minHeight: '650px',
        borderRadius: 2,
      },
    },
  }}
>
  <DialogTitle
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: '20px',
      fontWeight: 'bold',
    }}
  >
          ارسال پیام

          <IconButton onClick={handleCloseModal}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <OnMessage
            onClose={handleCloseModal}
          />
        </DialogContent>
      </Dialog>

    </Box>
  );
};

export default Message;