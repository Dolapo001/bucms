from rest_framework import serializers
from apps.notifications.models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    """
    Serializer mapping Notification records to JSON responses.
    """
    class Meta:
        model = Notification
        fields = ('id', 'message', 'is_read', 'created_at')
        read_only_fields = ('id', 'message', 'is_read', 'created_at')


class UnreadCountSerializer(serializers.Serializer):
    """
    Serializer to format unread notification count answers.
    """
    unread_count = serializers.IntegerField()
