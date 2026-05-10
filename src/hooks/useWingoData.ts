import { useState, useEffect, useCallback } from 'react';

// =================================================================
// KINGPIN LOGIC (V12.0)
// =================================================================

(window as any).kingpinLogic = function(list: any[]) {
    try {
        if (!list || list.length < 5) return "WAIT";

        const lastResult = list[0].actualBS; 
        const lastNum = parseInt(list[0].number);
        const historyBS = list.slice(0, 20).map((x: any) => x.actualBS); 
        
        const bigCount = historyBS.filter((x: any) => x === 'BIG').length;
        const smallCount = historyBS.filter((x: any) => x === 'SMALL').length;

        if (list.length >= 2) {
            const prevResult = list[1].actualBS;
            const prevPred = list[1].prediction; 

            if (lastResult === "BIG" && list[1].actualBS === "SMALL") {
                return "SMALL"; 
            }
        }

        const redVioletNumbers = [0, 2, 4, 5, 6, 8]; 
        const lastFewNums = list.slice(0, 10).map((x: any) => parseInt(x.number));
        const redCount = lastFewNums.filter((n: any) => [0, 2, 4, 6, 8].includes(n)).length;

        if (redCount > 6) {
            return Math.random() > 0.3 ? "BIG" : "SMALL";
        }

        const pattern = list.slice(0, 4).map((x: any) => x.actualBS === "BIG" ? "B" : "S").join("");

        const strategies: Record<string, string> = {
            "BBBB": "SMALL", 
            "SSSS": "BIG",   
            "BSBS": "BIG",   
            "SBSB": "SMALL",
            "BBSS": "BIG",   
            "SSBB": "SMALL",
            "BBSB": "SMALL",
            "SSBS": "BIG",
            "BSSS": "SMALL",
            "SBBB": "BIG"
        };

        if (strategies[pattern]) {
            return strategies[pattern];
        }

        if (smallCount > 12) return "BIG"; 
        if (bigCount > 12) return "SMALL";

        return lastResult === "BIG" ? "SMALL" : "BIG";

    } catch (err) {
        console.log("KINGPIN ERROR:", err);
        return "WAIT";
    }
};

const getKingpinPrediction = (results: LotteryResult[]) => {
    const listWithActualBS = results.map(r => ({
      ...r,
      actualBS: parseInt(r.number) >= 5 ? 'BIG' : 'SMALL'
    }));
    
    let resultStr = "WAIT";
    if (typeof (window as any).kingpinLogic === 'function') {
      resultStr = (window as any).kingpinLogic(listWithActualBS);
    }
    
    return {
      pred: resultStr === "WAIT" ? "WAITING" : resultStr,
      confidence: resultStr === "WAIT" ? 0 : 88,
      num: "--",
      mode: "KINGPIN_LOGIC"
    };
};


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

  const advancedPredict = useCallback((results: LotteryResult[]) => {
    return getKingpinPrediction(results);
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
        const ultimateResult = advancedPredict(allResults);
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
    nextPrediction: allResults.length > 0 ? (advancedPredict(allResults).pred === "BIG" ? "Big" : advancedPredict(allResults).pred === "SMALL" ? "Small" : "WAITING") : 'Calculating...',
    nextConfidence: allResults.length > 0 ? advancedPredict(allResults).confidence : 85
  };
}
