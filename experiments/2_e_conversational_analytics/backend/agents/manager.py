"""
Manager Agent for orchestrating the conversational analytics workflow.
This agent decides which other agents to call based on the user's request.
"""

from crewai import Agent
from langchain_google_genai import ChatGoogleGenerativeAI
from backend.utils.gemini_client import GeminiClient
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ManagerAgent:
    """Manager agent that orchestrates the analytics workflow."""
    
    def __init__(self, gemini_client: GeminiClient):
        """
        Initialize the manager agent.
        
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
            role="Analytics Manager",
            goal="Orchestrate data analysis workflow and coordinate between different agents",
            backstory="""You are an experienced data science manager with expertise in 
            coordinating complex analytical workflows. You understand when to clean data, 
            when to perform analysis, when to generate code, and when to write reports. 
            You always ensure the right agent is called for the right task.""",
            verbose=True,
            allow_delegation=True,
            llm=self.llm
        )
        
        logger.info("Manager agent initialized")
    
    def determine_workflow(self, user_question: str, data_summary: str) -> str:
        """
        Determine the appropriate workflow based on the user's question and data.
        
        Args:
            user_question: The user's analytical question
            data_summary: Summary of the uploaded data
            
        Returns:
            Workflow plan
        """
        prompt = f"""
        As a data science manager, analyze the following user question and data summary 
        to determine the appropriate workflow.
        
        User Question: {user_question}
        Data Summary: {data_summary}
        
        Based on this information, determine which agents should be involved and in what order:
        1. Data Cleaner - if data needs cleaning
        2. Analyst - for statistical analysis and insights
        3. Code Executor - for generating analysis code
        4. Report Writer - for creating final reports
        
        Provide a clear workflow plan with reasoning for each step.
        """
        
        return self.gemini_client.generate_response(prompt)
    
    def coordinate_analysis(self, question: str, data_info: str) -> dict:
        """
        Coordinate the analysis process by determining which agents to call.
        
        Args:
            question: User's analytical question
            data_info: Information about the data
            
        Returns:
            Dictionary with workflow steps
        """
        workflow_plan = self.determine_workflow(question, data_info)
        
        # Determine which agents are needed based on keywords in the question
        agents_needed = []
        
        question_lower = question.lower()
        
        # Check if data cleaning is needed
        if any(keyword in question_lower for keyword in ['clean', 'missing', 'duplicate', 'outlier']):
            agents_needed.append('data_cleaner')
        
        # Check if analysis is needed
        if any(keyword in question_lower for keyword in ['analyze', 'statistics', 'correlation', 'trend', 'pattern']):
            agents_needed.append('analyst')
        
        # Check if code generation is needed
        if any(keyword in question_lower for keyword in ['code', 'script', 'program']):
            agents_needed.append('code_executor')
        
        # Default to analyst if no specific agent identified
        if not agents_needed:
            agents_needed.append('analyst')
        
        # Always include report writer for final output
        agents_needed.append('report_writer')
        
        return {
            'workflow_plan': workflow_plan,
            'agents_needed': agents_needed,
            'question': question,
            'data_info': data_info
        }


