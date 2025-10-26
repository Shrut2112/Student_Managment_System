from django.core.validators import validate_email
import re
from django.db import transaction
from rest_framework import serializers
from .models import Users
from students.models import Student
from Instructor.models import Instructor

class StudentRegistrationSerializer(serializers.ModelSerializer):
    # --- Define fields from the User model explicitly ---
    password = serializers.CharField(write_only=True, required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    username = serializers.CharField(required=True)

    class Meta:
        model = Student
        # --- List ALL fields needed for registration ---
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 
                  'studentId', 'gender', 'dob', 'phno', 'dept']

    # --- ALL Validation for BOTH models goes here ---
    def validate_username(self, value):
        if Users.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists.")
        return value

    def validate_email(self, value):
        if Users.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists.")
        try:
                validate_email(value)
        except:
                raise serializers.ValidationError("Enter a valid email address")
        return value

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError("Password must contain at least one uppercase letter.")
        if not re.search(r'[0-9]', value):
            raise serializers.ValidationError("Password must contain at least one number.")
        return value
        
    def validate_phno(self, value):
        if not value.isdigit() or len(value) != 10:
            raise serializers.ValidationError("Phone number must be exactly 10 digits.")
        return value

    def validate_studentId(self, value):
        if Student.objects.filter(studentId=value).exists():
            raise serializers.ValidationError("A student with this Student ID already exists.")
        return value

    # --- ALL Object Creation logic goes here ---
    @transaction.atomic
    def create(self, validated_data):
        # Create the User object
        new_user = Users.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            role='student' # Set the role here
        )
        
        # Create the Student object, linking it to the new user
        student = Student.objects.create(
            user=new_user,
            studentId=validated_data['studentId'],
            gender=validated_data.get('gender'),
            dob=validated_data.get('dob'),
            phno=validated_data.get('phno'),
            dept=validated_data.get('dept')
        )
        return student

class InstructorRegSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    username = serializers.CharField(required=True)
    class Meta:
        model = Instructor
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 
                  'InsId', 'phno', 'dept']
        
    def validate_username(self, value):
        if Users.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists.")
        return value
    def validate_email(self, value):
        if Users.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists.")
        try:
                validate_email(value)
        except:
                raise serializers.ValidationError("Enter a valid email address")
        return value
    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError("Password must contain at least one uppercase letter.")
        if not re.search(r'[0-9]', value):
            raise serializers.ValidationError("Password must contain at least one number.")
        return value
    def validate_phno(self, value):
        if not value.isdigit() or len(value) != 10:
            raise serializers.ValidationError("Phone number must be exactly 10 digits.")
        return value
    def validate_InsId(self, value):
        if Instructor.objects.filter(InsId=value).exists():
            raise serializers.ValidationError("An instructor with this Instructor ID already exists.")
        return value
    
    @transaction.atomic
    def create(self,validated_data):
        # Create the User object
        new_user = Users.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            role='instructor' # Set the role here
        )
        
        instructor = Instructor.objects.create(
            user=new_user,
            InsId=validated_data['InsId'],
            phno=validated_data.get('phno'),
            dept=validated_data['dept']
        )
        return instructor

class RegisterAdminSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    username = serializers.CharField(required=True)

    class Meta:
        model = Users
        fields = ['username', 'email', 'password', 'first_name', 'last_name']

    def validate_username(self, value):
        if Users.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists.")
        return value

    def validate_email(self, value):
        if Users.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists.")
        try:
                validate_email(value)
        except:
                raise serializers.ValidationError("Enter a valid email address")
        return value

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError("Password must contain at least one uppercase letter.")
        if not re.search(r'[0-9]', value):
            raise serializers.ValidationError("Password must contain at least one number.")
        return value

    @transaction.atomic
    def create(self, validated_data):
        admin_user = Users.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            role='admin'  # Set role to 'admin'
        )
        return admin_user