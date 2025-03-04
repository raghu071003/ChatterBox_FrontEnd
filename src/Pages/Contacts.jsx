import { useState, useEffect } from "react";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Search, MessageCircle, X, ChevronLeft, UserPlus, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Message = ({ userId, activeChat }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
    
        socket.emit("sendMessage", {
          senderId: userId,
          receiverId: activeChat,
          newMessage,
        });
    
        setMessages((prev) => [...prev, { sender: { _id: userId }, text: message, isMe: true }]);
        setNewMessage("");
      };

    return (
        <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div 
                        key={msg.id} 
                        className={`flex ${msg.sender === 'self' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div 
                            className={`max-w-[70%] px-4 py-2 rounded-2xl ${msg.sender === 'self' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSendMessage} className="border-t p-4 flex items-center gap-2">
                <input 
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition">
                    <Send size={20} />
                </button>
            </form>
        </div>
    );
};

const ContactsList = ({ userId }) => {
    const [contacts, setContacts] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showChat, setShowChat] = useState(false);
    const [activeChat, setActiveChat] = useState(null);
    const [activeChatName, setActiveChatName] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        const fetchContacts = async () => {
            try {
                setLoading(true);
                const res = await axios.get("http://localhost:5000/api/v1/user/getContacts", { withCredentials: true });
                setContacts(res.data.contacts);
                setError(null);
            } catch (error) {
                console.error("Error fetching contacts:", error);
                setError("Failed to load contacts. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchContacts();
    }, [userId]);

    const filteredContacts = contacts.filter(contact => 
        contact.fullName.toLowerCase().includes(search.toLowerCase())
    );

    const handleMessageClick = (contactId, contactName) => {
        navigate(`/message/${contactId}`)
    };

    const closeChat = () => {
        setShowChat(false);
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 md:p-8">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
                <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} className={`${showChat ? 'hidden md:block md:w-1/3' : 'w-full'} bg-white rounded-2xl shadow-xl overflow-hidden`}>
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-5">
                        <h2 className="text-2xl font-bold text-white">Contact Directory</h2>
                    </div>
                    <div className="p-6">
                        <div className="relative mb-6">
                            <input type="text" placeholder="Search contacts..." className="w-full px-4 py-3 pl-10 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300" value={search} onChange={(e) => setSearch(e.target.value)} />
                            <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
                        </div>
                        {loading ? <div>Loading...</div> : error ? <div>{error}</div> : filteredContacts.map((contact) => (
                            <div key={contact._id} className="flex items-center justify-between p-4 border-b">
                                <p>{contact.fullName}</p>
                                <button onClick={()=>handleMessageClick(contact._id, contact.fullName)} className="text-blue-500">Message</button>
                            </div>
                        ))}
                    </div>
                </motion.div>
                <AnimatePresence>
                    {showChat && (
                        <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 50, opacity: 0 }} className="flex-1 bg-white rounded-2xl shadow-xl overflow-hidden h-[600px] flex flex-col">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-white">{activeChatName}</h2>
                                <button className="text-white" onClick={closeChat}><X size={24} /></button>
                            </div>
                            <Message userId={userId} activeChat={activeChat} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default ContactsList;
