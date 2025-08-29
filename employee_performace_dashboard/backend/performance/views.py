# performance/views.py
from rest_framework import viewsets, views, response
from rest_framework.permissions import IsAuthenticated
from .models import Performance
from .serializers import PerformanceSerializer
from employees.models import Employee   # <-- import Employee

class PerformanceViewSet(viewsets.ModelViewSet):
    queryset = Performance.objects.all()
    serializer_class = PerformanceSerializer
    permission_classes = [IsAuthenticated]

class DashboardReportsView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # ✅ FIXED: count directly from Employee model
        total_employees = Employee.objects.count()
        performances = Performance.objects.all()
        
        avg_tasks_completed = 0
        avg_employee_rating = 0

        if performances.exists():
            avg_tasks_completed = sum(p.completed_tasks for p in performances) / performances.count()
            avg_employee_rating = sum(p.rating for p in performances) / performances.count()

        data = {
            "total_employees": total_employees,
            "avg_tasks_completed": round(avg_tasks_completed, 2),
            "avg_employee_rating": round(avg_employee_rating, 2),
        }
        return response.Response(data)
