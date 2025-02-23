import WebSocket from "ws";
import { agents } from "../consts";
import { handleTwapOrderTx } from "./handleTwapOrderTx";
import { fetchBlockInfo } from "./fetchBlockInfo";
import { loadSpotMeta } from "./loadSpotMeta";
import { loadPerpMeta } from "./loadPerpMeta";
import { loadCoinMids } from "./loadCoinMids";
import { CoinsData } from "../types";
import handleSpotDeployTx from "./handleSpotDeployTx";

export async function handleNewMessages(webSocket: WebSocket) {
  const spotMeta = await loadSpotMeta();
  const perpMeta = await loadPerpMeta();
  const allMids = await loadCoinMids();

  if (!spotMeta || !perpMeta || !allMids) {
    console.error("Failed to load coins metadata", Date.now());
    return;
  }

  let currentProxyIndex = 0;

  webSocket.onmessage = (event) => {
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
            handleTwapOrderTx(tx, { spotMeta, perpMeta, allMids } as CoinsData);
          }
          if (type === "spotDeploy") {
            handleSpotDeployTx(tx, { spotMeta, perpMeta, allMids } as CoinsData);
          }
        });
        // webSocket.close();
      } catch (error) {
        console.error(error, Date.now());
      }
    });
  };
}
