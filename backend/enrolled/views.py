from .models import Enrolled
from rest_framework.views import APIView
from courses.models import Course
from students.models import Student
from rest_framework.response import Response
from .serializer import CourseSerializer
from students.serilizer import StudentSerializer
from logs.models import LogDetails
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication

class Enroll(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def post(self,request):
        data = request.data
        student_id = data['studentId']
        course_code = data['CourseCode']

        try:
            course = Course.objects.get(CourseCode=course_code)
            student = Student.objects.get(studentId=student_id)

            enrollment,created = Enrolled.objects.get_or_create(
                student_id=student,course_code=course
            )

            if created:
                LogDetails.objects.create(
                    user=request.user,
                    action=f"Student - {student_id} enrolled in course - {course_code}"
                )
                return Response({"message":"student enrolled successfully"})
            else:
                return Response({"message": "Already enrolled"})
        except Course.DoesNotExist:
            return Response({"error": "Course not found"}, status=404)

class StudentCList(APIView):
    def get(self,request,studentId):

        student_id = studentId
        try:
            student = Student.objects.get(studentId = student_id)
        except Student.DoesNotExist:
            return Response({"message":"student not found"})
        
        
        #Filter: Get all rows in Enrolled where student_id = S1.
        # → Matches 2 rows (S1–CSE101, S1–CSE102).
        # select_related('course_code'):
        # Tells Django to fetch Course data in the same SQL query.
        # So instead of just getting enrollment rows, it also pulls the linked Course rows.
        enrollments = Enrolled.objects.filter(student_id = student).select_related('course_code')
        
        # if not enrollments.exists():
        #     return Response({
        #         "studentId": student.studentId,
        #         "courses": []
        #     })
        
        courses = [e.course_code for e in enrollments]
        
        serializer = CourseSerializer(courses,many=True)
        return Response(serializer.data)

class CourseSList(APIView):
    def get(self,request,CourseCode):

        courses_code = CourseCode
        try:
            courses = Course.objects.get(CourseCode=courses_code)
        except Course.DoesNotExist:
            return Response({"message":"Course not found"})
      
        enrollment = Enrolled.objects.filter(course_code =courses).select_related('student_id')

        if not enrollment:
            return Response({
                "CourseCode": courses.CourseCode,
                "students": []
            })
        students = [e.student_id for e in enrollment]

        serializer = StudentSerializer(students,many=True)
        return Response(serializer.data)
