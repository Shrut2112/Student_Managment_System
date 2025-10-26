from django.urls import path
from .views import MarkAttendance,CourseAttendance,StudentAttendance,CourseAttendanceStats,AttendanceStats
urlpatterns = [
    path('markAttendance/',MarkAttendance.as_view(),name='MarkAttendance'),
    path('course/<str:CourseCode>/',CourseAttendance.as_view(),name='CourseAttend'),
    path('student/<str:studentId>/',StudentAttendance.as_view(),name='StudentAttend'),
    path('stats/<str:CourseCode>/',CourseAttendanceStats.as_view(),name="Stats"),
    path('status/<str:CourseCode>/',AttendanceStats.as_view(),name="Status"),
]