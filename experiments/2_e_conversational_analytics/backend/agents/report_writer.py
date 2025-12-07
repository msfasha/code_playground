"""
Report Writer Agent for generating comprehensive reports from analysis results.
This agent creates well-formatted, professional reports.
"""

from crewai import Agent
from langchain_google_genai import ChatGoogleGenerativeAI
from backend.utils.gemini_client import GeminiClient
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ReportWriterAgent:
    """Report writer agent that creates comprehensive analysis reports."""
    
    def __init__(self, gemini_client: GeminiClient):
        """
        Initialize the report writer agent.
        
        Args:
            gemini_client: Initialized Gemini client
        """
        self.gemini_client = gemini_client
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-pro",
            google_api_key=gemini_client.api_key,
            temperature=0.1
        )
        
        self.agent = Agent(
            role="Technical Report Writer",
            goal="Create comprehensive, professional reports from data analysis results",
            backstory="""You are an expert technical writer with extensive experience in 
            creating data science reports, business intelligence summaries, and analytical 
            documentation. You excel at translating complex analysis results into clear, 
            actionable insights for both technical and non-technical audiences.""",
            verbose=True,
            allow_delegation=False,
            llm=self.llm
        )
        
        logger.info("Report writer agent initialized")
    
    def create_executive_summary(self, question: str, analysis_results: str, data_summary: str) -> str:
        """
        Create an executive summary of the analysis.
        
        Args:
            question: Original user question
            analysis_results: Results from data analysis
            data_summary: Summary of the dataset
            
        Returns:
            Executive summary
        """
        summary_prompt = f"""
        Create an executive summary for the following data analysis:
        
        Original Question: {question}
        
        Dataset Overview:
        {data_summary}
        
        Analysis Results:
        {analysis_results}
        
        The executive summary should include:
        1. Brief overview of the analysis objective
        2. Key findings and insights
        3. Main conclusions
        4. Recommendations (if applicable)
        
        Keep it concise (2-3 paragraphs) and suitable for business stakeholders.
        """
        
        return self.gemini_client.generate_response(summary_prompt)
    
    def write_comprehensive_report(self, question: str, analysis_results: str, 
                                 data_summary: str, code_output: str = None) -> str:
        """
        Write a comprehensive analysis report.
        
        Args:
            question: Original user question
            analysis_results: Results from data analysis
            data_summary: Summary of the dataset
            code_output: Output from code execution (optional)
            
        Returns:
            Comprehensive report
        """
        report_prompt = f"""
        Create a comprehensive data analysis report with the following information:
        
        Analysis Question: {question}
        
        Dataset Summary:
        {data_summary}
        
        Analysis Results:
        {analysis_results}
        
        Code Execution Output:
        {code_output if code_output else "No code execution output available"}
        
        Structure the report with the following sections:
        1. Executive Summary
        2. Methodology
        3. Data Overview
        4. Analysis Results
        5. Key Findings
        6. Conclusions
        7. Recommendations
        8. Limitations and Future Work
        
        Make the report professional, well-structured, and easy to understand.
        """
        
        return self.gemini_client.generate_response(report_prompt)
    
    def create_technical_report(self, question: str, analysis_results: str, 
                              data_summary: str, code_script: str = None) -> str:
        """
        Create a technical report for data science audiences.
        
        Args:
            question: Original user question
            analysis_results: Results from data analysis
            data_summary: Summary of the dataset
            code_script: Python code used for analysis (optional)
            
        Returns:
            Technical report
        """
        technical_prompt = f"""
        Create a technical data science report with the following information:
        
        Research Question: {question}
        
        Dataset Information:
        {data_summary}
        
        Analysis Results:
        {analysis_results}
        
        Analysis Code:
        {code_script if code_script else "No code available"}
        
        The technical report should include:
        1. Abstract
        2. Introduction and Problem Statement
        3. Data Description and Preprocessing
        4. Methodology and Approach
        5. Results and Analysis
        6. Statistical Significance (if applicable)
        7. Code Implementation Details
        8. Discussion of Findings
        9. Conclusions and Future Research Directions
        
        Use technical language appropriate for data science professionals.
        """
        
        return self.gemini_client.generate_response(technical_prompt)
    
    def generate_insights_summary(self, analysis_results: str, question: str) -> str:
        """
        Generate a focused insights summary.
        
        Args:
            analysis_results: Results from data analysis
            question: Original user question
            
        Returns:
            Insights summary
        """
        insights_prompt = f"""
        Generate a focused insights summary based on the analysis results:
        
        Original Question: {question}
        
        Analysis Results:
        {analysis_results}
        
        Focus on:
        1. Direct answers to the user's question
        2. Key statistical findings
        3. Notable patterns or trends
        4. Practical implications
        5. Actionable recommendations
        
        Keep it concise and actionable.
        """
        
        return self.gemini_client.generate_response(insights_prompt)
    
    def create_presentation_summary(self, question: str, analysis_results: str, 
                                   data_summary: str) -> str:
        """
        Create a presentation-ready summary.
        
        Args:
            question: Original user question
            analysis_results: Results from data analysis
            data_summary: Summary of the dataset
            
        Returns:
            Presentation summary
        """
        presentation_prompt = f"""
        Create a presentation-ready summary for the following analysis:
        
        Question: {question}
        
        Data Overview:
        {data_summary}
        
        Analysis Results:
        {analysis_results}
        
        Structure as bullet points suitable for slides:
        1. Key findings (3-5 main points)
        2. Supporting statistics
        3. Visual insights
        4. Recommendations
        5. Next steps
        
        Use clear, concise language suitable for presentations.
        """
        
        return self.gemini_client.generate_response(presentation_prompt)
    
    def format_analysis_output(self, question: str, analysis_results: str, 
                             data_summary: str, code_output: str = None) -> dict:
        """
        Format the complete analysis output into a structured format.
        
        Args:
            question: Original user question
            analysis_results: Results from data analysis
            data_summary: Summary of the dataset
            code_output: Output from code execution (optional)
            
        Returns:
            Dictionary with formatted output sections
        """
        return {
            'executive_summary': self.create_executive_summary(question, analysis_results, data_summary),
            'insights_summary': self.generate_insights_summary(analysis_results, question),
            'presentation_summary': self.create_presentation_summary(question, analysis_results, data_summary),
            'comprehensive_report': self.write_comprehensive_report(question, analysis_results, data_summary, code_output),
            'technical_report': self.create_technical_report(question, analysis_results, data_summary)
        }




