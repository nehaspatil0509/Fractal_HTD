from rest_framework import serializers
from .models import Employee, EmployeeImportHistory

# Existing serializer
class EmployeeSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='created_by.username')

    class Meta:
        model = Employee
        fields = [
            'id', 'first_name', 'last_name', 'email',
            'designation', 'department', 'date_of_joining',
            'created_by'
        ]

# New serializer for import history
class EmployeeImportHistorySerializer(serializers.ModelSerializer):
    uploaded_by = serializers.ReadOnlyField(source='uploaded_by.username')

    class Meta:
        model = EmployeeImportHistory
        fields = ['id', 'file_name', 'uploaded_by', 'uploaded_at']
