from rest_framework import viewsets, views, response, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Performance, PerformanceGoal, Feedback
from .serializers import PerformanceSerializer, PerformanceGoalSerializer, FeedbackSerializer
from employees.models import Employee

# Existing Performance CRUD
class PerformanceViewSet(viewsets.ModelViewSet):
    queryset = Performance.objects.all()
    serializer_class = PerformanceSerializer
    permission_classes = [IsAuthenticated]

    # Optional: nested feedback retrieval
    @action(detail=True, methods=["get"], url_path="feedbacks")
    def get_feedbacks(self, request, pk=None):
        performance = self.get_object()
        feedbacks = performance.feedbacks.all()
        serializer = FeedbackSerializer(feedbacks, many=True)
        return Response(serializer.data)


# New: Performance Goals CRUD
class PerformanceGoalViewSet(viewsets.ModelViewSet):
    queryset = PerformanceGoal.objects.all()
    serializer_class = PerformanceGoalSerializer
    permission_classes = [IsAuthenticated]


# New: 360-degree Feedback CRUD
class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [IsAuthenticated]


# Dashboard summary
class DashboardReportsView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
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
