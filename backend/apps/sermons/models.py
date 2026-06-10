from django.db import models
from django.conf import settings
from apps.common.models import UUIDTimestampModel

class Sermon(UUIDTimestampModel):
    """
    Model representing uploaded chapel sermons.
    Supports audio streaming file, PDF transcript attachment, video links,
    thumbnails, and indexes for speakers.
    """
    title = models.CharField(
        max_length=255,
        help_text="The title of the sermon."
    )
    speaker = models.CharField(
        max_length=255,
        db_index=True,
        help_text="The name of the guest or local minister preaching."
    )
    description = models.TextField(
        help_text="Brief outline or summary of the sermon scripture reference and topics."
    )
    audio_file = models.FileField(
        upload_to='sermons/audio/',
        null=True,
        blank=True,
        help_text="Sermon voice/mp3 audio recording."
    )
    document = models.FileField(
        upload_to='sermons/docs/',
        null=True,
        blank=True,
        help_text="Sermon manuscript/slides/study note (PDF recommended)."
    )
    video_url = models.URLField(
        null=True,
        blank=True,
        help_text="Optional YouTube or other video recording URL."
    )
    thumbnail = models.ImageField(
        upload_to='sermons/thumbnails/',
        null=True,
        blank=True,
        help_text="Optional graphical thumbnail for the sermon layout."
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='uploaded_sermons',
        help_text="The admin account that created this sermon entry."
    )

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} by {self.speaker}"
