from rest_framework import viewsets, views, response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Performance, PerformanceGoal, Feedback
from .serializers import PerformanceSerializer, PerformanceGoalSerializer, FeedbackSerializer
from employees.models import Employee


# --- Performance CRUD ---
class PerformanceViewSet(viewsets.ModelViewSet):
    serializer_class = PerformanceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ["admin", "manager"]:
            return Performance.objects.all()
        # ✅ Employee sees only their own performance
        return Performance.objects.filter(employee__email=user.email)

    def perform_create(self, serializer):
        user = self.request.user
        if user.role not in ["admin", "manager"]:
            raise PermissionDenied("You are not allowed to create performance records.")
        serializer.save()

    def perform_update(self, serializer):
        user = self.request.user
        if user.role not in ["admin", "manager"]:
            raise PermissionDenied("You are not allowed to update performance records.")
        serializer.save()

    def perform_destroy(self, instance):
        user = self.request.user
        if user.role not in ["admin", "manager"]:
            raise PermissionDenied("You are not allowed to delete performance records.")
        instance.delete()

    # Optional: nested feedback retrieval
    @action(detail=True, methods=["get"], url_path="feedbacks")
    def get_feedbacks(self, request, pk=None):
        performance = self.get_object()
        feedbacks = performance.feedbacks.all()
        serializer = FeedbackSerializer(feedbacks, many=True)
        return Response(serializer.data)


# --- Performance Goals CRUD ---
class PerformanceGoalViewSet(viewsets.ModelViewSet):
    serializer_class = PerformanceGoalSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ["admin", "manager"]:
            return PerformanceGoal.objects.all()
        return PerformanceGoal.objects.filter(employee__email=user.email)

    def perform_create(self, serializer):
        user = self.request.user
        if user.role not in ["admin", "manager"]:
            raise PermissionDenied("You are not allowed to create performance goals.")
        serializer.save()

    def perform_update(self, serializer):
        user = self.request.user
        if user.role not in ["admin", "manager"]:
            raise PermissionDenied("You are not allowed to update performance goals.")
        serializer.save()

    def perform_destroy(self, instance):
        user = self.request.user
        if user.role not in ["admin", "manager"]:
            raise PermissionDenied("You are not allowed to delete performance goals.")
        instance.delete()


# --- 360-degree Feedback CRUD ---
class FeedbackViewSet(viewsets.ModelViewSet):
    serializer_class = FeedbackSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ["admin", "manager"]:
            return Feedback.objects.all()
        # ✅ Employee sees feedback related to their own performance
        return Feedback.objects.filter(performance__employee__email=user.email)


# --- Dashboard summary ---
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
