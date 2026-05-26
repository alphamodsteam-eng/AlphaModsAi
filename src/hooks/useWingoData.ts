import { useState, useEffect, useCallback, useRef } from 'react';
import { getPrediction } from '../services/predictionEngine';

// ====================================================================
// ALPHA SERVER - OMNI-ADAPTIVE PREDICTION ENGINE
// ====================================================================

export interface LotteryResult {
  issueNumber: string;
  number: string;
  color: string;
}

export interface PredictionRecord {
  period: string;
  prediction: string;
  predictedNumbers?: number[];
  actual?: string;
  actualNumber?: number;
  status: 'Win' | 'Loss' | 'Pending' | 'Jackpot';
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
  }, []);

  // Handle predictions history updates whenever allResults changes
  useEffect(() => {
    if (allResults.length === 0) return;

    const latestResult = allResults[0];
    const upcomingPeriod = addOneToBigNumber(latestResult.issueNumber);
      
    // Set pending resolutions
    setPredictionsHistory(prevHistory => {
        let updatedHistory = [...prevHistory];
        let changed = false;

        // 1. Process pending predictions for the results we just got
        let resolvedRecord: PredictionRecord | null = null;
        updatedHistory = updatedHistory.map(record => {
          if (record.status === 'Pending') {
            const matchingResult = allResults.find(r => r.issueNumber === record.period);
            if (matchingResult) {
              const actualNum = parseInt(matchingResult.number);
              const actual = actualNum >= 5 ? "Big" : "Small";
              const isWin = record.prediction === actual;
              const isJackpot = record.predictedNumbers?.includes(actualNum);
              
              changed = true;
              const updated = {
                ...record,
                actual,
                actualNumber: actualNum,
                status: isJackpot ? 'Jackpot' : (isWin ? 'Win' : 'Loss')
              };
              resolvedRecord = updated;
              return updated;
            }
          }
          return record;
        });

        if (resolvedRecord) {
          setLastResolved(resolvedRecord);
        }
        if (changed) {
            localStorage.setItem('predictionsHistory', JSON.stringify(updatedHistory));
        }
        return updatedHistory;
    });

    // 2. Predict for the next period if not already predicted
    const performPrediction = async () => {
        const ultimateResult = await getPrediction(allResults);
        const predictionValue = ultimateResult.prediction === "BIG" ? "Big" : "Small";
        
        setPredictionsHistory(prevHistory => {
            if (!prevHistory.some(r => r.period === upcomingPeriod)) {
                const upcomingRecord: PredictionRecord = {
                    period: upcomingPeriod,
                    prediction: predictionValue,
                    predictedNumbers: ultimateResult.numValues,
                    status: 'Pending',
                    confidence: ultimateResult.confidence,
                    num: ultimateResult.numValues.join(','),
                    mode: ultimateResult.mode
                };
                const updated = [upcomingRecord, ...prevHistory];
                localStorage.setItem('predictionsHistory', JSON.stringify(updated));
                return updated;
            }
            return prevHistory;
        });
    };

    performPrediction();
        
  }, [allResults]);

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

  const deleteHistoryEntry = useCallback((period: string) => {
    setPredictionsHistory(prev => {
      const filtered = prev.filter(p => p.period !== period);
      localStorage.setItem('predictionsHistory', JSON.stringify(filtered));
      return filtered;
    });
  }, []);

  return {
    allResults,
    predictionsHistory,
    isLoading,
    error,
    lastResolved,
    setLastResolved,
    clearHistory,
    deleteHistoryEntry,
    currentPeriod: allResults.length > 0 ? addOneToBigNumber(allResults[0].issueNumber) : '--',
    nextPrediction: predictionsHistory.length > 0 && predictionsHistory[0].status === 'Pending' ? predictionsHistory[0].prediction : 'Calculating...',
    nextConfidence: predictionsHistory.length > 0 && predictionsHistory[0].status === 'Pending' ? predictionsHistory[0].confidence : 85
  };
};
