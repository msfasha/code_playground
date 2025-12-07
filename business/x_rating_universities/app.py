from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
import os
from datetime import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///universities.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# Database Models
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    full_name = db.Column(db.String(120), nullable=False)
    student_id = db.Column(db.String(20), nullable=False)
    department = db.Column(db.String(100), nullable=False)
    university_id = db.Column(db.Integer, db.ForeignKey('university.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    university = db.relationship('University', backref='students')

class University(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), unique=True, nullable=False)
    type = db.Column(db.String(20), nullable=False)  # 'public' or 'private'
    location = db.Column(db.String(100), nullable=False)
    website = db.Column(db.String(200))
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    ratings = db.relationship('Rating', backref='university', lazy=True)

class Rating(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    university_id = db.Column(db.Integer, db.ForeignKey('university.id'), nullable=False)
    campus_quality = db.Column(db.Integer, nullable=False)  # 1-5
    reputation = db.Column(db.Integer, nullable=False)  # 1-5
    education_quality = db.Column(db.Integer, nullable=False)  # 1-5
    employability_rate = db.Column(db.Integer, nullable=False)  # 1-5
    facilities = db.Column(db.Integer, nullable=False)  # 1-5
    faculty_quality = db.Column(db.Integer, nullable=False)  # 1-5
    research_opportunities = db.Column(db.Integer, nullable=False)  # 1-5
    student_life = db.Column(db.Integer, nullable=False)  # 1-5
    overall_rating = db.Column(db.Float, nullable=False)
    comment = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    user = db.relationship('User', backref='ratings')

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Routes
@app.route('/')
def index():
    # Optimize query with eager loading and limit initial load
    universities = University.query.options(
        db.joinedload(University.ratings)
    ).all()
    response = make_response(render_template('index.html', universities=universities))
    response.headers['Cache-Control'] = 'public, max-age=300'  # Cache for 5 minutes
    return response

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        full_name = request.form['full_name']
        student_id = request.form['student_id']
        department = request.form['department']
        university_id = request.form['university_id']
        
        if User.query.filter_by(username=username).first():
            flash('Username already exists')
            return redirect(url_for('register'))
        
        if User.query.filter_by(email=email).first():
            flash('Email already registered')
            return redirect(url_for('register'))
        
        user = User(
            username=username,
            email=email,
            password_hash=generate_password_hash(password),
            full_name=full_name,
            student_id=student_id,
            department=department,
            university_id=university_id
        )
        
        db.session.add(user)
        db.session.commit()
        
        flash('Registration successful! Please login.')
        return redirect(url_for('login'))
    
    universities = University.query.all()
    return render_template('register.html', universities=universities)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = User.query.filter_by(username=username).first()
        
        if user and check_password_hash(user.password_hash, password):
            login_user(user)
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid username or password')
    
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))

@app.route('/dashboard')
@login_required
def dashboard():
    user_rating = Rating.query.filter_by(user_id=current_user.id).first()
    return render_template('dashboard.html', user_rating=user_rating)

@app.route('/rate_university', methods=['GET', 'POST'])
@login_required
def rate_university():
    # Check if user already rated their university
    existing_rating = Rating.query.filter_by(user_id=current_user.id).first()
    if existing_rating:
        flash('You have already rated your university')
        return redirect(url_for('dashboard'))
    
    if request.method == 'POST':
        campus_quality = int(request.form['campus_quality'])
        reputation = int(request.form['reputation'])
        education_quality = int(request.form['education_quality'])
        employability_rate = int(request.form['employability_rate'])
        facilities = int(request.form['facilities'])
        faculty_quality = int(request.form['faculty_quality'])
        research_opportunities = int(request.form['research_opportunities'])
        student_life = int(request.form['student_life'])
        comment = request.form['comment']
        
        # Calculate overall rating
        overall_rating = (campus_quality + reputation + education_quality + 
                         employability_rate + facilities + faculty_quality + 
                         research_opportunities + student_life) / 8.0
        
        rating = Rating(
            user_id=current_user.id,
            university_id=current_user.university_id,
            campus_quality=campus_quality,
            reputation=reputation,
            education_quality=education_quality,
            employability_rate=employability_rate,
            facilities=facilities,
            faculty_quality=faculty_quality,
            research_opportunities=research_opportunities,
            student_life=student_life,
            overall_rating=overall_rating,
            comment=comment
        )
        
        db.session.add(rating)
        db.session.commit()
        
        flash('Thank you for rating your university!')
        return redirect(url_for('dashboard'))
    
    return render_template('rate_university.html')

@app.route('/university/<int:university_id>')
def university_detail(university_id):
    university = University.query.get_or_404(university_id)
    ratings = Rating.query.filter_by(university_id=university_id).all()
    
    if ratings:
        avg_ratings = {
            'campus_quality': sum(r.campus_quality for r in ratings) / len(ratings),
            'reputation': sum(r.reputation for r in ratings) / len(ratings),
            'education_quality': sum(r.education_quality for r in ratings) / len(ratings),
            'employability_rate': sum(r.employability_rate for r in ratings) / len(ratings),
            'facilities': sum(r.facilities for r in ratings) / len(ratings),
            'faculty_quality': sum(r.faculty_quality for r in ratings) / len(ratings),
            'research_opportunities': sum(r.research_opportunities for r in ratings) / len(ratings),
            'student_life': sum(r.student_life for r in ratings) / len(ratings),
            'overall': sum(r.overall_rating for r in ratings) / len(ratings)
        }
    else:
        avg_ratings = None
    
    return render_template('university_detail.html', university=university, ratings=ratings, avg_ratings=avg_ratings)

@app.route('/api/universities')
def api_universities():
    # Optimize with single query and aggregation
    universities = University.query.options(
        db.joinedload(University.ratings)
    ).all()
    
    result = []
    for uni in universities:
        ratings = uni.ratings
        avg_overall = sum(r.overall_rating for r in ratings) / len(ratings) if ratings else 0
        result.append({
            'id': uni.id,
            'name': uni.name,
            'type': uni.type,
            'location': uni.location,
            'avg_rating': round(avg_overall, 2),
            'total_ratings': len(ratings)
        })
    return jsonify(result)

def init_db():
    with app.app_context():
        db.create_all()
        
        # Add Jordanian universities if they don't exist
        if University.query.count() == 0:
            universities = [
                # Public Universities
                {'name': 'University of Jordan', 'type': 'public', 'location': 'Amman', 'website': 'https://www.ju.edu.jo'},
                {'name': 'Jordan University of Science and Technology', 'type': 'public', 'location': 'Irbid', 'website': 'https://www.just.edu.jo'},
                {'name': 'Yarmouk University', 'type': 'public', 'location': 'Irbid', 'website': 'https://www.yu.edu.jo'},
                {'name': 'Mutah University', 'type': 'public', 'location': 'Karak', 'website': 'https://www.mutah.edu.jo'},
                {'name': 'Al-Balqa Applied University', 'type': 'public', 'location': 'Salt', 'website': 'https://www.bau.edu.jo'},
                {'name': 'Al-Hussein Bin Talal University', 'type': 'public', 'location': 'Ma\'an', 'website': 'https://www.ahu.edu.jo'},
                {'name': 'Hashemite University', 'type': 'public', 'location': 'Zarqa', 'website': 'https://www.hu.edu.jo'},
                {'name': 'Al al-Bayt University', 'type': 'public', 'location': 'Mafraq', 'website': 'https://www.aabu.edu.jo'},
                {'name': 'German Jordanian University', 'type': 'public', 'location': 'Amman', 'website': 'https://www.gju.edu.jo'},
                
                # Private Universities
                {'name': 'Amman Arab University', 'type': 'private', 'location': 'Amman', 'website': 'https://www.aau.edu.jo'},
                {'name': 'Applied Science Private University', 'type': 'private', 'location': 'Amman', 'website': 'https://www.asu.edu.jo'},
                {'name': 'Arab Academy for Banking and Financial Sciences', 'type': 'private', 'location': 'Amman', 'website': 'https://www.aabfs.org'},
                {'name': 'Irbid National University', 'type': 'private', 'location': 'Irbid', 'website': 'https://www.inu.edu.jo'},
                {'name': 'Isra University', 'type': 'private', 'location': 'Amman', 'website': 'https://www.isra.edu.jo'},
                {'name': 'Jadara University', 'type': 'private', 'location': 'Irbid', 'website': 'https://www.jadara.edu.jo'},
                {'name': 'Jerash University', 'type': 'private', 'location': 'Jerash', 'website': 'https://www.jerashun.edu.jo'},
                {'name': 'Jordan Academy for Maritime Studies', 'type': 'private', 'location': 'Aqaba', 'website': 'https://www.jams.edu.jo'},
                {'name': 'Middle East University', 'type': 'private', 'location': 'Amman', 'website': 'https://www.meu.edu.jo'},
                {'name': 'Philadelphia University', 'type': 'private', 'location': 'Amman', 'website': 'https://www.philadelphia.edu.jo'},
                {'name': 'Princess Sumaya University for Technology', 'type': 'private', 'location': 'Amman', 'website': 'https://www.psut.edu.jo'},
                {'name': 'University of Petra', 'type': 'private', 'location': 'Amman', 'website': 'https://www.uop.edu.jo'},
                {'name': 'Zarqa University', 'type': 'private', 'location': 'Zarqa', 'website': 'https://www.zu.edu.jo'},
                {'name': 'Al-Zaytoonah University of Jordan', 'type': 'private', 'location': 'Amman', 'website': 'https://www.zuj.edu.jo'},
                {'name': 'American University of Madaba', 'type': 'private', 'location': 'Madaba', 'website': 'https://www.aum.edu.jo'},
                {'name': 'Al-Ahliyya Amman University', 'type': 'private', 'location': 'Amman', 'website': 'https://www.ammanu.edu.jo'},
                {'name': 'Al-Hussein Technical University', 'type': 'private', 'location': 'Amman', 'website': 'https://www.htu.edu.jo'},
                {'name': 'Jordan University College', 'type': 'private', 'location': 'Amman', 'website': 'https://www.juc.edu.jo'},
                {'name': 'King Talal School of Business Technology', 'type': 'private', 'location': 'Amman', 'website': 'https://www.ktsbt.edu.jo'},
                {'name': 'Luminus Technical University College', 'type': 'private', 'location': 'Amman', 'website': 'https://www.ltuc.edu.jo'},
                {'name': 'Queen Rania Faculty for Tourism and Heritage', 'type': 'private', 'location': 'Amman', 'website': 'https://www.qrft.edu.jo'},
                {'name': 'Royal Academy for Islamic Civilization Research', 'type': 'private', 'location': 'Amman', 'website': 'https://www.raicr.edu.jo'},
                {'name': 'Royal Medical Services', 'type': 'private', 'location': 'Amman', 'website': 'https://www.rms.edu.jo'},
                {'name': 'Royal Scientific Society', 'type': 'private', 'location': 'Amman', 'website': 'https://www.rss.edu.jo'},
                {'name': 'University College of Educational Sciences', 'type': 'private', 'location': 'Amman', 'website': 'https://www.uces.edu.jo'}
            ]
            
            for uni_data in universities:
                university = University(**uni_data)
                db.session.add(university)
            
            db.session.commit()

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5001) 