from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Teaches
from courses.models import Course
from Instructor.models import Instructor
from courses.serializer import CourseSerializer
from Instructor.serializer import InstSerializer
from .serializer import TeachSerializer
from enrolled.models import Enrolled
from django.db.models import Count
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from backend.permission import IsAdmin,IsInstOrAdmin
from .serializer import TeachesInstructorSerializer
from logs.models import LogDetails
# Create your views here.
class AllotCourse(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated,IsAdmin]

    def post(self,request):
        ins_id = request.data.get("InsId")
        course_code = request.data.get("CourseCode")
        sem = request.data.get("sem")
        year = request.data.get("year")
        try:
            inst = Instructor.objects.get(InsId=ins_id)
        except Instructor.DoesNotExist:
            return Response({"error": "Instructor not found"}, status=404)

        try:
            course = Course.objects.get(CourseCode=course_code)
        except Course.DoesNotExist:
            return Response({"error": "Course not found"}, status=404)
        
        if Teaches.objects.filter(instructor=inst,course=course,sem=sem,year=year).exists():
            return Response({"error": "This course is already allotted to this instructor for the same semester and year."},status=400)
        payload = {
            "instructor": inst.pk,
            "course": course.pk,
            "sem": request.data.get("sem"),
            "year": request.data.get("year"),
        }
        serializer = TeachSerializer(data=payload)
        if serializer.is_valid():
            serializer.save()
            LogDetails.objects.create(
                user=request.user,
                action=f"Course - {course_code} allotted to Instructor - {ins_id} by {request.user.username}"
            )
            return Response({"message": "Course Allotted Successfully"})
        return Response(serializer.errors, status=400)                


class CourseList(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated,IsInstOrAdmin]
    def get(self,request,inst_id):

        try:
            instructor = Instructor.objects.get(InsId=inst_id)
        except Instructor.DoesNotExist:
            return Response({"error":"No Instructor Exist with this Id"}, status=404)
        
        teaches = Teaches.objects.filter(instructor=instructor).select_related('course')
        
        courses_payload = []
        for t in teaches:
            enrolled_count = Enrolled.objects.filter(course_code=t.course).count()
            courses_payload.append({
                "CourseCode": t.course.CourseCode,
                "CourseName": t.course.CourseName,
                "CourseDesc": t.course.CourseDesc,
                "CourseCredits": t.course.CourseCredits,
                "Course_Dept_ID": t.course.Course_Dept_ID.det_id,
                "sem": t.sem,
                "year": t.year,
                "enrolled_students_count": enrolled_count,
                
            })
        
        return Response(courses_payload)

class InstructorList(APIView):
    def get(self,request,course_id):
        try:
            Course_found = Course.objects.get(CourseCode = course_id)
        except Course.DoesNotExist:
            return Response({"error":"No Course Exist wih this Course Code"})
        
        course_data = Teaches.objects.filter(course = Course_found).select_related('instructor')
        
        serializer = TeachesInstructorSerializer(course_data,many=True)
        return Response(serializer.data)