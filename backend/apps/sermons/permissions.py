from apps.common.permissions import IsAdminOrReadOnly

class IsSermonManagerOrReadOnly(IsAdminOrReadOnly):
    """
    Extends base IsAdminOrReadOnly.
    Permits members to listen and download sermons, while requiring Admin role for write operations.
    """
    pass
