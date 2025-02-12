import { HttpsProxyAgent } from "https-proxy-agent";
import { agents } from "../consts";
import { BlockInfo } from "../types";
import { sleep } from "../sleep";
import fetch from "node-fetch";

export async function fetchBlockInfo(block: number, proxyId: number, retries = 5): Promise<BlockInfo | undefined> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await sleep(attempt * 350);

      const agent = proxyId >= agents.length ? undefined : new HttpsProxyAgent(agents[proxyId]);
      const info = await fetch("https://api-ui.hyperliquid.xyz/explorer", {
        agent: agent,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          height: block,
          type: "blockDetails",
        }),
        method: "POST",
      });

      if (info.ok) {
        const data = await info.json();
        if (block) console.log(`Scraped block: ${block}`);
        return data;
      } else {
        if (info.status === 429) throw new Error(`Error: ${info.status} ${info.statusText}`);
      }
    } catch (error: any) {
      console.error(`Attempt ${attempt} failed:`, error?.message);
      if (attempt === retries) {
        console.error("Max retries reached. Giving up.");
        throw error;
      }
      console.log(`Retrying... (${attempt}/${retries})`);
    }
  }
}
