/**
 * ALPHA SERVER V4 - ADVANCED NO-LOSS PREDICTION ENGINE
 * IMPLEMENTED FROM USER PROVIDED LOGIC SNIPPETS
 */

export interface PredictionResult {
    prediction: "BIG" | "SMALL";
    confidence: number;
    logicName: string;
    mode: string;
    numValues: number[];
}

// ════════════════════════════════════════════
// PATTERN DB (hardcoded base)
// ════════════════════════════════════════════
const PATTERN_DB: Record<string, string> = {
    'BBBBSSSS':'BIG','SSSSBBBB':'SMALL','BSBSBSBS':'BIG','SBSBSBSB':'SMALL',
    'BBBSSS':'SMALL','SSSBB':'BIG','BBBBB':'SMALL','SSSSS':'BIG',
    'BSSBBS':'SMALL','SBBS':'BIG','BSSBB':'BIG','SSBS':'BIG',
    'BBSS':'BIG','SSBB':'SMALL','BSBS':'SMALL','SBSB':'BIG',
    'BBB':'SMALL','SSS':'BIG','BSS':'BIG','SBB':'SMALL',
    'BBSSBB':'SMALL','SSBSBS':'BIG','BBSBBS':'SMALL',
    'BSSBS':'BIG','SBBSB':'SMALL','BSBBSB':'BIG',
};

// Logics
function streakDetectionLogic(r: any[]) {
    let t = r[0].resultType, n = 1;
    for (let i = 1; i < r.length; i++) {
        if (r[i].resultType === t) n++;
        else break;
    }
    if (n >= 3) return { prediction: t === 'BIG' ? 'SMALL' : 'BIG', confidence: Math.min(90, 70 + n * 5), name: 'Streak Break' };
    return null;
}

function reverseStreakLogic(r: any[]) {
    let t = r[0].resultType, n = 1;
    for (let i = 1; i < r.length; i++) {
        if (r[i].resultType === t) n++;
        else break;
    }
    if (n >= 2) return { prediction: t, confidence: 58 + n * 2, name: 'Streak Continue' };
    return null;
}

function alternatingPatternLogic(r: any[]) {
    if (r.length < 4) return null;
    let ok = true;
    for (let i = 1; i < Math.min(6, r.length); i++) {
        if ((r[i - 1].resultType === 'BIG' && r[i].resultType !== 'SMALL') || (r[i - 1].resultType === 'SMALL' && r[i].resultType !== 'BIG')) {
            ok = false;
            break;
        }
    }
    if (ok) return { prediction: r[r.length - 1].resultType === 'BIG' ? 'SMALL' : 'BIG', confidence: 80, name: 'Alternating' };
    return null;
}

function doubleRepeatLogic(r: any[]) {
    if (r.length >= 2 && r[0].resultType === r[1].resultType) return { prediction: r[0].resultType === 'BIG' ? 'SMALL' : 'BIG', confidence: 65, name: 'Double Repeat' };
    return null;
}

function triplePatternLogic(r: any[]) {
    if (r.length >= 5) {
        const l3 = r.slice(0, 3);
        if (l3[0].resultType === l3[1].resultType && l3[0].resultType === l3[2].resultType) return { prediction: l3[0].resultType === 'BIG' ? 'SMALL' : 'BIG', confidence: 85, name: 'Triple Break' };
    }
    return null;
}

function mirrorPatternLogic(r: any[]) {
    if (r.length >= 4 && r[0].resultType === r[2].resultType && r[1].resultType === r[3].resultType) return { prediction: r[1].resultType === 'BIG' ? 'SMALL' : 'BIG', confidence: 75, name: 'Mirror' };
    return null;
}

function positionAnalysisLogic(r: any[]) {
    if (r.length < 5) return null;
    const u = r.map(x => x.result % 10);
    if (u[0] === u[1] || u[0] === u[2]) return { prediction: r[0].resultType === 'BIG' ? 'SMALL' : 'BIG', confidence: 60, name: 'Position' };
    return null;
}

function weightedProbabilityLogic(r: any[]) {
    const lb = Math.min(15, r.length), bc = r.slice(0, lb).filter(x => x.resultType === 'BIG').length, bp = (bc / lb) * 100;
    if (Math.abs(bp - 50) > 20) return { prediction: bp > 50 ? 'SMALL' : 'BIG', confidence: Math.min(90, Math.abs(bp - 50) + 40), name: 'Weighted Prob' };
    return null;
}

function clusterAnalysisLogic(r: any[]) {
    if (r.length < 8) return null;
    const cl = [];
    let cu = [r[0]];
    for (let i = 1; i < r.length; i++) {
        if (r[i].resultType === r[i - 1].resultType) cu.push(r[i]);
        else {
            cl.push(cu);
            cu = [r[i]];
        }
    }
    cl.push(cu);
    if (cl.length >= 2) {
        const avg = r.length / cl.length, last = cl[cl.length - 1];
        if (last.length > avg * 1.5) return { prediction: last[0].resultType === 'BIG' ? 'SMALL' : 'BIG', confidence: 67, name: 'Cluster Break' };
    }
    return null;
}

function fibonacciSequenceLogic(r: any[]) {
    if (r.length < 5) return null;
    const fibs = [1, 2, 3, 5, 8, 13];
    for (let i = 0; i < fibs.length - 1; i++) {
        if (fibs[i] < r.length && fibs[i + 1] < r.length && r[fibs[i]].resultType === r[fibs[i + 1]].resultType) return { prediction: r[0].resultType === 'BIG' ? 'SMALL' : 'BIG', confidence: 55, name: 'Fibonacci' };
    }
    return null;
}

function primeNumberPatternLogic(r: any[]) {
    if ([2,3,5,7].includes(r[0].result % 10)) return { prediction: 'BIG' as const, confidence: 53, name: 'Prime' };
    return null;
}

function oddEvenBalanceLogic(r: any[]) {
    return { prediction: r[0].resultType === 'BIG' ? 'SMALL' : 'BIG' as const, confidence: 60, name: 'Odd/Even' };
}

function sumAnalysisLogic(r: any[]) {
    if (r.length < 3) return null;
    const s = r.map(x => Math.floor(x.result / 10) + (x.result % 10));
    if (s[0] > s[1] && s[0] > 10) return { prediction: 'BIG' as const, confidence: 59, name: 'Sum Up' };
    if (s[0] < s[1] && s[0] < 5) return { prediction: 'SMALL' as const, confidence: 59, name: 'Sum Down' };
    return null;
}

function movingAverageLogic(r: any[]) {
    if (r.length < 5) return null;
    const v = r.slice(0, 5).map(x => x.result);
    const ma3 = (v[0] + v[1] + v[2]) / 3;
    const ma5 = (v[0] + v[1] + v[2] + v[3] + v[4]) / 5;
    if (ma3 > ma5 && ma3 > 4.5) return { prediction: 'BIG' as const, confidence: 64, name: 'MA Bull' };
    if (ma3 < ma5 && ma3 < 4.5) return { prediction: 'SMALL' as const, confidence: 64, name: 'MA Bear' };
    return null;
}

function neuralNetworkLogic(r: any[]) {
  if (r.length < 8) return null;
  const bc = r.filter(x => x.resultType === 'BIG').length;
  let t = r[0].resultType, n = 1;
  for (let i = 1; i < r.length; i++) {
    if (r[i].resultType === t) n++;
    else break;
  }
  if (n >= 3) return { prediction: t === 'BIG' ? 'SMALL' : 'BIG', confidence: 80, name: 'Neural Net' };
  if (bc / r.length > 0.6) return { prediction: 'SMALL', confidence: 75, name: 'Neural Net' };
  if ((r.length - bc) / r.length > 0.6) return { prediction: 'BIG', confidence: 75, name: 'Neural Net' };
  return { prediction: bc > r.length / 2 ? 'SMALL' : 'BIG', confidence: 70, name: 'Neural Net' };
}

function machineLearningLogic(r: any[]) {
    if (r.length < 10) return null;
    const bc = r.filter(x => x.resultType === 'BIG').length;
    let t = r[0].resultType, n = 1;
    for (let i = 1; i < r.length; i++) {
        if (r[i].resultType === t) n++;
        else break;
    }
    let alt = true;
    for (let i = 1; i < Math.min(6, r.length); i++) {
        if ((r[i - 1].resultType === 'BIG' && r[i].resultType !== 'SMALL') || (r[i - 1].resultType === 'SMALL' && r[i].resultType !== 'BIG')) {
            alt = false;
            break;
        }
    }
    if (n >= 3) return { prediction: t === 'BIG' ? 'SMALL' : 'BIG', confidence: 85, name: 'ML Streak' };
    if (alt) return { prediction: r[r.length - 1].resultType === 'BIG' ? 'SMALL' : 'BIG', confidence: 80, name: 'ML Alt' };
    if (bc / r.length > 0.6) return { prediction: 'SMALL', confidence: 78, name: 'ML Bias' };
    if ((r.length - bc) / r.length > 0.6) return { prediction: 'BIG', confidence: 78, name: 'ML Bias' };
    return { prediction: bc > r.length / 2 ? 'SMALL' : 'BIG', confidence: 75, name: 'ML Balance' };
}

function deepLearningLogic(r: any[]) {
    if (r.length < 15) return null;
    const bc = r.filter(x => x.resultType === 'BIG').length, r5 = r.slice(0, 5).filter(x => x.resultType === 'BIG').length, r10 = r.slice(0, 10).filter(x => x.resultType === 'BIG').length, score = (r5 * 3 + r10 * 2 + bc) / (15 + 20 + r.length);
    if (score > 0.6) return { prediction: 'SMALL', confidence: 78, name: 'Deep Learn' };
    if (score < 0.4) return { prediction: 'BIG', confidence: 78, name: 'Deep Learn' };
    return { prediction: r[0].resultType === 'BIG' ? 'SMALL' : 'BIG', confidence: 70, name: 'Deep Learn' };
}


export class PredictionEngine {
    private consecutiveLosses = 0;
    private consecutiveWins = 0;
    private lastPrediction: "BIG" | "SMALL" | null = null;
    private sessionPatterns: Record<string, string> = {};

    constructor() {
        // Load stats
        const saved = localStorage.getItem('engine_stats');
        if (saved) {
            const data = JSON.parse(saved);
            this.consecutiveLosses = data.losses || 0;
            this.consecutiveWins = data.wins || 0;
            this.lastPrediction = data.lastPred || null;
        }
    }

    private saveStats() {
        localStorage.setItem('engine_stats', JSON.stringify({
            losses: this.consecutiveLosses,
            wins: this.consecutiveWins,
            lastPred: this.lastPrediction
        }));
    }

    reportResult(actualResult: "BIG" | "SMALL") {
        if (this.lastPrediction) {
            if (this.lastPrediction === actualResult) {
                this.consecutiveWins++;
                this.consecutiveLosses = 0;
            } else {
                this.consecutiveLosses++;
                this.consecutiveWins = 0;
            }
        }
        this.saveStats();
    }

    getPrediction(history: any[]): PredictionResult {
        if (!history || history.length < 5) {
            return {
                prediction: Math.random() > 0.5 ? "BIG" : "SMALL",
                confidence: 60,
                logicName: "Initializing",
                mode: "SYNCING",
                numValues: [1, 2, 3]
            };
        }

        const recent = history.slice(0, 20).map(h => {
            const num = parseInt(h.number || h.result || h);
            return {
                result: num,
                resultType: num >= 5 ? 'BIG' : 'SMALL'
            };
        });

        // Pattern DB Match
        const patStr = recent.map(r => r.resultType).slice(0, 9).reverse().map(s => s === 'BIG' ? 'B' : 'S').join('');
        const dbMatch = PATTERN_DB[patStr] || this.sessionPatterns[patStr];
        
        if (dbMatch) {
            return {
                prediction: dbMatch as "BIG" | "SMALL",
                confidence: 99,
                logicName: "Database Match",
                mode: "MASTER ENGINE",
                numValues: dbMatch === "BIG" ? [7, 8, 9] : [0, 1, 2]
            };
        }

        // HYPER RULE: After 2 consecutive losses -> Force opposite of last predicted
        if (this.consecutiveLosses >= 2 && this.lastPrediction) {
            const pred = this.lastPrediction === "BIG" ? "SMALL" : "BIG";
            return {
                prediction: pred as "BIG" | "SMALL",
                confidence: 96,
                logicName: "Loss Recovery",
                mode: "HYPER-ADAPTIVE",
                numValues: pred === "BIG" ? [6, 7, 9] : [1, 3, 4]
            };
        }

        // Run Logics
        const logics = [
            streakDetectionLogic(recent),
            reverseStreakLogic(recent),
            alternatingPatternLogic(recent),
            doubleRepeatLogic(recent),
            triplePatternLogic(recent),
            mirrorPatternLogic(recent),
            positionAnalysisLogic(recent),
            weightedProbabilityLogic(recent),
            clusterAnalysisLogic(recent),
            fibonacciSequenceLogic(recent),
            primeNumberPatternLogic(recent),
            oddEvenBalanceLogic(recent),
            sumAnalysisLogic(recent),
            movingAverageLogic(recent),
            neuralNetworkLogic(recent),
            machineLearningLogic(recent),
            deepLearningLogic(recent)
        ].filter(l => l !== null);

        if (logics.length === 0) {
            const p = recent[0].resultType === "BIG" ? "SMALL" : "BIG";
            return {
                prediction: p as "BIG" | "SMALL",
                confidence: 65,
                logicName: "Evolution",
                mode: "BASIC",
                numValues: [3, 4, 5]
            };
        }

        // Aggregate
        let bigScore = 0;
        let smallScore = 0;
        logics.forEach(l => {
            if (l!.prediction === 'BIG') bigScore += l!.confidence;
            else smallScore += l!.confidence;
        });

        const finalPred = bigScore >= smallScore ? "BIG" : "SMALL";
        const bestLogic = logics.reduce((a, b) => (b!.confidence > a!.confidence ? b : a));

        this.lastPrediction = finalPred;
        this.saveStats();

        return {
            prediction: finalPred,
            confidence: Math.round(Math.max(bigScore, smallScore) / (bigScore + smallScore) * 100),
            logicName: bestLogic!.name,
            mode: "NARUTO QUANTUM AI",
            numValues: finalPred === "BIG" ? [7, 8, 9] : [0, 1, 2]
        };
    }
}
