const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
app.use(cors());
app.use(express.json());
const http = require("http");
const env = require("dotenv");
env.config();
const socket = require("socket.io");

const authRouter = require("./routes/auth");
const messageRouter = require("./routes/message");

const port = 5000 || process.env.PORT;

mongoose
  .connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("mongo successfull connected"))
  .catch((err) => console.log(err.message, "err"));

app.get("/", (req, res) => {
  res.send("hello socket io");
});

app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);


const httpServer = http.createServer(app);
httpServer.listen(port, () => {
  console.log("app is running on port 5000");
});

// socket code
// const io = new Server(httpServer);
const io = socket(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    Credential: true,
  },
});

global.onlineUsers = new Map()


// socket connection
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(userId,"user")
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data);
      console.log(data.msg,"msg")
    }
  });
});
