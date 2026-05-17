import { useState, useEffect, useCallback, useRef } from 'react';

// ====================================================================
// ALPHA SERVER - OMNI-ADAPTIVE PREDICTION ENGINE
// ====================================================================

class AlphaServer {
    
    constructor() {
    }

    parseHistory(rawHistory: any[]) {
        if (!rawHistory || rawHistory.length === 0) return [];
        return rawHistory.map(item => {
            let num = parseInt(item.number ?? item);
            if (isNaN(num)) num = Math.floor(Math.random() * 10);
            return {
                num: num,
                size: num >= 5 ? "BIG" : "SMALL"
            };
        });
    }

    getPrediction(rawHistory: any[], currentPeriod: string) {
        const history = this.parseHistory(rawHistory);
        
        if (history.length < 10) {
            // Default prediction if less than 10 results
            const size = history[0]?.size || "BIG";
            return { size, numbers: [1, 2], mode: "INITIALIZING" };
        }

        const ninthNum = history[8].num;
        const tenthNum = history[9].num;
        const diff = Math.abs(ninthNum - tenthNum);
        
        // Mapping: 0,1,2,3,4 = SMALL; 5,6,7,8,9 = BIG
        // User wants REVERSED prediction:
        // If diff is 5-9 (Big) -> Predict SMALL
        // If diff is 0-4 (Small) -> Predict BIG
        const predictedSize = (diff >= 5) ? "SMALL" : "BIG";
        
        return {
            size: predictedSize,
            numbers: [ninthNum, tenthNum],
            mode: `Alpha: ${predictedSize}`
        };
    }
}



export interface LotteryResult {
  issueNumber: string;
  number: string;
  color: string;
}

export interface PredictionRecord {
  period: string;
  prediction: string;
  actual?: string;
  status: 'Win' | 'Loss' | 'Pending';
  confidence: number;
  num?: string;
  mode?: string;
}

const API_URL = '/api/lottery-history';

const predictor = new AlphaServer();

export function useWingoData() {
  const [allResults, setAllResults] = useState<LotteryResult[]>([]);
  const [predictionsHistory, setPredictionsHistory] = useState<PredictionRecord[]>(() => {
    const saved = localStorage.getItem('predictionsHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResolved, setLastResolved] = useState<PredictionRecord | null>(null);

  const addOneToBigNumber = (numStr: string) => {
    let carry = 1;
    let result = "";
    for (let i = numStr.length - 1; i >= 0; i--) {
      const sum = parseInt(numStr[i]) + carry;
      if (sum >= 10) {
        carry = 1;
        result = "0" + result;
      } else {
        carry = 0;
        result = sum.toString() + result;
      }
    }
    if (carry === 1) result = "1" + result;
    return result;
  };

  const advancedPredict = useCallback((results: LotteryResult[], currentPeriod: string) => {
    const prediction = predictor.getPrediction(results, currentPeriod);
    return {
        pred: prediction.size,
        confidence: 88,
        num: prediction.numbers.join(','),
        mode: prediction.mode
    };
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      // Use no-cache to ensure we always get fresh data
      const resp = await fetch(`${API_URL}?ts=${Date.now()}`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!resp.ok) {
        const errorText = await resp.text().catch(() => "Unknown error");
        if (resp.status === 404) {
           throw new Error("API Proxy not found (404). If hosting on Netlify, please ensure netlify.toml is correct and you have deployed it.");
        }
        throw new Error(`Network issue (${resp.status}): ${resp.statusText}`);
      }

      const rawText = await resp.text();
      let data;
      try {
        data = JSON.parse(rawText);
      } catch (e) {
        // If we get HTML instead of JSON, it's usually a 404/Redirect page from the host
        if (rawText.toLowerCase().includes("<!doctype html>") || rawText.toLowerCase().includes("<html")) {
          throw new Error("Received HTML instead of API data. This usually means your hosting platform is serving a 404 page for the API route.");
        }
        throw new Error("Invalid response format from API. " + (rawText.slice(0, 50) + "..."));
      }

      if (data.code === 0 && data.data?.list) {
        setAllResults(currentResults => {
          const newList = data.data.list as LotteryResult[];
          // Update if newList is different from currentResults
          if (newList.length > 0 && (currentResults.length === 0 || newList[0].issueNumber !== currentResults[0].issueNumber)) {
            return newList;
          }
          return currentResults;
        });
      }
    } catch (err) {
      // "Failed to fetch" is usually a network interruption or CORS issue
      const msg = err instanceof Error ? err.message : String(err);
      if (msg === "Failed to fetch") {
        setError("Failed to reach API server. Check your internet connection or proxy settings.");
      } else {
        setError(msg);
      }
      console.warn("Fetch issue:", msg);
    }
  }, [advancedPredict]);

  // Handle predictions history updates whenever allResults changes
  useEffect(() => {
    if (allResults.length === 0) return;

    const latestResult = allResults[0];
    const upcomingPeriod = addOneToBigNumber(latestResult.issueNumber);

    setPredictionsHistory(prevHistory => {
      let updatedHistory = [...prevHistory];
      let changed = false;

      // 1. Process pending predictions for the results we just got
      // We check all potential pending ones in case we missed some intervals
      let resolvedRecord: PredictionRecord | null = null;
      updatedHistory = updatedHistory.flatMap(record => {
        if (record.status === 'Pending') {
          const matchingResult = allResults.find(r => r.issueNumber === record.period);
          if (matchingResult) {
            
            if (record.prediction === 'WAITING') {
              changed = true;
              return []; // Remove WAITING records silently
            }
            const actual = parseInt(matchingResult.number) >= 5 ? "Big" : "Small";
            const isWin = record.prediction === actual;
            changed = true;
            const updated = {
              ...record,
              actual,
              status: isWin ? 'Win' : 'Loss' as const
            };
            resolvedRecord = updated;
            return [updated];
          }
        }
        return [record];
      });

      if (resolvedRecord) {
        setLastResolved(resolvedRecord);
      }

      // 2. Predict for the next period if not already predicted
      if (!updatedHistory.some(r => r.period === upcomingPeriod)) {
        const ultimateResult = advancedPredict(allResults, upcomingPeriod);
        const predictionValue = ultimateResult.pred === "BIG" ? "Big" : ultimateResult.pred === "SMALL" ? "Small" : ultimateResult.pred;
        
        if (predictionValue !== "WAITING") {
          const upcomingRecord: PredictionRecord = {
            period: upcomingPeriod,
            prediction: predictionValue,
            status: 'Pending',
            confidence: ultimateResult.confidence,
            num: ultimateResult.num,
            mode: ultimateResult.mode
          };
          updatedHistory = [upcomingRecord, ...updatedHistory];
          changed = true;
        }
      }

      if (changed) {
        localStorage.setItem('predictionsHistory', JSON.stringify(updatedHistory));
        return updatedHistory;
      }
      return prevHistory;
    });
  }, [allResults, advancedPredict]);

  useEffect(() => {
    setIsLoading(true);
    fetchData().finally(() => setIsLoading(false));
    const interval = setInterval(fetchData, 1500);
    return () => clearInterval(interval);
  }, [fetchData]);

  const clearHistory = useCallback(() => {
    setPredictionsHistory([]);
    localStorage.removeItem('predictionsHistory');
  }, []);

  return {
    allResults,
    predictionsHistory,
    isLoading,
    error,
    lastResolved,
    setLastResolved,
    clearHistory,
    currentPeriod: allResults.length > 0 ? addOneToBigNumber(allResults[0].issueNumber) : '--',
    nextPrediction: allResults.length > 0 ? (advancedPredict(allResults, addOneToBigNumber(allResults[0].issueNumber)).pred === "BIG" ? "Big" : advancedPredict(allResults, addOneToBigNumber(allResults[0].issueNumber)).pred === "SMALL" ? "Small" : "WAITING") : 'Calculating...',
    nextConfidence: allResults.length > 0 ? advancedPredict(allResults, addOneToBigNumber(allResults[0].issueNumber)).confidence : 85
  };
};
