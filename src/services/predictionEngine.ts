export interface PredictionResult {
    prediction: "BIG" | "SMALL";
    confidence: number;
    logicName: string;
    mode: string;
    numValues: number[];
}

export class PredictionEngine {
    public reportResult(actual: 'BIG' | 'SMALL') {
        // Preserved for hook compatibility
    }

    public getPrediction(history: any[]): PredictionResult {
        if (!history || history.length < 1) {
            return {
                prediction: "BIG",
                confidence: 50,
                logicName: "ALPHA_CONTINUE_V9",
                mode: "NORMAL",
                numValues: [5]
            };
        }

        const latestResult = history[0];
        const latestPeriod = String(latestResult.period || latestResult.issueNumber || "");
        
        if (latestPeriod.length < 10) {
            return {
                prediction: "BIG",
                confidence: 50,
                logicName: "ALPHA_CONTINUE_V9",
                mode: "NORMAL",
                numValues: [5]
            };
        }

        const d = latestPeriod.split('').reverse().map(Number);

        const A = Math.abs(d[0] - d[1]);
        const B = Math.abs(d[1] - d[2]);
        const C = Math.abs(d[2] - d[3]);
        const D = Math.abs(d[3] - d[4]);
        const E = Math.abs(d[4] - d[5]);
        const F = Math.abs(d[5] - d[6]);
        const G = Math.abs(d[6] - d[7]);
        const H = Math.abs(d[7] - d[8]);
        const I = Math.abs(d[8] - d[9]);

        const final = (A + C + E + G + I - (B + D + F + H) + 30) % 10;
        
        const prediction: "BIG" | "SMALL" = final <= 4 ? "SMALL" : "BIG";
        
        return {
            prediction: prediction,
            confidence: 90,
            logicName: "ALPHA_CONTINUE_V9",
            mode: "NORMAL",
            numValues: [final]
        };
    }

    public reset() {
        // Preserved for hook compatibility
    }
}


