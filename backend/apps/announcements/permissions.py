from apps.common.permissions import IsAdminOrReadOnly

class IsAnnouncementManagerOrReadOnly(IsAdminOrReadOnly):
    """
    Extends base IsAdminOrReadOnly.
    Permits members to read published, unexpired notices, while requiring Admin role for write operations.
    """
    pass
