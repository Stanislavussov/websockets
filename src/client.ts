import { Message } from "./types";

const chatEl = document.getElementById("chat")!;
console.log(chatEl);
const ws = new WebSocket("ws://127.0.0.1:8081");
ws.onmessage = (message) => {
  const messages = JSON.parse(message.data) as Message[];
  console.log(messages);
  messages.forEach((val) => {
    const messageEl = document.createElement("div");
    messageEl.appendChild(
      document.createTextNode(`${val.name}: ${val.message}`)
    );
    chatEl.appendChild(messageEl);
  });
};

const send = (event: Event) => {
  event.preventDefault();
  const nameInput = document.getElementById("name") as HTMLInputElement | null;
  const messageInput = document.getElementById("message") as HTMLInputElement;
  const name = nameInput ? nameInput.value : "";
  const message = messageInput ? messageInput.value : "";

  ws.send(
    JSON.stringify({
      name,
      message,
    })
  );

  messageInput!.value = "";
  messageInput!.focus();

  return false;
};
const formEl = document.getElementById("messageForm")!;
formEl.addEventListener("submit", send);
