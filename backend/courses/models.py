from django.db import models
from department.models import Department
# Create your models here.
class Course(models.Model):
    CourseCode = models.CharField(primary_key=True,unique=True,max_length=10)
    CourseName = models.CharField(max_length=100)
    CourseDesc = models.TextField()
    CourseCredits = models.IntegerField()
    Course_Dept_ID = models.ForeignKey(Department,on_delete=models.CASCADE,related_name='courses')
    # Course_Instructor = models.CharField(max_length=100)