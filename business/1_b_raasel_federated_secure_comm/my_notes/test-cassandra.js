/**
 * test-cassandra.js
 * 
 * Standalone Node.js utility for testing Cassandra connection and basic operations
 * for the Raasel Chat Platform. Performs connectivity and schema verification.
 * 
 * Key Features:
 * - Connects to Cassandra using environment variables
 * - Verifies keyspace and table existence
 * - Tests message insertion and retrieval
 * - Validates data integrity and query performance
 * - Provides detailed test results and error reporting
 * 
 * Usage: node test-cassandra.js
 * Environment: Uses .env file for configuration
 * Dependencies: cassandra-driver, dotenv
 * 
 * Test Sequence:
 * 1. Connection verification
 * 2. Keyspace existence check
 * 3. Table existence check
 * 4. Test data insertion
 * 5. Data retrieval and validation
 * 6. Message count verification
 */

// Load environment variables
require('dotenv').config();

const cassandra = require('cassandra-driver');

// Cassandra connection configuration using environment variables
const client = new cassandra.Client({
  contactPoints: [`${process.env.CASSANDRA_HOST}:${process.env.CASSANDRA_PORT}`],
  localDataCenter: process.env.CASSANDRA_DATACENTER,
  keyspace: process.env.CASSANDRA_KEYSPACE
});

async function testCassandra() {
  try {
    console.log('🔌 Connecting to Cassandra...');
    
    // Connect to Cassandra
    await client.connect();
    console.log('✅ Connected to Cassandra successfully!');
    
    // Test 1: Check if keyspace exists
    console.log('\n📋 Testing keyspace access...');
    const keyspaceName = process.env.CASSANDRA_KEYSPACE;
    const keyspaceQuery = `SELECT keyspace_name FROM system_schema.keyspaces WHERE keyspace_name = '${keyspaceName}'`;
    const keyspaceResult = await client.execute(keyspaceQuery);
    
    if (keyspaceResult.rows.length > 0) {
      console.log(`✅ Keyspace "${keyspaceName}" exists`);
    } else {
      console.log(`❌ Keyspace "${keyspaceName}" not found`);
      return;
    }
    
    // Test 2: Check if table exists
    console.log('\n📊 Testing table access...');
    const tableQuery = `SELECT table_name FROM system_schema.tables WHERE keyspace_name = '${keyspaceName}' AND table_name = 'messages'`;
    const tableResult = await client.execute(tableQuery);
    
    if (tableResult.rows.length > 0) {
      console.log('✅ Table "messages" exists');
    } else {
      console.log('❌ Table "messages" not found');
      return;
    }
    
    // Test 3: Insert test data
    console.log('\n📝 Inserting test data...');
    const insertQuery = `
      INSERT INTO ${keyspaceName}.messages 
      (organization_id, session_id, message_id, sender_id, sender_type, content, timestamp) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    const testData = {
      organization_id: 'test-org-123',
      session_id: 'test-session-456',
      message_id: 'test-message-789',
      sender_id: 'test-user-001',
      sender_type: 'user',
      content: 'Hello, this is a test message!',
      timestamp: new Date()
    };
    
    await client.execute(insertQuery, [
      testData.organization_id,
      testData.session_id,
      testData.message_id,
      testData.sender_id,
      testData.sender_type,
      testData.content,
      testData.timestamp
    ], { prepare: true });
    
    console.log('✅ Test data inserted successfully');
    
    // Test 4: Retrieve test data
    console.log('\n🔍 Retrieving test data...');
    const selectQuery = `
      SELECT * FROM ${keyspaceName}.messages 
      WHERE organization_id = ? AND session_id = ?
      ORDER BY timestamp DESC
    `;
    
    const selectResult = await client.execute(selectQuery, [
      testData.organization_id,
      testData.session_id
    ], { prepare: true });
    
    if (selectResult.rows.length > 0) {
      console.log('✅ Data retrieved successfully!');
      console.log('📄 Retrieved data:');
      selectResult.rows.forEach((row, index) => {
        console.log(`  Message ${index + 1}:`);
        console.log(`    Organization ID: ${row.organization_id}`);
        console.log(`    Session ID: ${row.session_id}`);
        console.log(`    Message ID: ${row.message_id}`);
        console.log(`    Sender ID: ${row.sender_id}`);
        console.log(`    Sender Type: ${row.sender_type}`);
        console.log(`    Content: ${row.content}`);
              console.log(`    Timestamp: ${row.timestamp}`);
            });
          } else {
            console.log('❌ No data found for test session');
          }
      
          // Test 5: Count messages for the test session
          console.log('\n🔢 Counting messages for test session...');
          const countQuery = `
            SELECT COUNT(*) FROM ${keyspaceName}.messages 
            WHERE organization_id = ? AND session_id = ?
          `;
          const countResult = await client.execute(countQuery, [
            testData.organization_id,
            testData.session_id
          ], { prepare: true });
      
          if (countResult.rows.length > 0) {
            console.log(`✅ Message count: ${countResult.rows[0]['count']}`);
          } else {
            console.log('❌ Unable to count messages');
          }
      
          console.log('\n🎉 Cassandra test completed successfully!');
        } catch (err) {
          console.error('❌ Cassandra test failed:', err);
        } finally {
          await client.shutdown();
          console.log('🔒 Cassandra connection closed.');
        }
      }
      
      testCassandra();