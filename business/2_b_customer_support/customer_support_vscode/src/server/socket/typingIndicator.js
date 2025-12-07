const logger = require('../utils/logger');

// Store typing status for each user in each chat
const typingUsers = new Map();

function handleTypingIndicator(io, socket, data) {
  try {
    const { chatId, isTyping } = data;
    
    if (!chatId) {
      throw new Error('Chat ID is required');
    }

    // Get or create typing status map for this chat
    if (!typingUsers.has(chatId)) {
      typingUsers.set(chatId, new Map());
    }
    
    const chatTypingUsers = typingUsers.get(chatId);

    if (isTyping) {
      // Add user to typing list
      chatTypingUsers.set(socket.user.id, {
        userId: socket.user.id,
        userName: socket.user.name,
        timestamp: Date.now()
      });
    } else {
      // Remove user from typing list
      chatTypingUsers.delete(socket.user.id);
    }

    // Clean up old typing indicators (older than 10 seconds)
    const now = Date.now();
    for (const [userId, data] of chatTypingUsers.entries()) {
      if (now - data.timestamp > 10000) {
        chatTypingUsers.delete(userId);
      }
    }

    // Get list of currently typing users
    const typingUsersList = Array.from(chatTypingUsers.values())
      .map(data => ({
        userId: data.userId,
        userName: data.userName
      }));

    // Broadcast typing status to all users in the chat
    io.to(`chat:${chatId}`).emit('typing_status', {
      chatId,
      typingUsers: typingUsersList
    });

    // Clean up empty chat rooms
    if (chatTypingUsers.size === 0) {
      typingUsers.delete(chatId);
    }
  } catch (error) {
    logger.error('Error handling typing indicator:', error);
    socket.emit('error', { message: 'Failed to update typing status' });
  }
}

module.exports = {
  handleTypingIndicator
}; 