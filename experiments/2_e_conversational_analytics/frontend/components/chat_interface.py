"""
Chat interface component for the Streamlit frontend.
Handles the conversation flow and displays analysis results.
"""

import streamlit as st
import time
from typing import Dict, Any, List, Optional
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ChatInterfaceComponent:
    """Component for handling the chat interface and conversation flow."""
    
    def __init__(self):
        """Initialize the chat interface component."""
        self.initialize_session_state()
        logger.info("Chat interface component initialized")
    
    def initialize_session_state(self):
        """Initialize Streamlit session state variables."""
        if 'conversation_history' not in st.session_state:
            st.session_state.conversation_history = []
        
        if 'current_analysis' not in st.session_state:
            st.session_state.current_analysis = None
        
        if 'data_loaded' not in st.session_state:
            st.session_state.data_loaded = False
        
        if 'analysis_in_progress' not in st.session_state:
            st.session_state.analysis_in_progress = False
    
    def render_chat_interface(self, analytics_system) -> Optional[str]:
        """
        Render the main chat interface.
        
        Args:
            analytics_system: Initialized ConversationalAnalytics system
            
        Returns:
            User's question if submitted, None otherwise
        """
        st.subheader("💬 Ask Questions About Your Data")
        
        # Display conversation history
        self._display_conversation_history()
        
        # Input section
        question = self._render_input_section()
        
        # Analysis status
        if st.session_state.analysis_in_progress:
            self._display_analysis_progress()
        
        # Display current analysis results
        if st.session_state.current_analysis:
            self._display_analysis_results()
        
        return question
    
    def _display_conversation_history(self):
        """Display the conversation history."""
        if st.session_state.conversation_history:
            st.subheader("📜 Conversation History")
            
            for i, message in enumerate(st.session_state.conversation_history):
                with st.expander(f"Message {i+1}: {message['question'][:50]}...", expanded=False):
                    st.write(f"**Question:** {message['question']}")
                    st.write(f"**Response:** {message['response']}")
                    st.write(f"**Timestamp:** {message['timestamp']}")
    
    def _render_input_section(self) -> Optional[str]:
        """Render the input section for user questions."""
        # Text input
        st.subheader("📝 Enter Your Question")
        question = st.text_area(
            "Ask a question about your data:",
            placeholder="e.g., What are the main trends in this data?",
            height=100,
            key="question_input"
        )
        
        # Submit button
        col1, col2, col3 = st.columns([1, 1, 2])
        
        with col1:
            if st.button("🔍 Analyze", key="analyze_button", type="primary"):
                if question.strip():
                    return question.strip()
                else:
                    st.warning("Please enter a question first.")
        
        with col2:
            if st.button("🗑️ Clear History", key="clear_history"):
                st.session_state.conversation_history = []
                st.session_state.current_analysis = None
                st.rerun()
        
        with col3:
            if st.button("📊 Show Data Info", key="show_data_info"):
                self._display_data_info()
        
        return None
    
    def _display_analysis_progress(self):
        """Display analysis progress indicators."""
        st.subheader("🔄 Analysis in Progress")
        
        # Progress bar
        progress_bar = st.progress(0)
        status_text = st.empty()
        
        # Simulate progress
        for i in range(100):
            progress_bar.progress(i + 1)
            if i < 20:
                status_text.text("🤖 Manager agent coordinating workflow...")
            elif i < 40:
                status_text.text("🧹 Data cleaner agent analyzing data quality...")
            elif i < 60:
                status_text.text("📊 Analyst agent performing statistical analysis...")
            elif i < 80:
                status_text.text("💻 Code executor agent generating analysis code...")
            else:
                status_text.text("📝 Report writer agent creating final report...")
            
            time.sleep(0.05)  # Simulate processing time
        
        progress_bar.empty()
        status_text.empty()
    
    def _display_analysis_results(self):
        """Display the current analysis results."""
        if not st.session_state.current_analysis:
            return
        
        analysis = st.session_state.current_analysis
        
        st.subheader("📊 Analysis Results")
        
        # Display different sections of the analysis
        if 'results' in analysis and analysis['results']:
            results = analysis['results']
            
            # Executive Summary
            if 'agent_results' in results and 'report_writer' in results['agent_results']:
                report_writer_results = results['agent_results']['report_writer']
                
                if 'executive_summary' in report_writer_results:
                    with st.expander("📋 Executive Summary", expanded=True):
                        st.write(report_writer_results['executive_summary'])
                
                if 'insights_summary' in report_writer_results:
                    with st.expander("💡 Key Insights", expanded=True):
                        st.write(report_writer_results['insights_summary'])
                
                if 'presentation_summary' in report_writer_results:
                    with st.expander("📈 Presentation Summary", expanded=False):
                        st.write(report_writer_results['presentation_summary'])
            
            # Agent-specific results
            if 'agent_results' in results:
                self._display_agent_results(results['agent_results'])
            
            # Final summary
            if 'final_summary' in results:
                with st.expander("📄 Final Summary", expanded=False):
                    st.write(results['final_summary'])
    
    def _display_agent_results(self, agent_results: Dict[str, Any]):
        """Display results from individual agents."""
        st.subheader("🤖 Agent Results")
        
        for agent_name, results in agent_results.items():
            if agent_name == 'data_cleaner' and results:
                with st.expander("🧹 Data Cleaning Results", expanded=False):
                    if 'quality_analysis' in results:
                        st.write("**Quality Analysis:**")
                        st.write(results['quality_analysis'])
                    
                    if 'cleaning_plan' in results:
                        st.write("**Cleaning Plan:**")
                        st.write(results['cleaning_plan'])
                    
                    if 'validation' in results:
                        st.write("**Validation Results:**")
                        st.write(results['validation'])
            
            elif agent_name == 'analyst' and results:
                with st.expander("📊 Analysis Results", expanded=False):
                    if 'specific_analysis' in results:
                        st.write("**Specific Analysis:**")
                        st.write(results['specific_analysis'])
                    
                    if 'insights' in results:
                        st.write("**Insights:**")
                        st.write(results['insights'])
            
            elif agent_name == 'code_executor' and results:
                with st.expander("💻 Code Execution Results", expanded=False):
                    if 'script' in results:
                        st.write("**Generated Code:**")
                        st.code(results['script'], language='python')
                    
                    if 'output' in results:
                        st.write("**Execution Output:**")
                        st.code(results['output'])
                    
                    if 'error' in results and results['error']:
                        st.error(f"**Execution Error:** {results['error']}")
    
    def _display_data_info(self):
        """Display information about the loaded data."""
        st.subheader("📊 Data Information")
        
        # This would typically get data from the analytics system
        st.info("Data information will be displayed here once a file is uploaded.")
    
    def add_to_conversation_history(self, question: str, response: str):
        """
        Add a question and response to the conversation history.
        
        Args:
            question: User's question
            response: System's response
        """
        timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
        
        st.session_state.conversation_history.append({
            'question': question,
            'response': response,
            'timestamp': timestamp
        })
        
        logger.info(f"Added to conversation history: {question[:50]}...")
    
    def set_current_analysis(self, analysis: Dict[str, Any]):
        """
        Set the current analysis results.
        
        Args:
            analysis: Analysis results dictionary
        """
        st.session_state.current_analysis = analysis
        logger.info("Current analysis results updated")
    
    def set_analysis_in_progress(self, in_progress: bool):
        """
        Set the analysis in progress status.
        
        Args:
            in_progress: Whether analysis is in progress
        """
        st.session_state.analysis_in_progress = in_progress
        logger.info(f"Analysis in progress: {in_progress}")
    
    def get_conversation_history(self) -> List[Dict[str, Any]]:
        """
        Get the conversation history.
        
        Returns:
            List of conversation messages
        """
        return st.session_state.conversation_history
    
    def clear_conversation_history(self):
        """Clear the conversation history."""
        st.session_state.conversation_history = []
        st.session_state.current_analysis = None
        logger.info("Conversation history cleared")


