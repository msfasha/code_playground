from django import forms
from django.forms import inlineformset_factory
from .models import Course, Instructor, Objective

# Main form for Course
class CourseForm(forms.ModelForm):
    class Meta:
        model = Course
        fields = '__all__'
        widgets = {
            'credit_hours': forms.NumberInput(attrs={'min': 0}),
            'lecture_hours': forms.NumberInput(attrs={'min': 0}),
            'lab_hours': forms.NumberInput(attrs={'min': 0}),
        }

# Inline formset for Instructor
InstructorFormSet = inlineformset_factory(
    Course, Instructor, form=forms.ModelForm, fields=['name', 'email', 'office_no', 'office_ext', 'office_hours'],
    extra=1, can_delete=True
)

# Inline formset for Objective
ObjectiveFormSet = inlineformset_factory(
    Course, Objective, form=forms.ModelForm,
    fields=['objective_id', 'main_category', 'sub_category', 'related_program_learning_objective', 'teaching_method', 'assessment_method'],
    extra=1, can_delete=True
)
