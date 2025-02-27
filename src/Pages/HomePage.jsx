import React, { useState } from 'react';
import { Search, Settings, Edit, Phone, Video, MoreVertical, Send, Paperclip, Smile } from 'lucide-react';

const HomePage = () => {
  const [activeChat, setActiveChat] = useState(1);
  const [message, setMessage] = useState('');

  const chats = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "/api/placeholder/40/40",
      lastMessage: "I'll send you the files soon!",
      time: "12:45 PM",
      unread: 2,
      online: true
    },
    {
      id: 2,
      name: "Alex Morgan",
      avatar: "/api/placeholder/40/40",
      lastMessage: "The meeting is scheduled for tomorrow at 10.",
      time: "11:20 AM",
      unread: 0,
      online: true
    },
    {
      id: 3,
      name: "Design Team",
      avatar: "/api/placeholder/40/40",
      lastMessage: "James: I updated the mockups",
      time: "Yesterday",
      unread: 5,
      online: false,
      isGroup: true
    },
    {
      id: 4,
      name: "Michael Chen",
      avatar: "/api/placeholder/40/40",
      lastMessage: "How's the project coming along?",
      time: "Yesterday",
      unread: 0,
      online: false
    },
    {
      id: 5,
      name: "Emily Wilson",
      avatar: "/api/placeholder/40/40",
      lastMessage: "Thanks for your help!",
      time: "Monday",
      unread: 0,
      online: false
    }
  ];
  
  const messages = [
    {
      id: 1,
      sender: "Sarah Johnson",
      content: "Hey there! How's the new design coming along?",
      time: "12:30 PM",
      isMe: false
    },
    {
      id: 2,
      content: "It's going well! I've finished the main dashboard layout.",
      time: "12:35 PM",
      isMe: true
    },
    {
      id: 3,
      sender: "Sarah Johnson",
      content: "That sounds great! Would you be able to share a preview?",
      time: "12:38 PM",
      isMe: false
    },
    {
      id: 4,
      content: "Sure! I'll package everything up and send it over. Just need to add some finishing touches to the responsive views.",
      time: "12:42 PM",
      isMe: true
    },
    {
      id: 5,
      sender: "Sarah Johnson",
      content: "Perfect! I'll send you the files soon!",
      time: "12:45 PM",
      isMe: false
    }
  ];
  

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() === '') return;
    // Here you would typically send the message to your backend
    console.log('Sending message:', message);
    setMessage('');
  };

  const activeChatData = chats.find(chat => chat.id === activeChat);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-xl font-bold text-indigo-600">ChatterBox</h1>
          <div className="flex space-x-2">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Settings size={20} className="text-gray-600" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Edit size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations"
              className="w-full p-2 pl-10 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search size={18} className="absolute left-3 top-3 text-gray-500" />
          </div>
        </div>

        {/* Chats List */}
        <div className="overflow-y-auto flex-1">
          {chats.map(chat => (
            <div
              key={chat.id}
              className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 ${activeChat === chat.id ? 'bg-indigo-50' : ''}`}
              onClick={() => setActiveChat(chat.id)}
            >
              <div className="relative">
                <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full" />
                {chat.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                )}
              </div>
              <div className="ml-4 flex-1 border-b border-gray-100 pb-4">
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold text-gray-800">{chat.name}</h2>
                  <span className="text-xs text-gray-500">{chat.time}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm text-gray-600 truncate w-40">{chat.lastMessage}</p>
                  {chat.unread > 0 && (
                    <span className="bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {activeChatData && (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
            <div className="flex items-center">
              <img src={activeChatData.avatar} alt={activeChatData.name} className="w-10 h-10 rounded-full" />
              <div className="ml-3">
                <h2 className="font-semibold text-gray-800">{activeChatData.name}</h2>
                <p className="text-xs text-gray-500">{activeChatData.online ? 'Online' : 'Offline'}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Phone size={20} className="text-gray-600" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Video size={20} className="text-gray-600" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <MoreVertical size={20} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            <div className="space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md rounded-lg p-3 ${msg.isMe ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200'}`}>
                    {!msg.isMe && <p className="text-xs text-indigo-600 font-semibold mb-1">{msg.sender}</p>}
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-xs mt-1 text-right ${msg.isMe ? 'text-indigo-200' : 'text-gray-500'}`}>{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
              <button type="button" className="p-2 text-gray-500 hover:text-indigo-600">
                <Paperclip size={20} />
              </button>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button type="button" className="p-2 text-gray-500 hover:text-indigo-600">
                <Smile size={20} />
              </button>
              <button 
                type="submit" 
                className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;