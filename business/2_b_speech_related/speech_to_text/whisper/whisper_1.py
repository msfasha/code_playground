import streamlit as st
import whisper
import tempfile
import os

st.title("🎙️ Arabic Speech-to-Text with Whisper")

# Load Whisper model (use "base", "small", or "medium" for faster results)
@st.cache_resource
def load_model():
    return whisper.load_model("large")  # Try "medium" if accuracy is low

model = load_model()

# Upload audio file
audio_file = st.file_uploader("Upload Arabic audio file", type=["mp3", "wav", "m4a"])

if audio_file:
    st.audio(audio_file, format="audio/wav")

    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp:
        tmp.write(audio_file.read())
        tmp_path = tmp.name

    st.info("Transcribing... This may take a moment ⏳")

    result = model.transcribe(tmp_path, language="ar")
    os.remove(tmp_path)

    st.subheader("📝 Transcription:")
    st.write(result["text"])
