const http = require("http");
const socketio = require("socket.io");

const server = http.createServer((req, res) => {
	res.end("Hellofriend...");
});

const io = socketio(server, { cors: { origin: "*" } });

io.on("connection", (socket, _) => {
	socket.emit("welcome", "Welcome friend...");
	socket.on("message", (msg) => {
		console.log(msg);
	});
});

server.listen(8000);
