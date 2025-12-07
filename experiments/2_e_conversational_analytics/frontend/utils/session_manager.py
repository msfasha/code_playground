"""
Session management utilities for the Streamlit frontend.
Handles session state and data persistence.
"""

import streamlit as st
import os
import tempfile
from typing import Dict, Any, Optional
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class SessionManager:
    """Manages session state and data persistence for the Streamlit app."""
    
    def __init__(self):
        """Initialize the session manager."""
        self.initialize_session_state()
        logger.info("Session manager initialized")
    
    def initialize_session_state(self):
        """Initialize all required session state variables."""
        # Core application state
        if 'data_loaded' not in st.session_state:
            st.session_state.data_loaded = False
        
        if 'current_file_path' not in st.session_state:
            st.session_state.current_file_path = None
        
        if 'data_summary' not in st.session_state:
            st.session_state.data_summary = None
        
        if 'analytics_system' not in st.session_state:
            st.session_state.analytics_system = None
        
        # UI state
        if 'current_tab' not in st.session_state:
            st.session_state.current_tab = "Upload"
        
        if 'show_data_info' not in st.session_state:
            st.session_state.show_data_info = False
        
        # Analysis state
        if 'analysis_in_progress' not in st.session_state:
            st.session_state.analysis_in_progress = False
        
        if 'last_analysis' not in st.session_state:
            st.session_state.last_analysis = None
        
        # Speech input state
        if 'speech_transcript' not in st.session_state:
            st.session_state.speech_transcript = ""
        
        if 'edit_mode' not in st.session_state:
            st.session_state.edit_mode = False
        
        # Error handling
        if 'error_message' not in st.session_state:
            st.session_state.error_message = None
        
        if 'warning_message' not in st.session_state:
            st.session_state.warning_message = None
        
        logger.info("Session state initialized")
    
    def set_data_loaded(self, loaded: bool, file_path: Optional[str] = None, 
                        data_summary: Optional[str] = None):
        """
        Set the data loaded status and related information.
        
        Args:
            loaded: Whether data is loaded
            file_path: Path to the loaded file
            data_summary: Summary of the loaded data
        """
        st.session_state.data_loaded = loaded
        st.session_state.current_file_path = file_path
        st.session_state.data_summary = data_summary
        
        logger.info(f"Data loaded status set to: {loaded}")
    
    def set_analytics_system(self, analytics_system):
        """
        Set the analytics system instance.
        
        Args:
            analytics_system: ConversationalAnalytics system instance
        """
        st.session_state.analytics_system = analytics_system
        logger.info("Analytics system set in session state")
    
    def get_analytics_system(self):
        """
        Get the analytics system instance.
        
        Returns:
            ConversationalAnalytics system instance or None
        """
        return st.session_state.analytics_system
    
    def set_analysis_in_progress(self, in_progress: bool):
        """
        Set the analysis in progress status.
        
        Args:
            in_progress: Whether analysis is in progress
        """
        st.session_state.analysis_in_progress = in_progress
        logger.info(f"Analysis in progress set to: {in_progress}")
    
    def set_last_analysis(self, analysis: Dict[str, Any]):
        """
        Set the last analysis results.
        
        Args:
            analysis: Analysis results dictionary
        """
        st.session_state.last_analysis = analysis
        logger.info("Last analysis results updated")
    
    def get_last_analysis(self) -> Optional[Dict[str, Any]]:
        """
        Get the last analysis results.
        
        Returns:
            Last analysis results or None
        """
        return st.session_state.last_analysis
    
    def set_error_message(self, message: Optional[str]):
        """
        Set an error message.
        
        Args:
            message: Error message to display
        """
        st.session_state.error_message = message
        if message:
            logger.error(f"Error message set: {message}")
    
    def set_warning_message(self, message: Optional[str]):
        """
        Set a warning message.
        
        Args:
            message: Warning message to display
        """
        st.session_state.warning_message = message
        if message:
            logger.warning(f"Warning message set: {message}")
    
    def clear_messages(self):
        """Clear all error and warning messages."""
        st.session_state.error_message = None
        st.session_state.warning_message = None
        logger.info("Messages cleared")
    
    def display_messages(self):
        """Display any error or warning messages."""
        if st.session_state.error_message:
            st.error(st.session_state.error_message)
        
        if st.session_state.warning_message:
            st.warning(st.session_state.warning_message)
    
    def reset_session(self):
        """Reset the entire session state."""
        # Clear all session state
        for key in list(st.session_state.keys()):
            del st.session_state[key]
        
        # Reinitialize
        self.initialize_session_state()
        
        logger.info("Session state reset")
    
    def cleanup_temp_files(self):
        """Clean up any temporary files."""
        if st.session_state.current_file_path and os.path.exists(st.session_state.current_file_path):
            try:
                os.unlink(st.session_state.current_file_path)
                logger.info(f"Temporary file cleaned up: {st.session_state.current_file_path}")
            except Exception as e:
                logger.error(f"Error cleaning up temporary file: {str(e)}")
    
    def get_session_info(self) -> Dict[str, Any]:
        """
        Get information about the current session.
        
        Returns:
            Dictionary with session information
        """
        return {
            'data_loaded': st.session_state.data_loaded,
            'current_file_path': st.session_state.current_file_path,
            'data_summary': st.session_state.data_summary,
            'analysis_in_progress': st.session_state.analysis_in_progress,
            'has_analytics_system': st.session_state.analytics_system is not None,
            'speech_transcript': st.session_state.speech_transcript,
            'error_message': st.session_state.error_message,
            'warning_message': st.session_state.warning_message
        }
    
    def save_session_data(self, data: Dict[str, Any]):
        """
        Save data to session state.
        
        Args:
            data: Dictionary of data to save
        """
        for key, value in data.items():
            st.session_state[key] = value
        
        logger.info(f"Session data saved: {list(data.keys())}")
    
    def load_session_data(self, keys: list) -> Dict[str, Any]:
        """
        Load specific data from session state.
        
        Args:
            keys: List of keys to load
            
        Returns:
            Dictionary with loaded data
        """
        data = {}
        for key in keys:
            if key in st.session_state:
                data[key] = st.session_state[key]
        
        logger.info(f"Session data loaded: {list(data.keys())}")
        return data


