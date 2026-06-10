from django.db import models
from django.conf import settings
from apps.common.models import UUIDTimestampModel

class Announcement(UUIDTimestampModel):
    """
    Model representing chapel announcements published to members.
    Admins control pinning, publishing, and scheduled expiration of notices.
    """
    title = models.CharField(
        max_length=255,
        help_text="The title of the chapel announcement."
    )
    content = models.TextField(
        help_text="The markdown or text content of the announcement."
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='announcements',
        help_text="The admin user who created this announcement."
    )
    is_published = models.BooleanField(
        default=True,
        db_index=True,
        help_text="Determines if the announcement is visible to member feeds."
    )
    is_pinned = models.BooleanField(
        default=False,
        db_index=True,
        help_text="If true, this announcement will stay at the top of the feed."
    )
    expires_at = models.DateTimeField(
        null=True,
        blank=True,
        db_index=True,
        help_text="Optional expiration date. After this datetime, the announcement is automatically hidden from members."
    )

    class Meta:
        ordering = ['-is_pinned', '-created_at']

    def __str__(self):
        return self.title
