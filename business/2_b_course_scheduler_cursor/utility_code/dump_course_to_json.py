import json
import pandas as pd

# Define the course data from the image
courses = [
    # Compulsory Courses
    ("307101", "Introduction to Business Intelligence", "Compulsory"),
    ("307102", "Descriptive Statistics for Businesses", "Compulsory"),
    ("307201", "Data Management and Analytics", "Compulsory"),
    ("307202", "Programming Basics for Business Intelligence", "Compulsory"),
    ("307203", "Spreadsheets Management and Design for Business Intelligence (VBA)", "Compulsory"),
    ("307204", "Introduction to Databases for Businesses", "Compulsory"),
    ("307205", "Business Strategies and Enterprise Resource Planning for Businesses", "Compulsory"),
    ("307301", "Business Intelligence Programming", "Compulsory"),
    ("307302", "Artificial Intelligence and Machine Learning for Businesses", "Compulsory"),
    ("307303", "Legislation and Ethics for Data and Businesses", "Compulsory"),
    ("307304", "Business Intelligence and Data Mining", "Compulsory"),
    ("307305", "Cybersecurity Applications for Business Intelligence", "Compulsory"),
    ("307306", "Decision Support Systems for Business Intelligence", "Compulsory"),
    ("307401", "Big Data and Data Warehouse", "Compulsory"),
    ("307402", "Data Management Predictive Analysis and Visualization", "Compulsory"),
    ("307403", "Project Management for Business Intelligence", "Compulsory"),
    ("307498", "Graduation Project / Field Training", "Compulsory"),
    ("9307000", "Community Service (BI & DA)", "Compulsory"),

    # Elective Courses
    ("307206", "Data Visualisation Techniques for Businesses", "Elective"),
    ("307207", "Content Management Systems", "Elective"),
    ("307307", "Business Intelligence Methods and Models", "Elective"),
    ("307308", "Semantic Technologies for Big Data", "Elective"),
    ("307404", "Advanced Analytics for Supporting Business Intelligence Processes", "Elective"),
    ("307405", "Mobile Programming for Business Intelligence Applications", "Elective"),
    ("307406", "Special Topics in Business Intelligence", "Elective")
]

# Construct the data with level
course_data = []
for code, title, course_type in courses:
    level = int(code[3]) if code.startswith("307") else None  # handle 9307000 separately
    course_data.append({
        "course_code": code,
        "course_title": title,
        "course_type": course_type,
        "level": level,
        "department" : "Business Intelligence"
    })

# Save as JSON
json_path = "bi_courses.json"
with open(json_path, "w") as json_file:
    json.dump(course_data, json_file, indent=4)


# Define the new set of courses from the Electronic Business department

electronic_business_courses = [
    # Compulsory Courses
    ("304100", "اساسيات تكنولوجيا المعلومات -الإدارية", "Compulsory"),
    ("304101", "مقدمة في الاعمال الإلكترونية", "Compulsory"),
    ("304201", "تقنيات الاعمال الإلكترونية", "Compulsory"),
    ("304203", "استراتيجيات الأعمال الإلكترونية", "Compulsory"),
    ("304208", "برمجة تطبيقات الأعمال الإلكترونية", "Compulsory"),
    ("304301", "قواعد البيانات للأعمال الإلكترونية", "Compulsory"),
    ("304304", "نماذج و عمليات الأعمال الإلكترونية", "Compulsory"),
    ("304305", "امن نظم مواقع الشبكة المعلوماتية", "Compulsory"),
    ("304311", "إدارة شبكات التواصل الاجتماعي والعلاقة الإلكترونية مع الزبائن", "Compulsory"),
    ("304314", "تصميم و تطوير مواقع الأنترنت", "Compulsory"),
    ("304315", "التجارة  و الدفع الإلكتروني", "Compulsory"),
    ("304401", "الإدارة الإلكترونية لسلسلة التزويد", "Compulsory"),
    ("304402", "أنظمة الأعمال الذكية", "Compulsory"),
    ("304403", "تطوير نظم الأعمال الإلكترونية", "Compulsory"),
    ("304405", "القضايا القانونية و الأخلاقية في الاعمال الإلكترونية", "Compulsory"),
    ("304411", "الريادة و بناء خطة عمل المشروع", "Compulsory"),
    ("304412", "أدوات و تطبيقات الأعمال الإلكترونية", "Compulsory"),
    ("304413", "تكنولوجيا الوسائط المتعددة", "Compulsory"),
    ("304414", "إدارة مشاريع ألأعمال الإلكترونية", "Compulsory"),
    ("304498", "مشروع تخرج / تدريب ميداني", "Compulsory"),

    # Elective Courses
    ("304307", "التعليم الإلكتروني", "Elective"),
    ("304309", "التجارة الإلكترونية المتنقلة", "Elective"),
    ("304312", "الحكومة الإلكترونية و إدارة التغيير", "Elective"),
    ("304313", "برمجة تطبيقات الأعمال الإلكترونية المتقدمة", "Elective"),
    ("304407", "موضوعات متقدمة في الأعمال الإلكترونية", "Elective"),
    ("304499", "مهارات مهنية في الأعمال والتجارة الإلكترونية", "Elective")
]

# Construct the data with level and department
electronic_business_data = []
for code, title, course_type in electronic_business_courses:
    level = int(code[3])
    electronic_business_data.append({
        "course_code": code,
        "course_title": title,
        "course_type": course_type,
        "level": level,
        "department": "Electronic Business"
    })

# Save as JSON
electronic_json_path = "electronic_business_courses.json"
with open(electronic_json_path, "w") as json_file:
    json.dump(electronic_business_data, json_file, indent=4, ensure_ascii=False)


import json

# Load BI courses
with open("bi_courses.json", "r") as bi_file:
    bi_courses = json.load(bi_file)

# Load Electronic Business courses
with open("electronic_business_courses.json", "r", encoding="utf-8") as eb_file:
    electronic_courses = json.load(eb_file)

# Combine both lists
all_courses = bi_courses + electronic_courses

# Save the combined list to a new JSON file
with open("courses.json", "w", encoding="utf-8") as combined_file:
    json.dump(all_courses, combined_file, indent=4, ensure_ascii=False)
