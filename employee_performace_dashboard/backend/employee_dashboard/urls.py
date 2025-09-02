from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from employees.views import EmployeeViewSet, EmployeeImportView
from performance.views import PerformanceViewSet, DashboardReportsView
from attendance.views import AttendanceViewSet
from django.http import JsonResponse

def home(request):
    return JsonResponse({"message": "Welcome to Employee Dashboard API"})

router = DefaultRouter()
router.register(r'employees', EmployeeViewSet)
router.register(r'performance', PerformanceViewSet)
router.register(r'attendance', AttendanceViewSet)

urlpatterns = [
    path("admin/", admin.site.urls),

    # 👇 Put this BEFORE the router include
    path('api/employees/import/', EmployeeImportView.as_view(), name='employee-import'),

    path('api/', include(router.urls)),
    path('api/performance/reports/dashboard-reports/', DashboardReportsView.as_view(), name='dashboard-reports'),
    path('api/accounts/', include('accounts.urls')),
    path('', home),
]
