import React, { useState, useEffect } from "react";
import axios from "axios";

const ContactsOverlay = ({ isOpen, onClose,selectOpponent }) => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;    

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
    }, []);

    const onInviteClick = (contactId, fullName) => {
        selectOpponent(contactId)
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-sm z-50">
            <div className="bg-white w-80 h-[500px] shadow-lg p-4 overflow-y-auto transform transition-transform duration-300 ease-in-out">
                <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-lg font-semibold">Choose a friend to play!  </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        ✕
                    </button>
                </div>

                {loading ? (
                    <p className="text-center text-gray-500 mt-4">Loading contacts...</p>
                ) : error ? (
                    <p className="text-center text-red-500 mt-4">{error}</p>
                ) : (
                    <ul className="mt-4 space-y-2">
                        {contacts.length > 0 ? (
                            contacts.map((contact) => (
                                <li key={contact._id} className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md">
                                    <div className="flex items-center">
                                        <img
                                            src={contact.profileImg || "https://via.placeholder.com/40"}
                                            alt={contact.fullName}
                                            className="w-10 h-10 rounded-full object-cover mr-3"
                                        />
                                        <div>
                                            <p className="text-gray-800 font-medium">{contact.fullName}</p>
                                            <p className="text-sm text-gray-500">{contact.email}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => onInviteClick(contact._id, contact.fullName)}
                                        className="bg-blue-500 text-white px-3 py-1.5 rounded-md text-sm hover:bg-blue-600"
                                    >
                                        Invite!
                                    </button>
                                </li>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center mt-4">No contacts available</p>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ContactsOverlay;
