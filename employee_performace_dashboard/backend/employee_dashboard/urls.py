from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from rest_framework.routers import DefaultRouter
from performance.views import PerformanceViewSet, DashboardReportsView
from attendance.views import AttendanceViewSet
from employees.views import EmployeeViewSet

def home(request):
    return JsonResponse({"message": "Welcome to Employee Dashboard API"})

# DRF routers for ViewSets
router = DefaultRouter()
router.register(r'employees', EmployeeViewSet)
router.register(r'performance', PerformanceViewSet)
router.register(r'attendance', AttendanceViewSet)

urlpatterns = [
    path("admin/", admin.site.urls),
    path('api/', include(router.urls)),              # Employee, Performance, Attendance APIs
    path('api/performance/reports/dashboard-reports/', DashboardReportsView.as_view(), name='dashboard-reports'),
    path('api/accounts/', include('accounts.urls')), # Accounts app URLs
    path('', home),                                  # Home endpoint
]
