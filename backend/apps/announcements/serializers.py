from rest_framework import serializers
from django.utils import timezone
from apps.announcements.models import Announcement
from apps.users.serializers import UserSerializer

class AnnouncementSerializer(serializers.ModelSerializer):
    """
    Serializer to map Announcement models to REST responses.
    Includes custom validation for expiration dates and creator details.
    """
    created_by_detail = UserSerializer(source='created_by', read_only=True)

    class Meta:
        model = Announcement
        fields = (
            'id',
            'title',
            'content',
            'created_by',
            'created_by_detail',
            'is_published',
            'is_pinned',
            'expires_at',
            'created_at',
            'updated_at'
        )
        read_only_fields = ('id', 'created_by', 'created_at', 'updated_at')

    def validate_expires_at(self, value):
        if value and value <= timezone.now():
            raise serializers.ValidationError("The announcement expiry date must be set in the future.")
        return value
