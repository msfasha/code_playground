const { Message } = require('../models');
const logger = require('../utils/logger');

async function handleReadReceipts(io, socket, data) {
  try {
    const { chatId, messageIds } = data;
    
    if (!chatId || !messageIds || !Array.isArray(messageIds)) {
      throw new Error('Invalid read receipt data');
    }

    // Update read status for each message
    await Message.update(
      {
        readBy: sequelize.fn('array_append', sequelize.col('readBy'), socket.user.id)
      },
      {
        where: {
          id: messageIds,
          chatId,
          readBy: {
            [sequelize.Op.not]: {
              [sequelize.Op.contains]: [socket.user.id]
            }
          }
        }
      }
    );

    // Get updated messages
    const updatedMessages = await Message.findAll({
      where: {
        id: messageIds,
        chatId
      },
      attributes: ['id', 'readBy']
    });

    // Broadcast read status to all users in the chat
    io.to(`chat:${chatId}`).emit('read_receipts', {
      chatId,
      messages: updatedMessages.map(message => ({
        messageId: message.id,
        readBy: message.readBy
      }))
    });
  } catch (error) {
    logger.error('Error handling read receipts:', error);
    socket.emit('error', { message: 'Failed to update read status' });
  }
}

module.exports = {
  handleReadReceipts
}; 