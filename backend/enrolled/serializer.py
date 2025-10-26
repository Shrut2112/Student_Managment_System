from rest_framework import serializers
from courses.models import Course
from students.models import Student
class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'


