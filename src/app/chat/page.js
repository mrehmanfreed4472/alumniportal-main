'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Users, Plus, ArrowLeft, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Navbar2 from '@/components/header/Navbar2';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/services/checkAuth';
import { useDispatch, useSelector } from 'react-redux';
import { 
  createGroupChat, 
  createPrivateChat, 
  fetchAllUsers, 
  fetchChatToken, 
  fetchMessages, 
  sendMessage
} from '@/features/chat/chatSlice';

// New action to fetch user chats
const fetchUserChats = (userId) => {
  return async (dispatch) => {
    dispatch({ type: 'chat/fetchUserChatsStart' });
    try {
      const response = await fetch(`/api/chat/user-chats/${userId}`);
      const data = await response.json();
      
      if (data.success) {
        dispatch({ 
          type: 'chat/fetchUserChatsSuccess', 
          payload: data.chats 
        });
        return data.chats;
      } else {
        throw new Error(data.message || 'Failed to fetch user chats');
      }
    } catch (error) {
      dispatch({ 
        type: 'chat/fetchUserChatsFailure', 
        payload: error.message 
      });
      return [];
    }
  };
};

// New action to fetch user groups
const fetchUserGroups = (userId) => {
  return async (dispatch) => {
    dispatch({ type: 'chat/fetchUserGroupsStart' });
    try {
      const response = await fetch(`/api/chat/user-groups/${userId}`);
      const data = await response.json();
      
      if (data.success) {
        dispatch({ 
          type: 'chat/fetchUserGroupsSuccess', 
          payload: data.groups 
        });
        return data.groups;
      } else {
        throw new Error(data.message || 'Failed to fetch user groups');
      }
    } catch (error) {
      dispatch({ 
        type: 'chat/fetchUserGroupsFailure', 
        payload: error.message 
      });
      return [];
    }
  };
};

// New action to join public group
const joinPublicGroup = (data) => {
  return async (dispatch) => {
    dispatch({ type: 'chat/joinPublicGroupStart' });
    try {
      const response = await fetch('/api/chat/join-group', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (result.success) {
        dispatch({ 
          type: 'chat/joinPublicGroupSuccess', 
          payload: result 
        });
      } else {
        throw new Error(result.message || 'Failed to join group');
      }
      
      return result;
    } catch (error) {
      dispatch({ 
        type: 'chat/joinPublicGroupFailure', 
        payload: error.message 
      });
      
      return { success: false, error: error.message };
    }
  };
};

function ChatView({ chat, onBack }) {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const { messages: allMessages, loadingMessages } = useSelector((state) => state.chat);
  
  // Get current user from localStorage
  const currentUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : null;

  useEffect(() => {
    if (!isAuthenticated()) {
      console.log("User not authenticated, redirecting to login");
      router.replace("/login");
      return;
    }
    
    // Fetch messages for the current chat
    if (chat?.channelId) {
      dispatch(fetchMessages(chat.channelId));
      console.log("Fetching messages for channel:", chat.channelId);
    }

    // Set up a polling mechanism to fetch messages every 3 seconds
    const messageInterval = setInterval(() => {
      if (chat?.channelId) {
        dispatch(fetchMessages(chat.channelId));
      }
    }, 3000);

    // Clear interval on cleanup
    return () => clearInterval(messageInterval);
  }, [router, chat, dispatch]);

  // Extract messages for this specific chat - improved to handle all possible message formats
  const getMessagesForChannel = () => {
    if (!allMessages) return [];
    
    // Check if messages are in the nested structure from your console output
    if (allMessages[chat?.channelId]?.messages && Array.isArray(allMessages[chat?.channelId].messages)) {
      return allMessages[chat?.channelId].messages;
    }
    
    // Check if message object is nested one level deeper
    if (allMessages[chat?.channelId]?.[0]?.message?.message) {
      return [allMessages[chat?.channelId][0].message.message];
    }
    
    // Check if messages are in the data property
    if (allMessages.data && Array.isArray(allMessages.data)) {
      return allMessages.data;
    }
    
    // If we have a single message object
    if (allMessages.message) {
      return [allMessages.message];
    }
    
    // If the allMessages is an array itself
    if (Array.isArray(allMessages)) {
      return allMessages;
    }
    
    return [];
  };

  const displayMessages = getMessagesForChannel();

  // Log messages when they change for debugging
  useEffect(() => {
    if (chat?.channelId && allMessages) {
      console.log("Messages for channel:", chat.channelId, allMessages);
    }
  }, [allMessages, chat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [displayMessages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() !== '') {
      // Send message using the API
      dispatch(sendMessage({
        userId: currentUser?._id,
        channelId: chat.channelId,
        text: newMessage
      }));
      
      // Optimistically add message to UI
      const optimisticMessage = {
        _id: `temp-${Date.now()}`,
        text: newMessage,
        userId: currentUser?._id,
        sender: 'You',
        createdAt: new Date().toISOString()
      };
      
      // Update lastMessage for the chat
      if (chat && currentUser) {
        dispatch({
          type: 'chat/updateLastMessage',
          payload: {
            channelId: chat.channelId,
            lastMessage: newMessage,
            lastMessageTime: new Date().toISOString()
          }
        });
      }
      
      setNewMessage('');
    }
  };

  // Format message for display
  const formatMessage = (message) => {
    // Check if message is nested in a 'message' property
    if (message.message && typeof message.message === 'object') {
      return message.message;
    }
    
    // Check if text is in 'text' or 'message' property
    const messageText = message.text || message.message || '';
    
    return {
      ...message,
      text: messageText
    };
  };

  return (
    <div className="flex flex-col h-full pt-16 sm:pt-0">
      <div className="flex items-center space-x-4 px-4 py-[14px] bg-gradient-to-r from-blue-600 to-indigo-600 text-primary-foreground">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <Avatar>
          <AvatarImage src={chat?.avatar} alt={chat.name} />
          <AvatarFallback className="text-black">{chat.name[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-semibold">{chat.name}</h2>
        </div>
      </div>
      <ScrollArea className="flex-grow p-4">
        {loadingMessages ? (
          <div className="flex justify-center items-center h-full">
            <p>Loading...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayMessages && displayMessages.length > 0 ? (
              displayMessages.map((rawMessage, index) => {
                // Format the message
                const message = formatMessage(rawMessage);
                
                return (
                  <div
                    key={message._id || `msg-${index}`}
                    className={`flex ${
                      message.userId === currentUser?._id || message.sender === 'You' || message.sender === currentUser?._id
                        ? 'justify-end' 
                        : 'justify-start'
                    } mb-2`}
                  >
                    <div
                      className={`max-w-64 md:max-w-lg p-2 break-words whitespace-normal rounded-lg ${
                        message.userId === currentUser?._id || message.sender === 'You' || message.sender === currentUser?._id
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-100'
                      }`}
                    >
                      <p className="break-words whitespace-normal text-base">{message.text || message.message}</p>
                      <p className="text-xs font-light flex justify-end">
                        {message.createdAt || message.timestamp
                          ? new Date(message.createdAt || message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : message.time || 'now'}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex justify-center items-center h-40">
                <p className="text-muted-foreground">No messages yet</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>
      <div className="p-4 border-t md:mb-0 mb-12">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input
            className="flex-grow"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}

function UserList({ onSelectUser }) {
  const dispatch = useDispatch();
  const { users, loadingUsers } = useSelector(state => state.chat);
  const [searchTerm, setSearchTerm] = useState('');
  const hasFetched = useRef(false); // Add ref to track if fetch happened

  useEffect(() => {
    if (!hasFetched.current) { // Only fetch once
      dispatch(fetchAllUsers());
      hasFetched.current = true;
    }
  }, [dispatch]);

  // Handle different user object structures
  const filteredUsers = users && Array.isArray(users) ? users.filter(user => {
    const userName = user.name || (user.id && user.id.name) || '';
    return userName.toLowerCase().includes(searchTerm.toLowerCase());
  }) : [];

  return (
    <div className="p-4">
      <DialogHeader>
        <DialogTitle>Select User</DialogTitle>
      </DialogHeader>
      <div className="relative my-4">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search users..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <ScrollArea className="h-[300px]">
        {loadingUsers ? (
          <div className="flex justify-center p-4">
            <p>Loading...</p>
          </div>
        ) : filteredUsers.length > 0 ? (
          filteredUsers?.map(user => {
            // Handle different user object structures
            const userId = user._id || (user.id && user.id._id) || '';
            const userName = user.name || (user.id && user.id.name) || 'Unknown';
            const userBatch = user.batch || (user.id && user.id.batch) || '';
            const userCompany = user.companyName || (user.id && user.id.companyName) || '';
            
            return (
              <div
                key={userId}
                className="flex items-center space-x-4 p-4 hover:bg-gray-100 cursor-pointer"
                onClick={() => onSelectUser(user)}
              >
                <Avatar>
                  <AvatarFallback>{userName[0]?.toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{userName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {userBatch} {userCompany ? `• ${userCompany}` : ''}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex justify-center items-center h-40">
            <p className="text-muted-foreground">No users found</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

function CreateGroupDialog({ open, onOpenChange }) {
  const [groupName, setGroupName] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();
  
  // Get current user from localStorage
  const currentUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : null;
  
  const handleCreateGroup = () => {
    if (groupName.trim()) {
      dispatch(createGroupChat({ 
        creatorId: currentUser?._id, 
        groupName 
      })).then((result) => {
        // Check if group was created successfully and refresh groups list
        if (result.payload?.data) {
          // Force refresh of groups list
          if (currentUser?._id) {
            dispatch(fetchUserGroups(currentUser._id));
          }
        }
      });
      setGroupName('');
      onOpenChange(false);
    }
  };

  return (
    <DialogContent className="bg-white text-black">
      <DialogHeader>
        <DialogTitle>Create New Group</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 pt-4">
        <Input
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <Button className="w-full" onClick={handleCreateGroup}>
          Create Group
        </Button>
      </div>
    </DialogContent>
  );
}

function JoinGroupDialog({ open, onOpenChange }) {
  const [groupCode, setGroupCode] = useState('');
  const dispatch = useDispatch();
  
  // Get current user from localStorage
  const currentUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : null;
  
  const handleJoinGroup = () => {
    if (groupCode.trim() && currentUser?._id) {
      // Implement your join group logic here
      dispatch(joinPublicGroup({ 
        userId: currentUser._id, 
        groupCode 
      })).then((result) => {
        if (result.payload?.success) {
          // Refresh groups list after joining
          dispatch(fetchUserGroups(currentUser._id));
        }
      });
      setGroupCode('');
      onOpenChange(false);
    }
  };

  return (
    <DialogContent className="bg-white text-black">
      <DialogHeader>
        <DialogTitle>Join Public Group</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 pt-4">
        <Input
          placeholder="Group Code"
          value={groupCode}
          onChange={(e) => setGroupCode(e.target.value)}
        />
        <Button className="w-full" onClick={handleJoinGroup}>
          Join Group
        </Button>
      </div>
    </DialogContent>
  );
}

export default function WhatsAppClone() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('chats');
  const [selectedChat, setSelectedChat] = useState(null);
  const [newChatDialog, setNewChatDialog] = useState(false);
  const [newGroupDialog, setNewGroupDialog] = useState(false);
  const [joinGroupDialog, setJoinGroupDialog] = useState(false);
  
  const dispatch = useDispatch();
  const router = useRouter();
  const { 
    chats, 
    groups, 
    loading, 
    token,
    messages 
  } = useSelector(state => state.chat);
  
  // Get current user from localStorage
  const currentUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : null;

  // For debugging
  useEffect(() => {
    console.log("Current chats:", chats);
    console.log("Current groups:", groups);
  }, [chats, groups]);

  useEffect(() => {
    if (!isAuthenticated()) {
      console.log("User not authenticated, redirecting to login");
      router.replace("/login");
      return;
    }

    // Get Stream chat token for current user
    if (currentUser && currentUser._id) {
      dispatch(fetchChatToken({ userId: currentUser._id }));
      
      // Fetch user chats and groups
      dispatch(fetchUserChats(currentUser._id));
      dispatch(fetchUserGroups(currentUser._id));
      
      console.log("Fetching data for user:", currentUser._id);
    }
    
    // Set up polling for chats and groups every 5 seconds
    const chatInterval = setInterval(() => {
      if (currentUser && currentUser._id) {
        dispatch(fetchUserChats(currentUser._id));
        dispatch(fetchUserGroups(currentUser._id));
      }
    }, 5000);
    
    return () => clearInterval(chatInterval);
  }, [router, dispatch]);

  const handleChatClick = (chat) => {
    setSelectedChat(chat);
    
    // Fetch messages for the selected chat
    if (chat?.channelId) {
      dispatch(fetchMessages(chat.channelId));
    }
  };

  const handleBackClick = () => {
    setSelectedChat(null);
  };

  const handleSelectUser = (user) => {
    // Handle different user object structures
    const userId = user._id || (user.id && user.id._id);
    const userName = user.name || (user.id && user.id.name) || 'Unknown';
    const userAvatar = user.profileImage || (user.id && user.id.profileImage) || '';
    
    if (currentUser && userId && userId !== currentUser._id) {
      // Check if a chat already exists with this user
      const existingChat = chatsList.find(chat => 
        chat.participants && 
        chat.participants.some(participant => participant._id === userId)
      );
      
      if (existingChat) {
        // If chat exists, select it
        setSelectedChat(existingChat);
        setNewChatDialog(false);
      } else {
        // Create new chat if it doesn't exist
        dispatch(createPrivateChat({
          senderId: currentUser._id,
          receiverId: userId
        })).then((result) => {
          if (result.payload?.data) {
            // Create a chat object
            const chatData = {
              channelId: result.payload.data.channelId,
              name: userName,
              _id: userId,
              avatar: userAvatar,
              messages: []
            };
            
            setSelectedChat(chatData);
            setNewChatDialog(false);
            
            // Refresh chats list
            dispatch(fetchUserChats(currentUser._id));
          }
        });
      }
    }
  };

  // Make sure chats and groups are arrays before filtering
  const chatsList = Array.isArray(chats) ? chats : [];
  const groupsList = Array.isArray(groups) ? groups : [];

  // Process chats to ensure they have proper name and avatar
  const processedChats = chatsList.map(chat => {
    // If chat doesn't have a name, try to find it from participants
    let chatName = chat.name;
    let chatAvatar = chat.avatar || chat.profileImage;
    
    if (!chatName && chat.participants && Array.isArray(chat.participants)) {
      const otherParticipant = chat.participants.find(p => p._id !== currentUser?._id);
      if (otherParticipant) {
        chatName = otherParticipant.name;
        chatAvatar = otherParticipant.profileImage;
      }
    }
    
    return {
      ...chat,
      name: chatName || 'Unknown Chat',
      avatar: chatAvatar
    };
  });

  const filteredChats = processedChats.filter(chat => 
    chat?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredGroups = groupsList.filter(group => 
    group?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative flex flex-row justify-center mx-auto">
      <Navbar2 />
      <div className="max-w-[2100px] mx-auto flex w-full h-[91%] bg-background border-white border-[1px] fixed bottom-0 overflow-x-clip">
        <div className="w-full md:w-96 flex flex-col border-r">
          {/* Chat list header */}
          <div className="flex justify-between items-center p-4 bg-gradient-to-r from-[#A51C30] to-[#D43F56] text-primary-foreground">
            <h1 className="text-xl font-bold">Chat</h1>
            <div className="flex space-x-2">
              <Dialog open={newChatDialog} onOpenChange={setNewChatDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Plus className="h-5 w-5" color={'#C03046'} />
                    <span className="sr-only">New Chat</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white">
                  <UserList onSelectUser={handleSelectUser} />
                </DialogContent>
              </Dialog>
              
              <Dialog open={newGroupDialog} onOpenChange={setNewGroupDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Users className="h-5 w-5" color={'#C03046'} />
                    <span className="sr-only">New Group</span>
                  </Button>
                </DialogTrigger>
                <CreateGroupDialog open={newGroupDialog} onOpenChange={setNewGroupDialog} />
              </Dialog>
            </div>
          </div>

          {/* Search input */}
          <div className="p-4 bg-secondary">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search chats..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Chat list */}
          <Tabs defaultValue="chats" className="flex-grow flex flex-col mt-2">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="chats" onClick={() => setActiveTab('chats')}>
                Chats
              </TabsTrigger>
              <TabsTrigger value="groups" onClick={() => setActiveTab('groups')}>
                Groups
              </TabsTrigger>
            </TabsList>
            <TabsContent value="chats" className="flex-grow">
              <ScrollArea className="h-[calc(92vh-200px)] md:pb-10 pb-20">
                {loading ? (
                  <div className="flex justify-center items-center p-4">
                    <p>Loading...</p>
                  </div>
                ) : filteredChats.length > 0 ? (
                  filteredChats?.map((chat) => (
                    <div
                      key={chat._id || chat.channelId}
                      className={`flex items-center space-x-4 p-4 ${
                        selectedChat && (selectedChat._id === chat._id || selectedChat.channelId === chat.channelId) 
                          ? 'bg-gray-200' : ''
                      } hover:bg-gray-100 cursor-pointer`}
                      onClick={() => handleChatClick(chat)}
                    >
                      <Avatar>
                        <AvatarImage src={chat?.profileImage || chat?.avatar} alt={chat?.name} />
                        <AvatarFallback>{chat?.name && chat?.name[0] ? chat?.name[0].toUpperCase() : 'U'}</AvatarFallback>
                      </Avatar>
                      <div className="flex-grow">
                        <h3 className="font-semibold">{chat?.name}</h3>
                        <div className="flex justify-between">
                          <p className="text-sm text-muted-foreground">
                            {chat?.lastMessage?.text || chat?.lastMessage || 'No messages yet'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {chat?.lastMessageTime ? 
                              formatDistanceToNow(new Date(chat?.lastMessageTime), { addSuffix: true }) : 
                              'just now'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex justify-center items-center h-40">
                    <p className="text-muted-foreground">No chats found</p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="groups" className="flex-grow">
              <div className="flex justify-between items-center px-4 py-2">
                <h3 className="font-semibold">Your Groups</h3>
                <Dialog open={joinGroupDialog} onOpenChange={setJoinGroupDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Join Public Group
                    </Button>
                  </DialogTrigger>
                  <JoinGroupDialog open={joinGroupDialog} onOpenChange={setJoinGroupDialog} />
                </Dialog>
              </div>
              <ScrollArea className="h-[calc(92vh-230px)] md:pb-10 pb-20">
                {loading ? (
                  <div className="flex justify-center items-center p-4">
                    <p>Loading...</p>
                  </div>
                ) : filteredGroups.length > 0 ? (
                  filteredGroups?.map((group) => (
                    <div
                      key={group._id || group.channelId}
                      className={`flex items-center space-x-4 p-4 ${
                        selectedChat && (selectedChat._id === group._id || selectedChat.channelId === group.channelId) 
                          ? 'bg-gray-200' : ''
                      } hover:bg-gray-100 cursor-pointer`}
                      onClick={() => handleChatClick(group)}
                    >
                      <Avatar>
                        <AvatarImage src={group.profileImage || group.avatar} alt={group.name} />
                        <AvatarFallback>{group.name && group.name[0] ? group.name[0].toUpperCase() : 'G'}</AvatarFallback>
                      </Avatar>
                      <div className="flex-grow">
                        <h3 className="font-semibold">{group.name}</h3>
                        <div className="flex justify-between">
                          <p className="text-sm text-muted-foreground">
                            {group.lastMessage?.text || group.lastMessage || 'No messages yet'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {group.lastMessageTime ? 
                              formatDistanceToNow(new Date(group.lastMessageTime), { addSuffix: true }) : 
                              'just now'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex justify-center items-center h-40">
                    <p className="text-muted-foreground">No groups found</p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        {/* Chat view */}
        <div className="hidden md:block flex-grow">
          {selectedChat ? (
            <ChatView chat={selectedChat} onBack={handleBackClick} />
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Select a chat to start messaging
            </div>
          )}
        </div>
        {selectedChat && (
          <div className="fixed inset-0 bg-background md:hidden">
            <ChatView chat={selectedChat} onBack={handleBackClick} />
          </div>
        )}
      </div>
    </div>
  );
}