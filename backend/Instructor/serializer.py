from rest_framework import serializers
from .models import Instructor
from department.models import Department

class InstSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    username = serializers.CharField(source='user.username',read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
   
    class Meta:
        model = Instructor
        fields = '__all__'
        
    def validate_password(self,value):
        if len(value)<8:
            raise serializers.ValidationError("Password must be at least 8 characters long")
        return value
    
    def validate_phno(self,value):
        if len(value) != 10 or not value.isdigit():
            raise serializers.ValidationError("Phone number must be 10 digits long")
        return value
    
    def validate_InsId(self,value):
        if len(value) != 10:
            raise serializers.ValidationError("Instructor ID must be 10 characters long")
        return value
    
    def update(self,instance,validated_data):
        user_data = validated_data.get('user',{})
        user = instance.user

        user.first_name = user_data.get('first_name',user.first_name)
        user.last_name = user_data.get('last_name',user.last_name)
        user.save()

        instance.dept = validated_data.get('dept',instance.dept)
        instance.phno = validated_data.get('phno', instance.phno)
        instance.save()

        return instance