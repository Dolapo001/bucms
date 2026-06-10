from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from apps.users.models import CustomUser

class CustomUserAdmin(BaseUserAdmin):
    """
    Admin configuration for CustomUser model.
    Organizes user profile sections, search options, and display grids.
    """
    model = CustomUser
    list_display = ('email', 'first_name', 'last_name', 'role', 'matric_no', 'is_active', 'is_staff')
    list_filter = ('role', 'is_active', 'is_staff', 'is_superuser')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'matric_no', 'profile_picture')}),
        ('Permissions', {'fields': ('role', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'created_at', 'updated_at')}),
    )
    readonly_fields = ('created_at', 'updated_at')
    search_fields = ('email', 'first_name', 'last_name', 'matric_no')
    ordering = ('-created_at',)

admin.site.register(CustomUser, CustomUserAdmin)
