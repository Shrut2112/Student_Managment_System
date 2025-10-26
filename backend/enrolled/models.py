from django.db import models
from students.models import Student
from courses.models import Course
from datetime import datetime
# Create your models here.
class Enrolled(models.Model):
    student_id = models.ForeignKey(Student,on_delete=models.CASCADE)
    course_code = models.ForeignKey(Course,on_delete=models.CASCADE)
    enrolled_on  = models.DateTimeField(default=datetime.now)

    class Meta:
        unique_together = ('student_id','course_code')
