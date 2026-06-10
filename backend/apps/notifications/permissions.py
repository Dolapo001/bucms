from rest_framework import permissions

class IsNotificationOwner(permissions.BasePermission):
    """
    Assures a user can only interact with notifications that are assigned directly to them.
    """
    def has_object_permission(self, request, view, obj):
        return bool(
            request.user and
            request.user.is_authenticated and
            obj.user_id == request.user.id
        )
