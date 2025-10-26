from django.urls import path
from .views import ActivityLog
urlpatterns = [
    path("logs/",ActivityLog.as_view(),name="GetActivity")
]