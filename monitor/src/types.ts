export interface BlockInfo {
  blockDetails: {
    txs: Array<{
      action: {
        type: string;
        twap?: {
          a: number;
          s: number;
          m: number;
          b?: boolean;
        };
      };
    }>;
  };
}

export interface TokenInfo {
  name: string;
  isSpot: boolean;
  price: number;
}

export interface CoinsData {
  spotMeta: any;
  perpMeta: any;
  allMids: any;
}
