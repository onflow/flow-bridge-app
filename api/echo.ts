import type { VercelRequest, VercelResponse } from "@vercel/node";

const APP_KEYS: { [key: string]: string } = {
  ECHO_API_KEY: process.env.ECHO_API_KEY || "",
  TEST_API_KEY: process.env.TEST_API_KEY || "",
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { method, query, body, headers } = req;
  const { key } = query;

  if (method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const apiKey = Array.isArray(key) ? key[0] : key;
  if (!apiKey) {
    return res.status(400).json({ error: "API key is required" });
  }

  const api = APP_KEYS[apiKey];
  if (!api) {
    return res.status(403).json({ error: "Invalid API key" });
  }

  const response = {
    method,
    query,
    body,
    headers: {
      "content-type": headers["content-type"],
      "user-agent": headers["user-agent"],
    },
    message: `Hello from the TypeScript echo service!, key: ${api}`,
  };

  res.status(200).json(response);
}
