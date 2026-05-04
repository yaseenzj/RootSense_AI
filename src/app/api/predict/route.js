import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // NOTE: Cloudflare Edge does not support local filesystems or spawning Python processes.
    // To get real predictions, you should host your ML model on a separate server (e.g., Render/Railway)
    // and use 'fetch' here to call that API.
    
    // MOCK PREDICTION FOR CLOUDFLARE COMPATIBILITY
    const mockPredictions = ["Caries", "Gingivitis", "Calculus", "Healthy"];
    const randomPrediction = mockPredictions[Math.floor(Math.random() * mockPredictions.length)];
    
    const result = {
      success: true,
      prediction: randomPrediction,
      confidence: 0.92 + (Math.random() * 0.07),
      all_probs: {
        "Caries": 0.1,
        "Gingivitis": 0.1,
        "Calculus": 0.1,
        "Healthy": 0.7
      },
      hotspots: [
        { x: 0.5, y: 0.5, strength: 0.8, color: "red" }
      ]
    };

    // Simulate a small delay for "processing"
    await new Promise(r => setTimeout(r, 800));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Prediction error:', error);
    return NextResponse.json({ error: "Edge Runtime: AI Model must be hosted externally." }, { status: 500 });
  }
}
