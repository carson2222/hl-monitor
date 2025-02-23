import { CoinsData } from "../types";
import { findSpotTokenInfo } from "./findSpotTokenInfo";
import { sendSpotDeployAlert } from "./sendSpotDeployAlert";

interface RegisterHyperliquidity {
  spotId: number;
  startPx: string;
  orderSz: string;
  nOrders: number;
  nSeededLevels: number;
}

interface Tx {
  action?: {
    registerHyperliquidity?: RegisterHyperliquidity;
  };
}

export default async function handleSpotDeployTx(tx: Tx, coinsData: CoinsData) {
  console.log("-----");
  console.log("spotDeploy");
  console.log("tx:", tx);
  if (!isFinalSpotDeployTx(tx)) {
    console.log("This isn't the final spot deploy tx");
    return;
  }

  const tokenSpotId = tx.action?.registerHyperliquidity?.spotId;
  if (!tokenSpotId) {
    console.log("Invalid tokenSpotId");
    return;
  }

  const tokenInfo = findSpotTokenInfo(tokenSpotId, coinsData.spotMeta);
  console.log(tokenInfo);

  sendSpotDeployAlert(tx, tokenInfo);
}
function isFinalSpotDeployTx(tx: any): tx is Tx {
  return (
    tx &&
    tx.action &&
    tx.action.registerHyperliquidity &&
    typeof tx.action.registerHyperliquidity.spotId === "number" &&
    typeof tx.action.registerHyperliquidity.startPx === "string" &&
    typeof tx.action.registerHyperliquidity.orderSz === "string" &&
    typeof tx.action.registerHyperliquidity.nOrders === "number" &&
    typeof tx.action.registerHyperliquidity.nSeededLevels === "number"
  );
}
