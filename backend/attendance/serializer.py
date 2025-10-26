from rest_framework import serializers
from .models import Attendance

class AttendanceSerializer(serializers.ModelSerializer):
    student_id = serializers.CharField(source='student.studentId',read_only=True)
    course_name = serializers.CharField(source='course.CourseName',read_only=True)
    instructor_f_name = serializers.CharField(source='marked_by.user.first_name',read_only=True)
    instructor_l_name = serializers.CharField(source='marked_by.user.last_name',read_only=True)

    class Meta:
        model = Attendance
        fields = ['student_id','date','instructor_f_name','instructor_l_name','course_name','status']
