import { CoinsData, TokenInfo } from "../types";
import { findPerpTokenInfo } from "./findPerpTokenInfo";
import { findSpotTokenInfo } from "./findSpotTokenInfo";

export function findTokenInfo(spotId: number, data: CoinsData): TokenInfo {
  const isSpot = spotId >= 10000;

  const info = isSpot ? findSpotTokenInfo(spotId, data.spotMeta) : findPerpTokenInfo(spotId, data.perpMeta);
  const price = isSpot ? data.allMids[`@${spotId - 10000}`] : data.allMids[info.name];
  return { ...info, isSpot, price };
}
