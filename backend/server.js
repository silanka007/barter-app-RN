const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const morgan = require("morgan");
const dotenv = require("dotenv");
const config = require("config");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

// body parser
app.use(express.json());

// load environment variable
dotenv.config({ path: "./config.env" });

// db connection
mongoose
  .connect(config.get("MONGO_URI"))
  .then((conn) => console.log("connected to database successfully..."))
  .catch((err) => console.log(err.message));

// routes
app.use("/api/users", require("./routes/api/users"));

const server = http.createServer(app);
const io = socketio(server).sockets;

server.listen(PORT, () => console.log(`server listening on port ${PORT}`));
