import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSocket } from '../contexts/SocketContext';
import { getChats } from '../store/slices/chatSlice';
import { logout } from '../store/slices/authSlice';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Badge,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import ChatWindow from './ChatWindow';

const Dashboard = () => {
  const dispatch = useDispatch();
  const socket = useSocket();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const { user } = useSelector(state => state.auth);
  const { chats, activeChat } = useSelector(state => state.chat);

  useEffect(() => {
    dispatch(getChats());
  }, [dispatch]);

  useEffect(() => {
    if (!socket) return;

    socket.on('new_chat_assigned', ({ chatId, customer }) => {
      // Handle new chat assignment
      dispatch(getChats());
    });

    return () => {
      socket.off('new_chat_assigned');
    };
  }, [socket, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleChatSelect = (chat) => {
    dispatch({ type: 'chat/setActiveChat', payload: chat });
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const drawer = (
    <Box sx={{ width: 300, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <PersonIcon />
        <Typography variant="subtitle1">{user?.name}</Typography>
      </Box>
      <Divider />
      <List sx={{ flex: 1, overflow: 'auto' }}>
        {chats.map((chat) => (
          <ListItem
            key={chat.id}
            button
            selected={activeChat?.id === chat.id}
            onClick={() => handleChatSelect(chat)}
          >
            <ListItemAvatar>
              <Badge
                color="error"
                variant="dot"
                invisible={!chat.unreadCount}
              >
                <Avatar src={chat.customer.avatar}>
                  {chat.customer.name[0]}
                </Avatar>
              </Badge>
            </ListItemAvatar>
            <ListItemText
              primary={chat.customer.name}
              secondary={chat.lastMessage?.content || 'No messages yet'}
              secondaryTypographyProps={{
                noWrap: true,
                style: { maxWidth: '200px' }
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setDrawerOpen(!drawerOpen)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Customer Support Dashboard
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          width: 300,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 300,
            boxSizing: 'border-box',
            marginTop: '64px'
          }
        }}
      >
        {drawer}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginTop: '64px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'background.default'
        }}
      >
        {activeChat ? (
          <ChatWindow chat={activeChat} />
        ) : (
          <Typography variant="h6" color="text.secondary">
            Select a chat to start messaging
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard; 