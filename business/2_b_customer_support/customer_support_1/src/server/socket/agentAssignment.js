const { User, Chat } = require('../models');
const logger = require('../utils/logger');

async function handleAgentAssignment(chat) {
  try {
    // Get all available agents
    const availableAgents = await User.findAll({
      where: {
        role: 'agent',
        status: 'online'
      }
    });

    if (availableAgents.length === 0) {
      logger.info('No available agents found');
      return null;
    }

    // Get agent with least active chats
    const agentChats = await Chat.findAll({
      where: {
        agentId: availableAgents.map(agent => agent.id),
        status: 'active'
      },
      attributes: ['agentId', [sequelize.fn('COUNT', sequelize.col('id')), 'activeChats']],
      group: ['agentId']
    });

    // Create a map of agent IDs to their active chat count
    const agentChatCounts = new Map(
      agentChats.map(chat => [chat.agentId, parseInt(chat.get('activeChats'))])
    );

    // Find agent with least active chats
    let selectedAgent = null;
    let minChats = Infinity;

    for (const agent of availableAgents) {
      const activeChats = agentChatCounts.get(agent.id) || 0;
      
      // Check if agent has reached their maximum concurrent chats
      if (activeChats >= agent.maxConcurrentChats) {
        continue;
      }

      if (activeChats < minChats) {
        minChats = activeChats;
        selectedAgent = agent;
      }
    }

    if (!selectedAgent) {
      logger.info('No agent available within their chat limits');
      return null;
    }

    return selectedAgent;
  } catch (error) {
    logger.error('Error in agent assignment:', error);
    return null;
  }
}

// Alternative routing strategies (can be implemented based on requirements)

async function skillBasedRouting(chat, availableAgents) {
  // Route based on agent skills and chat requirements
  const requiredSkills = chat.metadata?.requiredSkills || [];
  
  return availableAgents.find(agent => 
    requiredSkills.every(skill => agent.skills.includes(skill))
  );
}

async function departmentBasedRouting(chat, availableAgents) {
  // Route based on department
  const department = chat.department;
  
  return availableAgents.find(agent => 
    agent.department === department
  );
}

async function priorityBasedRouting(chat, availableAgents) {
  // Route high priority chats to senior agents
  if (chat.priority === 'high' || chat.priority === 'urgent') {
    return availableAgents.find(agent => 
      agent.skills.includes('senior')
    );
  }
  return null;
}

module.exports = {
  handleAgentAssignment
}; 