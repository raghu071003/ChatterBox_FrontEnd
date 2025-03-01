import React, { useState, useEffect, useContext } from 'react';
import { Send } from 'lucide-react';
import socket from '../utils/Socket';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const HomePage = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);
  const [userId, setUserId] = useState(null);
  const { user } = useContext(AuthContext);
  
  useEffect(() => {
    const getChats = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/v1/user/getChats", {
          withCredentials: true,
        });
        setChats(response.data.chats);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };
    getChats();
  }, []);

  useEffect(() => {
    if (user?.email) {
      setUserId(user._id);
    }
  }, [user]);

  useEffect(() => {
    if (userId) {
      socket.emit("join", userId);
    }

    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, { sender: { _id: userId }, text: message, isMe: true }]);

    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [userId]);

  // Fetch messages when chat changes
  useEffect(() => {
    if (activeChat) {
      const fetchMessages = async () => {
        try {
          const response = await axios.post(`http://localhost:5000/api/v1/user/messages`,{activeChat},{withCredentials:true});
          // console.log(response);
          
          setMessages(response.data.messages);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };
      fetchMessages();
    } else {
      setMessages([]);
    }
  }, [activeChat]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    socket.emit("sendMessage", {
      senderId: userId,
      receiverId: activeChat,
      message,
    });

    setMessages((prev) => [...prev, { sender: { _id: userId }, text: message, isMe: true }]);

    setMessage('');
  };

  const activeChatData = chats.find(chat => chat.members.some(member => member._id === activeChat));

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-xl font-bold text-indigo-600">ChatterBox</h1>
        </div>

        {/* Chat List */}
        <div className="overflow-y-auto flex-1">
          {chats.map(chat => {
            const otherMember = chat.members.find(member => member._id !== userId);
            return (
              <div
                key={chat._id}
                className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 ${activeChat === otherMember._id ? 'bg-indigo-50' : ''}`}
                onClick={() => setActiveChat(otherMember._id)}
              >
                <img src={otherMember.profileImg} alt={otherMember.fullName} className="w-12 h-12 rounded-full" />
                <div className="ml-4 flex-1">
                  <h2 className="font-semibold text-gray-800">{otherMember.fullName}</h2>
                  <p className="text-xs text-gray-500">Online</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Window */}
      {activeChatData && (
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-white flex items-center">
            <img src={activeChatData.members.find(m => m._id === activeChat)?.profileImg} alt="User Avatar" className="w-10 h-10 rounded-full" />
            <div className="ml-3">
              <h2 className="font-semibold text-gray-800">{activeChatData.members.find(m => m._id === activeChat)?.fullName}</h2>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender._id === userId ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md rounded-lg p-3 ${msg.sender._id === userId ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200'}`}>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button 
                type="submit" 
                className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 focus:outline-none"
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
