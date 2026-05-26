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
  app.use(express.json());

  // Logging middleware
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Prediction route (Deterministic Random Generator)
  app.post("/api/predict", (req, res) => {
    const { history } = req.body;
    
    // Fallback: If no history exists, return a safe default
    if (!history || !Array.isArray(history) || history.length === 0) {
        return res.json({ prediction: "BIG", numbers: [5, 6] });
    }

    // Deterministic seed extraction with robust fallback
    const latestItem = history[0];
    const latestPeriod = String(latestItem.issueNumber || latestItem.number || latestItem.id || latestItem);
    const periodStr = latestPeriod.length >= 5 ? latestPeriod.slice(-5) : latestPeriod;
    const seed = parseInt(periodStr) || Date.now();

    // Seeded random generator
    const random = (s: number) => {
        let x = Math.sin(s++) * 10000;
        return x - Math.floor(x);
    };

    const rnd = random(seed);

    // 95% Chance: Random, 5% Check: Balance against last 10
    let isBig = rnd > 0.5;

    // 5% balance check based on last 10
    if (rnd < 0.05) {
        const last10 = history.slice(0, 10);
        const bigCount = last10.filter((h: any) =>
            parseInt(h.number || h) >= 5
        ).length;
        if (bigCount > 5) isBig = false;
        else if (bigCount < 5) isBig = true;
    }

    // Generate unique pair
    const pool = isBig ? [5, 6, 7, 8, 9] : [0, 1, 2, 3, 4];
    
    // Ensure we have enough pool items
    if (pool.length < 2) { // Should not happen given the pools above
        return res.json({ prediction: isBig ? "BIG" : "SMALL", numbers: [5, 6] });
    }
    
    let n1 = pool[Math.floor(random(seed + 1) * pool.length)];
    let n2;
    // Attempt to find a different second number, with a safety break
    let safety = 0;
    do {
        n2 = pool[Math.floor(random(seed + 2 + safety) * pool.length)];
        safety++;
    } while (n1 === n2 && safety < 10);

    // If still identical, force a different one
    if (n1 === n2) {
        n2 = pool.filter(n => n !== n1)[0] || pool[0];
    }

    // APPLY REVERSE LOGIC
    const finalPrediction = isBig ? "SMALL" : "BIG";
    const finalNumbers = [9 - n1, 9 - n2];

    res.json({ prediction: finalPrediction, numbers: finalNumbers });
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
          'Pragma': 'no-cache',
          'Accept-Language': 'en-US,en;q=0.9',
          'Sec-Ch-Ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
          'Sec-Ch-Ua-Mobile': '?0',
          'Sec-Ch-Ua-Platform': '"Windows"',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-site'
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
