const { User } = require('../models');
const { sequelize } = require('../config/database');

async function createTestUser() {
  try {
    await sequelize.sync();
    
    // First, delete any existing test users
    await User.destroy({
      where: {
        email: 'test@example.com'
      }
    });
    
    // Create a new test user
    const testUser = await User.create({
      email: 'test@example.com',
      password: 'test123',  // Simpler password
      name: 'Test User',
      role: 'agent',
      department: 'support'
    });

    console.log('Test user created:', testUser.email);
    console.log('Password: test123');
    process.exit(0);
  } catch (error) {
    console.error('Error creating test user:', error);
    process.exit(1);
  }
}

createTestUser(); 