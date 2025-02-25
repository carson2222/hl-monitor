import WebSocket from "ws";

const RECONNECT_INTERVAL = 1000 * 2;
const HEARTBEAT_INTERVAL = 1000 * 10;

export function initWebsocket() {
  let webSocket: WebSocket;
  let heartbeatTimeout: NodeJS.Timeout;

  const heartbeat = () => {
    clearTimeout(heartbeatTimeout);
    heartbeatTimeout = setTimeout(() => {
      console.log("No heartbeat, closing WebSocket...");
      webSocket.terminate(); // Forcefully close the connection
    }, HEARTBEAT_INTERVAL + 1000); // Allow some buffer time
  };

  const connect = () => {
    webSocket = new WebSocket("wss://api-ui.hyperliquid.xyz/ws");

    webSocket.onopen = () => {
      console.log("WebSocket connected.");
      webSocket.send(
        JSON.stringify({
          method: "subscribe",
          subscription: {
            type: "explorerBlock",
          },
        })
      );
      console.log("Successfully sent subscription request to explorerBlock");
      heartbeat();
    };

    webSocket.addEventListener("message", (message) => {
      console.log("Received message:", message.data);
      heartbeat(); // Reset heartbeat timer on every message
    });

    webSocket.onclose = (event) => {
      console.log(`WebSocket closed (Code: ${event.code}). Attempting to reconnect...`);
      clearTimeout(heartbeatTimeout);
      setTimeout(connect, RECONNECT_INTERVAL);
    };

    webSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
      webSocket.close();
    };

    webSocket.on("pong", heartbeat); // Listen for pong responses to heartbeat
  };

  // Send a ping at regular intervals
  setInterval(() => {
    if (webSocket.readyState === WebSocket.OPEN) {
      webSocket.ping();
    }
  }, HEARTBEAT_INTERVAL);

  connect();
  return webSocket!;
}
