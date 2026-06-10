from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.notifications.models import Notification
from apps.notifications.serializers import NotificationSerializer, UnreadCountSerializer
from apps.notifications.permissions import IsNotificationOwner

class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only ViewSet for managing in-app notifications.
    Supports marking as read, marking all as read, and obtaining unread counts.
    """
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated, IsNotificationOwner]

    def get_queryset(self):
        # Users can only view their own notifications
        return Notification.objects.filter(user=self.request.user)

    @action(detail=True, methods=['post'], url_path='mark-read')
    def mark_read(self, request, pk=None):
        """
        Marks a specific notification as read.
        POST /api/v1/notifications/{id}/mark-read/
        """
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        
        serializer = self.get_serializer(notification)
        return Response({
            "message": "Notification marked as read.",
            "notification": serializer.data
        }, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='mark-all-read')
    def mark_all_read(self, request):
        """
        Marks all active notifications for the current user as read.
        POST /api/v1/notifications/mark-all-read/
        """
        unread_notifications = self.get_queryset().filter(is_read=False)
        count = unread_notifications.update(is_read=True)
        
        return Response({
            "message": f"Successfully marked {count} notifications as read."
        }, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='unread-count')
    def unread_count(self, request):
        """
        Returns the absolute number of unread notifications for the user.
        GET /api/v1/notifications/unread-count/
        """
        count = self.get_queryset().filter(is_read=False).count()
        serializer = UnreadCountSerializer({"unread_count": count})
        return Response(serializer.data, status=status.HTTP_200_OK)
