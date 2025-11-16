from django.shortcuts import render
from django.db import transaction
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from students.models import Student
from Instructor.models import Instructor
from rest_framework.authtoken.models import Token
from .models import Users
from user.serializer import StudentRegistrationSerializer,InstructorRegSerializer,RegisterAdminSerializer
from rest_framework_simplejwt.tokens import RefreshToken

# Create your views here.
class RegisterUser(APIView):
    @transaction.atomic # if any part fails all changes in db will be rolled back 
    def post(self,request):
        if request.data.get('password') != request.data.get('cnfpassword'):
            return Response(
                {"error": "Password and Confirm Password do not match."},
                status=status.HTTP_400_BAD_REQUEST
            )
        role = request.data.get('role')
        
        

        if role == 'student':
            serializer = StudentRegistrationSerializer(data=request.data)
        elif role == 'instructor':
            serializer = InstructorRegSerializer(data=request.data)
        else:
            serializer = RegisterAdminSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        serializer.save()
        username = serializer.validated_data.get('username')
        return Response(
            {"message": f"User '{username}' created successfully as a {role}."},
            status=status.HTTP_201_CREATED
        )
    
class LoginUser(APIView):
    def post(self,request):
        data = request.data
        username = data.get('username')
        password = data.get('password')

        user = authenticate(username=username,password=password)

        if user is not None:
            #toekn,_= Token.objects.get_or_create(user=user)

            refresh =  RefreshToken.for_user(user)
            
            response_data = {
                'access': str(refresh.access_token),
                'user_id': user.id,
                'username': user.username,
                'role': user.role,
            }
            

            # --- This is the new logic ---
            # Check the user's role and find the corresponding profile ID
            try:
                if user.role == 'student':
                    student_profile = Student.objects.get(user=user)
                    response_data['studentId'] = student_profile.studentId
                    response_data['dept_id'] = student_profile.dept.det_id
                elif user.role == 'instructor':
                    instructor_profile = Instructor.objects.get(user=user)
                    response_data['InsId'] = instructor_profile.InsId
                    response_data['dept_id'] = instructor_profile.dept.det_id
                    
            except (Student.DoesNotExist, Instructor.DoesNotExist):
                # This case handles if a user exists but their role-specific
                # profile hasn't been created yet.
                pass 
            # --- End of new logic ---
            response = Response(response_data, status=status.HTTP_200_OK)
            response.set_cookie(
                key="refresh_token",
                value=str(refresh),
                httponly=True,
                secure=False,
                samesite='Lax',
                max_age=60*60*24
            )
            return response
        else:
            return Response(
                {"error": "Invalid credentials"},
                status=status.HTTP_401_UNAUTHORIZED
            )
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

class CookieTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get("refresh_token")
        
        if refresh_token is None:
            return Response({"detail": "Refresh token not found"}, status=401)

        try:
            refresh = RefreshToken(refresh_token)
            data = {"access": str(refresh.access_token)}
            return Response(data)
        except Exception as e:
            return Response({"detail": "Invalid or expired refresh token"}, status=401)
