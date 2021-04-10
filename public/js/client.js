const socket = io();
const messageContainer = document.querySelector(".message-container");
const form = document.querySelector(".form-container");
const messageInput = document.getElementById("messageInput");
const messageTone = new Audio("../sound/message tone.mp3");

const append = (message, position) => {
	const messageElement = document.createElement("div");
	messageElement.innerText = message;
	messageElement.classList.add("message");
	messageElement.classList.add(position);
	messageContainer.append(messageElement);

	if (position === "left") messageTone.play();
};

form.addEventListener("submit", (e) => {
	e.preventDefault();
	const message = messageInput.value;
	append(`You : ${message}`, "right");
	socket.emit("send", message);
	messageInput.value = "";
});

const name = prompt("Enter Your Name");

//socket.io
socket.emit("new-user-joined", name);

socket.on("user-joined", (name) => {
	append(`${name} Joined The Chat`, "right");
});

socket.on("receive", (data) => {
	append(`${data.name} : ${data.message}`, "left");
});

socket.on("leave", (name) => {
	append(`${name} Left The Chat.`, "left");
});
