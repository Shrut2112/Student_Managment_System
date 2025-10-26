from rest_framework import serializers
from .models import Teaches
from datetime import datetime
class TeachSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teaches
        fields = '__all__'
    def validate_sem(self, value):
        if value < 1 or value > 8:
            raise serializers.ValidationError("Semester must be between 1 and 8")
        return value

    

    def validate(self, data):
        # Prevent duplicate allotment
        if Teaches.objects.filter(
            instructor=data['instructor'],
            course=data['course'],
            sem=data['sem'],
            year=data['year']
        ).exists():
            raise serializers.ValidationError("This instructor is already allotted this course for the given sem/year")
        return data

class TeachesInstructorSerializer(serializers.ModelSerializer):
    InsId = serializers.CharField(source='instructor.InsId')
    first_name = serializers.CharField(source='instructor.user.first_name')
    last_name = serializers.CharField(source='instructor.user.last_name')
    email = serializers.EmailField(source='instructor.user.email', read_only=True)

    class Meta:
        model = Teaches
        fields = ['InsId', 'first_name', 'last_name', 'email', 'sem', 'year']
