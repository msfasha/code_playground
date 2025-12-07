"""
Speech input component for the Streamlit frontend.
Handles browser-based speech recognition.
"""

import streamlit as st
import streamlit.components.v1 as components
from typing import Optional
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class SpeechInputComponent:
    """Component for handling speech-to-text input."""
    
    def __init__(self):
        """Initialize the speech input component."""
        self.speech_html = """
        <div id="speech-container">
            <button id="start-recording" onclick="startRecording()" style="
                background-color: #ff6b6b;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
                margin: 5px;
            ">🎤 Start Recording</button>
            
            <button id="stop-recording" onclick="stopRecording()" style="
                background-color: #4ecdc4;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
                margin: 5px;
            ">⏹️ Stop Recording</button>
            
            <div id="status" style="margin: 10px 0; font-weight: bold;"></div>
            <div id="transcript" style="
                background-color: #f0f2f6;
                padding: 15px;
                border-radius: 5px;
                margin: 10px 0;
                min-height: 50px;
                border: 1px solid #ddd;
            "></div>
        </div>

        <script>
        let recognition;
        let isRecording = false;

        function initializeSpeechRecognition() {
            if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                recognition = new SpeechRecognition();
                
                recognition.continuous = true;
                recognition.interimResults = true;
                recognition.lang = 'en-US';

                recognition.onstart = function() {
                    document.getElementById('status').textContent = '🎤 Listening...';
                    document.getElementById('start-recording').disabled = true;
                    document.getElementById('stop-recording').disabled = false;
                    isRecording = true;
                };

                recognition.onresult = function(event) {
                    let transcript = '';
                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        if (event.results[i].isFinal) {
                            transcript += event.results[i][0].transcript;
                        } else {
                            transcript += event.results[i][0].transcript;
                        }
                    }
                    document.getElementById('transcript').textContent = transcript;
                    
                    // Send transcript to Streamlit
                    if (event.results[event.results.length - 1].isFinal) {
                        window.parent.postMessage({
                            type: 'speech-transcript',
                            transcript: transcript
                        }, '*');
                    }
                };

                recognition.onerror = function(event) {
                    document.getElementById('status').textContent = '❌ Error: ' + event.error;
                    document.getElementById('start-recording').disabled = false;
                    document.getElementById('stop-recording').disabled = true;
                    isRecording = false;
                };

                recognition.onend = function() {
                    document.getElementById('status').textContent = '⏹️ Recording stopped';
                    document.getElementById('start-recording').disabled = false;
                    document.getElementById('stop-recording').disabled = true;
                    isRecording = false;
                };
            } else {
                document.getElementById('status').textContent = '❌ Speech recognition not supported in this browser';
                document.getElementById('start-recording').disabled = true;
            }
        }

        function startRecording() {
            if (recognition && !isRecording) {
                recognition.start();
            }
        }

        function stopRecording() {
            if (recognition && isRecording) {
                recognition.stop();
            }
        }

        // Initialize when page loads
        window.addEventListener('load', initializeSpeechRecognition);
        </script>
        """
        
        logger.info("Speech input component initialized")
    
    def render_speech_input(self) -> Optional[str]:
        """
        Render the speech input section in Streamlit.
        
        Returns:
            Transcribed text if available, None otherwise
        """
        st.subheader("🎤 Speech Input")
        
        # Check browser support
        if not self._check_browser_support():
            st.warning("Speech recognition is not supported in this browser. Please use Chrome or Edge.")
            return None
        
        # Render speech recognition interface
        components.html(self.speech_html, height=200)
        
        # Handle transcript from JavaScript
        if 'speech_transcript' not in st.session_state:
            st.session_state.speech_transcript = ""
        
        # Display current transcript
        if st.session_state.speech_transcript:
            st.subheader("📝 Transcribed Text")
            st.text_area("Your speech has been transcribed:", 
                        value=st.session_state.speech_transcript, 
                        height=100, 
                        key="transcript_display")
            
            # Buttons for transcript actions
            col1, col2, col3 = st.columns(3)
            
            with col1:
                if st.button("✅ Use This Text", key="use_transcript"):
                    return st.session_state.speech_transcript
            
            with col2:
                if st.button("🔄 Clear", key="clear_transcript"):
                    st.session_state.speech_transcript = ""
                    st.rerun()
            
            with col3:
                if st.button("✏️ Edit", key="edit_transcript"):
                    st.session_state.edit_mode = True
        
        # Edit mode for transcript
        if st.session_state.get('edit_mode', False):
            st.subheader("✏️ Edit Transcript")
            edited_transcript = st.text_area("Edit your transcript:", 
                                           value=st.session_state.speech_transcript,
                                           height=100,
                                           key="edit_transcript_area")
            
            col1, col2 = st.columns(2)
            with col1:
                if st.button("✅ Save Changes", key="save_edited_transcript"):
                    st.session_state.speech_transcript = edited_transcript
                    st.session_state.edit_mode = False
                    st.rerun()
            
            with col2:
                if st.button("❌ Cancel", key="cancel_edit"):
                    st.session_state.edit_mode = False
                    st.rerun()
        
        return None
    
    def _check_browser_support(self) -> bool:
        """
        Check if the browser supports speech recognition.
        
        Returns:
            True if supported, False otherwise
        """
        # This is a simplified check - in practice, you'd need JavaScript
        # to properly detect browser support
        return True
    
    def get_speech_status(self) -> str:
        """
        Get the current status of speech recognition.
        
        Returns:
            Status message
        """
        if 'speech_transcript' in st.session_state and st.session_state.speech_transcript:
            return "Speech transcribed successfully"
        else:
            return "No speech input detected"
    
    def clear_transcript(self):
        """Clear the current transcript."""
        if 'speech_transcript' in st.session_state:
            st.session_state.speech_transcript = ""
        logger.info("Speech transcript cleared")
    
    def set_transcript(self, transcript: str):
        """
        Set the transcript text.
        
        Args:
            transcript: Transcribed text
        """
        st.session_state.speech_transcript = transcript
        logger.info(f"Speech transcript set: {transcript[:50]}...")




