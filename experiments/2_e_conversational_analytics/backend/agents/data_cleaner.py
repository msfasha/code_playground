"""
Data Cleaner Agent for handling data cleaning operations.
This agent identifies and fixes data quality issues.
"""

from crewai import Agent
from langchain_google_genai import ChatGoogleGenerativeAI
from backend.utils.gemini_client import GeminiClient
from backend.utils.data_processor import DataProcessor
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class DataCleanerAgent:
    """Data cleaner agent that handles data quality issues."""
    
    def __init__(self, gemini_client: GeminiClient):
        """
        Initialize the data cleaner agent.
        
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
            role="Data Cleaning Specialist",
            goal="Identify and fix data quality issues to ensure clean, reliable data for analysis",
            backstory="""You are an expert data cleaning specialist with years of experience 
            in identifying and resolving data quality issues. You excel at detecting missing 
            values, outliers, duplicates, and data type inconsistencies. You always provide 
            clear explanations of cleaning steps and their impact on the data.""",
            verbose=True,
            allow_delegation=False,
            llm=self.llm
        )
        
        logger.info("Data cleaner agent initialized")
    
    def analyze_data_quality(self, data_processor: DataProcessor) -> str:
        """
        Analyze the quality of the loaded data.
        
        Args:
            data_processor: DataProcessor instance with loaded data
            
        Returns:
            Data quality analysis report
        """
        if data_processor.data is None:
            return "No data loaded for analysis"
        
        # Get data summary and cleaning suggestions
        data_summary = data_processor.get_data_summary()
        cleaning_suggestions = data_processor.get_cleaning_suggestions()
        
        # Use Gemini to provide detailed analysis
        analysis_prompt = f"""
        As a data cleaning expert, analyze the following data quality information:
        
        Data Summary:
        {data_summary}
        
        Cleaning Suggestions:
        {cleaning_suggestions}
        
        Provide a comprehensive data quality analysis including:
        1. Overall data quality assessment
        2. Specific issues identified
        3. Recommended cleaning steps
        4. Expected impact of cleaning on analysis
        """
        
        return self.gemini_client.generate_response(analysis_prompt)
    
    def create_cleaning_plan(self, data_processor: DataProcessor, user_question: str) -> str:
        """
        Create a detailed cleaning plan based on the data and user's needs.
        
        Args:
            data_processor: DataProcessor instance with loaded data
            user_question: User's analytical question
            
        Returns:
            Detailed cleaning plan
        """
        data_info = data_processor.get_data_summary()
        
        prompt = f"""
        Create a detailed data cleaning plan for the following scenario:
        
        User's Analytical Question: {user_question}
        Data Information: {data_info}
        
        Provide a step-by-step cleaning plan that addresses:
        1. Missing value handling strategy
        2. Outlier treatment approach
        3. Data type corrections
        4. Duplicate removal strategy
        5. Data validation steps
        
        Explain the reasoning behind each cleaning decision.
        """
        
        return self.gemini_client.generate_response(prompt)
    
    def execute_cleaning(self, data_processor: DataProcessor, cleaning_plan: str) -> tuple:
        """
        Execute the data cleaning plan.
        
        Args:
            data_processor: DataProcessor instance with loaded data
            cleaning_plan: The cleaning plan to execute
            
        Returns:
            Tuple of (success, message, cleaned_data_info)
        """
        try:
            # Apply the cleaning plan
            success, message = data_processor.clean_data(cleaning_plan)
            
            if success:
                # Get updated data information
                cleaned_data_info = data_processor.get_data_summary()
                
                # Generate cleaning report
                cleaning_report = f"""
                Data Cleaning Report:
                
                {message}
                
                Updated Data Summary:
                {cleaned_data_info}
                
                The data has been cleaned and is now ready for analysis.
                """
                
                logger.info("Data cleaning completed successfully")
                return True, cleaning_report, cleaned_data_info
            else:
                return False, f"Cleaning failed: {message}", None
                
        except Exception as e:
            logger.error(f"Error during data cleaning execution: {str(e)}")
            return False, f"Error executing cleaning plan: {str(e)}", None
    
    def validate_cleaning_results(self, data_processor: DataProcessor) -> str:
        """
        Validate the results of data cleaning.
        
        Args:
            data_processor: DataProcessor instance with cleaned data
            
        Returns:
            Validation report
        """
        if data_processor.data is None:
            return "No data available for validation"
        
        # Get post-cleaning data information
        cleaned_summary = data_processor.get_data_summary()
        remaining_issues = data_processor.get_cleaning_suggestions()
        
        validation_prompt = f"""
        Validate the results of data cleaning:
        
        Post-Cleaning Data Summary:
        {cleaned_summary}
        
        Remaining Issues:
        {remaining_issues}
        
        Provide a validation report including:
        1. Quality improvement assessment
        2. Remaining data issues (if any)
        3. Readiness for analysis
        4. Recommendations for further cleaning (if needed)
        """
        
        return self.gemini_client.generate_response(validation_prompt)




