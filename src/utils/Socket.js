import { io } from "socket.io-client";

// Connect to backend server
const socket = io("http://localhost:5000", { withCredentials: true });

export default socket;
