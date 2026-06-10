from apps.notifications.models import Notification
from apps.users.models import CustomUser

class NotificationService:
    """
    Service layer containing operations for triggering notification items.
    """
    @staticmethod
    def create_notification(user, message):
        """
        Creates an individual database notification.
        """
        return Notification.objects.create(
            user=user,
            message=message
        )

    @staticmethod
    def broadcast_notification(message):
        """
        Broadcasts a message database-wide to all active members.
        """
        members = CustomUser.objects.filter(role='MEMBER', is_active=True)
        notifications = [
            Notification(user=member, message=message)
            for member in members
        ]
        Notification.objects.bulk_create(notifications)
        return len(notifications)
