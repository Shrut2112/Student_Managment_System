from django.db import models
from django.core.validators import MinValueValidator,MaxValueValidator
from Instructor.models import Instructor 
from courses.models import Course
from datetime import date
# Create your models here.
class Teaches(models.Model):
    instructor = models.ForeignKey(Instructor,on_delete=models.CASCADE)
    course = models.ForeignKey(Course,on_delete=models.CASCADE)
    sem = models.IntegerField()
    year = models.IntegerField(
        validators=[
            MinValueValidator(1900),
            MaxValueValidator(date.today().year)
        ]
    )
    