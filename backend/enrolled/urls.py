from django.urls import path
from .views import Enroll,StudentCList,CourseSList
urlpatterns =[
    path('enroll',Enroll.as_view(),name='enroll-student'),
    path('student/<str:studentId>/',StudentCList.as_view(),name='course-list'),
    path('course/<str:CourseCode>/',CourseSList.as_view(),name='student-list'),
]