from rest_framework import permissions

class IsAdminOrSelf(permissions.BasePermission):
    """
    Custom permission to allow only Admins or the User themselves to read/update the record.
    """
    def has_object_permission(self, request, view, obj):
        # Allow if user is ADMIN
        if request.user and request.user.is_authenticated and request.user.role == 'ADMIN':
            return True
            
        # Allow if user is retrieving/updating their own record
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.id == obj.id
        )
