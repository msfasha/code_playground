#!/bin/bash

echo "🚀 Testing Cassandra with cqlsh..."

# Test 1: Check if we can connect to Cassandra
echo "🔌 Testing connection to Cassandra..."
if cqlsh localhost 9042 -e "describe cluster" > /dev/null 2>&1; then
    echo "✅ Successfully connected to Cassandra"
else
    echo "❌ Failed to connect to Cassandra"
    exit 1
fi

# Test 2: Check if keyspace exists
echo "📋 Checking if keyspace 'raasel_chat' exists..."
if cqlsh localhost 9042 -e "describe keyspace raasel_chat" > /dev/null 2>&1; then
    echo "✅ Keyspace 'raasel_chat' exists"
else
    echo "❌ Keyspace 'raasel_chat' not found"
    exit 1
fi

# Test 3: Check if table exists
echo "📊 Checking if table 'messages' exists..."
if cqlsh localhost 9042 -e "describe table raasel_chat.messages" > /dev/null 2>&1; then
    echo "✅ Table 'messages' exists"
else
    echo "❌ Table 'messages' not found"
    exit 1
fi

# Test 4: Insert test data
echo "📝 Inserting test data..."
cqlsh localhost 9042 -e "
INSERT INTO raasel_chat.messages 
(organization_id, session_id, message_id, sender_id, sender_type, content, timestamp) 
VALUES ('test-org-123', 'test-session-456', 'test-message-789', 'test-user-001', 'user', 'Hello from cqlsh test!', toTimestamp(now()));
"

if [ $? -eq 0 ]; then
    echo "✅ Test data inserted successfully"
else
    echo "❌ Failed to insert test data"
    exit 1
fi

# Test 5: Retrieve test data
echo "🔍 Retrieving test data..."
echo "📄 Retrieved data:"
cqlsh localhost 9042 -e "
SELECT organization_id, session_id, message_id, sender_id, sender_type, content, timestamp 
FROM raasel_chat.messages 
WHERE organization_id = 'test-org-123' AND session_id = 'test-session-456';
"

# Test 6: Count total messages
echo "📈 Counting total messages..."
cqlsh localhost 9042 -e "
SELECT COUNT(*) as total FROM raasel_chat.messages;
"

echo "🎉 All Cassandra tests completed successfully!" 