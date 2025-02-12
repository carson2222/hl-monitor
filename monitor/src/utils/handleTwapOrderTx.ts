import { IMG_URL } from "../consts";
import { CoinsData } from "../types";
import { findTokenInfo } from "./findTokenInfo";
import { sendTwapAlert } from "./sendTwapAlert";

export function handleTwapOrderTx(tx: any, coinsData: CoinsData) {
  console.log("TWAP");
  console.log(tx);
  console.log("tx.action?.twap.a", tx.action?.twap?.a);
  const tokenInfo = findTokenInfo(tx.action?.twap?.a!, coinsData);
  console.log(tokenInfo);
  console.log("NAME:", tokenInfo.name);
  console.log("SIZE:", tx.action?.twap?.s);
  console.log("DURATION MINUTES:", tx.action?.twap?.m);
  console.log("PRICE: ", tokenInfo.price);

  console.log("DIRECTION:", tx.action?.twap?.b ? "LONG" : "SHORT");
  sendTwapAlert(tokenInfo, tx, IMG_URL);
}
