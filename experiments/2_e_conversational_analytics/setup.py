"""
Setup script for the Conversational Analytics application.
"""

from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

with open("requirements.txt", "r", encoding="utf-8") as fh:
    requirements = [line.strip() for line in fh if line.strip() and not line.startswith("#")]

setup(
    name="conversational-analytics",
    version="1.0.0",
    author="Educational Project",
    author_email="instructor@example.com",
    description="A multi-agent conversational analytics system for data analysis",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/example/conversational-analytics",
    packages=find_packages(),
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Education",
        "Topic :: Scientific/Engineering :: Artificial Intelligence",
        "Topic :: Scientific/Engineering :: Information Analysis",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
    ],
    python_requires=">=3.8",
    install_requires=requirements,
    extras_require={
        "dev": [
            "pytest>=7.4.0",
            "black>=23.0.0",
            "flake8>=6.0.0",
            "mypy>=1.0.0",
        ],
    },
    entry_points={
        "console_scripts": [
            "conversational-analytics=frontend.app:main",
        ],
    },
    include_package_data=True,
    package_data={
        "": ["*.md", "*.txt", "*.csv", "*.env.example"],
    },
    keywords="analytics, ai, agents, data-analysis, conversational-ai, education",
    project_urls={
        "Bug Reports": "https://github.com/example/conversational-analytics/issues",
        "Source": "https://github.com/example/conversational-analytics",
        "Documentation": "https://github.com/example/conversational-analytics#readme",
    },
)




