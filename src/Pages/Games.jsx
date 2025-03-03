import React, { useState } from 'react';
import socket from '../utils/Socket';
import ContactsOverlay from '../Components/contactsOverlay';
const Games = () => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [toggleContacts,settoggleContacts] = useState(false);
  const [opponent,selectedOpponent] = useState(null);
  const games = [
    {
      id: 1,
      title: "Tic-Tac-Toe",
      players: "2 Players",
      difficulty: "Easy",
      time: "5 min",
      description: "Classic game of X's and O's. Be the first to get three in a row to win!",
      image: "https://gamespaa.com/wp-content/uploads/2023/06/tic-tac-toe.jpg"
    },
    {
      id: 2,
      title: "Rock Paper Scissors",
      players: "2 Players",
      difficulty: "Easy",
      time: "2min",
      description: "Easiest Game involving hand Signs!",
      image: "https://static.vecteezy.com/system/resources/previews/010/307/906/original/hands-playing-rock-paper-scissors-game-flat-design-style-illustration-vector.jpg"
    },
  ];
  const handleSelectOpponent = (opponent) => {
    setSelectedOpponent(opponent);
    settoggleContacts(false);
    // Emit event via socket (if applicable)
    socket.emit("game-invite", { opponent, game: game.title });
  };

  const GameDetails = ({ game }) => {
    const handleClick = ()=>{
        settoggleContacts(true);
    }
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg max-w-3xl mx-auto">
        {toggleContacts && <ContactsOverlay onClose={() => settoggleContacts(false)} onSelect={handleSelectOpponent} />}
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-3xl font-bold text-gray-800">{game.title}</h2>
          <button 
            onClick={() => setSelectedGame(null)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back to Games
          </button>
        </div>
        
        <img 
          src={game.image} 
          alt={game.title} 
          className="w-full h-64 object-cover rounded-lg mb-6" 
        />
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-100 p-4 rounded">
            <p className="text-sm text-gray-500">Players</p>
            <p className="font-semibold">{game.players}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded">
            <p className="text-sm text-gray-500">Difficulty</p>
            <p className="font-semibold">{game.difficulty}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded">
            <p className="text-sm text-gray-500">Average Time</p>
            <p className="font-semibold">{game.time}</p>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Description</h3>
          <p className="text-gray-700">{game.description}</p>
        </div>
        
        <button 
          className="w-full py-3 bg-green-500 text-white font-bold rounded hover:bg-green-600"
        onClick={handleClick}>
          Start Game
        </button>
      </div>
    );
  };

  const GameCard = ({ game }) => {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <img 
          src={game.image} 
          alt={game.title} 
          className="w-full h-40 object-cover" 
        />
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2">{game.title}</h3>
          <div className="flex justify-between text-sm text-gray-600 mb-3">
            <span>{game.players}</span>
            <span>{game.difficulty}</span>
          </div>
          <p className="text-gray-700 mb-4 text-sm line-clamp-2">{game.description}</p>
          <button 
            onClick={() => setSelectedGame(game)}
            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
          >
            Play Now
          </button>
        </div>
      </div>
    );
  };

  return (

    <div className="min-h-screen bg-gray-100 p-6">
      {selectedGame ? (
        <GameDetails game={selectedGame} />
      ) : (
        <div>
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Multiplayer Games</h1>
            <p className="text-xl text-gray-600">Choose a game to play with friends</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {games.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Games;