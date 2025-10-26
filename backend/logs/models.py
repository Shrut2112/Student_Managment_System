from django.db import models
from user.models import Users

# Create your models here.
class LogDetails(models.Model):
    user = models.ForeignKey(Users, on_delete=models.CASCADE,null=True)
    action = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - {self.action} at {self.timestamp}"