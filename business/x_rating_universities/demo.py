#!/usr/bin/env python3
"""
Jordan Universities Rating System - Demo Script
This script demonstrates the application structure and features
"""

import json
from datetime import datetime

def print_header():
    print("=" * 60)
    print("🎓 JORDAN UNIVERSITIES RATING SYSTEM")
    print("=" * 60)
    print()

def show_universities():
    """Display the list of Jordanian universities"""
    print("📚 JORDANIAN UNIVERSITIES DATABASE")
    print("-" * 40)
    
    universities = [
        # Public Universities
        {"name": "University of Jordan", "type": "Public", "location": "Amman"},
        {"name": "Jordan University of Science and Technology", "type": "Public", "location": "Irbid"},
        {"name": "Yarmouk University", "type": "Public", "location": "Irbid"},
        {"name": "Mutah University", "type": "Public", "location": "Karak"},
        {"name": "Al-Balqa Applied University", "type": "Public", "location": "Salt"},
        {"name": "Al-Hussein Bin Talal University", "type": "Public", "location": "Ma'an"},
        {"name": "Tafila Technical University", "type": "Public", "location": "Tafila"},
        {"name": "Hashemite University", "type": "Public", "location": "Zarqa"},
        {"name": "Al al-Bayt University", "type": "Public", "location": "Mafraq"},
        {"name": "German Jordanian University", "type": "Public", "location": "Amman"},
        
        # Private Universities
        {"name": "Amman Arab University", "type": "Private", "location": "Amman"},
        {"name": "Applied Science Private University", "type": "Private", "location": "Amman"},
        {"name": "Arab Academy for Banking and Financial Sciences", "type": "Private", "location": "Amman"},
        {"name": "Irbid National University", "type": "Private", "location": "Irbid"},
        {"name": "Isra University", "type": "Private", "location": "Amman"},
        {"name": "Jadara University", "type": "Private", "location": "Irbid"},
        {"name": "Jerash University", "type": "Private", "location": "Jerash"},
        {"name": "Jordan Academy for Maritime Studies", "type": "Private", "location": "Aqaba"},
        {"name": "Middle East University", "type": "Private", "location": "Amman"},
        {"name": "Philadelphia University", "type": "Private", "location": "Amman"},
        {"name": "Princess Sumaya University for Technology", "type": "Private", "location": "Amman"},
        {"name": "University of Petra", "type": "Private", "location": "Amman"},
        {"name": "Zarqa University", "type": "Private", "location": "Zarqa"},
        {"name": "Al-Zaytoonah University of Jordan", "type": "Private", "location": "Amman"},
        {"name": "American University of Madaba", "type": "Private", "location": "Madaba"},
        {"name": "Al-Ahliyya Amman University", "type": "Private", "location": "Amman"},
        {"name": "Al-Hussein Technical University", "type": "Private", "location": "Amman"},
        {"name": "Jordan University College", "type": "Private", "location": "Amman"},
        {"name": "King Talal School of Business Technology", "type": "Private", "location": "Amman"},
        {"name": "Luminus Technical University College", "type": "Private", "location": "Amman"},
        {"name": "Queen Rania Faculty for Tourism and Heritage", "type": "Private", "location": "Amman"},
        {"name": "Royal Academy for Islamic Civilization Research", "type": "Private", "location": "Amman"},
        {"name": "Royal Medical Services", "type": "Private", "location": "Amman"},
        {"name": "Royal Scientific Society", "type": "Private", "location": "Amman"},
        {"name": "University College of Educational Sciences", "type": "Private", "location": "Amman"}
    ]
    
    public_count = sum(1 for uni in universities if uni["type"] == "Public")
    private_count = sum(1 for uni in universities if uni["type"] == "Private")
    
    print(f"Total Universities: {len(universities)}")
    print(f"Public Universities: {public_count}")
    print(f"Private Universities: {private_count}")
    print()
    
    print("🏛️  PUBLIC UNIVERSITIES:")
    print("-" * 25)
    for i, uni in enumerate([u for u in universities if u["type"] == "Public"], 1):
        print(f"{i:2d}. {uni['name']:<35} | {uni['location']}")
    
    print()
    print("🏢 PRIVATE UNIVERSITIES:")
    print("-" * 25)
    for i, uni in enumerate([u for u in universities if u["type"] == "Private"], 1):
        print(f"{i:2d}. {uni['name']:<35} | {uni['location']}")
    
    return universities

def show_rating_criteria():
    """Display the rating criteria"""
    print()
    print("⭐ RATING CRITERIA")
    print("-" * 20)
    
    criteria = [
        {"name": "Campus Quality", "description": "Overall campus facilities and infrastructure"},
        {"name": "Reputation", "description": "University standing in academic community and job market"},
        {"name": "Education Quality", "description": "Curriculum and academic standards"},
        {"name": "Employability Rate", "description": "Career preparation and job placement success"},
        {"name": "Facilities", "description": "Libraries, labs, sports centers, and other amenities"},
        {"name": "Faculty Quality", "description": "Teaching staff expertise and methods"},
        {"name": "Research Opportunities", "description": "Availability of research programs"},
        {"name": "Student Life", "description": "Social activities and campus experience"}
    ]
    
    for i, criterion in enumerate(criteria, 1):
        print(f"{i}. {criterion['name']:<20} - {criterion['description']}")

def show_features():
    """Display application features"""
    print()
    print("🚀 APPLICATION FEATURES")
    print("-" * 25)
    
    features = [
        "🎓 Complete database of 29 Jordanian universities",
        "👤 Student registration and authentication system",
        "⭐ Comprehensive 8-criteria rating system",
        "📊 Visual analytics and statistics",
        "💬 Student reviews and comments",
        "🔒 Security: Students can only rate their own university",
        "📱 Responsive design for all devices",
        "🎨 Modern UI with Bootstrap 5",
        "📈 Real-time rating calculations",
        "🔍 University filtering and search"
    ]
    
    for feature in features:
        print(f"  {feature}")

def show_tech_stack():
    """Display technology stack"""
    print()
    print("🛠️  TECHNOLOGY STACK")
    print("-" * 20)
    
    tech_stack = [
        "Backend: Python Flask",
        "Database: SQLite",
        "Frontend: HTML5, CSS3, JavaScript",
        "UI Framework: Bootstrap 5",
        "Icons: Font Awesome 6",
        "Authentication: Flask-Login",
        "Forms: Flask-WTF",
        "Security: Werkzeug (password hashing)"
    ]
    
    for tech in tech_stack:
        print(f"  {tech}")

def show_installation():
    """Display installation instructions"""
    print()
    print("📦 INSTALLATION INSTRUCTIONS")
    print("-" * 30)
    
    instructions = [
        "1. Ensure Python 3.7+ is installed",
        "2. Install pip if not available:",
        "   sudo apt install python3-pip  # Ubuntu/Debian",
        "   brew install python3          # macOS",
        "   # Windows: Download from python.org",
        "",
        "3. Install dependencies:",
        "   pip install -r requirements.txt",
        "",
        "4. Run the application:",
        "   python app.py",
        "",
        "5. Open browser and go to:",
        "   http://localhost:5000"
    ]
    
    for instruction in instructions:
        print(f"   {instruction}")

def show_sample_data():
    """Show sample database structure"""
    print()
    print("🗄️  SAMPLE DATABASE STRUCTURE")
    print("-" * 35)
    
    sample_user = {
        "id": 1,
        "username": "ahmad_student",
        "email": "ahmad@example.com",
        "full_name": "Ahmad Al-Rashid",
        "student_id": "202012345",
        "department": "Computer Science",
        "university_id": 1,
        "created_at": "2024-01-15 10:30:00"
    }
    
    sample_rating = {
        "id": 1,
        "user_id": 1,
        "university_id": 1,
        "campus_quality": 4,
        "reputation": 5,
        "education_quality": 4,
        "employability_rate": 4,
        "facilities": 3,
        "faculty_quality": 5,
        "research_opportunities": 4,
        "student_life": 4,
        "overall_rating": 4.125,
        "comment": "Great university with excellent faculty and good facilities.",
        "created_at": "2024-01-15 11:00:00"
    }
    
    print("Sample User Record:")
    print(json.dumps(sample_user, indent=2))
    print()
    print("Sample Rating Record:")
    print(json.dumps(sample_rating, indent=2))

def main():
    """Main demo function"""
    print_header()
    
    # Show all sections
    universities = show_universities()
    show_rating_criteria()
    show_features()
    show_tech_stack()
    show_sample_data()
    show_installation()
    
    print()
    print("=" * 60)
    print("🎉 DEMO COMPLETE!")
    print("=" * 60)
    print()
    print("The application includes:")
    print(f"✅ {len(universities)} universities in the database")
    print("✅ Complete student authentication system")
    print("✅ 8-criteria rating system")
    print("✅ Modern responsive web interface")
    print("✅ SQLite database with proper relationships")
    print("✅ Security features and form validation")
    print()
    print("To run the full application, install dependencies and run 'python app.py'")
    print("For more information, see the README.md file")

if __name__ == "__main__":
    main() 