from django.db import models
from accounts.models import User

class Attendance(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='attendances')
    date = models.DateField()
    status = models.CharField(max_length=10, choices=[('present','Present'),('absent','Absent')])

    def __str__(self):
        return f"{self.user.username} - {self.date} - {self.status}"
