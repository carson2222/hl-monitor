const { EmbedBuilder, WebhookClient } = require("discord.js");
import { BLACKLISTED_SPOTS, WHITELIST_PERPS } from "../consts";
import { TokenInfo } from "../types";
import dotenv from "dotenv";
dotenv.config();

export function sendTwapAlert(tokenInfo: TokenInfo, tx: any, IMG_URL: string) {
  const value = +(tx.action?.twap?.s || 0) * +tokenInfo.price;
  console.log("VALUE:", value);

  let url = undefined;
  const direction = tx.action?.twap?.b;
  const user = `https://rpc.hyperliquid.xyz/explorer/address/${tx?.user || "ERROR"}`;
  const hash = `https://rpc.hyperliquid.xyz/explorer/tx/${tx?.hash || "ERROR"}`;

  if (value >= 1000 * 1000) url = process.env.TWAP_WEBHOOK_1M;
  else if (value >= 100 * 1000) url = process.env.TWAP_WEBHOOK_100K;
  else return;

  const webhookClient = new WebhookClient({
    url,
  });

  if (!tokenInfo.isSpot && !WHITELIST_PERPS.includes(tokenInfo.name)) {
    console.log("This perp isn't whitelisted, returning");
    return;
  }

  if (tokenInfo.isSpot && BLACKLISTED_SPOTS.includes(tokenInfo.name)) {
    console.log("This spot is blacklisted, returning");
    return;
  }

  const embed = new EmbedBuilder()
    .setTitle(direction ? "🟢 TWAP BUY 🟢" : "🔴 TWAP SELL 🔴")
    .setColor(direction ? "#00ff04" : "#ff0000") // A dark teal color
    .setThumbnail(IMG_URL)
    .addFields([
      {
        name: "📌 **TYPE**",
        value: tokenInfo.isSpot ? "🔵 SPOT" : "🔴 PERP",
        inline: true,
      },
      {
        name: "📛 **NAME**",
        value: `\`${tokenInfo.name}\``,
        inline: true,
      },
      {
        name: "📏 **SIZE**",
        value: `\`${tx.action?.twap?.s} ${tokenInfo.name}\``,
        inline: true,
      },
      {
        name: "⏳ **DURATION (m)**",
        value: `\`${tx.action?.twap?.m.toString()}\``,
        inline: true,
      },
      {
        name: "💲 **TOTAL**",
        value: `\`${new Intl.NumberFormat("en-US").format(value)}$\``,
        inline: true,
      },
      ...(tokenInfo.isSpot
        ? []
        : [
            {
              name: "🧭 **DIRECTION**",
              value: tokenInfo.isSpot ? (direction ? "🟢 BUY" : "🔴 SELL") : direction ? "🟢 LONG" : "🔴 SHORT",
              inline: true,
            },
          ]),
      {
        name: "🔗 **Links**",
        value: `[USER](${user})   [TX](${hash})`,
        inline: true,
      },
    ])
    .setFooter({
      text: "TWAP Alert System",
      iconURL: IMG_URL,
    })
    .setTimestamp();

  webhookClient.send({
    avatarURL: IMG_URL,
    embeds: [embed],
  });
  console.log("-------------------");
}
