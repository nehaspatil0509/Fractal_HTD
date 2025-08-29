from django.db import models
from employees.models import Employee   # Import Employee model

class Performance(models.Model):
    employee = models.ForeignKey(
        Employee, 
        on_delete=models.CASCADE, 
        related_name='performances'
    )
    completed_tasks = models.IntegerField(default=0)
    pending_tasks = models.IntegerField(default=0)
    rating = models.FloatField(default=0.0)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.employee.first_name} {self.employee.last_name} - Performance"
