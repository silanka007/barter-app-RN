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
(async () => {
  try {
    const URI = config.get("MONGO_URI")
    await mongoose.connect(URI);
    console.log("database connection successfully...");
  } catch (error) {
    console.log(error.message);
  }
})();


// routes
app.use("/api/users", require("./routes/api/users"))


const server = http.createServer(app);
const io = socketio(server).sockets;

server.listen(PORT, () => console.log(`server listening on port ${PORT}`));
