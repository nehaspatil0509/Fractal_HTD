from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User   # import your custom User model if you have one

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = (
        "username",
        "email",
        "first_name",
        "last_name",
        "is_staff",
        "is_superuser",
    )
    search_fields = ("username", "email")
    list_filter = ("is_staff", "is_superuser", "is_active")
