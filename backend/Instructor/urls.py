from django.urls import path,include
from .views import Instdept,Profile,InstructorList,InstructorView#,Login
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'api',InstructorView,basename='instructor')
urlpatterns=[
    path('department/<str:dept>/',Instdept.as_view(),name='Inst_dept_list'),
    path('profile/',Profile.as_view(),name='InstProfile'),
    # path('login/',Login.as_view(),name='InstLogin'),
    path('',InstructorList.as_view(),name='list-create'),
    path('',include(router.urls))
]   