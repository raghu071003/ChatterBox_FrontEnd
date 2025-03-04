import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hand as RockIcon, FileText as PaperIcon, Scissors } from "lucide-react";
import socket from "../utils/Socket";
import { AuthContext } from "../context/AuthContext";

export default function RPS() {
    const [gameState, setGameState] = useState(null);
    const [move, setMove] = useState("");
    const [result, setResult] = useState(null);
    const [waiting, setWaiting] = useState(true);
    const [selectedMove, setSelectedMove] = useState(null);
    const {user} = useContext(AuthContext)

    useEffect(() => {
        socket.on("game_started", (data) => {
            console.log("✅ Game started received on client:", data);
            setGameState(data);
            setWaiting(false);
        });
    
        socket.on("game_result", (data) => {
            console.log("🏆 Game result received:", data);
            setResult(data);
        });
    
        return () => {
            socket.off("game_started");
            socket.off("game_result");
        };
    }, []);

    const makeMove = (selectedMove) => {
        // Prevent move selection if a move is already selected
        if (move) return;

        if (!gameState) {
            console.error("Game state is not set");
            return;
        }

        const { roomId, player1, player2 } = gameState;

        setMove(selectedMove);
        setSelectedMove(selectedMove);
        socket.emit("make_move", { roomId, player: user._id, move: selectedMove });
    };

    const moveIcons = {
        rock: RockIcon,
        paper: PaperIcon,
        scissors: Scissors
    };

    const getResultColor = () => {
        if (!result) return "text-blue-500";
        if (result.winner === "draw") return "text-yellow-500";
        return result.winner === user._id ? "text-green-500" : "text-red-500";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8 w-full max-w-md"
            >
                <h2 className="text-3xl font-bold text-white text-center mb-6">
                    Rock Paper Scissors
                </h2>

                {waiting ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-white"
                    >
                        <div className="animate-pulse">Waiting for opponent...</div>
                    </motion.div>
                ) : result ? (
                    <AnimatePresence>
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center"
                        >
                            <div className="flex justify-between mb-4">
                                <motion.div 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="flex flex-col items-center"
                                >
                                    {React.createElement(moveIcons[result.moves?.[gameState?.player1] || 'rock'], {
                                        size: 64, 
                                        className: "text-blue-400 mb-2"
                                    })}
                                    <p className="text-white">Your Move</p>
                                </motion.div>
                                <motion.div 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="flex flex-col items-center"
                                >
                                    {React.createElement(moveIcons[result.moves?.[gameState?.player2] || 'rock'], {
                                        size: 64, 
                                        className: "text-red-400 mb-2"
                                    })}
                                    <p className="text-white">Opponent Move</p>
                                </motion.div>
                            </div>
                            <h3 className={`text-2xl font-bold ${getResultColor()} mt-4`}>
                                {result.winner === "draw" 
                                    ? "It's a Draw!" 
                                    : result.winner === user._id 
                                        ? "You Win!" 
                                        : "Opponent Wins!"}
                            </h3>
                        </motion.div>
                    </AnimatePresence>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <p className="text-white text-center mb-4">Choose Your Move:</p>
                        <div className="flex justify-between space-x-4">
                            {["rock", "paper", "scissors"].map((option) => {
                                const Icon = moveIcons[option];
                                return (
                                    <motion.button
                                        key={option}
                                        whileHover={!move ? { scale: 1.1 } : {}}
                                        whileTap={!move ? { scale: 0.9 } : {}}
                                        onClick={() => makeMove(option)}
                                        disabled={!!move}
                                        className={`flex flex-col items-center p-4 rounded-xl 
                                            ${selectedMove === option 
                                                ? 'bg-blue-600/50 border-2 border-blue-400' 
                                                : 'bg-white/10 hover:bg-white/20'} 
                                            ${move ? 'cursor-not-allowed opacity-50' : ''}
                                            transition-all duration-300 ease-in-out`}
                                    >
                                        <Icon 
                                            size={64} 
                                            className={`mb-2 ${
                                                selectedMove === option 
                                                    ? 'text-blue-300' 
                                                    : 'text-white/70 hover:text-white'
                                            } ${move ? 'opacity-50' : ''}`} 
                                        />
                                        <span className="text-white capitalize">{option}</span>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}