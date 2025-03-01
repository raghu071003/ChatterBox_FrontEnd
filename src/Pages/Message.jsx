import React, { useState, useEffect } from "react";
import socket from "../utils/Socket";

const Chat = ({ userId }) => {
  const [receiverId, setReceiverId] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Join the user when component mounts
  useEffect(() => {
    if (userId) {
      console.log("Joining chat with userId:", userId); // Debugging
      socket.emit("join", userId);
    }
  
    socket.on("privateMessage", (data) => {
      setMessages((prev) => [...prev, { senderId: data.senderId, text: data.message }]);
    });
  
    return () => {
      socket.off("privateMessage");
    };
  }, [userId]);
  

  // Send private message
  const sendMessage = () => {
    if (receiverId.trim() && message.trim()) {
      socket.emit("privateMessage", { senderId: userId, receiverId, message });
      setMessages((prev) => [...prev, { senderId: userId, text: message }]);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <h2 className="text-lg font-bold mb-4">Private Chat</h2>
      
      <input
        type="text"
        placeholder="Enter receiver's ID"
        value={receiverId}
        onChange={(e) => setReceiverId(e.target.value)}
        className="p-2 border rounded-md mb-2"
      />

      <div className="w-full max-w-md bg-white p-4 rounded-md shadow-md h-60 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 my-2 rounded-md ${
              msg.senderId === userId ? "bg-blue-500 text-white" : "bg-gray-300"
            }`}
          >
            <strong>{msg.senderId === userId ? "You" : `User ${msg.senderId}`}</strong>: {msg.text}
          </div>
        ))}
      </div>

      <div className="flex w-full max-w-md mt-4">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-2 border rounded-l-md"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-r-md"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
