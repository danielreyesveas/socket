//const socket = io("http://localhost:9000");

const username = prompt("Enter your username:");
const socket = io("http://localhost:9000", {
	query: {
		username,
	},
});
let nsSocket;

socket.on("nsList", (nsData) => {
	let namespacesDiv = document.querySelector(".namespaces");
	namespacesDiv.innerHTML = "";
	nsData.forEach((ns) => {
		namespacesDiv.innerHTML += `<div class="namespace" ns="${ns.endpoint}"><img src="${ns.img}" /></div>`;
	});
	Array.from(document.getElementsByClassName("namespace")).forEach(
		(element) => {
			element.addEventListener("click", (event) => {
				const nsEndpoint = element.getAttribute("ns");
				joinNs(nsEndpoint);
			});
		}
	);

	joinNs("/wiki");
});
