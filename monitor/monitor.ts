import dotenv from "dotenv";
import { initWebsocket } from "./src/utils/initWebsocket";
import { handleNewMessages } from "./src/utils/handleNewMessages";
dotenv.config();

export async function monitor(): Promise<void> {
  const webSocket = initWebsocket();
  handleNewMessages(webSocket);
}
monitor().catch((err) => console.error(err, Date.now()));
