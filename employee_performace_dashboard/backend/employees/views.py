import os
import pandas as pd
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied

from .models import Employee, EmployeeImportHistory
from .serializers import EmployeeSerializer, EmployeeImportHistorySerializer
from accounts.models import User


# --- Employee CRUD ---
class EmployeeViewSet(viewsets.ModelViewSet):
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if getattr(user, "role", None) in ["manager", "admin"]:
            return Employee.objects.all()
        return Employee.objects.filter(email=user.email)

    def perform_create(self, serializer):
        user = self.request.user
        if getattr(user, "role", None) not in ["admin", "manager"]:
            raise PermissionDenied("You are not allowed to create employees.")

        email = serializer.validated_data.get('email')
        try:
            linked_user = User.objects.get(email=email)
        except User.DoesNotExist:
            linked_user = None

        manager_user = user if getattr(user, "role", None) == "manager" else None
        serializer.save(user=linked_user, manager=manager_user)

    def perform_update(self, serializer):
        user = self.request.user
        if getattr(user, "role", None) in ["admin", "manager"]:
            serializer.save()
        else:
            employee = self.get_object()
            if employee.email != user.email:
                raise PermissionDenied("You can only update your own profile.")
            serializer.save()

    def perform_destroy(self, instance):
        user = self.request.user
        if getattr(user, "role", None) not in ["admin", "manager"]:
            raise PermissionDenied("You are not allowed to delete employees.")
        instance.delete()


# --- CSV/Excel Import ---
class EmployeeImportView(APIView):
    parser_classes = [MultiPartParser]
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            ext = os.path.splitext(file_obj.name)[1].lower()
            if ext == ".csv":
                df = pd.read_csv(file_obj)
            elif ext in [".xls", ".xlsx"]:
                df = pd.read_excel(file_obj)
            else:
                return Response(
                    {"error": "Unsupported file format. Please upload CSV/XLS/XLSX"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            required_cols = ['email', 'first_name', 'last_name', 'designation', 'department', 'date_of_joining']
            for col in required_cols:
                if col not in df.columns:
                    return Response({"error": f"Missing required column: {col}"}, status=status.HTTP_400_BAD_REQUEST)

            for _, row in df.iterrows():
                try:
                    linked_user = User.objects.get(email=row['email'])
                except User.DoesNotExist:
                    linked_user = None

                manager_user = request.user if getattr(request.user, "role", None) == "manager" else None

                Employee.objects.update_or_create(
                    email=row['email'],
                    defaults={
                        'first_name': row['first_name'],
                        'last_name': row['last_name'],
                        'designation': row['designation'],
                        'department': row['department'],
                        'date_of_joining': row['date_of_joining'],
                        'user': linked_user,
                        'manager': manager_user
                    }
                )

            EmployeeImportHistory.objects.create(uploaded_by=request.user, file_name=file_obj.name)
            return Response({"status": "success"}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
