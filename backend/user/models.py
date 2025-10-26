# backend/user/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser

class Users(AbstractUser):
    ROLE_CHOICE = (
        ('student', 'student'),
        ('instructor', 'instructor'),
        ('admin', 'admin'),
    )
    
    # You already have this, which is perfect!
    role = models.CharField(max_length=20, choices=ROLE_CHOICE)

    # Note: username, first_name, last_name, email, and password
    # fields are all inherited from AbstractUser automatically.
    # No need to define them here!