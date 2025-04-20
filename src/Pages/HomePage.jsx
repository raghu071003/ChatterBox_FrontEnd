import React, { useState, useEffect, useContext, useRef } from "react";
import { Send, Bell, Loader, ArrowLeft } from "lucide-react";
import socket from "../utils/Socket";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import NotificationAlert from "../Components/Notifications";
import { useParams } from "react-router-dom";
import ShinyText from "../animations/ShinyText";

const HomePage = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState("");
  const [enhancing, setEnhancing] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState({});
  const { user, notifications, setNotifications, showNotifications, setShowNotifications } = useContext(AuthContext);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showNoMoreMessages, setShowNoMoreMessages] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const userId = user?._id;
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const { contactId } = useParams();

  // Check if screen is mobile size
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Track window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // On mobile, hide sidebar when chat is active
      if (mobile && activeChat) {
        setShowSidebar(false);
      } else {
        setShowSidebar(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeChat]);

  // Set initial sidebar state based on screen size and active chat
  useEffect(() => {
    if (isMobile && activeChat) {
      setShowSidebar(false);
    } else {
      setShowSidebar(true);
    }
  }, [isMobile, activeChat]);

  useEffect(() => {
    const getChats = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/v1/user/getChats", { withCredentials: true });
        setChats(response.data.chats);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };
    getChats();
  }, []);

  useEffect(() => {
    if (!userId) return;

    socket.emit("join", userId);

    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, { sender: data.senderId, text: data.message, isMe: false }]);
      setShouldScrollToBottom(true);

      if (data.senderId !== activeChat) {
        setUnreadMessages((prev) => ({
          ...prev,
          [data.senderId]: (prev[data.senderId] || 0) + 1,
        }));
        setNotifications((prev) => [...prev, { message: `New message from ${"User"}` }]);
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [userId, activeChat]);

  useEffect(() => {
    if (!activeChat) {
      setMessages([]);
      return;
    }

    // Reset states when changing chats
    setPage(1);
    setHasMore(true);
    setIsLoading(true);
    setShowNoMoreMessages(false);
    setShouldScrollToBottom(true);

    const fetchMessages = async () => {
      try {
        var response = null;
        if (contactId) {
          console.log(contactId);

          response = await axios.post(
            "http://localhost:5000/api/v1/user/messages",
            { contactId, page: 1, limit: 20 },
            { withCredentials: true }
          );
        } else {
          response = await axios.post(
            "http://localhost:5000/api/v1/user/messages",
            { activeChat, page: 1, limit: 20 },
            { withCredentials: true }
          );
        }

        setMessages(response.data.messages);
        setHasMore(response.data.messages.length === 20);
        setPage(2);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [activeChat]);

  // Function to load more messages
  const handleLoadMoreMessages = async () => {
    // Don't proceed if we're already loading, there are no more messages, or no active chat
    if (isLoading || !hasMore || !activeChat) {
      if (!hasMore) {
        setShowNoMoreMessages(true);
        // Hide the "no more messages" notification after 3 seconds
        setTimeout(() => {
          setShowNoMoreMessages(false);
        }, 3000);
      }
      return;
    }

    setIsLoading(true);

    try {
      // Save scroll height before adding more messages
      const container = messagesContainerRef.current;
      const prevScrollHeight = container ? container.scrollHeight : 0;
      const prevScrollTop = container ? container.scrollTop : 0;

      const response = await axios.post(
        "http://localhost:5000/api/v1/user/messages",
        { activeChat, page, limit: 20 },
        { withCredentials: true }
      );

      if (response.data.messages.length > 0) {
        // Disable auto-scroll to bottom when loading older messages
        setShouldScrollToBottom(false);

        setMessages((prev) => [...response.data.messages, ...prev]); // Append older messages at the top
        setPage((prev) => prev + 1);
        setHasMore(response.data.messages.length === 20);

        // Maintain scroll position after new messages are loaded
        setTimeout(() => {
          if (container) {
            const newScrollHeight = container.scrollHeight;
            const newPosition = prevScrollTop + (newScrollHeight - prevScrollHeight);
            container.scrollTop = newPosition;
          }
        }, 10);
      } else {
        setHasMore(false);
        setShowNoMoreMessages(true);
        // Hide the "no more messages" notification after 3 seconds
        setTimeout(() => {
          setShowNoMoreMessages(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error loading more messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    socket.emit("sendMessage", {
      senderId: userId,
      receiverId: activeChat,
      message,
    });

    setMessages((prev) => [...prev, { sender: { _id: userId }, text: message, isMe: true }]);
    setMessage("");
    setShouldScrollToBottom(true);
  };

  const handleEnhanceMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      setEnhancing(true);
      const response = await axios.post("http://localhost:5000/api/v1/user/genai", { message })
      if (!response.data.newMessage.trim()) {
        return
      }
      setMessage(response.data.newMessage.trim())
      setEnhancing(false);
    } catch (error) {
      console.log(error)
    }
  }

  // Only scroll to bottom for new messages, not when loading old ones
  useEffect(() => {
    if (shouldScrollToBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, shouldScrollToBottom]);

  useEffect(() => {
    const handleScroll = () => {
      const container = messagesContainerRef.current;
      if (!container) return;

      // Check if user is scrolling up or near the bottom
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
      if (isNearBottom) {
        setShouldScrollToBottom(true);
      } else {
        setShouldScrollToBottom(false);
      }

      // Only trigger load more if we're at the top and not currently loading
      if (container.scrollTop === 0 && !isLoading) {
        handleLoadMoreMessages();
      }
    };

    const container = messagesContainerRef.current;
    if (container) container.addEventListener("scroll", handleScroll);

    return () => {
      if (container) container.removeEventListener("scroll", handleScroll);
    };
  }, [activeChat, hasMore, isLoading]);

  const handleBackToChats = () => {
    // Show the sidebar and hide the chat on mobile
    if (isMobile) {
      setShowSidebar(true);
      setActiveChat(null);
    }
  };

  const handleChatClick = (chatId) => {
    setActiveChat(chatId);
    setUnreadMessages((prev) => ({ ...prev, [chatId]: 0 }));
    
    // On mobile, hide the sidebar when a chat is selected
    if (isMobile) {
      setShowSidebar(false);
    }
  };

  const activeChatData = chats.find((chat) => chat.members.some((member) => member._id === activeChat));

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      {showSidebar && (
        <div className={`${isMobile ? 'w-full' : 'w-80'} bg-gray-300 border-r border-gray-200 flex flex-col rounded-2xl`}>
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h1 className="text-xl font-bold text-indigo-600">Your Chats</h1>
            <button className="relative p-2 bg-gray-200 rounded-full hover:bg-gray-300" onClick={() => setShowNotifications(true)}>
              <Bell size={24} className="text-indigo-600" />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {notifications.length}
                </span>
              )}
            </button>
          </div>

          {/* Chat List */}
          <div className="overflow-y-auto flex-1">
            {chats.map((chat) => {
              const otherMember = chat.members.find((member) => member._id !== userId);
              return (
                <div
                  key={chat._id}
                  className={`flex p-4 cursor-pointer rounded-2xl hover:bg-gray-50 ${activeChat === otherMember._id ? "bg-indigo-50" : ""}`}
                  onClick={() => handleChatClick(otherMember._id)}
                >
                  <div className="relative">
                    <img src={otherMember.profileImg} alt={otherMember.fullName} className="w-12 h-12 rounded-full" />
                    {unreadMessages[otherMember._id] > 0 && (
                      <span className="absolute top-0 ml-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
                        {unreadMessages[otherMember._id]}
                      </span>
                    )}
                  </div>
                  <div className="ml-4">
                    <h2 className="font-semibold text-gray-800 text-start">{otherMember.fullName}</h2>
                    <p className="text-xs text-gray-600">{chat.lastMessage?.text || "No messages yet"}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Chat Window */}
      {(activeChatData && (!isMobile || !showSidebar)) ? (
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-white flex items-center">
            {isMobile && (
              <button 
                onClick={handleBackToChats} 
                className="mr-3 p-1 text-indigo-600 hover:bg-gray-100 rounded-full"
              >
                <ArrowLeft size={24} />
              </button>
            )}
            <img src={activeChatData.members.find((m) => m._id === activeChat)?.profileImg} alt="User Avatar" className="w-10 h-10 rounded-full" />
            <div className="ml-3">
              <h2 className="font-semibold text-gray-800">
                {activeChatData.members.find((m) => m._id === activeChat)?.fullName}
              </h2>
            </div>
          </div>

          {/* Messages */}
          <div ref={messagesContainerRef} className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {/* Loading indicator with animation */}
            {isLoading && (
              <div className="text-center py-2 mb-4">
                <div className="inline-block animate-bounce bg-indigo-600 rounded-full h-2 w-2 mr-1"></div>
                <div className="inline-block animate-bounce bg-indigo-600 rounded-full h-2 w-2 mr-1" style={{ animationDelay: "0.2s" }}></div>
                <div className="inline-block animate-bounce bg-indigo-600 rounded-full h-2 w-2" style={{ animationDelay: "0.4s" }}></div>
              </div>
            )}

            {/* No more messages indicator with fade-in/fade-out effect */}
            {showNoMoreMessages && (
              <div className="text-center py-2 mb-4 text-gray-600 font-medium animate-pulse">
                No more messages
              </div>
            )}

            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender._id === userId ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs lg:max-w-md rounded-lg p-3 ${
                      msg.sender._id === userId ? "bg-indigo-600 text-white" : "bg-white border border-gray-200"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
              {/* Empty div to scroll into view */}
              <div ref={messagesEndRef} />
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
                className="flex-1 p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-0 focus:ring-indigo-500"
              />
              <button onClick={handleEnhanceMessage} className="p-2 text-gray-700 rounded-full hover:text-black border hover:cursor-pointer focus:outline-none">
                {enhancing ? <ShinyText text={"Enhancing"} /> : "Enhance"}
              </button>
              <button type="submit" className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 focus:outline-none">
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      ) : (
        !showSidebar ? null : (
          <div className="flex-1 flex items-center justify-center text-gray-600">Click on a chat to start messaging!</div>
        )
      )}

      {/* Notification Alert Popup */}
      {showNotifications && <NotificationAlert notifications={notifications} onClose={() => { setShowNotifications(false); setNotifications([]); }} />}
    </div>
  );
};

export default HomePage;