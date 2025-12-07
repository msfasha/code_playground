import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { IncidentContext } from '../context/IncidentContext';
import VoiceInput from './VoiceInput';
import { generateAgencyResponse } from '../services/aiService';

const MessageList = ({ incidentId }) => {
  const { selectedIncident, socket } = useContext(IncidentContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = React.useRef(null);

  useEffect(() => {
    if (incidentId) {
      loadMessages();
    }
  }, [incidentId]);

  // Listen for WebSocket message events
  useEffect(() => {
    if (!socket) return;

    const handleMessageCreated = (data) => {
      if (data.incidentId === incidentId) {
        loadMessages();
      }
    };

    socket.on('message_created', handleMessageCreated);

    return () => {
      socket.off('message_created', handleMessageCreated);
    };
  }, [socket, incidentId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/incidents/${incidentId}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async (content, isVoice = false, voiceTranscript = null) => {
    if (!content && !voiceTranscript) return;

    setIsLoading(true);
    try {
      const messageData = {
        content: content || '',
        senderType: 'USER',
        senderName: 'Crisis Management Center',
        isVoiceMessage: isVoice,
        voiceTranscript: voiceTranscript || null
      };

      // Send user message
      await axios.post(`http://localhost:4000/api/incidents/${incidentId}/messages`, messageData);

      // Generate AI agency response
      try {
        await generateAgencyResponse(
          incidentId,
          content || voiceTranscript,
          selectedIncident?.type,
          selectedIncident?.description
        );
      } catch (aiError) {
        console.error('Error generating AI response:', aiError);
      }

      // Reload messages
      await loadMessages();
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceTranscript = (transcript) => {
    sendMessage('', true, transcript);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage(newMessage, false, null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  if (!incidentId) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
        Select an incident to view messages
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ 
        padding: '10px', 
        borderBottom: '1px solid #ddd', 
        backgroundColor: '#f8f9fa',
        fontWeight: 'bold'
      }}>
        Messages
      </div>
      
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '10px',
        backgroundColor: '#fafafa'
      }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
            No messages yet. Start the conversation.
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              style={{
                marginBottom: '15px',
                padding: '10px',
                borderRadius: '8px',
                backgroundColor: message.senderType === 'USER' ? '#e3f2fd' : '#fff3e0',
                borderLeft: `4px solid ${message.senderType === 'USER' ? '#2196f3' : '#ff9800'}`,
                maxWidth: '85%',
                marginLeft: message.senderType === 'USER' ? 'auto' : '0',
                marginRight: message.senderType === 'USER' ? '0' : 'auto'
              }}
            >
              {message.isVoiceMessage && (
                <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px' }}>🎤</span>
                  <span style={{ fontSize: '12px', color: '#666' }}>
                    Voice Message
                  </span>
                </div>
              )}
              
              <div style={{ marginBottom: '5px' }}>
                <strong style={{ fontSize: '12px', color: '#555' }}>
                  {message.senderName}
                  {message.agencyNameAr && ` (${message.agencyNameAr})`}
                </strong>
              </div>
              
              {message.isVoiceMessage && message.voiceTranscript && (
                <div style={{ 
                  marginBottom: '8px', 
                  padding: '8px',
                  backgroundColor: 'rgba(0,0,0,0.05)',
                  borderRadius: '4px',
                  fontStyle: 'italic',
                  fontSize: '14px'
                }}>
                  {message.voiceTranscript}
                </div>
              )}
              
              {message.content && (
                <div style={{ marginBottom: '5px', wordWrap: 'break-word' }}>
                  {message.content}
                </div>
              )}
              
              <div style={{ fontSize: '11px', color: '#999', textAlign: 'right' }}>
                {formatDate(message.createdAt)}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ 
        padding: '15px', 
        borderTop: '1px solid #ddd',
        backgroundColor: '#fff'
      }}>
        <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'center' }}>
          <VoiceInput 
            onTranscript={handleVoiceTranscript}
            onError={(error) => console.error('Voice input error:', error)}
            language="ar-JO"
          />
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            style={{
              flex: 1,
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !newMessage.trim()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1
            }}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessageList;

