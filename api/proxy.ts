import { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

const APP_KEYS: { [key: string]: string } = {
  base: process.env.BASE_API_KEY || "",
  polygon: process.env.POLYGON_API_KEY || "",
  ethereum: process.env.ETHEREUM_API_KEY || "",
  binance: process.env.BSC_API_KEY || "",
  fantom: process.env.FANTOM_API_KEY || "",
  arbitrum: process.env.ARBITRUM_API_KEY || "",
  optimism: process.env.OPTIMISM_API_KEY || "",
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle OPTIONS request for CORS preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const name = req.query.name as string;
  const url = req.query.url as string;
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  const apiKey = APP_KEYS[name];
  // if api key then append to url
  const apiKeyParam = apiKey ? `&apikey=${apiKey}` : "";
  const urlWithApiKey = `${url}${apiKeyParam}`;

  try {
    const response = await axios.get(urlWithApiKey);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error occurred while fetching data:", error);
    return res
      .status(500)
      .json({ error: "Failed to fetch data", details: error });
  }
}
