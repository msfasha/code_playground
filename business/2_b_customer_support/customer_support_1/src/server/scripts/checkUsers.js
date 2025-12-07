const { User } = require('../models');
const { sequelize } = require('../config/database');

async function checkUsers() {
  try {
    await sequelize.sync();
    
    const users = await User.findAll({
      attributes: ['id', 'email', 'name', 'role'] // Excluding password for security
    });

    console.log('Existing users:');
    console.log(JSON.stringify(users, null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking users:', error);
    process.exit(1);
  }
}

checkUsers(); 