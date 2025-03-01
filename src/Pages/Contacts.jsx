import { useState, useEffect } from "react";
import React from "react";
import axios from "axios";
import AddContact from "../Components/AddContact";

const ContactsList = ({ userId }) => {
    const [contacts, setContacts] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/v1/user/getContacts",{withCredentials:true});
                setContacts(res.data.contacts);
            } catch (error) {
                console.error("Error fetching contacts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchContacts();
        
    }, [userId]);

    const filteredContacts = contacts

    return (
        <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Your Contacts</h2>
            <input
                type="text"
                placeholder="Search contacts..."
                className="w-full px-3 py-2 border rounded mb-3"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            {loading ? (
                <p className="text-gray-500">Loading contacts...</p>
            ) : filteredContacts.length > 0 ? (
                <ul>
                    {filteredContacts.map((contact) => (
                        <li key={contact._id} className="flex items-center gap-4 p-2 border-b">
                            <img
                                src={contact.profileImg}
                                alt={contact.fullName}
                                className="w-10 h-10 rounded-full"
                            />
                            <span className="text-lg">{contact.fullName}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">No contacts found</p>
            )}
            {/* <AddContact /> */}
        </div>
    );
};

export default ContactsList;
