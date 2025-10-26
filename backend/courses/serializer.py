from rest_framework.serializers import ModelSerializer
from .models import Course

class CourseSerializer(ModelSerializer):
    class Meta:
        model = Course
        fields = ['CourseCode','CourseName','CourseDesc','CourseCredits','Course_Dept_ID']
        