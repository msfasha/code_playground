/**
 * Raasel Chat Platform - Agent Management Routes
 * 
 * RESTful API endpoints for agent operations including authentication, profile management,
 * and status updates. Agents are customer support representatives handling chat sessions.
 * 
 * Key Features:
 * - Organization-specific login with email and password validation
 * - Agent creation with role assignment (agent, supervisor, admin)
 * - Real-time status updates (active, inactive, busy)
 * - Role-based access control with organization scoping
 * - Password change functionality with secure hashing
 * - Agent profile management and updates
 * 
 * API Endpoints:
 * - POST /api/agents/login: Authenticates agent within organization
 * - POST /api/agents: Creates new agent account
 * - GET /api/agents/:id: Retrieves agent by ID
 * - GET /api/agents/organization/:orgId: Lists all agents in organization
 * - PUT /api/agents/:id: Updates agent profile
 * - PUT /api/agents/:id/password: Changes agent password
 * - PUT /api/agents/:id/status: Updates agent status
 * 
 * Database Schema: agents table with id, organization_id, name, email, password_hash, role, status, timestamps
 * Error Handling: 400 (validation), 401 (auth), 404 (not found), 409 (duplicates), 500 (server)
 * Dependencies: express, Agent model, Session model
 */

const express = require('express');
const Agent = require('../models/Agent');
const Session = require('../models/Session');

const router = express.Router();

// Agent authentication
router.post('/login', async (req, res) => {
  try {
    const { email, password, organization_id } = req.body;

    if (!email || !password || !organization_id) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Email, password, and organization ID are required'
      });
    }

    const authResult = await Agent.authenticate(email, password, organization_id);
    res.json(authResult);
  } catch (error) {
    console.error('Error authenticating agent:', error);
    res.status(401).json({ 
      error: 'Authentication failed',
      message: error.message
    });
  }
});

// Create new agent
router.post('/', async (req, res) => {
  try {
    const { 
      organization_id, 
      name, 
      email, 
      password,
      role = 'agent'
    } = req.body;

    if (!organization_id || !name || !email || !password) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Organization ID, name, email, and password are required'
      });
    }

    // Check if email already exists in organization
    const existingAgent = await Agent.findByEmail(email, organization_id);
    if (existingAgent) {
      return res.status(409).json({
        error: 'Email already exists',
        message: 'An agent with this email already exists in this organization'
      });
    }

    const agent = await Agent.create({
      organization_id,
      name,
      email,
      password,
      role
    });

    res.status(201).json({ agent });
  } catch (error) {
    console.error('Error creating agent:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to create agent'
    });
  }
});

// Get agent by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const agent = await Agent.findById(id);
    
    if (!agent) {
      return res.status(404).json({ 
        error: 'Agent not found',
        message: 'Agent does not exist'
      });
    }

    // Remove password hash from response
    const { password_hash, ...agentData } = agent;
    res.json({ agent: agentData });
  } catch (error) {
    console.error('Error fetching agent:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to fetch agent'
    });
  }
});

// Get agents by organization
router.get('/organization/:organizationId', async (req, res) => {
  try {
    const { organizationId } = req.params;
    const agents = await Agent.findByOrganization(organizationId);
    res.json({ agents });
  } catch (error) {
    console.error('Error fetching organization agents:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to fetch organization agents'
    });
  }
});

// Update agent profile
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    const agent = await Agent.findById(id);
    if (!agent) {
      return res.status(404).json({ 
        error: 'Agent not found',
        message: 'Agent does not exist'
      });
    }

    // Check if new email conflicts with existing agent in same organization
    if (email && email !== agent.email) {
      const existingAgent = await Agent.findByEmail(email, agent.organization_id);
      if (existingAgent && existingAgent.id !== parseInt(id)) {
        return res.status(409).json({
          error: 'Email already exists',
          message: 'An agent with this email already exists in this organization'
        });
      }
    }

    const updatedAgent = await Agent.updateProfile(id, {
      name: name || agent.name,
      email: email || agent.email,
      role: role || agent.role
    });

    const { password_hash, ...agentData } = updatedAgent;
    res.json({ agent: agentData });
  } catch (error) {
    console.error('Error updating agent:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to update agent'
    });
  }
});

// Change agent password
router.put('/:id/password', async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'New password is required'
      });
    }

    const agent = await Agent.findById(id);
    if (!agent) {
      return res.status(404).json({ 
        error: 'Agent not found',
        message: 'Agent does not exist'
      });
    }

    await Agent.changePassword(id, newPassword);
    res.json({ 
      message: 'Password changed successfully',
      agent_id: id
    });
  } catch (error) {
    console.error('Error changing agent password:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to change password'
    });
  }
});

// Update agent status
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['active', 'inactive', 'busy'].includes(status)) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Valid status is required (active, inactive, busy)'
      });
    }

    const agent = await Agent.findById(id);
    if (!agent) {
      return res.status(404).json({ 
        error: 'Agent not found',
        message: 'Agent does not exist'
      });
    }

    const updatedAgent = await Agent.updateStatus(id, status);
    const { password_hash, ...agentData } = updatedAgent;
    res.json({ agent: agentData });
  } catch (error) {
    console.error('Error updating agent status:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to update agent status'
    });
  }
});

// Get available agents for organization
router.get('/organization/:organizationId/available', async (req, res) => {
  try {
    const { organizationId } = req.params;
    const agents = await Agent.getAvailableAgents(organizationId);
    res.json({ agents });
  } catch (error) {
    console.error('Error fetching available agents:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to fetch available agents'
    });
  }
});

// Get agent sessions
router.get('/:id/sessions', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.query;

    const agent = await Agent.findById(id);
    if (!agent) {
      return res.status(404).json({ 
        error: 'Agent not found',
        message: 'Agent does not exist'
      });
    }

    // Get sessions assigned to this agent
    const sessions = await Session.findByOrganization(agent.organization_id);
    const agentSessions = sessions.filter(session => session.agent_id === parseInt(id));

    let filteredSessions = agentSessions;
    if (status) {
      filteredSessions = agentSessions.filter(session => session.status === status);
    }

    res.json({ sessions: filteredSessions });
  } catch (error) {
    console.error('Error fetching agent sessions:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to fetch agent sessions'
    });
  }
});

// Delete agent
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const agent = await Agent.findById(id);
    if (!agent) {
      return res.status(404).json({ 
        error: 'Agent not found',
        message: 'Agent does not exist'
      });
    }

    await Agent.delete(id);
    res.json({ 
      message: 'Agent deleted successfully',
      agent_id: id
    });
  } catch (error) {
    console.error('Error deleting agent:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to delete agent'
    });
  }
});

module.exports = router; 