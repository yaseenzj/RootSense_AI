import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { spawn } from 'child_process';
import os from 'os';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create temp directory if it doesn't exist
    const tmpDir = join(os.tmpdir(), 'rootsense-uploads');
    await mkdir(tmpDir, { recursive: true });

    // Save file to temp path
    const filePath = join(tmpDir, `${Date.now()}-${file.name}`);
    await writeFile(filePath, buffer);

    // Call Python script for prediction
    const pythonScript = join(process.cwd(), 'model', 'predict_api.py');
    
    const result = await new Promise((resolve, reject) => {
      // Use 'python' or 'python3' depending on the environment
      const py = spawn('python', [pythonScript, filePath]);
      
      let dataString = '';
      let errorString = '';

      py.stdout.on('data', (data) => {
        dataString += data.toString();
      });

      py.stderr.on('data', (data) => {
        errorString += data.toString();
      });

      py.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Python script exited with code ${code}: ${errorString}`));
          return;
        }
        try {
          const parsed = JSON.parse(dataString);
          resolve(parsed);
        } catch (e) {
          reject(new Error(`Failed to parse Python output: ${dataString}`));
        }
      });
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Prediction error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
