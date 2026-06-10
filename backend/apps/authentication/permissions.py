from rest_framework import permissions

class AllowAnyAuth(permissions.BasePermission):
    """
    Allow any guest or authenticated user to hit the auth endpoints.
    """
    def has_permission(self, request, view):
        return True
