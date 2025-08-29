from django.db import models
from accounts.models import User   # user who creates employee

class Employee(models.Model):
    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="employees",
        null=True,     # allow NULL for existing rows
        blank=True     # allow blank in admin/forms
    )
    first_name = models.CharField(max_length=100,null=True)
    last_name = models.CharField(max_length=100,null=True)
    email = models.EmailField(unique=True, null=True, blank=True)
    designation = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    date_of_joining = models.DateField()

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.designation}"
