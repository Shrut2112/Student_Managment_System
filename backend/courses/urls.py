from django.urls import path,include
from .views import CourseList,CourseView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'api',CourseView,basename='course')
urlpatterns = [
    path('',CourseList.as_view(),name='course-list'),
    path('',include(router.urls))
]