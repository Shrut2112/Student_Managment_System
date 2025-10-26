from django.db import models
from django.conf import settings
# from department.models import Department
# Never import models inside other models if both apps depend on each other. Use string
# Create your models here.
class Instructor(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, primary_key=True)
    InsId = models.CharField(max_length=10,unique=True)
    # fname = models.CharField(max_length=100)
    # lname = models.CharField(max_length=100)
    # email = models.EmailField(unique=True)
    # password = models.CharField(max_length=50)
    phno = models.CharField(max_length=10)
    dept = models.ForeignKey("department.Department",on_delete=models.CASCADE)
    def __str__(self):
        return self.user.username