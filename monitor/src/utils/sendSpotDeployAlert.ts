const { WebhookClient } = require("discord.js");
import { TokenInfo } from "../types";
import dotenv from "dotenv";
dotenv.config();

export function sendSpotDeployAlert(tx: any, tokenInfo: any) {
  const webhookClient = new WebhookClient({
    url: process.env.MOCK_WEBHOOK,
  });

  const message = `
    Token Info: ${JSON.stringify(tokenInfo)}
    Transaction: ${JSON.stringify(tx)}
  `;

  webhookClient.send({
    content: message,
  });
}
