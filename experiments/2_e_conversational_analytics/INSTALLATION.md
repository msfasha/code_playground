# 🚀 Installation Guide

This guide will help you set up the Conversational Analytics application on your local machine.

## 📋 Prerequisites

Before installing the application, make sure you have:

- **Python 3.8 or higher** installed on your system
- **pip** (Python package installer)
- **Git** (for cloning the repository)
- **A Google account** (for Gemini API access)

### Checking Your Python Version

Open a terminal/command prompt and run:

```bash
python --version
```

If you don't have Python 3.8+, download it from [python.org](https://www.python.org/downloads/).

## 🔑 Getting Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key
5. Keep this key secure - you'll need it for the application

## 📥 Installation Steps

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd conversational_analytics
```

### Step 2: Create a Virtual Environment (Recommended)

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 4: Set Up Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit the `.env` file and add your API key:
```
GEMINI_API_KEY=your_actual_api_key_here
```

### Step 5: Verify Installation

Run a quick test to make sure everything is working:

```bash
python -c "import streamlit; print('Streamlit installed successfully')"
python -c "import crewai; print('CrewAI installed successfully')"
python -c "import google.generativeai; print('Gemini API client installed successfully')"
```

## 🚀 Running the Application

### Start the Application

```bash
streamlit run frontend/app.py
```

The application will open in your browser at `http://localhost:8501`.

### First Run Checklist

1. ✅ Application opens in browser
2. ✅ No error messages in terminal
3. ✅ Can see the main interface
4. ✅ Upload tab is accessible

## 🔧 Troubleshooting

### Common Installation Issues

#### 1. Python Version Issues
**Error**: `python: command not found`
**Solution**: Make sure Python is installed and added to your PATH.

#### 2. Permission Errors
**Error**: `Permission denied` when installing packages
**Solution**: Use `pip install --user -r requirements.txt` or run as administrator.

#### 3. Virtual Environment Issues
**Error**: Virtual environment not activating
**Solution**: 
- Windows: `venv\Scripts\activate.bat`
- macOS/Linux: `source venv/bin/activate`

#### 4. API Key Issues
**Error**: `GEMINI_API_KEY not found`
**Solution**: 
- Check that `.env` file exists in the project root
- Verify the API key is correct
- Make sure there are no extra spaces in the `.env` file

#### 5. Import Errors
**Error**: `ModuleNotFoundError`
**Solution**: 
- Make sure you're in the correct directory
- Activate your virtual environment
- Reinstall requirements: `pip install -r requirements.txt`

### Platform-Specific Instructions

#### Windows
1. Open Command Prompt or PowerShell as Administrator
2. Navigate to the project directory
3. Follow the installation steps above

#### macOS
1. Open Terminal
2. Install Homebrew if you don't have it: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`
3. Follow the installation steps above

#### Linux (Ubuntu/Debian)
```bash
# Update package list
sudo apt update

# Install Python and pip
sudo apt install python3 python3-pip python3-venv

# Follow the installation steps above
```

## 🧪 Testing the Installation

### Test 1: Basic Functionality
1. Open the application in your browser
2. Go to the "Upload Data" tab
3. Upload the sample CSV file from `examples/sample_data.csv`
4. Verify the data loads without errors

### Test 2: AI Agent Functionality
1. Go to the "Ask Questions" tab
2. Ask a simple question like "What is the average salary?"
3. Verify the system processes the question and returns results

### Test 3: Speech Input (Optional)
1. Go to the "Speech Input" tab
2. Click "Start Recording" and speak a question
3. Verify speech recognition works (requires Chrome/Edge)

## 📚 Next Steps

Once installation is complete:

1. **Read the README.md** for usage instructions
2. **Try the example data** in the `examples/` directory
3. **Experiment with different questions** to understand the system
4. **Explore the code** to learn about multi-agent systems

## 🆘 Getting Help

If you encounter issues:

1. **Check the troubleshooting section** above
2. **Verify all prerequisites** are installed
3. **Check the terminal/console** for error messages
4. **Review the logs** for detailed error information
5. **Contact your instructor** or course administrator

## 🔄 Updating the Application

To update to the latest version:

```bash
git pull origin main
pip install -r requirements.txt
```

## 🗑️ Uninstalling

To remove the application:

```bash
# Deactivate virtual environment
deactivate

# Remove the project directory
rm -rf conversational_analytics  # On macOS/Linux
# or
rmdir /s conversational_analytics  # On Windows
```

---

**Happy Learning! 🎓📊**




