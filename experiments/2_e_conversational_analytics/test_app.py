"""
Test version of the app that works without API key for demonstration.
"""

import streamlit as st
import pandas as pd
import tempfile
import os
from pathlib import Path

# Configure Streamlit page
st.set_page_config(
    page_title="Conversational Analytics - Test Mode",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded"
)

def main():
    """Main test application."""
    st.title("📊 Conversational Analytics - Test Mode")
    
    st.warning("⚠️ **Test Mode**: This is a simplified version for testing. To use full AI features, you need to set up your Gemini API key.")
    
    # Create tabs
    tab1, tab2, tab3 = st.tabs(["📁 Upload Data", "💬 Ask Questions", "ℹ️ Setup Instructions"])
    
    with tab1:
        st.subheader("📁 Upload Your Data")
        
        # File upload
        uploaded_file = st.file_uploader(
            "Choose a CSV or Excel file",
            type=['csv', 'xlsx', 'xls'],
            help="Upload a CSV or Excel file for analysis"
        )
        
        if uploaded_file is not None:
            try:
                # Save file temporarily
                file_extension = uploaded_file.name.split('.')[-1].lower()
                temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=f'.{file_extension}')
                temp_file.write(uploaded_file.getvalue())
                temp_file.close()
                
                # Load data
                if file_extension == 'csv':
                    df = pd.read_csv(temp_file.name)
                else:
                    df = pd.read_excel(temp_file.name)
                
                # Store in session state
                st.session_state.data_loaded = True
                st.session_state.data = df
                st.session_state.file_name = uploaded_file.name
                
                st.success("✅ Data loaded successfully!")
                
                # Show data info
                col1, col2, col3 = st.columns(3)
                with col1:
                    st.metric("Rows", len(df))
                with col2:
                    st.metric("Columns", len(df.columns))
                with col3:
                    st.metric("File Size", f"{uploaded_file.size / 1024:.1f} KB")
                
                # Show data preview
                st.subheader("📊 Data Preview")
                try:
                    st.dataframe(df.head(10), width='stretch')
                except Exception as e:
                    st.warning(f"Could not display dataframe: {str(e)}")
                    st.write("**Data Info:**")
                    st.write(f"- Shape: {df.shape}")
                    st.write(f"- Columns: {list(df.columns)}")
                    st.write("**First 5 rows:**")
                    st.write(df.head().to_string())
                
                # Show column info
                st.subheader("📋 Column Information")
                col_info = pd.DataFrame({
                    'Column': df.columns,
                    'Type': df.dtypes,
                    'Non-Null Count': df.count(),
                    'Null Count': df.isnull().sum()
                })
                try:
                    st.dataframe(col_info, width='stretch')
                except Exception as e:
                    st.warning(f"Could not display column info: {str(e)}")
                    st.write("**Column Information:**")
                    for col in df.columns:
                        st.write(f"- **{col}**: {df[col].dtype} ({df[col].count()} non-null, {df[col].isnull().sum()} null)")
                
            except Exception as e:
                st.error(f"Error loading file: {str(e)}")
    
    with tab2:
        st.subheader("💬 Ask Questions About Your Data")
        
        if not st.session_state.get('data_loaded', False):
            st.warning("⚠️ Please upload a CSV file first in the 'Upload Data' tab.")
        else:
            st.info(f"📊 Currently loaded: {st.session_state.get('file_name', 'Unknown file')}")
            
            # Simple question interface
            question = st.text_input("Ask a question about your data:", placeholder="e.g., What are the column names?")
            
            if st.button("🔍 Analyze") and question:
                df = st.session_state.data
                
                # Simple analysis based on question
                if "column" in question.lower() or "name" in question.lower():
                    st.write("**Column Names:**")
                    st.write(list(df.columns))
                
                elif "shape" in question.lower() or "size" in question.lower():
                    st.write(f"**Data Shape:** {df.shape[0]} rows × {df.shape[1]} columns")
                
                elif "describe" in question.lower() or "summary" in question.lower():
                    st.write("**Data Summary:**")
                    try:
                        st.dataframe(df.describe(), width='stretch')
                    except Exception as e:
                        st.warning(f"Could not display summary: {str(e)}")
                        st.write("**Basic Statistics:**")
                        st.write(df.describe().to_string())
                
                elif "missing" in question.lower() or "null" in question.lower():
                    st.write("**Missing Values:**")
                    missing = df.isnull().sum()
                    try:
                        st.dataframe(missing[missing > 0].to_frame('Missing Count'), width='stretch')
                    except Exception as e:
                        st.warning(f"Could not display missing values: {str(e)}")
                        st.write("**Missing Values:**")
                        for col in df.columns:
                            null_count = df[col].isnull().sum()
                            if null_count > 0:
                                st.write(f"- **{col}**: {null_count} missing values")
                
                else:
                    st.write("**Basic Analysis:**")
                    st.write(f"- Dataset has {df.shape[0]} rows and {df.shape[1]} columns")
                    st.write(f"- Column names: {', '.join(df.columns[:5])}{'...' if len(df.columns) > 5 else ''}")
                    st.write(f"- Data types: {dict(df.dtypes)}")
    
    with tab3:
        st.subheader("ℹ️ Setup Instructions")
        
        st.markdown("""
        ## 🚀 Full Setup Instructions
        
        To use the complete AI-powered features, follow these steps:
        
        ### 1. Get Your Google Gemini API Key
        1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
        2. Sign in with your Google account
        3. Create a new API key
        4. Copy the API key
        
        ### 2. Update the .env File
        Edit the `.env` file in your project directory and replace `your_gemini_api_key_here` with your actual API key:
        
        ```bash
        GEMINI_API_KEY=your_actual_api_key_here
        ```
        
        ### 3. Restart the Application
        Stop this test app and run the full application:
        
        ```bash
        streamlit run frontend/app.py
        ```
        
        ### 4. Features You'll Get
        - **Multi-Agent AI Analysis**: 5 specialized AI agents
        - **Natural Language Processing**: Ask complex questions
        - **Speech Input**: Use voice commands
        - **Advanced Analytics**: Statistical analysis and insights
        - **Code Generation**: Automatic Python code for analysis
        
        ## 🧪 Current Test Features
        - Basic data loading and preview
        - Simple question answering
        - Data exploration tools
        """)
        
        # Show current status
        st.subheader("🔧 Current Status")
        col1, col2 = st.columns(2)
        
        with col1:
            st.metric("Data Loaded", "✅ Yes" if st.session_state.get('data_loaded', False) else "❌ No")
        
        with col2:
            st.metric("API Key Set", "❌ No (Test Mode)")

if __name__ == "__main__":
    main()
