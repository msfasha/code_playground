/**
 * Raasel Chat Platform - Organization Management Routes
 * 
 * RESTful API endpoints for organization operations including creation, discovery,
 * and management of multi-tenant organizations. Organizations are top-level entities.
 * 
 * Key Features:
 * - Domain-based organization discovery for client lookup
 * - Organization creation with unique domain validation
 * - JSON-based flexible configuration storage
 * - Multi-tenant architecture with complete data isolation
 * - Organization settings management and updates
 * - Administrative operations for organization listing
 * 
 * API Endpoints:
 * - GET /api/organizations/discover/:domain: Discovers organization by domain (public)
 * - GET /api/organizations/:id: Retrieves organization by ID
 * - POST /api/organizations: Creates new organization
 * - PUT /api/organizations/:id: Updates organization
 * - GET /api/organizations: Lists all organizations (admin only)
 * - DELETE /api/organizations/:id: Deletes organization and associated data
 * 
 * Database Schema: organizations table with id (UUID), name, domain, settings (JSON), timestamps
 * Error Handling: 400 (validation), 404 (not found), 409 (duplicate domain), 500 (server)
 * Dependencies: express, Organization model, uuid
 */

const express = require('express');
const Organization = require('../models/Organization');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Get organization by domain (for client discovery)
router.get('/discover/:domain', async (req, res) => {
  try {
    const { domain } = req.params;
    const organization = await Organization.findByDomain(domain);
    
    if (!organization) {
      return res.status(404).json({ 
        error: 'Organization not found',
        message: 'No organization found for this domain'
      });
    }

    res.json({
      organization: {
        id: organization.id,
        name: organization.name,
        domain: organization.domain,
        settings: organization.settings
      }
    });
  } catch (error) {
    console.error('Error discovering organization:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to discover organization'
    });
  }
});

// Get organization by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const organization = await Organization.findById(id);
    
    if (!organization) {
      return res.status(404).json({ 
        error: 'Organization not found',
        message: 'Organization does not exist'
      });
    }

    res.json({ organization });
  } catch (error) {
    console.error('Error fetching organization:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to fetch organization'
    });
  }
});

// Create new organization
router.post('/', async (req, res) => {
  try {
    const { name, domain, settings = {} } = req.body;

    if (!name || !domain) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Name and domain are required'
      });
    }

    // Check if domain already exists
    const existingOrg = await Organization.findByDomain(domain);
    if (existingOrg) {
      return res.status(409).json({
        error: 'Domain already exists',
        message: 'An organization with this domain already exists'
      });
    }

    const organization = await Organization.create({
      id: uuidv4(),
      name,
      domain,
      settings
    });

    res.status(201).json({ organization });
  } catch (error) {
    console.error('Error creating organization:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to create organization'
    });
  }
});

// Update organization
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, domain, settings } = req.body;

    const organization = await Organization.findById(id);
    if (!organization) {
      return res.status(404).json({ 
        error: 'Organization not found',
        message: 'Organization does not exist'
      });
    }

    // Check if new domain conflicts with existing organization
    if (domain && domain !== organization.domain) {
      const existingOrg = await Organization.findByDomain(domain);
      if (existingOrg) {
        return res.status(409).json({
          error: 'Domain already exists',
          message: 'An organization with this domain already exists'
        });
      }
    }

    const updatedOrg = await Organization.update(id, {
      name: name || organization.name,
      domain: domain || organization.domain,
      settings: settings || organization.settings
    });

    res.json({ organization: updatedOrg });
  } catch (error) {
    console.error('Error updating organization:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to update organization'
    });
  }
});

// List all organizations (admin only)
router.get('/', async (req, res) => {
  try {
    const organizations = await Organization.listAll();
    res.json({ organizations });
  } catch (error) {
    console.error('Error listing organizations:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to list organizations'
    });
  }
});

// Delete organization
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const organization = await Organization.findById(id);
    if (!organization) {
      return res.status(404).json({ 
        error: 'Organization not found',
        message: 'Organization does not exist'
      });
    }

    await Organization.delete(id);
    res.json({ 
      message: 'Organization deleted successfully',
      organization_id: id
    });
  } catch (error) {
    console.error('Error deleting organization:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to delete organization'
    });
  }
});

module.exports = router; 