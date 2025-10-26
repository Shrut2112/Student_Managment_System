from django.db import models
# from Instructor.models import Instructor
# Never import models inside other models if both apps depend on each other. Use string
# Create your models here.
class Department(models.Model):
    dept_name = models.CharField(max_length=100)
    det_id = models.CharField(primary_key=True,max_length=3)
    hod = models.ForeignKey("Instructor.Instructor",on_delete=models.SET_NULL,null=True, blank=True,related_name='department_led')

    @property
    def n_student(self):
        return self.student_set.count()
    
    @property
    def n_instructor(self):
        return self.instructor_set.count()
