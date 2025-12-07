from django.urls import path
from . import views

urlpatterns = [
    path("", views.first_page, name="starting-page"),
    path("report", views.reports,name="reports_list"),
    path("report/<slug:slug>", views.report_detail, name="report_detail"),
]
