"""
Main backend module for the conversational analytics application.
Orchestrates all agents and handles the analysis workflow.
"""

import os
import logging
from typing import Dict, Any, Optional
from dotenv import load_dotenv

from backend.utils.gemini_client import GeminiClient
from backend.utils.data_processor import DataProcessor
from backend.agents.manager import ManagerAgent
from backend.agents.data_cleaner import DataCleanerAgent
from backend.agents.analyst import AnalystAgent
from backend.agents.code_executor import CodeExecutorAgent
from backend.agents.report_writer import ReportWriterAgent

# Load environment variables
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ConversationalAnalytics:
    """Main class for orchestrating the conversational analytics workflow."""
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize the conversational analytics system.
        
        Args:
            api_key: Gemini API key. If None, will try to get from environment.
        """
        try:
            # Initialize Gemini client
            self.gemini_client = GeminiClient(api_key)
            
            # Initialize data processor
            self.data_processor = DataProcessor()
            
            # Initialize all agents
            self.manager = ManagerAgent(self.gemini_client)
            self.data_cleaner = DataCleanerAgent(self.gemini_client)
            self.analyst = AnalystAgent(self.gemini_client)
            self.code_executor = CodeExecutorAgent(self.gemini_client)
            self.report_writer = ReportWriterAgent(self.gemini_client)
            
            logger.info("Conversational analytics system initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize system: {str(e)}")
            raise
    
    def load_data(self, file_path: str) -> Dict[str, Any]:
        """
        Load a CSV file for analysis.
        
        Args:
            file_path: Path to the CSV file
            
        Returns:
            Dictionary with loading results
        """
        try:
            success, message = self.data_processor.load_csv(file_path)
            
            if success:
                data_summary = self.data_processor.get_data_summary()
                return {
                    'success': True,
                    'message': message,
                    'data_summary': data_summary,
                    'data_info': self.data_processor.data_info
                }
            else:
                return {
                    'success': False,
                    'message': message,
                    'data_summary': None,
                    'data_info': None
                }
                
        except Exception as e:
            logger.error(f"Error loading data: {str(e)}")
            return {
                'success': False,
                'message': f"Error loading data: {str(e)}",
                'data_summary': None,
                'data_info': None
            }
    
    def process_question(self, question: str) -> Dict[str, Any]:
        """
        Process a user's analytical question.
        
        Args:
            question: User's question about the data
            
        Returns:
            Dictionary with analysis results
        """
        try:
            if self.data_processor.data is None:
                return {
                    'success': False,
                    'message': 'No data loaded. Please upload a CSV file first.',
                    'results': None
                }
            
            # Get data summary
            data_summary = self.data_processor.get_data_summary()
            
            # Let manager coordinate the workflow
            workflow = self.manager.coordinate_analysis(question, data_summary)
            
            # Execute the workflow
            results = self._execute_workflow(workflow)
            
            return {
                'success': True,
                'message': 'Analysis completed successfully',
                'results': results,
                'workflow_plan': workflow['workflow_plan']
            }
            
        except Exception as e:
            logger.error(f"Error processing question: {str(e)}")
            return {
                'success': False,
                'message': f"Error processing question: {str(e)}",
                'results': None
            }
    
    def _execute_workflow(self, workflow: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute the analysis workflow based on the manager's plan.
        
        Args:
            workflow: Workflow plan from the manager
            
        Returns:
            Dictionary with analysis results
        """
        results = {
            'question': workflow['question'],
            'data_info': workflow['data_info'],
            'workflow_plan': workflow['workflow_plan'],
            'agent_results': {}
        }
        
        try:
            # Execute each agent in the workflow
            for agent_name in workflow['agents_needed']:
                logger.info(f"Executing agent: {agent_name}")
                
                if agent_name == 'data_cleaner':
                    # Data cleaning workflow
                    quality_analysis = self.data_cleaner.analyze_data_quality(self.data_processor)
                    cleaning_plan = self.data_cleaner.create_cleaning_plan(
                        self.data_processor, workflow['question']
                    )
                    success, message, cleaned_info = self.data_cleaner.execute_cleaning(
                        self.data_processor, cleaning_plan
                    )
                    validation = self.data_cleaner.validate_cleaning_results(self.data_processor)
                    
                    results['agent_results']['data_cleaner'] = {
                        'quality_analysis': quality_analysis,
                        'cleaning_plan': cleaning_plan,
                        'execution_success': success,
                        'execution_message': message,
                        'validation': validation,
                        'cleaned_data_info': cleaned_info
                    }
                
                elif agent_name == 'analyst':
                    # Analysis workflow
                    eda_results = self.analyst.perform_exploratory_analysis(self.data_processor)
                    specific_analysis = self.analyst.answer_specific_question(
                        self.data_processor, workflow['question']
                    )
                    insights = self.analyst.generate_insights(self.data_processor)
                    
                    results['agent_results']['analyst'] = {
                        'eda_results': eda_results,
                        'specific_analysis': specific_analysis,
                        'insights': insights
                    }
                
                elif agent_name == 'code_executor':
                    # Code execution workflow
                    analysis_workflow = self.code_executor.execute_analysis_workflow(
                        self.data_processor, workflow['question']
                    )
                    
                    results['agent_results']['code_executor'] = analysis_workflow
                
                elif agent_name == 'report_writer':
                    # Report writing workflow
                    # Collect results from other agents
                    analysis_results = self._collect_analysis_results(results['agent_results'])
                    
                    report_output = self.report_writer.format_analysis_output(
                        workflow['question'],
                        analysis_results,
                        workflow['data_info']
                    )
                    
                    results['agent_results']['report_writer'] = report_output
            
            # Generate final summary
            results['final_summary'] = self._generate_final_summary(results)
            
            logger.info("Workflow execution completed successfully")
            return results
            
        except Exception as e:
            logger.error(f"Error executing workflow: {str(e)}")
            results['error'] = str(e)
            return results
    
    def _collect_analysis_results(self, agent_results: Dict[str, Any]) -> str:
        """Collect and format results from all agents."""
        results_text = []
        
        for agent_name, results in agent_results.items():
            if agent_name == 'analyst' and 'specific_analysis' in results:
                results_text.append(f"Analysis Results: {results['specific_analysis']}")
            elif agent_name == 'code_executor' and 'output' in results:
                results_text.append(f"Code Execution Output: {results['output']}")
        
        return "\n\n".join(results_text) if results_text else "No analysis results available"
    
    def _generate_final_summary(self, results: Dict[str, Any]) -> str:
        """Generate a final summary of all analysis results."""
        try:
            # Use the report writer to create a final summary
            analysis_results = self._collect_analysis_results(results['agent_results'])
            
            final_summary = self.report_writer.create_executive_summary(
                results['question'],
                analysis_results,
                results['data_info']
            )
            
            return final_summary
            
        except Exception as e:
            logger.error(f"Error generating final summary: {str(e)}")
            return f"Error generating summary: {str(e)}"
    
    def get_data_info(self) -> Dict[str, Any]:
        """Get information about the currently loaded data."""
        if self.data_processor.data is None:
            return {'loaded': False, 'message': 'No data loaded'}
        
        return {
            'loaded': True,
            'data_summary': self.data_processor.get_data_summary(),
            'data_info': self.data_processor.data_info,
            'cleaning_suggestions': self.data_processor.get_cleaning_suggestions()
        }
    
    def reset_data(self):
        """Reset the data processor to clear loaded data."""
        self.data_processor = DataProcessor()
        logger.info("Data processor reset")




