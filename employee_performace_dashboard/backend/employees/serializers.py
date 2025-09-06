from rest_framework import serializers
from .models import Employee, EmployeeImportHistory

# Employee Serializer
class EmployeeSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')      # employee's username
    manager_name = serializers.ReadOnlyField(source='manager.username')  # manager's username

    class Meta:
        model = Employee
        fields = [
            'id',
            'username',
            'manager',
            'manager_name',
            'first_name',
            'last_name',
            'email',
            'designation',
            'department',
            'date_of_joining'
        ]

# Import History Serializer
class EmployeeImportHistorySerializer(serializers.ModelSerializer):
    uploaded_by = serializers.ReadOnlyField(source='uploaded_by.username')

    class Meta:
        model = EmployeeImportHistory
        fields = ['id', 'file_name', 'uploaded_by', 'uploaded_at']
