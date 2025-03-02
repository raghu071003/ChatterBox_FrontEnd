import React, { useState, useEffect, useRef, useContext } from 'react';
import socket from '../utils/Socket';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
const Message = ({activeChat }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const {user} = useContext(AuthContext)
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };  
  const userId = user._id;

  // Fetch previous messages when component mounts or activeChat changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeChat) return;
      
      setLoading(true);
      try {
        // Assuming you have an API endpoint to fetch previous messages
        const response = await axios.post(`http://localhost:5000/api/v1/user/messages`, {
          activeChat
        },{withCredentials:true});
        
        if (response.status !== 200) throw new Error('Failed to fetch messages') 
        setMessages(response.data.messages);
        setError(null);
      } catch (err) {
        if(err.response.data.message === "Chat not found"){
          setMessages([]);
        }else{
          console.error('Error fetching messages:', err);
        setError('Unable to load conversation history.');
        }
        
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    
    // Clean up previous socket listeners to prevent duplicates
    return () => {
      socket.off('receiveMessage');
    };
  }, [activeChat, userId]);

  // Set up socket listener for new messages
  useEffect(() => {
    socket.on('receiveMessage', (data) => {
      if (data.senderId !== userId && data.senderId === activeChat) {
        setMessages(prev => [...prev, { 
          sender: { _id: data.senderId }, 
          text: data.message, 
          isMe: false,
          createdAt: new Date().toISOString()
        }]);
      }
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [activeChat, userId]);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !activeChat) return;

    const newMessage = {
      sender: { _id: userId },
      text: message,
      isMe: true,
      createdAt: new Date().toISOString()
    };

    socket.emit("sendMessage", {
      senderId: userId,
      receiverId: activeChat,
      message: message.trim(),
    });
    
    setMessages(prev => [...prev, newMessage]);
    setMessage('');
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Chat Header */}
      {activeChat ? (
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 rounded-t-lg">
          <h2 className="font-medium text-gray-800">Chat</h2>
        </div>
      ) : (
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 rounded-t-lg">
          <h2 className="font-medium text-gray-800">Select a contact to start chatting</h2>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">{error}</div>
        ) : !activeChat ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a contact to start a conversation
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No messages yet. Send a message to start the conversation!
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex ${msg.sender._id === userId ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
                    msg.sender._id === userId 
                      ? 'bg-blue-500 text-white rounded-br-none' 
                      : 'bg-gray-200 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                  <p className={`text-xs ${msg.isMe ? 'text-blue-100' : 'text-gray-500'} mt-1 text-right`}>
                    {formatTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      {activeChat && (
        <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200">
          <div className="flex items-center">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!activeChat}
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-md transition-colors"
              disabled={!message.trim() || !activeChat}
            >
              Send
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Message;