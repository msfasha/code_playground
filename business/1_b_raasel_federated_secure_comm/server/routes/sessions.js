/**
 * Raasel Chat Platform - Chat Session Management Routes
 * 
 * RESTful API endpoints for chat session operations including creation, message management,
 * agent assignment, and status updates. Sessions represent individual chat conversations.
 * 
 * Key Features:
 * - Session lifecycle management (waiting → active → closed)
 * - Message history retrieval with pagination
 * - Agent assignment with organization validation
 * - Organization-scoped operations for multi-tenant architecture
 * - Real-time features via Socket.IO integration
 * - Session status updates and activity tracking
 * 
 * API Endpoints:
 * - POST /api/sessions: Creates new chat session
 * - GET /api/sessions/:sessionId: Retrieves session by ID
 * - GET /api/sessions/:sessionId/messages: Retrieves session messages
 * - PUT /api/sessions/:sessionId/assign: Assigns agent to session
 * - PUT /api/sessions/:sessionId/status: Updates session status
 * - PUT /api/sessions/:sessionId/close: Closes session
 * 
 * Database Schema: PostgreSQL sessions table + Cassandra messages table
 * Error Handling: 400 (validation), 404 (not found), 500 (server)
 * Dependencies: express, Session model, Message model, Agent model, uuid, jsonwebtoken
 */

const express = require('express');
const Session = require('../models/Session');
const Message = require('../models/Message');
const Agent = require('../models/Agent');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Create new chat session
router.post('/', async (req, res) => {
  try {
    const { 
      organization_id, 
      client_id, 
      client_name, 
      client_email,
      agent_id = null 
    } = req.body;

    if (!organization_id || !client_id || !client_name) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Organization ID, client ID, and client name are required'
      });
    }

    const session = await Session.create({
      organization_id,
      client_id,
      client_name,
      client_email,
      agent_id
    });

    res.status(201).json({ session });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to create session'
    });
  }
});

// Get session by ID
router.get('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findById(sessionId);
    
    if (!session) {
      return res.status(404).json({ 
        error: 'Session not found',
        message: 'Session does not exist'
      });
    }

    res.json({ session });
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to fetch session'
    });
  }
});

// Get session messages
router.get('/:sessionId/messages', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { limit = 50 } = req.query;

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ 
        error: 'Session not found',
        message: 'Session does not exist'
      });
    }

    const messages = await Message.getSessionMessages(
      session.organization_id, 
      sessionId, 
      parseInt(limit)
    );

    res.json({ messages });
  } catch (error) {
    console.error('Error fetching session messages:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to fetch session messages'
    });
  }
});

// Get sessions by organization
router.get('/organization/:organizationId', async (req, res) => {
  try {
    const { organizationId } = req.params;
    const { status } = req.query;

    let sessions;
    if (status) {
      sessions = await Session.findByOrganization(organizationId, status);
    } else {
      sessions = await Session.findByOrganization(organizationId);
    }

    res.json({ sessions });
  } catch (error) {
    console.error('Error fetching organization sessions:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to fetch organization sessions'
    });
  }
});

// Assign agent to session
router.put('/:sessionId/assign', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { agent_id } = req.body;

    if (!agent_id) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Agent ID is required'
      });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ 
        error: 'Session not found',
        message: 'Session does not exist'
      });
    }

    const agent = await Agent.findById(agent_id);
    if (!agent || agent.organization_id !== session.organization_id) {
      return res.status(404).json({ 
        error: 'Agent not found',
        message: 'Agent does not exist or does not belong to this organization'
      });
    }

    const updatedSession = await Session.assignAgent(sessionId, agent_id);
    res.json({ session: updatedSession });
  } catch (error) {
    console.error('Error assigning agent to session:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to assign agent to session'
    });
  }
});

// Update session status
router.put('/:sessionId/status', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { status } = req.body;

    if (!status || !['waiting', 'active', 'closed'].includes(status)) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Valid status is required (waiting, active, closed)'
      });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ 
        error: 'Session not found',
        message: 'Session does not exist'
      });
    }

    const updatedSession = await Session.updateStatus(sessionId, status);
    res.json({ session: updatedSession });
  } catch (error) {
    console.error('Error updating session status:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to update session status'
    });
  }
});

// Close session
router.put('/:sessionId/close', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ 
        error: 'Session not found',
        message: 'Session does not exist'
      });
    }

    const closedSession = await Session.closeSession(sessionId);
    res.json({ 
      session: closedSession,
      message: 'Session closed successfully'
    });
  } catch (error) {
    console.error('Error closing session:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to close session'
    });
  }
});

// Get active sessions for organization
router.get('/organization/:organizationId/active', async (req, res) => {
  try {
    const { organizationId } = req.params;
    const sessions = await Session.getActiveSessions(organizationId);
    res.json({ sessions });
  } catch (error) {
    console.error('Error fetching active sessions:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to fetch active sessions'
    });
  }
});

// Get waiting sessions for organization
router.get('/organization/:organizationId/waiting', async (req, res) => {
  try {
    const { organizationId } = req.params;
    const sessions = await Session.getWaitingSessions(organizationId);
    res.json({ sessions });
  } catch (error) {
    console.error('Error fetching waiting sessions:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to fetch waiting sessions'
    });
  }
});

// JWT auth middleware
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided.' });
  const token = authHeader.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token.' });
  }
}

// Get all sessions for the logged-in client
router.get('/', auth, async (req, res) => {
  try {
    const clientId = req.user.id;
    // Find sessions where this client is a participant
    const sessions = await Session.findByClientId(clientId);
    // For each session, get last message (optional, can optimize later)
    const sessionSummaries = await Promise.all(sessions.map(async (session) => {
      const messages = await Message.getSessionMessages(session.organization_id, session.session_id, 1);
      return {
        id: session.session_id,
        participant: session.agent_id ? session.agent_id : 'Support', // Placeholder, can expand
        lastMessage: messages[0]?.content || '',
        timestamp: messages[0]?.timestamp || session.created_at,
      };
    }));
    res.json({ sessions: sessionSummaries });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router; 