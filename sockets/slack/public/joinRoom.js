function joinRoom(roomName) {
	nsSocket.emit("joinRoom", roomName, (newNumberOfMembers) => {
		console.log(newNumberOfMembers);
		document.querySelector(".curr-room-count-users").innerHTML =
			newNumberOfMembers;
	});

	nsSocket.on("historyCatchUp", (roomHistory) => {
		console.log("catch");
		const messagesUl = document.getElementById("messages");
		messagesUl.innerHTML = "";
		roomHistory.forEach((msg) => {
			const newMsg = buildHTML(msg);
			messagesUl.innerHTML += newMsg;
		});
		messagesUl.scrollTo(0, messagesUl.scrollHeight);
	});

	nsSocket.on("updateMembers", (newNumberOfMembers) => {
		document.querySelector(".curr-room-text").innerText = roomName;
		document.querySelector(".curr-room-count-users").innerHTML =
			newNumberOfMembers;
	});

	const searchBox = document.getElementById("search-box");

	searchBox.addEventListener("input", (event) => {
		const messages = Array.from(
			document.getElementsByClassName("message-text")
		);

		messages.forEach((msg) => {
			if (
				msg.innerText
					.toLowerCase()
					.indexOf(event.target.value.toLowerCase()) === -1
			) {
				msg.style.display = "none";
			} else {
				msg.style.display = "block";
			}
		});
	});
}
