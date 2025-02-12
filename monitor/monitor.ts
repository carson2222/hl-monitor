import dotenv from "dotenv";
import { initWebsocket } from "./src/utils/initWebsocket";
import { handleNewMessages } from "./src/utils/handleNewMessages";
import { loadSpotMeta } from "./src/utils/loadSpotMeta";
import { loadPerpMeta } from "./src/utils/loadPerpMeta";
import { loadCoinMids } from "./src/utils/loadCoinMids";
dotenv.config();

export async function monitor(): Promise<void> {
  const webSocket = initWebsocket();
  handleNewMessages(webSocket);
}
monitor().catch(console.error);
