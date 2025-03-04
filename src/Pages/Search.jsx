import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, UserPlus, LoaderCircle, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SearchUsers = ({ userId }) => {
    const [query, setQuery] = useState("");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [addedContacts, setAddedContacts] = useState([]);

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
            await axios.post(`http://localhost:5000/api/v1/user/add-contact`, { contactId }, { withCredentials: true });
            setAddedContacts([...addedContacts, contactId]);
            setTimeout(() => {
                setAddedContacts(addedContacts.filter(id => id !== contactId));
            }, 2000);
        } catch (error) {
            console.error("Error adding contact:", error);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            searchUsers();
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-gradient-to-br from-indigo-50 to-white shadow-2xl rounded-2xl">
            <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">
                Find New Connections
            </h2>
            
            <div className="relative mb-4">
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    className="
                        w-full px-4 py-3 pl-10 border-2 border-indigo-200 
                        rounded-full focus:outline-none focus:ring-2 
                        focus:ring-indigo-500 transition duration-300
                    "
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <Search 
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" 
                    size={20} 
                />
            </div>
            
            <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={searchUsers} 
                className="
                    w-full bg-indigo-600 text-white py-3 rounded-full 
                    flex items-center justify-center space-x-2 
                    hover:bg-indigo-700 transition duration-300
                "
                disabled={loading}
            >
                {loading ? (
                    <LoaderCircle className="animate-spin" size={20} />
                ) : (
                    <>
                        <Search size={20} />
                        <span>Search</span>
                    </>
                )}
            </motion.button>

            <AnimatePresence>
                {users.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mt-6 space-y-4"
                    >
                        <h3 className="text-lg font-semibold text-indigo-700">
                            Search Results
                        </h3>
                        <ul className="space-y-3">
                            <AnimatePresence>
                                {users.map((user) => (
                                    <motion.li 
                                        key={user._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="
                                            flex items-center justify-between 
                                            p-3 bg-white rounded-xl 
                                            shadow-md hover:shadow-lg 
                                            transition duration-300
                                        "
                                    >
                                        <div className="flex items-center space-x-4">
                                            <img 
                                                src={user.profileImg} 
                                                alt={user.fullName} 
                                                className="
                                                    w-12 h-12 rounded-full 
                                                    object-cover border-2 
                                                    border-indigo-100
                                                "
                                            />
                                            <div>
                                                <p className="font-semibold text-gray-800">
                                                    {user.fullName}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                        <motion.button 
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => addContact(user._id)} 
                                            disabled={addedContacts.includes(user._id)}
                                            className={`
                                                flex items-center space-x-2 
                                                px-4 py-2 rounded-full 
                                                transition duration-300
                                                ${addedContacts.includes(user._id) 
                                                    ? 'bg-green-500 text-white' 
                                                    : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}
                                            `}
                                        >
                                            {addedContacts.includes(user._id) ? (
                                                <>
                                                    <Check size={16} />
                                                    <span>Added</span>
                                                </>
                                            ) : (
                                                <>
                                                    <UserPlus size={16} />
                                                    <span>Add</span>
                                                </>
                                            )}
                                        </motion.button>
                                    </motion.li>
                                ))}
                            </AnimatePresence>
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>

            {!loading && users.length === 0 && query && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-gray-500 mt-6"
                >
                    <p>No users found. Try a different search term.</p>
                </motion.div>
            )}
        </div>
    );
};

export default SearchUsers;