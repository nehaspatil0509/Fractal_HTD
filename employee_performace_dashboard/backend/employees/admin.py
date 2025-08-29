from django.contrib import admin
from .models import Employee

@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = (
        'first_name',
        'last_name',
        'email',
        'designation',
        'department',
        'date_of_joining',
        'created_by',
    )
    search_fields = ('first_name', 'last_name', 'email', 'designation', 'department')
    list_filter = ('department', 'designation')
