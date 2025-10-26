from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets
from .models import Instructor
from .serializer import InstSerializer
from department.models import Department
from user.serializer import InstructorRegSerializer
# Create your views here.
class InstructorView(viewsets.ModelViewSet):
    queryset = Instructor.objects.all()
    lookup_field = 'InsId'

    def get_serializer_class(self):
        if self.action == 'create':
            return InstructorRegSerializer
        else:
            return InstSerializer
        
class InstructorList(APIView):
    def get(self,request):
        instructors = Instructor.objects.all()
        
        if not instructors.exists():
            return Response({"message":"No Instructor Found!"})
        serializer = InstSerializer(instructors,many=True)
        return Response(serializer.data)
    

class Instdept(APIView):
    def get(self,request,dept):
        try:
            dept = Department.objects.get(det_id = dept)
        except Department.DoesNotExist:
            return Response({"message":"no dept exsist"})

        instructors = Instructor.objects.filter(dept=dept)
        
        if not instructors.exists():
            return Response({"message":"No Instructor Found!"})
        
        serializer = InstSerializer(instructors,many=True)
        return Response(serializer.data)
    
class Profile(APIView):
    
    def get(self,request):
        try:
            InstId = request.GET.get('InsId')
            Inst = Instructor.objects.get(InsId=InstId)
        except Instructor.DoesNotExist:
            return Response({"message":"InstId invalid"})
        
        serializer = InstSerializer(Inst)
        return Response(serializer.data)
    
# class Login(APIView):
#     def post(self,request):
#         data = request.data
#         inst_id = data['InsId']
#         password = data['password']

#         try:
#             instructor = Instructor.objects.get(InsId = inst_id)
#         except Instructor.DoesNotExist:
#             return Response({"error":"InstId invalid"})
        
#         if instructor.password != password:
#             return Response({"error":"Password invalid"})
#         return Response({"message":"Login Successful"})