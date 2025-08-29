from rest_framework import serializers
from .models import Employee

class EmployeeSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='created_by.username')  # show username of creator

    class Meta:
        model = Employee
        fields = [
            'id', 'first_name', 'last_name', 'email',
            'designation', 'department', 'date_of_joining',
            'created_by'
        ]
