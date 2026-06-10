from django.db import models
from django.conf import settings
from apps.common.models import UUIDTimestampModel

class Notification(UUIDTimestampModel):
    """
    In-app database notification system.
    Stores messages targeted to individual users.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications',
        help_text="The target user receiving this notification."
    )
    message = models.TextField(
        help_text="The notification message details."
    )
    is_read = models.BooleanField(
        default=False,
        db_index=True,
        help_text="Designates whether the notification has been read by the user."
    )

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Notification for {self.user.email} - Read: {self.is_read}"
