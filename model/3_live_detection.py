from ultralytics import YOLO
import cv2
import time

# 1. Path verified via your terminal check
model_path = r'runs\classify\RootSense_AI\prototype_v1\weights\best.pt'
model = YOLO(model_path)

# 2. Open Camera
cap = cv2.VideoCapture(0)

print("🚀 RootSense AI System Online...")
print("Connected to NVIDIA GeForce RTX 3050 Laptop GPU")

while cap.isOpened():
    success, frame = cap.read()
    if not success:
        break

    # Start timer to calculate FPS (Frames Per Second)
    start_time = time.time()

    # Run Prediction on GPU (device=0)
    results = model.predict(frame, device=0, verbose=False)
    
    # Get top result
    probs = results[0].probs
    class_id = probs.top1
    conf = probs.top1conf.item() * 100
    name = results[0].names[class_id]

    # UI Logic: Change color and message based on detection
    if name == 'Healthy':
        color = (0, 255, 0) # Green
        status = "NORMAL"
    else:
        color = (0, 0, 255) # Red
        status = "ALERT: ISSUE DETECTED"

    # Calculate FPS
    fps = 1 / (time.time() - start_time)

    # DRAWING THE INTERFACE
    # Main Label
    cv2.putText(frame, f"DIAGNOSIS: {name.upper()}", (20, 50), 
                cv2.FONT_HERSHEY_DUPLEX, 1, color, 2)
    
    # Confidence Bar
    cv2.putText(frame, f"CONFIDENCE: {conf:.1f}%", (20, 90), 
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
    
    # System Status & FPS
    cv2.putText(frame, f"STATUS: {status}", (20, frame.shape[0] - 20), 
                cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)
    cv2.putText(frame, f"FPS: {int(fps)}", (frame.shape[1] - 100, 30), 
                cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 0), 2)

    # Show the feed
    cv2.imshow("RootSense AI - Real-Time Oral Diagnostic System", frame)

    # Press 'q' to quit
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()