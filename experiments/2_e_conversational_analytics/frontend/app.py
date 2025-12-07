"""
Main Streamlit application for the conversational analytics system.
This is the entry point for the frontend interface.
"""

import streamlit as st
import os
import sys
from pathlib import Path

# Add the project root to the Python path
project_root = Path(__file__).parent.parent
sys.path.append(str(project_root))

# Import components
from frontend.components.file_upload import FileUploadComponent
from frontend.components.speech_input import SpeechInputComponent
from frontend.components.chat_interface import ChatInterfaceComponent
from frontend.utils.session_manager import SessionManager

# Import backend
from backend.main import ConversationalAnalytics

# Configure Streamlit page
st.set_page_config(
    page_title="Conversational Analytics",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
<style>
    .main-header {
        font-size: 2.5rem;
        font-weight: bold;
        color: #1f77b4;
        text-align: center;
        margin-bottom: 2rem;
    }
    .section-header {
        font-size: 1.5rem;
        font-weight: bold;
        color: #2c3e50;
        margin-top: 2rem;
        margin-bottom: 1rem;
    }
    .success-message {
        background-color: #d4edda;
        color: #155724;
        padding: 1rem;
        border-radius: 0.5rem;
        border: 1px solid #c3e6cb;
    }
    .error-message {
        background-color: #f8d7da;
        color: #721c24;
        padding: 1rem;
        border-radius: 0.5rem;
        border: 1px solid #f5c6cb;
    }
    .info-box {
        background-color: #d1ecf1;
        color: #0c5460;
        padding: 1rem;
        border-radius: 0.5rem;
        border: 1px solid #bee5eb;
    }
</style>
""", unsafe_allow_html=True)


def main():
    """Main application function."""
    # Initialize components only once per session
    if 'components_initialized' not in st.session_state:
        st.session_state.session_manager = SessionManager()
        st.session_state.file_upload = FileUploadComponent()
        st.session_state.speech_input = SpeechInputComponent()
        st.session_state.chat_interface = ChatInterfaceComponent()
        st.session_state.components_initialized = True
    
    # Get components from session state
    session_manager = st.session_state.session_manager
    file_upload = st.session_state.file_upload
    speech_input = st.session_state.speech_input
    chat_interface = st.session_state.chat_interface
    
    # Display header
    st.markdown('<h1 class="main-header">📊 Conversational Analytics</h1>', unsafe_allow_html=True)
    st.markdown("""
    <div class="info-box">
        <strong>Welcome!</strong> Upload your CSV file and ask questions about your data using natural language. 
        You can type your questions or use speech input. Our AI agents will analyze your data and provide insights.
    </div>
    """, unsafe_allow_html=True)
    
    # Display any messages
    session_manager.display_messages()
    
    # Create tabs for different sections
    tab1, tab2, tab3, tab4 = st.tabs(["📁 Upload Data", "💬 Ask Questions", "🎤 Speech Input", "ℹ️ About"])
    
    with tab1:
        render_upload_tab(file_upload, session_manager)
    
    with tab2:
        render_chat_tab(chat_interface, session_manager)
    
    with tab3:
        render_speech_tab(speech_input, session_manager)
    
    with tab4:
        render_about_tab()


def render_upload_tab(file_upload: FileUploadComponent, session_manager: SessionManager):
    """Render the data upload tab."""
    # Only render header once per session
    if 'upload_header_rendered' not in st.session_state:
        st.markdown('<h2 class="section-header">📁 Upload Your Data</h2>', unsafe_allow_html=True)
        st.session_state.upload_header_rendered = True
    
    # Check if data is already loaded
    if session_manager.get_session_info()['data_loaded']:
        st.success("✅ Data already loaded!")
        st.info(f"Current file: {session_manager.get_session_info()['current_file_path']}")
        
        if st.button("🔄 Load New File", key="load_new_file"):
            session_manager.set_data_loaded(False)
            session_manager.cleanup_temp_files()
            st.rerun()
        
        # Show data summary if available
        if session_manager.get_session_info()['data_summary']:
            st.subheader("📊 Data Summary")
            st.text(session_manager.get_session_info()['data_summary'])
    else:
        # File upload section
        uploaded_file_path = file_upload.render_upload_section()
        
        if uploaded_file_path:
            try:
                # Initialize analytics system
                analytics_system = ConversationalAnalytics()
                session_manager.set_analytics_system(analytics_system)
                
                # Load data
                load_result = analytics_system.load_data(uploaded_file_path)
                
                if load_result['success']:
                    session_manager.set_data_loaded(
                        True, 
                        uploaded_file_path, 
                        load_result['data_summary']
                    )
                    session_manager.clear_messages()
                    
                    st.success("✅ Data loaded successfully!")
                    st.rerun()
                else:
                    session_manager.set_error_message(f"Failed to load data: {load_result['message']}")
                    file_upload.cleanup_temp_file(uploaded_file_path)
                    
            except Exception as e:
                session_manager.set_error_message(f"Error initializing system: {str(e)}")
                if uploaded_file_path:
                    file_upload.cleanup_temp_file(uploaded_file_path)


def render_chat_tab(chat_interface: ChatInterfaceComponent, session_manager: SessionManager):
    """Render the chat interface tab."""
    # Only render header once per session
    if 'chat_header_rendered' not in st.session_state:
        st.markdown('<h2 class="section-header">💬 Ask Questions About Your Data</h2>', unsafe_allow_html=True)
        st.session_state.chat_header_rendered = True
    
    # Check if data is loaded
    if not session_manager.get_session_info()['data_loaded']:
        st.warning("⚠️ Please upload a CSV file first in the 'Upload Data' tab.")
        return
    
    # Get analytics system
    analytics_system = session_manager.get_analytics_system()
    if not analytics_system:
        st.error("❌ Analytics system not initialized. Please reload the page.")
        return
    
    # Render chat interface
    question = chat_interface.render_chat_interface(analytics_system)
    
    # Process question if submitted
    if question:
        try:
            session_manager.set_analysis_in_progress(True)
            st.rerun()
            
            # Process the question
            result = analytics_system.process_question(question)
            
            if result['success']:
                # Add to conversation history
                response = result['results']['final_summary'] if result['results'] else "Analysis completed"
                chat_interface.add_to_conversation_history(question, response)
                
                # Set current analysis
                chat_interface.set_current_analysis(result)
                session_manager.set_last_analysis(result)
                
                session_manager.clear_messages()
            else:
                session_manager.set_error_message(f"Analysis failed: {result['message']}")
            
            session_manager.set_analysis_in_progress(False)
            st.rerun()
            
        except Exception as e:
            session_manager.set_error_message(f"Error processing question: {str(e)}")
            session_manager.set_analysis_in_progress(False)
            st.rerun()


def render_speech_tab(speech_input: SpeechInputComponent, session_manager: SessionManager):
    """Render the speech input tab."""
    st.markdown('<h2 class="section-header">🎤 Speech Input</h2>', unsafe_allow_html=True)
    
    # Check if data is loaded
    if not session_manager.get_session_info()['data_loaded']:
        st.warning("⚠️ Please upload a CSV file first in the 'Upload Data' tab.")
        return
    
    # Render speech input
    transcribed_text = speech_input.render_speech_input()
    
    if transcribed_text:
        st.success(f"✅ Transcribed: {transcribed_text}")
        
        # Option to use transcribed text as question
        if st.button("🔍 Analyze This Question", key="analyze_transcribed"):
            # Switch to chat tab and process the question
            session_manager.save_session_data({'transcribed_question': transcribed_text})
            st.success("Question ready for analysis! Switch to the 'Ask Questions' tab.")


def render_about_tab():
    """Render the about tab."""
    st.markdown('<h2 class="section-header">ℹ️ About Conversational Analytics</h2>', unsafe_allow_html=True)
    
    st.markdown("""
    ## 🤖 Multi-Agent Analytics System
    
    This application uses multiple AI agents to analyze your data:
    
    - **🧠 Manager Agent**: Orchestrates the analysis workflow
    - **🧹 Data Cleaner Agent**: Identifies and fixes data quality issues
    - **📊 Analyst Agent**: Performs statistical analysis and generates insights
    - **💻 Code Executor Agent**: Generates and executes Python code for analysis
    - **📝 Report Writer Agent**: Creates comprehensive reports and summaries
    
    ## 🚀 Features
    
    - **Natural Language Queries**: Ask questions in plain English
    - **Speech Input**: Use your voice to ask questions
    - **Multi-Agent Analysis**: Sophisticated analysis using specialized AI agents
    - **Real-time Results**: Get insights immediately
    - **Educational**: Learn about data analysis and AI agents
    
    ## 🛠️ Technology Stack
    
    - **Frontend**: Streamlit
    - **AI Framework**: CrewAI
    - **LLM**: Google Gemini
    - **Data Processing**: Pandas, NumPy
    - **Speech Recognition**: Browser-based Web Speech API
    
    ## 📚 Educational Value
    
    This application is designed for educational purposes to help students learn about:
    - Multi-agent AI systems
    - Data analysis workflows
    - Natural language processing
    - Conversational AI interfaces
    
    ## 🔧 Setup Instructions
    
    1. Install dependencies: `pip install -r requirements.txt`
    2. Set up your Gemini API key in `.env` file
    3. Run the application: `streamlit run frontend/app.py`
    4. Upload a CSV file and start asking questions!
    
    ## 📞 Support
    
    For questions or issues, please refer to the documentation or contact your instructor.
    """)
    
    # Display system information
    st.subheader("🔧 System Information")
    col1, col2 = st.columns(2)
    
    with col1:
        st.metric("Python Version", sys.version.split()[0])
        st.metric("Streamlit Version", st.__version__)
    
    with col2:
        st.metric("Project Status", "✅ Active")
        st.metric("Last Updated", "2024")


if __name__ == "__main__":
    main()


