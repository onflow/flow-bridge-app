// src/api/proxy.ts
import { IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
import axios from 'axios';

const server = async (req: IncomingMessage, res: ServerResponse) => {
  const parsedUrl = parse(req.url || '', true);
  const { url } = parsedUrl.query;

  if (!url) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'URL is required' }));
    return;
  }

  try {
    const response = await axios.get(`https://api.axelar.network${url}`);
    const data = response.data;

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
  } catch (error) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Failed to fetch data' }));
  }
};

export default server;