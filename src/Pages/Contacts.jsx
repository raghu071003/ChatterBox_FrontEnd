import { useState, useEffect } from "react";
import React from "react";
import axios from "axios";
import AddContact from "../Components/AddContact";
import Message from "./Message"; // Import the Message component

const ContactsList = ({ userId }) => {
    const [contacts, setContacts] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showChat, setShowChat] = useState(false);
    const [activeChat, setActiveChat] = useState(null);
    const [activeChatName, setActiveChatName] = useState("");

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                setLoading(true);
                const res = await axios.get("http://localhost:5000/api/v1/user/getContacts", {
                    withCredentials: true
                });
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

    // Implement search functionality
    const filteredContacts = contacts.filter(contact => 
        contact.fullName.toLowerCase().includes(search.toLowerCase())
    );

    const handleMessageClick = (contactId, contactName) => {
        setActiveChat(contactId);
        setActiveChatName(contactName);
        setShowChat(true);
    };

    const closeChat = () => {
        setShowChat(false);
    };

    return (
        <div className="flex flex-col md:flex-row gap-4">
            {/* Contacts List */}
            <div className={`${showChat ? 'hidden md:block md:w-1/3' : 'w-full'} bg-white shadow-lg rounded-lg overflow-hidden`}>
                <div className="bg-gray-50 px-6 py-4 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">Contact Directory</h2>
                </div>
                
                <div className="p-6">
                    <div className="relative mb-4">
                        <input
                            type="text"
                            placeholder="Search contacts..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <svg 
                            className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 20 20" 
                            fill="currentColor"
                        >
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 text-red-700 p-3 rounded-md">
                            {error}
                            <button 
                                onClick={() => window.location.reload()} 
                                className="ml-2 text-sm underline"
                            >
                                Retry
                            </button>
                        </div>
                    ) : filteredContacts.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {filteredContacts.map((contact) => (
                                <li key={contact._id} className="py-3 flex items-center justify-between">
                                    <div className="flex items-center">
                                        <img
                                            src={contact.profileImg || "https://via.placeholder.com/40"}
                                            alt={contact.fullName}
                                            className="w-10 h-10 rounded-full object-cover mr-3"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://via.placeholder.com/40";
                                            }}
                                        />
                                        <div>
                                            <p className="text-gray-800 font-medium">{contact.fullName}</p>
                                            {contact.email && (
                                                <p className="text-sm text-gray-500">{contact.email}</p>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleMessageClick(contact._id, contact.fullName)}
                                        className={`text-sm py-1.5 px-3 rounded-md transition-colors ${
                                            activeChat === contact._id && showChat
                                            ? 'bg-blue-700 text-white' 
                                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                                        }`}
                                    >
                                        Message
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500 mb-2">No contacts found</p>
                            <button 
                                className="text-blue-500 hover:text-blue-700"
                                onClick={() => setSearch("")}
                            >
                                Clear search
                            </button>
                        </div>
                    )}
                </div>
                
                {contacts.length === 0 && !loading && !error && (
                    <div className="px-6 pb-6 pt-2 text-center">
                        <button 
                            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors w-full"
                            onClick={() => {/* Implement add contact functionality */}}
                        >
                            Add Your First Contact
                        </button>
                    </div>
                )}
            </div>

            {/* Chat Window */}
            {showChat && (
                <div className="flex-1 bg-white shadow-lg rounded-lg overflow-hidden h-[600px] flex flex-col">
                    <div className="bg-gray-50 px-6 py-3 border-b flex items-center justify-between">
                        <div className="flex items-center">
                            <button 
                                className="md:hidden mr-3 text-gray-500"
                                onClick={closeChat}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <h2 className="text-xl font-semibold text-gray-800">{activeChatName}</h2>
                        </div>
                        <button 
                            className="text-gray-500 hover:text-gray-700"
                            onClick={closeChat}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <Message userId={userId} activeChat={activeChat} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactsList;