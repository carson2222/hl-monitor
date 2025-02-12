export function findSpotTokenInfo(spotId: number, spotMeta: any): any {
  spotId = spotId - 10000;
  if (!spotMeta || !spotMeta?.universe || !spotMeta?.tokens) throw new Error("Invalid spotMeta");

  const tokenId = spotMeta.universe.find((token: any) => token.index === spotId)?.tokens[0];
  console.log(
    "spotMeta.universe.find((token: any) => token.index === spotId)",
    spotMeta.universe.find((token: any) => token.index === spotId)
  );
  console.log("tokenId", tokenId);
  if (!Number.isInteger(+tokenId)) throw new Error("Invalid tokenId");

  const baseData = spotMeta.tokens.find((token: any) => token.index === tokenId);
  return baseData;
}
