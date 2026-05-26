export interface PredictionResult {
    prediction: "BIG" | "SMALL";
    confidence: number;
    logicName: string;
    mode: string;
    numValues: number[];
}

export async function getPrediction(history: any[]): Promise<PredictionResult> {
    const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history })
    });
    
    if (!response.ok) {
        throw new Error("Prediction failed");
    }

    const data = await response.json();
    
    return {
        prediction: data.prediction,
        confidence: 95,
        logicName: "RANDOM_BALANCED_V2",
        mode: "RANDOM",
        numValues: data.numbers
    };
}
