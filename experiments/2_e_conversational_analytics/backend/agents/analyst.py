"""
Analyst Agent for performing statistical analysis and generating insights.
This agent focuses on data analysis and statistical operations.
"""

from crewai import Agent
from langchain_google_genai import ChatGoogleGenerativeAI
from backend.utils.gemini_client import GeminiClient
from backend.utils.data_processor import DataProcessor
import pandas as pd
import numpy as np
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class AnalystAgent:
    """Analyst agent that performs statistical analysis and generates insights."""
    
    def __init__(self, gemini_client: GeminiClient):
        """
        Initialize the analyst agent.
        
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
            role="Data Analyst",
            goal="Perform statistical analysis and generate meaningful insights from data",
            backstory="""You are an experienced data analyst with expertise in statistical 
            methods, data visualization, and business intelligence. You excel at identifying 
            patterns, trends, and relationships in data. You always provide clear, actionable 
            insights backed by statistical evidence.""",
            verbose=True,
            allow_delegation=False,
            llm=self.llm
        )
        
        logger.info("Analyst agent initialized")
    
    def perform_exploratory_analysis(self, data_processor: DataProcessor) -> str:
        """
        Perform exploratory data analysis on the loaded dataset.
        
        Args:
            data_processor: DataProcessor instance with loaded data
            
        Returns:
            EDA report
        """
        if data_processor.data is None:
            return "No data loaded for analysis"
        
        # Get basic data information
        data_info = data_processor.get_data_summary()
        data = data_processor.get_data_for_analysis()
        
        # Perform basic statistical analysis
        analysis_results = self._perform_basic_analysis(data)
        
        # Use Gemini to interpret the results
        interpretation_prompt = f"""
        As a data analyst, interpret the following exploratory data analysis results:
        
        Data Summary:
        {data_info}
        
        Statistical Analysis Results:
        {analysis_results}
        
        Provide insights including:
        1. Key patterns and trends
        2. Notable statistical findings
        3. Data distribution characteristics
        4. Potential relationships between variables
        5. Recommendations for further analysis
        """
        
        return self.gemini_client.generate_response(interpretation_prompt)
    
    def _perform_basic_analysis(self, data: pd.DataFrame) -> str:
        """Perform basic statistical analysis on the data."""
        results = []
        
        # Basic statistics for numeric columns
        numeric_cols = data.select_dtypes(include=[np.number]).columns
        if len(numeric_cols) > 0:
            results.append("Numeric Columns Analysis:")
            for col in numeric_cols:
                col_stats = data[col].describe()
                results.append(f"  {col}: mean={col_stats['mean']:.2f}, std={col_stats['std']:.2f}")
        
        # Categorical analysis
        categorical_cols = data.select_dtypes(include=['object']).columns
        if len(categorical_cols) > 0:
            results.append("\nCategorical Columns Analysis:")
            for col in categorical_cols:
                unique_count = data[col].nunique()
                top_value = data[col].value_counts().iloc[0] if len(data[col].value_counts()) > 0 else "N/A"
                results.append(f"  {col}: {unique_count} unique values, most common: {top_value}")
        
        # Correlation analysis for numeric columns
        if len(numeric_cols) > 1:
            corr_matrix = data[numeric_cols].corr()
            high_corr = []
            for i in range(len(corr_matrix.columns)):
                for j in range(i+1, len(corr_matrix.columns)):
                    corr_val = corr_matrix.iloc[i, j]
                    if abs(corr_val) > 0.7:  # High correlation threshold
                        high_corr.append(f"{corr_matrix.columns[i]} - {corr_matrix.columns[j]}: {corr_val:.3f}")
            
            if high_corr:
                results.append("\nHigh Correlations (>0.7):")
                results.extend(high_corr)
        
        return "\n".join(results)
    
    def answer_specific_question(self, data_processor: DataProcessor, question: str) -> str:
        """
        Answer a specific analytical question about the data.
        
        Args:
            data_processor: DataProcessor instance with loaded data
            question: User's specific question
            
        Returns:
            Analytical answer
        """
        if data_processor.data is None:
            return "No data loaded for analysis"
        
        # Get relevant data information
        data_info = data_processor.get_data_summary()
        data = data_processor.get_data_for_analysis()
        
        # Perform targeted analysis based on the question
        analysis_results = self._perform_targeted_analysis(data, question)
        
        # Use Gemini to provide a comprehensive answer
        answer_prompt = f"""
        As a data analyst, answer the following question based on the data analysis:
        
        User Question: {question}
        
        Data Information:
        {data_info}
        
        Analysis Results:
        {analysis_results}
        
        Provide a comprehensive answer that includes:
        1. Direct answer to the question
        2. Supporting statistical evidence
        3. Key insights and patterns
        4. Confidence level in the findings
        5. Recommendations for further investigation
        """
        
        return self.gemini_client.generate_response(answer_prompt)
    
    def _perform_targeted_analysis(self, data: pd.DataFrame, question: str) -> str:
        """Perform targeted analysis based on the specific question."""
        results = []
        question_lower = question.lower()
        
        # Analyze based on question keywords
        if any(keyword in question_lower for keyword in ['average', 'mean', 'median']):
            numeric_cols = data.select_dtypes(include=[np.number]).columns
            if len(numeric_cols) > 0:
                results.append("Central Tendency Analysis:")
                for col in numeric_cols:
                    mean_val = data[col].mean()
                    median_val = data[col].median()
                    results.append(f"  {col}: mean={mean_val:.2f}, median={median_val:.2f}")
        
        if any(keyword in question_lower for keyword in ['correlation', 'relationship', 'related']):
            numeric_cols = data.select_dtypes(include=[np.number]).columns
            if len(numeric_cols) > 1:
                corr_matrix = data[numeric_cols].corr()
                results.append("\nCorrelation Analysis:")
                for i in range(len(corr_matrix.columns)):
                    for j in range(i+1, len(corr_matrix.columns)):
                        corr_val = corr_matrix.iloc[i, j]
                        results.append(f"  {corr_matrix.columns[i]} vs {corr_matrix.columns[j]}: {corr_val:.3f}")
        
        if any(keyword in question_lower for keyword in ['trend', 'over time', 'time series']):
            # Look for date columns
            date_cols = data.select_dtypes(include=['datetime64']).columns
            if len(date_cols) > 0:
                results.append("\nTime Series Analysis:")
                for col in date_cols:
                    results.append(f"  Date range in {col}: {data[col].min()} to {data[col].max()}")
        
        if any(keyword in question_lower for keyword in ['distribution', 'spread', 'variation']):
            numeric_cols = data.select_dtypes(include=[np.number]).columns
            if len(numeric_cols) > 0:
                results.append("\nDistribution Analysis:")
                for col in numeric_cols:
                    std_val = data[col].std()
                    min_val = data[col].min()
                    max_val = data[col].max()
                    results.append(f"  {col}: std={std_val:.2f}, range=[{min_val:.2f}, {max_val:.2f}]")
        
        if not results:
            # Default analysis if no specific keywords found
            results.append("General Statistical Summary:")
            numeric_cols = data.select_dtypes(include=[np.number]).columns
            if len(numeric_cols) > 0:
                results.append(f"  {len(numeric_cols)} numeric columns available for analysis")
                results.append(f"  Sample statistics: {data[numeric_cols].describe().to_string()}")
        
        return "\n".join(results)
    
    def generate_insights(self, data_processor: DataProcessor) -> str:
        """
        Generate high-level insights from the data.
        
        Args:
            data_processor: DataProcessor instance with loaded data
            
        Returns:
            Insights report
        """
        if data_processor.data is None:
            return "No data loaded for analysis"
        
        # Perform comprehensive analysis
        data_info = data_processor.get_data_summary()
        basic_analysis = self._perform_basic_analysis(data_processor.get_data_for_analysis())
        
        insights_prompt = f"""
        As a senior data analyst, generate key business insights from the following data:
        
        Dataset Overview:
        {data_info}
        
        Statistical Analysis:
        {basic_analysis}
        
        Provide strategic insights including:
        1. Key business implications
        2. Data quality assessment
        3. Opportunities for further analysis
        4. Potential data limitations
        5. Recommendations for data collection improvements
        """
        
        return self.gemini_client.generate_response(insights_prompt)




