import sys
import json
from ultralytics import YOLO
import os

def predict(image_path):
    try:
        # Load the model
        model_path = os.path.join(os.path.dirname(__file__), 'runs', 'classify', 'RootSense_AI', 'prototype_v1', 'weights', 'best.pt')
        model = YOLO(model_path)

        # Run prediction
        results = model.predict(image_path, verbose=False)
        
        # Neural Anatomical Signature Check:
        # We distinguish between Clinical Dental Photos (Colorful but focused) and Faces.
        import numpy as np
        from PIL import Image, ImageStat
        img = Image.open(image_path)
        
        # Analyze Saturation and Brightness
        hsv_img = img.convert('HSV')
        stat = ImageStat.Stat(hsv_img)
        avg_sat = stat.mean[1] # Average Saturation
        avg_val = stat.mean[2] # Average Brightness
        
        # Get results
        probs = results[0].probs
        name = results[0].names[probs.top1]
        conf = float(probs.top1conf.item())

        # Logic: 
        # 1. Radiographs are very low saturation (< 20).
        # 2. Clinical dental photos (teeth/mouth) have moderate saturation (40-75).
        # 3. Faces/Portraits often have very high saturation (> 85) or specific color balances.
        # 4. We only perform aggressive rejection if the model is suspicious of 'Healthy' 
        #    on a high-saturation image without dental-specific luminance.
        is_spectral_invalid = (name.lower() == 'healthy' and avg_sat > 85) or (avg_sat > 110)

        if is_spectral_invalid:
            output = {
                "success": True,
                "prediction": "Non-Dental Specimen",
                "confidence": 0.0,
                "error": "Spectral mismatch: Image characteristics (Sat: {:.1f}) are inconsistent with dental anatomy.".format(avg_sat),
                "all_probs": {n: 0.0 for n in results[0].names.values()}
            }
        else:
            # Prepare output
            output = {
                "success": True,
                "prediction": name,
                "confidence": conf,
                "all_probs": {results[0].names[i]: float(p) for i, p in enumerate(probs.data.tolist())}
            }
        print(json.dumps(output))

    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"success": False, "error": "No image path provided"}))
    else:
        predict(sys.argv[1])
