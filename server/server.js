require("dotenv").config();
const express = require("express");
const connectDB = require("./config/dbConn");
const PORT = process.env.PORT || 3500;
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require("path");

connectDB();
const app = express();

app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// Deployment

const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname1, "/client/build")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname1, "client", "build", "index.html"));
    })
} else {
    app.get("/", (req, res) => {
    res.send("API is running");
});
}

// Deployment

app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, console.log(`Server running on port ${PORT}`));

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
    }
});

io.on("connection", (socket) => {
    console.log("Connected to socket.io");

    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User joined room " + room);
    });

    socket.on("typing", (room) => socket.in(room).emit("typing", room));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing", room));

    socket.on("new message", (newMessageRec) => {
        var chat = newMessageRec.chat;

        chat.users.forEach(user => {
            if (user._id == newMessageRec.sender._id) return;

            socket.in(user._id).emit("message received", newMessageRec);
        })
    });

    socket.off("setup", () => {
        console.log("User disconnected");
        socket.leave(userData._id);
    });
});