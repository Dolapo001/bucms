from django.db import transaction
from apps.announcements.models import Announcement
from apps.notifications.models import Notification
from apps.users.models import CustomUser

class AnnouncementService:
    """
    Service layer encapsulating Announcement business workflows.
    """
    @staticmethod
    @transaction.atomic
    def publish_announcement(title, content, admin_user, is_pinned=False, expires_at=None):
        """
        Creates and publishes an announcement. If it's a pinned announcement,
        we trigger a system notification to all members database-wide.
        """
        announcement = Announcement.objects.create(
            title=title,
            content=content,
            created_by=admin_user,
            is_published=True,
            is_pinned=is_pinned,
            expires_at=expires_at
        )

        # Notify members of pinned announcements
        if is_pinned:
            members = CustomUser.objects.filter(role='MEMBER', is_active=True)
            notifications = [
                Notification(
                    user=member,
                    message=f"Important Announcement: {title}"
                ) for member in members
            ]
            Notification.objects.bulk_create(notifications)

        return announcement
