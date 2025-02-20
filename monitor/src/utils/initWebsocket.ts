import WebSocket from "ws";
import { handleWebsocketClose } from "./handleWebsocketClose";

const RECONNECT_INTERVAL = 5000; // 5 seconds

export function initWebsocket() {
  let webSocket: WebSocket;

  const connect = () => {
    webSocket = new WebSocket("wss://api-ui.hyperliquid.xyz/ws");
    // handleWebsocketClose(webSocket);

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

    webSocket.onclose = () => {
      console.log("WebSocket closed. Attempting to reconnect...");
      setTimeout(connect, RECONNECT_INTERVAL);
    };

    webSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
      webSocket.close();
    };
  };

  connect();
  return webSocket!;
}
