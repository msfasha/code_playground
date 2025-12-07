import React, { useState, useEffect, useRef } from 'react';

const VoiceInput = ({ onTranscript, onError, language = 'ar-JO' }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check if browser supports Web Speech API
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Web Speech API not supported in this browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language;

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event) => {
      const transcriptText = event.results[0][0].transcript;
      setTranscript(transcriptText);
      if (onTranscript) {
        onTranscript(transcriptText);
      }
      setIsRecording(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
      if (onError) {
        onError(event.error);
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [language, onTranscript, onError]);

  const startRecording = () => {
    if (recognitionRef.current && !isRecording) {
      setTranscript('');
      recognitionRef.current.start();
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
    }
  };

  const handleClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
      <button
        onClick={handleClick}
        style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          border: 'none',
          backgroundColor: isRecording ? '#dc3545' : '#007bff',
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          transition: 'all 0.3s'
        }}
        disabled={!recognitionRef.current}
        title={isRecording ? 'Stop Recording' : 'Start Recording'}
      >
        {isRecording ? '⏹' : '🎤'}
      </button>
      {transcript && (
        <div style={{
          padding: '8px',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px',
          fontSize: '14px',
          textAlign: 'center',
          maxWidth: '300px',
          wordWrap: 'break-word'
        }}>
          {transcript}
        </div>
      )}
      {isRecording && (
        <div style={{ fontSize: '12px', color: '#dc3545' }}>
          Recording...
        </div>
      )}
    </div>
  );
};

export default VoiceInput;


