from rest_framework import viewsets, filters, permissions
from django.utils import timezone
from django.db.models import Q
from apps.announcements.models import Announcement
from apps.announcements.serializers import AnnouncementSerializer
from apps.announcements.permissions import IsAnnouncementManagerOrReadOnly

class AnnouncementViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing announcements.
    - Admins: Complete CRUD access to all records.
    - Members: Read-only access to published and unexpired records.
    """
    serializer_class = AnnouncementSerializer
    permission_classes = [permissions.IsAuthenticated, IsAnnouncementManagerOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'content']
    ordering_fields = ['created_at', 'is_pinned']
    ordering = ['-is_pinned', '-created_at']

    def get_queryset(self):
        user = self.request.user
        now = timezone.now()

        # Admins can see all announcements
        if user.is_authenticated and user.role == 'ADMIN':
            return Announcement.objects.all()

        # Members can only see published and unexpired announcements
        return Announcement.objects.filter(
            is_published=True
        ).filter(
            Q(expires_at__isnull=True) | Q(expires_at__gt=now)
        )

    def perform_create(self, serializer):
        # Automatically assign current admin as creator
        serializer.save(created_by=self.request.user)
