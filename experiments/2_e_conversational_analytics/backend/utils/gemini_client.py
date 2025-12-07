"""
Gemini API client for conversational analytics application.
Handles all interactions with Google's Gemini API.
"""

import os
import google.generativeai as genai
from typing import Optional, Dict, Any
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class GeminiClient:
    """Client for interacting with Google Gemini API."""
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize the Gemini client.
        
        Args:
            api_key: Google Gemini API key. If None, will try to get from environment.
        """
        self.api_key = api_key or os.getenv('GEMINI_API_KEY')
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        
        # Configure the API
        genai.configure(api_key=self.api_key)
        
        # Initialize the model
        self.model = genai.GenerativeModel('gemini-pro')
        logger.info("Gemini client initialized successfully")
    
    def generate_response(self, prompt: str, context: Optional[str] = None) -> str:
        """
        Generate a response using Gemini API.
        
        Args:
            prompt: The user's question or prompt
            context: Additional context (e.g., data summary)
            
        Returns:
            Generated response from Gemini
        """
        try:
            # Combine prompt with context if provided
            full_prompt = prompt
            if context:
                full_prompt = f"Context: {context}\n\nQuestion: {prompt}"
            
            # Generate response
            response = self.model.generate_content(full_prompt)
            return response.text
            
        except Exception as e:
            logger.error(f"Error generating response: {str(e)}")
            return f"I apologize, but I encountered an error: {str(e)}"
    
    def analyze_data(self, data_summary: str, question: str) -> str:
        """
        Analyze data based on a specific question.
        
        Args:
            data_summary: Summary of the uploaded data
            question: User's analytical question
            
        Returns:
            Analysis result
        """
        prompt = f"""
        You are a data analyst. Based on the following data summary, answer the user's question.
        
        Data Summary:
        {data_summary}
        
        User Question: {question}
        
        Please provide a clear, analytical response with insights and any relevant statistics.
        """
        
        return self.generate_response(prompt)
    
    def clean_data_instructions(self, data_info: str) -> str:
        """
        Provide data cleaning instructions.
        
        Args:
            data_info: Information about the data that needs cleaning
            
        Returns:
            Data cleaning instructions
        """
        prompt = f"""
        You are a data cleaning expert. Based on the following data information, 
        provide specific instructions for cleaning the data.
        
        Data Information:
        {data_info}
        
        Please provide step-by-step cleaning instructions.
        """
        
        return self.generate_response(prompt)
    
    def generate_code(self, task: str, data_info: str) -> str:
        """
        Generate Python code for data analysis.
        
        Args:
            task: The analysis task to perform
            data_info: Information about the data
            
        Returns:
            Python code for the analysis
        """
        prompt = f"""
        You are a Python data analyst. Generate clean, well-commented Python code 
        to perform the following analysis task.
        
        Task: {task}
        Data Info: {data_info}
        
        Requirements:
        - Use pandas and numpy for data manipulation
        - Include proper error handling
        - Add comments explaining each step
        - Return the code only, no explanations
        """
        
        return self.generate_response(prompt)
    
    def write_report(self, analysis_results: str, question: str) -> str:
        """
        Write a comprehensive report based on analysis results.
        
        Args:
            analysis_results: Results from data analysis
            question: Original user question
            
        Returns:
            Formatted report
        """
        prompt = f"""
        You are a data science report writer. Create a comprehensive, 
        professional report based on the following analysis results.
        
        Original Question: {question}
        Analysis Results: {analysis_results}
        
        The report should include:
        - Executive summary
        - Key findings
        - Methodology
        - Conclusions and recommendations
        """
        
        return self.generate_response(prompt)




