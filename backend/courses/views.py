from django.shortcuts import render
from rest_framework.views import APIView
from .models import Course
from rest_framework.response import Response
from .serializer import CourseSerializer
from rest_framework import viewsets
from logs.models import LogDetails
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
class CourseView(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Course.objects.all()
    lookup_field = 'CourseCode'
    serializer_class = CourseSerializer
    def perform_create(self, serializer):
        course = serializer.save()
        LogDetails.objects.create(
            user=self.request.user,
            action=f"Course '{course.CourseName}' ({course.CourseCode}) was created by {self.request.user.username}."
        )

    def perform_destroy(self, instance):
        LogDetails.objects.create(
            user=self.request.user,
            action=f"Course '{instance.CourseName}' ({instance.CourseCode}) was deleted by {self.request.user.username}."
        )
        instance.delete()
# Create your views here.
class CourseList(APIView):
    def get(self,request):
        dept_name = request.GET.get('dept_id')
        data = Course.objects.filter(Course_Dept_ID=dept_name)
        try:
            serializer = CourseSerializer(data,many=True)
        except Course.DoesNotExist:
            return Response({'error':'Course not found'})
        return Response(serializer.data)
