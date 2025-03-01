import dotenv from "dotenv";
import { WebSocketManager } from "./src/utils/initWebsocket";
dotenv.config();

export async function monitor(): Promise<void> {
  const webSocketManager = new WebSocketManager();
}
monitor().catch((err) => console.error(err, Date.now()));
