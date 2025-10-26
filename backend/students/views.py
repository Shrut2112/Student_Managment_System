from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import viewsets
from .serilizer import StudentSerializer
from .models import Student
from user.serializer import StudentRegistrationSerializer

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    lookup_field = 'studentId'

    def get_serializer_class(self):
        if self.action == 'create':
            return StudentRegistrationSerializer
        else:
            return StudentSerializer

class Profile(APIView):
    def get(self,request):
        user_id = request.GET.get('studentId')
        print(user_id)

        try:
            student = Student.objects.get(studentId=user_id)
        except Student.DoesNotExist:
            return Response({'error':'Student not found'})

        serializer = StudentSerializer(student)
        if serializer.is_valid:
            return Response(serializer.data)
        return Response(serializer.errors)
    
    def put(self,request):
        data = request.data
        user_id = data['studentId']
        
        try:
            student = Student.objects.get(studentId=user_id)
        except Student.DoesNotExist:
            return Response({'error':'Student not found'})
        
        serializer = StudentSerializer(student,data=data)

        if serializer.is_valid():
            serializer.save()
            return Response({'message':'Profile Updated Successfully'})
        return Response(serializer.errors)

