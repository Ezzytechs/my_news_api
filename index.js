require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const newsRoutes = require("./routes/news_routes");
const connectToDatabase = require("./db/db"); 
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectToDatabase();

app.use("/uploads", express.static("uploads")); // Serve uploaded images

app.use("/api/news", newsRoutes);

// WebSocket for likes/dislikes
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  
  socket.on("likeNews", (newsId) => {
    io.emit("updateLikes", newsId);
  });

  socket.on("disLikeNews", (newsId) => {
    io.emit("updateDisLikes", newsId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
