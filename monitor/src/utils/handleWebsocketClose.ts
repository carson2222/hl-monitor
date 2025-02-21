import WebSocket from "ws";

export function handleWebsocketClose(webSocket: WebSocket) {
  webSocket.onerror = (error) => {
    console.error("WebSocket error:", error, Date.now());
  };

  webSocket.onclose = () => {
    console.log("WebSocket connection closed");
  };

  // Ensure WebSocket is closed when the process exits
  process.on("exit", () => {
    webSocket.close();
  });

  process.on("SIGINT", () => {
    webSocket.close();
    process.exit();
  });

  process.on("SIGTERM", () => {
    webSocket.close();
    process.exit();
  });
}
