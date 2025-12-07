const logger = require('../utils/logger');
const { User, Chat, Message } = require('../models');
const { handleAgentAssignment } = require('./agentAssignment');
const { handleTypingIndicator } = require('./typingIndicator');
const { handleReadReceipts } = require('./readReceipts');

function setupSocketHandlers(io) {
  // Middleware for authentication
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      // Verify token and attach user to socket
      const user = await User.findByPk(token);
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', async (socket) => {
    logger.info(`User connected: ${socket.user.id}`);

    // Update user status to online
    await socket.user.update({ status: 'online', lastActive: new Date() });

    // Join user's personal room
    socket.join(`user:${socket.user.id}`);

    // Join agent's department room if user is an agent
    if (socket.user.role === 'agent') {
      socket.join(`department:${socket.user.department}`);
    }

    // Handle new chat request
    socket.on('start_chat', async (data) => {
      try {
        const chat = await Chat.create({
          customerId: socket.user.id,
          status: 'waiting',
          metadata: data.metadata || {}
        });

        // Assign agent to chat
        const assignedAgent = await handleAgentAssignment(chat);
        
        if (assignedAgent) {
          await chat.update({ 
            agentId: assignedAgent.id,
            status: 'active'
          });
          
          // Notify assigned agent
          io.to(`user:${assignedAgent.id}`).emit('new_chat_assigned', {
            chatId: chat.id,
            customer: socket.user
          });
        }

        socket.join(`chat:${chat.id}`);
        socket.emit('chat_started', { chatId: chat.id });
      } catch (error) {
        logger.error('Error starting chat:', error);
        socket.emit('error', { message: 'Failed to start chat' });
      }
    });

    // Handle new message
    socket.on('send_message', async (data) => {
      try {
        const { chatId, content, type = 'text', fileData } = data;
        
        const message = await Message.create({
          chatId,
          senderId: socket.user.id,
          content,
          type,
          ...fileData
        });

        // Update chat's last message timestamp
        await Chat.update(
          { lastMessageAt: new Date() },
          { where: { id: chatId } }
        );

        // Broadcast message to all users in the chat
        io.to(`chat:${chatId}`).emit('new_message', {
          message: {
            ...message.toJSON(),
            sender: socket.user
          }
        });
      } catch (error) {
        logger.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicator
    socket.on('typing', (data) => {
      handleTypingIndicator(io, socket, data);
    });

    // Handle read receipts
    socket.on('mark_read', (data) => {
      handleReadReceipts(io, socket, data);
    });

    // Handle chat transfer
    socket.on('transfer_chat', async (data) => {
      try {
        const { chatId, newAgentId, reason } = data;
        const chat = await Chat.findByPk(chatId);
        
        if (!chat) {
          throw new Error('Chat not found');
        }

        const newAgent = await User.findByPk(newAgentId);
        if (!newAgent || newAgent.role !== 'agent') {
          throw new Error('Invalid agent');
        }

        await chat.update({
          agentId: newAgentId,
          status: 'transferred'
        });

        // Notify all participants
        io.to(`chat:${chatId}`).emit('chat_transferred', {
          chatId,
          newAgent,
          reason
        });

        // Notify new agent
        io.to(`user:${newAgentId}`).emit('chat_assigned', {
          chatId,
          customer: await User.findByPk(chat.customerId)
        });
      } catch (error) {
        logger.error('Error transferring chat:', error);
        socket.emit('error', { message: 'Failed to transfer chat' });
      }
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
      logger.info(`User disconnected: ${socket.user.id}`);
      
      // Update user status to offline
      await socket.user.update({ 
        status: 'offline',
        lastActive: new Date()
      });

      // Notify relevant users
      if (socket.user.role === 'agent') {
        const activeChats = await Chat.findAll({
          where: { agentId: socket.user.id, status: 'active' }
        });

        for (const chat of activeChats) {
          io.to(`chat:${chat.id}`).emit('agent_disconnected', {
            chatId: chat.id,
            agentId: socket.user.id
          });
        }
      }
    });
  });
}

module.exports = {
  setupSocketHandlers
}; 