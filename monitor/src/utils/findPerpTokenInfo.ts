export function findPerpTokenInfo(asset: number, perpMeta: any): any {
  if (!perpMeta || !perpMeta?.universe) throw new Error("Invalid perpMeta");

  return { ...perpMeta.universe[asset] };
}
