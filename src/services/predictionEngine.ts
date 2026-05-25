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
                logicName: "ALPHA_REVERSE_V2",
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
                logicName: "ALPHA_REVERSE_V2",
                mode: "NORMAL",
                numValues: [5]
            };
        }

        // Reverse the period to follow "reverse position" rule
        const d = latestPeriod.split('').reverse().map(Number);

        const A = Math.abs(d[0] - d[1]);
        const B = Math.abs(d[2] - d[4]);
        const C = Math.abs(d[5] - d[7]);
        const D = Math.abs(d[8] - d[9]);

        const final = (A + B + C - D + 10) % 10;
        
        const prediction: "BIG" | "SMALL" = final <= 4 ? "SMALL" : "BIG";
        
        return {
            prediction: prediction,
            confidence: 90,
            logicName: "BEST_BALANCED_V5",
            mode: "NORMAL",
            numValues: [final]
        };
    }

    public reset() {
        // Preserved for hook compatibility
    }
}


