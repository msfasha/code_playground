/**
 * Raasel Chat Platform - Socket.IO Chat Handler
 * 
 * Real-time communication handler using Socket.IO for WebSocket connections, message routing,
 * agent assignment, and real-time status updates for chat sessions.
 * 
 * Key Features:
 * - WebSocket-based bidirectional communication
 * - Organization and session-based room management
 * - Automatic agent assignment to waiting sessions
 * - Real-time message broadcasting and persistence
 * - Typing indicators and status synchronization
 * - Redis-based session state caching
 * 
 * Socket Events:
 * Client → Server: join_organization, send_message, typing_start/stop, assign_agent, update_status
 * Server → Client: new_message, typing_start/stop, agent_assigned, session_status_updated
 * 
 * Room Management:
 * - Organization rooms: org_{organizationId} for org-wide notifications
 * - Session rooms: session_{sessionId} for session-specific communication
 * 
 * Dependencies: socket.io, Message model, Session model, Agent model, redis, uuid
 */

const Message = require('../models/Message');
const Session = require('../models/Session');
const Agent = require('../models/Agent');
const { redis } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join organization room
    socket.on('join_organization', async (data) => {
      const { organization_id, session_id, user_type, user_id } = data;
      
      socket.join(`org_${organization_id}`);
      socket.join(`session_${session_id}`);
      
      // Store socket mapping (if Redis is available)
      if (redis) {
        try {
          await redis.hSet(`session:${session_id}`, 'socket_id', socket.id);
          await redis.hSet(`session:${session_id}`, 'user_type', user_type);
          await redis.hSet(`session:${session_id}`, 'user_id', user_id);
        } catch (error) {
          console.warn('Redis not available for session mapping:', error.message);
        }
      }
      
      console.log(`${user_type} joined org: ${organization_id}, session: ${session_id}`);
    });

    // Handle typing indicators
    socket.on('typing_start', (data) => {
      const { organization_id, session_id, user_id, user_type } = data;
      socket.to(`session_${session_id}`).emit('typing_start', {
        user_id,
        user_type,
        session_id
      });
    });

    socket.on('typing_stop', (data) => {
      const { organization_id, session_id, user_id, user_type } = data;
      socket.to(`session_${session_id}`).emit('typing_stop', {
        user_id,
        user_type,
        session_id
      });
    });

    // Handle messages
    socket.on('send_message', async (data) => {
      const { 
        organization_id, 
        session_id, 
        sender_id, 
        sender_type, 
        content 
      } = data;

      try {
        // Save message to Cassandra
        const message = await Message.create({
          organization_id,
          session_id,
          message_id: uuidv4(),
          sender_id,
          sender_type,
          content,
          timestamp: new Date()
        });

        // Broadcast to session room
        io.to(`session_${session_id}`).emit('new_message', message);

        // Update session last activity
        await Session.updateLastActivity(session_id);

        // If this is a client message and no agent is assigned, try to assign one
        if (sender_type === 'client') {
          const session = await Session.findById(session_id);
          if (session && !session.agent_id) {
            await assignAgentToSession(organization_id, session_id, io);
          }
        }

      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle agent assignment
    socket.on('assign_agent', async (data) => {
      const { organization_id, session_id, agent_id } = data;
      
      try {
        const session = await Session.assignAgent(session_id, agent_id);
        if (session) {
          io.to(`session_${session_id}`).emit('agent_assigned', {
            agent_id: session.agent_id,
            session_id: session.session_id
          });
        }
      } catch (error) {
        console.error('Error assigning agent:', error);
        socket.emit('error', { message: 'Failed to assign agent' });
      }
    });

    // Handle session status changes
    socket.on('update_session_status', async (data) => {
      const { session_id, status } = data;
      
      try {
        const session = await Session.updateStatus(session_id, status);
        io.to(`session_${session_id}`).emit('session_status_updated', {
          session_id,
          status: session.status
        });
      } catch (error) {
        console.error('Error updating session status:', error);
        socket.emit('error', { message: 'Failed to update session status' });
      }
    });

    // Handle agent status updates
    socket.on('update_agent_status', async (data) => {
      const { agent_id, status } = data;
      
      try {
        const agent = await Agent.updateStatus(agent_id, status);
        io.to(`org_${agent.organization_id}`).emit('agent_status_updated', {
          agent_id,
          status: agent.status
        });
      } catch (error) {
        console.error('Error updating agent status:', error);
        socket.emit('error', { message: 'Failed to update agent status' });
      }
    });

    // Handle session history request
    socket.on('get_session_history', async (data) => {
      const { organization_id, session_id } = data;
      
      try {
        const messages = await Message.getSessionMessages(organization_id, session_id);
        socket.emit('session_history', {
          session_id,
          messages
        });
      } catch (error) {
        console.error('Error fetching session history:', error);
        socket.emit('error', { message: 'Failed to fetch session history' });
      }
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      console.log('Client disconnected:', socket.id);
      
      // Clean up session mapping (if Redis is available)
      if (redis) {
        try {
          const sessionKeys = await redis.keys(`session:*`);
          for (const key of sessionKeys) {
            const socketId = await redis.hGet(key, 'socket_id');
            if (socketId === socket.id) {
              await redis.del(key);
              break;
            }
          }
        } catch (error) {
          console.warn('Redis not available for cleanup:', error.message);
        }
      }
    });
  });
};

// Helper function to assign agent to session
async function assignAgentToSession(organizationId, sessionId, io) {
  try {
    const availableAgents = await Agent.getAvailableAgents(organizationId);
    
    if (availableAgents.length === 0) {
      console.log(`No available agents for organization ${organizationId}`);
      return null;
    }

    // Simple round-robin assignment (can be improved with load balancing)
    const agent = availableAgents[0];
    const session = await Session.assignAgent(sessionId, agent.id);
    
    // Notify the assigned agent
    io.to(`org_${organizationId}`).emit('new_session_assigned', {
      session_id: sessionId,
      agent_id: agent.id,
      client_name: session.client_name
    });

    return agent;
  } catch (error) {
    console.error('Error assigning agent to session:', error);
    return null;
  }
} 