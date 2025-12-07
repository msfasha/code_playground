import React from 'react';
import { Box, Typography, Avatar, Paper } from '@mui/material';
import { format } from 'date-fns';

const Message = ({ message, isOwnMessage }) => {
  const renderMessageContent = () => {
    switch (message.type) {
      case 'image':
        return (
          <img
            src={message.content}
            alt={message.fileName}
            style={{
              maxWidth: '100%',
              maxHeight: '300px',
              borderRadius: '8px'
            }}
          />
        );
      case 'file':
        return (
          <Box
            component="a"
            href={message.content}
            download={message.fileName}
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            <Paper
              elevation={1}
              sx={{
                p: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Typography variant="body2">
                {message.fileName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ({(message.fileSize / 1024).toFixed(1)} KB)
              </Typography>
            </Paper>
          </Box>
        );
      default:
        return (
          <Typography variant="body1">
            {message.content}
          </Typography>
        );
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isOwnMessage ? 'row-reverse' : 'row',
        gap: 1,
        alignItems: 'flex-start'
      }}
    >
      <Avatar
        src={message.sender.avatar}
        alt={message.sender.name}
        sx={{ width: 32, height: 32 }}
      />
      <Box
        sx={{
          maxWidth: '70%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: isOwnMessage ? 'flex-end' : 'flex-start'
        }}
      >
        <Paper
          elevation={1}
          sx={{
            p: 1.5,
            backgroundColor: isOwnMessage ? 'primary.light' : 'background.paper',
            color: isOwnMessage ? 'primary.contrastText' : 'text.primary',
            borderRadius: 2
          }}
        >
          {renderMessageContent()}
        </Paper>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 0.5 }}
        >
          {format(new Date(message.createdAt), 'HH:mm')}
          {message.readBy?.length > 0 && ' • Read'}
        </Typography>
      </Box>
    </Box>
  );
};

export default Message; 