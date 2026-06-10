from apps.common.permissions import IsAdminOrReadOnly

class IsProgramManagerOrReadOnly(IsAdminOrReadOnly):
    """
    Extends base IsAdminOrReadOnly.
    Permits members to read chapel events, while requiring Admin role for write operations.
    """
    pass
