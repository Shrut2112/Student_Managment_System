from django.shortcuts import render
from rest_framework.views import APIView
from .models import Department
from Instructor.models import Instructor
from rest_framework.response import Response
from .serializer import DeptSerializer
from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from backend.permission import IsAdmin
from logs.models import LogDetails

class DepView(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated,IsAdmin]

    queryset = Department.objects.all()
    lookup_field = 'det_id'
    serializer_class = DeptSerializer

    def perform_create(self, serializer):
        department = serializer.save()
        LogDetails.objects.create(
            user=self.request.user,
            action=f"Department '{department.det_id}' ({department.dept_name}) was created by {self.request.user.username}."
        )
    def perform_destroy(self, instance):
        LogDetails.objects.create(
            user=self.request.user,
            action=f"Department '{instance.det_id}' ({instance.dept_name}) was deleted by {self.request.user.username}."
        )
# Create your views here.
class Dep_info(APIView):
    def get(self,request,dept_id):
        try:
            department = Department.objects.get(det_id = dept_id)
        except Department.DoesNotExist:
            return Response({"error":"No such department exist"})
        
        serailizer = DeptSerializer(department)
        print(serailizer.data.get('n_student'))
        print(serailizer.data.get('n_instructor'))
        return Response(serailizer.data)
        
class AssignHod(APIView):

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated,IsAdmin]
    
    def post(self,request):
        data = request.data
        dept_id = data['dept_id']
        inst_id = data['InsId']
        try:
            dept = Department.objects.get(det_id=dept_id)
        except Department.DoesNotExist:
            return Response({"error":"No such department exist"})
        
        try:
            instruc = Instructor.objects.get(InsId = inst_id)
        except Instructor.DoesNotExist:
            return Response({"error":"No such Instructor exist"})
        
        dept.hod = instruc
        dept.save()

        LogDetails.objects.create(
            user=request.user,
            action=f"Instructor {inst_id} is assign as HOD of {dept_id} by {request.user.username}"
        )
        return Response({
            "message": "HOD assigned successfully",
            "department": dept.dept_name,
            "hod": instruc.user.first_name + " " + instruc.user.last_name
        })