from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from employees.views import EmployeeViewSet, EmployeeImportView
from performance.views import PerformanceViewSet, PerformanceGoalViewSet, FeedbackViewSet, DashboardReportsView
from attendance.views import AttendanceViewSet
from django.http import JsonResponse


def home(request):
    return JsonResponse({"message": "Welcome to Employee Dashboard API"})


router = DefaultRouter()
router.register(r'employees', EmployeeViewSet, basename='employee')
router.register(r'performance', PerformanceViewSet, basename='performance')
router.register(r'performance-goals', PerformanceGoalViewSet, basename='performance-goal')
router.register(r'feedbacks', FeedbackViewSet, basename='feedback')
router.register(r'attendance', AttendanceViewSet, basename='attendance')


urlpatterns = [
    path("admin/", admin.site.urls),

    # 👇 keep import before router
    path('api/employees/import/', EmployeeImportView.as_view(), name='employee-import'),

    # Router APIs
    path('api/', include(router.urls)),

    # Dashboard
    path('api/performance/reports/dashboard-reports/', DashboardReportsView.as_view(), name='dashboard-reports'),

    # Accounts (register/login)
    path('api/accounts/', include('accounts.urls')),

    # Root endpoint
    path('', home),
]
