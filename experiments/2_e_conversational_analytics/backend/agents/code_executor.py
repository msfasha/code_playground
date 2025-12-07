"""
Code Executor Agent for generating and executing Python code for data analysis.
This agent creates Python scripts for specific analytical tasks.
"""

from crewai import Agent
from langchain_google_genai import ChatGoogleGenerativeAI
from backend.utils.gemini_client import GeminiClient
from backend.utils.data_processor import DataProcessor
import pandas as pd
import numpy as np
import io
import sys
import traceback
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class CodeExecutorAgent:
    """Code executor agent that generates and executes Python code for data analysis."""
    
    def __init__(self, gemini_client: GeminiClient):
        """
        Initialize the code executor agent.
        
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
            role="Python Code Generator and Executor",
            goal="Generate and execute Python code for data analysis tasks",
            backstory="""You are an expert Python developer and data scientist with deep knowledge 
            of pandas, numpy, matplotlib, and other data analysis libraries. You write clean, 
            efficient, and well-documented code. You always ensure code is safe to execute and 
            follows best practices.""",
            verbose=True,
            allow_delegation=False,
            llm=self.llm
        )
        
        logger.info("Code executor agent initialized")
    
    def generate_analysis_code(self, data_processor: DataProcessor, task: str) -> str:
        """
        Generate Python code for a specific analysis task.
        
        Args:
            data_processor: DataProcessor instance with loaded data
            task: Description of the analysis task
            
        Returns:
            Generated Python code
        """
        if data_processor.data is None:
            return "# No data loaded for code generation"
        
        # Get data information for code generation
        data_info = data_processor.get_data_summary()
        data = data_processor.get_data_for_analysis()
        
        # Create a data sample for the code context
        sample_data = data.head(10).to_dict('records')
        
        code_generation_prompt = f"""
        Generate Python code for the following data analysis task:
        
        Task: {task}
        
        Data Information:
        {data_info}
        
        Sample Data (first 10 rows):
        {sample_data}
        
        Requirements:
        1. Use pandas and numpy for data manipulation
        2. Include proper imports
        3. Add comments explaining each step
        4. Handle potential errors gracefully
        5. Return results in a clear format
        6. Use the variable 'df' for the DataFrame
        7. Include visualization if appropriate
        
        Generate only the Python code, no explanations.
        """
        
        return self.gemini_client.generate_response(code_generation_prompt)
    
    def execute_code_safely(self, code: str, data_processor: DataProcessor) -> tuple:
        """
        Execute Python code safely with the loaded data.
        
        Args:
            code: Python code to execute
            data_processor: DataProcessor instance with loaded data
            
        Returns:
            Tuple of (success, output, error_message)
        """
        if data_processor.data is None:
            return False, "", "No data loaded for code execution"
        
        try:
            # Create a safe execution environment
            safe_globals = {
                'pd': pd,
                'np': np,
                'df': data_processor.get_data_for_analysis(),
                'print': print,
                'len': len,
                'str': str,
                'int': int,
                'float': float,
                'list': list,
                'dict': dict,
                'tuple': tuple,
                'set': set,
                'sum': sum,
                'max': max,
                'min': min,
                'abs': abs,
                'round': round,
                'sorted': sorted,
                'enumerate': enumerate,
                'zip': zip,
                'range': range
            }
            
            # Capture output
            old_stdout = sys.stdout
            sys.stdout = captured_output = io.StringIO()
            
            # Execute the code
            exec(code, safe_globals)
            
            # Get the output
            output = captured_output.getvalue()
            sys.stdout = old_stdout
            
            logger.info("Code executed successfully")
            return True, output, None
            
        except Exception as e:
            # Restore stdout
            sys.stdout = old_stdout
            
            error_msg = f"Code execution error: {str(e)}\n{traceback.format_exc()}"
            logger.error(f"Code execution failed: {error_msg}")
            return False, "", error_msg
    
    def generate_visualization_code(self, data_processor: DataProcessor, visualization_type: str) -> str:
        """
        Generate code for data visualization.
        
        Args:
            data_processor: DataProcessor instance with loaded data
            visualization_type: Type of visualization requested
            
        Returns:
            Generated visualization code
        """
        if data_processor.data is None:
            return "# No data loaded for visualization"
        
        data_info = data_processor.get_data_summary()
        numeric_cols = data_processor.data_info.get('numeric_columns', [])
        categorical_cols = data_processor.data_info.get('categorical_columns', [])
        
        viz_prompt = f"""
        Generate Python code for creating a {visualization_type} visualization.
        
        Data Information:
        {data_info}
        
        Numeric Columns: {numeric_cols}
        Categorical Columns: {categorical_cols}
        
        Requirements:
        1. Use matplotlib and/or seaborn for visualization
        2. Include proper imports (matplotlib.pyplot, seaborn, pandas)
        3. Add titles, labels, and legends
        4. Use the variable 'df' for the DataFrame
        5. Make the plot visually appealing
        6. Handle missing data appropriately
        7. Add comments explaining the visualization
        
        Generate only the Python code.
        """
        
        return self.gemini_client.generate_response(viz_prompt)
    
    def create_analysis_script(self, data_processor: DataProcessor, question: str) -> str:
        """
        Create a complete analysis script for a specific question.
        
        Args:
            data_processor: DataProcessor instance with loaded data
            question: User's analytical question
            
        Returns:
            Complete analysis script
        """
        if data_processor.data is None:
            return "# No data loaded for analysis"
        
        data_info = data_processor.get_data_summary()
        data = data_processor.get_data_for_analysis()
        
        script_prompt = f"""
        Create a complete Python analysis script to answer the following question:
        
        Question: {question}
        
        Data Information:
        {data_info}
        
        Requirements:
        1. Start with data loading and exploration
        2. Include data cleaning if needed
        3. Perform relevant statistical analysis
        4. Create appropriate visualizations
        5. Generate insights and conclusions
        6. Use proper error handling
        7. Add comprehensive comments
        8. Use the variable 'df' for the DataFrame
        
        Generate a complete, executable Python script.
        """
        
        return self.gemini_client.generate_response(script_prompt)
    
    def validate_code(self, code: str) -> tuple:
        """
        Validate Python code for safety and correctness.
        
        Args:
            code: Python code to validate
            
        Returns:
            Tuple of (is_valid, validation_message)
        """
        try:
            # Check for dangerous operations
            dangerous_patterns = [
                'import os',
                'import subprocess',
                'import sys',
                'exec(',
                'eval(',
                'open(',
                'file(',
                '__import__',
                'getattr',
                'setattr',
                'delattr',
                'globals',
                'locals',
                'vars',
                'dir'
            ]
            
            for pattern in dangerous_patterns:
                if pattern in code:
                    return False, f"Potentially dangerous operation detected: {pattern}"
            
            # Try to compile the code
            compile(code, '<string>', 'exec')
            
            return True, "Code validation passed"
            
        except SyntaxError as e:
            return False, f"Syntax error: {str(e)}"
        except Exception as e:
            return False, f"Validation error: {str(e)}"
    
    def execute_analysis_workflow(self, data_processor: DataProcessor, question: str) -> dict:
        """
        Execute a complete analysis workflow for a question.
        
        Args:
            data_processor: DataProcessor instance with loaded data
            question: User's analytical question
            
        Returns:
            Dictionary with execution results
        """
        # Generate the analysis script
        script = self.create_analysis_script(data_processor, question)
        
        # Validate the code
        is_valid, validation_msg = self.validate_code(script)
        
        if not is_valid:
            return {
                'success': False,
                'script': script,
                'output': '',
                'error': f"Code validation failed: {validation_msg}"
            }
        
        # Execute the script
        success, output, error = self.execute_code_safely(script, data_processor)
        
        return {
            'success': success,
            'script': script,
            'output': output,
            'error': error
        }




