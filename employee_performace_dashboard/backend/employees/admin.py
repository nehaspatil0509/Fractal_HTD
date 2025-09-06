from django.contrib import admin
from .models import Employee, EmployeeImportHistory

@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = (
        'first_name',
        'last_name',
        'email',
        'designation',
        'department',
        'date_of_joining',
        'get_username',     # display linked user's username
        'get_manager_name', # display manager's username
    )
    search_fields = ('first_name', 'last_name', 'email', 'designation', 'department')
    list_filter = ('department', 'designation', 'manager')

    # Methods to display related fields
    def get_username(self, obj):
        return obj.user.username if obj.user else '-'
    get_username.short_description = 'Username'

    def get_manager_name(self, obj):
        return obj.manager.username if obj.manager else '-'
    get_manager_name.short_description = 'Manager'
