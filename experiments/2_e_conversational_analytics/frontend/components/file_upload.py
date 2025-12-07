"""
File upload component for the Streamlit frontend.
Handles CSV file upload and validation.
"""

import streamlit as st
import pandas as pd
import tempfile
import os
from typing import Optional, Tuple
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class FileUploadComponent:
    """Component for handling CSV file uploads."""
    
    def __init__(self):
        """Initialize the file upload component."""
        self.supported_types = ['csv', 'xlsx', 'xls']
        logger.info("File upload component initialized")
    
    def render_upload_section(self) -> Optional[str]:
        """
        Render the file upload section in Streamlit.
        
        Returns:
            Path to uploaded file if successful, None otherwise
        """
        st.subheader("📁 Upload Your Data")
        
        # File upload widget
        uploaded_file = st.file_uploader(
            "Choose a CSV or Excel file",
            type=self.supported_types,
            help="Upload a CSV or Excel file for analysis. Maximum file size: 200MB"
        )
        
        if uploaded_file is not None:
            try:
                # Validate file
                if not self._validate_file(uploaded_file):
                    st.error("Invalid file format. Please upload a CSV or Excel file.")
                    return None
                
                # Save uploaded file temporarily
                file_path = self._save_uploaded_file(uploaded_file)
                
                # Display file info
                self._display_file_info(uploaded_file, file_path)
                
                return file_path
                
            except Exception as e:
                st.error(f"Error processing file: {str(e)}")
                logger.error(f"Error processing uploaded file: {str(e)}")
                return None
        
        return None
    
    def _validate_file(self, uploaded_file) -> bool:
        """
        Validate the uploaded file.
        
        Args:
            uploaded_file: Streamlit uploaded file object
            
        Returns:
            True if valid, False otherwise
        """
        try:
            # Check file size (200MB limit)
            if uploaded_file.size > 200 * 1024 * 1024:
                st.error("File size too large. Please upload a file smaller than 200MB.")
                return False
            
            # Check file extension
            file_extension = uploaded_file.name.split('.')[-1].lower()
            if file_extension not in self.supported_types:
                st.error(f"Unsupported file type: {file_extension}")
                return False
            
            return True
            
        except Exception as e:
            logger.error(f"Error validating file: {str(e)}")
            return False
    
    def _save_uploaded_file(self, uploaded_file) -> str:
        """
        Save the uploaded file to a temporary location.
        
        Args:
            uploaded_file: Streamlit uploaded file object
            
        Returns:
            Path to saved file
        """
        try:
            # Create temporary file
            file_extension = uploaded_file.name.split('.')[-1].lower()
            temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=f'.{file_extension}')
            
            # Write file content
            temp_file.write(uploaded_file.getvalue())
            temp_file.close()
            
            logger.info(f"File saved to: {temp_file.name}")
            return temp_file.name
            
        except Exception as e:
            logger.error(f"Error saving file: {str(e)}")
            raise
    
    def _display_file_info(self, uploaded_file, file_path: str):
        """
        Display information about the uploaded file.
        
        Args:
            uploaded_file: Streamlit uploaded file object
            file_path: Path to saved file
        """
        try:
            # Basic file info
            col1, col2, col3 = st.columns(3)
            
            with col1:
                st.metric("File Name", uploaded_file.name)
            
            with col2:
                st.metric("File Size", f"{uploaded_file.size / 1024:.1f} KB")
            
            with col3:
                st.metric("File Type", uploaded_file.type)
            
            # Try to preview the data
            try:
                if file_path.endswith('.csv'):
                    df = pd.read_csv(file_path, nrows=5)
                else:
                    df = pd.read_excel(file_path, nrows=5)
                
                st.subheader("📊 Data Preview")
                st.dataframe(df, use_container_width=True)
                
                # Show data shape
                full_df = pd.read_csv(file_path) if file_path.endswith('.csv') else pd.read_excel(file_path)
                st.info(f"Full dataset: {full_df.shape[0]} rows × {full_df.shape[1]} columns")
                
            except Exception as e:
                st.warning(f"Could not preview data: {str(e)}")
                logger.warning(f"Could not preview data: {str(e)}")
        
        except Exception as e:
            logger.error(f"Error displaying file info: {str(e)}")
            st.error(f"Error displaying file information: {str(e)}")
    
    def cleanup_temp_file(self, file_path: str):
        """
        Clean up temporary file.
        
        Args:
            file_path: Path to temporary file
        """
        try:
            if os.path.exists(file_path):
                os.unlink(file_path)
                logger.info(f"Temporary file cleaned up: {file_path}")
        except Exception as e:
            logger.error(f"Error cleaning up temporary file: {str(e)}")
    
    def get_file_validation_status(self, file_path: str) -> Tuple[bool, str]:
        """
        Validate the file and return status.
        
        Args:
            file_path: Path to the file
            
        Returns:
            Tuple of (is_valid, message)
        """
        try:
            if not os.path.exists(file_path):
                return False, "File not found"
            
            # Try to read the file
            if file_path.endswith('.csv'):
                pd.read_csv(file_path, nrows=1)
            else:
                pd.read_excel(file_path, nrows=1)
            
            return True, "File is valid and readable"
            
        except Exception as e:
            return False, f"File validation failed: {str(e)}"




