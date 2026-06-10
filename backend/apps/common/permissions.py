from rest_framework import permissions

class IsAdminUserRole(permissions.BasePermission):
    """
    Allows access only to users with the 'ADMIN' role.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == 'ADMIN'
        )


class IsMemberUserRole(permissions.BasePermission):
    """
    Allows access only to users with the 'MEMBER' role.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == 'MEMBER'
        )


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Allows read-only access to authenticated members, and write access only to admins.
    """
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
            
        # Safe methods (GET, HEAD, OPTIONS) are allowed for any authenticated user
        if request.method in permissions.SAFE_METHODS:
            return True
            
        # Write methods are restricted to ADMIN role
        return request.user.role == 'ADMIN'
