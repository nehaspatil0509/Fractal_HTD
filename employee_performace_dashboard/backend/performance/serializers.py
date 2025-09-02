from rest_framework import serializers
from .models import Performance, PerformanceGoal, Feedback

# Existing Performance serializer
class PerformanceSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source="employee.__str__", read_only=True)

    class Meta:
        model = Performance
        fields = "__all__"


# Serializer for Performance Goals
class PerformanceGoalSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source="employee.__str__", read_only=True)

    class Meta:
        model = PerformanceGoal
        fields = "__all__"


# Serializer for 360-degree Feedback
class FeedbackSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source="performance.employee.__str__", read_only=True)

    class Meta:
        model = Feedback
        fields = "__all__"
