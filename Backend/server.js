const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const cors = require("cors");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const mongoose = require("mongoose");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app); // Create HTTP server for WebSocket
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "*", // Adjust for security in production
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(cors());

app.use("/api/trucks", require("./routes/truckRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

app.get("/", (req, res) => {
  res.send("Garbage Truck Tracking API is Running 🚛📍");
});

app.get("/test-db", async (req, res) => {
  const dbState = mongoose.connection.readyState;
  res.json({ connected: dbState === 1 });
});

// Store truck locations (Temporary, replace with DB logic if needed)
let truckLocations = {};

// WebSocket Handling
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on("updateLocation", ({ lat, lng, userId }) => {
    console.log(`Truck ${userId} updated location: (${lat}, ${lng})`);
    
    // Update in-memory truck location
    truckLocations[userId] = { lat, lng };

    // Broadcast update to all clients
    io.emit("locationUpdate", { id: userId, location: { lat, lng } });
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));