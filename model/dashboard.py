import streamlit as st
from ultralytics import YOLO
from PIL import Image
import requests
from io import BytesIO
import os
import pyttsx3
import threading # To speak and show results at the same time

# --- 1. VOICE ENGINE FUNCTION ---
def assistant_voice(text):
    engine = pyttsx3.init()
    # Setting the voice property (0 for Male, 1 for Female)
    voices = engine.getProperty('voices')
    engine.setProperty('voice', voices[0].id) 
    engine.setProperty('rate', 160) # Speed of speech
    engine.say(text)
    engine.runAndWait()

# --- 2. MODEL LOADING ---
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'runs', 'classify', 'RootSense_AI', 'intelligent_v3', 'weights', 'best.pt')

@st.cache_resource
def load_rootsense_engine():
    if os.path.exists(MODEL_PATH):
        return YOLO(MODEL_PATH)
    return None

model = load_rootsense_engine()

# --- 3. DASHBOARD UI ---
st.set_page_config(page_title="RootSense Voice AI", page_icon="🦷")
st.title("🦷 RootSense AI Assistant")
st.write("Voice-enabled dental diagnostic system")

img = None
src = st.radio("Choose Source:", ("Upload", "URL"))
if src == "Upload":
    f = st.file_uploader("Upload Image", type=['jpg', 'png', 'jpeg'])
    if f: img = Image.open(f)
else:
    url = st.text_input("Paste URL:")
    if url:
        try:
            res = requests.get(url, timeout=5)
            img = Image.open(BytesIO(res.content))
        except: st.error("Link error.")

# --- 4. DETECTION & SPEAKING ---
if img:
    st.image(img, width=400)
    if st.button("🚀 DETECT"):
        with st.spinner("Analyzing..."):
            results = model.predict(source=img, device=0)
            probs = results[0].probs
            names = results[0].names
            
            top_name = names[probs.top1]
            
            # Formatting the speech text
            if top_name == "No_Tooth":
                speech_text = "No tooth detected"
            else:
                speech_text = f"Detected {top_name}"

            # TRIGGER VOICE IN A SEPARATE THREAD
            # This allows the UI to stay responsive while speaking
            threading.Thread(target=assistant_voice, args=(speech_text,), daemon=True).start()

            # SHOW RESULTS ON SCREEN
            if top_name == "No_Tooth":
                st.warning(f"RESULT: {speech_text.upper()}")
            else:
                st.error(f"RESULT: {speech_text.upper()}")
                st.metric("Condition", top_name)
                
                # Show Chart
                chart_data = {names[i]: float(probs.data[i]) for i in range(len(names))}
                st.bar_chart(chart_data)

st.divider()
st.caption("RootSense AI | Intelligent Voice Diagnostic Assistant")