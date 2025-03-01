import { useState } from 'react';
import React from 'react';

const AddContact = ({ userId }) => {
    const [query, setQuery] = useState('');
    const [users, setUsers] = useState([]);

    const searchUsers = async () => {
        const res = await fetch(`/api/users/search?query=${query}`);
        const data = await res.json();
        setUsers(data);
    };

    const addContact = async (contactId) => {
        await fetch('/api/contacts/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, contactId }),
        });
        alert('Contact request sent!');
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Search users..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button onClick={searchUsers}>Search</button>

            <ul>
                {users.map(user => (
                    <li key={user._id}>
                        {user.username} 
                        <button onClick={() => addContact(user._id)}>Add</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AddContact;
