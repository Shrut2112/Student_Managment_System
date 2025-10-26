from django.urls import path
from .views import InstructorList,CourseList,AllotCourse
urlpatterns =[
    path('allot/',AllotCourse.as_view(),name="AllotCourse"),
    path('course/<str:course_id>/instructor/', InstructorList.as_view(),name='instructorInCourse'),
    path('instructor/<str:inst_id>/courses/',CourseList.as_view(),name='CourseByInstructor')
]