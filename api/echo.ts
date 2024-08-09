import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { method, query, body, headers } = req;

  const response = {
    method,
    query,
    body,
    headers: {
      'content-type': headers['content-type'],
      'user-agent': headers['user-agent']
    },
    message: "Hello from the TypeScript echo service!"
  };

  res.status(200).json(response);
}