import express, { Request, Response } from 'express';
import axios from 'axios';

const app = express();
const PORT = 4000; // Ensure this matches the target port in Vite config

app.get('/proxy', async (req: Request, res: Response) => {
  const url = req.query.url as string;

  if (!url) {
    res.status(400).json({ error: 'URL is required' });
    return;
  }

  try {
    const response = await axios.get(url);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});