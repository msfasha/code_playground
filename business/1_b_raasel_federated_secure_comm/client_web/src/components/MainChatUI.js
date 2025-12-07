import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE;

const formatTime = (iso) => {
  const date = new Date(iso);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const MainChatUI = ({ user }) => {
  const [search, setSearch] = useState('');
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [newChatName, setNewChatName] = useState('');
  const [newChatLoading, setNewChatLoading] = useState(false);
  const [newChatError, setNewChatError] = useState('');

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE}/sessions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSessions(res.data.sessions || []);
      } catch (err) {
        setError('Failed to load sessions.');
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  useEffect(() => {
    if (!selectedSession) {
      setMessages([]);
      setMessagesError('');
      return;
    }
    const fetchMessages = async () => {
      setMessagesLoading(true);
      setMessagesError('');
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE}/sessions/${selectedSession}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data.messages || []);
      } catch (err) {
        setMessagesError('Failed to load messages.');
      } finally {
        setMessagesLoading(false);
      }
    };
    fetchMessages();
  }, [selectedSession]);

  const filteredSessions = sessions.filter((s) =>
    (s.participant || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  const handleNewChat = async (e) => {
    e.preventDefault();
    setNewChatLoading(true);
    setNewChatError('');
    try {
      const token = localStorage.getItem('token');
      // For demo: create a session with the current user as client, and newChatName as client_name
      const res = await axios.post(
        `${API_BASE}/sessions`,
        {
          organization_id: 1, // You may want to make this dynamic
          client_id: user.id,
          client_name: newChatName,
          client_email: user.email,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newSession = {
        id: res.data.session.session_id,
        participant: newChatName,
        lastMessage: '',
        timestamp: res.data.session.created_at,
      };
      setSessions([newSession, ...sessions]);
      setSelectedSession(newSession.id);
      setShowNewChat(false);
      setNewChatName('');
    } catch (err) {
      setNewChatError('Failed to create new chat.');
    } finally {
      setNewChatLoading(false);
    }
  };

  return (
    <div className="main-chat-ui">
      <div className="sidebar">
        <div className="sidebar-header">
          <button className="new-chat-btn" onClick={() => setShowNewChat((v) => !v)}>
            + New Chat
          </button>
        </div>
        {showNewChat && (
          <form className="new-chat-form" onSubmit={handleNewChat}>
            <input
              type="text"
              placeholder="Recipient name"
              value={newChatName}
              onChange={(e) => setNewChatName(e.target.value)}
              required
              disabled={newChatLoading}
            />
            <button type="submit" disabled={newChatLoading || !newChatName}>
              {newChatLoading ? 'Creating...' : 'Create'}
            </button>
            {newChatError && <div className="new-chat-error">{newChatError}</div>}
          </form>
        )}
        <input
          className="search-bar"
          type="text"
          placeholder="Search chats..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="session-list">
          {loading && <div className="no-sessions">Loading...</div>}
          {error && <div className="no-sessions">{error}</div>}
          {!loading && !error && filteredSessions.length === 0 && (
            <div className="no-sessions">No chats found.</div>
          )}
          {filteredSessions.map((session) => (
            <div
              key={session.id}
              className={`session-item${selectedSession === session.id ? ' selected' : ''}`}
              onClick={() => setSelectedSession(session.id)}
            >
              <div className="session-header">
                <span className="participant">{session.participant}</span>
                <span className="timestamp">{formatTime(session.timestamp)}</span>
              </div>
              <div className="last-message">{session.lastMessage}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="chat-area">
        {selectedSession ? (
          <div className="chat-messages-area">
            <h3>Chat with {filteredSessions.find(s => s.id === selectedSession)?.participant}</h3>
            {messagesLoading && <div>Loading messages...</div>}
            {messagesError && <div style={{color:'#b00020'}}>{messagesError}</div>}
            {!messagesLoading && !messagesError && messages.length === 0 && <div>No messages yet.</div>}
            <div className="messages-list">
              {messages.map((msg, idx) => (
                <div key={idx} className="message-item">
                  <span className="msg-meta">{msg.sender_type}: </span>
                  <span className="msg-content">{msg.content}</span>
                  <span className="msg-time">{formatTime(msg.timestamp)}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="chat-placeholder">
            <p>Select a chat to start messaging.</p>
          </div>
        )}
      </div>
      <style>{`
        .main-chat-ui { display: flex; height: 90vh; background: #f5f6fa; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .sidebar { width: 320px; background: #fff; border-right: 1px solid #e0e0e0; display: flex; flex-direction: column; }
        .sidebar-header { padding: 1rem; border-bottom: 1px solid #f0f0f0; }
        .new-chat-btn { background: #1976d2; color: #fff; border: none; border-radius: 20px; padding: 0.5rem 1.2rem; font-weight: bold; cursor: pointer; font-size: 1em; }
        .new-chat-form { display: flex; flex-direction: column; gap: 0.5rem; padding: 1rem; border-bottom: 1px solid #f0f0f0; }
        .new-chat-form input { padding: 0.5rem; border-radius: 4px; border: 1px solid #ccc; }
        .new-chat-form button { background: #1976d2; color: #fff; border: none; border-radius: 4px; padding: 0.5rem; font-weight: bold; cursor: pointer; }
        .new-chat-error { color: #b00020; font-size: 0.95em; }
        .search-bar { margin: 1rem; margin-top: 0; padding: 0.5rem; border-radius: 20px; border: 1px solid #ccc; width: calc(100% - 2rem); }
        .session-list { flex: 1; overflow-y: auto; }
        .session-item { padding: 1rem; border-bottom: 1px solid #f0f0f0; cursor: pointer; transition: background 0.2s; }
        .session-item.selected, .session-item:hover { background: #e3f0ff; }
        .session-header { display: flex; justify-content: space-between; margin-bottom: 0.3rem; }
        .participant { font-weight: bold; color: #1976d2; }
        .timestamp { font-size: 0.9em; color: #888; }
        .last-message { color: #444; font-size: 0.98em; }
        .no-sessions { padding: 2rem; color: #888; text-align: center; }
        .chat-area { flex: 1; display: flex; align-items: center; justify-content: center; background: #f5f6fa; }
        .chat-messages-area { width: 100%; max-width: 600px; margin: 0 auto; }
        .messages-list { margin-top: 1rem; }
        .message-item { background: #fff; margin-bottom: 0.5rem; padding: 0.5rem 1rem; border-radius: 6px; box-shadow: 0 1px 2px rgba(0,0,0,0.03); display: flex; align-items: center; gap: 0.5rem; }
        .msg-meta { font-weight: bold; color: #1976d2; }
        .msg-content { flex: 1; }
        .msg-time { font-size: 0.85em; color: #888; margin-left: 1rem; }
        .chat-placeholder { text-align: center; color: #888; }
      `}</style>
    </div>
  );
};

export default MainChatUI; 