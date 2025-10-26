from django.db import models
from students.models import Student
from courses.models import Course
from Instructor.models import Instructor
# Create your models here.
class Attendance(models.Model):
    student = models.ForeignKey(Student,on_delete=models.CASCADE)
    course = models.ForeignKey(Course,on_delete=models.CASCADE)
    date = models.DateField()
    status = models.BooleanField(default=False)
    marked_by = models.ForeignKey(Instructor,on_delete=models.SET_NULL,null=True)

    class Meta:
        unique_together = ('student','course','date')

    def __str__(self):
        return f"{self.student.studentId} - {self.course.CourseCode} ({self.date})"