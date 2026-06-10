from apps.common.permissions import IsAdminUserRole

class IsAnalyticsViewer(IsAdminUserRole):
    """
    Extends base IsAdminUserRole.
    Restricts access strictly to administrative personnel.
    """
    pass
