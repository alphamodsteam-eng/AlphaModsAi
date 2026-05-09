import { useState, useEffect, useCallback } from 'react';

// ==========================================
// 🚀 PREMIER HYBRID LOGIC ENGINE (V4.0)
// ==========================================

const kingpinLogic = function(list: any[]) {
    try {
        if (!list || list.length < 10) return "WAIT";

        // --- PREMIER LOGIC ENGINE: THE OMNI-STRATEGY ---
        const OMNI_CORE = {
            // PATTERN_PRED_9 ડેટાનો ઉપયોગ 'Pattern Intelligence' માટે થશે
            patterns: typeof (window as any).PATTERN_PRED_9 !== 'undefined' ? (window as any).PATTERN_PRED_9 : {}, 

            // 1. ADVANCED MULTIVARIATE ANALYSIS
            analyzeMarket: function(buf: any[]) {
                const history = buf.map(x => (parseInt(x.number) >= 5 ? "BIG" : "SMALL") === "BIG" ? 1 : 0);
                const decay = 0.995;
                let weightedSum = 0, totalWeight = 0;
                
                history.forEach((val, i) => {
                    const w = Math.pow(decay, i);
                    weightedSum += val * w;
                    totalWeight += w;
                });

                const trendM = weightedSum / (totalWeight || 1);
                const volatility = Math.sqrt(history.slice(0, 15).reduce((a, b) => a + Math.pow(b - 0.5, 2), 0) / 15);
                
                return { trendM, volatility };
            },

            // 2. CANDIDATE NUMBER & POINTS SYSTEM (Furious Logic)
            getPointBasedNumber: function(buf: any[], predictedSize: string) {
                const latestNum = parseInt(buf[0].number);
                const gameHistory = buf.map(r => parseInt(r.number));
                
                // Candidate Map
                const map: {[key: number]: number[]} = {
                    0:[1,2,4,5,7], 1:[3,1,5,7], 2:[4,0,5,6,8], 3:[1,7,9,5], 4:[0,2,6,8],
                    5:[2,1,0,7,6], 6:[8,4,0,9], 7:[9,7,1,5,3], 8:[6,4,5,2], 9:[7,9,0,3,5]
                };
                
                let candidates = map[latestNum] || [1,3,5,7,9];
                let scoredCandidates = candidates.map(num => {
                    let pts = 0;
                    // Frequency & Gap Points
                    const freq = gameHistory.filter(n => n === num).length;
                    pts += freq * 5;
                    if (Math.abs(num - latestNum) <= 1) pts += 20; // Proximity bonus
                    if ((predictedSize === "BIG" && num >= 5) || (predictedSize === "SMALL" && num < 5)) pts += 30;
                    return { num, pts };
                });

                return scoredCandidates.sort((a, b) => b.pts - a.pts)[0].num;
            },

            // 3. MASTER VOTE SYSTEM (Combining All 6 Engines)
            executeMasterLogic: function(buf: any[]) {
                if (buf.length < 10) return { pred: 'WAIT', confidence: 0 };

                // એન્જિન રીડિંગ્સ (Fallback to internal logic if external engines not found)
                const ldn = typeof (window as any).engineLDN === 'function' ? (window as any).engineLDN(buf) : { pred: (parseInt(buf[0].number) >= 5 ? "BIG" : "SMALL") };
                const n1  = typeof (window as any).engineN1 === 'function' ? (window as any).engineN1(buf) : { pred: (parseInt(buf[1].number) >= 5 ? "BIG" : "SMALL") };
                const n2  = typeof (window as any).engineN2 === 'function' ? (window as any).engineN2(buf, false) : { pred: 'WAIT' };
                const f5  = typeof (window as any).engineFreq5 === 'function' ? (window as any).engineFreq5(buf) : { pred: 'WAIT' };
                const str = typeof (window as any).engineStreak === 'function' ? (window as any).engineStreak(buf) : { pred: 'WAIT' };
                const p3  = typeof (window as any).enginePat3 === 'function' ? (window as any).enginePat3(buf) : { pred: 'WAIT' };
                const mv  = this.analyzeMarket(buf);

                // વોટિંગ મેટ્રિક્સ
                let votes: {[key: string]: number} = { BIG: 0, SMALL: 0 };
                [ldn, n1, n2, f5, str, p3].forEach(e => {
                    if (e && e.pred !== 'WAIT') votes[e.pred]++;
                });

                // 9-Pattern Logic Integration (High Priority)
                const patStr = buf.slice(0, 9).map(x => parseInt(x.number) >= 5 ? "B" : "S").reverse().join("");
                let patternBoost = this.patterns[patStr] || null;

                // Final Decision Core
                let finalBS = votes.BIG > votes.SMALL ? "BIG" : "SMALL";
                if (patternBoost) finalBS = patternBoost === "B" ? "BIG" : "SMALL"; 

                // Confidence Calculation
                let baseConf = (Math.max(votes.BIG, votes.SMALL) / ((votes.BIG + votes.SMALL) || 1)) * 100;
                if (mv.volatility > 0.6) baseConf -= 10; 

                const predictedNumber = this.getPointBasedNumber(buf, finalBS);

                return {
                    prediction: finalBS,
                    number: predictedNumber,
                    confidence: Math.round(baseConf),
                    regime: mv.trendM > 0.6 ? "BULLISH" : mv.trendM < 0.4 ? "BEARISH" : "STABLE"
                };
            }
        };

        // --- KINGPIN CUSTOM PATTERN SEARCH LOGIC ---
        const currentPattern = list.slice(0, 3)
            .map(x => parseInt(x.number) >= 5 ? "B" : "S")
            .reverse()
            .join("-");

        let bCount = 0, sCount = 0, totalMatches = 0;

        for (let i = 1; i < list.length - 4; i++) {
            const pastPattern = list.slice(i, i + 3)
                .map(x => parseInt(x.number) >= 5 ? "B" : "S")
                .reverse()
                .join("-");

            if (pastPattern === currentPattern) {
                totalMatches++;
                const nextResult = parseInt(list[i - 1].number) >= 5 ? "B" : "S";
                if (nextResult === "B") bCount++; else sCount++;
            }
        }

        // Integration of OMNI_CORE into final response
        const omniResult = OMNI_CORE.executeMasterLogic(list);
        
        // Majority Voting between Kingpin Logic and Omni Logic
        let finalPred = omniResult.prediction;
        
        if (totalMatches > 0) {
            const kingpinPred = (bCount >= sCount) ? "BIG" : "SMALL";
            // If Kingpin logic is strong, it influences the result
            if (kingpinPred !== finalPred && totalMatches > 5) {
                finalPred = kingpinPred; 
            }
        }

        return finalPred === "BIG" ? "Big" : "Small";

    } catch (err) {
        console.log("LOGIC ERROR:", err);
        return "WAIT";
    }
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
    return kingpinLogic(results);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const resp = await fetch(`${API_URL}?ts=${Date.now()}`);
      if (!resp.ok) {
        const errorText = await resp.text().catch(() => "Unknown error");
        if (resp.status === 502 || resp.status === 503 || errorText.includes("Starting Server...")) {
          console.warn("Server unavailable, retrying...");
          return;
        }
        let details = resp.statusText;
        try {
          const errorData = JSON.parse(errorText);
          details = errorData.error || errorData.details || details;
        } catch (e) {
          details = errorText.slice(0, 500) || details;
        }
        throw new Error(`Proxy error (${resp.status}): ${details}`);
      }

      const contentType = resp.headers.get("content-type");
      const rawText = await resp.text();

      if (!contentType || !contentType.includes("application/json")) {
        if (rawText.includes("<title>Starting Server...</title>") || rawText.includes("<!doctype html>")) {
          console.warn("Dev server is still starting or restarting. Retrying soon...");
          return; // Silently ignore and wait for next poll
        }
        console.error("Non-JSON response body:", rawText.slice(0, 1000));
        throw new Error(`Expected JSON but got ${contentType || 'no content type'}. This usually means a 404 or redirect occurred.`);
      }

      let data;
      try {
        data = JSON.parse(rawText);
      } catch (e) {
        console.error("JSON parse failed. Raw body:", rawText.slice(0, 1000));
        throw new Error("Failed to parse response as JSON. Check console for body.");
      }
      if (data.code === 0 && data.data?.list) {
        setError(null);
        setAllResults(currentResults => {
          const newList = data.data.list as LotteryResult[];
          if (newList.length === 0) return newList;

          const latestResult = newList[0];
          const upcomingPeriod = addOneToBigNumber(latestResult.issueNumber);

          setPredictionsHistory(prevHistory => {
            let updatedHistory = [...prevHistory];
            let changed = false;

            // 1. Check if we need to update a pending prediction for the current latestResult
            const pendingIndex = updatedHistory.findIndex(r => r.period === latestResult.issueNumber && r.status === 'Pending');
            if (pendingIndex !== -1) {
              const pendingRecord = updatedHistory[pendingIndex];
              const actual = parseInt(latestResult.number) >= 5 ? "Big" : "Small";
              const isWin = pendingRecord.prediction === actual;
              
              updatedHistory[pendingIndex] = {
                ...pendingRecord,
                actual,
                status: isWin ? 'Win' : 'Loss'
              };
              changed = true;
            }

            // 2. Ensure we have a prediction for the upcoming period
            if (!updatedHistory.some(r => r.period === upcomingPeriod)) {
              const nextPred = advancedPredict(newList);
              const upcomingRecord: PredictionRecord = {
                period: upcomingPeriod,
                prediction: nextPred,
                status: 'Pending',
                confidence: Math.floor(Math.random() * (95 - 75 + 1) + 75)
              };
              updatedHistory = [upcomingRecord, ...updatedHistory];
              changed = true;
            }

            if (changed) {
              localStorage.setItem('predictionsHistory', JSON.stringify(updatedHistory));
              return updatedHistory;
            }
            return prevHistory;
          });

          return newList;
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("Fetch issue:", msg);
      setError(msg);
    }
  }, [advancedPredict]);

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
    clearHistory,
    currentPeriod: allResults.length > 0 ? addOneToBigNumber(allResults[0].issueNumber) : '--',
    nextPrediction: allResults.length > 0 ? advancedPredict(allResults) : 'Calculating...'
  };
}
