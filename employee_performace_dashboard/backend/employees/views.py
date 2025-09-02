import os
import pandas as pd
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Employee, EmployeeImportHistory
from .serializers import EmployeeSerializer, EmployeeImportHistorySerializer


# --- Existing Employee CRUD ---
class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


# --- New endpoint for CSV/Excel import ---
class EmployeeImportView(APIView):
    parser_classes = [MultiPartParser]
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response(
                {"error": "No file uploaded"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Detect file type by extension
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

            # Validate required columns
            required_cols = ['email', 'first_name', 'last_name', 'designation', 'department', 'date_of_joining']
            for col in required_cols:
                if col not in df.columns:
                    return Response(
                        {"error": f"Missing required column: {col}"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            # Insert/Update employees
            for _, row in df.iterrows():
                Employee.objects.update_or_create(
                    email=row['email'],  # unique identifier
                    defaults={
                        'first_name': row['first_name'],
                        'last_name': row['last_name'],
                        'designation': row['designation'],
                        'department': row['department'],
                        'date_of_joining': row['date_of_joining'],
                        'created_by': request.user
                    }
                )

            # Save import history
            EmployeeImportHistory.objects.create(
                uploaded_by=request.user,
                file_name=file_obj.name
            )

            return Response({"status": "success"}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
