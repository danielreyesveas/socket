function joinNs(endpoint) {
	if (nsSocket) {
		nsSocket.close();
		document
			.getElementById("user-input")
			.removeEventListener("submit", formSubmission);
	}

	nsSocket = io(`http://localhost:9000${endpoint}`);

	nsSocket.on("nsRoomLoad", (nsRooms) => {
		const roomList = document.querySelector(".room-list");
		roomList.innerHTML = "";

		nsRooms.forEach((room) => {
			const glyph = room.privateRoom ? "lock" : "globe";
			roomList.innerHTML += `<li class="room"><span class="glyphicon glyphicon-${glyph}"></span>${room.roomTitle}</li>`;
		});

		Array.from(document.getElementsByClassName("room")).forEach(
			(element) => {
				element.addEventListener("click", (event) => {
					joinRoom(event.target.innerText);
				});
			}
		);

		const topRoom = document.querySelector(".room");
		const topRoomName = topRoom.innerText;
		joinRoom(topRoomName);
	});

	nsSocket.on("messageToClients", (msg) => {
		console.log(msg);
		const newMsg = buildHTML(msg);
		document.getElementById("messages").innerHTML += newMsg;
	});

	document
		.querySelector(".message-form")
		.addEventListener("submit", formSubmission);
}

function formSubmission(event) {
	event.preventDefault();
	const newMessage = document.getElementById("user-message").value;

	nsSocket.emit("newMessageToServer", { text: newMessage });
}

function buildHTML(msg) {
	const convertedDate = new Date(msg.time).toLocaleDateString();
	const newHTML = `<li>
        <div class="user-image">
            <img width="30"  src="${msg.avatar}" />
        </div>
        <div class="user-message">
            <div class="user-name-time">
                ${msg.username} <span>${convertedDate}</span>
            </div>
            <div class="message-text">${msg.text}</div>
        </div>
    </li>`;

	return newHTML;
}
