"""
Data processing utilities for the conversational analytics application.
Handles CSV file processing, data cleaning, and analysis preparation.
"""

import pandas as pd
import numpy as np
from typing import Dict, Any, Tuple, List
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class DataProcessor:
    """Handles data processing operations for uploaded CSV files."""
    
    def __init__(self):
        """Initialize the data processor."""
        self.data = None
        self.data_info = {}
        logger.info("Data processor initialized")
    
    def load_csv(self, file_path: str) -> Tuple[bool, str]:
        """
        Load a CSV file into a pandas DataFrame.
        
        Args:
            file_path: Path to the CSV file
            
        Returns:
            Tuple of (success, message)
        """
        try:
            # Try different encodings
            encodings = ['utf-8', 'latin-1', 'cp1252', 'iso-8859-1']
            
            for encoding in encodings:
                try:
                    self.data = pd.read_csv(file_path, encoding=encoding)
                    logger.info(f"Successfully loaded CSV with {encoding} encoding")
                    break
                except UnicodeDecodeError:
                    continue
            else:
                raise ValueError("Could not decode CSV file with any standard encoding")
            
            # Generate data information
            self._generate_data_info()
            
            return True, f"Successfully loaded {len(self.data)} rows and {len(self.data.columns)} columns"
            
        except Exception as e:
            logger.error(f"Error loading CSV: {str(e)}")
            return False, f"Error loading CSV file: {str(e)}"
    
    def _generate_data_info(self):
        """Generate comprehensive information about the loaded data."""
        if self.data is None:
            return
        
        self.data_info = {
            'shape': self.data.shape,
            'columns': list(self.data.columns),
            'dtypes': self.data.dtypes.to_dict(),
            'missing_values': self.data.isnull().sum().to_dict(),
            'numeric_columns': list(self.data.select_dtypes(include=[np.number]).columns),
            'categorical_columns': list(self.data.select_dtypes(include=['object']).columns),
            'date_columns': list(self.data.select_dtypes(include=['datetime64']).columns),
            'memory_usage': self.data.memory_usage(deep=True).sum(),
            'sample_data': self.data.head(5).to_dict('records')
        }
        
        # Add basic statistics for numeric columns
        if self.data_info['numeric_columns']:
            self.data_info['numeric_stats'] = self.data[self.data_info['numeric_columns']].describe().to_dict()
        
        logger.info("Generated comprehensive data information")
    
    def get_data_summary(self) -> str:
        """
        Get a human-readable summary of the data.
        
        Returns:
            String summary of the data
        """
        if self.data is None:
            return "No data loaded"
        
        summary = f"""
        Dataset Overview:
        - Shape: {self.data_info['shape'][0]} rows × {self.data_info['shape'][1]} columns
        - Columns: {', '.join(self.data_info['columns'])}
        - Numeric columns: {len(self.data_info['numeric_columns'])}
        - Categorical columns: {len(self.data_info['categorical_columns'])}
        - Missing values: {sum(self.data_info['missing_values'].values())} total
        - Memory usage: {self.data_info['memory_usage'] / 1024 / 1024:.2f} MB
        """
        
        # Add missing values details
        missing_details = []
        for col, missing_count in self.data_info['missing_values'].items():
            if missing_count > 0:
                missing_details.append(f"  - {col}: {missing_count} missing")
        
        if missing_details:
            summary += "\nMissing Values:\n" + "\n".join(missing_details)
        
        return summary.strip()
    
    def get_cleaning_suggestions(self) -> str:
        """
        Get suggestions for data cleaning based on the current data state.
        
        Returns:
            String with cleaning suggestions
        """
        if self.data is None:
            return "No data loaded"
        
        suggestions = []
        
        # Check for missing values
        missing_cols = [col for col, count in self.data_info['missing_values'].items() if count > 0]
        if missing_cols:
            suggestions.append(f"Missing values found in: {', '.join(missing_cols)}")
            suggestions.append("Consider: dropping rows, filling with mean/median, or using forward fill")
        
        # Check for duplicate rows
        duplicates = self.data.duplicated().sum()
        if duplicates > 0:
            suggestions.append(f"Found {duplicates} duplicate rows - consider removing them")
        
        # Check for potential data type issues
        for col in self.data_info['categorical_columns']:
            if self.data[col].dtype == 'object':
                # Check if it might be numeric
                try:
                    pd.to_numeric(self.data[col], errors='raise')
                    suggestions.append(f"Column '{col}' might be numeric but stored as text")
                except:
                    pass
        
        # Check for outliers in numeric columns
        for col in self.data_info['numeric_columns']:
            Q1 = self.data[col].quantile(0.25)
            Q3 = self.data[col].quantile(0.75)
            IQR = Q3 - Q1
            outliers = ((self.data[col] < (Q1 - 1.5 * IQR)) | (self.data[col] > (Q3 + 1.5 * IQR))).sum()
            if outliers > 0:
                suggestions.append(f"Column '{col}' has {outliers} potential outliers")
        
        if not suggestions:
            suggestions.append("Data appears to be clean - no obvious issues detected")
        
        return "\n".join(suggestions)
    
    def clean_data(self, cleaning_instructions: str) -> Tuple[bool, str]:
        """
        Apply data cleaning based on provided instructions.
        
        Args:
            cleaning_instructions: Instructions for cleaning the data
            
        Returns:
            Tuple of (success, message)
        """
        if self.data is None:
            return False, "No data loaded"
        
        try:
            original_shape = self.data.shape
            
            # Apply common cleaning operations
            # Remove duplicates
            self.data = self.data.drop_duplicates()
            
            # Handle missing values in numeric columns
            for col in self.data_info['numeric_columns']:
                if self.data[col].isnull().any():
                    self.data[col].fillna(self.data[col].median(), inplace=True)
            
            # Handle missing values in categorical columns
            for col in self.data_info['categorical_columns']:
                if self.data[col].isnull().any():
                    self.data[col].fillna('Unknown', inplace=True)
            
            # Regenerate data info after cleaning
            self._generate_data_info()
            
            new_shape = self.data.shape
            removed_rows = original_shape[0] - new_shape[0]
            
            message = f"Data cleaning completed. Removed {removed_rows} duplicate rows."
            if removed_rows > 0:
                message += f" New shape: {new_shape[0]} rows × {new_shape[1]} columns"
            
            logger.info("Data cleaning completed successfully")
            return True, message
            
        except Exception as e:
            logger.error(f"Error during data cleaning: {str(e)}")
            return False, f"Error cleaning data: {str(e)}"
    
    def get_data_for_analysis(self) -> pd.DataFrame:
        """
        Get the processed data for analysis.
        
        Returns:
            Processed DataFrame
        """
        return self.data.copy() if self.data is not None else pd.DataFrame()
    
    def get_column_info(self, column_name: str) -> Dict[str, Any]:
        """
        Get detailed information about a specific column.
        
        Args:
            column_name: Name of the column
            
        Returns:
            Dictionary with column information
        """
        if self.data is None or column_name not in self.data.columns:
            return {}
        
        col_data = self.data[column_name]
        info = {
            'name': column_name,
            'dtype': str(col_data.dtype),
            'count': len(col_data),
            'missing': col_data.isnull().sum(),
            'unique': col_data.nunique()
        }
        
        if col_data.dtype in ['int64', 'float64']:
            info.update({
                'mean': col_data.mean(),
                'std': col_data.std(),
                'min': col_data.min(),
                'max': col_data.max(),
                'median': col_data.median()
            })
        else:
            info['top_values'] = col_data.value_counts().head(5).to_dict()
        
        return info




