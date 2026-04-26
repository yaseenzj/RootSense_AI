import os
import shutil
import random
from ultralytics import YOLO
import torch

# --- CONFIGURATION ---
BASE_DIR = r'C:\Users\mhyas\Desktop\rootsense'
# Ensure your No_Tooth folder has those screenshots!
ORIGINAL_FOLDERS = ['Healthy', 'Caries', 'Calculus', 'Gingivitis', 'No_Tooth']
YOLO_DATA_DIR = os.path.join(BASE_DIR, 'rootsense_yolo')

def setup_data():
    print("🚀 Step 1: Re-organizing Dataset for Intelligence v3...")
    if os.path.exists(YOLO_DATA_DIR):
        shutil.rmtree(YOLO_DATA_DIR)
    
    for cls in ORIGINAL_FOLDERS:
        src_path = os.path.join(BASE_DIR, cls)
        if not os.path.exists(src_path):
            print(f"❌ Error: Folder {cls} not found!")
            return False

        os.makedirs(os.path.join(YOLO_DATA_DIR, 'train', cls), exist_ok=True)
        os.makedirs(os.path.join(YOLO_DATA_DIR, 'val', cls), exist_ok=True)

        images = [f for f in os.listdir(src_path) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
        random.shuffle(images)
        
        split = int(len(images) * 0.8)
        for i, img in enumerate(images):
            target = 'train' if i < split else 'val'
            shutil.copy(os.path.join(src_path, img), os.path.join(YOLO_DATA_DIR, target, cls, img))
        
        print(f"✅ Class '{cls}' prepared.")
    return True

def train_model():
    print("\n🔥 Step 2: Training Intelligent v3 Model on RTX 3050...")
    device = 0 if torch.cuda.is_available() else 'cpu'
    model = YOLO('yolov8n-cls.pt')

    # Advanced Training Parameters
    model.train(
        data=YOLO_DATA_DIR,
        epochs=75,          # More epochs for deeper learning
        imgsz=448,          # 2x Resolution for tiny cavity details
        device=device,
        batch=16,           # Optimized for 4GB VRAM
        # --- Advanced Intelligence (Augmentation) ---
        degrees=20.0,       # Handle tilted phone angles
        hsv_s=0.5,          # Handle different lighting saturation
        hsv_v=0.5,          # Handle different brightness
        fliplr=0.5,         # Flip images horizontally
        scale=0.5,          # Zoom in/out to handle distance
        project='RootSense_AI',
        name='intelligent_v3'
    )

if __name__ == "__main__":
    if setup_data():
        train_model()