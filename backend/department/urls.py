from django.urls import path,include
from .views import Dep_info,AssignHod,DepView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'api',DepView,basename='department')
urlpatterns =[
    path('dept_info/<str:dept_id>',Dep_info.as_view(),name='dept_info'),
    path('assign_hod',AssignHod.as_view(),name='assign_hod'),
    path('',include(router.urls))
]