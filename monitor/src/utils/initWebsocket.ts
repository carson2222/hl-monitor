import WebSocket from "ws";
import { loadSpotMeta } from "./loadSpotMeta";
import { loadPerpMeta } from "./loadPerpMeta";
import { loadCoinMids } from "./loadCoinMids";
import { CoinsData } from "../types";
import handleSpotDeployTx from "./handleSpotDeployTx";
import { handleTwapOrderTx } from "./handleTwapOrderTx";
import { fetchBlockInfo } from "./fetchBlockInfo";
import { agents } from "../consts";

const RECONNECT_INTERVAL = 1000 * 2;
const HEARTBEAT_INTERVAL = 1000 * 10;

export class WebSocketManager {
  private webSocket!: WebSocket;
  private heartbeatTimeout!: NodeJS.Timeout;
  private coinsData!: CoinsData;

  constructor() {
    this.connect();
    setInterval(() => {
      if (this.webSocket.readyState === WebSocket.OPEN) {
        this.webSocket.ping();
      }
    }, HEARTBEAT_INTERVAL);
  }

  private heartbeat() {
    clearTimeout(this.heartbeatTimeout);
    this.heartbeatTimeout = setTimeout(() => {
      console.log("No heartbeat, closing WebSocket...");
      this.webSocket.terminate();
    }, HEARTBEAT_INTERVAL + 1000);
  }

  private connect() {
    this.webSocket = new WebSocket("wss://rpc.hyperliquid.xyz/ws");

    this.webSocket.onopen = async () => {
      console.log("WebSocket connected.");
      this.webSocket.send(
        JSON.stringify({
          method: "subscribe",
          subscription: {
            type: "explorerBlock",
          },
        })
      );
      console.log("Successfully sent subscription request to explorerBlock");
      this.heartbeat();
      await this.handleNewMessages(); // Refresh handleNewMessages after WebSocket is reopened
    };

    this.webSocket.addEventListener("message", (message) => {
      console.log("Received message:", message.data);
      this.heartbeat();
    });

    this.webSocket.onclose = (event) => {
      console.log(`WebSocket closed (Code: ${event.code}). Attempting to reconnect...`);
      clearTimeout(this.heartbeatTimeout);
      setTimeout(() => this.connect(), RECONNECT_INTERVAL);
    };

    this.webSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
      this.webSocket.close();
    };

    this.webSocket.on("pong", () => this.heartbeat());
  }

  public getWebSocket(): WebSocket {
    return this.webSocket;
  }

  private async loadAllData() {
    const spotMeta = await loadSpotMeta();
    const perpMeta = await loadPerpMeta();
    const allMids = await loadCoinMids();
    const newCoinsData: CoinsData = { spotMeta, perpMeta, allMids };
    this.coinsData = newCoinsData;
  }

  public async handleNewMessages() {
    await this.loadAllData();

    if (!this.coinsData.spotMeta || !this.coinsData.perpMeta || !this.coinsData.allMids) {
      console.error("Failed to load coins metadata", Date.now());
      return;
    }

    let currentProxyIndex = 0;

    this.webSocket.addEventListener("message", (event) => {
      //@ts-ignore
      const res = JSON.parse(event.data);

      if (res.channel === "subscriptionResponse" && res.data.subscription.type === "explorerBlock") {
        console.log("Successfully connected to explorerBlock the WebSocket");
        return;
      }
      res.forEach(async (block: any) => {
        try {
          if (currentProxyIndex >= agents.length) currentProxyIndex = 0;
          else currentProxyIndex++;
          const info = await fetchBlockInfo(block.height, currentProxyIndex);

          info?.blockDetails?.txs.forEach((tx: any) => {
            const type = tx.action.type;
            if (type === "twapOrder") {
              handleTwapOrderTx(tx, this.coinsData);
            }
            if (type === "spotDeploy") {
              handleSpotDeployTx(tx, this.coinsData);
            }
          });
          // this.webSocket.close();
        } catch (error) {
          console.error(error, Date.now());
        }
      });
    });

    setInterval(async () => {
      this.coinsData.allMids = await loadCoinMids();
    }, 1000 * 60 * 60 * 3);
  }
}
