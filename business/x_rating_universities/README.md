# Jordan Universities Rating System

A comprehensive web application that allows university students in Jordan to rate and review their universities based on multiple criteria. Built with Python Flask, SQLite database, and modern web technologies.

## Features

### 🎓 University Management
- **29 Jordanian Universities**: Complete database of public and private universities in Jordan
- **University Profiles**: Detailed information including location, type, and website links
- **Categorized Display**: Filter universities by public or private status

### 👤 Student Authentication
- **Student Registration**: Secure registration system for university students
- **Profile Management**: Students can manage their personal and academic information
- **University Verification**: Students can only rate their own university

### ⭐ Comprehensive Rating System
Students can rate their university across 8 key criteria:
- **Campus Quality**: Overall campus facilities and infrastructure
- **Reputation**: University standing in academic community and job market
- **Education Quality**: Curriculum and academic standards
- **Employability Rate**: Career preparation and job placement success
- **Facilities**: Libraries, labs, sports centers, and other amenities
- **Faculty Quality**: Teaching staff expertise and methods
- **Research Opportunities**: Availability of research programs
- **Student Life**: Social activities and campus experience

### 📊 Analytics & Statistics
- **Average Ratings**: Calculated overall and per-criteria ratings
- **Visual Charts**: Progress bars showing rating distributions
- **Student Reviews**: Individual student comments and feedback
- **Rating History**: Track when ratings were submitted

### 🎨 Modern User Interface
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Bootstrap 5**: Modern, clean, and professional design
- **Interactive Elements**: Star ratings, progress bars, and animations
- **User-Friendly Navigation**: Intuitive breadcrumbs and navigation

## Technology Stack

- **Backend**: Python Flask
- **Database**: SQLite
- **Frontend**: HTML5, CSS3, JavaScript
- **UI Framework**: Bootstrap 5
- **Icons**: Font Awesome 6
- **Authentication**: Flask-Login

## Installation & Setup

### Prerequisites
- Python 3.7 or higher
- pip (Python package installer)

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd rating_universities
```

### Step 2: Create Virtual Environment (Recommended)
```bash
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Run the Application
```bash
python app.py
```

The application will be available at `http://localhost:5001`

## Database Structure

### Users Table
- Student registration and authentication
- Personal information (name, email, student ID)
- Academic information (department, university)
- Account creation timestamp

### Universities Table
- University information (name, type, location)
- Website links and descriptions
- Creation timestamp

### Ratings Table
- Individual student ratings for each criterion
- Overall calculated rating
- Optional comments
- Rating submission timestamp

## Usage Guide

### For Students

1. **Registration**
   - Visit the website and click "Register as Student"
   - Fill in your personal and academic information
   - Select your university from the dropdown
   - Create a secure password

2. **Login**
   - Use your username and password to access your account
   - View your dashboard with profile information

3. **Rating Your University**
   - Navigate to "Rate University" from your dashboard
   - Rate each criterion on a scale of 1-5 stars
   - Add optional comments about your experience
   - Submit your rating (one-time only per student)

4. **Viewing Results**
   - Browse all universities on the home page
   - Click on any university to see detailed ratings
   - View individual student reviews and comments

### For Visitors

1. **Browse Universities**
   - View all 29 Jordanian universities on the home page
   - Filter by public or private universities
   - See average ratings and number of reviews

2. **University Details**
   - Click on any university to view detailed information
   - See rating statistics and progress bars
   - Read individual student reviews

## API Endpoints

- `GET /` - Home page with all universities
- `GET /register` - Student registration form
- `POST /register` - Process student registration
- `GET /login` - Login form
- `POST /login` - Process login
- `GET /dashboard` - Student dashboard (requires authentication)
- `GET /rate_university` - Rating form (requires authentication)
- `POST /rate_university` - Submit rating (requires authentication)
- `GET /university/<id>` - University detail page
- `GET /api/universities` - JSON API for universities data

## Security Features

- **Password Hashing**: Secure password storage using Werkzeug
- **Session Management**: Flask-Login for user sessions
- **Form Validation**: Server-side validation for all forms
- **CSRF Protection**: Built-in CSRF protection with Flask-WTF
- **Input Sanitization**: Proper input handling and sanitization

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact the development team or create an issue in the repository.

## Future Enhancements

- [ ] Email verification for student accounts
- [ ] Advanced filtering and search options
- [ ] University comparison features
- [ ] Mobile application
- [ ] Admin panel for university management
- [ ] Export ratings to PDF/Excel
- [ ] Social media integration
- [ ] Multi-language support (Arabic/English)

## Screenshots

*Screenshots of the application will be added here*

---

**Note**: This application is designed specifically for Jordanian universities and students. The university database includes 29 major universities in Jordan, both public and private institutions. 