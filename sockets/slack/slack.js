const express = require("express");
const app = express();
const socketio = require("socket.io");

let namespaces = require("./data/namespaces");

app.use(express.static(__dirname + "/public"));

const expressServer = app.listen(9000);

const io = socketio(expressServer, { cors: { origin: "*" } });

io.on("connection", (socket) => {
	let nsData = namespaces.map((ns) => ({
		img: ns.img,
		endpoint: ns.endpoint,
	}));
	socket.emit("nsList", nsData);
});

namespaces.forEach((namespace) => {
	io.of(namespace.endpoint).on("connection", (nsSocket) => {
		const username = nsSocket.handshake.query.username;
		console.log(`${username} has join ${namespace.endpoint}`);
		nsSocket.emit("nsRoomLoad", namespace.rooms);

		nsSocket.on("joinRoom", async (roomToJoin, numberOfUsersCallback) => {
			const roomToLeave = Array.from(nsSocket.rooms)[1];

			nsSocket.leave(roomToLeave);
			updateUsersInRoom(namespace, roomToLeave);

			nsSocket.join(roomToJoin);

			const nsRoom = namespace.rooms.find(
				(room) => room.roomTitle === roomToJoin
			);

			nsSocket.emit("historyCatchUp", nsRoom.history);
			updateUsersInRoom(namespace, roomToJoin);
		});

		nsSocket.on("newMessageToServer", (msg) => {
			const fullMsg = {
				text: msg.text,
				time: Date.now(),
				username: username,
				avatar: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
			};
			const roomTitle = Array.from(nsSocket.rooms)[1];

			const nsRoom = namespace.rooms.find(
				(room) => room.roomTitle === roomTitle
			);

			nsRoom.addMessage(fullMsg);

			io.of(namespace.endpoint)
				.to(roomTitle)
				.emit("messageToClients", fullMsg);
		});
	});
});

async function updateUsersInRoom(namespace, roomToJoin) {
	const clients = await io.of(namespace.endpoint).in(roomToJoin).allSockets();
	io.of(namespace.endpoint)
		.in(roomToJoin)
		.emit("updateMembers", clients.size);
}
