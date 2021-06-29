const socket = io("http://localhost:9000");
const socket2 = io("http://localhost:9000/admin");

socket.on("messageFromServer", (dataFromServer) => {
	console.log(dataFromServer);
	socket.emit("messageToServer", { data: "Data from the client." });
});

document.getElementById("message-form").addEventListener("submit", (event) => {
	event.preventDefault();
	const newMessage = document.getElementById("user-message").value;
	socket.emit("newMessageToServer", { text: newMessage });
});

socket.on("joined", (msg) => {
	console.log(msg);
});

socket2.on("welcome", (msg) => {
	console.log(msg);
});
