import WebSocket from "ws";
import { handleWebsocketClose } from "./handleWebsocketClose";

export function initWebsocket() {
  const webSocket = new WebSocket("wss://api-ui.hyperliquid.xyz/ws");
  handleWebsocketClose(webSocket);

  webSocket.onopen = () => {
    webSocket.send(
      JSON.stringify({
        method: "subscribe",
        subscription: {
          type: "explorerBlock",
        },
      })
    );
    console.log("Successfully sent subscription request to explorerBlock");
  };

  return webSocket;
}
