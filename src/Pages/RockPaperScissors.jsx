import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

export default function RPS({ player1, player2 }) {
    const [gameState, setGameState] = useState(null);
    const [move, setMove] = useState("");
    const [result, setResult] = useState(null);

    useEffect(() => {
        socket.emit("invite_game", { player1, player2 });

        socket.on("game_started", (data) => {
            setGameState(data);
        });

        socket.on("game_result", (data) => {
            setResult(data);
        });

        return () => socket.off();
    }, []);

    const makeMove = (selectedMove) => {
        setMove(selectedMove);
        socket.emit("make_move", { roomId: `${player1}-${player2}`, player: player1, move: selectedMove });
    };

    return (
        <div className="p-4 bg-gray-800 text-white rounded-lg shadow-lg">
            <h2 className="text-xl font-bold">Rock Paper Scissors</h2>
            
            {result ? (
                <div>
                    <p>Your Move: {result.moves[player1]}</p>
                    <p>Opponent Move: {result.moves[player2]}</p>
                    <h3 className="text-lg mt-2">
                        {result.winner === "draw" ? "It's a Draw!" : `Winner: ${result.winner}`}
                    </h3>
                </div>
            ) : (
                <div>
                    <p>Choose Your Move:</p>
                    <div className="flex space-x-2 mt-2">
                        {["rock", "paper", "scissors"].map((option) => (
                            <button
                                key={option}
                                onClick={() => makeMove(option)}
                                className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-700"
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
