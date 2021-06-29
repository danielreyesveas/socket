const http = require("http");
const websocket = require("ws");

const server = http.createServer((req, res) => {
	res.end("Connected...");
});

const wss = new websocket.Server({ server });
wss.on("headers", (headers, req) => console.log(headers));

wss.on("connection", (ws, req) => {
	ws.send("Welcome friend...");
	ws.on("message", (message) => {
		console.log(message);
	});
});

server.listen(8000);
