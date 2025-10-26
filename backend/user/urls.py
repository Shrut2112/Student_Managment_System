from django.urls import path
from .views import RegisterUser,LoginUser

urlpatterns=[
    path('register',RegisterUser.as_view(),name='user_register'),
    path('login',LoginUser.as_view(),name='user_login')
]

