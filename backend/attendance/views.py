from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Attendance
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from backend.permission import IsInstructor,IsInstOrAdmin
from Instructor.models import Instructor
from courses.models import Course
from students.models import Student
from datetime import date
from .serializer import AttendanceSerializer
from enrolled.models import Enrolled
from students.serilizer import StudentSerializer
from logs.models import LogDetails
# Create your views here.
class MarkAttendance(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated,IsInstructor]

    def post(self,request):

        instructor_id = request.data.get('InsId')
        course_code = request.data.get('CourseCode')
        attendance_data = request.data.get('attendance_data')

        if not attendance_data:
            return Response({"error": "No attendance data provided"}, status=400)

        try:
            instructor = Instructor.objects.get(InsId = instructor_id)
        except:
            return Response({"error": "Instructor not found"}, status=404)
        
        try:
            courses = Course.objects.get(CourseCode = course_code)
        except:
            return Response({"error": "Course not found"}, status=404)
        
        for entry in attendance_data:

            student_id = entry
            status = attendance_data[entry]

            if student_id is None:
                continue

            student = Student.objects.get(studentId = student_id)

            #find the record using column student,cours,date if found change the values for key value in defaults if not found create the record
            Attendance.objects.update_or_create(
                student = student,
                course = courses,
                date = date.today(),
                defaults={
                    "status":status,
                    "marked_by":instructor
                }
            )

            LogDetails.objects.create(
                user=request.user,
                action=f"Attendance for {course_code} is Marked by {instructor_id} on {date.today()}"
            )
        return Response({"message":"Attendance updated"})

class CourseAttendance(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated,IsInstOrAdmin]

    def get(self,request,CourseCode):
        try:
            course = Course.objects.get(CourseCode=CourseCode)
        except Course.DoesNotExist:
            return Response({"error": "Course not found"}, status=404)
        
        attendance = Attendance.objects.filter(course=course).select_related("student","marked_by")
        attendancer = Attendance.objects.filter(course=course)
        dates = sorted(set(att.date.strftime("%Y-%m-%d") for att in attendance))
        
        student_dict = {}
        for att in attendance:
            sid = att.student.studentId
            if sid not in student_dict:
                student_dict[sid]={
                    "namef": att.student.user.first_name,
                    "namel": att.student.user.last_name,
                    "attendance": {}
                }
            student_dict[sid]["attendance"][att.date.strftime("%Y-%m-%d")] = att.status

        result = []
        for sid,info in student_dict.items():
            total_days = len(info["attendance"])
            present_days = sum(info["attendance"].get(date,False) for date in dates)
            percentage = round((present_days / total_days) * 100, 2) if total_days else 0
            result.append({
                "student_id": sid,
                "namef": info["namef"],
                "namel": info["namel"],
                "attendance": info["attendance"],
                "percentage": percentage
            })
        avg_attendance = sum(r["percentage"] for r in result) / len(result) if result else 0
        return Response({"student_data":result,"dates":dates,"average_attendance":round(avg_attendance,2)})

class StudentAttendance(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self,request,studentId):
        try:
            student = Student.objects.get(studentId=studentId)
        except Student.DoesNotExist:
            return Response({"error":"Student Not exists"})
        
        attendance = Attendance.objects.filter(student=student)
        dates = sorted(set(att.date.strftime("%Y-%m-%d") for att in attendance))

        course_dict = {}
        for att in attendance:
            ccode = att.course.CourseCode
            if ccode not in course_dict:
                course_dict[ccode]={
                    "coursename": att.course.CourseName,
                    "attendance": {}
                }
            course_dict[ccode]["attendance"][att.date.strftime("%Y-%m-%d")] = att.status
        
        result = []
        for ccode,info in course_dict.items():
            total_days = len(info["attendance"])
            present_days = sum(info["attendance"].get(date,False) for date in dates)
            percentage = round((present_days / total_days) * 100, 2) if total_days else 0
            result.append({
                "course_code": ccode,
                "coursename": info["coursename"],
                "attendance": info["attendance"],
                "percentage": percentage,
                "total_classes": total_days,
                "classes_attended": present_days
            })
        attended_class = sum(r["classes_attended"] for r in result)
        total_class = sum(r["total_classes"] for r in result)
        avg_attendance = (attended_class / total_class * 100) if total_class > 0 else 0

        return Response({"result":result,"dates":dates,"average_attendance":round(avg_attendance,2)})

class CourseAttendanceStats(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self,request,CourseCode):
        try:
            course = Course.objects.get(CourseCode=CourseCode)
        except Course.DoesNotExist:
            return Response({"error": "Course not found"}, status=404)
        
        students = Enrolled.objects.filter(course_code=course).select_related('student_id')
        data = []
        for s in students:
            total_classes = Attendance.objects.filter(student=s.student_id,course=course).count()
            present_classes = Attendance.objects.filter(student=s.student_id,course=course,status=True).count()
            percentage = (present_classes / total_classes * 100) if total_classes > 0 else 0
            data.append({
                "studentId":s.student_id.studentId,
                "studentF":s.student_id.user.first_name,
                "studentL":s.student_id.user.last_name,
                "attendance_per":percentage
            })
        return Response({"course":CourseCode,"student":data})
    

from datetime import date

class AttendanceStats(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsInstOrAdmin]

    def get(self, request, CourseCode):
        today = date.today()
        try:
            course = Course.objects.get(CourseCode=CourseCode)
        except Course.DoesNotExist:
            return Response({"error": "Course not found"}, status=404)
        print("Date: ", today)
        course = Course.objects.get(CourseCode=CourseCode)
        attendance_marked = Attendance.objects.filter(course=course, date=today).exists()
        return Response({"attendance_marked": attendance_marked})
