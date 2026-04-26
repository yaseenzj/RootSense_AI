from ultralytics import YOLO
import cv2

# Path to your best.pt (RTX output path)
model_path = r'C:\Users\mhyas\Desktop\rootsense\runs\classify\RootSense_AI\prototype_v1\weights\best.pt'
model = YOLO(model_path)

cap = cv2.VideoCapture(0) # Change to 1 if webcam doesn't open

while cap.isOpened():
    success, frame = cap.read()
    if not success: break

    results = model.predict(frame, device=0, verbose=False)
    probs = results[0].probs
    name = results[0].names[probs.top1]
    conf = probs.top1conf.item() * 100

    # UI Design
    color = (0, 255, 0) if name == 'Healthy' else (0, 0, 255)
    cv2.putText(frame, f"RootSense: {name} ({conf:.1f}%)", (20, 50), 
                cv2.FONT_HERSHEY_SIMPLEX, 1, color, 3)
    
    cv2.imshow("RootSense AI Live Scan", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'): break

cap.release()
cv2.destroyAllWindows()