from django.db import models
from employees.models import Employee

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


# New: Performance Goals
class PerformanceGoal(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="goals")
    goal_title = models.CharField(max_length=255)
    target = models.IntegerField()  # Example: target tasks to complete
    achieved = models.IntegerField(default=0)
    due_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.employee.first_name} {self.employee.last_name} - {self.goal_title}"


# New: 360-Degree Feedback
class Feedback(models.Model):
    performance = models.ForeignKey(Performance, on_delete=models.CASCADE, related_name="feedbacks")
    reviewer_name = models.CharField(max_length=255)  # manager, peer, or self
    comments = models.TextField()
    rating = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback for {self.performance.employee.first_name} by {self.reviewer_name}"
