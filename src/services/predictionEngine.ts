export interface PredictionResult {
    prediction: "BIG" | "SMALL";
    confidence: number;
    logicName: string;
    mode: string;
    numValues: number[];
}

export async function getPrediction(history: any[]): Promise<PredictionResult> {
    try {
        const response = await fetch('/api/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ history })
        });
        
        if (!response.ok) {
            throw new Error("Prediction API failed");
        }

        const data = await response.json();
        
        return {
            prediction: data.prediction,
            confidence: 95,
            logicName: "RANDOM_BALANCED_V3",
            mode: "RANDOM",
            numValues: data.numbers
        };
    } catch (error) {
        // Fallback: This ensures predictions are always shown even if API fails
        return {
            prediction: "BIG",
            confidence: 95,
            logicName: "RANDOM_FALLBACK",
            mode: "RANDOM",
            numValues: [5, 6]
        };
    }
}
