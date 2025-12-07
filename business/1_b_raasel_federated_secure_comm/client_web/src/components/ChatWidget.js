import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import socketService from '../services/socket';

const ChatContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
  z-index: 1000;
`;

const ChatHeader = styled.div`
  background: #007bff;
  color: white;
  padding: 15px;
  border-radius: 10px 10px 0 0;
  font-weight: bold;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Message = styled.div`
  max-width: 80%;
  padding: 10px 15px;
  border-radius: 18px;
  word-wrap: break-word;
  
  ${props => props.isOwn ? `
    background: #007bff;
    color: white;
    align-self: flex-end;
  ` : `
    background: #f1f1f1;
    color: #333;
    align-self: flex-start;
  `}
`;

const TypingIndicator = styled.div`
  color: #666;
  font-style: italic;
  font-size: 0.9em;
  padding: 5px 15px;
`;

const InputContainer = styled.div`
  padding: 15px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 10px;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 20px;
  outline: none;
  
  &:focus {
    border-color: #007bff;
  }
`;

const SendButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  
  &:hover {
    background: #0056b3;
  }
`;

const ConnectionStatus = styled.div`
  padding: 5px 15px;
  font-size: 0.8em;
  color: ${props => props.connected ? '#28a745' : '#dc3545'};
  background: ${props => props.connected ? '#d4edda' : '#f8d7da'};
  border-radius: 3px;
  margin: 5px 15px;
`;

const ChatWidget = ({ organizationId, sessionId, userId }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    // Connect to Socket.IO via HTTPS
    const newSocket = socketService.connect(organizationId, sessionId, userId);
    setSocket(newSocket);

    // Join organization and session
    newSocket.emit('join_organization', {
      organization_id: organizationId,
      session_id: sessionId,
      user_type: 'client',
      user_id: userId
    });

    // Listen for connection status
    newSocket.on('connect', () => {
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    // Listen for messages
    newSocket.on('new_message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    // Listen for typing indicators
    newSocket.on('typing_start', (data) => {
      if (data.user_id !== userId) {
        setTypingUsers(prev => [...prev.filter(u => u.id !== data.user_id), {
          id: data.user_id,
          type: data.user_type
        }]);
      }
    });

    newSocket.on('typing_stop', (data) => {
      setTypingUsers(prev => prev.filter(u => u.id !== data.user_id));
    });

    // Listen for agent assignment
    newSocket.on('agent_assigned', (data) => {
      console.log('Agent assigned:', data);
    });

    return () => {
      socketService.disconnect();
    };
  }, [organizationId, sessionId, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleTyping = () => {
    if (!isTyping && socket) {
      setIsTyping(true);
      socket.emit('typing_start', {
        organization_id: organizationId,
        session_id: sessionId,
        user_id: userId,
        user_type: 'client'
      });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      if (socket) {
        socket.emit('typing_stop', {
          organization_id: organizationId,
          session_id: sessionId,
          user_id: userId,
          user_type: 'client'
        });
      }
    }, 1000);
  };

  const sendMessage = () => {
    if (newMessage.trim() && socket && isConnected) {
      socket.emit('send_message', {
        organization_id: organizationId,
        session_id: sessionId,
        sender_id: userId,
        sender_type: 'client',
        content: newMessage.trim()
      });
      setNewMessage('');
      
      setIsTyping(false);
      socket.emit('typing_stop', {
        organization_id: organizationId,
        session_id: sessionId,
        user_id: userId,
        user_type: 'client'
      });
    }
  };

  return (
    <ChatContainer>
      <ChatHeader>
        Customer Support
      </ChatHeader>
      
      <ConnectionStatus connected={isConnected}>
        {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
      </ConnectionStatus>
      
      <MessagesContainer>
        {messages.map((message, index) => (
          <Message 
            key={index} 
            isOwn={message.sender_id === userId}
          >
            {message.content}
          </Message>
        ))}
        
        {typingUsers.length > 0 && (
          <TypingIndicator>
            {typingUsers.map(user => user.type).join(', ')} is typing...
          </TypingIndicator>
        )}
        
        <div ref={messagesEndRef} />
      </MessagesContainer>
      
      <InputContainer>
        <MessageInput
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            handleTyping();
          }}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
          disabled={!isConnected}
        />
        <SendButton onClick={sendMessage} disabled={!isConnected}>
          ➤
        </SendButton>
      </InputContainer>
    </ChatContainer>
  );
};

export default ChatWidget; 