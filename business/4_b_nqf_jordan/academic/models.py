from django.db import models

class Course(models.Model):
    course_code = models.CharField(max_length=50)
    title = models.CharField(max_length=255)
    prerequisite = models.CharField(max_length=255, blank=True, null=True)
    co_requisite = models.CharField(max_length=255, blank=True, null=True)
    credit_hours = models.IntegerField()
    lecture_hours = models.IntegerField()
    lab_hours = models.IntegerField(blank=True, null=True)
    semester = models.CharField(max_length=50)
    year = models.CharField(max_length=50)
    platform = models.CharField(max_length=255)
    model_type = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.course_code} - {self.title}"


class Instructor(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    office_no = models.CharField(max_length=20)
    office_ext = models.CharField(max_length=20)
    office_hours = models.CharField(max_length=255)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='instructors')

    def __str__(self):
        return self.name

class Objective(models.Model):
    KNOWLEDGE = 'knowledge'
    INTELLECTUAL_SKILLS = 'intellectual_skills'
    PRACTICAL_SKILLS = 'practical_skills'
    COMPETENCY = 'competency'

    MAIN_CATEGORY_CHOICES = [
        (KNOWLEDGE, 'Knowledge'),
        (INTELLECTUAL_SKILLS, 'Intellectual Skills'),
        (PRACTICAL_SKILLS, 'Practical Skills'),
        (COMPETENCY, 'Competency'),
    ]

    # Sub-category choices for each main category
    KNOWLEDGE_SUBCATEGORY_CHOICES = [
        ('K1', 'K1'), ('K2', 'K2'), ('K3', 'K3'),  # Add more as needed
    ]
    INTELLECTUAL_SKILLS_SUBCATEGORY_CHOICES = [
        ('I1', 'I1'), ('I2', 'I2'), ('I3', 'I3'),  # Add more as needed
    ]
    PRACTICAL_SKILLS_SUBCATEGORY_CHOICES = [
        ('P1', 'P1'), ('P2', 'P2'), ('P3', 'P3'),  # Add more as needed
    ]
    COMPETENCY_SUBCATEGORY_CHOICES = [
        ('C1', 'C1'), ('C2', 'C2'), ('C3', 'C3'),  # Add more as needed
    ]

    TEACHING_METHOD_CHOICES = [
        ('lecture', 'Lecture'),
        ('discussion', 'Discussion'),
        ('lab', 'Lab'),
        ('project', 'Project'),  # Add more as needed
    ]

    ASSESSMENT_METHOD_CHOICES = [
        ('exam', 'Exam'),
        ('assignment', 'Assignment'),
        ('quiz', 'Quiz'),
        ('project', 'Project'),  # Add more as needed
    ]

    # Fields
    objective_id = models.CharField(max_length=20, unique=True)
    main_category = models.CharField(max_length=20, choices=MAIN_CATEGORY_CHOICES)
    sub_category = models.CharField(max_length=20)
    related_program_learning_objective = models.CharField(max_length=255)
    teaching_method = models.CharField(max_length=50, choices=TEACHING_METHOD_CHOICES)
    assessment_method = models.CharField(max_length=50, choices=ASSESSMENT_METHOD_CHOICES)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='objectives')  # ForeignKey to Course

    def save(self, *args, **kwargs):
        # Automatically adjust sub_category choices based on main_category
        if self.main_category == self.KNOWLEDGE:
            self._meta.get_field('sub_category').choices = self.KNOWLEDGE_SUBCATEGORY_CHOICES
        elif self.main_category == self.INTELLECTUAL_SKILLS:
            self._meta.get_field('sub_category').choices = self.INTELLECTUAL_SKILLS_SUBCATEGORY_CHOICES
        elif self.main_category == self.PRACTICAL_SKILLS:
            self._meta.get_field('sub_category').choices = self.PRACTICAL_SKILLS_SUBCATEGORY_CHOICES
        elif self.main_category == self.COMPETENCY:
            self._meta.get_field('sub_category').choices = self.COMPETENCY_SUBCATEGORY_CHOICES
        super(Objective, self).save(*args, **kwargs)

    def __str__(self):
        return f"{self.objective_id}: {self.main_category} - {self.sub_category}"
