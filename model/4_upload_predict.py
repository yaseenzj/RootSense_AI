import cv2
from ultralytics import YOLO
import tkinter as tk
from tkinter import filedialog
from PIL import Image, ImageTk

# 1. Load the brain
model_path = r'runs\classify\RootSense_AI\prototype_v1\weights\best.pt'
model = YOLO(model_path)

def upload_and_predict():
    # Open File Explorer
    file_path = filedialog.askopenfilename()
    if not file_path:
        return

    # Run Prediction on RTX
    results = model.predict(file_path, device=0)
    
    # Get Result info
    probs = results[0].probs
    name = results[0].names[probs.top1]
    conf = probs.top1conf.item() * 100

    # Show result in a popup
    img = cv2.imread(file_path)
    label = f"RootSense Analysis: {name} ({conf:.1f}%)"
    cv2.putText(img, label, (20, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
    
    cv2.imshow("Prediction Result", img)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

# Setup simple UI
root = tk.Tk()
root.title("RootSense AI - Offline Portal")
root.geometry("300x200")

btn = tk.Button(root, text="Upload Tooth Image", command=upload_and_predict, 
                height=2, width=20, bg="blue", fg="white")
btn.pack(expand=True)

root.mainloop()