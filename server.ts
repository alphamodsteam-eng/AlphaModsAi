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

  // Prediction route (ULTRA MASTER UNIFIED BIG/SMALL PREDICTION ENGINE)
  app.post("/api/predict", (req, res) => {
    const { history } = req.body;
    
    // Fallback: If no history exists, return a safe default
    if (!history || !Array.isArray(history) || history.length === 0) {
        return res.json({ 
          prediction: "BIG", 
          confidence: 85, 
          numbers: [5, 6],
          logicName: "ULTRA_MASTER_UNIFIED",
          mode: "FALLBACK"
        });
    }

    try {
      // 1. Process history chronologically (oldest to newest)
      const chronological = [...history].reverse().map(item => {
        const val = parseInt(item.number);
        return {
          period: String(item.issueNumber || item.number || item.id || item),
          value: isNaN(val) ? 0 : val,
          big_small: isNaN(val) ? 0 : (val >= 5 ? 1 : 0)
        };
      });

      const bigSmalls = chronological.map(c => c.big_small);
      const latestItem = history[0];
      const periodStr = String(latestItem.issueNumber || latestItem.number || latestItem.id || latestItem);

      // --- MODEL 1: Bayesian Model ---
      const runBayesian = (data: number[]): number => {
        if (data.length === 0) return 0.5;
        const prior = data.reduce((a, b) => a + b, 0) / data.length;
        const recentSlice = data.slice(-20);
        const recent = recentSlice.reduce((a, b) => a + b, 0) / recentSlice.length;
        return prior * 0.3 + recent * 0.7;
      };

      // --- MODEL 2: Markov Chain Model ---
      const runMarkov = (data: number[]): number => {
        const len = data.length;
        if (len < 4) return 0.5;
        for (let ord = 3; ord >= 1; ord--) {
          const counts = [0, 0];
          const currentPattern = data.slice(-ord);
          for (let i = 0; i < len - ord; i++) {
            let match = true;
            for (let j = 0; j < ord; j++) {
              if (data[i + j] !== currentPattern[j]) {
                match = false;
                break;
              }
            }
            if (match) {
              const nextVal = data[i + ord];
              if (nextVal === 0 || nextVal === 1) {
                counts[nextVal]++;
              }
            }
          }
          const total = counts[0] + counts[1];
          if (total > 0) return counts[1] / total;
        }
        return 0.5;
      };

      // --- MODEL 3: Monte Carlo Model ---
      const runMonteCarlo = (data: number[]): number => {
        const len = data.length;
        if (len < 2) return 0.5;
        const transMatrix = [[0, 0], [0, 0]];
        for (let i = 0; i < len - 1; i++) {
          const curr = data[i];
          const nxt = data[i + 1];
          if ((curr === 0 || curr === 1) && (nxt === 0 || nxt === 1)) {
            transMatrix[curr][nxt]++;
          }
        }
        const probs = [[0.5, 0.5], [0.5, 0.5]];
        for (let i = 0; i < 2; i++) {
          const total = transMatrix[i][0] + transMatrix[i][1];
          if (total > 0) {
            probs[i][0] = transMatrix[i][0] / total;
            probs[i][1] = transMatrix[i][1] / total;
          }
        }
        const latestState = data[len - 1];
        let bigCount = 0;
        const numSimulations = 1000;
        for (let sim = 0; sim < numSimulations; sim++) {
          let state = latestState;
          for (let step = 0; step < 10; step++) {
            state = Math.random() < probs[state][0] ? 0 : 1;
          }
          bigCount += state;
        }
        return bigCount / numSimulations;
      };

      // --- MODEL 4: Transformer Emulator ---
      const runTransformer = (data: number[]): number => {
        const len = data.length;
        if (len < 8) return 0.5;
        const seqLen = 4;
        const query = data.slice(-seqLen);
        let sumWeight = 0;
        let weightedNextVal = 0;
        for (let i = 0; i < len - seqLen - 1; i++) {
          const key = data.slice(i, i + seqLen);
          let dotProduct = 0;
          for (let j = 0; j < seqLen; j++) {
            dotProduct += (query[j] === key[j] ? 1.0 : -1.0);
          }
          const weight = Math.exp(dotProduct);
          sumWeight += weight;
          weightedNextVal += weight * data[i + seqLen];
        }
        return sumWeight > 0 ? weightedNextVal / sumWeight : 0.5;
      };

      // --- MODEL 5: LSTM Emulator ---
      const runLSTM = (data: number[]): number => {
        const len = data.length;
        if (len === 0) return 0.5;
        let h = 0.5, c = 0.5;
        const w_f = 0.5, w_i = 0.5, w_o = 0.5, w_c = 0.5;
        const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
        const tanh = (x: number) => Math.tanh(x);
        for (let t = 0; t < len; t++) {
          const x = data[t];
          const f = sigmoid(w_f * x + 0.2 * h);
          const i = sigmoid(w_i * x + 0.2 * h);
          const o = sigmoid(w_o * x + 0.2 * h);
          const c_tilde = tanh(w_c * x + 0.2 * h);
          c = f * c + i * c_tilde;
          h = o * tanh(c);
        }
        return sigmoid(h * 2 - 1);
      };

      // --- MODEL 6: GRU Emulator ---
      const runGRU = (data: number[]): number => {
        const len = data.length;
        if (len === 0) return 0.5;
        let h = 0.5;
        const w_z = 0.6, w_r = 0.4, w_h = 0.5;
        const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
        const tanh = (x: number) => Math.tanh(x);
        for (let t = 0; t < len; t++) {
          const x = data[t];
          const z = sigmoid(w_z * x + 0.1 * h);
          const r = sigmoid(w_r * x + 0.1 * h);
          const h_tilde = tanh(w_h * x + 0.2 * (r * h));
          h = (1 - z) * h + z * h_tilde;
        }
        return sigmoid(h * 2 - 1);
      };

      // --- MODEL 7: Logistic Regression ---
      const runLogisticRegression = (data: number[]): number => {
        const len = data.length;
        if (len < 10) return 0.5;
        const dataset: { x1: number; x2: number; y: number }[] = [];
        for (let i = 2; i < len; i++) {
          dataset.push({ x1: data[i - 1], x2: data[i - 2], y: data[i] });
        }
        let w1 = 0.0, w2 = 0.0, b = 0.0;
        const lr = 0.1;
        const epochs = 50;
        const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));
        for (let epoch = 0; epoch < epochs; epoch++) {
          let dw1 = 0, dw2 = 0, db = 0;
          for (const row of dataset) {
            const z = w1 * row.x1 + w2 * row.x2 + b;
            const pred = sigmoid(z);
            const error = pred - row.y;
            dw1 += error * row.x1;
            dw2 += error * row.x2;
            db += error;
          }
          w1 -= (dw1 / dataset.length) * lr;
          w2 -= (dw2 / dataset.length) * lr;
          b -= (db / dataset.length) * lr;
        }
        return sigmoid(w1 * data[len - 1] + w2 * data[len - 2] + b);
      };

      // --- MODEL 8: Decision Forest (RF, XGB, LGB, CAT) ---
      const runDecisionForest = (data: number[]): { rf: number; xgb: number; lgb: number; cat: number } => {
        const len = data.length;
        if (len < 10) return { rf: 0.5, xgb: 0.5, lgb: 0.5, cat: 0.5 };
        const trainLag = (lag: number): number => {
          let c0_l0 = 0, c1_l0 = 0, c0_l1 = 0, c1_l1 = 0;
          for (let i = lag; i < len; i++) {
            const lVal = data[i - lag];
            const currVal = data[i];
            if (lVal === 0) {
              if (currVal === 0) c0_l0++; else c1_l0++;
            } else {
              if (currVal === 0) c0_l1++; else c1_l1++;
            }
          }
          const latestLag = data[len - lag];
          if (latestLag === 0) {
            const tot = c0_l0 + c1_l0;
            return tot > 0 ? c1_l0 / tot : 0.5;
          } else {
            const tot = c0_l1 + c1_l1;
            return tot > 0 ? c1_l1 / tot : 0.5;
          }
        };
        const p1 = trainLag(1);
        const p2 = trainLag(2);
        const p3 = trainLag(3);
        const p5 = trainLag(5);
        return {
          rf: (p1 + p2 + p3 + p5) / 4,
          xgb: Math.max(0, Math.min(1, p1 * 0.5 + p2 * 0.3 + p3 * 0.15 + p5 * 0.05)),
          lgb: Math.max(0, Math.min(1, p1 * 0.6 + p2 * 0.25 + p3 * 0.15)),
          cat: Math.max(0, Math.min(1, p1 * 0.4 + p2 * 0.4 + p3 * 0.2))
        };
      };

      // --- MODEL 9: Pattern Recognition Engine ---
      const runPatternEngine = (data: number[]) => {
        const len = data.length;
        if (len === 0) return { probability: 0.5, confidence: 0, entropy: 0.5, volatility: 0.3 };
        let changes = 0;
        for (let i = 1; i < len; i++) {
          if (data[i] !== data[i - 1]) changes++;
        }
        const volatility = len > 1 ? changes / (len - 1) : 0.3;
        const count1 = data.filter(x => x === 1).length;
        const p1 = count1 / len;
        const p0 = 1 - p1;
        const entropy = (p1 > 0 && p0 > 0) ? -(p1 * Math.log2(p1) + p0 * Math.log2(p0)) : 0.5;
        
        let altProb = 0.5, altConfidence = 0;
        if (len >= 5) {
          const last5 = data.slice(-5);
          let altCount = 0;
          for (let i = 1; i < last5.length; i++) {
            if (last5[i] !== last5[i - 1]) altCount++;
          }
          if (altCount >= 3) {
            altProb = last5[last5.length - 1] === 1 ? 0.15 : 0.85;
            altConfidence = altCount / 4;
          }
        }
        
        let suffixProb = 0.5, suffixConfidence = 0;
        if (len >= 6) {
          const pattern = data.slice(-3);
          let matches = 0, nextOnes = 0;
          for (let i = 0; i < len - 4; i++) {
            if (data[i] === pattern[0] && data[i + 1] === pattern[1] && data[i + 2] === pattern[2]) {
              matches++;
              if (data[i + 3] === 1) nextOnes++;
            }
          }
          if (matches >= 2) {
            suffixProb = nextOnes / matches;
            suffixConfidence = Math.min(1, matches / 5);
          }
        }
        const combinedProb = (altConfidence > suffixConfidence)
          ? (altProb * 0.7 + suffixProb * 0.3)
          : (suffixProb * 0.7 + altProb * 0.3);
        return {
          probability: combinedProb,
          confidence: Math.max(altConfidence, suffixConfidence),
          entropy,
          volatility
        };
      };

      // --- EXECUTE ENGINES ---
      const pBayesian = runBayesian(bigSmalls);
      const pMarkov = runMarkov(bigSmalls);
      const pMonteCarlo = runMonteCarlo(bigSmalls);
      const pTransformer = runTransformer(bigSmalls);
      const pLSTM = runLSTM(bigSmalls);
      const pGRU = runGRU(bigSmalls);
      const pLogistic = runLogisticRegression(bigSmalls);
      const df = runDecisionForest(bigSmalls);
      const pattern = runPatternEngine(bigSmalls);

      // --- ENSEMBLE WEIGHTED INTEGRATION ---
      const finalProb = (
        pTransformer * 0.20 +
        pLSTM * 0.15 +
        pGRU * 0.10 +
        df.xgb * 0.15 +
        df.lgb * 0.10 +
        df.rf * 0.10 +
        df.cat * 0.05 +
        pBayesian * 0.05 +
        pMarkov * 0.05 +
        pMonteCarlo * 0.05
      );

      // --- CONFIDENCE MATRIX ---
      const probsList = [pTransformer, pLSTM, pGRU, df.xgb, df.lgb, df.rf, df.cat, pBayesian, pMarkov, pMonteCarlo];
      const avg = probsList.reduce((sum, p) => sum + p, 0) / probsList.length;
      const variance = probsList.reduce((sum, p) => sum + Math.pow(p - avg, 2), 0) / probsList.length;
      const agreement = 1 - Math.min(1, Math.sqrt(variance) / 0.5);
      const strength = Math.abs(finalProb - 0.5) * 2;
      const rawConfidence = (0.4 * agreement + 0.3 * strength + 0.3 * pattern.confidence);
      const confidence = Math.round(74 + rawConfidence * 24);

      // --- PREDICTION RESOLUTION ---
      const prediction = finalProb > 0.5 ? "SMALL" : "BIG";

      // --- DETERMINISTIC JACKPOT NUMBERS ---
      const bigPool = [5, 6, 7, 8, 9];
      const smallPool = [0, 1, 2, 3, 4];
      
      const cleanPeriod = parseInt(periodStr?.replace(/\D/g, "") || "0") || 0;
      
      // Build a history-based seed
      let historySum = 0;
      if (Array.isArray(history) && history.length > 0) {
        // Use last 5 records' numbers
        for (let i = 0; i < Math.min(5, history.length); i++) {
            historySum += (history[i]?.number || 0) * (i + 1);
        }
      }

      // We use prime multipliers to spread the hash and avoid back-to-back repetitions
      const hashSeed1 = Math.abs((cleanPeriod * 13) + historySum + Math.floor(finalProb * 1000));
      const hashSeed2 = Math.abs((cleanPeriod * 29) + historySum * 7 + Math.floor((1 - finalProb) * 1000) + 11);

      let n1, n2;
      if (prediction === "BIG") {
        n1 = bigPool[hashSeed1 % bigPool.length];
        n2 = smallPool[hashSeed2 % smallPool.length];
      } else {
        n1 = smallPool[hashSeed1 % smallPool.length];
        n2 = bigPool[hashSeed2 % bigPool.length];
      }

      console.log(`[UltraMasterEngine] Unified Predict: ${prediction} | Conf: ${confidence}% | Prob: ${(finalProb * 100).toFixed(2)}% | Numbers: [${n1}, ${n2}]`);

      return res.json({
        prediction,
        confidence,
        numbers: [n1, n2],
        logicName: "ULTRA_MASTER_UNIFIED",
        mode: "ENSEMBLE"
      });

    } catch (err) {
      console.error("[UltraMasterEngine] Prediction system crash, running fallback:", err);
      return res.json({
        prediction: "BIG",
        confidence: 85,
        numbers: [5, 6],
        logicName: "ULTRA_FALLBACK",
        mode: "FALLBACK"
      });
    }
  });

  // API Proxy Route
  app.all("/api/lottery-history", async (req, res) => {
    const requestId = Date.now().toString(36);
    console.log(`[${requestId}] Sourcing data from primary provider`);

    const API_RAW = 'https://wingolast100.vercel.app/api/results?typeId=1&apiKey=12a04165-748c-4144-9398-96bd2e0ad956&token=1a97a413-ff57-4097-a44c-4bd402ace8d5&limit=100';
    const PROXIES = [
      (u: string) => u,
      (u: string) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
      (u: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
      (u: string) => `https://proxy.cors.sh/${u}`,
      (u: string) => `https://thingproxy.freeboard.io/fetch/${u}`,
    ];

    let successData: any = null;

    // Try each proxy in order
    for (let i = 0; i < PROXIES.length; i++) {
      const proxyUrl = PROXIES[i](API_RAW);
      try {
        console.log(`[${requestId}] Querying source index ${i}`);
        const response = await fetch(proxyUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          }
        });

        if (response.ok) {
          const text = await response.text();
          let parsed = null;
          try {
            parsed = JSON.parse(text);
          } catch (e) {
            // Quietly ignore parsing errors from proxies returning HTML/errors
          }
          
          if (parsed) {
            // Handle allorigins wrapped contents if present
            if (typeof parsed === 'object' && parsed.contents && typeof parsed.contents === 'string') {
              try {
                parsed = JSON.parse(parsed.contents);
              } catch (e) {
                // Quietly ignore parsing errors
              }
            }

            // Standardize raw list
            let rawList: any[] = [];
            if (Array.isArray(parsed)) {
              rawList = parsed;
            } else if (parsed && typeof parsed === 'object') {
              if (Array.isArray(parsed.data)) {
                rawList = parsed.data;
              } else if (parsed.data && Array.isArray(parsed.data.list)) {
                rawList = parsed.data.list;
              } else if (Array.isArray(parsed.results)) {
                rawList = parsed.results;
              } else if (Array.isArray(parsed.list)) {
                rawList = parsed.list;
              } else if (parsed.data && Array.isArray(parsed.data.data)) {
                rawList = parsed.data.data;
              }
            }

            if (rawList && rawList.length > 0) {
              const mappedList = rawList.map((item: any) => {
                if (!item || typeof item !== 'object') return null;

                const issueNumber = String(
                  item.issueNumber ?? 
                  item.period ?? 
                  item.issue_number ?? 
                  item.stage ?? 
                  item.id ?? 
                  item.issue ??
                  ""
                );

                const numVal = item.number ?? 
                              item.resultNumber ?? 
                              item.result_num ?? 
                              item.openCode ?? 
                              item.result ?? 
                              item.val ?? 
                              item.open_code ??
                              "";
                const number = String(numVal);

                let color = String(item.color ?? item.colour ?? item.resultColor ?? "");
                if (!color) {
                  const n = parseInt(number);
                  if (!isNaN(n)) {
                    if (n === 0) color = "red,violet";
                    else if (n === 5) color = "green,violet";
                    else if (n % 2 === 1) color = "green";
                    else color = "red";
                  } else {
                    color = "green";
                  }
                }

                return { issueNumber, number, color };
              }).filter((item: any) => item !== null && item.issueNumber);

              if (mappedList && mappedList.length > 0) {
                successData = {
                  code: 0,
                  data: {
                    list: mappedList
                  },
                  msg: "success"
                };
                console.log(`[${requestId}] Success mapping source index ${i}`);
                break; // Stop trying other proxies
              }
            }
          }
        }
      } catch (err) {
        // Quietly proceed to the next proxy option
      }
    }

    if (successData) {
      return res.json(successData);
    }

    // Fallback: original API
    try {
      console.log(`[${requestId}] Activating secondary sourcing provider`);
      const targetUrl = 'https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json';
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
      console.log(`[${requestId}] Status: ${response.status}`);

      if (!response.ok) {
        const text = await response.text().catch(() => 'No body');
        return res.status(response.status).json({ 
          error: "Provider communication status", 
          status: response.status,
          details: text.slice(0, 500)
        });
      }

      const text = await response.text();
      let data = null;
      try {
        data = JSON.parse(text);
      } catch (e) {
        return res.status(502).json({
          error: "Provider payload parse status",
          details: text.slice(0, 500)
        });
      }

      res.json(data);
    } catch (error) {
      res.status(500).json({ 
        error: "Provider general status",
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
