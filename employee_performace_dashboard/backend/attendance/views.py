from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from .models import Attendance
from .serializers import AttendanceSerializer


class AttendanceViewSet(viewsets.ModelViewSet):
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # ✅ Admin/Manager can view all attendance
        if user.role in ["admin", "manager"]:
            return Attendance.objects.all()
        # ✅ Employee sees only their own attendance
        return Attendance.objects.filter(user=user)

    def perform_create(self, serializer):
        user = self.request.user
        # ✅ Employee can only mark their own attendance
        serializer.save(user=user)

    def perform_update(self, serializer):
        user = self.request.user
        if user.role not in ["admin", "manager"]:
            raise PermissionDenied("You are not allowed to update attendance records.")
        serializer.save()

    def perform_destroy(self, instance):
        user = self.request.user
        if user.role not in ["admin", "manager"]:
            raise PermissionDenied("You are not allowed to delete attendance records.")
        instance.delete()
