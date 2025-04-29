import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import client from "@/services/apiClient";
import { createAsyncThunkWrapper } from "@/redux/wrapper/createAsyncThunkWrapper";

const initialState = {
  token: null,
  chats: [],
  groups: [],
  messages: {}, // Mapped by channelId
  users: [], // Will store alumni list
  loading: false,
  loadingMessages: false,
  loadingUsers: false,
  error: null,
}

// Fetch chat token
export const fetchChatToken = createAsyncThunkWrapper(
  "chat/fetchChatToken",
  async (params) => {
    const { userId } = params;
    const response = await client.post(`/chat/token`, { userId });
    const { data, status } = response || {};
    return { data, status };
  }
);

// Create private chat
export const createPrivateChat = createAsyncThunkWrapper(
  "chat/createPrivateChat",
  async (params) => {
    const { senderId, receiverId } = params;
    const response = await client.post(`/chat/private`, { senderId, receiverId });
    const { data, status } = response || {};
    return { data, status };
  }
);

// Create group chat
export const createGroupChat = createAsyncThunkWrapper(
  "chat/createGroupChat",
  async (params) => {
    const { creatorId, groupName } = params;
    const response = await client.post(`/chat/group`, { creatorId, groupName });
    const { data, status } = response || {};
    return { data, status };
  }
);

// Join group chat
export const joinGroupChat = createAsyncThunkWrapper(
  "chat/joinGroupChat",
  async (params) => {
    const { userId, channelId } = params;
    const response = await client.post(`/chat/group/join`, { userId, channelId });
    const { data, status } = response || {};
    return { data, status };
  }
);

// Send message
export const sendMessage = createAsyncThunkWrapper(
  "chat/sendMessage",
  async (params) => {
    const { userId, channelId, text } = params;
    const response = await client.post(`/chat/message`, { userId, channelId, text });
    const { data, status } = response || {};
    return { data: { ...data, channelId }, status };
  }
);

// Fetch messages for a channel
export const fetchMessages = createAsyncThunkWrapper(
  "chat/fetchMessages",
  async (channelId) => {
    const response = await client.get(`/chat/getMessages/${channelId}`);
    const { data, status } = response || {};
    return { data: { messages: data, channelId }, status };
  }
);

// Fetch all users (alumni)
export const fetchAllUsers = createAsyncThunkWrapper(
  "chat/fetchAllUsers",
  async () => {
    const response = await client.get(`/alumni/all`);
    const { data, status } = response || {};
    return { data, status };
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    resetChatState: () => initialState,
  },
  extraReducers: (builder) => {
    // Fetch Chat Token
    builder.addCase(fetchChatToken.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchChatToken.fulfilled, (state, action) => {
      state.loading = false;
      state.token = action.payload.data.token;
    });
    builder.addCase(fetchChatToken.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Failed to fetch chat token";
    });

    // Create Private Chat
    builder.addCase(createPrivateChat.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createPrivateChat.fulfilled, (state, action) => {
      state.loading = false;
      const chat = action.payload.data;
      
      // Check if chat already exists in the state
      const existingChatIndex = state.chats.findIndex(
        c => c.channelId === chat.channelId
      );
      
      if (existingChatIndex >= 0) {
        // Update existing chat
        state.chats[existingChatIndex] = {
          ...state.chats[existingChatIndex],
          ...chat
        };
      } else {
        // Add new chat
        state.chats.push({
          ...chat,
          lastMessage: '',
          lastMessageTime: new Date().toISOString()
        });
      }
    });
    builder.addCase(createPrivateChat.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Failed to create private chat";
    });

    // Create Group Chat
    builder.addCase(createGroupChat.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createGroupChat.fulfilled, (state, action) => {
      state.loading = false;
      const group = action.payload.data;
      
      // Check if group already exists
      const existingGroupIndex = state.groups.findIndex(
        g => g.channelId === group.channelId
      );
      
      if (existingGroupIndex >= 0) {
        // Update existing group
        state.groups[existingGroupIndex] = {
          ...state.groups[existingGroupIndex],
          ...group
        };
      } else {
        // Add new group
        state.groups.push({
          ...group,
          lastMessage: '',
          lastMessageTime: new Date().toISOString()
        });
      }
    });
    builder.addCase(createGroupChat.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Failed to create group chat";
    });

    // Join Group Chat
    builder.addCase(joinGroupChat.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(joinGroupChat.fulfilled, (state, action) => {
      state.loading = false;
      // Update group info if needed
    });
    builder.addCase(joinGroupChat.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Failed to join group chat";
    });

    // Send Message
    builder.addCase(sendMessage.pending, (state) => {
      state.loadingMessages = true;
      state.error = null;
    });
    builder.addCase(sendMessage.fulfilled, (state, action) => {
      state.loadingMessages = false;
      const { channelId } = action.payload.data;
      
      // Add the new message to the messages array for the channel
      if (!state.messages[channelId]) {
        state.messages[channelId] = [];
      }
      
      state.messages[channelId].push(action.payload.data);
      
      // Update last message for chat or group
      const chatIndex = state.chats.findIndex(c => c.channelId === channelId);
      if (chatIndex >= 0) {
        state.chats[chatIndex].lastMessage = action.payload.data.text;
        state.chats[chatIndex].lastMessageTime = new Date().toISOString();
      }
      
      const groupIndex = state.groups.findIndex(g => g.channelId === channelId);
      if (groupIndex >= 0) {
        state.groups[groupIndex].lastMessage = action.payload.data.text;
        state.groups[groupIndex].lastMessageTime = new Date().toISOString();
      }
    });
    builder.addCase(sendMessage.rejected, (state, action) => {
      state.loadingMessages = false;
      state.error = action.payload?.message || "Failed to send message";
    });

    // Fetch Messages
    builder.addCase(fetchMessages.pending, (state) => {
      state.loadingMessages = true;
      state.error = null;
    });
    builder.addCase(fetchMessages.fulfilled, (state, action) => {
      state.loadingMessages = false;
      const { messages, channelId } = action.payload.data;
      
      // Store messages by channelId
      state.messages[channelId] = messages;
      
      // Update last message for chat or group if messages exist
      if (messages && messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        
        const chatIndex = state.chats.findIndex(c => c.channelId === channelId);
        if (chatIndex >= 0) {
          state.chats[chatIndex].lastMessage = lastMessage.text;
          state.chats[chatIndex].lastMessageTime = lastMessage.createdAt;
        }
        
        const groupIndex = state.groups.findIndex(g => g.channelId === channelId);
        if (groupIndex >= 0) {
          state.groups[groupIndex].lastMessage = lastMessage.text;
          state.groups[groupIndex].lastMessageTime = lastMessage.createdAt;
        }
      }
    });
    builder.addCase(fetchMessages.rejected, (state, action) => {
      state.loadingMessages = false;
      state.error = action.payload?.message || "Failed to fetch messages";
    });

    // Fetch All Users (Alumni)
    builder.addCase(fetchAllUsers.pending, (state) => {
      state.loadingUsers = true;
      state.error = null;
    });
    builder.addCase(fetchAllUsers.fulfilled, (state, action) => {
      state.loadingUsers = false;
      // Handle the specific alumni data structure
      state.users = action.payload.data.alumni || [];
    });
    builder.addCase(fetchAllUsers.rejected, (state, action) => {
      state.loadingUsers = false;
      state.error = action.payload?.message || "Failed to fetch users";
    });
  },
});

export const { resetChatState } = chatSlice.actions;
export default chatSlice.reducer;