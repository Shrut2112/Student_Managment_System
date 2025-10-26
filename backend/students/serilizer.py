from rest_framework import serializers
from .models import Student

class StudentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username',read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    class Meta:
        model = Student
        fields = [
            "studentId",
            "gender",
            "dob",
            "phno",
            "dept_id",
            "username",
            "first_name",
            "last_name",
            "email",
        ]
        read_only_fields = ['id', 'studentId', 'dept_id', 'username', 'email']
    
    def update(self, instance, validated_data):
        # Pop user-related data
        instance.dob = validated_data.get('dob', instance.dob)
        instance.phno = validated_data.get('phno', instance.phno)
        instance.gender = validated_data.get('gender', instance.gender)
        instance.save()

        user_data = validated_data.get('user', {})
        user = instance.user

        user.first_name = user_data.get('first_name', user.first_name)
        user.last_name = user_data.get('last_name', user.last_name)
        user.save()

        return instance
    
    