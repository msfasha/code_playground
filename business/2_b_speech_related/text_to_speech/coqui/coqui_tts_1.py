from TTS.api import TTS

# List available models
TTS.list_models()

# Load an Arabic TTS model
tts = TTS(model_name="tts_models/ar/mai/maiwavnet", progress_bar=False, gpu=True)

# Generate speech
tts.tts_to_file(text="مرحبا، كيف حالك؟", file_path="output.wav")
# Play the generated audio
import IPython.display as ipd
ipd.Audio("output.wav")  # This will play the audio in Jupyter Notebook or IPython environment
# If you are running this in a script, you can use:
# import os
# os.system("start output.wav")  # For Windows
# os.system("afplay output.wav")  # For macOS
# os.system("xdg-open output.wav")  # For Linux
# If you want to run this in a Streamlit app, you can use:
# import streamlit as st
# st.audio("output.wav", format="audio/wav")