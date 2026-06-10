import uuid
from django.db import models

class UUIDTimestampModel(models.Model):
    """
    An abstract base class model that provides self-updating
    'created_at' and 'updated_at' fields along with a UUID primary key.
    """
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        db_index=True,
        help_text="The date and time this record was created."
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="The date and time this record was last updated."
    )

    class Meta:
        abstract = True
        ordering = ['-created_at']
