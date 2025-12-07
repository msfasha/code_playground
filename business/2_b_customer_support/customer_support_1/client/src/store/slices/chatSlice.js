import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const getChats = createAsyncThunk(
  'chat/getChats',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/chats`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getChatMessages = createAsyncThunk(
  'chat/getChatMessages',
  async (chatId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/chats/${chatId}/messages`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const transferChat = createAsyncThunk(
  'chat/transferChat',
  async ({ chatId, newAgentId, reason }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/chats/${chatId}/transfer`,
        { newAgentId, reason },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  chats: [],
  activeChat: null,
  messages: {},
  loading: false,
  error: null
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
    },
    addMessage: (state, action) => {
      const { chatId, message } = action.payload;
      if (!state.messages[chatId]) {
        state.messages[chatId] = [];
      }
      state.messages[chatId].push(message);
    },
    updateChatStatus: (state, action) => {
      const { chatId, status } = action.payload;
      const chat = state.chats.find(c => c.id === chatId);
      if (chat) {
        chat.status = status;
      }
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get Chats
      .addCase(getChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload;
      })
      .addCase(getChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch chats';
      })
      // Get Chat Messages
      .addCase(getChatMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getChatMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages[action.meta.arg] = action.payload;
      })
      .addCase(getChatMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch messages';
      })
      // Transfer Chat
      .addCase(transferChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(transferChat.fulfilled, (state, action) => {
        state.loading = false;
        const chat = state.chats.find(c => c.id === action.payload.id);
        if (chat) {
          Object.assign(chat, action.payload);
        }
      })
      .addCase(transferChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to transfer chat';
      });
  }
});

export const {
  setActiveChat,
  addMessage,
  updateChatStatus,
  clearError
} = chatSlice.actions;

export default chatSlice.reducer; 