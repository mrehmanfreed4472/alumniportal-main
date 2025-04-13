'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Users, Plus, ArrowLeft, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Navbar2 from '@/components/header/Navbar2';
import ChatLoading from '@/components/ChatLoading';
import { useRouter } from 'next/navigation';

// Dummy chat data
const dummyChats = [
  {
    _id: '1',
    avatar: 'https://example.com/avatar1.jpg',
    name: 'John Doe',
    lastMessage: 'Hey, how are you?',
    messages: [
      { _id: '1', sender: 'John Doe', message: 'Hey, how are you?', time: '10:00 AM' },
      { _id: '2', sender: 'You', message: "I'm good, thanks!", time: '10:05 AM' },
    ],
    isGroup: false,
    userId: { _id: '1', profileImage: 'https://example.com/avatar1.jpg' },
    lastMessageTime: new Date(),
  },
  {
    _id: '2',
    avatar: 'https://example.com/avatar2.jpg',
    name: 'Jane Smith',
    lastMessage: 'See you tomorrow!',
    messages: [
      { _id: '1', sender: 'Jane Smith', message: 'See you tomorrow!', time: '09:00 AM' },
      { _id: '2', sender: 'You', message: 'Sure, see you then!', time: '09:05 AM' },
    ],
    isGroup: false,
    userId: { _id: '2', profileImage: 'https://example.com/avatar2.jpg' },
    lastMessageTime: new Date(),
  },
];

function ChatView({ chat, onBack }) {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat.messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() !== '') {
      // Add the new message to the chat
      const newMessageObj = {
        _id: String(chat.messages.length + 1),
        sender: 'You',
        message: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      chat.messages.push(newMessageObj);
      setNewMessage('');
    }
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
        <div className="space-y-4">
          {chat.messages.map((message) => (
            <div
              key={message._id}
              className={`flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'} mb-2`}
            >
              <div
                className={`max-w-64 md:max-w-lg p-2 break-words whitespace-normal rounded-lg ${
                  message.sender === 'You' ? 'bg-blue-500 text-white' : 'bg-gray-100'
                }`}
              >
                <p className="break-words whitespace-normal text-base">{message.message}</p>
                <p className="text-xs font-light flex justify-end">{message.time}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
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

export default function WhatsAppClone() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('chats');
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState(dummyChats); // Use dummy data
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleChatClick = (chat) => {
    setSelectedChat(chat);
  };

  const handleBackClick = () => {
    setSelectedChat(null);
  };

  return (
    <div className="relative flex flex-row justify-center mx-auto">
      <Navbar2 />
      <div className="max-w-[2100px] mx-auto flex w-full h-[91%] bg-background border-white border-[1px] fixed bottom-0 overflow-x-clip">
        <div className="w-full md:w-96 flex flex-col border-r">
          {/* Chat list header */}
          <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-primary-foreground">
            <h1 className="text-xl font-bold">Chat</h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Users className="h-5 w-5" />
                  <span className="sr-only">New Group</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white text-black">
                {/* Group creation dialog content */}
              </DialogContent>
            </Dialog>
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
                {chats.map((chat) => (
                  <div
                    key={chat._id}
                    className={`flex items-center space-x-4 p-4 ${
                      selectedChat && selectedChat._id === chat._id ? 'bg-gray-200' : ''
                    } hover:bg-gray-100 cursor-pointer`}
                    onClick={() => handleChatClick(chat)}
                  >
                    <Avatar>
                      <AvatarImage src={chat.userId.profileImage} alt={chat.name} />
                      <AvatarFallback>{chat.name[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                      <h3 className="font-semibold">{chat.name}</h3>
                      <div className="flex justify-between">
                        <p className="text-sm text-muted-foreground">{chat.lastMessage}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(chat.lastMessageTime, { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="groups" className="flex-grow">
              {/* Group list content */}
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