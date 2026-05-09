import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());

  // Logging middleware
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // API Proxy Route
  app.all("/api/lottery-history", async (req, res) => {
    const requestId = Date.now().toString(36);
    console.log(`[${requestId}] Proxying request to lottery API`);
    try {
      const targetUrl = 'https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json';
      console.log(`[${requestId}] Fetching from: ${targetUrl}`);
      const fetchUrl = `${targetUrl}?ts=${Date.now()}`;
      
      const response = await fetch(fetchUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Referer': 'https://ar-lottery01.com/',
          'Origin': 'https://ar-lottery01.com',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      const contentType = response.headers.get('content-type') || '';
      console.log(`[${requestId}] Status: ${response.status}, Content-Type: ${contentType}`);

      if (!response.ok) {
        const text = await response.text().catch(() => 'No body');
        console.error(`[${requestId}] External API error:`, text.slice(0, 200));
        return res.status(response.status).json({ 
          error: "External API error", 
          status: response.status,
          details: text.slice(0, 500)
        });
      }

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error(`[${requestId}] Parse error. Body:`, text.slice(0, 200));
        return res.status(502).json({
          error: "Invalid JSON from external API",
          details: text.slice(0, 500)
        });
      }

      res.json(data);
    } catch (error) {
      console.error(`[${requestId}] Proxy crash:`, error);
      res.status(500).json({ 
        error: "Internal proxy error",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
