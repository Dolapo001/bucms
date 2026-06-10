from rest_framework import serializers

class RecentActivitySerializer(serializers.Serializer):
    """
    Serializer representing recent administrative actions.
    """
    type = serializers.CharField()
    title = serializers.CharField()
    created_at = serializers.DateTimeField()
    details = serializers.CharField()


class AnalyticsSerializer(serializers.Serializer):
    """
    Main serializer for chapel aggregate metrics.
    """
    total_users = serializers.IntegerField()
    total_members = serializers.IntegerField()
    total_admins = serializers.IntegerField()
    total_announcements = serializers.IntegerField()
    total_sermons = serializers.IntegerField()
    total_events = serializers.IntegerField()
    recent_activities = RecentActivitySerializer(many=True)
