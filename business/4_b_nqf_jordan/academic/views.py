from django.shortcuts import render, redirect, get_object_or_404
from .models import Course
from .forms import CourseForm, InstructorFormSet, ObjectiveFormSet

def add_course(request):
    if request.method == 'POST':
        course_form = CourseForm(request.POST)
        instructor_formset = InstructorFormSet(request.POST, instance=course_form.instance)
        objective_formset = ObjectiveFormSet(request.POST, instance=course_form.instance)
        
        if course_form.is_valid() and instructor_formset.is_valid() and objective_formset.is_valid():
            course = course_form.save()
            instructor_formset.instance = course
            instructor_formset.save()
            objective_formset.instance = course
            objective_formset.save()
            return redirect('course_list')  # Redirect to course list after saving

    else:
        course_form = CourseForm()
        instructor_formset = InstructorFormSet(instance=Course())
        objective_formset = ObjectiveFormSet(instance=Course())

    return render(request, 'academic/add_course.html', {
        'course_form': course_form,
        'instructor_formset': instructor_formset,
        'objective_formset': objective_formset
    })


def edit_course(request, pk):
    course = get_object_or_404(Course, pk=pk)
    if request.method == 'POST':
        course_form = CourseForm(request.POST, instance=course)
        instructor_formset = InstructorFormSet(request.POST, instance=course)
        objective_formset = ObjectiveFormSet(request.POST, instance=course)
        
        if course_form.is_valid() and instructor_formset.is_valid() and objective_formset.is_valid():
            course_form.save()
            instructor_formset.save()
            objective_formset.save()
            return redirect('course_list')

    else:
        course_form = CourseForm(instance=course)
        instructor_formset = InstructorFormSet(instance=course)
        objective_formset = ObjectiveFormSet(instance=course)

    return render(request, 'academic/edit_course.html', {
        'course_form': course_form,
        'instructor_formset': instructor_formset,
        'objective_formset': objective_formset
    })


def course_list(request):
    courses = Course.objects.all()
    return render(request, 'academic/course_list.html', {'courses': courses})


def delete_course(request, pk):
    course = get_object_or_404(Course, pk=pk)
    if request.method == 'POST':
        course.delete()
        return redirect('course_list')
    return render(request, 'academic/delete_course.html', {'course': course})
