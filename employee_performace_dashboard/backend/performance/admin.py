from django.contrib import admin
from .models import Performance

@admin.register(Performance)
class PerformanceAdmin(admin.ModelAdmin):
    list_display = ('employee', 'completed_tasks', 'pending_tasks', 'rating', 'last_updated')
    search_fields = ('employee__first_name', 'employee__last_name')

