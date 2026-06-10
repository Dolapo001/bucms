from django.db import models
from django.conf import settings
from apps.common.models import UUIDTimestampModel

class Program(UUIDTimestampModel):
    """
    Model representing chapel programs and events within Bowen University.
    Holds metadata regarding event dates, locations, banners, and descriptions.
    """
    title = models.CharField(
        max_length=255,
        help_text="The title of the chapel program/event."
    )
    description = models.TextField(
        help_text="Detailed description of the chapel program."
    )
    venue = models.CharField(
        max_length=255,
        help_text="The physical or online venue of the event."
    )
    event_date = models.DateTimeField(
        db_index=True,
        help_text="The scheduled date and time for the program."
    )
    banner_image = models.ImageField(
        upload_to='banners/',
        null=True,
        blank=True,
        help_text="Optional promotion banner/flyer image."
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_programs',
        help_text="The admin account that created this event entry."
    )

    class Meta:
        ordering = ['-event_date']

    def __str__(self):
        return f"{self.title} - {self.event_date.strftime('%Y-%m-%d %H:%M')}"
