import ws, { WebSocketServer as Server } from "ws";
import { v4 as uuid } from "uuid";
import { writeFile, readFileSync, existsSync } from "fs";
import { Message } from "./types";

const log = existsSync("log") && readFileSync("log", "utf-8");
const messages: Message[] = log ? JSON.parse(log) : [];
const clients = new Map<string, ws>();
const PORT = 8081;
const wss = new Server({ port: PORT });

console.log(`Server started on port ${PORT}`);

wss.on("connection", (ws) => {
  const id = uuid();
  clients.set(id, ws);

  console.log(`New client ${id}`);
  ws.send(JSON.stringify(messages));

  ws.on("message", (rawMessage) => {
    const { name, message } = JSON.parse(rawMessage.toString());
    messages.push({ name, message });
    for (const id of clients.keys()) {
      clients.get(id)?.send(JSON.stringify([{ name, message }]));
    }
  });

  ws.on("close", () => {
    clients.delete(id);
    console.log(`Client is closed ${id}`);
  });
});

process.on("SIGINT", () => {
  wss.close();
  writeFile("log", JSON.stringify(messages), (err) => {
    if (err) {
      console.log(err);
    }
    process.exit();
  });
});
