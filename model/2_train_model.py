from ultralytics import YOLO
import torch

def train():
    # Force GPU usage
    device = 0 if torch.cuda.is_available() else 'cpu'
    print(f"🚀 Training on: {torch.cuda.get_device_name(0) if device == 0 else 'CPU'}")

    # Load YOLOv8 Nano Classification model
    model = YOLO('yolov8n-cls.pt')

    # Start Training with Absolute Path
    model.train(
        data=r'C:\Users\mhyas\Desktop\rootsense\rootsense_yolo', 
        epochs=50, 
        imgsz=224, 
        device=device,
        project='RootSense_AI',
        name='prototype_v1',
        batch=16
    )
    print("✨ Training finished! Check 'runs/classify/RootSense_AI/prototype_v1/weights/best.pt'")

if __name__ == '__main__':
    train()