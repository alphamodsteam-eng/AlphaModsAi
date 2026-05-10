import { useState, useEffect, useCallback } from 'react';

// =================================================================
// ITACHI LOGIC CORE (V11.0)
// FEATURES: Breakout Detection, Multivariates, Transitions.
// =================================================================

const getUltimatePrediction = function(historyList: LotteryResult[]) {
    try {
        if (!historyList || historyList.length < 5) {
            return { pred: "WAITING", confidence: 0, num: "--", mode: "NEURAL_ANALYSIS" };
        }

        const PATTERN_PRED_9: Record<string, string> = {
            "BSBSBBBBS": "SMALL", "SBSBBBBSB": "SMALL", "BSBBBBSBB": "SMALL", "SBBBBSBBB": "SMALL", "BBBBBSBBBB": "BIG",
            "BBBSBBBBS": "BIG", "BBSBBBBSS": "BIG", "BSBBBBSSS": "BIG", "SBBBBSSSS": "BIG", "BBBBSSSSS": "BIG",
            "BBBSSSSSS": "BIG", "BBSSSSSSS": "SMALL", "BSSSSSSSB": "BIG", "SSSSSSSBS": "SMALL", "SSSSSSBSB": "SMALL",
            "SSSSSBSBB": "BIG", "SSSSBSBBS": "BIG", "SSSBSBBSS": "BIG", "SSBSBBSSS": "SMALL", "SBSBBSSSB": "SMALL",
            "BSBBSSSBB": "SMALL", "SBBSSSBBB": "BIG", "BBSSSBBBS": "SMALL", "BSSSBBBSB": "SMALL", "SSSBBBSBB": "BIG",
            "SSBBBSBBS": "BIG", "SBBBSBBSS": "BIG", "BBBSBBSSS": "SMALL", "BBSBBSSSB": "SMALL", "SBBSSSBBB": "SMALL",
            "BBSSSBBBB": "SMALL", "BSSSBBBBB": "BIG", "SSSBBBBBS": "BIG", "SSBBBBBSS": "BIG", "SBBBBBSSS": "BIG",
            "BBBBBSSSS": "SMALL", "BBBBSSSSB": "SMALL", "BBBSSSSBB": "BIG", "BBSSSSBBS": "BIG", "BSSSSBBSS": "SMALL",
            "SSSSBBSSB": "SMALL", "SSSBBSSBB": "BIG", "SSBBSSBBS": "BIG", "SBBSSBBSS": "BIG", "BBSSBBSSS": "BIG",
            "BSSBBSSSS": "SMALL", "SSBBSSSSB": "SMALL", "SBBSSSSBB": "SMALL", "BBSSSSBBB": "BIG", "BSSSSBBBS": "BIG",
            "SSSSBBBSS": "BIG", "SSSBBBSSS": "SMALL", "SSBBBSSSB": "SMALL", "SBBBSSSBB": "BIG", "BBBSSSBBS": "SMALL",
            "BBSSSBBSB": "BIG", "BSSSBBSBS": "SMALL", "SSSBBSBSB": "BIG", "SSBBSBSBS": "SMALL", "SBBSBSBSB": "SMALL",
            "BBSBSBSBB": "BIG", "BSBSBSBBS": "BIG", "SBSBSBBSS": "SMALL", "BSBSBBSSB": "BIG", "SBSBBSSBS": "SMALL",
            "BSBBSSBSB": "SMALL", "SBBSSBSBB": "BIG", "BBSSBSBBS": "SMALL", "BSSBSBBSB": "BIG", "SSBSBBSBS": "BIG",
            "SBSBBSBSS": "SMALL", "BSBBSBSSB": "BIG", "SBBSBSSBS": "SMALL", "BBSBSSBSB": "SMALL", "BSBSSBSBB": "BIG",
            "SBSSBSBBS": "SMALL", "BSSBSBBSB": "SMALL", "SSBSBBSBB": "BIG", "SBSBBSBBS": "BIG", "BSBBSBBSS": "SMALL",
            "SBBSBBSSB": "BIG", "BBSBBSSBS": "SMALL", "BSBBSSBSB": "BIG", "SBBSSBSBS": "BIG", "BBSSBSBSS": "SMALL",
            "BSSBSBSSB": "BIG", "SSBSBSSBS": "BIG", "SBSBSSBSS": "BIG", "BSBSSBSSS": "BIG", "SBSSBSSSS": "SMALL",
            "BSSBSSSSB": "SMALL", "SSBSSSSBB": "BIG", "SBSSSSBBS": "BIG", "BSSSSBBSS": "BIG", "SSSSBBSSS": "BIG",
            "SSSBBSSSS": "SMALL", "SBBSSSSBB": "BIG", "BBSSSSBBS": "SMALL", "BSSSSBBSB": "SMALL", "SSSSBBSBB": "SMALL",
            "SSSBBSBBB": "BIG", "SSBBSBBBS": "BIG", "SBBSBBBSS": "SMALL", "BBSBBBSSB": "SMALL", "BSBBBSSBB": "SMALL",
            "SBBBSSBBB": "SMALL", "BBBSSBBBB": "BIG", "BBSSBBBBS": "BIG", "BSSBBBBSS": "SMALL", "SSBBBBSSB": "SMALL",
            "SBBBBSSBB": "BIG", "BBBBSSBBS": "SMALL", "BBBSSBBSB": "SMALL", "BBSSBBSBB": "SMALL", "BSSBBSBBB": "BIG",
            "SSBBSBBBS": "SMALL", "SBBSBBBSB": "BIG", "BBSBBBSBS": "BIG", "BSBBBSBSS": "SMALL", "SBBBSBSSB": "SMALL",
            "BBBSBSSBB": "SMALL", "BBSBSSBBB": "SMALL", "BSBSSBBBB": "BIG", "SBSSBBBBS": "BIG", "BSSBBBBSS": "BIG",
            "SSBBBBSSS": "BIG", "BBBBSSSSS": "SMALL", "BBBSSSSSB": "BIG", "BBSSSSSBS": "BIG", "BSSSSSBSS": "BIG",
            "SSSSSBSSS": "SMALL", "SSSSBSSSB": "BIG", "SSSBSSSBS": "SMALL", "SSBSSSBSB": "BIG", "SBSSSBSBS": "SMALL",
            "BSSSBSBSB": "BIG", "SSSBSBSBS": "BIG", "SSBSBSBSS": "BIG", "SBSBSBSSS": "BIG", "BSBSBSSSS": "SMALL",
            "SBSBSSSSB": "BIG", "BSBSSSSBS": "BIG", "SBSSSSBSS": "SMALL", "BSSSSBSSB": "SMALL", "SSSSBSSBB": "BIG",
            "SSSBSSBBS": "BIG", "SSBSSBBSS": "BIG", "SBSSBBSSS": "BIG", "BSSBBSSSS": "BIG", "SSBBSSSSS": "BIG",
            "SBBSSSSSS": "BIG", "BBSSSSSSS": "BIG", "BSSSSSSSS": "SMALL", "SSSSSSSSB": "SMALL", "SSSSSSSBB": "SMALL",
            "SSSSSSBBB": "BIG", "SSSSSBBBS": "BIG", "SSBBBSSSB": "BIG", "SBBBSSSBS": "BIG", "BBBSSSBSS": "BIG",
            "BBSSSBSSS": "BIG", "BSSSBSSSS": "SMALL", "SSSBSSSSB": "BIG", "SSBSSSSBS": "SMALL", "SBSSSSBSB": "BIG",
            "BSSSSBSBS": "BIG", "SSSSBSBSS": "SMALL", "SSSBSBSSB": "SMALL", "SSBSBSSBB": "BIG", "SBSBSSBBS": "BIG",
            "BSBSSBBSS": "BIG", "SBBSSSSSB": "SMALL", "BBSSSSSBB": "SMALL", "BSSSSSBBB": "BIG",
            "SSSBBBSSB": "BIG", "SSBBBSSBS": "SMALL", "SBBBSSBSB": "BIG", "BBBSSBSBS": "BIG",
            "SSBSBSSBB": "SMALL", "SBSBSSBBB": "BIG", "BSBSSBBBS": "SMALL", "SBSSBBBSB": "BIG",
            "BSSBBBSBS": "BIG", "SSBBBSBSS": "SMALL", "BBBSBSSBS": "SMALL", "BSBSSBSBB": "SMALL",
            "SBSSBSBBB": "SMALL", "BSSBSBBBB": "BIG", "SSBSBBBBS": "BIG", "SBSBBBBSS": "SMALL", "BSBBBBSSB": "BIG",
            "SBBBBSSBS": "BIG", "BBBSSBSSS": "SMALL", "BBSSBSSSB": "SMALL", "BSSBSSSBB": "BIG",
            "SSBSSSBBS": "SMALL", "SBSSSBBSB": "BIG", "SSSBBSBSS": "BIG", "SSBBSBSSS": "SMALL",
            "SBBSBSSSB": "BIG", "BBSBSSSBS": "SMALL", "BSBSSSBSB": "SMALL", "SBSSSBSBB": "BIG", "BSSSBSBBS": "SMALL",
            "SSSBSBBSB": "SMALL", "SSBSBBSBB": "SMALL", "SBSBBSBBB": "SMALL", "BSBBSBBBB": "BIG", "SBBSBBBBS": "BIG",
            "BBSBBBBSS": "SMALL", "BBBSSBSSB": "BIG", "BBSSBSSBS": "SMALL", "BSSBSSBSB": "SMALL",
            "SSBSSBSBB": "SMALL", "BSSBSBBBS": "SMALL", "SSBSBBBSB": "BIG", "SBSBBBSBS": "BIG",
            "BSBSSBBBB": "SMALL", "SBSSBBBBB": "SMALL", "BSSBBBBBB": "BIG", "SBBBBBBSS": "SMALL",
            "BBBBBSSBB": "SMALL", "BBBBSSBBB": "SMALL", "BBSSBBBBB": "SMALL",
            "BBBBBBSSS": "SMALL", "BBBBBSSSB": "BIG", "BBBBSSSBS": "SMALL", "BBBSSSBSB": "SMALL",
            "BBSSSBSBB": "SMALL", "BSSSBSBBB": "SMALL", "SSSBSBBBB": "SMALL", "SSBSBBBBB": "BIG", "SBSBBBBBS": "BIG",
            "BSBBBBBSS": "SMALL", "SBBBBBSSB": "BIG", "BBBBBSSBS": "SMALL", "BBBBSSBSB": "SMALL", "BBBSSBSBB": "SMALL",
            "BBSSBSBBB": "BIG", "SSBSBBBSS": "BIG", "SBSBBBSSS": "SMALL", "BSBBBSSSB": "BIG",
            "SSBSSSSBS": "BIG", "BSSSSBSSS": "BIG", "SSSSBSSSS": "BIG", "SSSBSSSSS": "BIG",
            "SSBSSSSSS": "SMALL", "SBSSSSSSB": "BIG", "BSSSSSSBS": "SMALL", "SSSSBSBBB": "BIG",
            "SSSBSBBBS": "BIG", "BSBBBBBBB": "BIG", "SBBBBBBBS": "BIG",
            "BBBBBBBSS": "BIG", "BBBBBBSSB": "BIG", "SBBBSSBBB": "BIG", "BBBSSBBBS": "SMALL", "BBSSBBBSB": "BIG",
            "SSBBBSBSB": "SMALL", "SBBBSBSBB": "SMALL", "BBBSBSBBB": "BIG", "BBSBSBBBS": "SMALL",
            "BSBSBBBSB": "SMALL", "SBSBBBSBB": "BIG", "BSBBBSBBS": "SMALL", "SBBBSBBSB": "BIG", "BBBSBBSBS": "BIG",
            "BBSBBSBSS": "BIG", "BSBBSBSSS": "SMALL", "SBBSBSSSB": "SMALL", "BBSBSSSBB": "BIG", "BSBSSSBBS": "BIG",
            "SBSSSBBSS": "BIG", "BSSSBBSSB": "SMALL", "SSBBSSBBS": "SMALL", "SBBSSBBSB": "SMALL", "SBBSBBBSS": "BIG",
            "BBSBBBSSS": "SMALL", "BBBSSSBSB": "BIG", "BBSSSBSBS": "BIG", "BSSSBSBSS": "BIG",
            "SSSBSBSSS": "BIG", "SSBSBSSSS": "SMALL", "BSBSSSSBB": "BIG",
            "SSSBBSSBS": "SMALL", "SSBBSSBSB": "BIG", "SSSSSSSSS": "SMALL", "SSSSSSBBS": "SMALL", "SSSSSBBSB": "BIG", "SSSSBBSBS": "SMALL", "SSSBBSBSB": "SMALL", "SSBBSBSBB": "SMALL",
            "SBBSBSBBB": "BIG", "BSBSBBBSS": "SMALL", "BSBBBSSBS": "SMALL",
            "BBSSBSBSS": "BIG", "BSSBSBSSS": "SMALL", "SSBSBSSSB": "SMALL", "SBSBSSSBB": "BIG",
            "BSSSBBSSS": "SMALL", "SSSBBSSSB": "BIG", "SSBBSSSBS": "BIG", "SBBSSSBSS": "SMALL", "BBSSSBSSB": "SMALL",
            "BSSSBSSBB": "BIG", "SSBSSBBSS": "SMALL", "SBSSBBSSB": "SMALL", "BSSBBSSBB": "SMALL", "SSBBSSBBB": "SMALL",
            "SBBSSBBBB": "BIG", "BSSBBBBBB": "SMALL", "SSBBBBBBB": "BIG", "BBBBBBBSB": "SMALL",
            "BBBBBBSBB": "BIG", "BBBBBSBBS": "BIG", "BBBBSBBSS": "BIG", "BBSBBSSSB": "BIG", "BSBBSSSBS": "BIG",
            "SSSBSSBBB": "BIG", "SSBSSBBBS": "SMALL",
            "BBBSBSBSS": "SMALL", "BBSBSBSSB": "SMALL", "BSBSBSSBB": "SMALL", "SBSBSSBBB": "SMALL", "SSBBBBSSB": "BIG",
            "BBBSSBSBB": "BIG", "BSSBSBBSS": "SMALL", "SSBSBBSSB": "SMALL",
            "SBSBBSSBB": "SMALL", "BSBBSSBBB": "BIG", "SBBSSBBBS": "SMALL", "BBSSBBBSB": "SMALL", "BSSBBBSBB": "SMALL",
            "SSBBBSBBB": "BIG", "SBBBSBBBS": "SMALL", "BBBSBBBSB": "BIG", "BBSBSSBBS": "SMALL",
            "BSBSSBBSB": "SMALL", "SBSSBBSBB": "BIG", "BSSBBSBBS": "BIG", "SSBBSBBSS": "BIG", "SBBSBBSSS": "SMALL",
            "SBBSSSBBS": "SMALL", "BBSBSBSBS": "BIG", "BSBSBSBSS": "BIG",
            "SBSBSSSSS": "BIG", "BSBSSSSSS": "BIG", "SBSSSSSSS": "SMALL",
            "SSSSBBBSB": "BIG", "SSSBBBSBS": "BIG",
            "BBSBBBSBB": "SMALL", "BSBBBSBBB": "SMALL", "SBBBSBBBB": "SMALL",
            "BSSSBSBSB": "SMALL", "SSSBSBSBB": "SMALL", "SSBSBSBBB": "SMALL", "SBSBSBBBB": "SMALL",
        };

        // --- PRODUCTION LOGIC START ---
        let historyNum = historyList.map(h => parseInt(h.number) >= 5 ? 1 : 0);
        let currentState = "INIT";
        let regime = "NORMAL";

        function computeMultivariate() {
            const decay = 0.995;
            const lookback = Math.min(50, historyNum.length);
            if (lookback < 5) return { trendM: 0.5, volatility: 0, harmonicStrength: 0 };
            let weightedSum = 0, totalWeight = 0;
            for (let i = 0; i < lookback; i++) {
                const w = Math.pow(decay, i);
                weightedSum += historyNum[i] * w;
                totalWeight += w;
            }
            const trendM = weightedSum / totalWeight;
            const mean = historyNum.slice(0, lookback).reduce((a,b)=>a+b,0) / lookback;
            const variance = historyNum.slice(0, lookback).reduce((a,b)=>a + Math.pow(b - mean, 2), 0) / lookback;
            const volatility = Math.sqrt(variance);
            let autoCorrSum = 0;
            for (let lag of [2,3,4,5]) {
                if (lookback <= lag) continue;
                let corr = 0;
                for (let i = 0; i < lookback - lag; i++) {
                    corr += (historyNum[i] - mean) * (historyNum[i + lag] - mean);
                }
                autoCorrSum += Math.abs(corr / (lookback - lag));
            }
            const harmonicStrength = Math.min(1.0, autoCorrSum / (4 * variance || 1));
            return { trendM, volatility, harmonicStrength };
        }

        function computeAlternatingScore() {
            const lookback = Math.min(20, historyNum.length);
            if (lookback < 3) return 0;
            let transitions = 0;
            for (let i = 1; i < lookback; i++) {
                if (historyNum[i] !== historyNum[i-1]) transitions++;
            }
            return transitions / (lookback - 1);
        }

        function detectBreak() {
            const lookback = Math.min(15, historyNum.length);
            if (lookback < 8) return false;
            let maxRun = 1, currRun = 1;
            for (let i = 1; i < lookback; i++) {
                if (historyNum[i] === historyNum[i-1]) currRun++;
                else { maxRun = Math.max(maxRun, currRun); currRun = 1; }
            }
            maxRun = Math.max(maxRun, currRun);
            let changes = 0;
            for (let i = 1; i < lookback; i++) {
                if (historyNum[i] !== historyNum[i-1]) changes++;
            }
            const chopRate = changes / (lookback - 1);
            if (chopRate > 0.82 && maxRun <= 2 && historyNum.length > 8) return true;
            return false;
        }

        function updateStateMachine() {
            const mv = computeMultivariate();
            const brk = detectBreak();
            const altScore = computeAlternatingScore();
            let runLen = 1;
            for (let i = 1; i < Math.min(10, historyNum.length); i++) {
                if (historyNum[i] === historyNum[0]) runLen++;
                else break;
            }
            const exhaustion = runLen >= 6;
            if (mv.trendM > 0.65) {
                currentState = mv.volatility > 0.7 ? "VOLATILE_BULL" : "BULL";
                regime = mv.volatility > 0.7 ? "HIGH_ENERGY" : "TRENDING";
            } else if (mv.trendM < 0.35) {
                currentState = mv.volatility > 0.7 ? "VOLATILE_BEAR" : "BEAR";
                regime = mv.volatility > 0.7 ? "HIGH_ENERGY" : "TRENDING";
            } else {
                currentState = mv.volatility > 0.7 ? "CHOPPY" : "NEUTRAL";
                regime = mv.volatility > 0.7 ? "RANGING" : "NORMAL";
            }
            if (altScore > 0.7 && mv.volatility > 0.6) { currentState = "ALTERNATING"; regime = "CHOPPY"; }
            else if (exhaustion) { currentState = "EXHAUSTION"; regime = "TRANSITION"; }
            else if (brk) { currentState = "BREAKING"; regime = "TRANSITION"; }
            else if (historyNum.length >= 5 && historyNum[0]===historyNum[1] && historyNum[1]===historyNum[2] && historyNum[2]===historyNum[3]) {
                currentState = "EXTREME_RUN"; regime = "OVER_EXTENDED";
            } else if (mv.harmonicStrength > 0.7) { currentState = "HARMONIC"; regime = "CYCLICAL"; }
        }

        function stateMachinePrediction() {
            if (historyNum.length < 5) return { pred: "WAIT", confidence: 50 };
            const mv = computeMultivariate();
            let probBig = 0.5;
            const mapping: Record<string, number> = {
                "BULL": 0.65, "BEAR": 0.35,
                "VOLATILE_BULL": 0.70, "VOLATILE_BEAR": 0.30,
                "BREAKOUT": mv.trendM > 0.5 ? 0.75 : 0.25
            };
            if (currentState in mapping) probBig = mapping[currentState];
            else if (currentState === "EXTREME_RUN") probBig = historyNum[0] === 1 ? 0.85 : 0.15;
            else if (currentState === "EXHAUSTION") probBig = historyNum[0] === 1 ? 0.30 : 0.70;
            if (historyNum.length >= 4) {
                let runLen = 1;
                for (let i = 1; i < Math.min(10, historyNum.length); i++) {
                    if (historyNum[i] === historyNum[i-1]) runLen++;
                    else break;
                }
                if (runLen >= 4) probBig += historyNum[0] === 1 ? -0.12 : 0.12;
            }
            if (historyList.length >= 9) {
                const patternStr = historyList.slice(0, 9).map(x => parseInt(x.number) >= 5 ? "B" : "S").join("");
                if (PATTERN_PRED_9[patternStr]) {
                    const patProb = PATTERN_PRED_9[patternStr] === "BIG" ? 1.0 : 0.0;
                    probBig = probBig * 0.7 + patProb * 0.3;
                }
            }
            probBig = Math.min(0.94, Math.max(0.06, probBig));
            const confidence = Math.min(96, Math.max(50, Math.round(60 + Math.abs(probBig - 0.5) * 70)));
            const pred = probBig >= 0.5 ? "BIG" : "SMALL";
            return { pred, confidence };
        }

        updateStateMachine();
        const result = stateMachinePrediction();
        
        let predictedNums: number[] = [];
        const chance = Math.random() * 100;

        if (result.pred === "BIG") {
            if (chance < 40) predictedNums = [7, 9];
            else if (chance < 70) predictedNums = [6, 8];
            else predictedNums = [5, 7];
        } else {
            if (chance < 40) predictedNums = [2, 4];
            else if (chance < 70) predictedNums = [1, 3];
            else predictedNums = [0, 2];
        }

        return {
            pred: result.pred,
            num: predictedNums.join(','),
            confidence: result.confidence,
            mode: regime
        };

    } catch (e) {
        return { pred: "SMALL", confidence: 50, num: "2,4", mode: "NEURAL_ANALYSIS" };
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
    return getUltimatePrediction(results);
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
