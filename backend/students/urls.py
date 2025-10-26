from django.urls import path,include
from .views import Profile #Register,Login
from rest_framework.routers import DefaultRouter
from .views import StudentViewSet
router = DefaultRouter()
router.register(r'api',StudentViewSet,basename='student')
urlpatterns =[
    # path('register', Register.as_view(), name='student-register'),
    # path('login', Login.as_view(), name='student-login'),
    path('profile', Profile.as_view(), name='student-profile'),
    path('',include(router.urls))
]