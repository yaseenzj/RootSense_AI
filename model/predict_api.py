import sys
import json
from ultralytics import YOLO
import os

def predict(image_path):
    try:
        # Load the latest model
        model_path = os.path.join(os.path.dirname(__file__), 'runs', 'classify', 'RootSense_AI', 'intelligent_v3', 'weights', 'best.pt')
        
        # Fallback if the path above is not found for some reason
        if not os.path.exists(model_path):
            # Try to find any best.pt in the runs directory as a fallback
            for root, dirs, files in os.walk(os.path.join(os.path.dirname(__file__), 'runs')):
                if 'best.pt' in files:
                    model_path = os.path.join(root, 'best.pt')
                    break
        
        model = YOLO(model_path)
        results = model.predict(source=image_path, verbose=False)
        
        result = results[0]
        probs = result.probs
        names = result.names
        
        top1_idx = probs.top1
        top1_name = names[top1_idx]
        top1_conf = float(probs.top1conf)
        
        all_probs = {names[i]: float(probs.data[i]) for i in range(len(names))}
        
        # Mock hotspots for Grad-CAM simulation in frontend
        # In a real scenario, we would use Grad-CAM to generate these
        hotspots = []
        if top1_name != "No_Tooth":
            hotspots = [
                {"x": 0.5, "y": 0.5, "strength": top1_conf, "color": "red" if top1_name != "Healthy" else "blue"}
            ]

        output = {
            "success": True,
            "prediction": top1_name,
            "confidence": top1_conf,
            "all_probs": all_probs,
            "hotspots": hotspots
        }
        
        print(json.dumps(output))
        
    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))

if __name__ == "__main__":
    if len(sys.argv) > 1:
        predict(sys.argv[1])
    else:
        print(json.dumps({"success": False, "error": "No image path provided"}))
