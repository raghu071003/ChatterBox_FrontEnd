import React, { useContext, useEffect, useState } from 'react';
import socket from '../utils/Socket';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const GameRequests = ({ onClose, pendingRequests }) => {
  const { user } = useContext(AuthContext); // ✅ Get user from context
  const navigate = useNavigate();

  const handleAccept = async (roomId) => {
    if (!user) {
      console.error("User is not authenticated");
      return;
    }

    const player2 = user._id; // ✅ Access user ID correctly

    if (!roomId || !player2) {
      console.error("Missing roomId or player2");
      return;
    }

    console.log(`Accepting invite: roomId=${roomId}, player2=${player2}`);
    socket.emit("accept_invite", { roomId, player2 });
    navigate("/play/rps")
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-opacity-30 backdrop-blur-sm z-50">
      <h2 className="text-xl font-bold">Game Requests</h2>
      {pendingRequests.length === 0 ? (
        <p>No pending game requests</p>
      ) : (
        <ul>
          {pendingRequests.map((request, index) => (
            <li key={index} className="p-2 border-b border-gray-600">
              <p>Game: {request.gameType}</p>
              <p>From: {request.player1}</p>
              <button
                onClick={() => handleAccept(request.roomId)}
                className="mt-2 bg-green-500 px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Accept
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={onClose}
        className="mt-4 bg-red-500 px-4 py-2 rounded-lg hover:bg-red-700"
      >
        Close
      </button>
    </div>
  );
};

export default GameRequests;
