import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";

const SearchUsers = ({ userId }) => {
    const [query, setQuery] = useState("");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const searchUsers = async () => {
        if (!query) return;
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/v1/user/search?query=${query}`);
            setUsers(res.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const addContact = async (contactId) => {
        try {
            await axios.post(`http://localhost:5000/api/v1/user/add-contact`, { contactId },{withCredentials:true});
            alert("Contact added successfully!");
        } catch (error) {
            console.error("Error adding contact:", error);
            alert("Failed to add contact");
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Find New Users</h2>
            <input
                type="text"
                placeholder="Search by name or email..."
                className="w-full px-3 py-2 border rounded mb-3"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button 
                onClick={searchUsers} 
                className="w-full bg-blue-500 text-white py-2 rounded mb-3"
            >
                Search
            </button>

            {loading ? <p>Loading...</p> : (
                <ul>
                    {users.length > 0 ? users.map((user) => (
                        <li key={user._id} className="flex items-center justify-between p-2 border-b">
                            <div className="flex items-center gap-4">
                                <img 
                                    src={user.profileImg} 
                                    alt={user.fullName} 
                                    className="w-10 h-10 rounded-full"
                                />
                                <span>{user.fullName}</span>
                            </div>
                            <button 
                                onClick={() => addContact(user._id)} 
                                className="bg-green-500 text-white px-4 py-1 rounded"
                            >
                                Add
                            </button>
                        </li>
                    )) : <p>No users found</p>}
                </ul>
            )}
        </div>
    );
};

export default SearchUsers;
