const express = require("express");
const path = require("path");
const app = express();
const server = require("http").createServer(app);
const port = process.env.PORT || 8000;
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const static_path = path.join(__dirname, "./public");
app.use(express.urlencoded({ extended: false }));
app.use(express.static(static_path));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

const users = {};
io.on("connection", (socket) => {
  socket.on("new-user-joined", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });

  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      name: users[socket.id],
      message: message,
    });
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("leave", users[socket.id]);
    delete users[socket.id];
  });
});

server.listen(port, () => {
  console.log(port);
});
