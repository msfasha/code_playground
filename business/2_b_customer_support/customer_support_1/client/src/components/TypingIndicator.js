import React from 'react';
import { Box, Typography } from '@mui/material';

const TypingIndicator = ({ users }) => {
  if (!users || users.length === 0) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 0.5
        }}
      >
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              backgroundColor: 'primary.main',
              animation: 'typing 1s infinite',
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
      </Box>
      <Typography variant="caption" color="text.secondary">
        {users.length === 1
          ? `${users[0]} is typing...`
          : `${users.length} people are typing...`}
      </Typography>
      <style>
        {`
          @keyframes typing {
            0%, 100% {
              transform: translateY(0);
              opacity: 0.4;
            }
            50% {
              transform: translateY(-4px);
              opacity: 1;
            }
          }
        `}
      </style>
    </Box>
  );
};

export default TypingIndicator; 