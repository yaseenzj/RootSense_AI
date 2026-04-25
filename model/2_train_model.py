from ultralytics import YOLO
import torch

def train():
    # Check GPU status
    device = 0 if torch.cuda.is_available() else 'cpu'
    print(f"🚀 Training on: {torch.cuda.get_device_name(0) if device == 0 else 'CPU'}")

    # Load YOLOv8 Nano Classification model
    model = YOLO('yolov8n-cls.pt')

    # Start Training
    model.train(
        data='rootsense_yolo', 
        epochs=50, 
        imgsz=224, 
        device=device,
        project='RootSense_AI',
        name='prototype_v1'
    )
    print("✨ Training finished! Model saved in RootSense_AI/prototype_v1/weights/best.pt")

if __name__ == '__main__':
    train()