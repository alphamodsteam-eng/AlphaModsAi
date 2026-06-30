export interface PredictionResult {
    prediction: "BIG" | "SMALL";
    confidence: number;
    logicName: string;
    mode: string;
    numValues: number[];
}

export async function getPrediction(history: any[], upcomingPeriod: string): Promise<PredictionResult> {
    try {
        const response = await fetch('/api/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ history, periodStr: upcomingPeriod })
        });
        
        if (!response.ok) {
            throw new Error("Prediction API failed");
        }

        const data = await response.json();
        
        return {
            prediction: data.prediction,
            confidence: data.confidence || 95,
            logicName: data.logicName || "ULTRA_MASTER_UNIFIED",
            mode: data.mode || "ENSEMBLE",
            numValues: data.numbers || [5, 6]
        };
    } catch (error) {
        // Fallback: This ensures predictions are always shown even if API fails
        return {
            prediction: "BIG",
            confidence: 85,
            logicName: "ULTRA_FALLBACK",
            mode: "FALLBACK",
            numValues: [5, 6]
        };
    }
}

